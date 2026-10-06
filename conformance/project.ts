/**
 * Reading a project that uses the design system: its settings in package.json, the files to scan,
 * and its explained exceptions.
 *
 * package.json:
 *   "simbolik": {
 *     "prefix": "site-",                 the Project Piece class prefix (docs/naming.md)
 *     "allowClasses": ["ph", "ph-*"],    third-party classes the project truly needs
 *     "ignore": ["src/vendor/**", "notes"]   paths never scanned: a glob, or a folder and all below it
 *   }
 *
 * Never scanned, without being listed: node_modules at any depth, dot folders, and at the root site,
 * dist, public and design-system (see SKIP_AT_ROOT). A project lists any other folder it keeps outside
 * its code (notes, records, drafts) under ignore.
 *
 * conformance-exceptions.json: [{ "file", "rule", "match", "reason" }, ...]
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { isRuleId, RETIRED_RULES, type RuleId } from './rules.js';

export interface ProjectConfig {
  dir: string;
  prefix: string;
  allowClasses: string[];
  ignore: string[];
}

export interface Exception {
  file: string;
  rule: RuleId;
  match: string;
  reason: string;
  /** Line of the entry in the exceptions file, for the stale report. */
  line: number;
}

export const EXCEPTIONS_FILE = 'conformance-exceptions.json';

/** Extensions the checker reads. Everything else (images, fonts, SVG) is an asset. */
export const SCANNED = /\.(html?|css|m?js|cjs|jsx|m?ts|cts|tsx|md|markdown)$/i;

/** Folders never scanned, at any depth. */
const SKIP_ANYWHERE = new Set(['node_modules']);
/**
 * Folders never scanned at the project root: build output, copied assets, and the project's `design-system`
 * entry. That entry is the design system itself: a link to the design system's folder (never followed anyway)
 * or a folder holding a copy of a Release bundle, which would otherwise be read as the project's own code. A
 * project never needs to list it in its ignore list.
 */
const SKIP_AT_ROOT = new Set(['site', 'dist', 'public', 'design-system']);

export class ConfigError extends Error {}

export function readConfig(dir: string, prefixOverride?: string): ProjectConfig {
  let settings: { prefix?: unknown; allowClasses?: unknown; ignore?: unknown } = {};
  const pkgFile = join(dir, 'package.json');
  if (existsSync(pkgFile)) {
    try {
      settings = ((JSON.parse(readFileSync(pkgFile, 'utf8')) as { simbolik?: typeof settings }).simbolik ?? {});
    } catch (err) {
      throw new ConfigError(`${pkgFile} is not valid JSON: ${(err as Error).message}`);
    }
  }
  let prefix = prefixOverride ?? (typeof settings.prefix === 'string' ? settings.prefix : '');
  if (!prefix) {
    throw new ConfigError(
      `No project prefix. Set "simbolik": { "prefix": "site-" } in ${pkgFile}, or pass --prefix. Without it no class can be told apart from a stray one.`,
    );
  }
  if (!prefix.endsWith('-')) prefix += '-';
  if (!/^[a-z][a-z0-9]*-$/.test(prefix)) throw new ConfigError(`The prefix "${prefix}" must be lowercase letters and digits followed by a hyphen, like "site-".`);
  if (prefix === 'smbk-') throw new ConfigError(`"${prefix}" belongs to the design system; a project needs its own prefix.`);
  return {
    dir,
    prefix,
    allowClasses: stringList(settings.allowClasses, 'simbolik.allowClasses'),
    ignore: stringList(settings.ignore, 'simbolik.ignore'),
  };
}

function stringList(value: unknown, name: string): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((v) => typeof v !== 'string')) throw new ConfigError(`${name} in package.json must be a list of strings.`);
  return value as string[];
}

/** A small glob: ** crosses folders, * and ? do not. A pattern with no wildcard also matches everything below it. */
export function globToRegExp(pattern: string): RegExp {
  let re = '';
  const p = pattern.replace(/^\.\//, '').replace(/\/$/, '');
  for (let i = 0; i < p.length; i++) {
    const c = p[i]!;
    if (c === '*' && p[i + 1] === '*') {
      if (p[i + 2] === '/') {
        re += '(?:.*/)?';
        i += 2;
      } else {
        re += '.*';
        i += 1;
      }
    } else if (c === '*') re += '[^/]*';
    else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}(?:/.*)?$`);
}

export function listFiles(config: ProjectConfig): string[] {
  const ignore = config.ignore.map(globToRegExp);
  const out: string[] = [];
  const walk = (abs: string) => {
    for (const entry of readdirSync(abs, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = join(abs, entry.name);
      const rel = relative(config.dir, full).split(sep).join('/');
      if (entry.name.startsWith('.')) continue;
      if (ignore.some((re) => re.test(rel))) continue;
      if (entry.isDirectory()) {
        if (SKIP_ANYWHERE.has(entry.name)) continue;
        if (abs === config.dir && SKIP_AT_ROOT.has(entry.name)) continue;
        walk(full);
      } else if (entry.isFile() && SCANNED.test(entry.name)) {
        out.push(rel);
      }
    }
  };
  walk(config.dir);
  return out;
}

/**
 * The project's explained exceptions, and a note for each entry naming a rule the checker no longer has
 * (RETIRED_RULES), which is left out of the list rather than refused.
 */
export function readExceptions(dir: string): { exceptions: Exception[]; notes: string[] } {
  const file = join(dir, EXCEPTIONS_FILE);
  const notes: string[] = [];
  if (!existsSync(file)) return { exceptions: [], notes };
  const text = readFileSync(file, 'utf8');
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new ConfigError(`${EXCEPTIONS_FILE} is not valid JSON: ${(err as Error).message}`);
  }
  const list = Array.isArray(data) ? data : (data as { exceptions?: unknown })?.exceptions;
  if (!Array.isArray(list)) throw new ConfigError(`${EXCEPTIONS_FILE} must be a list of { file, rule, match, reason }.`);
  const lines = text.split('\n');
  let searchFrom = 0;
  const exceptions = list.map((entry: unknown, i): Exception | null => {
    const e = entry as Record<string, unknown>;
    for (const key of ['file', 'rule', 'match', 'reason']) {
      if (typeof e[key] !== 'string' || !(e[key] as string).trim()) {
        throw new ConfigError(`${EXCEPTIONS_FILE}, entry ${i + 1}: "${key}" is missing or empty. Every exception names its file, rule and match, and says why.`);
      }
    }
    if (Object.hasOwn(RETIRED_RULES, e.rule as string)) {
      notes.push(`${EXCEPTIONS_FILE}, entry ${i + 1} (${String(e.file)}): the rule "${String(e.rule)}" is gone, so this entry explains nothing. ${RETIRED_RULES[e.rule as string]} Remove the entry.`);
      return null;
    }
    if (!isRuleId(e.rule as string) || e.rule === 'stale-exception') {
      throw new ConfigError(`${EXCEPTIONS_FILE}, entry ${i + 1}: "${String(e.rule)}" is not a rule id.`);
    }
    // Find the entry's line: the first line at or after the previous entry that holds its match text.
    const needle = JSON.stringify(e.match);
    let line = lines.findIndex((l, n) => n >= searchFrom && l.includes(needle));
    if (line === -1) line = searchFrom;
    searchFrom = line + 1;
    return { file: e.file as string, rule: e.rule as RuleId, match: e.match as string, reason: e.reason as string, line: line + 1 };
  });
  return { exceptions: exceptions.filter((e) => e !== null), notes };
}
