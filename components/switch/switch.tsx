import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { switchControl } from './switch.manifest.js';
import type { VariantProps } from '../variants.js';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'children'>, VariantProps<typeof switchControl.manifest> {
  children: ReactNode;
  className?: string;
  /** Reaches the native input, e.g. to focus it. */
  ref?: Ref<HTMLInputElement>;
}

export function Switch({ size, className, children, ...rest }: SwitchProps) {
  return (
    <label className={[switchControl({ size }), className].filter(Boolean).join(' ')}>
      <input type="checkbox" role="switch" className={switchControl.part('control')} {...rest} />
      <span className={switchControl.part('track')} aria-hidden="true">
        <span className={switchControl.part('thumb')} />
      </span>
      <span className={switchControl.part('label')}>{children}</span>
    </label>
  );
}
