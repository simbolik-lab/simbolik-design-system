/**
 * What the charts share: placing values in a box and drawing a smooth line through them. A chart draws its
 * marks as SVG from its own data, with no chart library; its colors come from the data color tokens in its
 * stylesheet, never from here.
 */

/** A point in a chart's drawing box, in the box's own units. */
export interface ChartPoint {
  x: number;
  y: number;
}

/**
 * Places values evenly across `width` and between `top` and `bottom` (the highest value at `top`). Values that
 * are all the same sit halfway. `min` and `max` widen the scale, so several charts can share one.
 */
export function placePoints(values: readonly number[], box: { width: number; top: number; bottom: number }, scale: { min?: number; max?: number } = {}): ChartPoint[] {
  if (values.length === 0) return [];
  const low = Math.min(scale.min ?? Infinity, ...values);
  const high = Math.max(scale.max ?? -Infinity, ...values);
  const span = high - low;
  const step = values.length > 1 ? box.width / (values.length - 1) : 0;
  return values.map((v, i) => ({
    x: values.length > 1 ? i * step : box.width,
    y: span === 0 ? (box.top + box.bottom) / 2 : box.bottom - ((v - low) / span) * (box.bottom - box.top),
  }));
}

const round = (n: number) => Math.round(n * 100) / 100;

/**
 * An SVG path through the points as a smooth curve that never swings past a point's value (a monotone cubic
 * curve, after Fritsch and Carlson), so a peak in the drawing is a peak in the data.
 */
export function smoothPath(points: readonly ChartPoint[]): string {
  const n = points.length;
  if (n === 0) return '';
  if (n === 1) return `M${round(points[0]!.x)} ${round(points[0]!.y)}`;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(points[i + 1]!.x - points[i]!.x);
    slope.push(dx[i] === 0 ? 0 : (points[i + 1]!.y - points[i]!.y) / dx[i]!);
  }
  const tangent: number[] = [slope[0]!];
  for (let i = 1; i < n - 1; i++) {
    const a = slope[i - 1]!;
    const b = slope[i]!;
    tangent.push(a * b <= 0 ? 0 : (3 * (dx[i - 1]! + dx[i]!)) / ((2 * dx[i]! + dx[i - 1]!) / a + (dx[i]! + 2 * dx[i - 1]!) / b));
  }
  tangent.push(slope[n - 2]!);
  let d = `M${round(points[0]!.x)} ${round(points[0]!.y)}`;
  for (let i = 0; i < n - 1; i++) {
    const p = points[i]!;
    const q = points[i + 1]!;
    const third = dx[i]! / 3;
    d += ` C${round(p.x + third)} ${round(p.y + tangent[i]! * third)} ${round(q.x - third)} ${round(q.y - tangent[i + 1]! * third)} ${round(q.x)} ${round(q.y)}`;
  }
  return d;
}

/** The path closed down to `base`, for the area under a line. */
export function areaPath(points: readonly ChartPoint[], base: number): string {
  if (points.length < 2) return '';
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${smoothPath(points)} L${round(last.x)} ${round(base)} L${round(first.x)} ${round(base)} Z`;
}

/** The value scale of a chart with axes: its lowest and highest values and the round values its grid lines mark. */
export interface ChartScale {
  low: number;
  high: number;
  /** From the lowest to the highest, evenly apart. */
  ticks: number[];
}

/**
 * A scale that holds every value, from zero (or from below it, when a value is) up to a round number, in about
 * `count` round steps: 1, 2, 2.5 or 5 times a power of ten. `min` and `max` widen it, so charts side by side
 * can share one.
 */
export function niceScale(values: readonly number[], options: { min?: number; max?: number; count?: number } = {}): ChartScale {
  const count = Math.max(1, options.count ?? 4);
  const finite = values.filter((v) => Number.isFinite(v));
  const low = Math.min(options.min ?? 0, ...finite);
  let high = Math.max(options.max ?? -Infinity, ...finite);
  if (!Number.isFinite(high) || high <= low) high = low + count;
  const raw = (high - low) / count;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw * (1 - 1e-9)) ?? 10 * power;
  const first = Math.floor(low / step + 1e-9) * step;
  const last = Math.ceil(high / step - 1e-9) * step;
  const ticks: number[] = [];
  for (let i = 0; first + i * step <= last + step / 2; i++) ticks.push(Number((first + i * step).toPrecision(12)));
  return { low: ticks[0]!, high: ticks[ticks.length - 1]!, ticks };
}

/** Where a value sits on a scale, from 0 at its lowest to 1 at its highest. */
export const share = (value: number, scale: { low: number; high: number }) => (scale.high === scale.low ? 0 : (value - scale.low) / (scale.high - scale.low));

/**
 * Which of an axis's labels show: every `every`th from the first, and always the last, leaving out one that would
 * crowd the last. A shown label is major or minor, every second counting back from the last; a narrow layout
 * hides the minor ones, so the last label, usually the newest, always stays.
 */
export function axisLabels(count: number, every = 1): ('major' | 'minor' | null)[] {
  const step = Math.max(1, Math.round(every));
  const shown = Array.from({ length: count }, (_, i) => i === count - 1 || (i % step === 0 && count - 1 - i >= step / 2));
  const out: ('major' | 'minor' | null)[] = Array(count).fill(null);
  let major = true;
  for (let i = count - 1; i >= 0; i--) {
    if (!shown[i]) continue;
    out[i] = major ? 'major' : 'minor';
    major = !major;
  }
  return out;
}

/** The categorical data colors a chart's series take in order; past them, the rest is gathered as one, in the muted gray. */
export const CATEGORICAL_COUNT = 8;
