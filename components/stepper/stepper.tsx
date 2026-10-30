'use client';

import type { HTMLAttributes, MouseEventHandler, ReactNode, Ref } from 'react';
import { stepper } from './stepper.manifest.js';
import { progress } from '../progress/progress.manifest.js';
import { Icon } from '../icon/icon.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/** Where a step stands. One step at a time is current. */
export type StepStatus = 'not-started' | 'current' | 'unavailable' | 'complete' | 'error';

/** The words a screen reader hears for each status, after the step's name. */
export const STEP_STATUS_WORDS: Record<StepStatus, string> = {
  'not-started': 'not started',
  current: 'current step',
  unavailable: 'unavailable',
  complete: 'completed',
  error: 'error',
};

export interface Step {
  /** The step's name, for what the reader does there, such as "Delivery". */
  label: string;
  /** Where the step stands. Not started unless given. */
  status?: StepStatus;
  /** The line under the name, such as "Done", "In progress", why a step is unavailable ("After payment") or what is wrong ("Card number missing"). */
  statusText?: ReactNode;
  /** The words a screen reader hears for the status, in the page's language. The status's own words unless given. */
  statusWords?: string;
  /**
   * Where going back to this step leads: the step becomes a link. A finished step or one with an error only,
   * and only when the reader can really go back; on any other step it is ignored.
   */
  href?: string;
  /** What going back to this step does, for a form that changes step without a new page: the step becomes a button. As href, a finished step or one with an error only. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof stepper.manifest> {
  /** The steps, in order. Three or more. */
  steps: Step[];
  /** The accessible name of the list of steps and of the summary, such as "Checkout steps". */
  label?: string;
  /** The summary's count, in the page's language. "Step 2 of 4" unless given. */
  countText?: (step: number, total: number) => string;
  /** Reaches the outer div. */
  ref?: Ref<HTMLDivElement>;
}

const englishCount = (step: number, total: number) => `Step ${step} of ${total}`;

/** The step the summary names: the current one, else the first with an error, else the first not finished, else the last. */
function summaryIndex(steps: Step[]): number {
  const at = (status: StepStatus) => steps.findIndex((s) => (s.status ?? 'not-started') === status);
  for (const i of [at('current'), at('error'), steps.findIndex((s) => s.status !== 'complete')]) if (i >= 0) return i;
  return steps.length - 1;
}

const sameWords = (a: ReactNode, b: string) => typeof a === 'string' && a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Stepper: an ordered list of steps, each its marker, its name and its status, and a summary of where the
 * reader is. The current step carries aria-current="step"; every step's status is said in words.
 */
export function Stepper({ layout = 'horizontal', steps, label = 'Steps', countText = englishCount, className, ...rest }: StepperProps) {
  const part = stepper.part;
  const index = summaryIndex(steps);
  const total = steps.length;
  const named = steps[index];
  return (
    <div className={cx(stepper({ layout }), className)} {...rest}>
      {layout !== 'summary' && (
        <ol className={part('list')} role="list" aria-label={label}>
          {steps.map((step, i) => (
            <StepItem key={i} step={step} number={i + 1} />
          ))}
        </ol>
      )}
      {layout !== 'vertical' && total > 0 && (
        <div className={part('summary')} role="group" aria-label={label}>
          <div className={part('summary-text')}>
            <p className={part('count')}>{countText(index + 1, total)}</p>
            <p className={part('step-name')}>{named?.label}</p>
          </div>
          <div className={`${progress({ size: 'sm' })} ${part('track')}`} aria-hidden="true">
            <div className={progress.part('track')}>
              <span className={progress.part('fill')} style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepItem({ step, number }: { step: Step; number: number }) {
  const part = stepper.part;
  const status = step.status ?? 'not-started';
  const words = step.statusWords ?? STEP_STATUS_WORDS[status];
  const current = status === 'current';
  const canReturn = status === 'complete' || status === 'error';
  const mark =
    status === 'complete' ? <Icon name="Check" className={part('icon')} /> : status === 'error' ? <Icon name="Warning" className={part('icon')} /> : <span className={part('number')}>{number}</span>;
  const body = (
    <>
      <span className={part('marker-row')} aria-hidden="true">
        <span className={part('marker')}>{mark}</span>
        <span className={part('connector')} />
      </span>
      <span className={part('text')}>
        <span className={part('label')}>
          {step.label}
          {!sameWords(step.statusText, words) && <span className={part('hidden')}>, {words}.</span>}
        </span>
        {step.statusText !== undefined && step.statusText !== null && step.statusText !== false && step.statusText !== '' && <span className={part('status')}>{step.statusText}</span>}
      </span>
    </>
  );
  let inner: ReactNode;
  if (canReturn && step.href !== undefined) {
    inner = (
      <a className={part('step')} href={step.href}>
        {body}
      </a>
    );
  } else if (canReturn && step.onClick) {
    inner = (
      <button type="button" className={part('step')} onClick={step.onClick}>
        {body}
      </button>
    );
  } else {
    // An unavailable step cannot be reached yet: marked so, its faint name is the look of a step not open.
    inner = (
      <div className={part('step')} aria-disabled={status === 'unavailable' || undefined}>
        {body}
      </div>
    );
  }
  return (
    <li className={`${part('item')} ${part('item')}--status-${status}`} aria-current={current ? 'step' : undefined}>
      {inner}
    </li>
  );
}
