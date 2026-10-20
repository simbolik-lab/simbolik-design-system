import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { checkbox } from './checkbox.manifest.js';
import { Icon } from '../icon/icon.js';
import { ChoiceLabel, useChoice } from '../choice.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

interface CheckboxOwnProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'children'>, VariantProps<typeof checkbox.manifest> {
  /** A line under the label that says more about the choice. It is read after the choice's name, not as part of it. */
  description?: ReactNode;
  /**
   * The mixed state: a dash in place of the tick, for a box over a list whose items are partly ticked, announced as
   * mixed. Set on the control after each render; the browser clears it at the next press, so follow it from the
   * list. Left out, the control keeps whatever a script set through the ref.
   */
  indeterminate?: boolean;
  className?: string;
  /** Reaches the real input, e.g. to focus it. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * The visible label, so the control always has a name; a box with no words beside it (a table row's) is named by
 * `aria-label` or `aria-labelledby` instead.
 */
type CheckboxName =
  | { children: ReactNode }
  | { children?: undefined; 'aria-label': string }
  | { children?: undefined; 'aria-labelledby': string };

export type CheckboxProps = CheckboxOwnProps & CheckboxName;

/**
 * Checkbox: a native checkbox, visually hidden, driving a drawn box beside its label. Inside a field group it
 * takes the group's error, the group's name when the page gave one, and the group's option row (the choice row,
 * `../choice.tsx`).
 */
export function Checkbox({ size, tone, error, description, indeterminate, className, children, ref, ...rest }: CheckboxProps) {
  const choice = useChoice({ type: 'checkbox', ids: 'checkbox', error, description, indeterminate, ref, props: rest });
  return (
    <label className={cx(checkbox({ size, tone, error: choice.invalid }), choice.optionClass, className)}>
      <input type="checkbox" className={checkbox.part('control')} {...choice.input} />
      <span className={checkbox.part('box')} aria-hidden="true">
        <Icon name="Check" className={checkbox.part('icon')} />
        <Icon name="Minus" className={checkbox.part('mixed-icon')} />
      </span>
      <ChoiceLabel choice={choice} part={checkbox.part}>{children}</ChoiceLabel>
    </label>
  );
}
