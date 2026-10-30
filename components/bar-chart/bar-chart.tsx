'use client';

import { useState, type CSSProperties, type FocusEvent, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type Ref } from 'react';
import { ChartData } from '../chart-data.js';
import { chartFormat } from '../format.js';
import { axisLabels, chartSwatches, markKey, niceScale, share, type ChartSwatch } from '../chart.js';
import { useEntrance } from '../entrance.js';
import { LegendItem } from '../legend-item/legend-item.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { barChart } from './bar-chart.manifest.js';

/** One kind of amount: its name, as the legend and the table say it, and a value for each label. */
export interface BarSeries {
  name: string;
  values: readonly number[];
  /**
   * Its color in stacked bars, one of the eight series colors by number, so it keeps that color while other series
   * come and go; `muted` gathers it into Other. Without one it takes the next color no series names. Plain bars draw
   * in the one series color.
   */
  swatch?: ChartSwatch;
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
  /** The series with nothing in them, every value zero, in the legend. On unless turned off; the table still lists them. */
  legendEmpty?: boolean;
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
  /**
   * Each bar takes focus and says its figures, its label and value, and for a stacked bar each kind and the total:
   * one Tab stop for the bars, the arrow keys from bar to bar, Home and End to the first and the last. Off unless set.
   */
  focusable?: boolean;
  /**
   * Told the bar pointed at, by the mouse or by focus, by its place in the labels, and null when none is: for a
   * readout under the chart, which focusable bars need in place of the browser's own tooltip.
   */
  onActiveChange?: (index: number | null) => void;
  /** The words of the table and the legend. */
  words?: Partial<BarChartWords>;
  /** Reaches the chart. */
  ref?: Ref<HTMLDivElement>;
}

type Swatch = ChartSwatch | 'series';

/**
 * Bar chart: a value axis, light grid lines, a bar per label from the baseline, and the labels under them. The
 * picture is an image named by its summary; every value is in a table, out of sight unless shown. Each bar says its
 * label and value in the browser's own tooltip. It takes no focus unless `focusable`: then the picture is a group
 * named by its summary and each bar an image named by its figures, one Tab stop for them all.
 * The first time it comes into view the bars grow from the baseline, one after another (`entrance.ts`).
 */
export function BarChart({ type = 'bars', label, summary, labels, series, current, legend = true, legendEmpty = true, xAxis = true, labelEvery = 1, format, locale, max, showData, focusable = false, onActiveChange, words, className, ref, ...rest }: BarChartProps) {
  const part = barChart.part;
  const w = { ...BAR_CHART_WORDS, ...words };
  const fmt = chartFormat(format, locale);
  const value = (s: BarSeries, i: number) => Math.max(0, s.values[i] ?? 0);
  // Stacked: each series in its categorical color, the one it names or the next free one, and everything past the
  // eight colors, or named muted, as one, in the muted gray (chart.ts).
  const colors = chartSwatches(series.map((s) => s.swatch));
  const gathered = series.filter((_, n) => colors[n] === 'muted');
  const drawn: { name: string; swatch: Swatch; at: (i: number) => number }[] =
    type === 'stacked'
      ? [
          ...series.flatMap((s, n) => (colors[n] === 'muted' ? [] : [{ name: s.name, swatch: colors[n]!, at: (i: number) => value(s, i) }])),
          ...(gathered.length ? [{ name: w.other, swatch: 'muted' as const, at: (i: number) => gathered.reduce((sum, s) => sum + value(s, i), 0) }] : []),
        ]
      : series.slice(0, 1).map((s) => ({ name: s.name, swatch: 'series' as const, at: (i: number) => value(s, i) }));
  const legendItems = legendEmpty ? drawn : drawn.filter((d) => labels.some((_, i) => d.at(i) > 0));
  // The table lists every series, even those the picture gathers as Other.
  const listed = type === 'stacked' ? series : series.slice(0, 1);
  const totals = labels.map((_, i) => drawn.reduce((sum, d) => sum + d.at(i), 0));
  const scale = niceScale(totals, { min: 0, max });
  const shown = axisLabels(labels.length, labelEvery);
  const close = labels.length > CLOSE;
  const segment = part('segment');
  const entrance = useEntrance(ref);
  // What a bar says, in the browser's own tooltip or, when it takes focus, as its name instead (a tooltip beside the
  // name would be read a second time): its label and value; a stacked bar adds each kind and the total.
  const figures = (i: number) =>
    type === 'stacked' && drawn.length > 1
      ? [labels[i]!, ...drawn.filter((d) => d.at(i) > 0).map((d) => `${d.name}: ${fmt(d.at(i))}`), `${w.total}: ${fmt(totals[i]!)}`]
      : [`${labels[i]}: ${fmt(totals[i]!)}`];
  // The bar a mouse points at, or the one focused: for the mouse, the one whose column, gaps included, is under the
  // pointer, so moving from bar to bar, or above a short bar, never lets every bar come back whole in between.
  const [active, setActive] = useState<number | null>(null);
  const activate = (index: number | null) => {
    if (index === active) return;
    setActive(index);
    onActiveChange?.(index);
  };
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
    activate(nearest);
  };
  // Focusable, the bars are one Tab stop: the bar last focused, the first until then.
  const [stop, setStop] = useState(0);
  const tabStop = Math.min(stop, labels.length - 1);
  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    const bars = Array.from(e.currentTarget.children) as HTMLElement[];
    const at = bars.indexOf(e.target as HTMLElement);
    if (at < 0) return;
    const next = markKey(e.key, at, bars.length, getComputedStyle(e.currentTarget).direction === 'rtl');
    if (next === null) return;
    e.preventDefault();
    bars[next]?.focus();
  };
  const leave = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) activate(null);
  };
  return (
    <div ref={entrance} data-entrance="load" className={cx(barChart({ type }), className)} {...rest}>
      {legend && legendItems.length > 0 && (
        <ul className={part('legend')}>
          {legendItems.map((d) => (
            <LegendItem key={d.name} swatch={d.swatch} label={d.name} />
          ))}
        </ul>
      )}
      <div className={cx(part('body'), close && `${part('body')}--close`)} role={focusable ? 'group' : 'img'} aria-label={summary ?? label}>
        <div className={part('y-axis')} aria-hidden={focusable || undefined}>
          {[...scale.ticks].reverse().map((t) => (
            <span key={t} className={part('y-label')}>{fmt(t)}</span>
          ))}
        </div>
        <div className={part('plot')}>
          <div className={part('grid')}>
            {scale.ticks.map((t) => (
              <span key={t} className={part(t === scale.low ? 'baseline' : 'gridline')} style={{ top: `${(1 - share(t, scale)) * 100}%` }} />
            ))}
            <div
              className={part('bars')}
              style={{ '--smbk-bar-chart-count': labels.length } as CSSProperties}
              data-active={active ?? undefined}
              onPointerMove={point}
              onPointerLeave={() => activate(null)}
              onKeyDown={focusable ? move : undefined}
              onBlur={focusable ? leave : undefined}
            >
              {labels.map((_, i) => (
                <span
                  key={i}
                  className={part('bar')}
                  title={focusable ? undefined : figures(i).join('\n')}
                  style={{ height: `${share(totals[i]!, scale) * 100}%`, '--smbk-bar-chart-order': i } as CSSProperties}
                  data-active={i === active ? '' : undefined}
                  {...(focusable && {
                    role: 'img',
                    'aria-label': figures(i).join(', '),
                    tabIndex: i === tabStop ? 0 : -1,
                    onFocus: () => {
                      setStop(i);
                      activate(i);
                    },
                  })}
                >
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
          <div className={part('x-axis')} aria-hidden={focusable || undefined}>
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
