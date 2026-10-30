'use client';

import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { input } from './input.manifest.js';
import { InputWell } from './input-well.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import type { VariantProps } from '../variants.js';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof input.manifest> {
  /** Phosphor icon name shown before the value. */
  leadingIcon?: string;
  /** Phosphor icon name shown after the value. */
  trailingIcon?: string;
  /** Anything else that sits before the value, after the leading icon: a swatch, a unit, a short prefix. Not part of the field's name. */
  leadingContent?: ReactNode;
  /** An action after the value and the trailing icon, such as a small ghost button to copy or reveal it. It is its own Tab stop and needs its own name. */
  trailingAction?: ReactNode;
  /** Extra classes for the well, not the control. */
  className?: string;
  /** Reaches the native input, e.g. to focus it when a form is sent with it empty. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Input: a well around a native text control. The well carries the chrome; the control carries the value and the attributes.
 * Figma's two slots are props: leading content before the value and a trailing action after it, each drawn only when given,
 * so an empty one takes no room.
 */
export function Input(props: InputProps) {
  const { size, error, leadingIcon, trailingIcon, leadingContent, trailingAction, className, ref, ...rest } = useFieldControl(props);
  return (
    <InputWell
      className={className}
      size={size}
      error={error}
      nameCheck="Input"
      leadingIcon={leadingIcon}
      leadingContent={leadingContent}
      trailingIcon={trailingIcon}
      trailingAction={trailingAction}
    >
      <input ref={ref} className={input.part('control')} aria-invalid={error ? true : undefined} {...rest} />
    </InputWell>
  );
}
readsField(Input);
