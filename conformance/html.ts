/**
 * A small HTML reader: start tags with their attributes and lines, <style> and
 * <script> contents, and comments skipped. Text is never judged: the words
 * inside elements, and everything inside <pre> and <code> including any tags
 * there (highlighting spans, a pasted sample). A page may name a class or a
 * colour in its words; only markup is checked.
 *
 * Also used on HTML held in script strings, where PLACEHOLDER marks an
 * interpolation.
 */
import { checkClassList, checkDeclaration, checkDeclarationList, checkElement, type Ctx } from './checks.js';
import { checkCss } from './css.js';

export interface Tag {
  name: string;
  attrs: Record<string, string | undefined>;
  attrLines: Record<string, number>;
  line: number;
  /** The nearest open <details> around this tag. */
  details: Tag | null;
}

export interface HtmlParts {
  tags: Tag[];
  styles: Array<{ text: string; line: number }>;
  scripts: Array<{ text: string; line: number; type: string | undefined }>;
}

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title']);
/** Everything inside these is text, even tags: a code sample or highlighted code is never markup (the <pre> itself is). */
const TEXT_ONLY = new Set(['pre', 'code']);

export function readHtml(text: string, lineBase = 0): HtmlParts {
  const parts: HtmlParts = { tags: [], styles: [], scripts: [] };
  let line = 1 + lineBase;
  let i = 0;
  const n = text.length;
  const advance = (to: number) => {
    for (let k = i; k < to && k < n; k++) if (text[k] === '\n') line++;
    i = to;
  };
  const stack: Tag[] = [];

  while (i < n) {
    const lt = text.indexOf('<', i);
    if (lt === -1) break;
    advance(lt);
    if (text.startsWith('<!--', i)) {
      const end = text.indexOf('-->', i + 4);
      advance(end === -1 ? n : end + 3);
      continue;
    }
    if (text[i + 1] === '!' || text[i + 1] === '?') {
      const end = text.indexOf('>', i);
      advance(end === -1 ? n : end + 1);
      continue;
    }
    if (text[i + 1] === '/') {
      const m = /^<\/([a-zA-Z][\w:-]*)\s*>?/.exec(text.slice(i, i + 100));
      if (m) {
        const name = m[1]!.toLowerCase();
        const at = stack.map((t) => t.name).lastIndexOf(name);
        if (at !== -1) stack.length = at;
        advance(i + m[0].length);
      } else advance(i + 1);
      continue;
    }
    const nameMatch = /^<([a-zA-Z][\w:-]*)/.exec(text.slice(i, i + 100));
    if (!nameMatch) {
      advance(i + 1);
      continue;
    }
    const tag: Tag = { name: nameMatch[1]!.toLowerCase(), attrs: {}, attrLines: {}, line, details: null };
    advance(i + nameMatch[0].length);
    // Attributes.
    let selfClosing = false;
    while (i < n) {
      const ws = /^[\s]*/.exec(text.slice(i, i + 200))![0];
      advance(i + ws.length);
      if (i >= n) break;
      if (text[i] === '>') {
        advance(i + 1);
        break;
      }
      if (text.startsWith('/>', i)) {
        selfClosing = true;
        advance(i + 2);
        break;
      }
      const am = /^[^\s"'>\/=]+/.exec(text.slice(i, i + 200));
      if (!am) {
        advance(i + 1);
        continue;
      }
      const attrName = am[0].toLowerCase();
      const attrLine = line;
      advance(i + am[0].length);
      let value: string | undefined;
      const eq = /^\s*=\s*/.exec(text.slice(i, i + 50));
      if (eq) {
        advance(i + eq[0].length);
        const q = text[i];
        if (q === '"' || q === "'") {
          const close = text.indexOf(q, i + 1);
          const end = close === -1 ? n : close;
          value = text.slice(i + 1, end);
          advance(Math.min(end + 1, n));
        } else {
          const vm = /^[^\s>]*/.exec(text.slice(i))![0];
          value = vm;
          advance(i + vm.length);
        }
      }
      tag.attrs[attrName] = value;
      tag.attrLines[attrName] = attrLine;
    }
    tag.details = [...stack].reverse().find((t) => t.name === 'details') ?? null;
    parts.tags.push(tag);
    if (RAW_TEXT.has(tag.name) && !selfClosing) {
      const close = text.toLowerCase().indexOf(`</${tag.name}`, i);
      const end = close === -1 ? n : close;
      const contentLine = line;
      const content = text.slice(i, end);
      if (tag.name === 'style') parts.styles.push({ text: content, line: contentLine - 1 });
      if (tag.name === 'script') parts.scripts.push({ text: content, line: contentLine - 1, type: tag.attrs.type });
      advance(end);
      continue;
    }
    if (TEXT_ONLY.has(tag.name) && !selfClosing) {
      const close = text.toLowerCase().indexOf(`</${tag.name}`, i);
      advance(close === -1 ? n : close);
      continue;
    }
    if (!VOID.has(tag.name) && !selfClosing) stack.push(tag);
  }
  return parts;
}

const COLOUR_ATTRS = new Set(['fill', 'stroke', 'color', 'bgcolor', 'stop-color', 'flood-color', 'lighting-color']);

/**
 * Check HTML. `scanScript` is passed in by the caller so this module does not
 * depend on the script scanner (which in turn uses this one for HTML strings).
 */
export function checkHtml(
  ctx: Ctx,
  text: string,
  lineBase: number,
  scanScript: ((ctx: Ctx, code: string, lineBase: number) => void) | null,
): void {
  const parts = readHtml(text, lineBase);
  const reported = new Set<Tag>();
  for (const tag of parts.tags) {
    const cls = tag.attrs.class;
    if (cls !== undefined) checkClassList(ctx, cls, tag.attrLines.class ?? tag.line);
    const style = tag.attrs.style;
    if (style !== undefined) checkDeclarationList(ctx, style, tag.attrLines.style ?? tag.line);
    for (const [name, value] of Object.entries(tag.attrs)) {
      if (value === undefined) continue;
      if (COLOUR_ATTRS.has(name) && !/^(none|currentcolor|transparent|inherit)$/i.test(value.trim())) {
        checkDeclaration(ctx, 'color', value, tag.attrLines[name] ?? tag.line);
      }
    }
    if (tag.name === 'meta' && /theme-color|tilecolor/i.test(tag.attrs.name ?? '') && tag.attrs.content) {
      checkDeclaration(ctx, 'color', tag.attrs.content, tag.attrLines.content ?? tag.line);
    }
    const parentReported = tag.name === 'summary' && tag.details !== null && reported.has(tag.details);
    const classes = (cls ?? '').split(/\s+/).filter(Boolean);
    if (checkElement(ctx, { tag: tag.name, classes, attrs: tag.attrs, parentReported }, tag.line, false)) reported.add(tag);
  }
  for (const s of parts.styles) checkCss(ctx, s.text, s.line);
  if (scanScript) {
    for (const s of parts.scripts) {
      const type = (s.type ?? '').toLowerCase();
      if (!type || /(java|ecma)script|module|babel|jsx/.test(type)) scanScript(ctx, s.text, s.line);
    }
  }
}
