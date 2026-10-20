import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { switchControl } from './switch.manifest.js';
import { Icon } from '../icon/icon.js';
import { useChoice } from '../choice.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'children'>, VariantProps<typeof switchControl.manifest> {
  children: ReactNode;
  /** A tick on the thumb when on and a cross when off (Figma's Icon), on the lg and md sizes. Decoration: hidden from assistive technology, which hears the state. */
  icon?: boolean;
  className?: string;
  /** Reaches the native input, e.g. to focus it. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Switch: a native checkbox with the switch role, visually hidden, driving a drawn track beside its label (the choice
 * row, `../choice.tsx`). It reads no field group.
 */
export function Switch({ size, icon = false, className, children, ref, ...rest }: SwitchProps) {
  const marks = icon && size !== 'sm';
  const choice = useChoice({ type: 'checkbox', ids: 'switch', grouped: false, ref, props: rest });
  return (
    <label className={cx(switchControl({ size }), className)}>
      <input type="checkbox" role="switch" className={switchControl.part('control')} {...choice.input} />
      <span className={switchControl.part('track')} aria-hidden="true">
        <span className={switchControl.part('thumb')}>
          {marks && <Icon name="Check" className={switchControl.part('on-icon')} />}
          {marks && <Icon name="X" className={switchControl.part('off-icon')} />}
        </span>
      </span>
      <span className={switchControl.part('label')}>{children}</span>
    </label>
  );
}
