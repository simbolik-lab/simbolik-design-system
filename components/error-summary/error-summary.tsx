'use client';

import { useEffect, useId, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react';
import { useObjectRef } from 'react-aria';
import { errorSummary } from './error-summary.manifest.js';
import { Icon } from '../icon/icon.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ErrorSummaryError {
  /**
   * The id of the field to blame: a control's id, or the id of a group around several (a field group's fieldset).
   * Given, the mistake is a link that moves focus to that control, or to the group's first control marked invalid.
   * Left out, the mistake is words alone, for a problem with the whole form.
   */
  id?: string;
  /** The mistake, worded exactly as the message beside its field, such as "Enter your email address". */
  message: ReactNode;
}

export interface ErrorSummaryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>, VariantProps<typeof errorSummary.manifest> {
  /** Every mistake, in the order the fields come in the form. */
  errors: ErrorSummaryError[];
  /** The heading. "There is a problem" unless given other words. */
  title?: ReactNode;
  /** A line under the heading, such as "Fix these so we can send your details:". */
  intro?: ReactNode;
  /** The heading's level in the page's outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Moves focus to the summary as it appears. On unless the page moves focus itself. */
  focusOnShow?: boolean;
  /**
   * Change it on each failed send, such as a count of sends, to move focus to a summary already showing again.
   * Focus moves when the summary appears and whenever this changes, never on other updates.
   */
  focusKey?: unknown;
  /** Reaches the outer div, e.g. to focus it. */
  ref?: Ref<HTMLDivElement>;
}

/** What a mistake's link can move focus to. */
const FOCUSABLE = 'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/** The control a link moves focus to: the element itself when it takes focus, else the first control in it marked invalid, else its first control. */
function controlFor(id: string): HTMLElement | null {
  const target = document.getElementById(id);
  if (!target) return null;
  if (target.matches(FOCUSABLE)) return target;
  const controls = [...target.querySelectorAll<HTMLElement>(FOCUSABLE)];
  return controls.find((c) => c.getAttribute('aria-invalid') === 'true') ?? controls[0] ?? null;
}

/** What to bring into view with the control: the group's legend, else the control's label, so the question shows above the answer. */
function headFor(control: HTMLElement, id: string): HTMLElement {
  const group = document.getElementById(id);
  const legend = group?.matches('fieldset') ? group.querySelector<HTMLElement>(':scope > legend') : null;
  if (legend) return legend;
  const label = control.id ? document.querySelector<HTMLElement>(`label[for="${CSS.escape(control.id)}"]`) : null;
  return label ?? control;
}

/**
 * Error summary: a box at the top of a form after a failed send, naming every mistake. It takes focus as it appears
 * (and whenever `focusKey` changes), so a screen reader reads its heading; it is not a Tab stop otherwise. Each
 * mistake with a field is a link: pressing it brings the field's label into view and moves focus to the field, or to
 * the first invalid control of a group. Without script, the link still goes to the field's id.
 *
 *   <ErrorSummary errors={[{ id: 'email', message: 'Enter your email address' }]} focusKey={sends} />
 */
export function ErrorSummary({ size, errors, title = 'There is a problem', intro, headingLevel = 2, focusOnShow = true, focusKey, ref, className, ...rest }: ErrorSummaryProps) {
  const headingId = `${useId()}-heading`;
  const own = useObjectRef(ref);

  useEffect(() => {
    if (focusOnShow) own.current?.focus();
    // Only showing and a new send move focus; a change of words or mistakes does not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey]);

  const go = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const control = controlFor(id);
    if (!control) return;
    event.preventDefault();
    headFor(control, id).scrollIntoView({ block: 'start' });
    control.focus({ preventScroll: true });
  };

  const Heading = `h${headingLevel}` as const;
  const part = errorSummary.part;
  return (
    <div ref={own} className={cx(errorSummary({ size }), className)} tabIndex={-1} role="group" aria-labelledby={headingId} {...rest}>
      <span className={part('icon')}>
        <Icon name="XCircle" />
      </span>
      <div className={part('content')}>
        <div className={part('text')}>
          <Heading id={headingId} className={part('heading')}>
            {title}
          </Heading>
          {intro !== undefined && intro !== null && intro !== false && intro !== '' && <p className={part('intro')}>{intro}</p>}
        </div>
        <ul className={part('list')}>
          {errors.map((error, i) => (
            <li key={error.id ?? `error-${i}`} className={part('item')}>
              {error.id ? (
                <a className={part('link')} href={`#${error.id}`} onClick={go(error.id)}>
                  {error.message}
                </a>
              ) : (
                error.message
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
