/**
 * Contrast report: the design system's colour contrast rules applied to the token source.
 *
 *   npm run tokens:contrast
 *
 * Reads the built JSON and measures WCAG 2.2 contrast in both themes, from the
 * composited colours, for the pairs listed in contrast-pairs.ts: text on what
 * it really sits on, and the few non-text colours that identify a control, its
 * state or focus. Decorative borders and disabled
 * controls are listed there as not measured, with the reason. It also measures
 * how far apart the categorical data colors that sit side by side in a chart look
 * to readers with each kind of color blindness. It reports; it does not fail the
 * build, because a failing pair is a Figma decision.
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

/** The brightest and the darkest a picture can be: a band laid over a photograph is measured over both. */
const PICTURES: Rgb[] = [[255, 255, 255, 1], [0, 0, 0, 1]];

export function contrast(fgHex: string, bgHex: string, canvasHex: string | Rgb): number {
  const canvas = typeof canvasHex === 'string' ? parse(canvasHex) : canvasHex;
  const bg = over(parse(bgHex), canvas);
  const fg = over(parse(fgHex), bg);
  const [l1, l2] = [luminance(fg), luminance(bg)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

import { PAIRS, NEEDS, CATEGORICAL, SEPARATION, type ContrastPair } from './contrast-pairs.js';

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
      // A background laid over a picture counts its worst picture; any other, the page's canvas under it.
      const r = p.under === 'picture'
        ? Math.min(...PICTURES.map((picture) => contrast(value(p.fg, theme), value(p.bg, theme), picture)))
        : contrast(value(p.fg, theme), value(p.bg, theme), value('color.surface.canvas', theme));
      ratios[theme] = Math.round(r * 100) / 100;
      passes[theme] = r + 1e-9 >= needs;
    }
    return { ...p, needs, ratios, passes };
  });
  return { themes, rows };
}

/** The three kinds of color blindness, as changes to a color in linear RGB (Machado, Oliveira and Fernandes, 2009, at full strength). */
const VISION = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
} as const;

export type Vision = 'normal' | keyof typeof VISION;

function linear(hex: string): [number, number, number] {
  const [r, g, b] = parse(hex);
  const ch = (x: number) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return [ch(r), ch(g), ch(b)];
}

function oklab([r, g, b]: [number, number, number]): [number, number, number] {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

/** How far apart two colors look to a reader with the given vision: the OKLab distance times 100. */
export function separation(aHex: string, bHex: string, vision: Vision): number {
  const seen = (hex: string): [number, number, number] => {
    const c = linear(hex);
    if (vision === 'normal') return c;
    const m = VISION[vision];
    const clamp = (x: number) => Math.min(1, Math.max(0, x));
    return [0, 1, 2].map((i) => clamp(m[i]![0]! * c[0] + m[i]![1]! * c[1] + m[i]![2]! * c[2])) as [number, number, number];
  };
  const [p, q] = [oklab(seen(aHex)), oklab(seen(bHex))];
  return 100 * Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

export interface Separated {
  a: string;
  b: string;
  /** Side by side in the order, or the last beside the first where a donut closes its circle. */
  where: 'next' | 'around';
  /** Per theme, the distance for each vision, rounded to one place, and the verdict on the worst of the three kinds of color blindness. */
  themes: Record<string, { distances: Record<Vision, number>; verdict: 'apart' | 'with labels' | 'too close' }>;
}

/** Each pair of categorical data colors a chart draws side by side, measured in every theme for every vision. */
export function separations(jsonFile = join(HERE, '..', 'output', 'tokens.json')): { themes: string[]; rows: Separated[]; needs: typeof SEPARATION } {
  const data = JSON.parse(readFileSync(jsonFile, 'utf8')) as { contexts: Record<string, { values: string[] }>; tokens: Record_[] };
  const byPath = new Map(data.tokens.map((t) => [t.path, t]));
  const themes = data.contexts.theme?.values ?? ['light'];
  const value = (path: string, theme: string): string => {
    const t = byPath.get(path);
    if (!t) throw new Error(`The data color order names a token that does not exist: ${path}`);
    return typeof t.value === 'string' ? t.value : t.value[theme]!;
  };
  const pairs: [string, string, Separated['where']][] = CATEGORICAL.slice(1).map((b, i) => [CATEGORICAL[i]!, b, 'next']);
  if (CATEGORICAL.length > 2) pairs.push([CATEGORICAL[CATEGORICAL.length - 1]!, CATEGORICAL[0]!, 'around']);
  const rows = pairs.map(([a, b, where]): Separated => ({
    a, b, where,
    themes: Object.fromEntries(themes.map((theme) => {
      const distances = Object.fromEntries((['normal', 'protanopia', 'deuteranopia', 'tritanopia'] as const).map((v) => [v, Math.round(separation(value(a, theme), value(b, theme), v) * 10) / 10])) as Record<Vision, number>;
      const worst = Math.min(distances.protanopia, distances.deuteranopia, distances.tritanopia);
      const verdict: Separated['themes'][string]['verdict'] = distances.normal < SEPARATION.normal || worst < SEPARATION.floor ? 'too close' : worst < SEPARATION.target ? 'with labels' : 'apart';
      return [theme, { distances, verdict }];
    })),
  }));
  return { themes, rows, needs: SEPARATION };
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
  const { themes, rows, needs } = separations();
  const apart = rows.flatMap((r) => themes.map((t) => r.themes[t]!.verdict)).filter((v) => v === 'apart').length;
  console.log(`\nColor blindness: ${apart} of ${rows.length * themes.length} categorical pairs look apart (${needs.target} or more under protanopia, deuteranopia and tritanopia; ${needs.floor} with a label beside them).`);
  console.log('theme  normal  protan  deutan  tritan  verdict      pair');
  for (const r of rows) for (const t of themes) {
    const { distances: d, verdict } = r.themes[t]!;
    console.log(`${t.padEnd(6)} ${[d.normal, d.protanopia, d.deuteranopia, d.tritanopia].map((n) => n.toFixed(1).padStart(6)).join('  ')}  ${verdict.padEnd(11)}  ${r.a} ${r.where === 'next' ? 'beside' : 'around to'} ${r.b}`);
  }
}
