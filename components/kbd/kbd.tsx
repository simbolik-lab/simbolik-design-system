import type { HTMLAttributes, ReactNode } from 'react';
import { kbd } from './kbd.manifest.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface KbdProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof kbd.manifest> {
  children: ReactNode;
}

export function Kbd({ size, className, children, ...rest }: KbdProps) {
  return (
    <kbd className={cx(kbd({ size }), className)} {...rest}>
      {children}
    </kbd>
  );
}
