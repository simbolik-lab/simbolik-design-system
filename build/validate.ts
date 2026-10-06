/**
 * The rules the build refuses to break (README.md, How it's built).
 *
 *   npm run tokens:validate [-- <tokens-dir>]
 *
 * Fails loudly on: two paths producing one CSS name; a value that resolves back
 * to itself; a reference to a token that does not exist in any combination of
 * theme, density and text size; an alias to an incompatible type. Also on a
 * token without a type, and a modifier whose contexts do not define the same
 * tokens, because both would make one of the above happen later. And on a
 * motion literal the standard would not accept: a duration without a time
 * unit, or an easing curve that is not four numbers with both x coordinates
 * between 0 and 1. And on Figma's code syntax, which normalisation drops: a
 * name written beside the path, which could only repeat it or contradict it.
 */
import { fileURLToPath } from 'node:url';
import { resolve as resolvePath } from 'node:path';
import { loadTokenSource, combinations, combinationKey, tokensFor, TOKENS_DIR_DEFAULT, type TokenSource } from './lib/load.js';
import { Resolver, type Problem } from './lib/resolve.js';
import { cssName, cssPartName, TYPOGRAPHY_PARTS } from './lib/naming.js';
import { isEmitted } from './config.js';

export function validate(source: TokenSource): Problem[] {
  const problems: Problem[] = [];

  // 1. One owner per path. A path in two sets, or in a set and a modifier, or in two
  //    modifiers, would have one silently overwriting the other.
  const owners = new Map<string, Set<string>>();
  for (const t of source.all) {
    const set = owners.get(t.path) ?? new Set<string>();
    set.add(t.owner);
    owners.set(t.path, set);
  }
  for (const [path, set] of owners) {
    if (set.size > 1) problems.push({ path, message: `is defined by more than one source: ${[...set].join(', ')}` });
  }

  // 2. Every context of a modifier defines the same paths.
  for (const [name, contexts] of Object.entries(source.modifiers)) {
    const pathSets = Object.entries(contexts).map(([ctx, tokens]) => [ctx, new Set(tokens.map((t) => t.path))] as const);
    const union = new Set(pathSets.flatMap(([, s]) => [...s]));
    for (const path of union) {
      const missing = pathSets.filter(([, s]) => !s.has(path)).map(([ctx]) => ctx);
      if (missing.length) problems.push({ path, message: `is missing from ${name} context(s): ${missing.join(', ')}` });
    }
  }

  // 3. Two token paths producing one CSS name.
  const names = new Map<string, string>();
  const claim = (name: string, path: string) => {
    const other = names.get(name);
    if (other !== undefined && other !== path) problems.push({ path, message: `produces the CSS name ${name}, already produced by "${other}"` });
    names.set(name, path);
  };
  const seen = new Set<string>();
  for (const t of source.all) {
    if (seen.has(t.path)) continue;
    seen.add(t.path);
    if (!isEmitted(t.category, t.tier)) continue;
    if (t.token.$type === 'typography') {
      for (const part of Object.keys(TYPOGRAPHY_PARTS)) claim(cssPartName(t.segments, part), t.path);
    } else {
      claim(cssName(t.segments), t.path);
    }
  }

  // 4. No second name: Figma's code syntax names a token beside its path, which alone gives its CSS name.
  for (const t of source.all) {
    const figma = (t.token.$extensions as { figma?: Record<string, unknown> } | undefined)?.figma;
    if (figma && 'codeSyntax' in figma) problems.push({ path: t.path, message: "carries Figma's code syntax, a second name beside the one its path gives (normalisation drops it)" });
  }

  // 5. Every token resolves, without cycles, to a compatible type, in every combination.
  for (const combo of combinations(source)) {
    const tokens = tokensFor(source, combo);
    const resolver = new Resolver(tokens);
    const key = combinationKey(combo);
    for (const t of tokens.values()) {
      for (const p of resolver.check(t)) {
        problems.push({ path: p.path, message: `${p.message} (in ${key})` });
      }
    }
  }

  // Report each distinct problem once, even if it appears in several combinations.
  const unique = new Map<string, Problem>();
  for (const p of problems) {
    const bare = p.message.replace(/ \(in [^)]*\)$/, '');
    const k = `${p.path}|${bare}`;
    if (!unique.has(k)) unique.set(k, { path: p.path, message: bare });
  }
  return [...unique.values()];
}

export function validateDir(dir: string): Problem[] {
  return validate(loadTokenSource(dir));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = resolvePath(process.argv[2] ?? TOKENS_DIR_DEFAULT);
  const problems = validateDir(dir);
  if (problems.length) {
    console.error(`Token source is invalid (${problems.length} problem${problems.length === 1 ? '' : 's'}):`);
    for (const p of problems) console.error(`  ${p.path}: ${p.message}`);
    process.exit(1);
  }
  console.log('Token source is valid.');
}
