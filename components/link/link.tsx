import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { link } from './link.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>, VariantProps<typeof link.manifest> {
  leadingIcon?: string;
  trailingIcon?: string;
  /** A disabled link keeps its text but goes nowhere. Without an address it is plain text to a screen reader, not an unavailable link. */
  disabled?: boolean;
  children: ReactNode;
}

export function Link({ size, underline, leadingIcon, trailingIcon, disabled, className, href, children, ...rest }: LinkProps) {
  const classes = [link({ size, underline }), className].filter(Boolean).join(' ');
  const iconPart = link.part('icon');
  return (
    <a className={classes} href={disabled ? undefined : href} aria-disabled={disabled ? true : undefined} {...rest}>
      {leadingIcon && <Icon name={leadingIcon} className={iconPart} />}
      <span className={link.part('label')}>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} className={iconPart} />}
    </a>
  );
}
