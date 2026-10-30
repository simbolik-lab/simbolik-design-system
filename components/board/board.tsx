'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { useScrollRegion } from '../scroll-hint.js';
import { table } from '../table/table.manifest.js';
import { board } from './board.manifest.js';
import { cx } from '../variants.js';

export interface BoardProps extends HTMLAttributes<HTMLDivElement> {
  /** What the board shows, such as "Agents by project". It names the frame while it scrolls sideways. */
  'aria-label': string;
  /** The columns: one or more BoardColumn. */
  children?: ReactNode;
}

/**
 * Board: columns of cards side by side, stacked in a narrow space.
 *
 *   <Board aria-label="Agents by project">
 *     <BoardColumn title="Website">…</BoardColumn>
 *     <BoardColumn title="Design system">…</BoardColumn>
 *   </Board>
 *
 * While the columns run past the frame, the frame is a region named by the label and a stop for the Tab
 * key, so the arrow keys can scroll it sideways.
 */
export function Board({ 'aria-label': label, className, children, ...rest }: BoardProps) {
  const { frame, thumb, region } = useScrollRegion({ label });
  const classes = cx(board({}), className);
  return (
    <div ref={frame} className={classes} {...region} {...rest}>
      <div className={board.part('columns')}>{children}</div>
      <div className={board.part('scroll-hint')} aria-hidden="true">
        <div className={table.part('scroll-track')}>
          <span ref={thumb} className={table.part('scroll-thumb')} />
        </div>
      </div>
    </div>
  );
}
