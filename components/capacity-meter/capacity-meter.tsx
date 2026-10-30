'use client';

import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { capacityMeter } from './capacity-meter.manifest.js';
import { useNameWarning } from '../name-check.js';
import { cx } from '../variants.js';

export interface CapacityMeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** How many places are taken. Kept between 0 and the number of places. */
  filled: number;
  /** How many places there are: one bar each. Two to four read at a glance. */
  segments?: number;
  /** The word for what is counted, in the plural, for the words after the bars: "1 of 2 places". */
  unit?: string;
  /** Other words after the bars, instead of "1 of 2 places". They are also what a screen reader hears as the value. */
  children?: string;
  /** What the meter measures, such as "Agents on the blog". A meter needs a name. */
  'aria-label'?: string;
  /** The id of words elsewhere on the page that name the meter, such as the heading of its column. */
  'aria-labelledby'?: string;
  /** Reaches the outer element, which is the meter. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Capacity meter: how many of a few places are taken, as bars and in words.
 *
 *   <CapacityMeter filled={1} segments={2} aria-label="Agents on the blog" />
 *
 * The whole is one meter: a screen reader hears its name and the words as its value.
 */
export function CapacityMeter({ filled, segments = 2, unit = 'places', children, className, ...rest }: CapacityMeterProps) {
  const part = capacityMeter.part;
  const count = Math.max(1, Math.round(segments));
  const taken = Math.max(0, Math.min(count, Math.round(filled)));
  const words: ReactNode = children ?? `${taken} of ${count} ${unit}`;
  useNameWarning('Capacity meter', Boolean(rest['aria-label'] || rest['aria-labelledby']), 'Give it an aria-label, or point aria-labelledby at words that name it.');
  const classes = cx(capacityMeter({}), className);
  return (
    // The page's attributes first, so the meter's own role and values always win.
    <div {...rest} className={classes} role="meter" aria-valuemin={0} aria-valuemax={count} aria-valuenow={taken} aria-valuetext={String(words)}>
      <span className={part('segments')} aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={cx(part('segment'), i < taken ? `${part('segment')}--filled` : '')} />
        ))}
      </span>
      <span className={part('words')} aria-hidden="true">
        {words}
      </span>
    </div>
  );
}
