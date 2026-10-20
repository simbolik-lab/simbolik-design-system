import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { useNameWarning } from '../name-check.js';
import { statusDot } from './status-dot.manifest.js';

export interface StatusDotProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, VariantProps<typeof statusDot.manifest> {
  /**
   * The status in words, shown beside the dot, such as "Online". Without words the dot needs a name
   * (`aria-label`), or `aria-hidden` when the status is written out beside it.
   */
  children?: ReactNode;
  /** Reaches the outer element. */
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Status dot: a dot in the status' color and, given words, the status beside it.
 *
 *   <StatusDot tone="success">Online</StatusDot>
 *
 * The words are what a screen reader hears; the dot is hidden from it. A dot with no words is one image
 * named by its `aria-label`.
 */
export function StatusDot({ tone, className, children, ...rest }: StatusDotProps) {
  const part = statusDot.part;
  const classes = cx(statusDot({ tone }), className);
  const shown = children !== undefined && children !== null && children !== false && children !== '';
  const hidden = rest['aria-hidden'] === true || rest['aria-hidden'] === 'true';
  const named = shown || hidden || Boolean(rest['aria-label'] || rest['aria-labelledby']);
  useNameWarning('Status dot', named, 'Give it words as its children, or an aria-label, or hide it with aria-hidden when the status is written beside it.');
  if (!shown) {
    return (
      <span className={classes} role={hidden ? undefined : 'img'} {...rest}>
        <span className={part('dot')} />
      </span>
    );
  }
  return (
    <span className={classes} {...rest}>
      <span className={part('dot')} aria-hidden="true" />
      <span className={part('label')}>{children}</span>
    </span>
  );
}
