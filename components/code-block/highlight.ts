/**
 * The code block's highlighter: cuts code into pieces and says what kind of code each piece is, so the stylesheet can
 * color it (the code colors, `color.code.*`). It reads the shape of the code, not its meaning: a few rules per
 * language, no grammar and no package, so it runs anywhere, in a page's build or in the browser, and costs little.
 * Code it cannot place is left as plain text, which is never wrong, only uncolored.
 */

/** The kinds of code the stylesheet colors, one design token each (`color.code.<kind>`) and one part each (`smbk-code__<kind>`). */
export const CODE_KINDS = ['keyword', 'declaration', 'string', 'number', 'function', 'type', 'tag', 'property', 'comment', 'punctuation'] as const;
export type CodeKind = (typeof CODE_KINDS)[number];

/** A run of code: its text, and its kind when it has one. Plain text has none. */
export interface CodePiece {
  text: string;
  kind?: CodeKind;
}

/** The languages the highlighter reads, each with the other names it answers to. */
const LANGUAGES = {
  css: ['css', 'scss', 'less', 'postcss'],
  html: ['html', 'htm', 'xml', 'svg', 'markup', 'vue', 'astro'],
  js: ['js', 'javascript', 'mjs', 'cjs'],
  jsx: ['jsx'],
  ts: ['ts', 'typescript', 'mts', 'cts'],
  tsx: ['tsx'],
  json: ['json', 'jsonc', 'json5'],
  shell: ['shell', 'sh', 'bash', 'zsh', 'console', 'terminal'],
} as const;
export type CodeLanguage = keyof typeof LANGUAGES;

/** The language a name such as "typescript" or "sh" means, or undefined for one the highlighter does not read. */
export function codeLanguage(name: string | undefined): CodeLanguage | undefined {
  const n = name?.trim().toLowerCase().replace(/^\./, '');
  if (!n) return undefined;
  return (Object.keys(LANGUAGES) as CodeLanguage[]).find((l) => (LANGUAGES[l] as readonly string[]).includes(n));
}

/** Cuts code into pieces, each with its kind. Code in a language it does not read comes back as one plain piece. */
export function highlight(code: string, language: string | undefined): CodePiece[] {
  const lang = codeLanguage(language);
  const out = new Pieces();
  if (lang === 'css') css(code, out);
  else if (lang === 'html') html(code, out);
  else if (lang === 'json') json(code, out);
  else if (lang === 'shell') shell(code, out);
  else if (lang) script(code, out, lang === 'jsx' || lang === 'tsx', lang === 'ts' || lang === 'tsx');
  else out.add(code);
  return out.list;
}

/** Collects pieces, joining neighbours of the same kind, so the markup stays small. */
class Pieces {
  list: CodePiece[] = [];
  add(text: string, kind?: CodeKind) {
    if (!text) return;
    const last = this.list[this.list.length - 1];
    if (last && last.kind === kind) last.text += text;
    else this.list.push(kind ? { text, kind } : { text });
  }
}

/** Matches a pattern at one place only (the sticky flag), returning the text it matched there. */
function at(re: RegExp, code: string, i: number): string | undefined {
  re.lastIndex = i;
  return re.exec(code)?.[0];
}

const SPACE = /\s+/y;
const BLOCK_COMMENT = /\/\*[\s\S]*?(?:\*\/|$)/y;
const LINE_COMMENT = /\/\/[^\n]*/y;
const QUOTED = /"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?/y;
const TEMPLATE = /`(?:\\[\s\S]|[^`\\])*`?/y;
const NUMBER = /(?:0[xX][\da-fA-F_]+|0[bB][01_]+|(?:\d[\d_]*)?\.?\d[\d_]*(?:[eE][+-]?\d+)?n?)(?![\w$])/y;
const IDENT = /[A-Za-z_$][\w$]*/y;

// ---- CSS ---------------------------------------------------------------------------------------------------------

const CSS_HEX = /#[\da-fA-F]{3,8}(?![\w-])/y;
const CSS_NUMBER = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?(?:%|[a-zA-Z]+)?/y;
const CSS_WORD = /-?[A-Za-z_][\w-]*|--[\w-]+/y;
/** At-rules whose block holds more rules, not declarations. */
const CSS_RULE_BLOCKS = /^@(?:media|supports|container|layer|document|scope|starting-style)\b/;
const UNTIL_BRACE = /[^;{}]*/y;

function css(code: string, out: Pieces) {
  // Each open block holds rules (the top level, @media) or declarations (a selector's block); inside declarations a
  // colon starts a value, a semicolon ends it.
  const blocks: ('rules' | 'decls')[] = ['rules'];
  let prelude = '';
  let inValue = false;
  let i = 0;
  while (i < code.length) {
    // In a declaration block, text that runs to a brace before any semicolon is a nested rule's selector.
    const nested = !inValue && code[i + at(UNTIL_BRACE, code, i)!.length] === '{';
    const inDecls = blocks[blocks.length - 1] === 'decls' && !nested;
    let m: string | undefined;
    if ((m = at(SPACE, code, i))) out.add(m);
    else if ((m = at(BLOCK_COMMENT, code, i))) out.add(m, 'comment');
    else if ((m = at(QUOTED, code, i))) out.add(m, 'string');
    else if (code[i] === '{') {
      // A rule nested in a declaration block (`&:hover {`) was read as a property: its block holds declarations too.
      blocks.push(CSS_RULE_BLOCKS.test(prelude.trim()) ? 'rules' : 'decls');
      prelude = '';
      inValue = false;
      out.add('{', 'punctuation');
      m = '{';
    } else if (code[i] === '}') {
      if (blocks.length > 1) blocks.pop();
      inValue = false;
      prelude = '';
      out.add('}', 'punctuation');
      m = '}';
    } else if (inDecls && inValue) {
      if (code[i] === ';') {
        inValue = false;
        out.add(';', 'punctuation');
        m = ';';
      } else if ((m = at(/!important\b/y, code, i))) out.add(m, 'keyword');
      else if ((m = at(CSS_HEX, code, i))) out.add(m, 'number');
      else if ((m = at(CSS_NUMBER, code, i))) out.add(m, 'number');
      else if ((m = at(/--[\w-]+/y, code, i))) out.add(m, 'property');
      else if ((m = at(/[A-Za-z_-][\w-]*(?=\()/y, code, i))) out.add(m, 'function');
      else if ((m = at(CSS_WORD, code, i))) out.add(m);
      else out.add((m = code[i]!), 'punctuation');
    } else if (inDecls && (m = at(/@[\w-]+/y, code, i))) {
      out.add(m, 'keyword');
      prelude += m;
    } else if (inDecls && (m = at(/--[\w-]+|-?[A-Za-z_][\w-]*(?=\s*:[^;{}]*(?:[;}]|$))/y, code, i))) {
      // A property: a name and a colon whose value ends before any brace, so not a nested rule's `&:hover {`.
      out.add(m, 'property');
    } else if (inDecls && code[i] === ':') {
      inValue = true;
      out.add(':', 'punctuation');
      m = ':';
    } else if (code[i] === ';') {
      // The end of an at-rule with no block, such as @import.
      out.add((m = ';'), 'punctuation');
      prelude = '';
    } else {
      // A selector or an at-rule's prelude.
      const atRule = prelude.trim().startsWith('@');
      if ((m = at(/@[\w-]+/y, code, i))) out.add(m, 'keyword');
      else if (atRule && (m = at(/[A-Za-z-][\w-]*(?=\s*:)/y, code, i))) out.add(m, 'property');
      else if ((m = at(/::?[\w-]+|[.#][\w-]+|[A-Za-z][\w-]*|\*|&/y, code, i))) out.add(m, atRule ? undefined : 'tag');
      else if (atRule && (m = at(CSS_NUMBER, code, i))) out.add(m, 'number');
      else out.add((m = code[i]!), 'punctuation');
      prelude += m;
    }
    i += m.length;
  }
}

// ---- JavaScript and TypeScript, with or without JSX ---------------------------------------------------------------

/** Words that steer: control flow and modules. */
const KEYWORDS = new Set('as await break case catch continue debugger default do else export finally for from if import return switch throw try while with yield'.split(' '));
/** Words that declare or name: what a line makes, and the words that describe it. */
const DECLARATIONS = new Set(
  'abstract async class const declare delete enum extends function implements in instanceof interface keyof let new of private protected public readonly satisfies static super this type typeof var void'.split(' '),
);
const LITERALS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);
const TS_TYPES = new Set(['string', 'number', 'boolean', 'bigint', 'symbol', 'object', 'unknown', 'never', 'any', 'void']);

/** A JSX element's opening or closing tag, its children, or an expression in braces inside them. */
type Frame = { mode: 'code' } | { mode: 'expr'; depth: number } | { mode: 'tag' } | { mode: 'children' };

function script(code: string, out: Pieces, jsx: boolean, ts: boolean) {
  const stack: Frame[] = [{ mode: 'code' }];
  let i = 0;
  // The last piece that was not space: decides whether a < opens a tag and whether a name is a key.
  let prev = '';
  const emit = (text: string, kind?: CodeKind) => {
    out.add(text, kind);
    if (text.trim()) prev = text.trim();
  };
  while (i < code.length) {
    const frame = stack[stack.length - 1]!;
    let m: string | undefined;

    if (frame.mode === 'children') {
      // Text between tags is plain; a brace opens an expression, a < a tag.
      if (code[i] === '{') {
        stack.push({ mode: 'expr', depth: 0 });
        emit('{', 'punctuation');
        i += 1;
      } else if ((m = at(/<\/[\w.:-]*\s*>?/y, code, i))) {
        const name = /^<\/([\w.:-]*)/.exec(m)![1]!;
        emit('</', 'punctuation');
        emit(name, tagKind(name));
        emit(m.slice(2 + name.length), 'punctuation');
        stack.pop();
        i += m.length;
      } else if ((m = at(/<(?=[A-Za-z>])/y, code, i))) {
        stack.push({ mode: 'tag' });
        emit('<', 'punctuation');
        if ((m = at(/[\w.:-]+/y, code, i + 1))) emit(m, tagKind(m));
        i += 1 + (m?.length ?? 0);
      } else {
        m = at(/[^{<]+/y, code, i) ?? code[i]!;
        out.add(m);
        i += m.length;
      }
      continue;
    }

    if (frame.mode === 'tag') {
      if ((m = at(SPACE, code, i))) out.add(m);
      else if ((m = at(/\/>/y, code, i))) {
        emit(m, 'punctuation');
        stack.pop();
      } else if (code[i] === '>') {
        emit((m = '>'), 'punctuation');
        stack[stack.length - 1] = { mode: 'children' };
      } else if (code[i] === '{') {
        emit((m = '{'), 'punctuation');
        stack.push({ mode: 'expr', depth: 0 });
      } else if ((m = at(QUOTED, code, i))) emit(m, 'string');
      else if ((m = at(/[A-Za-z_$][\w$:-]*/y, code, i))) emit(m, 'property');
      else emit((m = code[i]!), 'punctuation');
      i += m.length;
      continue;
    }

    // Code, or an expression inside JSX.
    if ((m = at(SPACE, code, i))) out.add(m);
    else if ((m = at(LINE_COMMENT, code, i)) || (m = at(BLOCK_COMMENT, code, i))) out.add(m, 'comment');
    else if ((m = at(QUOTED, code, i)) || (m = at(TEMPLATE, code, i))) emit(m, 'string');
    else if (jsx && code[i] === '<' && opensTag(prev) && (m = at(/<(?=[A-Za-z>])/y, code, i))) {
      stack.push({ mode: 'tag' });
      emit('<', 'punctuation');
      const name = at(/[\w.:-]+/y, code, i + 1);
      if (name) emit(name, tagKind(name));
      m = '<' + (name ?? '');
    } else if ((m = at(NUMBER, code, i)) && /\d/.test(m)) emit(m, 'number');
    else if ((m = at(IDENT, code, i))) {
      const after = code.slice(i + m.length);
      let kind: CodeKind | undefined;
      if (LITERALS.has(m)) kind = 'number';
      else if (prev === '.' && !/^\s*\(/.test(after)) kind = 'property';
      else if (/^\s*\??:(?!:)/.test(after) && (prev === '{' || prev === ',' || prev === ';')) kind = 'property';
      else if (KEYWORDS.has(m) && prev !== '.') kind = 'keyword';
      else if (DECLARATIONS.has(m) && prev !== '.') kind = 'declaration';
      else if (ts && TS_TYPES.has(m)) kind = 'type';
      else if (/^\s*(?:<[\w\s,.[\]|&]*>)?\s*\(/.test(after) && prev !== 'function' && !/^[A-Z]/.test(m)) kind = 'function';
      else if (prev === 'function') kind = 'function';
      else if (/^[A-Z]/.test(m)) kind = 'type';
      emit(m, kind);
    } else {
      m = at(/[=!<>]=?=?|=>|&&|\|\||\?\?|\?\.|\.\.\.|[-+*/%&|^~?:;,.()[\]]/y, code, i) ?? code[i]!;
      if (frame.mode === 'expr' && m === '{') frame.depth += 1;
      if (m === '}' && frame.mode === 'expr') {
        if (frame.depth === 0) stack.pop();
        else frame.depth -= 1;
      }
      emit(m, 'punctuation');
    }
    i += m.length;
  }
}

/** A JSX element's name: an HTML tag in lower case, or a component, a name with a capital or a dot. */
function tagKind(name: string): CodeKind {
  return /^[a-z][\w:-]*$/.test(name) ? 'tag' : 'type';
}

/** Whether a < after this piece opens a JSX tag rather than comparing: not after a name, a number or a closing bracket. */
function opensTag(prev: string): boolean {
  return prev === '' || /[([{,;:=?&|!>}]$/.test(prev) || prev === 'return' || prev === '=>' || prev === '&&' || prev === '||' || prev === '??' || prev === 'default';
}

// ---- HTML --------------------------------------------------------------------------------------------------------

function html(code: string, out: Pieces) {
  let i = 0;
  while (i < code.length) {
    let m: string | undefined;
    if ((m = at(/<!--[\s\S]*?(?:-->|$)/y, code, i))) out.add(m, 'comment');
    else if ((m = at(/<![^>]*>?/y, code, i))) out.add(m, 'keyword');
    else if ((m = at(/<\/?(?=[A-Za-z])/y, code, i))) {
      out.add(m, 'punctuation');
      const name = at(/[\w.:-]+/y, code, i + m.length) ?? '';
      out.add(name, 'tag');
      let j = i + m.length + name.length;
      // The attributes, up to the end of the tag.
      for (;;) {
        let a: string | undefined;
        if ((a = at(SPACE, code, j))) out.add(a);
        else if ((a = at(/\/?>/y, code, j))) {
          out.add(a, 'punctuation');
          j += a.length;
          break;
        } else if ((a = at(/"[^"]*"?|'[^']*'?/y, code, j))) out.add(a, 'string');
        else if ((a = at(/[^\s"'=<>/]+/y, code, j))) out.add(a, 'property');
        else if (j < code.length && code[j] !== '<') out.add((a = code[j]!), 'punctuation');
        else break;
        j += a.length;
      }
      // A style or script element holds another language until its closing tag.
      const inner = /^(style|script)$/i.exec(name)?.[1]?.toLowerCase();
      if (m === '<' && inner) {
        const end = code.toLowerCase().indexOf(`</${inner}`, j);
        const body = code.slice(j, end === -1 ? code.length : end);
        if (inner === 'style') css(body, out);
        else script(body, out, false, false);
        j += body.length;
      }
      m = code.slice(i, j);
    } else if ((m = at(/&#?\w+;/y, code, i))) out.add(m, 'number');
    else out.add((m = at(/[^<&]+/y, code, i) ?? code[i]!));
    i += m.length;
  }
}

// ---- JSON --------------------------------------------------------------------------------------------------------

function json(code: string, out: Pieces) {
  let i = 0;
  while (i < code.length) {
    let m: string | undefined;
    if ((m = at(SPACE, code, i))) out.add(m);
    else if ((m = at(LINE_COMMENT, code, i)) || (m = at(BLOCK_COMMENT, code, i))) out.add(m, 'comment');
    else if ((m = at(/"(?:\\.|[^"\\\n])*"?/y, code, i))) out.add(m, /^\s*:/.test(code.slice(i + m.length)) ? 'property' : 'string');
    else if ((m = at(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null/y, code, i))) out.add(m, 'number');
    else if ((m = at(/[^\s"{}[\],:]+/y, code, i))) out.add(m);
    else out.add((m = code[i]!), 'punctuation');
    i += m.length;
  }
}

// ---- Shell -------------------------------------------------------------------------------------------------------

function shell(code: string, out: Pieces) {
  let i = 0;
  // Whether the next word is the command a line, or a part of a pipe, runs.
  let command = true;
  while (i < code.length) {
    let m: string | undefined;
    if ((m = at(/\n/y, code, i))) {
      out.add(m);
      command = true;
    } else if ((m = at(/[ \t]+/y, code, i))) out.add(m);
    else if (command && (m = at(/[$>%](?= )/y, code, i)) && (i === 0 || code[i - 1] === '\n')) out.add(m, 'punctuation');
    else if ((m = at(/#[^\n]*/y, code, i)) && (i === 0 || /\s/.test(code[i - 1]!))) out.add(m, 'comment');
    else if ((m = at(/"(?:\\.|[^"\\])*"?|'[^']*'?/y, code, i))) {
      out.add(m, 'string');
      command = false;
    } else if ((m = at(/&&|\|\||[|;&]/y, code, i))) {
      out.add(m, 'punctuation');
      command = true;
    } else if ((m = at(/\\(?=\n)/y, code, i))) out.add(m, 'punctuation');
    else if ((m = at(/--?[\w-]+(?:=)?/y, code, i)) && !command) out.add(m, 'property');
    else if (command && (m = at(/[A-Za-z_]\w*=\S*/y, code, i))) {
      // A variable set for the command: its name, then its value.
      const name = m.slice(0, m.indexOf('=') + 1);
      out.add(name, 'property');
      out.add(m.slice(name.length));
    }
    else if ((m = at(/[^\s"'|;&]+/y, code, i))) {
      out.add(m, command ? 'function' : undefined);
      command = false;
    } else out.add((m = code[i]!));
    i += m.length;
  }
}
