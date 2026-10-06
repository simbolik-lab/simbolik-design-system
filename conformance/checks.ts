/**
 * The checks every language shares. Each scanner (CSS, HTML, Markdown,
 * scripts) extracts classes, custom property references, declarations,
 * selectors, queries and elements, and hands them here.
 */
import type { ProjectConfig } from './project.js';
import type { RuleId } from './rules.js';
import { looksPrimitive, type System } from './system.js';
import { analyse, describe, familyFor, PLACEHOLDER, type Context, type IssueKind } from './values.js';

export interface Finding {
  rule: RuleId;
  file: string;
  line: number;
  /** The offending text as written. */
  text: string;
  /** What is wrong with it. */
  message: string;
  /** What to do instead. */
  hint?: string;
  /** Sub-kind: the value kinds for raw-value. */
  kind?: string;
}

export class Collector {
  readonly findings: Finding[] = [];
  private readonly seen = new Set<string>();
  add(f: Finding): void {
    const key = `${f.rule}\u0001${f.file}\u0001${f.line}\u0001${f.text}`;
    if (this.seen.has(key)) return;
    this.seen.add(key);
    this.findings.push(f);
  }
}

export interface Ctx {
  file: string;
  system: System;
  config: ProjectConfig;
  out: Collector;
}

const show = (s: string) => s.replace(new RegExp(PLACEHOLDER, 'g'), '${…}').replace(/\s+/g, ' ').trim();
export const clip = (s: string, n = 140) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

// ---------------------------------------------------------------- classes

const WORD = '[a-z0-9]+(?:-[a-z0-9]+)*';
const TAILWIND_ARBITRARY = /(^|:)!?-?[a-z][\w-]*-\[[^\]]+\]|(^|:)\[[a-z-]+:[^\]]+\]/;

function allowed(config: ProjectConfig, name: string): boolean {
  return config.allowClasses.some((p) => (p.endsWith('*') ? name.startsWith(p.slice(0, -1)) : name === p));
}

/**
 * Judge one class token. A token holding PLACEHOLDER is partly dynamic: only
 * its static beginning is judged, and a token that starts dynamic is skipped.
 */
export function checkClass(ctx: Ctx, raw: string, line: number): void {
  const token = raw.trim();
  if (!token) return;
  const cut = token.indexOf(PLACEHOLDER);
  const partial = cut !== -1;
  const name = partial ? token.slice(0, cut) : token;
  if (!name) return;
  const text = partial ? `${name}…` : name;
  const { prefix } = ctx.config;

  if (TAILWIND_ARBITRARY.test(name)) {
    ctx.out.add({ rule: 'tailwind-arbitrary', file: ctx.file, line, text, message: 'Tailwind arbitrary value.' });
    return;
  }
  if (name.startsWith('smbk-')) {
    const known = partial ? [...ctx.system.classes].some((c) => c.startsWith(name)) : ctx.system.classes.has(name);
    if (!known) {
      const near = partial ? undefined : closest(name, ctx.system.classes);
      ctx.out.add({
        rule: 'unknown-class', file: ctx.file, line, text,
        message: partial ? 'No smbk- class starts this way.' : 'No component defines this class.',
        hint: near ? `Did you mean ${near}?` : undefined,
      });
    }
    return;
  }
  if (name.startsWith(prefix)) {
    if (partial) return;
    const shape = new RegExp(`^${prefix}${WORD}(?:__${WORD})?(?:--${WORD})?$`);
    if (!shape.test(name)) {
      ctx.out.add({ rule: 'class-shape', file: ctx.file, line, text, message: shapeProblem(name, prefix) });
      return;
    }
    const modifier = /--([a-z0-9-]+)$/.exec(name)?.[1];
    if (modifier && !modifier.includes('-')) {
      ctx.out.add({
        rule: 'class-shape', file: ctx.file, line, text,
        message: 'The modifier does not name its axis.',
        hint: `Write ${name.replace(/--[a-z0-9]+$/, `--<axis>-${modifier}`)}.`,
      });
    }
    return;
  }
  if (allowed(ctx.config, name)) return;
  if (partial && !/^[a-z]/i.test(name)) return;
  ctx.out.add({
    rule: 'class-prefix', file: ctx.file, line, text,
    message: partial ? 'A dynamic class that does not start with the project prefix.' : 'Class without the project prefix.',
    hint: /^ph(-|$)/.test(name)
      ? 'An icon: use the design system icon component (<Icon name="…">), or list "ph" and "ph-*" under simbolik.allowClasses.'
      : `Rename to ${prefix}${name.replace(/^[^a-z]+/i, '').toLowerCase()} or use a system component.`,
  });
}

function shapeProblem(name: string, prefix: string): string {
  if (/[A-Z]/.test(name)) return 'Class names are lowercase.';
  if (/__[^_]+__/.test(name)) return 'One element level only: <block>__<element>, never an element of an element.';
  if (/--.*__/.test(name)) return 'The element comes before the modifier: <block>__<element>--<axis>-<value>.';
  if (/(^|[^_])_([^_]|$)/.test(name)) return 'Words are joined with hyphens; underscores only as the __ element separator.';
  if (name === prefix || /^[^-]+--/.test(name.slice(prefix.length))) return `A block name follows the prefix: ${prefix}<block>.`;
  return `Not the shape ${prefix}<block>, ${prefix}<block>__<element>, ${prefix}<block>--<axis>-<value>.`;
}

/** Split a class attribute (or a class string from a script) into tokens and judge each. */
export function checkClassList(ctx: Ctx, value: string, line: number): void {
  for (const token of value.split(/\s+/)) checkClass(ctx, token, line);
}

// ---------------------------------------------------------------- custom properties

export function checkPropertyRef(ctx: Ctx, raw: string, line: number): void {
  const cut = raw.indexOf(PLACEHOLDER);
  const partial = cut !== -1;
  const name = (partial ? raw.slice(0, cut) : raw).replace(/-+$/, partial ? '-' : '');
  const text = partial ? `${name}…` : name;
  if (!name.startsWith('--smbk-')) return;
  const props = ctx.system.properties;
  if (partial ? [...props].some((p) => p.startsWith(name)) : props.has(name)) return;

  const primitive = ctx.system.primitives.get(name);
  if (primitive || (!partial && looksPrimitive(name))) {
    const category = primitive?.category ?? (name.startsWith('--smbk-color-') ? 'color' : 'font');
    const role = category === 'color' ? 'a semantic color role (--smbk-color-*)' : 'a typography preset (--smbk-typography-<preset>-<property>)';
    const users = primitive?.usedBy.slice(0, 3) ?? [];
    ctx.out.add({
      rule: 'primitive-token', file: ctx.file, line, text,
      message: `A primitive ${category === 'color' ? 'color' : 'type'} token${primitive ? ` (${primitive.path})` : ''}. It never reaches CSS, so this resolves to nothing.`,
      hint: `Use ${role}${users.length ? `; roles built on this primitive include ${users.join(', ')}` : ''}.`,
    });
    return;
  }
  const near = partial ? undefined : closest(name, props);
  ctx.out.add({
    rule: 'unknown-property', file: ctx.file, line, text,
    message: partial ? 'No token or component property starts this way.' : 'Not written by the token build nor defined by any component.',
    hint: near ? `Did you mean ${near}?` : undefined,
  });
}

/** Every --smbk- name in a piece of text. */
export function checkPropertyRefsIn(ctx: Ctx, text: string, line: number): void {
  for (const m of text.matchAll(/--smbk-[\w\u0000-]*/g)) checkPropertyRef(ctx, m[0], line);
}

// ---------------------------------------------------------------- declarations

const LAYOUT_SWITCH = '--smbk-layout';

export function checkDeclaration(ctx: Ctx, propIn: string, value: string, line: number, context: Context = {}): void {
  const prop = propIn.trim();
  if (!prop) return;
  checkPropertyRefsIn(ctx, value, line);
  const text = clip(`${show(prop)}: ${show(value)}`);

  if (prop.startsWith('--smbk-')) {
    if (prop === LAYOUT_SWITCH && /^\s*(narrow|wide)\s*$/.test(value)) return;
    if (ctx.system.properties.has(prop)) {
      ctx.out.add({
        rule: 'restyles-system', file: ctx.file, line, text,
        message: 'Project CSS sets a design system token, changing it for everything inside.',
        hint: prop === LAYOUT_SWITCH ? 'Force the layout switch with data-layout="narrow" or "wide" on the wrapper.' : 'Give the piece its own property or pick a different token.',
      });
    } else {
      ctx.out.add({ rule: 'unknown-property', file: ctx.file, line, text: prop, message: 'Defines a name in the design system namespace that the system does not have.' });
    }
  }

  const issues = analyse(prop, value, context);
  if (!issues.length) return;
  const kinds = [...new Set(issues.map((i) => i.kind))] as IssueKind[];
  const detail = kinds.map((k) => `${describe(k)} ${issues.filter((i) => i.kind === k).map((i) => show(i.text)).join(', ')}`).join('; ');
  const families = [...new Set(kinds.map((k) => familyFor(prop, k)))];
  const motionMissing = kinds.some((k) => k === 'duration' || k === 'easing') && !ctx.system.families.has('motion');
  ctx.out.add({
    rule: 'raw-value', file: ctx.file, line, text, kind: kinds.join(','),
    message: `${detail.charAt(0).toUpperCase()}${detail.slice(1)}.`,
    hint: `Use ${families.join('; or ')}${motionMissing ? ' (not in the token build yet: record it as a missing token meanwhile)' : ''}.`,
  });
}

/** `a: b; c: d` as written in a style attribute or a script. */
export function checkDeclarationList(ctx: Ctx, text: string, line: number): void {
  for (const part of splitDeclarations(text)) {
    const colon = part.indexOf(':');
    if (colon <= 0) continue;
    checkDeclaration(ctx, part.slice(0, colon).trim(), part.slice(colon + 1).trim(), line);
  }
}

function splitDeclarations(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let quote = '';
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ';' && depth === 0) {
      out.push(text.slice(start, i));
      start = i + 1;
    }
  }
  out.push(text.slice(start));
  return out;
}

// ---------------------------------------------------------------- selectors

/** Classes in a selector, with CSS escapes resolved. Attribute selector contents are left out. */
export function selectorClasses(selector: string): string[] {
  const bare = selector.replace(/\[[^\]]*\]/g, '[]').replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');
  const out: string[] = [];
  for (const m of bare.matchAll(/\.((?:\\.|[\w\u00a0-\uffff-]|\u0000)+)/g)) {
    const name = m[1]!.replace(/\\(.)/g, '$1');
    if (/^-?\d/.test(name)) continue;
    out.push(name);
  }
  return out;
}

export function checkSelector(ctx: Ctx, selector: string, line: number, restyleIsViolation: boolean): void {
  const classes = selectorClasses(selector);
  for (const c of classes) checkClass(ctx, c, line);
  const attrs = [...selector.matchAll(/\[\s*class[^\]]*\]/gi)].map((m) => m[0]);
  if (restyleIsViolation && (classes.some((c) => c.startsWith('smbk-')) || attrs.some((a) => /smbk-/.test(a)))) {
    ctx.out.add({
      rule: 'restyles-system', file: ctx.file, line, text: clip(show(selector)),
      message: 'A project selector aimed at a design system class.',
      hint: `Pass a ${ctx.config.prefix} class to the component and select that instead.`,
    });
  }
}

// ---------------------------------------------------------------- queries

const WIDTH_FEATURE = /\(\s*(min-|max-)?(device-)?(width|height|inline-size|block-size)\s*[:<>=)]|[<>=]\s*(width|height|inline-size|block-size)\b/i;

export function checkQuery(ctx: Ctx, kind: 'media' | 'container', prelude: string, line: number): void {
  if (kind === 'container') {
    for (const m of prelude.matchAll(/--[\w-]+/g)) checkPropertyRef(ctx, m[0], line);
    // Style and scroll-state queries are fine; strip them before looking for a size condition.
    const sizeOnly = prelude.replace(/(style|scroll-state)\((?:[^()]|\([^()]*\))*\)/gi, '');
    if (!WIDTH_FEATURE.test(sizeOnly)) return;
  } else if (!WIDTH_FEATURE.test(prelude)) {
    return;
  }
  ctx.out.add({
    rule: 'width-breakpoint', file: ctx.file, line, text: clip(`@${kind} ${show(prelude)}`),
    message: kind === 'media' ? 'A viewport breakpoint.' : 'A container breakpoint written as a length.',
    hint: 'Use intrinsic layout, or @container style(--smbk-layout: narrow) / wide.',
  });
}

// ---------------------------------------------------------------- look-alikes

export interface Element {
  tag: string;
  classes: string[];
  attrs: Record<string, string | undefined>;
  /** For <summary>: whether the enclosing <details> was already reported. */
  parentReported?: boolean;
}

const ROLE_COMPONENTS: Record<string, string[]> = {
  button: ['button'],
  checkbox: ['checkbox'],
  radio: ['radio'],
  switch: ['switch'],
  tablist: ['tabs'],
  dialog: ['modal', 'drawer', 'popover'],
  alertdialog: ['modal'],
  menu: ['dropdown'],
  progressbar: ['progress'],
  tooltip: ['tooltip'],
  combobox: ['select'],
  listbox: ['select'],
};

function candidates(el: Element): string[] | null {
  const type = (el.attrs.type ?? 'text').toLowerCase();
  const role = el.attrs.role?.toLowerCase();
  switch (el.tag) {
    case 'button': return ['button'];
    case 'input':
      if (role === 'switch') return ['switch'];
      if (type === 'checkbox') return ['checkbox'];
      if (type === 'radio') return ['radio'];
      if (type === 'search') return ['search-field', 'input'];
      if (['submit', 'button', 'reset'].includes(type)) return ['button'];
      if (['hidden', 'file', 'range', 'color', 'image'].includes(type)) return null;
      return ['input'];
    case 'select': return ['select'];
    case 'textarea': return ['text-area'];
    case 'dialog': return ['modal', 'drawer'];
    case 'details': return ['accordion'];
    case 'summary': return el.parentReported ? null : ['accordion'];
    case 'table': return ['table'];
    case 'progress': return ['progress'];
    default: return role ? ROLE_COMPONENTS[role] ?? null : null;
  }
}

/** Returns true when the element was reported, so a <summary> inside it is not reported twice. */
export function checkElement(ctx: Ctx, el: Element, line: number, inTsx: boolean): boolean {
  if (el.classes.some((c) => c.startsWith('smbk-'))) return false;
  const names = candidates(el);
  if (!names) return false;
  const found = names.map((n) => ctx.system.components.get(n)).filter((c) => c !== undefined);
  if (!found.length) return false;
  const role = el.attrs.role && !['button', 'input', 'select', 'textarea', 'dialog', 'details', 'summary', 'table', 'progress'].includes(el.tag) ? ` role="${el.attrs.role}"` : '';
  const type = el.tag === 'input' && el.attrs.type ? ` type="${el.attrs.type}"` : '';
  const cls = el.classes.length ? ` class="${show(el.classes.join(' '))}"` : '';
  const use = found.map((c) => (inTsx ? `<${c.wrapper}>` : `the ${c.name} component (${c.block})`)).join(' or ');
  ctx.out.add({
    rule: 'look-alike', file: ctx.file, line, text: clip(`<${el.tag}${type}${role}${cls}>`),
    message: `Native <${el.tag}>${role ? ` with${role}` : ''} built by hand.`,
    hint: `Use ${use}.`,
  });
  return true;
}

// ---------------------------------------------------------------- suggestions

function closest(name: string, pool: Iterable<string>): string | undefined {
  let best: string | undefined;
  let bestScore = Math.max(2, Math.floor(name.length * 0.2)) + 1;
  for (const candidate of pool) {
    if (Math.abs(candidate.length - name.length) >= bestScore) continue;
    const d = distance(name, candidate, bestScore);
    if (d < bestScore) {
      bestScore = d;
      best = candidate;
    }
  }
  return best;
}

function distance(a: string, b: string, cap: number): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(prev[j]! + 1, row[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
      row.push(v);
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin >= cap) return cap;
    prev = row;
  }
  return prev[b.length]!;
}
