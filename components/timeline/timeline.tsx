import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { timeline } from './timeline.manifest.js';
import { cx } from '../variants.js';

/** The kind of event, shown by the dot's color. */
export type TimelineTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

/** The words a screen reader hears for each kind, before the event's title. A plain event has none. */
export const TIMELINE_TONE_WORDS: Record<TimelineTone, string> = {
  default: '',
  info: 'Information',
  success: 'Success',
  warning: 'Warning',
  danger: 'Error',
};

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  /** TimelineItems, in the order the page wants them read: newest first or oldest first. */
  children?: ReactNode;
  /** Reaches the list. */
  ref?: Ref<HTMLOListElement>;
}

/** Timeline: an ordered list of events, each a TimelineItem. It takes no focus of its own. */
export function Timeline({ className, children, ...rest }: TimelineProps) {
  return (
    <ol className={cx(timeline(), className)} role="list" {...rest}>
      {children}
    </ol>
  );
}

export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** The kind of event. Default unless given. Say the kind in the title's words too, such as "Upload failed". */
  tone?: TimelineTone;
  /** What happened, such as "Homepage published". */
  title: ReactNode;
  /** When it happened, as the reader reads it, such as "15:28" or "Yesterday". */
  time?: ReactNode;
  /** The same moment for machines, written as HTML's time element takes it (an ISO date and time). With it, the time is a time element. */
  dateTime?: string;
  /** Who or what did it, or where, such as "Website rebuild · by Ana Silva". */
  meta?: ReactNode;
  /** A detail line in code type, such as a commit and the files it changed. */
  detail?: ReactNode;
  /** The words a screen reader hears for the kind, before the title, in the page's language. The kind's own words unless given; empty for none. */
  toneWords?: string;
  /** Reaches the list item. */
  ref?: Ref<HTMLLIElement>;
}

/** One event of a Timeline: the rail with its dot and line, then the title, the time, the meta line and the detail. */
export function TimelineItem({ tone = 'default', title, time, dateTime, meta, detail, toneWords, className, ...rest }: TimelineItemProps) {
  const part = timeline.part;
  const words = toneWords ?? TIMELINE_TONE_WORDS[tone];
  const shown = (node: ReactNode) => node !== undefined && node !== null && node !== false && node !== '';
  return (
    <li className={cx(part('item'), `${part('item')}--tone-${tone}`, className)} {...rest}>
      <span className={part('rail')} aria-hidden="true">
        <span className={part('marker')}>
          <span className={part('dot')} />
        </span>
        <span className={part('line')} />
      </span>
      <div className={part('body')}>
        <div className={part('top')}>
          <p className={part('title')}>
            {words && <span className={part('hidden')}>{words}: </span>}
            {title}
          </p>
          {shown(time) &&
            (dateTime ? (
              <time className={part('time')} dateTime={dateTime}>
                {time}
              </time>
            ) : (
              <span className={part('time')}>{time}</span>
            ))}
        </div>
        {shown(meta) && <p className={part('meta')}>{meta}</p>}
        {shown(detail) && <p className={part('detail')}>{detail}</p>}
      </div>
    </li>
  );
}
