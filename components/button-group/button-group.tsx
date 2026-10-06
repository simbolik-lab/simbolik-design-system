import type { HTMLAttributes, ReactNode } from 'react';
import { buttonGroup } from './button-group.manifest.js';
import type { VariantProps } from '../variants.js';

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof buttonGroup.manifest> {
  /** An accessible name for the group, e.g. "Text alignment". */
  label: string;
  children: ReactNode;
}

/** Button group: a labelled group of Button elements. The layout and the fused edges are CSS. */
export function ButtonGroup({ type, tone, size, orientation, label, className, children, ...rest }: ButtonGroupProps) {
  const classes = [buttonGroup({ type, tone, size, orientation }), className].filter(Boolean).join(' ');
  return (
    <div role="group" aria-label={label} className={classes} {...rest}>
      {children}
    </div>
  );
}
