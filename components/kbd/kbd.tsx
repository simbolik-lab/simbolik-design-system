import type { HTMLAttributes, ReactNode } from 'react';
import { kbd } from './kbd.manifest.js';
import type { VariantProps } from '../variants.js';

export interface KbdProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof kbd.manifest> {
  children: ReactNode;
}

export function Kbd({ size, className, children, ...rest }: KbdProps) {
  return (
    <kbd className={[kbd({ size }), className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </kbd>
  );
}
