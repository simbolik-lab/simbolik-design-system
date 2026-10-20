import { Children, isValidElement, useId, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { useObjectRef } from 'react-aria';
import { useScrollRegion } from '../scroll-hint.js';
import { Badge } from '../badge/badge.js';
import { StatusDot, type StatusDotProps } from '../status-dot/status-dot.js';
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

export interface BoardGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** What the cards have in common, such as "Waiting on you". It names the list for a screen reader. */
  label: string;
  /** How many cards the group holds in all, in a small badge after the label. Part of the list's name. */
  count?: number;
  /** A status dot before the label, in this tone. Decoration: the label says what the group is. */
  dot?: StatusDotProps['tone'];
  /** Under the cards: a small ghost button that shows the rest, named for what it shows ("Show all 6 waiting"). */
  more?: ReactNode;
  /** The cards: each becomes one item of the group's list. */
  children?: ReactNode;
}

/**
 * Board group: inside a column, a label with its count, the cards as a list and an optional "Show all".
 */
export function BoardGroup({ label, count, dot, more, className, children, ...rest }: BoardGroupProps) {
  const part = boardColumn.part;
  const id = useId();
  const named = count !== undefined ? `${id}-label ${id}-count` : `${id}-label`;
  return (
    <div className={cx(part('group'), className)} {...rest}>
      <div className={part('group-head')}>
        {dot && <StatusDot tone={dot} className={part('dot')} aria-hidden="true" />}
        <span className={part('group-label')} id={`${id}-label`}>{label}</span>
        {count !== undefined && (
          <Badge look="soft" size="sm" tone="info" className={part('count')} id={`${id}-count`}>
            {count}
          </Badge>
        )}
      </div>
      <ul className={part('cards')} aria-labelledby={named}>
        {Children.toArray(children).map((card, i) => (
          <li key={isValidElement(card) && card.key !== null ? card.key : i} className={part('card')}>
            {card}
          </li>
        ))}
      </ul>
      {more && <div className={part('more')}>{more}</div>}
    </div>
  );
}
