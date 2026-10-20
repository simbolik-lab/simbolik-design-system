import type { HTMLAttributes, Ref } from 'react';
import { numberFormat } from '../format.js';
import { diffStat } from './diff-stat.manifest.js';
import { cx } from '../variants.js';

/** How many squares the balance is drawn with. */
const BLOCKS = 5;

export interface DiffStatProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Lines added. */
  added: number;
  /** Lines removed. */
  removed: number;
  /** The sentence a screen reader hears, instead of "128 lines added, 12 lines removed". */
  label?: string;
  /** Reaches the outer element. */
  ref?: Ref<HTMLSpanElement>;
}

/**
 * The five squares: each side's share of the lines, rounded, and at least one square for a side with any lines
 * at all, so a small removal still shows. Nothing changed leaves all five empty.
 */
export function diffBlocks(added: number, removed: number): ('added' | 'removed' | 'empty')[] {
  const total = added + removed;
  if (total <= 0) return Array.from({ length: BLOCKS }, () => 'empty');
  let plus = Math.round((added / total) * BLOCKS);
  if (added > 0 && plus === 0) plus = 1;
  if (removed > 0 && plus === BLOCKS) plus = BLOCKS - 1;
  const minus = removed > 0 ? BLOCKS - plus : 0;
  return Array.from({ length: BLOCKS }, (_, i) => (i < plus ? 'added' : i < plus + minus ? 'removed' : 'empty'));
}

const count = (n: number) => numberFormat().format(n);
const lines = (n: number) => `${count(n)} ${n === 1 ? 'line' : 'lines'}`;

/**
 * Diff stat: the lines a change added and removed, and the balance as five small squares.
 *
 *   <DiffStat added={128} removed={12} />
 *
 * A screen reader hears one sentence, "128 lines added, 12 lines removed"; the signs and the squares are hidden from it.
 */
export function DiffStat({ added, removed, label, className, ...rest }: DiffStatProps) {
  const part = diffStat.part;
  const plus = Math.max(0, Math.round(added));
  const minus = Math.max(0, Math.round(removed));
  const classes = cx(diffStat({}), className);
  return (
    <span className={classes} {...rest}>
      <span className={part('hidden')}>{label ?? `${lines(plus)} added, ${lines(minus)} removed`}</span>
      <span className={part('added')} aria-hidden="true">{`+${count(plus)}`}</span>
      <span className={part('removed')} aria-hidden="true">{`−${count(minus)}`}</span>
      <span className={part('blocks')} aria-hidden="true">
        {diffBlocks(plus, minus).map((kind, i) => (
          <span key={i} className={cx(part('block'), kind === 'empty' ? '' : `${part('block')}--${kind}`)} />
        ))}
      </span>
    </span>
  );
}
