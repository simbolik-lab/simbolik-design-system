import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { ChartData } from '../chart-data.js';
import { CATEGORICAL_COUNT } from '../chart.js';
import { useEntrance } from '../entrance.js';
import { chartFormat, numberFormat } from '../format.js';
import { LegendItem } from '../legend-item/legend-item.js';
import { donutChart } from './donut-chart.manifest.js';
import { cx } from '../variants.js';

/** One part of the whole: its name, as the legend and the table say it, and its value. */
export interface DonutPart {
  name: string;
  value: number;
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
  /** The figure in the middle, such as "$5,084". The total of the parts unless given. */
  figure?: ReactNode;
  /** The words under the figure, such as "7 days". None unless given. */
  caption?: ReactNode;
  /** The legend beside the ring, each part with its value. On unless turned off. */
  legend?: boolean;
  /** A value as the legend, the middle and the table show it. A number in English, or in `locale`, unless given. */
  format?: (value: number) => string;
  /** The language of the numbers and shares, such as "de-DE". English unless given, so a page prepared on a server and the browser write them alike. */
  locale?: string;
  /** The values' table under the chart, in a closed disclosure. Out of sight, for screen readers only, unless set. */
  showData?: boolean;
  /** The words of the table and the legend. */
  words?: Partial<DonutChartWords>;
  /** Reaches the chart. */
  ref?: Ref<HTMLDivElement>;
}

type Swatch = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'muted';

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

/**
 * Donut chart: the parts of a whole as a ring, clockwise from the top, the total in the middle and a legend beside
 * it. The ring is an image named by its summary; the legend is a list a screen reader reads; every part's value and
 * share is in a table, out of sight unless shown. Each part of the ring says its name, value and share in the browser's
 * own tooltip. It takes no focus. The first time it comes into view the ring
 * sweeps round from the top (`entrance.ts`).
 */
export function DonutChart({ label, summary, parts, figure, caption, legend = true, format, locale, showData, words, className, ref, ...rest }: DonutChartProps) {
  const part = donutChart.part;
  const w = { ...DONUT_CHART_WORDS, ...words };
  const fmt = chartFormat(format, locale);
  const percent = numberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format;
  const positive = parts.map((p) => ({ ...p, value: Math.max(0, p.value) }));
  const surplus = positive.slice(CATEGORICAL_COUNT);
  const drawn: (DonutPart & { swatch: Swatch })[] = [
    ...positive.slice(0, CATEGORICAL_COUNT).map((p, n) => ({ ...p, swatch: String(n + 1) as Swatch })),
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
  return (
    <div ref={entrance} data-entrance="load" className={cx(donutChart(), className)} {...rest}>
      <div className={part('ring')} role="img" aria-label={summary ?? label}>
        <svg className={part('svg')} viewBox="0 0 100 100" focusable="false" aria-hidden="true">
          {arcs.map((a) => a.d && (
            <path key={a.name} className={`${piece} ${piece}--swatch-${a.swatch}`} d={a.d} fillRule="evenodd">
              <title>{`${a.name}: ${fmt(a.value)} (${percent(a.value / total)})`}</title>
            </path>
          ))}
        </svg>
        <span className={part('center')}>
          <span className={part('figure')}>{figure ?? fmt(total)}</span>
          {caption !== undefined && caption !== null && caption !== '' && <span className={part('caption')}>{caption}</span>}
        </span>
      </div>
      {legend && (
        <ul className={part('legend')}>
          {drawn.map((p) => (
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
