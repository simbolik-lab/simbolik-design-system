'use client';

import type { HTMLAttributes } from 'react';
import { meter } from './meter.manifest.js';
import { progress } from '../progress/progress.manifest.js';
import { useNameWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface MeterProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof meter.manifest> {
  /** How full, between min and max. Kept inside the range. */
  value: number;
  min?: number;
  max?: number;
  /** Text above the track, such as "Storage". Doubles as the accessible name. */
  label?: string;
  /** The accessible name of a meter without a visible label. Goes on the meter itself, not the outer box. */
  'aria-label'?: string;
  /** The id of text elsewhere on the page that names the meter. Goes on the meter itself. */
  'aria-labelledby'?: string;
  /** The value in words, when a percentage is not what it measures, such as "62 of 100 GB". Goes on the meter itself and is shown as the value. */
  'aria-valuetext'?: string;
  /** Show the value at the right of the label row: the percentage, or the value in words when given. */
  showValue?: boolean;
}

/**
 * Meter: how full something is inside a known range. For how far along a task is, use the progress bar.
 *
 *   <Meter value={62} label="Storage" showValue aria-valuetext="62 of 100 GB" />
 */
export function Meter({ tone, value, min = 0, max = 100, label, showValue, className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-valuetext': ariaValuetext, ...rest }: MeterProps) {
  const now = Math.max(min, Math.min(max, value));
  const percent = max > min ? ((now - min) / (max - min)) * 100 : 0;
  const name = ariaLabel ?? label;
  useNameWarning('Meter', Boolean(name || ariaLabelledby), 'Give it a label, or an aria-label, or point aria-labelledby at words that name it.');
  const classes = cx(meter({ tone }), progress.manifest.block, className);
  const part = progress.part;
  return (
    <div className={classes} {...rest}>
      {(label || showValue) && (
        <div className={part('header')}>
          <span className={part('label')}>{label}</span>
          {showValue && <span className={part('value')}>{ariaValuetext ?? `${Math.round(percent)}%`}</span>}
        </div>
      )}
      <div
        className={part('track')}
        role="meter"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={now}
        aria-valuetext={ariaValuetext}
        aria-label={name}
        aria-labelledby={ariaLabelledby}
      >
        <span className={part('fill')} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
