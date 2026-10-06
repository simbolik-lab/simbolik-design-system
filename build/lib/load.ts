/**
 * Read the resolver file and the token files it points at, and merge them
 * into one token tree per context combination.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { flatten, type FlatToken, type Group } from './dtcg.js';
import { tierOf } from '../config.js';

export interface Resolver {
  version: string;
  sets: Record<string, { sources: { $ref: string }[] }>;
  modifiers: Record<string, { contexts: Record<string, { $ref: string }[]>; default: string }>;
  resolutionOrder: { $ref: string }[];
}

/** A chosen value for every modifier, e.g. { theme: 'dark', density: 'compact', 'text-size': 'min' }. */
export type Combination = Record<string, string>;

export interface LoadedToken extends FlatToken {
  /** The set or modifier name that owns this token. */
  owner: string;
  tier: 'primitive' | 'semantic';
  category: string;
  file: string;
}

export interface TokenSource {
  dir: string;
  resolver: Resolver;
  /** Every token from every file, including all contexts of every modifier. */
  all: LoadedToken[];
  /** Tokens owned by sets (context-free). */
  base: LoadedToken[];
  /** Tokens per modifier, per context. */
  modifiers: Record<string, Record<string, LoadedToken[]>>;
}

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

function loadFile(dir: string, owner: string, ref: string): LoadedToken[] {
  const file = join(dir, ref);
  const tree = readJson<Group>(file);
  return flatten(tree).map((t) => {
    const category = t.segments[0]!;
    const tier = tierOf(owner, category);
    if (!tier) throw new Error(`build/config.ts has no tier for resolver entry "${owner}".`);
    return { ...t, owner, tier, category, file: ref };
  });
}

export function loadTokenSource(dir: string): TokenSource {
  const resolver = readJson<Resolver>(join(dir, 'simbolik.resolver.json'));
  if (resolver.version !== '2025.10') throw new Error(`Resolver version must be 2025.10, found ${resolver.version}.`);

  const base: LoadedToken[] = [];
  const modifiers: TokenSource['modifiers'] = {};

  for (const entry of resolver.resolutionOrder) {
    const m = /^#\/(sets|modifiers)\/(.+)$/.exec(entry.$ref);
    if (!m) throw new Error(`Unsupported resolutionOrder entry "${entry.$ref}".`);
    const [, kind, name] = m as unknown as [string, 'sets' | 'modifiers', string];
    if (kind === 'sets') {
      const set = resolver.sets[name];
      if (!set) throw new Error(`resolutionOrder names a set "${name}" that does not exist.`);
      for (const src of set.sources) base.push(...loadFile(dir, name, src.$ref));
    } else {
      const mod = resolver.modifiers[name];
      if (!mod) throw new Error(`resolutionOrder names a modifier "${name}" that does not exist.`);
      if (!(mod.default in mod.contexts)) throw new Error(`Modifier "${name}" defaults to "${mod.default}", which is not one of its contexts.`);
      modifiers[name] = {};
      for (const [context, sources] of Object.entries(mod.contexts)) {
        modifiers[name][context] = sources.flatMap((src) => loadFile(dir, name, src.$ref));
      }
    }
  }

  const all = [...base, ...Object.values(modifiers).flatMap((ctx) => Object.values(ctx).flat())];
  return { dir, resolver, all, base, modifiers };
}

/** Every reachable combination of contexts, default first. */
export function combinations(source: TokenSource): Combination[] {
  const axes = Object.entries(source.resolver.modifiers).map(([name, m]) => ({
    name,
    values: [m.default, ...Object.keys(m.contexts).filter((c) => c !== m.default)],
  }));
  let combos: Combination[] = [{}];
  for (const axis of axes) {
    combos = combos.flatMap((c) => axis.values.map((v) => ({ ...c, [axis.name]: v })));
  }
  return combos;
}

export function defaultCombination(source: TokenSource): Combination {
  return Object.fromEntries(Object.entries(source.resolver.modifiers).map(([n, m]) => [n, m.default]));
}

export function combinationKey(c: Combination): string {
  return Object.entries(c).map(([k, v]) => `${k}=${v}`).join(',');
}

/** The tokens in force for one combination, as a map by path. */
export function tokensFor(source: TokenSource, combo: Combination): Map<string, LoadedToken> {
  const map = new Map<string, LoadedToken>();
  for (const t of source.base) map.set(t.path, t);
  for (const [name, contexts] of Object.entries(source.modifiers)) {
    const chosen = combo[name];
    if (chosen === undefined) throw new Error(`Combination is missing a value for "${name}".`);
    const tokens = contexts[chosen];
    if (!tokens) throw new Error(`Modifier "${name}" has no context "${chosen}".`);
    for (const t of tokens) map.set(t.path, t);
  }
  return map;
}

export const TOKENS_DIR_DEFAULT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'tokens');
