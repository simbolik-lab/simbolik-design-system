import type { InputHTMLAttributes, Ref } from 'react';
import { input } from './input.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof input.manifest> {
  leadingIcon?: string;
  trailingIcon?: string;
  /** Extra classes for the well, not the control. */
  className?: string;
  /** Reaches the native input, e.g. to focus it when a form is sent with it empty. */
  ref?: Ref<HTMLInputElement>;
}

/** Input: a well around a native text control. The well carries the chrome; the control carries the value and the attributes. */
export function Input({ size, error, leadingIcon, trailingIcon, className, ref, ...rest }: InputProps) {
  const classes = [input({ size, error }), className].filter(Boolean).join(' ');
  return (
    <span className={classes}>
      {leadingIcon && <Icon name={leadingIcon} className={input.part('icon')} />}
      <input ref={ref} className={input.part('control')} aria-invalid={error ? true : undefined} {...rest} />
      {trailingIcon && <Icon name={trailingIcon} className={input.part('icon')} />}
    </span>
  );
}
