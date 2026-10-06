import type { HTMLAttributes } from 'react';
import { divider } from './divider.manifest.js';
import type { VariantProps } from '../variants.js';

export interface DividerProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof divider.manifest> {
  /** The word in the middle of a labelled divider, e.g. "or". Sets the labelled flag, which is read from it alone. */
  label?: string;
}

/**
 * Divider: a horizontal rule element, or a separator with a word between two lines. A separator's
 * contents are hidden from screen readers, so a labelled divider is not one as a whole: its first line
 * is the separator and its word is plain text after it, which is read: a visible label is content.
 */
export function Divider({ orientation, label, labelled: _labelled, className, ...rest }: DividerProps) {
  const labelled = label !== undefined;
  const classes = [divider({ orientation, labelled }), className].filter(Boolean).join(' ');
  if (labelled) {
    return (
      <div className={classes} {...rest}>
        <span role="separator" className={divider.part('line')} />
        <span className={divider.part('label')}>{label}</span>
        <span className={divider.part('line')} />
      </div>
    );
  }
  if (orientation === 'vertical') {
    return <span role="separator" aria-orientation="vertical" className={classes} {...rest} />;
  }
  return <hr className={classes} {...rest} />;
}
