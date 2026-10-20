import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { uptimeBar } from './uptime-bar.manifest.js';
import { cx } from '../variants.js';

/** How a period went: up the whole time, an incident (slow or partly down), or an outage (down). */
export type UptimeStatus = 'up' | 'incident' | 'outage';

export interface UptimePeriod {
  status: UptimeStatus;
  /** The period in words, such as "Oct 12", for the list a screen reader hears of the periods that were not up. */
  label: string;
}

/** The words a screen reader hears before the periods of each status, in the page's language. */
export interface UptimeWords {
  /** Said in a bar's tooltip when its period was up the whole time. */
  up: string;
  incident: string;
  outage: string;
  /** Said when every period was up. */
  allUp: string;
}

export const UPTIME_WORDS: UptimeWords = { up: 'Up', incident: 'Incident', outage: 'Outage', allUp: 'No incidents' };

export interface UptimeBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The periods, oldest first, one bar each: usually the last 30 days. */
  periods: readonly UptimePeriod[];
  /** When the first bar is, such as "30 days ago". */
  start: ReactNode;
  /** When the last bar is, such as "Today". */
  end: ReactNode;
  /** The share up, in words, such as "99.9% up". */
  uptime: ReactNode;
  /** The line under the bars with the start, the share up and the end. On unless turned off; a screen reader hears the summary either way. */
  caption?: boolean;
  /**
   * What a screen reader hears instead of the bars, in words. Unless given, the start, the end and the share up,
   * then the periods with an incident and those with an outage, by their labels.
   */
  summary?: string;
  /** The words of the summary built from the periods, in the page's language. */
  words?: Partial<UptimeWords>;
  /** Reaches the uptime bar. */
  ref?: Ref<HTMLDivElement>;
}

const text = (node: ReactNode) => (typeof node === 'string' || typeof node === 'number' ? String(node) : '');

/** The summary built from the periods: "30 days ago to Today: 99.9% up. Incident: Oct 12, Oct 13." */
export function uptimeSummary(periods: readonly UptimePeriod[], span: { start: ReactNode; end: ReactNode; uptime: ReactNode }, words: UptimeWords = UPTIME_WORDS): string {
  const lead = [text(span.start), text(span.end)].filter(Boolean).join(' to ');
  const head = [lead, text(span.uptime)].filter(Boolean).join(': ');
  const of = (status: UptimeStatus) => periods.filter((p) => p.status === status).map((p) => p.label);
  const parts = (['incident', 'outage'] as const).filter((s) => of(s).length).map((s) => `${words[s]}: ${of(s).join(', ')}.`);
  return [head && `${head}.`, ...(parts.length ? parts : [`${words.allUp}.`])].filter(Boolean).join(' ');
}

/**
 * Uptime bar: one bar per period, colored by its status, over a caption with the start, the share up and the end.
 * The bars and the caption are hidden from screen readers, which hear the summary instead. Each bar says its period
 * and how it went in the browser's own tooltip. It takes no focus.
 */
export function UptimeBar({ periods, start, end, uptime, caption = true, summary, words, className, ...rest }: UptimeBarProps) {
  const part = uptimeBar.part;
  const w = { ...UPTIME_WORDS, ...words };
  const said = summary ?? uptimeSummary(periods, { start, end, uptime }, w);
  return (
    <div className={cx(uptimeBar(), className)} {...rest}>
      <div className={part('bars')} aria-hidden="true">
        {periods.map((p, i) => (
          <span key={i} className={`${part('bar')} ${part('bar')}--status-${p.status}`} title={`${p.label}: ${w[p.status]}`} />
        ))}
      </div>
      {caption && (
        <p className={part('caption')} aria-hidden="true">
          <span className={part('start')}>{start}</span>
          <span className={part('uptime')}>{uptime}</span>
          <span className={part('end')}>{end}</span>
        </p>
      )}
      <p className={part('hidden')}>{said}</p>
    </div>
  );
}
