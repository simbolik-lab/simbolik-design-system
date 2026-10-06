/**
 * Shared helpers for reading DTCG 2025.10 token files.
 *
 * Nothing in here knows about Figma, the export, or CSS. It is the
 * vocabulary the normaliser, the validator and the build all share:
 * a token tree, a flat list of tokens with paths,
 * and the curly-brace reference syntax.
 */

export type DimensionValue = { value: number; unit: 'px' | 'rem' };

export type TokenValue =
  | string
  | number
  | boolean
  | DimensionValue
  | Record<string, unknown>
  | unknown[];

export interface Token {
  $type?: string;
  $value: TokenValue;
  $description?: string;
  $extensions?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Group {
  $type?: string;
  $description?: string;
  $extensions?: Record<string, unknown>;
  [key: string]: Token | Group | string | Record<string, unknown> | undefined;
}

export interface FlatToken {
  /** Dot-joined path, without any collection prefix. */
  path: string;
  segments: string[];
  token: Token;
}

export function isToken(node: unknown): node is Token {
  return typeof node === 'object' && node !== null && '$value' in (node as object);
}

/** Walk a token tree and return every token with its path. Inherited $type is applied. */
export function flatten(tree: Group, inheritedType?: string): FlatToken[] {
  const out: FlatToken[] = [];
  const walk = (node: Group, segments: string[], type: string | undefined) => {
    const groupType = typeof node.$type === 'string' ? node.$type : type;
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      if (isToken(child)) {
        const token: Token = { ...child };
        if (token.$type === undefined && groupType !== undefined) token.$type = groupType;
        out.push({ path: [...segments, key].join('.'), segments: [...segments, key], token });
      } else if (typeof child === 'object' && child !== null) {
        walk(child as Group, [...segments, key], groupType);
      }
    }
  };
  walk(tree, [], inheritedType);
  return out;
}

const REFERENCE = /\{([^{}]+)\}/g;

/** Every `{path}` reference inside a value, at any depth. */
export function referencesIn(value: unknown): string[] {
  const refs: string[] = [];
  const visit = (v: unknown) => {
    if (typeof v === 'string') {
      for (const m of v.matchAll(REFERENCE)) refs.push(m[1]!.trim());
    } else if (Array.isArray(v)) {
      v.forEach(visit);
    } else if (typeof v === 'object' && v !== null) {
      Object.values(v).forEach(visit);
    }
  };
  visit(value);
  return refs;
}

/** True when the whole value is exactly one reference, e.g. "{color.frost.50}". */
export function isPureReference(value: unknown): value is string {
  return typeof value === 'string' && /^\{[^{}]+\}$/.test(value.trim());
}

export function referenceTarget(value: string): string {
  return value.trim().slice(1, -1).trim();
}

/** Insert a token at a dotted path inside a tree, creating groups as needed. */
export function setAtPath(tree: Group, segments: string[], token: Token): void {
  let node: Group = tree;
  for (const seg of segments.slice(0, -1)) {
    const next = node[seg];
    if (next === undefined) {
      const created: Group = {};
      node[seg] = created;
      node = created;
    } else if (isToken(next)) {
      throw new Error(`Cannot create group "${segments.join('.')}": "${seg}" is already a token.`);
    } else {
      node = next as Group;
    }
  }
  const leaf = segments[segments.length - 1]!;
  if (node[leaf] !== undefined) {
    throw new Error(`Duplicate token path "${segments.join('.')}".`);
  }
  node[leaf] = token;
}

export function formatDimension(d: DimensionValue): string {
  return `${d.value}${d.unit}`;
}

/** A DTCG duration: a number and a time unit. */
export type DurationValue = { value: number; unit: 'ms' | 's' };

export function isDurationValue(v: unknown): v is DurationValue {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as DurationValue).value === 'number' &&
    (v as DurationValue).value >= 0 &&
    ((v as DurationValue).unit === 'ms' || (v as DurationValue).unit === 's')
  );
}

/** A DTCG cubic Bézier: four numbers, P1x P1y P2x P2y. */
export function isCubicBezierShape(v: unknown): v is [number, number, number, number] {
  return Array.isArray(v) && v.length === 4 && v.every((n) => typeof n === 'number' && Number.isFinite(n));
}

/** The standard's own limit: both x coordinates lie between 0 and 1, so time never runs backwards. */
export function cubicBezierXInRange(v: [number, number, number, number]): boolean {
  return v[0] >= 0 && v[0] <= 1 && v[2] >= 0 && v[2] <= 1;
}

export function isDimensionValue(v: unknown): v is DimensionValue {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as DimensionValue).value === 'number' &&
    typeof (v as DimensionValue).unit === 'string'
  );
}
