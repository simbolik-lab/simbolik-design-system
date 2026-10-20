import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { radio } from './radio.manifest.js';
import { ChoiceLabel, useChoice } from '../choice.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'children'>, VariantProps<typeof radio.manifest> {
  children: ReactNode;
  /** A line under the label that says more about the choice. It is read after the choice's name, not as part of it. */
  description?: ReactNode;
  className?: string;
  /** Reaches the native input, e.g. to focus it. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Radio: a native radio, visually hidden, driving a drawn circle beside its label. Inside a field group it
 * takes the group's name, error and required state, and the group's option row; when the group holds the chosen
 * value, the radio is checked when its `value` is the group's (the choice row, `../choice.tsx`).
 */
export function Radio({ size, error, description, className, children, ref, ...rest }: RadioProps) {
  const choice = useChoice({ type: 'radio', ids: 'radio', error, description, ref, props: rest });
  return (
    <label className={cx(radio({ size, error: choice.invalid }), choice.optionClass, className)}>
      <input type="radio" className={radio.part('control')} {...choice.input} />
      <span className={radio.part('circle')} aria-hidden="true">
        <span className={radio.part('dot')} />
      </span>
      <ChoiceLabel choice={choice} part={radio.part}>{children}</ChoiceLabel>
    </label>
  );
}
