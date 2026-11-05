'use client';

import { useState, type FocusEvent, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { ChartData } from '../chart-data.js';
import { chartSwatches, markKey, type ChartSwatch } from '../chart.js';
import { useEntrance } from '../entrance.js';
import { chartFormat, numberFormat } from '../format.js';
import { labelText } from '../label-text.js';
import { LegendItem } from '../legend-item/legend-item.js';
import { donutChart } from './donut-chart.manifest.js';
import { cx } from '../variants.js';

/** One part of the whole: its name, as the legend and the table say it, and its value. */
export interface DonutPart {
  name: string;
  value: number;
  /**
   * Its color, one of the eight series colors by number, so it keeps that color while other parts come and go;
   * `muted` gathers it into Other. Without one it takes the next color no part names.
   */
  swatch?: ChartSwatch;
}

/** The words of the table and the legend, in the page's language. */
export interface DonutChartWords {
  /** The title of the disclosure that shows the table. */
  data: string;
  /** The headings of the table's columns. */
  part: string;
  value: string;
  share: string;
  /** The name of the ninth part and those after it, gathered as one. */
  other: string;
}

export const DONUT_CHART_WORDS: DonutChartWords = { data: 'Data', part: 'Part', value: 'Value', share: 'Share', other: 'Other' };

export interface DonutChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** What the chart shows, such as "Spend by product": the table's caption, and what a screen reader hears without a summary. */
  label: string;
  /** The main message in words, such as "Design is the largest part, 27%": what a screen reader hears for the picture. */
  summary?: string;
  /** The parts, in the order they run clockwise from the top: two to eight. A ninth and later are gathered as one, in gray. */
  parts: readonly DonutPart[];
  /** The figure in the middle, such as "$5,084". The total of the parts unless given. A long one is set smaller; the middle holds ten characters. */
  figure?: ReactNode;
  /** The words under the figure, such as "7 days". None unless given. */
  caption?: ReactNode;
  /** The legend beside the ring, each part with its value. On unless turned off. */
  legend?: boolean;
  /** The parts with nothing in them, a value of zero, in the legend. On unless turned off; the table still lists them. */
  legendEmpty?: boolean;
  /** A value as the legend, the middle and the table show it. A number in English, or in `locale`, unless given. */
  format?: (value: number) => string;
  /** The language of the numbers and shares, such as "de-DE". English unless given, so a page prepared on a server and the browser write them alike. */
  locale?: string;
  /** The values' table under the chart, in a closed disclosure. Out of sight, for screen readers only, unless set. */
  showData?: boolean;
  /**
   * Each part of the ring takes focus and says its name, value and share: one Tab stop for the parts, the arrow keys
   * from part to part clockwise and back, Home and End to the first and the last. Off unless set.
   */
  focusable?: boolean;
  /**
   * Told the part pointed at, by the mouse or by focus, with the value it draws (Other's is its parts' sum), and null
   * when none is: for a readout, which focusable parts need in place of the browser's own tooltip.
   */
  onActiveChange?: (part: DonutPart | null) => void;
  /** The words of the table and the legend. */
  words?: Partial<DonutChartWords>;
  /** Reaches the chart. */
  ref?: Ref<HTMLDivElement>;
}

/** The ring, in the SVG's own units: 100 across, the hole 74 of them, and a gap between parts as an angle. */
const OUTER = 50;
const INNER = 37;
const GAP = 0.04;

const round = (n: number) => Math.round(n * 100) / 100;
const at = (r: number, angle: number) => `${round(50 + r * Math.cos(angle))} ${round(50 + r * Math.sin(angle))}`;

/** A part of the ring from one angle to another, clockwise, angles from the right in radians. */
function arc(from: number, to: number): string {
  if (to - from >= 2 * Math.PI - 1e-6) {
    // The whole ring: two halves outside, two inside, the hole cut out.
    return `M${at(OUTER, -Math.PI / 2)} A${OUTER} ${OUTER} 0 1 1 ${at(OUTER, Math.PI / 2)} A${OUTER} ${OUTER} 0 1 1 ${at(OUTER, -Math.PI / 2)} Z M${at(INNER, -Math.PI / 2)} A${INNER} ${INNER} 0 1 0 ${at(INNER, Math.PI / 2)} A${INNER} ${INNER} 0 1 0 ${at(INNER, -Math.PI / 2)} Z`;
  }
  const large = to - from > Math.PI ? 1 : 0;
  return `M${at(OUTER, from)} A${OUTER} ${OUTER} 0 ${large} 1 ${at(OUTER, to)} L${at(INNER, to)} A${INNER} ${INNER} 0 ${large} 0 ${at(INNER, from)} Z`;
}

/** How far a figure runs, in digits of its type: a comma, a point or a space is half of one, a capital or a percent sign one and a half. */
const digitsWide = (words: string) => Array.from(words).reduce((n, c) => n + (/[\s.,]/.test(c) ? 0.5 : /[\p{Lu}%]/u.test(c) ? 1.5 : 1), 0);

/** The figure's modifier, read from its words so a page prepared on a server draws it alike. The full size holds "$5,084", the next "$99,999", the last "$1,250,000". */
function figureSize(figure: ReactNode): 'md' | 'sm' | undefined {
  const width = digitsWide(labelText(figure) ?? '');
  if (width <= 5.5) return undefined;
  return width <= 6.5 ? 'md' : 'sm';
}

/**
 * Donut chart: the parts of a whole as a ring, clockwise from the top, the total in the middle and a legend beside
 * it. The ring is an image named by its summary; the legend is a list a screen reader reads; every part's value and
 * share is in a table, out of sight unless shown. Each part of the ring says its name, value and share in the browser's
 * own tooltip. It takes no focus unless `focusable`: then the ring is a group named by its summary and each part an
 * image named by its figures, one Tab stop for them all. The first time it comes into view the ring
 * sweeps round from the top (`entrance.ts`).
 */
export function DonutChart({ label, summary, parts, figure, caption, legend = true, legendEmpty = true, format, locale, showData, focusable = false, onActiveChange, words, className, ref, ...rest }: DonutChartProps) {
  const part = donutChart.part;
  const w = { ...DONUT_CHART_WORDS, ...words };
  const fmt = chartFormat(format, locale);
  const percent = numberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format;
  const positive = parts.map((p) => ({ ...p, value: Math.max(0, p.value) }));
  // Each part in its categorical color, the one it names or the next free one, and everything past the eight colors,
  // or named muted, as one, in the muted gray (chart.ts).
  const colors = chartSwatches(parts.map((p) => p.swatch));
  const surplus = positive.filter((_, n) => colors[n] === 'muted');
  const drawn: (DonutPart & { swatch: ChartSwatch })[] = [
    ...positive.flatMap((p, n) => (colors[n] === 'muted' ? [] : [{ ...p, swatch: colors[n]! }])),
    ...(surplus.length ? [{ name: w.other, value: surplus.reduce((sum, p) => sum + p.value, 0), swatch: 'muted' as const }] : []),
  ];
  const total = drawn.reduce((sum, p) => sum + p.value, 0);
  const showing = drawn.filter((p) => p.value > 0);
  let angle = -Math.PI / 2;
  const arcs = showing.map((p) => {
    const span = (p.value / total) * 2 * Math.PI;
    const from = angle;
    angle += span;
    const gap = showing.length > 1 ? GAP / 2 : 0;
    return { ...p, d: span - 2 * gap > 0 ? arc(from + gap, from + span - gap) : '' };
  });
  const piece = part('part');
  const entrance = useEntrance(ref);
  // What a part says, in the browser's own tooltip or, when it takes focus, as its name instead (a tooltip beside the
  // name would be read a second time).
  const figures = (p: DonutPart) => `${p.name}: ${fmt(p.value)} (${percent(p.value / total)})`;
  // The part pointed at, by the mouse or by focus; focusable, the parts are one Tab stop: the part last focused, the
  // first until then.
  const [active, setActive] = useState<string | null>(null);
  const activate = (p: DonutPart | null) => {
    if ((p?.name ?? null) === active) return;
    setActive(p?.name ?? null);
    onActiveChange?.(p ? { name: p.name, value: p.value } : null);
  };
  const shownArcs = arcs.filter((a) => a.d);
  const [stop, setStop] = useState<string | null>(null);
  const tabStop = shownArcs.some((a) => a.name === stop) ? stop : (shownArcs[0]?.name ?? null);
  const move = (e: KeyboardEvent<SVGSVGElement>) => {
    const marks = Array.from(e.currentTarget.querySelectorAll<SVGPathElement>(`.${piece}`));
    const at = marks.indexOf(e.target as SVGPathElement);
    if (at < 0) return;
    const next = markKey(e.key, at, marks.length);
    if (next === null) return;
    e.preventDefault();
    marks[next]?.focus();
  };
  const leave = (e: FocusEvent<SVGSVGElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) activate(null);
  };
  const legendItems = legendEmpty ? drawn : drawn.filter((p) => p.value > 0);
  const middle = figure ?? fmt(total);
  const size = figureSize(middle);
  return (
    <div ref={entrance} data-entrance="load" className={cx(donutChart(), className)} {...rest}>
      <div className={part('ring')} role={focusable ? 'group' : 'img'} aria-label={summary ?? label}>
        <svg
          className={part('svg')}
          viewBox="0 0 100 100"
          focusable="false"
          {...(focusable ? { role: 'presentation', onKeyDown: move, onBlur: leave } : { 'aria-hidden': true })}
          data-active={active ?? undefined}
        >
          {shownArcs.map((a) => (
            <path
              key={a.name}
              className={`${piece} ${piece}--swatch-${a.swatch}`}
              d={a.d}
              fillRule="evenodd"
              data-active={a.name === active ? '' : undefined}
              onPointerEnter={(e) => e.pointerType === 'mouse' && activate(a)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && activate(null)}
              {...(focusable && {
                role: 'img',
                'aria-label': figures(a),
                tabIndex: a.name === tabStop ? 0 : -1,
                onFocus: () => {
                  setStop(a.name);
                  activate(a);
                },
              })}
            >
              {!focusable && <title>{figures(a)}</title>}
            </path>
          ))}
        </svg>
        <span className={part('center')} aria-hidden={focusable || undefined}>
          <span className={cx(part('figure'), size && `${part('figure')}--size-${size}`)}>{middle}</span>
          {caption !== undefined && caption !== null && caption !== '' && <span className={part('caption')}>{caption}</span>}
        </span>
      </div>
      {legend && (
        <ul className={part('legend')}>
          {legendItems.map((p) => (
            <LegendItem key={p.name} swatch={p.swatch} label={p.name} value={fmt(p.value)} />
          ))}
        </ul>
      )}
      <ChartData
        part={part}
        caption={label}
        columns={[w.part, w.value, w.share]}
        rows={positive.map((p) => [p.name, fmt(p.value), total > 0 ? percent(p.value / total) : ''])}
        shown={showData}
        title={w.data}
      />
    </div>
  );
}
