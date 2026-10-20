import type { HTMLAttributes, ReactNode } from 'react';
import { spinner } from './spinner.manifest.js';
import { useNameWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, VariantProps<typeof spinner.manifest> {
  /**
   * The words: what is being worked on, such as "Loading" or "Saving changes". Always read aloud; drawn with `label`.
   * Without them it says "Loading" and warns in development.
   */
  children: ReactNode;
}

/**
 * Spinner: the turning ring and its words. It is a status region, so a screen reader reads the words, never the
 * ring. The ring stops, and the words show, when the reader asks for reduced motion. A spinner has no end of its
 * own: past a few seconds the page offers a way out. Inside a button, use the button's loading flag instead.
 * Without words it says "Loading", rather than leaving a screen reader with nothing, and warns in development.
 */
export function Spinner({ size, tone, label, role, className, children, ...rest }: SpinnerProps) {
  const wordless = children === undefined || children === null || children === '';
  useNameWarning('A Spinner', !wordless, 'Give it its words, such as "Saving changes", so a screen reader can say what is happening; until then it says "Loading".');
  return (
    <span role={role ?? 'status'} className={cx(spinner({ size, tone, label }), className)} {...rest}>
      <span className={spinner.part('ring')} aria-hidden="true" />
      <span className={spinner.part('label')}>{wordless ? 'Loading' : children}</span>
    </span>
  );
}
