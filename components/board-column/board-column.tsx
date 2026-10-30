'use client';

import { Children, isValidElement, useEffect, useId, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref, type SyntheticEvent } from 'react';
import { useObjectRef } from 'react-aria';
import { useScrollRegion } from '../scroll-hint.js';
import { Badge } from '../badge/badge.js';
import { Icon } from '../icon/icon.js';
import { StatusDot, type StatusDotProps } from '../status-dot/status-dot.js';
import { useControllable } from '../controllable.js';
import { isNarrow } from '../motion.js';
import { foldBack, settle, showsOpen, unfold, type Unfolding } from '../unfold.js';
import { boardColumn } from './board-column.manifest.js';
import { cx } from '../variants.js';

export interface BoardColumnProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The column's name, such as a project's. It names the column for a screen reader. */
  title: string;
  /** The title's heading level, to fit the page's outline: one below the heading above the board. 3 unless given. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Under the title: a capacity meter, or a line of text that sums the column up. */
  meter?: ReactNode;
  /** At the end of the head: a small ghost icon button that adds to the column, named for what it adds ("Add agent"). */
  action?: ReactNode;
  /** The column's groups: one or more BoardGroup. */
  children?: ReactNode;
  /** Reaches the column, the section element. */
  ref?: Ref<HTMLElement>;
}

/**
 * Board column: a lane of cards, a region named by its title.
 *
 *   <BoardColumn title="Website" meter={<CapacityMeter filled={1} aria-label="Agents on the blog" />}>
 *     <BoardGroup label="Waiting on you" dot="warning" count={2}>…cards…</BoardGroup>
 *   </BoardColumn>
 *
 * Given a height (a style or a class of the page's), the column scrolls inside itself, and while it has
 * more to show than fits it is also a stop for the Tab key, so the arrow keys can scroll it.
 */
export function BoardColumn({ title, headingLevel = 3, meter, action, className, children, ref, ...rest }: BoardColumnProps) {
  const part = boardColumn.part;
  const Title = `h${headingLevel}` as const;
  const id = useId();
  const own = useObjectRef(ref);
  // The section is named by its title already, so while it scrolls it is only a Tab stop.
  const { region } = useScrollRegion({ frame: own, axis: 'y' });
  const classes = cx(boardColumn({}), className);
  return (
    <section ref={own} className={classes} aria-labelledby={`${id}-title`} {...region} {...rest}>
      <div className={part('head')}>
        <div className={part('heading')}>
          <Title className={part('title')} id={`${id}-title`}>{title}</Title>
          {meter && <div className={part('meter')}>{meter}</div>}
        </div>
        {action && <div className={part('action')}>{action}</div>}
      </div>
      {children}
    </section>
  );
}

export interface BoardGroupProps extends HTMLAttributes<HTMLElement> {
  /** What the cards have in common, such as "Waiting on you". It names the list for a screen reader. */
  label: string;
  /** The label is a heading at this level, so the group sits in the page's outline: one below the column's title. A plain label unless given. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /**
   * The group folds under its head, which opens and closes it: `always`, or only in a narrow layout (`narrow`, a
   * phone), where in a wide one it is a plain group. It does not fold unless given.
   */
  fold?: 'always' | 'narrow';
  /** Whether a folding group is open, held by the page. Leave it out and pass `defaultExpanded` for the group to keep its own. */
  expanded?: boolean;
  /** Whether a folding group starts open, when it keeps its own state. Closed unless given. */
  defaultExpanded?: boolean;
  /** Told the new state each time a press opens or closes a folding group. */
  onExpandedChange?: (expanded: boolean) => void;
  /** How many cards the group holds in all, in a small badge after the label. Part of the list's name. */
  count?: number;
  /** A status dot before the label, in this tone. Decoration: the label says what the group is. */
  dot?: StatusDotProps['tone'];
  /** Under the cards: a small ghost button that shows the rest, named for what it shows ("Show all 6 waiting"). */
  more?: ReactNode;
  /** The cards: each becomes one item of the group's list. */
  children?: ReactNode;
}

/** What a folding group fades as it unfolds (unfold.ts): its body, the cards and "Show all". */
const UNFOLDING: Unfolding = { content: (group) => group.querySelector<HTMLElement>(`:scope > .${boardColumn.part('group-body')}`) };

/**
 * Board group: inside a column, a label with its count, the cards as a list and an optional "Show all".
 *
 * Given `fold`, it is one native disclosure: its head is the summary, with a caret at its end, so it opens and closes
 * with Enter and Space and says whether it is open with no script. Once it runs, the component takes every press on
 * the head and moves the group itself, the same in every browser (unfold.ts), as the accordion's items move. A group
 * that folds only in a narrow layout is drawn as a plain group whenever the layout switch says wide, and as the
 * disclosure again, open or closed as it was, when it says narrow.
 */
export function BoardGroup({ label, headingLevel, count, dot, more, fold, expanded: expandedProp, defaultExpanded = false, onExpandedChange, className, children, ...rest }: BoardGroupProps) {
  const part = boardColumn.part;
  const id = useId();
  const named = count !== undefined ? `${id}-label ${id}-count` : `${id}-label`;
  const Label = headingLevel ? (`h${headingLevel}` as const) : 'span';
  const [expanded, setExpanded] = useControllable({ value: expandedProp, defaultValue: defaultExpanded, onChange: onExpandedChange, name: 'BoardGroup expanded' });
  // Whether the layout switch says wide, read once the page runs; until then a group that folds only in a narrow
  // layout is the disclosure, which the stylesheet shows open in a wide one.
  const own = useRef<HTMLElement>(null);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    if (fold !== 'narrow' || typeof ResizeObserver === 'undefined') return undefined;
    const read = () => {
      if (own.current) setWide(!isNarrow(own.current));
    };
    read();
    const watch = new ResizeObserver(read);
    watch.observe(document.documentElement);
    return () => watch.disconnect();
  }, [fold]);
  const head = (
    <>
      {dot && <StatusDot tone={dot} className={part('dot')} aria-hidden="true" />}
      <Label className={part('group-label')} id={`${id}-label`}>{label}</Label>
      {count !== undefined && (
        <Badge look="soft" size="sm" tone="info" className={part('count')} id={`${id}-count`}>
          {count}
        </Badge>
      )}
    </>
  );
  const body = (
    <>
      <ul className={part('cards')} aria-labelledby={named}>
        {Children.toArray(children).map((card, i) => (
          <li key={isValidElement(card) && card.key !== null ? card.key : i} className={part('card')}>
            {card}
          </li>
        ))}
      </ul>
      {more && <div className={part('more')}>{more}</div>}
    </>
  );
  if (fold && !(fold === 'narrow' && wide)) {
    return (
      <FoldingGroup own={own} className={cx(part('group'), `${part('group')}--fold-${fold}`, className)} expanded={expanded} held={expandedProp !== undefined} setExpanded={setExpanded} head={head} rest={rest}>
        {body}
      </FoldingGroup>
    );
  }
  return (
    <div ref={own as Ref<HTMLDivElement>} className={cx(part('group'), className)} {...rest}>
      <div className={part('group-head')}>{head}</div>
      {body}
    </div>
  );
}

/**
 * A board group that folds: the details element, written open or closed once as it mounts (as it starts, or as it was
 * when the layout turns narrow again); after that the component opens and closes it itself, so a page's `expanded`
 * moves it with the same motion as a press.
 */
function FoldingGroup({ own, className, expanded, held, setExpanded, head, rest, children }: {
  own: Ref<HTMLElement>;
  className: string;
  expanded: boolean;
  held: boolean;
  setExpanded: (expanded: boolean) => void;
  head: ReactNode;
  rest: HTMLAttributes<HTMLElement>;
  children: ReactNode;
}) {
  const part = boardColumn.part;
  const group = useObjectRef(own as Ref<HTMLDetailsElement>);
  const [startsOpen] = useState(expanded);
  const last = useRef(expanded);
  const { onClick, ...attributes } = rest;

  useEffect(() => {
    const block = group.current;
    if (!block) return undefined;
    block.dataset.motion = '';
    return () => {
      delete block.dataset.motion;
      settle(block);
    };
  }, [group]);

  // The page's value, or the group's own after a press, moves the element when it differs from what it shows.
  useEffect(() => {
    const block = group.current;
    if (!block || last.current === expanded) return;
    last.current = expanded;
    if (showsOpen(block) === expanded) return;
    if (expanded) unfold(block, UNFOLDING);
    else foldBack(block, UNFOLDING);
  }, [expanded, group]);

  const press = (event: MouseEvent<HTMLDetailsElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const block = event.currentTarget;
    const summary = (event.target as Element).closest('summary');
    if (!summary || summary !== block.querySelector(':scope > summary')) return;
    // The browser's own toggle never runs: the component opens and closes the element with its motion.
    event.preventDefault();
    const next = !showsOpen(block);
    // Held by the group, it moves in the press itself; held by the page, it moves when the page passes the change.
    if (!held) {
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
    <details ref={group} className={className} open={startsOpen} onClick={press} onToggle={toggled} {...attributes}>
      <summary className={part('group-head')}>
        {head}
        <Icon name="CaretDown" className={part('caret')} />
      </summary>
      <div className={part('group-body')}>{children}</div>
    </details>
  );
}
