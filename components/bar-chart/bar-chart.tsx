import { useState, type CSSProperties, type HTMLAttributes, type PointerEvent, type Ref } from 'react';
import { ChartData } from '../chart-data.js';
import { chartFormat } from '../format.js';
import { axisLabels, CATEGORICAL_COUNT, niceScale, share } from '../chart.js';
import { useEntrance } from '../entrance.js';
import { LegendItem } from '../legend-item/legend-item.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { barChart } from './bar-chart.manifest.js';

/** One kind of amount: its name, as the legend and the table say it, and a value for each label. */
export interface BarSeries {
  name: string;
  values: readonly number[];
}

/** The words of the table and the legend, in the page's language. */
export interface BarChartWords {
  /** The title of the disclosure that shows the table. */
  data: string;
  /** The heading of the table's first column, the labels'. */
  period: string;
  /** The heading of a stacked chart's total column. */
  total: string;
  /** The name of the ninth series and those after it, gathered as one. */
  other: string;
}

export const BAR_CHART_WORDS: BarChartWords = { data: 'Data', period: 'Period', total: 'Total', other: 'Other' };

/** More bars than this sit closer together. */
const CLOSE = 14;

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof barChart.manifest> {
  /** What the chart shows, such as "Spend per day": the table's caption, and what a screen reader hears without a summary. */
  label: string;
  /** The main message in words, such as "Saturday cost the most, $352": what a screen reader hears for the picture. */
  summary?: string;
  /** A label for each bar, such as the days, oldest first. */
  labels: readonly string[];
  /** Bars draws the first series. Stacked draws up to eight in each bar, the first at the foot; a ninth and later are gathered as one. */
  series: readonly BarSeries[];
  /** The bar still counting, such as today's, by its place in the labels: drawn darker in plain bars. None unless given. */
  current?: number;
  /** The legend over the chart. On unless turned off. */
  legend?: boolean;
  /** The labels under the bars. On unless turned off. */
  xAxis?: boolean;
  /** Shows every this many labels from the first, and always the last. Every label unless given. */
  labelEvery?: number;
  /** A value as the axis and the table show it. A number in English, or in `locale`, unless given. */
  format?: (value: number) => string;
  /** The language of the numbers, such as "de-DE". English unless given, so a page prepared on a server and the browser write them alike. */
  locale?: string;
  /** The highest value of the scale, so charts side by side can share one. A round number over the tallest bar unless given. */
  max?: number;
  /** The values' table under the chart, in a closed disclosure. Out of sight, for screen readers only, unless set. */
  showData?: boolean;
  /** The words of the table and the legend. */
  words?: Partial<BarChartWords>;
  /** Reaches the chart. */
  ref?: Ref<HTMLDivElement>;
}

type Swatch = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'series' | 'muted';

/**
 * Bar chart: a value axis, light grid lines, a bar per label from the baseline, and the labels under them. The
 * picture is an image named by its summary; every value is in a table, out of sight unless shown. Each bar says its
 * label and value in the browser's own tooltip. It takes no focus.
 * The first time it comes into view the bars grow from the baseline, one after another (`entrance.ts`).
 */
export function BarChart({ type = 'bars', label, summary, labels, series, current, legend = true, xAxis = true, labelEvery = 1, format, locale, max, showData, words, className, ref, ...rest }: BarChartProps) {
  const part = barChart.part;
  const w = { ...BAR_CHART_WORDS, ...words };
  const fmt = chartFormat(format, locale);
  const value = (s: BarSeries, i: number) => Math.max(0, s.values[i] ?? 0);
  // Stacked: eight series in the categorical colors, then everything else as one, in the muted gray.
  const drawn: { name: string; swatch: Swatch; at: (i: number) => number }[] =
    type === 'stacked'
      ? [
          ...series.slice(0, CATEGORICAL_COUNT).map((s, n) => ({ name: s.name, swatch: String(n + 1) as Swatch, at: (i: number) => value(s, i) })),
          ...(series.length > CATEGORICAL_COUNT ? [{ name: w.other, swatch: 'muted' as const, at: (i: number) => series.slice(CATEGORICAL_COUNT).reduce((sum, s) => sum + value(s, i), 0) }] : []),
        ]
      : series.slice(0, 1).map((s) => ({ name: s.name, swatch: 'series' as const, at: (i: number) => value(s, i) }));
  // The table lists every series, even those the picture gathers as Other.
  const listed = type === 'stacked' ? series : series.slice(0, 1);
  const totals = labels.map((_, i) => drawn.reduce((sum, d) => sum + d.at(i), 0));
  const scale = niceScale(totals, { min: 0, max });
  const shown = axisLabels(labels.length, labelEvery);
  const close = labels.length > CLOSE;
  const segment = part('segment');
  const entrance = useEntrance(ref);
  // What the browser's own tooltip says over a bar: its label and value; a stacked bar adds each kind and the total.
  const tip = (i: number) =>
    type === 'stacked' && drawn.length > 1
      ? [labels[i], ...drawn.filter((d) => d.at(i) > 0).map((d) => `${d.name}: ${fmt(d.at(i))}`), `${w.total}: ${fmt(totals[i]!)}`].join('\n')
      : `${labels[i]}: ${fmt(totals[i]!)}`;
  // The bar a mouse points at: the one whose column, gaps included, is under the pointer, so moving from bar to bar,
  // or above a short bar, never lets every bar come back whole in between.
  const [active, setActive] = useState<number | null>(null);
  const point = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const bars = Array.from(e.currentTarget.children);
    let nearest: number | null = null;
    let distance = Infinity;
    bars.forEach((bar, i) => {
      const r = bar.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.right) / 2);
      if (d < distance) [nearest, distance] = [i, d];
    });
    if (nearest !== active) setActive(nearest);
  };
  return (
    <div ref={entrance} data-entrance="load" className={cx(barChart({ type }), className)} {...rest}>
      {legend && drawn.length > 0 && (
        <ul className={part('legend')}>
          {drawn.map((d) => (
            <LegendItem key={d.name} swatch={d.swatch} label={d.name} />
          ))}
        </ul>
      )}
      <div className={cx(part('body'), close && `${part('body')}--close`)} role="img" aria-label={summary ?? label}>
        <div className={part('y-axis')}>
          {[...scale.ticks].reverse().map((t) => (
            <span key={t} className={part('y-label')}>{fmt(t)}</span>
          ))}
        </div>
        <div className={part('plot')}>
          <div className={part('grid')}>
            {scale.ticks.map((t) => (
              <span key={t} className={part(t === scale.low ? 'baseline' : 'gridline')} style={{ top: `${(1 - share(t, scale)) * 100}%` }} />
            ))}
            <div className={part('bars')} style={{ '--smbk-bar-chart-count': labels.length } as CSSProperties} data-active={active ?? undefined} onPointerMove={point} onPointerLeave={() => setActive(null)}>
              {labels.map((_, i) => (
                <span key={i} className={part('bar')} title={tip(i)} style={{ height: `${share(totals[i]!, scale) * 100}%`, '--smbk-bar-chart-order': i } as CSSProperties} data-active={i === active ? '' : undefined}>
                  {drawn.map((d) =>
                    d.at(i) > 0 ? (
                      <span key={d.name} className={`${segment} ${segment}--swatch-${d.swatch}${type === 'bars' && i === current ? ` ${segment}--current` : ''}`} style={{ flexGrow: d.at(i) }} />
                    ) : null,
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        {xAxis && (
          <div className={part('x-axis')}>
            {labels.map((l, i) => (
              <span key={i} className={part('x-cell')}>
                {shown[i] && <span className={`${part('x-label')} ${part('x-label')}--${shown[i]}`}>{l}</span>}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChartData
        part={part}
        caption={label}
        columns={[w.period, ...listed.map((s) => s.name), ...(type === 'stacked' && listed.length > 1 ? [w.total] : [])]}
        rows={labels.map((l, i) => [l, ...listed.map((s) => fmt(value(s, i))), ...(type === 'stacked' && listed.length > 1 ? [fmt(totals[i]!)] : [])])}
        shown={showData}
        title={w.data}
      />
    </div>
  );
}
