import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { chartFormat, dateFormat } from '../format.js';
import { heatmap } from './heatmap.manifest.js';
import { cx } from '../variants.js';

/** A day's shade: 0 for nothing, then 1 to 4 from less to more. */
export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

/** How many weeks a narrow layout shows: the last ones. */
export const HEATMAP_NARROW_WEEKS = 13;

const DAY = 86_400_000;

/** A date written as YYYY-MM-DD, read as a day with no time zone. */
function parseDay(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y!, (m ?? 1) - 1, d ?? 1);
}

/** Monday is 0, Sunday 6. */
const weekday = (day: number) => (new Date(day).getUTCDay() + 6) % 7;

/** The level of each value: none for zero or nothing, else a quarter of the highest value per step. */
export function heatmapLevel(value: number | null | undefined, max: number): HeatmapLevel {
  if (value === null || value === undefined || value <= 0 || max <= 0) return 0;
  return Math.min(4, Math.max(1, Math.ceil((value / max) * 4))) as HeatmapLevel;
}

interface Day {
  day: number;
  value: number | null | undefined;
  /** Outside the data: before the first day or after the last. */
  blank: boolean;
}

interface Week {
  days: Day[];
  /** The month named above the week where it starts, in a wide space and in a narrow one. */
  month?: string;
  monthNarrow?: string;
  early: boolean;
}

/** The weeks the values cover, Monday to Sunday, with the months named over the weeks they start in. */
function weeksOf(start: string, values: readonly (number | null | undefined)[], monthName: (day: number) => string): Week[] {
  const first = parseDay(start);
  const from = first - weekday(first) * DAY;
  const last = first + (values.length - 1) * DAY;
  const count = Math.max(1, Math.ceil((last - from + DAY) / (7 * DAY)));
  const weeks: Week[] = [];
  for (let w = 0; w < count; w++) {
    const days: Day[] = [];
    for (let d = 0; d < 7; d++) {
      const day = from + (w * 7 + d) * DAY;
      const i = Math.round((day - first) / DAY);
      days.push({ day, value: values[i], blank: i < 0 || i >= values.length });
    }
    weeks.push({ days, early: w < count - HEATMAP_NARROW_WEEKS });
  }
  // A month is named over the first week holding its first day, and the first week shown names its own month
  // unless that month's start is close enough for its name to run into the next.
  const name = (from: number) => {
    let named = -3;
    weeks.forEach((week, w) => {
      if (w < from) return;
      const starts = week.days.find((d) => !d.blank && new Date(d.day).getUTCDate() === 1);
      const lead = w === from ? week.days.find((d) => !d.blank) : undefined;
      const next = weeks.slice(w + 1, w + 3).some((n) => n.days.some((d) => !d.blank && new Date(d.day).getUTCDate() === 1));
      const day = starts ?? (lead && !next ? lead : undefined);
      if (day && w - named >= 3) {
        if (from === 0) week.month = monthName(day.day);
        else week.monthNarrow = monthName(day.day);
        named = w;
      }
    });
  };
  name(0);
  name(Math.max(0, count - HEATMAP_NARROW_WEEKS));
  return weeks;
}

/** The words of the scale and the table, in the page's language. */
export interface HeatmapWords {
  less: string;
  more: string;
  /** Before a week's first day in the table's first column, such as "Week of". */
  weekOf: string;
}

export const HEATMAP_WORDS: HeatmapWords = { less: 'Less', more: 'More', weekOf: 'Week of' };

export interface HeatmapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The first day of the values, written YYYY-MM-DD. */
  start: string;
  /** One value a day from the first day on, such as the hours worked or the changes made; nothing for a day with none. */
  values: readonly (number | null | undefined)[];
  /** What the values are, such as "Changes per day, last 26 weeks": the table's caption, which a screen reader hears. */
  label: string;
  /** The summary at the foot, such as "141 days with work". */
  summary?: ReactNode;
  /** The scale from less to more beside the summary. On unless turned off. */
  legend?: boolean;
  /** The value that takes the darkest shade. The highest value unless given. */
  max?: number;
  /** A value as the table shows it. A number in English, or in `locale`, unless given. */
  format?: (value: number) => string;
  /** The language of the month and weekday names and the values, such as "de-DE". English unless given, so a page prepared on a server and the browser write them alike. */
  locale?: string;
  /** The words of the scale and the table. */
  words?: Partial<HeatmapWords>;
  /** Reaches the heatmap. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Heatmap: a week to a column, Monday at the top, each day a square in its level's shade, the months above, and
 * the summary and the scale below. The picture is hidden from screen readers, which read the same values in a
 * table, a week to a row. Each day says its date and value in the browser's own tooltip. It takes no focus.
 */
export function Heatmap({ start, values, label, summary, legend = true, max, format, locale, words, className, ...rest }: HeatmapProps) {
  const part = heatmap.part;
  const w = { ...HEATMAP_WORDS, ...words };
  const fmt = chartFormat(format, locale);
  const month = dateFormat(locale, { month: 'short', timeZone: 'UTC' });
  const short = dateFormat(locale, { weekday: 'short', timeZone: 'UTC' });
  const long = dateFormat(locale, { weekday: 'long', timeZone: 'UTC' });
  const date = dateFormat(locale, { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const tipDate = dateFormat(locale, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  const weeks = weeksOf(start, values, (day) => month.format(day));
  const top = max ?? Math.max(0, ...values.map((v) => v ?? 0));
  // Monday 1 January 2024 starts the week the weekday names are read from.
  const names = Array.from({ length: 7 }, (_, d) => Date.UTC(2024, 0, 1 + d));
  const cell = (level: HeatmapLevel | 'blank') => `${part('cell')} ${part('cell')}--${level === 'blank' ? 'blank' : `level-${level}`}`;
  return (
    <div className={cx(heatmap(), className)} {...rest}>
      <div className={part('chart')} aria-hidden="true">
        <div className={part('weekdays')}>
          <span className={part('month')} />
          {names.map((day, d) => (
            <span key={d} className={part('weekday')}>{d % 2 === 0 && d < 6 ? short.format(day) : ''}</span>
          ))}
        </div>
        {weeks.map((week, i) => (
          <div key={i} className={cx(part('week'), week.early && `${part('week')}--early`)}>
            <span className={part('month')}>
              {week.month && <span className={`${part('month-name')} ${part('month-name')}--wide`}>{week.month}</span>}
              {week.monthNarrow && <span className={`${part('month-name')} ${part('month-name')}--narrow`}>{week.monthNarrow}</span>}
            </span>
            {week.days.map((d) => (
              <span key={d.day} className={cell(d.blank ? 'blank' : heatmapLevel(d.value, top))} title={d.blank ? undefined : `${tipDate.format(d.day)}: ${fmt(d.value ?? 0)}`} />
            ))}
          </div>
        ))}
      </div>
      {legend && (
        <div className={part('legend')}>
          {summary !== undefined && summary !== null && summary !== '' ? <p className={part('summary')}>{summary}</p> : <span />}
          <div className={part('scale')} aria-hidden="true">
            <span className={part('scale-word')}>{w.less}</span>
            {([0, 1, 2, 3, 4] as const).map((level) => (
              <span key={level} className={cell(level)} />
            ))}
            <span className={part('scale-word')}>{w.more}</span>
          </div>
        </div>
      )}
      {!legend && summary !== undefined && summary !== null && summary !== '' && <p className={part('hidden')}>{summary}</p>}
      <table className={part('table')}>
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{w.weekOf}</th>
            {names.map((day) => (
              <th key={day} scope="col">{long.format(day)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              <th scope="row">{date.format(week.days[0]!.day)}</th>
              {week.days.map((d) => (
                <td key={d.day}>{d.blank ? '' : fmt(d.value ?? 0)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
