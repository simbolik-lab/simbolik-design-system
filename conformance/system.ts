/**
 * What the checker knows about the design system, read fresh on every run from
 * the build outputs and the component folders inside simbolik/. Nothing here is
 * hand-listed: classes come from the component stylesheets and manifests,
 * custom properties from the token build, components from their folders.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export interface Component {
  /** Folder name, e.g. "button". */
  name: string;
  /** Block class, e.g. "smbk-btn". */
  block: string;
  /** React wrapper export, e.g. "Button". */
  wrapper: string;
}

export interface Primitive {
  path: string;
  category: string;
  /** Semantic tokens whose reference points at this primitive. */
  usedBy: string[];
}

export interface System {
  root: string;
  classes: Set<string>;
  properties: Set<string>;
  primitives: Map<string, Primitive>;
  components: Map<string, Component>;
  /** First segment after --smbk-, e.g. "color", "space", "motion". */
  families: Set<string>;
  /** Problems met while reading the system; printed, never fatal. */
  notes: string[];
}

/** Replace every CSS comment with spaces, keeping line breaks and string contents. */
export function blankCssComments(css: string): string {
  let out = '';
  let i = 0;
  while (i < css.length) {
    const c = css[i]!;
    if (c === '"' || c === "'") {
      const end = skipString(css, i);
      out += css.slice(i, end);
      i = end;
    } else if (c === '/' && css[i + 1] === '*') {
      const close = css.indexOf('*/', i + 2);
      const end = close === -1 ? css.length : close + 2;
      out += css.slice(i, end).replace(/[^\n]/g, ' ');
      i = end;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

export function skipString(text: string, start: number): number {
  const q = text[start];
  let i = start + 1;
  while (i < text.length && text[i] !== q) {
    if (text[i] === '\\') i++;
    else if (text[i] === '\n') break;
    i++;
  }
  return Math.min(i + 1, text.length);
}

export async function loadSystem(root: string): Promise<System> {
  const notes: string[] = [];
  const classes = new Set<string>();
  const properties = new Set<string>();
  const components = new Map<string, Component>();

  // Custom properties the token build writes.
  const tokensCss = join(root, 'css', 'tokens.css');
  if (existsSync(tokensCss)) {
    for (const m of blankCssComments(readFileSync(tokensCss, 'utf8')).matchAll(/(--smbk-[\w-]+)\s*:/g)) properties.add(m[1]!);
  } else {
    notes.push('simbolik/css/tokens.css is missing: run npm run tokens:build. Every --smbk- reference will read as unknown.');
  }

  // Components: stylesheet classes, internal properties, manifest-derived classes, wrapper name.
  const componentsDir = join(root, 'components');
  const dirs = existsSync(componentsDir)
    ? readdirSync(componentsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
    : [];
  for (const name of dirs) {
    const dir = join(componentsDir, name);
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.css'))) {
      const css = blankCssComments(readFileSync(join(dir, file), 'utf8'));
      for (const m of css.matchAll(/\.(smbk-[\w-]+)/g)) classes.add(m[1]!);
      for (const m of css.matchAll(/(--smbk-[\w-]+)\s*:/g)) properties.add(m[1]!);
    }
    let block = '';
    const manifestFile = join(dir, `${name}.manifest.ts`);
    if (existsSync(manifestFile)) {
      try {
        const mod = (await import(pathToFileURL(manifestFile).href)) as Record<string, unknown>;
        for (const value of Object.values(mod)) {
          const manifest = (value as { manifest?: ManifestShape } | null)?.manifest;
          if (!manifest?.block) continue;
          block ||= manifest.block;
          for (const c of manifestClasses(manifest)) classes.add(c);
        }
      } catch (err) {
        notes.push(`components/${name}/${name}.manifest.ts could not be read (${(err as Error).message.split('\n')[0]}); using its stylesheet only.`);
        block = /block:\s*'(smbk-[\w-]+)'/.exec(readFileSync(manifestFile, 'utf8'))?.[1] ?? '';
      }
    }
    const wrapperFile = join(dir, `${name}.tsx`);
    const wrapper =
      (existsSync(wrapperFile) && /export function ([A-Z]\w*)/.exec(readFileSync(wrapperFile, 'utf8'))?.[1]) ||
      name.replace(/(^|-)([a-z0-9])/g, (_, __, ch: string) => ch.toUpperCase());
    if (block) components.set(name, { name, block, wrapper });
  }
  if (components.size === 0) notes.push('No components found under simbolik/components/.');

  // Primitives that never reach CSS, and which semantics are built on them.
  const primitives = new Map<string, Primitive>();
  const tokensJson = join(root, 'output', 'tokens.json');
  if (existsSync(tokensJson)) {
    try {
      const data = JSON.parse(readFileSync(tokensJson, 'utf8')) as { tokens: TokenRecord[] };
      const byPath = new Map<string, Primitive>();
      for (const t of data.tokens) {
        if (t.emitted) continue;
        const p: Primitive = { path: t.path, category: t.category, usedBy: [] };
        primitives.set(`--smbk-${t.path.replace(/\./g, '-')}`, p);
        byPath.set(t.path, p);
      }
      for (const t of data.tokens) {
        const ref = typeof t.reference === 'string' ? /^\{(.+)\}$/.exec(t.reference)?.[1] : undefined;
        const css = typeof t.css === 'string' ? t.css : undefined;
        if (ref && css && t.emitted) byPath.get(ref)?.usedBy.push(css);
      }
    } catch (err) {
      notes.push(`simbolik/output/tokens.json could not be read (${(err as Error).message}); primitives are recognized by shape only.`);
    }
  }

  const families = new Set<string>();
  for (const p of properties) families.add(p.slice('--smbk-'.length).split('-')[0]!);

  return { root, classes, properties, primitives, components, families, notes };
}

interface ManifestShape {
  block: string;
  axes?: Record<string, { values: readonly string[] }>;
  flags?: Record<string, unknown>;
  parts?: readonly string[];
}

interface TokenRecord {
  path: string;
  category: string;
  emitted: boolean;
  css: unknown;
  reference?: unknown;
}

/** Every class the variant helper can put on the page for this manifest. */
function manifestClasses(m: ManifestShape): string[] {
  const out = [m.block];
  for (const [axis, def] of Object.entries(m.axes ?? {})) for (const v of def.values) out.push(`${m.block}--${axis}-${v}`);
  for (const flag of Object.keys(m.flags ?? {})) out.push(`${m.block}--${flag}`);
  for (const part of m.parts ?? []) out.push(`${m.block}__${part}`);
  return out;
}

/** Colour and type primitives by shape, for when tokens.json cannot be read. */
export function looksPrimitive(name: string): boolean {
  return /^--smbk-(color-[a-z]+-\d+|font-(family|size|weight|line-height|letter-spacing)(-|$))/.test(name);
}
