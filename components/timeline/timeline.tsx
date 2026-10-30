'use client';

import { useEffect, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref, type SyntheticEvent } from 'react';
import { timeline } from './timeline.manifest.js';
import { Icon } from '../icon/icon.js';
import { useControllable } from '../controllable.js';
import { foldBack, settle, showsOpen, unfold, type Unfolding } from '../unfold.js';
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
  /**
   * More about the event, shown in place under it when the reader presses it: the title, time, meta line and detail
   * become one row that opens and closes it, with a caret, and says whether it is open. None unless given.
   */
  more?: ReactNode;
  /** Whether the more is shown, held by the page. Leave it out and pass `defaultExpanded` for the item to keep its own. */
  expanded?: boolean;
  /** Whether the more is shown at first, when the item keeps its own state. Closed unless given. */
  defaultExpanded?: boolean;
  /** Told the new state each time a press shows or hides the more. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Reaches the list item. */
  ref?: Ref<HTMLLIElement>;
}

/**
 * One event of a Timeline: the rail with its dot and line, then the title, the time, the meta line and the detail.
 *
 * Given `more`, its body is one native disclosure: the title, time, meta line and detail are the summary, with a
 * caret, so it opens and closes with Enter and Space and says whether it is open with no script, and `more` is what it
 * discloses. Once it runs, the item takes every press on the summary and moves the body itself, the same in every
 * browser (unfold.ts), as the accordion's items move.
 */
export function TimelineItem({ tone = 'default', title, time, dateTime, meta, detail, toneWords, more, expanded, defaultExpanded = false, onExpandedChange, className, ...rest }: TimelineItemProps) {
  const part = timeline.part;
  const words = toneWords ?? TIMELINE_TONE_WORDS[tone];
  const shown = (node: ReactNode) => node !== undefined && node !== null && node !== false && node !== '';
  const when =
    shown(time) &&
    (dateTime ? (
      <time className={part('time')} dateTime={dateTime}>
        {time}
      </time>
    ) : (
      <span className={part('time')}>{time}</span>
    ));
  if (shown(more)) {
    return (
      <li className={cx(part('item'), `${part('item')}--tone-${tone}`, className)} {...rest}>
        <span className={part('rail')} aria-hidden="true">
          <span className={part('marker')}>
            <span className={part('dot')} />
          </span>
          <span className={part('line')} />
        </span>
        <div className={part('body')}>
          <TimelineDisclosure expanded={expanded} defaultExpanded={defaultExpanded} onExpandedChange={onExpandedChange} more={more}>
            <span className={part('top')}>
              <span className={part('title')}>
                {words && <span className={part('hidden')}>{words}: </span>}
                {title}
              </span>
              {when}
              <Icon name="CaretDown" className={part('caret')} />
            </span>
            {shown(meta) && <span className={part('meta')}>{meta}</span>}
            {shown(detail) && <span className={part('detail')}>{detail}</span>}
          </TimelineDisclosure>
        </div>
      </li>
    );
  }
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
          {when}
        </div>
        {shown(meta) && <p className={part('meta')}>{meta}</p>}
        {shown(detail) && <p className={part('detail')}>{detail}</p>}
      </div>
    </li>
  );
}

/** What an item's body fades and reveals as it unfolds (unfold.ts): its more. */
const UNFOLDING: Unfolding = {
  content: (block) => block.querySelector<HTMLElement>(`:scope > .${timeline.part('more')}`),
  reveal: '--smbk-timeline-reveal',
};

/**
 * An item's body that unfolds: the details element, its open state written once as it starts; after that the item
 * opens and closes it itself, so a page's `expanded` moves it with the same motion as a press.
 */
function TimelineDisclosure({ expanded: expandedProp, defaultExpanded, onExpandedChange, more, children }: {
  expanded?: boolean;
  defaultExpanded: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  more: ReactNode;
  children: ReactNode;
}) {
  const part = timeline.part;
  const own = useRef<HTMLDetailsElement>(null);
  const [expanded, setExpanded] = useControllable({ value: expandedProp, defaultValue: defaultExpanded, onChange: onExpandedChange, name: 'TimelineItem expanded' });
  // The state it starts in, written into the markup once; React never writes the attribute again.
  const [startsOpen] = useState(expanded);
  const last = useRef(expanded);

  useEffect(() => {
    const block = own.current;
    if (!block) return undefined;
    block.dataset.motion = '';
    return () => {
      delete block.dataset.motion;
      settle(block);
    };
  }, [own]);

  // The page's value, or the item's own after a press, moves the element when it differs from what it shows.
  useEffect(() => {
    const block = own.current;
    if (!block || last.current === expanded) return;
    last.current = expanded;
    if (showsOpen(block) === expanded) return;
    if (expanded) unfold(block, UNFOLDING);
    else foldBack(block, UNFOLDING);
  }, [expanded, own]);

  const press = (event: MouseEvent<HTMLDetailsElement>) => {
    const block = event.currentTarget;
    const summary = (event.target as Element).closest('summary');
    if (!summary || summary !== block.querySelector(':scope > summary')) return;
    // The browser's own toggle never runs: the item opens and closes the element with its motion.
    event.preventDefault();
    const next = !showsOpen(block);
    // Held by the item, it moves in the press itself; held by the page, it moves when the page passes the change.
    if (expandedProp === undefined) {
      last.current = next;
      if (next) unfold(block, UNFOLDING);
      else foldBack(block, UNFOLDING);
    }
    setExpanded(next);
  };

  // Something other than a press opened or closed it (the browser's find in page opens it to show a match): the
  // state follows what the element shows.
  const toggled = (event: SyntheticEvent<HTMLDetailsElement>) => {
    const block = event.currentTarget;
    if (block.dataset.moving !== undefined || block.dataset.closing !== undefined) return;
    if (block.open !== last.current) {
      last.current = block.open;
      setExpanded(block.open);
    }
  };

  return (
    <details ref={own} className={part('disclosure')} open={startsOpen} onClick={press} onToggle={toggled}>
      <summary className={part('summary')}>{children}</summary>
      <div className={part('more')}>{more}</div>
    </details>
  );
}
