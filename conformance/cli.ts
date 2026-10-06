/**
 * The conformance checker: does a project use the design system
 * correctly?
 *
 *   npm run conformance -- <project-dir> [--json] [--prefix site-] [--explained]
 *
 * --explained lists every explained finding on its own line; without it each
 * exception is printed once, with its reason, its count and its first places.
 *
 * A relative project path is read from where npm was started, so a project can
 * call it as `npm --prefix <path-to-simbolik> run conformance -- .`.
 *
 * Exit code: 0 clean, 1 violations (stale exceptions included), 2 the check
 * could not run (bad arguments or settings).
 */
import { resolve } from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { checkProject } from './check.js';
import { ConfigError } from './project.js';
import { formatJson, formatReport } from './report.js';

const USAGE = 'Usage: npm run conformance -- <project-dir> [--json] [--prefix <prefix>] [--explained]';

async function main(argv: string[]): Promise<number> {
  let json = false;
  let explained = false;
  let prefix: string | undefined;
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === '--json') json = true;
    else if (a === '--explained') explained = true;
    else if (a === '--prefix') prefix = argv[++i];
    else if (a.startsWith('--prefix=')) prefix = a.slice('--prefix='.length);
    else if (a === '--help' || a === '-h') {
      console.log(USAGE);
      return 0;
    } else if (a.startsWith('--')) {
      console.error(`Unknown option ${a}.\n${USAGE}`);
      return 2;
    } else positional.push(a);
  }
  if (positional.length !== 1 || (prefix !== undefined && !prefix)) {
    console.error(USAGE);
    return 2;
  }
  const dir = resolve(process.env.INIT_CWD ?? process.cwd(), positional[0]!);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    console.error(`${dir} is not a folder.`);
    return 2;
  }
  try {
    const result = await checkProject(dir, { prefix });
    console.log(json ? formatJson(result) : formatReport(result, { explained }));
    return result.summary.violations ? 1 : 0;
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error(err.message);
      return 2;
    }
    throw err;
  }
}

process.exitCode = await main(process.argv.slice(2));
