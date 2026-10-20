import type { HTMLAttributes, Ref } from 'react';
import { ChartData } from '../chart-data.js';
import { chartFormat } from '../format.js';
import { areaPath, axisLabels, niceScale, placePoints, share, smoothPath } from '../chart.js';
import { useEntrance } from '../entrance.js';
import { LegendItem } from '../legend-item/legend-item.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { lineChart } from './line-chart.manifest.js';

/** One line: its name, as the legend and the table say it, and a value for each label, oldest first. */
export interface LineSeries {
  name: string;
  values: readonly number[];
}

/** The words of the table, in the page's language. */
export interface LineChartWords {
  /** The title of the disclosure that shows the table. */
  data: string;
  /** The heading of the table's first column, the labels'. */
  period: string;
}

export const LINE_CHART_WORDS: LineChartWords = { data: 'Data', period: 'Period' };

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof lineChart.manifest> {
  /** What the chart shows, such as "Spend per day": the table's caption, and what a screen reader hears without a summary. */
  label: string;
  /** The main message in words, such as "Spend rose from $60 to $345 this week": what a screen reader hears for the picture. */
  summary?: string;
  /** A label for each value, such as the days, oldest first. */
  labels: readonly string[];
  /** One series, or two: the first is the line, the second the period it is compared with, drawn dashed. */
  series: readonly LineSeries[];
  /** The value to mark, by its place in the labels: a dot on the line with its label and value above it. None unless given. */
  marked?: number;
  /** The legend over the chart. On unless turned off. */
  legend?: boolean;
  /** The labels under the chart. On unless turned off. */
  xAxis?: boolean;
  /** Shows every this many labels from the first, and always the last. Every label unless given. */
  labelEvery?: number;
  /** A value as the axis, the marked point and the table show it. A number in English, or in `locale`, unless given. */
  format?: (value: number) => string;
  /** The language of the numbers, such as "de-DE". English unless given, so a page prepared on a server and the browser write them alike. */
  locale?: string;
  /** The lowest and highest values of the scale, so charts side by side can share one. From zero to a round number above the values unless given. */
  min?: number;
  max?: number;
  /** The values' table under the chart, in a closed disclosure. Out of sight, for screen readers only, unless set. */
  showData?: boolean;
  /** The words of the table. */
  words?: Partial<LineChartWords>;
  /** Reaches the chart. */
  ref?: Ref<HTMLDivElement>;
}

/** The drawing box, in the SVG's own units: 100 wide and 100 tall, from the highest value at the top to the lowest. */
const BOX = { width: 100, top: 0, bottom: 100 };

/**
 * Line chart: a value axis, light grid lines, one line or two, and the labels under them. The picture is an image
 * named by its summary; every value is in a table, out of sight unless shown. It takes no focus. The first time it
 * comes into view its series (the lines, the area and the marked value) is uncovered from left to right
 * (`entrance.ts`).
 */
export function LineChart({ type = 'line', label, summary, labels, series, marked, legend = true, xAxis = true, labelEvery = 1, format, locale, min, max, showData, words, className, ref, ...rest }: LineChartProps) {
  const part = lineChart.part;
  const w = { ...LINE_CHART_WORDS, ...words };
  const fmt = chartFormat(format, locale);
  const [main, compared] = series;
  const scale = niceScale([...(main?.values ?? []), ...(compared?.values ?? [])], { min, max });
  const zero = scale.low <= 0 && scale.high >= 0 ? 0 : scale.low;
  const base = (1 - share(zero, scale)) * 100;
  const at = (s: LineSeries) => placePoints(s.values, BOX, { min: scale.low, max: scale.high });
  const line = main ? at(main) : [];
  const xAt = (i: number) => (labels.length > 1 ? (i / (labels.length - 1)) * 100 : 50);
  const shown = axisLabels(labels.length, labelEvery);
  const point = marked !== undefined && main && main.values[marked] !== undefined ? { x: xAt(marked), y: line[marked]!.y, value: main.values[marked]! } : undefined;
  const entrance = useEntrance(ref);
  const edge = (x: number) => (x < 10 ? `${part('readout')}--start` : x > 90 ? `${part('readout')}--end` : '');
  return (
    <div ref={entrance} data-entrance="load" className={cx(lineChart({ type }), className)} {...rest}>
      {legend && main && (
        <ul className={part('legend')}>
          <LegendItem swatch="series" label={main.name} />
          {compared && <LegendItem swatch="muted" label={compared.name} />}
        </ul>
      )}
      <div className={part('body')} role="img" aria-label={summary ?? label}>
        <div className={part('y-axis')}>
          {[...scale.ticks].reverse().map((t) => (
            <span key={t} className={part('y-label')}>{fmt(t)}</span>
          ))}
        </div>
        <div className={part('plot')}>
          <div className={part('grid')}>
            {scale.ticks.map((t) => (
              <span key={t} className={part(t === zero ? 'baseline' : 'gridline')} style={{ top: `${(1 - share(t, scale)) * 100}%` }} />
            ))}
            <div className={part('series')}>
              <svg className={part('svg')} viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false" aria-hidden="true">
                {type === 'area' && line.length > 1 && <path className={part('area')} d={areaPath(line, base)} />}
                {compared && <path className={part('comparison')} d={smoothPath(at(compared))} />}
                {main && <path className={part('line')} d={smoothPath(line)} />}
              </svg>
              {point && (
                <>
                  <span className={part('drop-line')} style={{ left: `${point.x}%`, top: `${point.y}%`, height: `${Math.max(0, base - point.y)}%` }} />
                  <span className={part('marker')} style={{ left: `${point.x}%`, top: `${point.y}%` }}>
                    <span className={part('point')} />
                    <span className={cx(part('readout'), edge(point.x))}>
                      {labels[marked!]} · {fmt(point.value)}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {xAxis && (
          <div className={part('x-axis')}>
            {labels.map((l, i) =>
              shown[i] ? (
                <span key={i} className={`${part('x-label')} ${part('x-label')}--${shown[i]}`} style={{ left: `${xAt(i)}%` }}>
                  {l}
                </span>
              ) : null,
            )}
          </div>
        )}
      </div>
      <ChartData
        part={part}
        caption={label}
        columns={[w.period, ...series.slice(0, 2).map((s) => s.name)]}
        rows={labels.map((l, i) => [l, ...series.slice(0, 2).map((s) => (s.values[i] === undefined ? '' : fmt(s.values[i]!)))])}
        shown={showData}
        title={w.data}
      />
    </div>
  );
}
