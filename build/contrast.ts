/**
 * Contrast report: the design system's colour contrast rules applied to the token source.
 *
 *   npm run tokens:contrast
 *
 * Reads the built JSON and measures WCAG 2.2 contrast in both themes, from the
 * composited colours, for the pairs listed in contrast-pairs.ts: text on what
 * it really sits on, and the few non-text colours that identify a control, its
 * state or focus. Decorative borders and disabled
 * controls are listed there as not measured, with the reason. It reports; it
 * does not fail the build, because a failing pair is a Figma decision.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

interface Record_ {
  path: string;
  value: string | Record<string, string>;
}

type Rgb = [number, number, number, number];

function parse(hex: string): Rgb {
  const h = hex.replace('#', '');
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
  return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
}

function over(fg: Rgb, bg: Rgb): Rgb {
  const a = fg[3];
  return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1];
}

function luminance([r, g, b]: Rgb): number {
  const ch = (x: number) => {
    const v = x / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

export function contrast(fgHex: string, bgHex: string, canvasHex: string): number {
  const canvas = parse(canvasHex);
  const bg = over(parse(bgHex), canvas);
  const fg = over(parse(fgHex), bg);
  const [l1, l2] = [luminance(fg), luminance(bg)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

import { PAIRS, NEEDS, type ContrastPair } from './contrast-pairs.js';

export interface Measured extends ContrastPair {
  needs: number;
  /** Ratio per theme, rounded to two places. */
  ratios: Record<string, number>;
  passes: Record<string, boolean>;
}

/** Every listed pair, measured in every theme from the composited colours. */
export function measure(jsonFile = join(HERE, '..', 'output', 'tokens.json')): { themes: string[]; rows: Measured[] } {
  const data = JSON.parse(readFileSync(jsonFile, 'utf8')) as { contexts: Record<string, { values: string[] }>; tokens: Record_[] };
  const byPath = new Map(data.tokens.map((t) => [t.path, t]));
  const themes = data.contexts.theme?.values ?? ['light'];
  const value = (path: string, theme: string): string => {
    const t = byPath.get(path);
    if (!t) throw new Error(`Contrast pair names a token that does not exist: ${path}`);
    return typeof t.value === 'string' ? t.value : t.value[theme]!;
  };
  const rows = PAIRS.map((p) => {
    const needs = NEEDS[p.kind];
    const ratios: Record<string, number> = {};
    const passes: Record<string, boolean> = {};
    for (const theme of themes) {
      const r = contrast(value(p.fg, theme), value(p.bg, theme), value('color.surface.canvas', theme));
      ratios[theme] = Math.round(r * 100) / 100;
      passes[theme] = r + 1e-9 >= needs;
    }
    return { ...p, needs, ratios, passes };
  });
  return { themes, rows };
}

export function report(jsonFile?: string): { pass: number; fails: { theme: string; fg: string; bg: string; ratio: number; needs: number; why: string }[] } {
  const { themes, rows } = measure(jsonFile);
  const fails: ReturnType<typeof report>['fails'] = [];
  let pass = 0;
  for (const r of rows) {
    for (const theme of themes) {
      if (r.passes[theme]) pass++;
      else fails.push({ theme, fg: r.fg, bg: r.bg, ratio: r.ratios[theme]!, needs: r.needs, why: r.where });
    }
  }
  return { pass, fails };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { pass, fails } = report();
  console.log(`Contrast: ${pass} pairs pass, ${fails.length} fall short.`);
  if (fails.length) {
    console.log('theme  ratio  needs  foreground -> background  (why)');
    for (const f of fails) console.log(`${f.theme.padEnd(6)} ${String(f.ratio).padStart(5)}  ${String(f.needs).padStart(5)}  ${f.fg} -> ${f.bg}  (${f.why})`);
  }
}
