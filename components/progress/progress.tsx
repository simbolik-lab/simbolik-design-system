import type { HTMLAttributes } from 'react';
import { progress } from './progress.manifest.js';
import type { VariantProps } from '../variants.js';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof progress.manifest> {
  /** How far along, between zero and max. */
  value: number;
  max?: number;
  /** Text above the track, e.g. "Uploading…". Doubles as the accessible name. */
  label?: string;
  /** The accessible name of a bar without a visible label. Goes on the progress bar itself, not the outer box. */
  'aria-label'?: string;
  /** The id of text elsewhere on the page that names the bar. Goes on the progress bar itself. */
  'aria-labelledby'?: string;
  /** The value in words, when a percentage is not what it measures, e.g. "Step 2 of 5". Goes on the progress bar itself. */
  'aria-valuetext'?: string;
  /** Show the percentage at the right of the label row. */
  showValue?: boolean;
}

export function Progress({ tone, size, value, max = 100, label, showValue, className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-valuetext': ariaValuetext, ...rest }: ProgressProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  const classes = [progress({ tone, size }), className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {(label || showValue) && (
        <div className={progress.part('header')}>
          <span className={progress.part('label')}>{label}</span>
          {showValue && <span className={progress.part('value')}>{Math.round(percent)}%</span>}
        </div>
      )}
      <div
        className={progress.part('track')}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={ariaValuetext}
        aria-label={ariaLabel ?? label}
        aria-labelledby={ariaLabelledby}
      >
        <span className={progress.part('fill')} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
