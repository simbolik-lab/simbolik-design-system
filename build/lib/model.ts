/**
 * The build model: every token once, with what it is called in CSS, whether
 * it is emitted at all, its resolved value in every context combination, and
 * which axis (if any) changes it. Both Style Dictionary formats read this;
 * nothing else re-derives it.
 */
import { isPureReference, referenceTarget, isDimensionValue, isDurationValue, isCubicBezierShape, type DimensionValue } from './dtcg.js';
import { combinations, combinationKey, defaultCombination, tokensFor, type Combination, type LoadedToken, type TokenSource } from './load.js';
import { Resolver } from './resolve.js';
import { cssName, cssPartName, TYPOGRAPHY_PARTS } from './naming.js';
import { isEmitted, CONTEXT_CSS } from '../config.js';

export interface ModelToken {
  path: string;
  segments: string[];
  type: string;
  tier: 'primitive' | 'semantic';
  category: string;
  owner: string;
  emitted: boolean;
  /** CSS custom property names this token produces (one, or one per typography part). */
  cssNames: Record<string, string>;
  description?: string;
  /** The value as written in the source (references intact), in the default context. */
  original: unknown;
  /** Resolved literal value per combination key. */
  resolved: Record<string, unknown>;
  /** CSS declarations per combination key: css name -> expression (var() where the target is emitted). */
  css: Record<string, Record<string, string>>;
  /** The one modifier whose contexts change this token's CSS, if any. */
  axis: string | null;
  /**
   * Declarations that must be repeated inside a context's scoped block because they
   * reference (via var()) a token that changes on that axis. Keyed by axis.
   */
  dependent: Record<string, string[]>;
  /** Extensions carried on the token (e.g. the text transform pulled out of a typography composite). */
  extensions?: Record<string, unknown>;
}

export interface Model {
  tokens: ModelToken[];
  byPath: Map<string, ModelToken>;
  combos: Combination[];
  defaults: Combination;
  axes: Record<string, { values: string[]; default: string }>;
}

export function quoteFontFamily(v: unknown): string {
  const families = Array.isArray(v) ? v : [v];
  return families.map((f) => (/[^a-zA-Z0-9-]/.test(String(f)) ? `"${String(f)}"` : String(f))).join(', ');
}

/** A resolved literal value as CSS text. */
export function literalToCss(type: string, value: unknown): string {
  switch (type) {
    case 'dimension':
      if (isDimensionValue(value)) return `${value.value}${value.unit}`;
      throw new Error(`dimension value is not { value, unit }: ${JSON.stringify(value)}`);
    case 'color':
      return String(value);
    case 'number':
    case 'fontWeight':
      return String(value);
    case 'fontFamily':
      return quoteFontFamily(value);
    case 'shadow': {
      const layers = Array.isArray(value) ? value : [value];
      return layers.map((l) => shadowLayerToCss(l as Record<string, unknown>, (c) => String(c))).join(', ');
    }
    case 'duration':
      if (isDurationValue(value)) return `${value.value}${value.unit}`;
      throw new Error(`duration value is not { value, unit: ms | s }: ${JSON.stringify(value)}`);
    case 'cubicBezier':
      if (isCubicBezierShape(value)) return `cubic-bezier(${value.join(', ')})`;
      throw new Error(`cubicBezier value is not four numbers: ${JSON.stringify(value)}`);
    default:
      throw new Error(`No CSS rendering for a ${type} literal.`);
  }
}

function shadowLayerToCss(layer: Record<string, unknown>, color: (c: unknown) => string): string {
  const dim = (d: unknown) => (isDimensionValue(d) ? `${d.value}${d.unit}` : String(d));
  const parts = [dim(layer.offsetX), dim(layer.offsetY), dim(layer.blur), dim(layer.spread), color(layer.color)];
  return (layer.inset ? 'inset ' : '') + parts.join(' ');
}

export function buildModel(source: TokenSource): Model {
  const combos = combinations(source);
  const defaults = defaultCombination(source);
  const axes = Object.fromEntries(
    Object.entries(source.resolver.modifiers).map(([n, m]) => [n, { values: [m.default, ...Object.keys(m.contexts).filter((c) => c !== m.default)], default: m.default }]),
  );
  const defaultTokens = tokensFor(source, defaults);

  const emittedOf = (t: LoadedToken) => isEmitted(t.category, t.tier);

  const tokens: ModelToken[] = [];
  for (const t of defaultTokens.values()) {
    const type = t.token.$type as string;
    const emitted = emittedOf(t);
    const cssNames: Record<string, string> = {};
    if (emitted) {
      if (type === 'typography') for (const part of Object.keys(TYPOGRAPHY_PARTS)) cssNames[part] = cssPartName(t.segments, part);
      else cssNames.value = cssName(t.segments);
    }
    tokens.push({
      path: t.path,
      segments: t.segments,
      type,
      tier: t.tier,
      category: t.category,
      owner: t.owner,
      emitted,
      cssNames,
      description: t.token.$description,
      original: t.token.$value,
      resolved: {},
      css: {},
      axis: null,
      dependent: {},
      extensions: t.token.$extensions,
    });
  }
  const byPath = new Map(tokens.map((t) => [t.path, t]));

  for (const combo of combos) {
    const key = combinationKey(combo);
    const inForce = tokensFor(source, combo);
    const resolver = new Resolver(inForce);

    /** CSS expression for a value: var() when it points at an emitted token, otherwise the literal. */
    const expr = (value: unknown, type: string): string => {
      if (isPureReference(value)) {
        const targetPath = referenceTarget(value);
        const target = byPath.get(targetPath);
        if (target?.emitted && target.type !== 'typography') return `var(${target.cssNames.value})`;
        const terminal = resolver.terminal(targetPath);
        return literalToCss(terminal.token.$type as string, resolver.resolvedValue(terminal.path));
      }
      if (type === 'shadow') {
        const layers = Array.isArray(value) ? value : [value];
        return layers.map((l) => shadowLayerToCss(l as Record<string, unknown>, (c) => expr(c, 'color'))).join(', ');
      }
      return literalToCss(type, value);
    };

    for (const t of tokens) {
      const live = inForce.get(t.path)!;
      t.resolved[key] = resolver.resolvedValue(t.path);
      if (!t.emitted) continue;
      const decls: Record<string, string> = {};
      if (t.type === 'typography') {
        const value = live.token.$value as Record<string, unknown>;
        for (const [part, name] of Object.entries(t.cssNames)) {
          if (part === 'textTransform') {
            const ext = (live.token.$extensions?.['com.simbolik'] as Record<string, unknown> | undefined)?.textTransform;
            decls[name] = typeof ext === 'string' ? ext : 'none';
          } else if (part in value) {
            const fieldType = { fontFamily: 'fontFamily', fontSize: 'dimension', fontWeight: 'fontWeight', lineHeight: 'number', letterSpacing: 'dimension' }[part]!;
            decls[name] = expr(value[part], fieldType);
          }
        }
      } else {
        decls[t.cssNames.value!] = expr(live.token.$value, t.type);
      }
      t.css[key] = decls;
    }
  }

  // Which axis changes each token. More than one is an impossible combination and a build failure.
  for (const t of tokens) {
    const changing = new Set<string>();
    const defaultKey = combinationKey(defaults);
    const baseline = JSON.stringify(t.emitted ? t.css[defaultKey] : t.resolved[defaultKey]);
    for (const [axis, a] of Object.entries(axes)) {
      for (const ctx of a.values) {
        const key = combinationKey({ ...defaults, [axis]: ctx });
        const value = JSON.stringify(t.emitted ? t.css[key] : t.resolved[key]);
        if (value !== baseline) changing.add(axis);
      }
    }
    if (changing.size > 1) throw new Error(`"${t.path}" changes with more than one context (${[...changing].join(', ')}); a token may follow one axis only.`);
    t.axis = changing.size === 1 ? [...changing][0]! : null;
  }

  // A declaration that references (via var) a token on an attribute axis is repeated inside
  // that axis's scoped blocks, so that it re-resolves against the scoped value rather than
  // the one inherited from the root. Media axes need none of this: they only ever apply to :root.
  const varRef = /var\((--[a-z0-9-]+)\)/g;
  const nameToToken = new Map<string, ModelToken>();
  for (const t of tokens) for (const n of Object.values(t.cssNames)) nameToToken.set(n, t);
  const attributeAxes = new Set(Object.keys(axes).filter((a) => CONTEXT_CSS[a]?.kind === 'attribute'));
  const axesOf = (t: ModelToken): Set<string> => new Set([...(t.axis ? [t.axis] : []), ...Object.keys(t.dependent)]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const t of tokens) {
      if (!t.emitted) continue;
      for (const [name, value] of Object.entries(t.css[combinationKey(defaults)] ?? {})) {
        for (const m of value.matchAll(varRef)) {
          const dep = nameToToken.get(m[1]!);
          if (!dep) continue;
          for (const axis of axesOf(dep)) {
            if (!attributeAxes.has(axis) || t.axis === axis) continue;
            const list = (t.dependent[axis] ??= []);
            if (!list.includes(name)) {
              list.push(name);
              changed = true;
            }
          }
        }
      }
    }
  }

  return { tokens, byPath, combos, defaults, axes };
}

/** The combination that differs from the defaults on exactly one axis. */
export function comboFor(model: Model, axis: string, context: string): Combination {
  return { ...model.defaults, [axis]: context };
}

/** A resolved literal as a plain value for TypeScript and JSON: numbers stay numbers, font families stay unquoted. */
export function literalToPlain(type: string, value: unknown): string | number {
  switch (type) {
    case 'number':
    case 'fontWeight':
      return value as number;
    case 'fontFamily':
      return Array.isArray(value) ? value.join(', ') : String(value);
    default:
      return literalToCss(type, value);
  }
}

/** Resolved literal value of a token in a combination as a plain value (no var()). */
export function resolvedPlain(t: ModelToken, key: string): string | number | Record<string, string | number> {
  if (t.type === 'typography') {
    const v = t.resolved[key] as Record<string, unknown>;
    const out: Record<string, string | number> = {};
    for (const [part] of Object.entries(TYPOGRAPHY_PARTS)) {
      if (part === 'textTransform') {
        const ext = (t.extensions?.['com.simbolik'] as Record<string, unknown> | undefined)?.textTransform;
        if (typeof ext === 'string') out[part] = ext;
      } else if (part in v) {
        const fieldType = { fontFamily: 'fontFamily', fontSize: 'dimension', fontWeight: 'fontWeight', lineHeight: 'number', letterSpacing: 'dimension' }[part]!;
        out[part] = literalToPlain(fieldType, v[part]);
      }
    }
    return out;
  }
  return literalToPlain(t.type, t.resolved[key]);
}

export function mediaQueryFor(model: Model, axis: string, context: string): string {
  const cfg = CONTEXT_CSS[axis];
  if (!cfg || cfg.kind !== 'media') throw new Error(`Axis "${axis}" is not a media axis.`);
  const q = cfg.queries[context];
  if (!q) throw new Error(`No media query configured for ${axis}=${context}.`);
  return substituteDimensions(model, q, `Media query for ${axis}=${context}`);
}

/** Replace every {token.path} in a query with the token's resolved default value; dimensions only. */
export function substituteDimensions(model: Model, query: string, what: string): string {
  return query.replace(/\{([^}]+)\}/g, (_m, path: string) => {
    const t = model.byPath.get(path);
    if (!t) throw new Error(`${what} references "${path}", which does not exist.`);
    const v = t.resolved[combinationKey(model.defaults)];
    if (!isDimensionValue(v)) throw new Error(`"${path}" must be a dimension to be used in a media query.`);
    return literalToCss('dimension', v as DimensionValue);
  });
}

/** Resolved literal per token, collapsed to one value or to { context: value } on its axis. */
export function valueByContext(model: Model, t: ModelToken): unknown {
  const defaultKey = combinationKey(model.defaults);
  const literal = (key: string) => resolvedPlain(t, key);
  if (t.type === 'typography') {
    const base = literal(defaultKey) as Record<string, string | number>;
    const out: Record<string, unknown> = {};
    for (const part of Object.keys(base)) {
      const perCombo = new Map<string, string | number>();
      for (const combo of model.combos) perCombo.set(combinationKey(combo), (literal(combinationKey(combo)) as Record<string, string | number>)[part]!);
      out[part] = collapse(model, perCombo);
    }
    return out;
  }
  const perCombo = new Map<string, string | number>();
  for (const combo of model.combos) perCombo.set(combinationKey(combo), literal(combinationKey(combo)) as string | number);
  return collapse(model, perCombo);
}

function collapse(model: Model, perCombo: Map<string, string | number>): unknown {
  const defaultKey = combinationKey(model.defaults);
  const baseline = perCombo.get(defaultKey);
  const changing = new Set<string>();
  for (const [axis, a] of Object.entries(model.axes)) {
    for (const ctx of a.values) {
      if (perCombo.get(combinationKey(comboFor(model, axis, ctx))) !== baseline) changing.add(axis);
    }
  }
  if (changing.size === 0) return baseline;
  const axis = [...changing][0]!;
  return Object.fromEntries(model.axes[axis]!.values.map((ctx) => [ctx, perCombo.get(combinationKey(comboFor(model, axis, ctx)))]));
}
