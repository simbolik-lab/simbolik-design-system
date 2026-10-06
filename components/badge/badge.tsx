import type { HTMLAttributes, ReactNode } from 'react';
import { badge } from './badge.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, VariantProps<typeof badge.manifest> {
  leadingIcon?: string;
  trailingIcon?: string;
  /** The text. A dot badge shows none, but still needs one for assistive technology. */
  children?: ReactNode;
}

export function Badge({ look, type, size, leadingIcon, trailingIcon, className, children, ...rest }: BadgeProps) {
  const classes = [badge({ look, type, size }), className].filter(Boolean).join(' ');
  const iconPart = badge.part('icon');
  if (look === 'dot') {
    return (
      <span className={classes} role="img" aria-label={typeof children === 'string' ? children : undefined} {...rest} />
    );
  }
  return (
    <span className={classes} {...rest}>
      {leadingIcon && <Icon name={leadingIcon} className={iconPart} />}
      <span className={badge.part('label')}>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} className={iconPart} />}
    </span>
  );
}
