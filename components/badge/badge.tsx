import type { HTMLAttributes, ReactNode } from 'react';
import { badge } from './badge.manifest.js';
import { Icon } from '../icon/icon.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, VariantProps<typeof badge.manifest> {
  leadingIcon?: string;
  trailingIcon?: string;
  /** The text. */
  children?: ReactNode;
}

/**
 * Badge: a small status marker, a soft or flat pill with a label and optional icons.
 *
 *   <Badge tone="success" size="sm">Live</Badge>
 */
export function Badge({ look, tone, size, leadingIcon, trailingIcon, className, children, ...rest }: BadgeProps) {
  const classes = cx(badge({ look, tone, size }), className);
  const iconPart = badge.part('icon');
  return (
    <span className={classes} {...rest}>
      {leadingIcon && <Icon name={leadingIcon} className={iconPart} />}
      <span className={badge.part('label')}>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} className={iconPart} />}
    </span>
  );
}
