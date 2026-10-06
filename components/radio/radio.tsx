import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { radio } from './radio.manifest.js';
import type { VariantProps } from '../variants.js';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'children'>, VariantProps<typeof radio.manifest> {
  children: ReactNode;
  className?: string;
  /** Reaches the native input, e.g. to focus it. */
  ref?: Ref<HTMLInputElement>;
}

export function Radio({ size, className, children, ...rest }: RadioProps) {
  return (
    <label className={[radio({ size }), className].filter(Boolean).join(' ')}>
      <input type="radio" className={radio.part('control')} {...rest} />
      <span className={radio.part('circle')} aria-hidden="true">
        <span className={radio.part('dot')} />
      </span>
      <span className={radio.part('label')}>{children}</span>
    </label>
  );
}
