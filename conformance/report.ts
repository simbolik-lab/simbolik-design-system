/**
 * The human report: violations grouped by rule then file, the explained
 * exceptions, stale exceptions, then a summary. Every exception is printed on
 * every run with its reason: once, with how many findings it
 * explains and the first places, or each finding on its own line with
 * `--explained` (printed once, one long reason over hundreds of findings
 * would make a run's report far too long to read).
 */
import type { Result } from './check.js';
import type { Finding } from './checks.js';
import { RULE_ORDER, RULES } from './rules.js';

/** How many places an exception's line names before "and N more". */
const PLACES = 3;

export function formatReport(r: Result, { explained: everyFinding = false }: { explained?: boolean } = {}): string {
  const out: string[] = [];
  const advice = (text: string) => text.replace(/\{prefix\}/g, r.prefix);
  out.push(`Conformance check: ${r.project}`);
  out.push(`Project prefix: ${r.prefix}   Files scanned: ${r.files}`);
  for (const note of r.notes) out.push(`Note: ${note}`);
  out.push('');

  const byRule = group(r.violations, (f) => f.rule);
  if (r.violations.length) out.push('VIOLATIONS', '');
  for (const rule of RULE_ORDER) {
    const list = byRule.get(rule);
    if (!list?.length) continue;
    out.push(`${rule}: ${RULES[rule].title} (${list.length})`);
    out.push(wrap(advice(RULES[rule].advice), '  '));
    for (const [file, items] of group(list, (f) => f.file)) {
      out.push(`  ${file}`);
      for (const f of items) out.push(line(f, file));
    }
    out.push('');
  }

  const byException = group(r.explained, (f) => f.exception.line);
  out.push(`EXPLAINED (not counted; every exception is printed on every run) (${r.explained.length} finding${r.explained.length === 1 ? '' : 's'}, ${byException.size} exception${byException.size === 1 ? '' : 's'})`);
  if (!r.explained.length) out.push('  None.');
  if (everyFinding) {
    for (const f of r.explained) {
      out.push(`  ${f.rule}  ${f.file}:${f.line}  ${f.text}`);
      out.push(`      reason: ${f.reason}`);
    }
  } else {
    for (const items of byException.values()) {
      const e = items[0]!.exception;
      const places = items.slice(0, PLACES).map((f) => `${f.file}:${f.line}`);
      out.push(`  ${e.rule}  ${e.file}  "${e.match}"  ${items.length} finding${items.length === 1 ? '' : 's'}: ${places.join(', ')}${items.length > PLACES ? `, and ${items.length - PLACES} more` : ''}`);
      out.push(`      reason: ${items[0]!.reason}`);
    }
    if (r.explained.length > byException.size) out.push('  Every explained finding on its own line: add --explained.');
  }
  out.push('');

  const byName = group(r.leaving, (l) => l.name);
  out.push(`ON THEIR WAY OUT (not violations: each name still works until a later Release removes it) (${r.leaving.length} use${r.leaving.length === 1 ? '' : 's'} of ${byName.size} name${byName.size === 1 ? '' : 's'})`);
  if (!r.leaving.length) out.push('  None.');
  for (const [name, items] of byName) {
    const places = items.slice(0, PLACES).map((l) => `${l.file}:${l.line}`);
    out.push(`  ${name}  ${items.length} use${items.length === 1 ? '' : 's'}: ${places.join(', ')}${items.length > PLACES ? `, and ${items.length - PLACES} more` : ''}`);
    out.push(`      ${items[0]!.instead}`);
  }
  out.push('');

  out.push('SUMMARY');
  const rows = r.summary.rules.filter((row) => row.violations || row.explained);
  const width = Math.max(4, ...rows.map((row) => row.rule.length));
  out.push(`  ${'Rule'.padEnd(width)}  Violations  Explained`);
  for (const row of rows) out.push(`  ${row.rule.padEnd(width)}  ${String(row.violations).padStart(10)}  ${String(row.explained).padStart(9)}`);
  out.push(`  ${'Total'.padEnd(width)}  ${String(r.summary.violations).padStart(10)}  ${String(r.summary.explained).padStart(9)}`);
  if (r.summary.leaving.uses) out.push(`  On their way out: ${r.summary.leaving.uses} use${r.summary.leaving.uses === 1 ? '' : 's'} of ${r.summary.leaving.names} name${r.summary.leaving.names === 1 ? '' : 's'}`);
  out.push('');
  out.push(r.summary.violations ? `Result: ${r.summary.violations} violation${r.summary.violations === 1 ? '' : 's'}.` : 'Result: clean.');
  return out.join('\n');
}

function line(f: Finding, file: string): string {
  const head = `    ${file}:${f.line}  ${f.text}`;
  const tail = [f.message, f.hint].filter(Boolean).join(' ');
  return `${head}\n      ${tail}`;
}

function group<T, K>(items: T[], key: (t: T) => K): Map<K, T[]> {
  const m = new Map<K, T[]>();
  for (const it of items) {
    const k = key(it);
    const list = m.get(k);
    if (list) list.push(it);
    else m.set(k, [it]);
  }
  return m;
}

function wrap(text: string, indent: string, width = 100): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > width - indent.length) {
      lines.push(current);
      current = w;
    } else current = (current + ' ' + w).trim();
  }
  if (current) lines.push(current);
  return lines.map((l) => indent + l).join('\n');
}

export function formatJson(r: Result): string {
  return JSON.stringify(
    {
      project: r.project,
      prefix: r.prefix,
      files: r.files,
      summary: r.summary,
      violations: r.violations,
      explained: r.explained,
      stale: r.stale,
      leaving: r.leaving,
      notes: r.notes,
    },
    null,
    2,
  );
}
