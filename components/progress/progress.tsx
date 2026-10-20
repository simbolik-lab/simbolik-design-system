import type { HTMLAttributes, MouseEventHandler } from 'react';
import { progress } from './progress.manifest.js';
import { Icon } from '../icon/icon.js';
import { useNameWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof progress.manifest> {
  /** How far along, between zero and max. Leave it out when the end is not known: the bar takes the unknown state. */
  value?: number;
  max?: number;
  /** Text above the track, e.g. "Uploading…", or what failed, e.g. "Upload failed". Doubles as the accessible name. */
  label?: string;
  /** The accessible name of a bar without a visible label. Goes on the progress bar itself, not the outer box. */
  'aria-label'?: string;
  /** The id of text elsewhere on the page that names the bar. Goes on the progress bar itself. */
  'aria-labelledby'?: string;
  /** The value in words, when a percentage is not what it measures, e.g. "Step 2 of 5". Goes on the progress bar itself and is shown as the value. */
  'aria-valuetext'?: string;
  /** Show the value at the right of the label row: the percentage, or the value in words when given. */
  showValue?: boolean;
  /** What the failed bar's Try again does. Without it a failed bar offers no retry. */
  onRetry?: MouseEventHandler<HTMLButtonElement>;
  /** The words of the retry button. */
  retryLabel?: string;
}

export function Progress({ tone, size, type, state, value, max = 100, label, showValue, onRetry, retryLabel = 'Try again', className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-valuetext': ariaValuetext, ...rest }: ProgressProps) {
  const shownState = state ?? (value === undefined ? 'unknown' : 'default');
  const unknown = shownState === 'unknown';
  const failed = shownState === 'failed';
  const now = unknown || value === undefined ? undefined : Math.max(0, Math.min(max, value));
  const exact = now === undefined || max <= 0 ? 0 : (now / max) * 100;
  // The pixel style fills whole segments, each a twentieth.
  const percent = type === 'pixel' ? Math.round(exact / 5) * 5 : exact;
  const name = ariaLabel ?? label;
  useNameWarning('Progress', Boolean(name || ariaLabelledby), 'Give it a label, or an aria-label, or point aria-labelledby at words that name it.');
  const classes = cx(progress({ tone, size, type, state: shownState }), className);
  const header = label || (showValue && !unknown) || (failed && onRetry);
  return (
    <div className={classes} {...rest}>
      {header && (
        <div className={progress.part('header')}>
          <span className={progress.part('label')}>
            {failed && <Icon name="XCircle" className={progress.part('icon')} />}
            {label}
          </span>
          {failed
            ? onRetry && (
                <button type="button" className={progress.part('retry')} onClick={onRetry}>
                  {retryLabel}
                </button>
              )
            : showValue && !unknown && <span className={progress.part('value')}>{ariaValuetext ?? `${Math.round(exact)}%`}</span>}
        </div>
      )}
      <div
        className={progress.part('track')}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={now}
        aria-valuetext={ariaValuetext}
        aria-label={name}
        aria-labelledby={ariaLabelledby}
      >
        <span className={progress.part('fill')} style={unknown ? undefined : { width: `${percent}%` }} />
      </div>
    </div>
  );
}
