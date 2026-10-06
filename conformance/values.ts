/**
 * Raw design values in one CSS declaration.
 *
 * `analyse(prop, value, context)` returns every hand-written design value in it. Values
 * may contain PLACEHOLDER where a script interpolates something unknown; a unit
 * glued to a placeholder is dynamic and is not judged.
 */

export const PLACEHOLDER = '\u0000';

export type IssueKind =
  | 'colour'
  | 'length'
  | 'font-family'
  | 'font'
  | 'font-weight'
  | 'font-size'
  | 'line-height'
  | 'z-index'
  | 'duration'
  | 'easing'
  | 'token-arithmetic';

export interface Issue {
  kind: IssueKind;
  text: string;
}

const NAMED_COLOURS = new Set(
  (
    'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue ' +
    'chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey ' +
    'darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray ' +
    'darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen ' +
    'fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki ' +
    'lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen ' +
    'lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime ' +
    'limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue ' +
    'mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive ' +
    'olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum ' +
    'powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue ' +
    'slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke ' +
    'yellow yellowgreen'
  ).split(' '),
);

/**
 * The CSS system colours: the user's own colours, which the browser fills in. Outside high-contrast rules
 * they are hand-written colours like any other; inside `@media (forced-colors: active)` they are the only
 * correct way to draw, so there they are not findings.
 */
const SYSTEM_COLOURS = new Set(
  (
    'canvas canvastext linktext visitedtext activetext buttonface buttontext buttonborder field fieldtext ' +
    'highlight highlighttext selecteditem selecteditemtext mark marktext graytext accentcolor accentcolortext'
  ).split(' '),
);

/** Where a declaration stands, when that changes what counts as a raw value. */
export interface Context {
  /** Inside `@media (forced-colors: active)`. */
  forcedColors?: boolean;
}

const COLOUR_PROPERTY =
  /(^|-)color$|^(background|background-image|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?|outline|box-shadow|text-shadow|fill|stroke|column-rule|text-decoration|text-emphasis|filter|backdrop-filter|-webkit-text-stroke|scrollbar-color)$/;

/** Units that are proportions of something, never design values. */
const PROPORTION_UNITS = new Set([
  '%', 'fr', 'vw', 'vh', 'vi', 'vb', 'vmin', 'vmax', 'svw', 'svh', 'svi', 'svb', 'svmin', 'svmax', 'lvw', 'lvh', 'lvi', 'lvb',
  'lvmin', 'lvmax', 'dvw', 'dvh', 'dvi', 'dvb', 'dvmin', 'dvmax', 'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax',
  'deg', 'rad', 'grad', 'turn', 'dpi', 'dpcm', 'dppx', 'x', 'hz', 'khz',
]);
const LENGTH_UNITS = new Set(['px', 'rem', 'em', 'pt', 'pc', 'cm', 'mm', 'in', 'q', 'ex', 'rex', 'cap', 'rcap', 'ic', 'ric', 'lh', 'rlh', 'ch', 'rch']);
const TIME_UNITS = new Set(['s', 'ms']);
/** Where `ch` is a measure (a line length), not a design value. */
const MEASURE_PROPERTY = /^(min-|max-)?(width|inline-size)$|^(flex-basis|grid-template-columns)$/;
const MOTION_PROPERTY = /^(transition|animation)(-|$)/;
const EASING_KEYWORD = /(?<![\w-])(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end)(?![\w-])/;
const CSS_WIDE = /^(inherit|initial|unset|revert|revert-layer)$/i;
const NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;

/** Blank out strings and url() contents, which never hold design values we judge here. */
function sanitise(value: string): string {
  return value
    .replace(/!important\s*$/i, '')
    .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""')
    .replace(/\burl\((?:[^()]|\([^()]*\))*\)/gi, 'url()');
}

/** Remove every var(...) including nested ones and their fallbacks. */
export function stripVars(value: string): string {
  let out = value;
  for (;;) {
    const next = out.replace(/var\(\s*--[\w-]*(?:\s*,[^()]*(?:\([^()]*\)[^()]*)*)?\)/g, ' ');
    if (next === out) return out;
    out = next;
  }
}

export function analyse(propIn: string, value: string, context: Context = {}): Issue[] {
  const prop = propIn.startsWith('--') ? propIn : propIn.toLowerCase();
  const custom = prop.startsWith('--');
  const issues: Issue[] = [];
  const v = sanitise(value);
  const trimmed = v.trim();
  if (!trimmed || CSS_WIDE.test(trimmed)) return issues;
  const add = (kind: IssueKind, text: string) => {
    if (!issues.some((i) => i.kind === kind && i.text === text)) issues.push({ kind, text });
  };

  // Colours: hex and colour functions anywhere; named colours where a colour is expected.
  for (const m of v.matchAll(/#[0-9a-fA-F]{3,8}(?![\w-])/g)) if ([4, 5, 7, 9].includes(m[0].length)) add('colour', m[0]);
  for (const m of v.matchAll(/(?<![\w-])(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/gi)) add('colour', `${m[1]}()`);
  const named = (word: string) => NAMED_COLOURS.has(word) || (SYSTEM_COLOURS.has(word) && !context.forcedColors);
  if (COLOUR_PROPERTY.test(prop) || (custom && /(?<![\w-])(color-mix|(repeating-)?(linear|radial|conic)-gradient)\(/i.test(v))) {
    for (const m of stripVars(v).matchAll(/(?<![\w-])([a-zA-Z]+)(?![\w(-])/g)) if (named(m[1]!.toLowerCase())) add('colour', m[1]!);
  } else if (custom && named(trimmed.toLowerCase())) {
    add('colour', trimmed);
  }

  // Numbers with units.
  for (const m of v.matchAll(/(?<![\w.\-#\u0000])([+-]?(?:\d+\.?\d*|\.\d+))([a-zA-Z]+|%)?(?![\w\u0000.])/g)) {
    const num = Number.parseFloat(m[1]!);
    const unit = (m[2] ?? '').toLowerCase();
    if (num === 0 || !unit || PROPORTION_UNITS.has(unit)) continue;
    if (LENGTH_UNITS.has(unit)) {
      if ((unit === 'ch' || unit === 'rch') && (MEASURE_PROPERTY.test(prop) || custom)) continue;
      add('length', m[0]);
    } else if (TIME_UNITS.has(unit)) {
      add('duration', m[0]);
    }
  }

  // Timing curves.
  if (MOTION_PROPERTY.test(prop) || custom) {
    for (const m of v.matchAll(/(?<![\w-])(cubic-bezier|steps|linear)\(/gi)) add('easing', `${m[1]}()`);
  }
  if (MOTION_PROPERTY.test(prop)) {
    const bare = stripVars(v).replace(/(?<![\w-])(cubic-bezier|steps|linear)\([^)]*\)/gi, ' ');
    for (const m of bare.matchAll(new RegExp(EASING_KEYWORD, 'g'))) add('easing', m[1]!);
  }

  // Type.
  // What is left once tokens and script interpolations (with any unit glued to them) are removed.
  const noVars = stripVars(v).replace(/\u0000[a-z%]*/gi, ' ').replace(/,/g, ' ').trim();
  const original = value.replace(/!important\s*$/i, '').trim();
  if (prop === 'font-family' && noVars && !CSS_WIDE.test(noVars)) add('font-family', original);
  if (prop === 'font' && noVars && !CSS_WIDE.test(noVars)) add('font', original);
  if (prop === 'font-weight' && (NUMBER.test(trimmed) || /^(bold|bolder|lighter)$/i.test(trimmed))) add('font-weight', trimmed);
  if (prop === 'font-size' && /^(xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large|smaller|larger)$/i.test(trimmed)) add('font-size', trimmed);
  if (prop === 'line-height' && NUMBER.test(trimmed)) add('line-height', trimmed);
  if (prop === 'z-index' && NUMBER.test(trimmed) && Number.parseFloat(trimmed) !== 0) add('z-index', trimmed);

  // Arithmetic that makes a new value out of a token.
  for (const expr of mathExpressions(v)) {
    const bad = tokenArithmetic(expr);
    if (bad) add('token-arithmetic', bad);
  }
  return issues;
}

/** The inside of every calc(), min(), max(), clamp() and friends, outermost first, split at top-level commas. */
function mathExpressions(v: string): string[] {
  const out: string[] = [];
  const re = /(?<![\w-])(calc|min|max|clamp|round|mod|rem|abs|sign)\(/gi;
  for (const m of v.matchAll(re)) {
    const open = m.index! + m[0].length - 1;
    const close = matchParen(v, open);
    out.push(...splitTop(v.slice(open + 1, close), ','));
  }
  return out;
}

function matchParen(s: string, open: number): number {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')' && --depth === 0) return i;
  }
  return s.length;
}

function splitTop(s: string, sepChar: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') depth--;
    else if (s[i] === sepChar && depth === 0) {
      parts.push(s.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(s.slice(start));
  return parts;
}

/**
 * Split one math expression into top-level operands and operators. A run of
 * operands joined by * or / (or by + and -) that holds both a token-only operand
 * and a bare number other than 1 or -1 makes a new value from a token.
 * Operands that also hold a proportion (%, vw, fr, ...) are layout arithmetic, which is fine.
 */
function tokenArithmetic(expr: string): string | null {
  const operands: string[] = [];
  const ops: string[] = [];
  let i = 0;
  let current = '';
  const s = expr.trim();
  while (i < s.length) {
    const c = s[i]!;
    if (c === '(') {
      const close = matchParen(s, i);
      current += s.slice(i, close + 1);
      i = close + 1;
      continue;
    }
    const spaced = (i === 0 || /\s/.test(s[i - 1]!)) && /\s/.test(s[i + 1] ?? ' ');
    if (c === '*' || c === '/' || ((c === '+' || c === '-') && spaced && current.trim())) {
      operands.push(current.trim());
      ops.push(c);
      current = '';
      i++;
      continue;
    }
    current += c;
    i++;
  }
  operands.push(current.trim());

  const tokenOnly = (o: string) => /var\(/.test(o) && !/(%|\d(fr|vw|vh|vi|vb|vmin|vmax|[sld]v[whib]|cq[whib]|cqmin|cqmax)\b)/.test(o);
  /** A plain number. Multiplying by 1 or -1 only flips a sign; adding any number makes a new value. */
  const bareNumber = (o: string, product: boolean) => {
    const t = o.replace(/^\(|\)$/g, '').trim();
    if (!NUMBER.test(t)) return false;
    const n = Number.parseFloat(t);
    return n !== 0 && !(product && Math.abs(n) === 1);
  };
  for (const group of [['*', '/'], ['+', '-']]) {
    const product = group[0] === '*';
    // Walk runs of operands joined by this group's operators.
    let run: string[] = [operands[0] ?? ''];
    const flush = () => run.length > 1 && run.some(tokenOnly) && run.some((o) => bareNumber(o, product));
    for (let k = 0; k < ops.length; k++) {
      if (group.includes(ops[k]!)) run.push(operands[k + 1] ?? '');
      else {
        if (flush()) return s;
        run = [operands[k + 1] ?? ''];
      }
    }
    if (flush()) return s;
  }
  return null;
}

/** Which token family to reach for, by property. */
export function familyFor(prop: string, kind: IssueKind): string {
  const type = 'the typography preset properties (--smbk-typography-<preset>-<property>)';
  if (kind === 'colour') return 'a semantic color role (--smbk-color-*)';
  if (kind === 'duration' || kind === 'easing') return 'the motion tokens (--smbk-motion-*)';
  if (kind === 'z-index') return 'a layer token (--smbk-layer-*)';
  if (kind === 'font-family' || kind === 'font' || kind === 'font-weight' || kind === 'font-size' || kind === 'line-height') return type;
  if (kind === 'token-arithmetic') return 'the token that already holds the value you need (if none does, record the missing token)';
  const p = prop.toLowerCase();
  if (/^(font|font-size|line-height|letter-spacing|word-spacing)$/.test(p)) return type;
  if (/^(box-shadow|text-shadow)$/.test(p)) return 'an elevation token (--smbk-elevation-*)';
  if (/radius/.test(p)) return 'a radius token (--smbk-radius-*)';
  if (p === 'outline-offset') return '--smbk-focus-ring-offset or a space token (--smbk-space-*)';
  if (/^(border|outline|column-rule)(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-width)?$/.test(p)) return 'a border width token (--smbk-border-width-*)';
  if (/^(filter|backdrop-filter)$/.test(p)) return 'a blur token (--smbk-blur-*)';
  if (/^(margin|padding|gap|row-gap|column-gap|grid-gap|inset|top|right|bottom|left|scroll-margin|scroll-padding|text-indent|translate|transform|text-underline-offset|background-position|object-position|vertical-align)/.test(p)) {
    return 'a space token (--smbk-space-*: semantic when the value depends on context, primitive for a fixed internal distance)';
  }
  if (/^(width|height|min-|max-|inline-size|block-size|flex|grid-|background-size|mask-size|columns|column-width)/.test(p)) return 'a size token (--smbk-size-*)';
  if (p.startsWith('--')) return 'a token; a project custom property may only alias var(--smbk-*)';
  return 'the token for this value (if none fits, use the nearest and record the missing token)';
}

export function describe(kind: IssueKind): string {
  switch (kind) {
    case 'colour': return 'raw color';
    case 'length': return 'raw length';
    case 'font-family': return 'font family named by hand';
    case 'font': return 'font shorthand with raw values';
    case 'font-weight': return 'raw font weight';
    case 'font-size': return 'raw font size keyword';
    case 'line-height': return 'raw line height';
    case 'z-index': return 'raw z-index';
    case 'duration': return 'raw duration';
    case 'easing': return 'raw easing';
    case 'token-arithmetic': return 'arithmetic that makes a new value from a token';
  }
}
