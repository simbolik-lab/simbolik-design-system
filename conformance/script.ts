/**
 * Scripts: JS, MJS, TS and TSX, read with the TypeScript parser (already a
 * dependency of this folder), so JSX, template literals and comments are
 * understood rather than guessed.
 *
 * Two passes. The first handles every place whose meaning is known: className
 * expressions, style objects, classList calls, selector strings, canvas and
 * style assignments, matchMedia, and elements that look like components. The
 * second looks at every string it did not already handle, for HTML fragments,
 * stylesheets, declaration lists, custom property names and raw colours.
 *
 * Words on the page are never judged: JSX text, strings that are children of a
 * JSX element, and everything inside <pre>, <code> and the code block
 * component. A page may name a class or a colour in its words.
 */
import ts from 'typescript';
import {
  checkClass,
  checkClassList,
  checkDeclaration,
  checkDeclarationList,
  checkElement,
  checkPropertyRefsIn,
  checkQuery,
  checkSelector,
  selectorClasses,
  type Ctx,
} from './checks.js';
import { checkCss, looksLikeStylesheet } from './css.js';
import { checkHtml } from './html.js';
import { PLACEHOLDER } from './values.js';

interface Piece {
  text: string;
  line: number;
}

/** React adds px to a bare number for every property not in this list. */
const UNITLESS = new Set(
  (
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup ' +
    'columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan ' +
    'gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans ' +
    'scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit ' +
    'strokeOpacity strokeWidth'
  ).split(' '),
);

const CANVAS_COLOUR = new Set(['fillStyle', 'strokeStyle', 'shadowColor']);
/** The variant helper's class makers on a manifest: each returns a class built from its arguments. */
const MANIFEST_METHODS = new Set(['part', 'modifier', 'flag']);
/** A design system manifest module, wherever the project reaches it from: components/<name>/<name>.manifest. */
const MANIFEST_MODULE = /(?:^|\/)components\/([a-z0-9-]+)\/\1\.manifest(?:\.[cm]?[jt]s)?$/;
const CLASSLIST_METHODS = new Set(['add', 'remove', 'toggle', 'replace', 'contains']);
const SELECTOR_METHODS = new Set(['querySelector', 'querySelectorAll', 'closest', 'matches', 'webkitMatchesSelector']);
const LOOK_ALIKE_TAGS = new Set(['button', 'input', 'select', 'textarea', 'dialog', 'details', 'summary', 'table', 'progress']);
const COLOUR_JSX_ATTRS = new Set(['fill', 'stroke', 'color', 'stopColor', 'floodColor', 'lightingColor', 'stop-color', 'flood-color']);

/** Common CSS properties, to tell a declaration list in a string from prose with a colon in it. */
const CSS_PROPERTIES = new Set(
  (
    'color background background-color background-image border border-color border-radius border-width border-top border-bottom ' +
    'border-left border-right margin margin-top margin-bottom margin-left margin-right padding padding-top padding-bottom ' +
    'padding-left padding-right width height min-width max-width min-height max-height top left right bottom inset display ' +
    'position font font-family font-size font-weight line-height letter-spacing text-align z-index opacity transform ' +
    'transition animation box-shadow gap outline fill stroke flex grid-template-columns overflow cursor visibility'
  ).split(' '),
);

const kebab = (name: string) =>
  name.startsWith('--') ? name : name.replace(/^(Webkit|Moz|ms)(?=[A-Z])/, (m) => `-${m.toLowerCase()}`).replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export function scanScript(ctx: Ctx, code: string, lineBase = 0, fileName = ctx.file): void {
  const kind = /\.tsx$/i.test(fileName) ? ts.ScriptKind.TSX : /\.jsx$/i.test(fileName) ? ts.ScriptKind.JSX : /\.[mc]?ts$/i.test(fileName) ? ts.ScriptKind.TS : ts.ScriptKind.JSX;
  const sf = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true, kind);
  const lineOf = (node: ts.Node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1 + lineBase;
  const inTsx = kind === ts.ScriptKind.TSX || kind === ts.ScriptKind.JSX;

  const consumed = new Set<ts.Node>();
  const consts = new Map<string, ts.Expression>();
  const collectConsts = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.getCombinedNodeFlags(node) & ts.NodeFlags.Const) {
      consts.set(node.name.text, node.initializer);
    }
    ts.forEachChild(node, collectConsts);
  };
  collectConsts(sf);

  // The design system's manifests this file imports: local name to component folder, and namespaces.
  const manifests = new Map<string, string>();
  const manifestNamespaces = new Map<string, string>();
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier) || st.importClause?.isTypeOnly) continue;
    const component = MANIFEST_MODULE.exec(st.moduleSpecifier.text)?.[1];
    const bindings = st.importClause?.namedBindings;
    if (!component || !bindings) continue;
    if (ts.isNamespaceImport(bindings)) manifestNamespaces.set(bindings.name.text, component);
    else for (const el of bindings.elements) if (!el.isTypeOnly) manifests.set(el.name.text, component);
  }

  const unwrap = (e: ts.Expression): ts.Expression => {
    while (ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isNonNullExpression(e) || ts.isSatisfiesExpression(e) || ts.isTypeAssertionExpression(e)) e = e.expression;
    return e;
  };

  /** Text of a string-like literal, with PLACEHOLDER for each interpolation. */
  const literalText = (e: ts.Expression): string | null => {
    if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text;
    if (ts.isTemplateExpression(e)) return e.head.text + e.templateSpans.map((s) => PLACEHOLDER + s.literal.text).join('');
    return null;
  };

  /** The block class of the manifest an expression names (an import, a namespace member, or a constant holding one), or null. */
  const manifestBlock = (expr: ts.Expression, seen = new Set<string>()): string | null => {
    const e = unwrap(expr);
    let component: string | undefined;
    if (ts.isIdentifier(e)) {
      component = manifests.get(e.text);
      if (!component && consts.has(e.text) && !seen.has(e.text)) {
        seen.add(e.text);
        return manifestBlock(consts.get(e.text)!, seen);
      }
    } else if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression)) component = manifestNamespaces.get(e.expression.text);
    return component ? (ctx.system.components.get(component)?.block ?? null) : null;
  };

  /**
   * A call of the variant helper as the classes it returns: `footer.part('legal-link')` is
   * smbk-footer__legal-link, `.modifier(axis, value)` and `.flag(name)` the modifier classes, and the manifest
   * called with props its block and the modifiers its literal props name. An argument that is not a literal
   * leaves the class open from there. A part, modifier or flag call on something that is not a known manifest
   * yields nothing: its arguments are pieces of a name, never classes themselves. Null for any other call.
   */
  const manifestCall = (call: ts.CallExpression): Piece[] | null => {
    const callee = unwrap(call.expression);
    const line = lineOf(call);
    const arg = (i: number): string => {
      const a = call.arguments[i];
      if (!a) return PLACEHOLDER;
      const u = unwrap(a);
      const t = literalText(u);
      if (t === null || ts.isTemplateExpression(u)) return PLACEHOLDER;
      consumed.add(u);
      return t;
    };
    if (ts.isPropertyAccessExpression(callee) && MANIFEST_METHODS.has(callee.name.text)) {
      const block = manifestBlock(callee.expression);
      const method = callee.name.text;
      const name = method === 'part' ? `__${arg(0)}` : method === 'modifier' ? `--${arg(0)}-${arg(1)}` : `--${arg(0)}`;
      return block ? [{ text: block + name, line }] : [];
    }
    const block = manifestBlock(callee);
    if (!block) return null;
    const out: Piece[] = [{ text: block, line }];
    const props = call.arguments[0] && unwrap(call.arguments[0]);
    if (props && ts.isObjectLiteralExpression(props)) {
      for (const p of props.properties) {
        if (!ts.isPropertyAssignment(p) || !(ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) continue;
        if (ts.isStringLiteral(p.name)) consumed.add(p.name);
        const value = unwrap(p.initializer);
        const t = literalText(value);
        if (t !== null && !ts.isTemplateExpression(value)) {
          consumed.add(value);
          out.push({ text: `${block}--${p.name.text}-${t}`, line: lineOf(value) });
        } else if (value.kind === ts.SyntaxKind.TrueKeyword) out.push({ text: `${block}--${p.name.text}`, line: lineOf(value) });
      }
    }
    return out;
  };

  /**
   * Every string that could end up as a class, a style value or a selector,
   * following conditionals, logical operators, concatenation, arrays, helper
   * calls, clsx-style objects and same-file constants.
   */
  const pieces = (expr: ts.Expression | undefined, seen = new Set<string>()): Piece[] => {
    if (!expr) return [];
    const e = unwrap(expr);
    const text = literalText(e);
    if (text !== null) {
      consumed.add(e);
      const out: Piece[] = [{ text, line: lineOf(e) }];
      if (ts.isTemplateExpression(e)) for (const s of e.templateSpans) out.push(...pieces(s.expression, seen));
      return out;
    }
    if (ts.isNumericLiteral(e)) return [];
    if (ts.isBinaryExpression(e)) {
      const op = e.operatorToken.kind;
      if (op === ts.SyntaxKind.PlusToken) {
        const parts: ts.Expression[] = [];
        const flatten = (x: ts.Expression) => {
          const u = unwrap(x);
          if (ts.isBinaryExpression(u) && u.operatorToken.kind === ts.SyntaxKind.PlusToken) {
            flatten(u.left);
            flatten(u.right);
          } else parts.push(u);
        };
        flatten(e);
        if (parts.some((p) => literalText(p) !== null)) {
          const out: Piece[] = [];
          let joined = '';
          for (const p of parts) {
            const t = literalText(p);
            if (t !== null && !ts.isTemplateExpression(p)) {
              consumed.add(p);
              joined += t;
            } else {
              joined += PLACEHOLDER;
              out.push(...pieces(p, seen));
            }
          }
          out.unshift({ text: joined, line: lineOf(e) });
          return out;
        }
        return parts.flatMap((p) => pieces(p, seen));
      }
      if (op === ts.SyntaxKind.AmpersandAmpersandToken) return pieces(e.right, seen);
      if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) return [...pieces(e.left, seen), ...pieces(e.right, seen)];
      return [];
    }
    if (ts.isConditionalExpression(e)) return [...pieces(e.whenTrue, seen), ...pieces(e.whenFalse, seen)];
    if (ts.isArrayLiteralExpression(e)) return e.elements.flatMap((el) => pieces(ts.isSpreadElement(el) ? el.expression : el, seen));
    if (ts.isCallExpression(e)) {
      const classes = manifestCall(e);
      if (classes) return classes;
      const out = e.arguments.flatMap((a) => pieces(a, seen));
      if (ts.isPropertyAccessExpression(e.expression)) out.push(...pieces(e.expression.expression, seen));
      return out;
    }
    if (ts.isObjectLiteralExpression(e)) {
      const out: Piece[] = [];
      for (const p of e.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        if (ts.isStringLiteral(p.name) || ts.isNoSubstitutionTemplateLiteral(p.name)) {
          consumed.add(p.name);
          out.push({ text: p.name.text, line: lineOf(p.name) });
        } else if (ts.isComputedPropertyName(p.name)) out.push(...pieces(p.name.expression, seen));
      }
      return out;
    }
    if (ts.isIdentifier(e) && consts.has(e.text) && !seen.has(e.text)) {
      seen.add(e.text);
      return pieces(consts.get(e.text), seen);
    }
    return [];
  };

  const classesFrom = (expr: ts.Expression | undefined) => {
    for (const p of pieces(expr)) checkClassList(ctx, p.text, p.line);
  };
  const selectorsFrom = (expr: ts.Expression | undefined) => {
    for (const p of pieces(expr)) {
      checkPropertyRefsIn(ctx, p.text, p.line);
      checkSelector(ctx, p.text, p.line, false);
    }
  };
  const valuesFrom = (prop: string, expr: ts.Expression | undefined) => {
    for (const p of pieces(expr)) checkDeclaration(ctx, prop, p.text, p.line);
  };

  const styleObject = (obj: ts.ObjectLiteralExpression) => {
    for (const p of obj.properties) {
      if (!ts.isPropertyAssignment(p)) continue;
      const key = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) || ts.isNoSubstitutionTemplateLiteral(p.name) ? p.name.text : null;
      if (key === null) continue;
      if (ts.isStringLiteral(p.name)) consumed.add(p.name);
      const prop = kebab(key);
      checkPropertyRefsIn(ctx, key, lineOf(p));
      const value = unwrap(p.initializer);
      const num = ts.isNumericLiteral(value)
        ? Number(value.text)
        : ts.isPrefixUnaryExpression(value) && value.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(value.operand)
          ? -Number(value.operand.text)
          : null;
      if (num !== null) {
        checkDeclaration(ctx, prop, UNITLESS.has(key) || key.startsWith('--') ? String(num) : num === 0 ? '0' : `${num}px`, lineOf(p));
      } else valuesFrom(prop, value);
    }
  };

  /** className of a JSX element, as class tokens (for telling whether it carries a system class). */
  const jsxClasses = (attrs: ts.JsxAttributes): string[] => {
    const out: string[] = [];
    for (const a of attrs.properties) {
      if (!ts.isJsxAttribute(a) || !ts.isIdentifier(a.name) || !/^(className|class)$/.test(a.name.text) || !a.initializer) continue;
      const init = ts.isJsxExpression(a.initializer) ? a.initializer.expression : a.initializer;
      for (const p of pieces(init)) out.push(...p.text.split(/\s+/).filter(Boolean));
    }
    return out;
  };
  const jsxAttr = (attrs: ts.JsxAttributes, name: string): string | undefined => {
    for (const a of attrs.properties) {
      if (!ts.isJsxAttribute(a) || !ts.isIdentifier(a.name) || a.name.text !== name || !a.initializer) continue;
      if (ts.isStringLiteral(a.initializer)) return a.initializer.text;
      if (ts.isJsxExpression(a.initializer) && a.initializer.expression) return literalText(unwrap(a.initializer.expression)) ?? '';
    }
    return undefined;
  };
  const tagName = (node: ts.JsxOpeningElement | ts.JsxSelfClosingElement) => (ts.isIdentifier(node.tagName) ? node.tagName.text : '');
  /** Elements whose children are text, never markup: code samples may name any class and raw values freely. */
  const textTags = new Set(['pre', 'code', ctx.system.components.get('code-block')?.wrapper ?? 'CodeBlock']);
  const isTextElement = (node: ts.Node): node is ts.JsxElement => ts.isJsxElement(node) && textTags.has(tagName(node.openingElement));
  const reportedDetails = new Set<ts.Node>();

  // ---------------------------------------------------------------- first pass
  const first = (node: ts.Node): void => {
    if (isTextElement(node)) {
      first(node.openingElement);
      return;
    }
    if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name) && node.initializer) {
      const name = node.name.text;
      const init = ts.isJsxExpression(node.initializer) ? node.initializer.expression : ts.isStringLiteral(node.initializer) ? node.initializer : undefined;
      if (/^(className|class)$|ClassName$/.test(name)) classesFrom(init);
      else if (name === 'style' && init) {
        const u = unwrap(init);
        if (ts.isObjectLiteralExpression(u)) styleObject(u);
        else for (const p of pieces(u)) checkDeclarationList(ctx, p.text, p.line);
      } else if (COLOUR_JSX_ATTRS.has(name) && init) {
        for (const p of pieces(init)) if (!/^(none|currentcolor|transparent|inherit)$/i.test(p.text.trim())) checkDeclaration(ctx, 'color', p.text, p.line);
      } else if (name === 'content' && init) {
        const el = node.parent.parent;
        const metaName = (ts.isJsxSelfClosingElement(el) || ts.isJsxOpeningElement(el)) && tagName(el) === 'meta' ? jsxAttr(el.attributes, 'name') ?? '' : '';
        if (/theme-color|tilecolor/i.test(metaName)) valuesFrom('color', init);
      }
      // Any other attribute's strings are content (href, alt, aria-*), never judged.
      if (init) markConsumed(init);
    }

    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = tagName(node);
      if (/^[a-z]/.test(tag)) {
        const role = jsxAttr(node.attributes, 'role');
        if (LOOK_ALIKE_TAGS.has(tag) || role) {
          let parentReported = false;
          if (tag === 'summary') {
            let p: ts.Node | undefined = node.parent;
            while (p && !(ts.isJsxElement(p) && tagName(p.openingElement) === 'details')) p = p.parent;
            parentReported = p !== undefined && reportedDetails.has(p);
          }
          const attrs: Record<string, string | undefined> = { type: jsxAttr(node.attributes, 'type'), role };
          if (checkElement(ctx, { tag, classes: jsxClasses(node.attributes), attrs, parentReported }, lineOf(node), inTsx) && tag === 'details') {
            reportedDetails.add(node.parent);
          }
        }
        if (tag === 'style' && ts.isJsxOpeningElement(node)) {
          for (const child of node.parent.children) {
            if (ts.isJsxExpression(child) && child.expression) {
              for (const p of pieces(child.expression)) checkCss(ctx, p.text, p.line - 1);
            }
          }
        }
      }
    }

    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const method = node.expression.name.text;
      const target = node.expression.expression;
      const args = node.arguments;
      if (CLASSLIST_METHODS.has(method) && ts.isPropertyAccessExpression(target) && target.name.text === 'classList') {
        (method === 'toggle' ? args.slice(0, 1) : args).forEach((a) => classesFrom(a));
      } else if (SELECTOR_METHODS.has(method)) {
        selectorsFrom(args[0]);
      } else if (method === 'getElementsByClassName') {
        classesFrom(args[0]);
      } else if (method === 'setAttribute' && args[0] && ts.isStringLiteral(args[0])) {
        if (/^class(Name)?$/.test(args[0].text)) classesFrom(args[1]);
        else if (args[0].text === 'style') for (const p of pieces(args[1])) checkDeclarationList(ctx, p.text, p.line);
      } else if (method === 'setProperty' && ts.isPropertyAccessExpression(target) && target.name.text === 'style' && args[0]) {
        const prop = literalText(unwrap(args[0]));
        if (prop !== null) {
          consumed.add(unwrap(args[0]));
          const values = pieces(args[1]);
          if (!values.length) checkDeclaration(ctx, prop, PLACEHOLDER, lineOf(args[0]));
          for (const v of values) checkDeclaration(ctx, prop, v.text, v.line);
        }
      } else if (method === 'matchMedia') {
        for (const p of pieces(args[0])) checkQuery(ctx, 'media', p.text, p.line);
      } else if (method === 'addColorStop') {
        valuesFrom('color', args[1]);
      }
    } else if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'matchMedia') {
      for (const p of pieces(node.arguments[0])) checkQuery(ctx, 'media', p.text, p.line);
    }

    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.EqualsToken || node.operatorToken.kind === ts.SyntaxKind.PlusEqualsToken) &&
      ts.isPropertyAccessExpression(node.left)
    ) {
      const name = node.left.name.text;
      const owner = node.left.expression;
      if (name === 'className') classesFrom(node.right);
      else if (ts.isPropertyAccessExpression(owner) && owner.name.text === 'style') {
        if (name === 'cssText') for (const p of pieces(node.right)) checkDeclarationList(ctx, p.text, p.line);
        else valuesFrom(kebab(name), node.right);
      } else if (CANVAS_COLOUR.has(name)) valuesFrom('color', node.right);
      else if (name === 'font') valuesFrom('font', node.right);
    }

    ts.forEachChild(node, first);
  };

  const markConsumed = (e: ts.Node) => {
    const u = ts.isExpression(e) ? unwrap(e) : e;
    if (ts.isStringLiteral(u) || ts.isNoSubstitutionTemplateLiteral(u) || ts.isTemplateExpression(u)) consumed.add(u);
  };

  first(sf);

  // ---------------------------------------------------------------- second pass
  const prefix = ctx.config.prefix;
  const second = (node: ts.Node): void => {
    if (isTextElement(node)) {
      second(node.openingElement);
      return;
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateExpression(node)) {
      if (!consumed.has(node) && !isModuleOrType(node) && !isVisibleText(node)) looseString(node);
      if (ts.isTemplateExpression(node)) for (const s of node.templateSpans) second(s.expression);
      return;
    }
    ts.forEachChild(node, second);
  };

  const looseString = (node: ts.StringLiteral | ts.NoSubstitutionTemplateLiteral | ts.TemplateExpression) => {
    const text = literalText(node)!;
    const line = lineOf(node);
    if (/<[a-zA-Z][\w-]*[\s>/\u0000]/.test(text) && /<\/?[a-zA-Z]/.test(text) && /(class|style)\s*=|<(button|input|select|textarea|dialog|details|table|progress)\b/i.test(text)) {
      checkHtml(ctx, text, line - 1, null);
      return;
    }
    if (looksLikeStylesheet(text)) {
      checkCss(ctx, text, line - 1);
      return;
    }
    if (looksLikeDeclarations(text)) {
      checkDeclarationList(ctx, text, line);
      return;
    }
    checkPropertyRefsIn(ctx, text, line);
    // A selector-looking string naming system or project classes (e.g. a constant passed to a helper).
    if (new RegExp(`(^|[\\s>+~,(])\\.(smbk-|${prefix})`).test(text) && /^[\s\w.#\[\]="':>+~*(),^$|@\u0000-]+$/.test(text)) {
      for (const c of selectorClasses(text)) if (c.startsWith('smbk-') || c.startsWith(prefix)) checkClass(ctx, c, line);
      return;
    }
    if (hrefLike(node)) return;
    for (const m of text.matchAll(/(?<![\w#&-])#([0-9a-fA-F]{3,8})(?![\w-])/g)) {
      if ([3, 4, 6, 8].includes(m[1]!.length)) checkDeclaration(ctx, 'color', m[0], line);
    }
    for (const m of text.matchAll(/(?<![\w-])(rgba?|hsla?|hwb|oklch|oklab|lab|lch)\([^)]*\)/gi)) checkDeclaration(ctx, 'color', m[0], line);
    for (const m of text.matchAll(/(?<![\w-])(cubic-bezier|steps)\([^)]*\)/gi)) checkDeclaration(ctx, 'transition-timing-function', m[0], line);
    if (/^\s*(\d+\.?\d*|\.\d+)m?s\s*$/.test(text) && Number.parseFloat(text) !== 0) checkDeclaration(ctx, 'transition-duration', text.trim(), line);
  };

  second(sf);
}

/**
 * A string that is a child of a JSX element (`<p>{'...'}</p>`, directly or
 * through a conditional or concatenation) is words on the page, not code.
 */
function isVisibleText(node: ts.Node): boolean {
  let p: ts.Node = node;
  for (;;) {
    const parent = p.parent;
    if (!parent) return false;
    if (ts.isJsxExpression(parent)) return ts.isJsxElement(parent.parent) || ts.isJsxFragment(parent.parent);
    if (
      ts.isParenthesizedExpression(parent) ||
      (ts.isConditionalExpression(parent) && p !== parent.condition) ||
      ts.isBinaryExpression(parent) ||
      ts.isTemplateSpan(parent) ||
      ts.isTemplateExpression(parent) ||
      ts.isArrayLiteralExpression(parent) ||
      ts.isAsExpression(parent)
    ) {
      p = parent;
      continue;
    }
    return false;
  }
}

function isModuleOrType(node: ts.Node): boolean {
  const p = node.parent;
  return (
    ts.isImportDeclaration(p) ||
    ts.isExportDeclaration(p) ||
    ts.isExternalModuleReference(p) ||
    ts.isLiteralTypeNode(p) ||
    (ts.isCallExpression(p) && p.expression.kind === ts.SyntaxKind.ImportKeyword) ||
    ts.isImportTypeNode(p)
  );
}

/** Strings compared against, or used as, anchors and ids: a "#fade" there is not a colour. */
function hrefLike(node: ts.Node): boolean {
  const p = node.parent;
  if (ts.isBinaryExpression(p) && /^(===|!==|==|!=)$/.test(p.operatorToken.getText())) return true;
  if (ts.isCaseClause(p)) return true;
  if (ts.isPropertyAssignment(p) && /^(href|to|hash|id|anchor|target|url|path)$/i.test(p.name.getText())) return true;
  if (ts.isCallExpression(p) && ts.isPropertyAccessExpression(p.expression) && /^(getElementById|pushState|replaceState|assign|open|startsWith|endsWith|includes)$/.test(p.expression.name.text)) return true;
  return false;
}

function looksLikeDeclarations(text: string): boolean {
  const parts = text.split(';').map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return false;
  let known = 0;
  for (const part of parts) {
    const m = /^(--[\w-]+|-?[a-z][a-z-]*)\s*:\s*\S/.exec(part);
    if (!m) return false;
    if (CSS_PROPERTIES.has(m[1]!) || m[1]!.startsWith('--')) known++;
  }
  return known > 0;
}
