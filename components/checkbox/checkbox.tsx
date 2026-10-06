import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { checkbox } from './checkbox.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'children'>, VariantProps<typeof checkbox.manifest> {
  /** The visible label. Required, so the control always has a name. */
  children: ReactNode;
  className?: string;
  /** Reaches the real input, e.g. to set its mixed state. */
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({ size, variant, className, children, ...rest }: CheckboxProps) {
  return (
    <label className={[checkbox({ size, variant }), className].filter(Boolean).join(' ')}>
      <input type="checkbox" className={checkbox.part('control')} {...rest} />
      <span className={checkbox.part('box')} aria-hidden="true">
        <Icon name="Check" className={checkbox.part('icon')} />
      </span>
      <span className={checkbox.part('label')}>{children}</span>
    </label>
  );
}
