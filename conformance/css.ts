/**
 * A small CSS reader: enough structure to find every at-rule, selector and
 * declaration with its line, including nested rules. No dependency; it does
 * not validate CSS, it only walks it.
 */
import { checkDeclaration, checkQuery, checkSelector, checkClass, checkPropertyRef, clip, type Ctx } from './checks.js';
import { blankCssComments, skipString } from './system.js';

interface Scope {
  fontFace: boolean;
  keyframes: boolean;
  /** Inside `@media (forced-colors: active)`, where the system colours are the right values. */
  forcedColors: boolean;
  /** Inside a media block that asks about hover (`(hover: hover)`, `(hover: none)`, `any-hover`), where a :hover rule is meant. */
  hover?: boolean;
}

export interface CssVisitor {
  atRule(name: string, prelude: string, line: number, scope: Scope): void;
  rule(selector: string, line: number, scope: Scope): void;
  declaration(prop: string, value: string, line: number, scope: Scope): void;
}

/** A media query that asks about hover: a :hover rule inside it is meant for the devices it names. */
const HOVER_QUERY = /\(\s*(any-)?hover\s*:\s*(hover|none)\s*\)/i;

/** Whether a selector turns on with the pointer over it: `:hover` anywhere but inside `:not(…)`. */
export function hasHover(selector: string): boolean {
  let rest = selector;
  for (let at = rest.search(/:not\(/i); at >= 0; at = rest.search(/:not\(/i)) {
    let depth = 0;
    let end = at + 4;
    for (; end < rest.length; end++) {
      if (rest[end] === '(') depth++;
      else if (rest[end] === ')' && --depth === 0) break;
    }
    rest = rest.slice(0, at) + rest.slice(end + 1);
  }
  return /:hover\b/i.test(rest);
}

export function walkCss(source: string, visitor: CssVisitor, lineBase = 0): void {
  const text = blankCssComments(source);
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') starts.push(i + 1);
  const lineAt = (pos: number) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid]! <= pos) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1 + lineBase;
  };

  let i = 0;
  const n = text.length;

  /** Advance to the next top-level character in `stops`, skipping strings and bracketed runs. */
  const scanTo = (stops: string): number => {
    let depth = 0;
    while (i < n) {
      const c = text[i]!;
      if (c === '"' || c === "'") {
        i = skipString(text, i);
        continue;
      }
      if (c === '(' || c === '[') depth++;
      else if ((c === ')' || c === ']') && depth > 0) depth--;
      else if (depth === 0 && stops.includes(c)) return i;
      i++;
    }
    return n;
  };

  const block = (scope: Scope): void => {
    while (i < n) {
      while (i < n && /[\s;]/.test(text[i]!)) i++;
      if (i >= n) return;
      if (text[i] === '}') {
        i++;
        return;
      }
      const start = i;
      if (text[i] === '@') {
        const name = (/^@([\w-]+)/.exec(text.slice(i, i + 80))?.[1] ?? '').toLowerCase();
        i += 1 + name.length;
        const preludeStart = i;
        const end = scanTo('{;}');
        visitor.atRule(name, text.slice(preludeStart, end).trim(), lineAt(start), scope);
        if (text[end] === '{') {
          i = end + 1;
          const forced = scope.forcedColors || (name === 'media' && /forced-colors\s*:\s*active/i.test(text.slice(preludeStart, end)));
          const hover = scope.hover || (name === 'media' && HOVER_QUERY.test(text.slice(preludeStart, end)));
          block({ fontFace: name === 'font-face', keyframes: /keyframes$/.test(name), forcedColors: forced, hover });
        } else if (text[end] === ';') i = end + 1;
        continue;
      }
      const end = scanTo('{;}');
      const segment = text.slice(start, end);
      if (text[end] === '{') {
        i = end + 1;
        if (!scope.keyframes) visitor.rule(segment.trim(), lineAt(start), scope);
        block({ fontFace: scope.fontFace, keyframes: false, forcedColors: scope.forcedColors, hover: scope.hover });
      } else {
        if (text[end] === ';') i = end + 1;
        const colon = segment.indexOf(':');
        if (colon > 0) visitor.declaration(segment.slice(0, colon).trim(), segment.slice(colon + 1).trim(), lineAt(start), scope);
      }
    }
  };

  while (i < n) block({ fontFace: false, keyframes: false, forcedColors: false });
}

/** Check a stylesheet written by the project. */
export function checkCss(ctx: Ctx, source: string, lineBase = 0): void {
  walkCss(
    source,
    {
      atRule(name, prelude, line) {
        if (name === 'media') checkQuery(ctx, 'media', prelude, line);
        else if (name === 'container') checkQuery(ctx, 'container', prelude, line);
        else if (name === 'import' && /\(\s*(min-|max-)?(width|height)/i.test(prelude)) checkQuery(ctx, 'media', prelude, line);
        else if (name === 'font-face') {
          ctx.out.add({
            rule: 'raw-value', file: ctx.file, line, text: '@font-face', kind: 'font-family',
            message: 'The project defines its own font face.',
            hint: 'Fonts come from the design system font packages, linked the way the Showroom links them; type comes from the typography presets.',
          });
        } else if (name === 'apply') {
          for (const token of prelude.split(/\s+/)) if (token.includes('[')) checkClass(ctx, token, line);
        } else if (name === 'property') {
          if (/^--smbk-/.test(prelude)) checkPropertyRef(ctx, prelude.trim(), line);
        }
      },
      rule(selector, line, scope) {
        checkSelector(ctx, selector, line, true);
        if (!scope.hover && hasHover(selector)) {
          ctx.out.add({
            rule: 'sticky-hover', file: ctx.file, line, text: clip(selector.replace(/\s+/g, ' ')),
            message: 'A mouse-over look outside @media (hover: hover): a tap on a phone leaves it on.',
            hint: 'Move the rule inside @media (hover: hover), splitting off any other state it shares a selector with.',
          });
        }
      },
      declaration(prop, value, line, scope) {
        if (scope.fontFace) return;
        checkDeclaration(ctx, prop, value, line, { forcedColors: scope.forcedColors });
      },
    },
    lineBase,
  );
}

/** Does this text look like a stylesheet (rules with declarations) rather than prose? */
export function looksLikeStylesheet(text: string): boolean {
  return /(^|[\s}])(@media|@container|@keyframes|[.#:\w\[\]*>&-][^{};]*)\{[^{}]*\b[a-z-]+\s*:[^{}]*\}/i.test(text);
}
