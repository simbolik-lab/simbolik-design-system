/**
 * Reference resolution with the three checks the standard asks of any
 * conforming tool: no unresolved reference, no cycle, no alias to an
 * incompatible type. This is independent of Style Dictionary on purpose,
 * so that the build can explain a failure in the token's own terms.
 */
import { isPureReference, referenceTarget, referencesIn, isDurationValue, isCubicBezierShape, cubicBezierXInRange, type Token } from './dtcg.js';
import type { LoadedToken } from './load.js';

export interface Problem {
  path: string;
  message: string;
}

/** Expected $type of each field inside a composite value. */
const COMPOSITE_FIELD_TYPES: Record<string, Record<string, string>> = {
  typography: { fontFamily: 'fontFamily', fontSize: 'dimension', fontWeight: 'fontWeight', letterSpacing: 'dimension', lineHeight: 'number' },
  shadow: { color: 'color', offsetX: 'dimension', offsetY: 'dimension', blur: 'dimension', spread: 'dimension' },
};

/**
 * What a literal of each type must look like, where the standard is exact about it
 * and the build has no other way to notice. Returns the problem, or null when the
 * value is fine. The two motion types are the ones authored by hand in this
 * repository, so they are the ones a slip can reach.
 */
const LITERAL_SHAPES: Record<string, (v: unknown) => string | null> = {
  duration: (v) => (isDurationValue(v) ? null : `is a duration but its value is not a number of ms or s (${JSON.stringify(v)})`),
  cubicBezier: (v) => {
    if (!isCubicBezierShape(v)) return `is a cubic Bézier curve but its value is not four numbers (${JSON.stringify(v)})`;
    return cubicBezierXInRange(v) ? null : `is a cubic Bézier curve whose x coordinates are not between 0 and 1 (${JSON.stringify(v)})`;
  },
};

export class Resolver {
  constructor(private readonly tokens: Map<string, LoadedToken>) {}

  get(path: string): LoadedToken | undefined {
    return this.tokens.get(path);
  }

  /** Follow a chain of pure references to the token that finally holds a literal. */
  terminal(path: string, stack: string[] = []): LoadedToken {
    const token = this.tokens.get(path);
    if (!token) throw new ResolveError(stack[0] ?? path, `references "{${path}}", which does not exist`);
    if (stack.includes(path)) throw new ResolveError(stack[0]!, `resolves back to itself: ${[...stack, path].join(' -> ')}`);
    if (isPureReference(token.token.$value)) {
      return this.terminal(referenceTarget(token.token.$value), [...stack, path]);
    }
    return token;
  }

  /** The fully resolved value of a token: every reference, at any depth, replaced by its literal. */
  resolvedValue(path: string): unknown {
    const token = this.tokens.get(path);
    if (!token) throw new ResolveError(path, 'does not exist');
    return this.resolveValue(token.token.$value, [path]);
  }

  private resolveValue(value: unknown, stack: string[]): unknown {
    if (isPureReference(value)) {
      const target = referenceTarget(value);
      if (stack.includes(target)) throw new ResolveError(stack[0]!, `resolves back to itself: ${[...stack, target].join(' -> ')}`);
      const t = this.tokens.get(target);
      if (!t) throw new ResolveError(stack[0]!, `references "{${target}}", which does not exist`);
      return this.resolveValue(t.token.$value, [...stack, target]);
    }
    if (typeof value === 'string' && referencesIn(value).length > 0) {
      throw new ResolveError(stack[0]!, `has a reference embedded in a longer string ("${value}"); only whole-value references are supported`);
    }
    if (Array.isArray(value)) return value.map((v) => this.resolveValue(v, stack));
    if (typeof value === 'object' && value !== null) {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, this.resolveValue(v, stack)]));
    }
    return value;
  }

  /** Every problem with one token: missing type, unresolved, cyclic, or mistyped alias. */
  check(token: LoadedToken): Problem[] {
    const problems: Problem[] = [];
    const type = token.token.$type;
    if (typeof type !== 'string') {
      problems.push({ path: token.path, message: 'has no $type' });
      return problems;
    }
    try {
      this.resolvedValue(token.path);
    } catch (e) {
      if (e instanceof ResolveError) problems.push({ path: e.path, message: e.message });
      else throw e;
    }
    if (problems.length) return problems;

    // Type compatibility of every alias, whole-value or inside a composite.
    const v = token.token.$value;
    if (!isPureReference(v)) {
      const shape = LITERAL_SHAPES[type]?.(v);
      if (shape) problems.push({ path: token.path, message: shape });
    }
    if (isPureReference(v)) {
      const target = this.terminal(referenceTarget(v));
      if (target.token.$type !== type) {
        problems.push({ path: token.path, message: `is a ${type} but aliases "{${target.path}}", which is a ${target.token.$type}` });
      }
    } else {
      const fields = COMPOSITE_FIELD_TYPES[type];
      if (fields) {
        const entries = Array.isArray(v) ? v.flatMap((e) => Object.entries(e as object)) : Object.entries(v as object);
        for (const [field, fv] of entries) {
          const expected = fields[field];
          if (expected && isPureReference(fv)) {
            const target = this.terminal(referenceTarget(fv));
            if (target.token.$type !== expected) {
              problems.push({ path: token.path, message: `field "${field}" must be a ${expected} but aliases "{${target.path}}", which is a ${target.token.$type}` });
            }
          }
        }
      }
    }
    return problems;
  }
}

export class ResolveError extends Error {
  constructor(public readonly path: string, message: string) {
    super(message);
  }
}

export function tokenOf(t: LoadedToken): Token {
  return t.token;
}
