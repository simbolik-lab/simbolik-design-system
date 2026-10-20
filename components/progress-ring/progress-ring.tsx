import type { CSSProperties, HTMLAttributes } from 'react';
import { progressRing } from './progress-ring.manifest.js';
import { useNameWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ProgressRingProps extends HTMLAttributes<HTMLDivElement>, Omit<VariantProps<typeof progressRing.manifest>, 'complete'> {
  /** How far along, between zero and max. Kept inside the range. */
  value: number;
  max?: number;
  /** What the ring measures, such as "Profile complete". Its accessible name; not shown. */
  'aria-label'?: string;
  /** The id of text elsewhere on the page that names the ring, such as a label beside it. */
  'aria-labelledby'?: string;
  /** The value in words, when a percentage is not what it measures, such as "3 of 5 steps". */
  'aria-valuetext'?: string;
}

/**
 * Progress ring: how far something has got, as a ring with the percentage in the middle.
 *
 *   <ProgressRing value={60} aria-label="Profile complete" />
 *
 * The ring is a progress bar to a screen reader, named by its aria-label or aria-labelledby.
 */
export function ProgressRing({ size, value, max = 100, className, style, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-valuetext': ariaValuetext, ...rest }: ProgressRingProps) {
  const now = Math.max(0, Math.min(max, value));
  const percent = max > 0 ? (now / max) * 100 : 0;
  useNameWarning('Progress ring', Boolean(ariaLabel || ariaLabelledby), 'Give it an aria-label, or point aria-labelledby at words that name it.');
  const classes = cx(progressRing({ size, complete: percent >= 100 }), className);
  const part = progressRing.part;
  return (
    // The page's attributes first, so the ring's own role and values always win.
    <div
      {...rest}
      className={classes}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={now}
      aria-valuetext={ariaValuetext}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      style={{ ...style, '--smbk-progress-ring-value': percent } as CSSProperties}
    >
      <span className={part('track')} aria-hidden="true" />
      <span className={part('value')} aria-hidden="true">{Math.round(percent)}%</span>
    </div>
  );
}
