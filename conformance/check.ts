/**
 * Check one project: read its settings, scan every source file, sort
 * findings into violations and explained ones, and find stale exceptions.
 */
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Collector, type Ctx, type Finding } from './checks.js';
import { checkCss } from './css.js';
import { checkHtml } from './html.js';
import { blankMarkdownCode } from './markdown.js';
import { EXCEPTIONS_FILE, globToRegExp, listFiles, readConfig, readExceptions, type Exception, type ProjectConfig } from './project.js';
import { RULE_ORDER, type RuleId } from './rules.js';
import { scanScript } from './script.js';
import { loadSystem, type System } from './system.js';

/** simbolik/, the folder this checker ships in. */
export const SYSTEM_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

export interface Explained extends Finding {
  reason: string;
  /** The entry in the exceptions file that explains it, so the report can print each entry once. */
  exception: Pick<Exception, 'file' | 'rule' | 'match' | 'line'>;
}

export interface Result {
  project: string;
  prefix: string;
  files: number;
  violations: Finding[];
  explained: Explained[];
  stale: Finding[];
  /** What the reader should know that is not a finding: a part of the system the checker could not read, an exception naming a rule it no longer has. */
  notes: string[];
  summary: {
    rules: Array<{ rule: RuleId; violations: number; explained: number }>;
    violations: number;
    explained: number;
  };
}

export interface Options {
  prefix?: string;
  system?: System;
}

export async function checkProject(dirIn: string, options: Options = {}): Promise<Result> {
  const dir = resolve(dirIn);
  const config = readConfig(dir, options.prefix);
  const { exceptions, notes } = readExceptions(dir);
  const system = options.system ?? (await loadSystem(SYSTEM_ROOT));
  const out = new Collector();
  const files = listFiles(config);
  for (const file of files) checkFile({ file, system, config, out }, readFileSync(join(dir, file), 'utf8'));

  const findings = out.findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule));
  const { violations, explained, stale } = applyExceptions(findings, exceptions);
  return { project: dir, prefix: config.prefix, files: files.length, violations: [...violations, ...stale], explained, stale, notes: [...system.notes, ...notes], summary: summarise(violations, explained, stale) };
}

export function checkFile(ctx: Ctx, text: string): void {
  const f = ctx.file.toLowerCase();
  if (f.endsWith('.css')) checkCss(ctx, text);
  else if (/\.html?$/.test(f)) checkHtml(ctx, text, 0, (c, code, base) => scanScript(c, code, base, 'inline.js'));
  else if (/\.(md|markdown)$/.test(f)) checkHtml(ctx, blankMarkdownCode(text), 0, null);
  else scanScript(ctx, text);
}

function applyExceptions(findings: Finding[], exceptions: Exception[]) {
  const used = new Set<Exception>();
  const violations: Finding[] = [];
  const explained: Explained[] = [];
  const matchers = exceptions.map((e) => ({ e, file: globToRegExp(e.file) }));
  for (const f of findings) {
    const hit = matchers.find((m) => m.e.rule === f.rule && (m.file.test(f.file) || m.e.file === f.file) && f.text.includes(m.e.match));
    if (hit) {
      used.add(hit.e);
      explained.push({ ...f, reason: hit.e.reason, exception: { file: hit.e.file, rule: hit.e.rule, match: hit.e.match, line: hit.e.line } });
    } else violations.push(f);
  }
  const stale: Finding[] = exceptions
    .filter((e) => !used.has(e))
    .map((e) => ({
      rule: 'stale-exception' as const,
      file: EXCEPTIONS_FILE,
      line: e.line,
      text: `${e.file} / ${e.rule} / ${e.match}`,
      message: 'This exception matches no finding.',
      hint: 'Remove it, or correct its file, rule or match.',
    }));
  return { violations, explained, stale };
}

function summarise(violations: Finding[], explained: Explained[], stale: Finding[]): Result['summary'] {
  const rules = RULE_ORDER.map((rule) => ({
    rule,
    violations: (rule === 'stale-exception' ? stale : violations).filter((f) => f.rule === rule).length,
    explained: explained.filter((f) => f.rule === rule).length,
  }));
  return {
    rules,
    violations: violations.length + stale.length,
    explained: explained.length,
  };
}

export type { ProjectConfig };
