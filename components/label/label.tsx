'use client';

import { useEffect, useRef, type LabelHTMLAttributes, type ReactNode, type RefObject } from 'react';
import { label } from './label.manifest.js';
import { Icon } from '../icon/icon.js';
import { useTip } from '../tooltip/tooltip.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface LabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'>, VariantProps<typeof label.manifest> {
  /** The element. A label names a form control; a span carries the same look where there is no control, e.g. a group heading or an item's category. */
  as?: 'label' | 'span';
  /** Shows the required mark. The field itself must still be marked required. */
  required?: boolean;
  /** Help text behind an info icon: the icon's accessible name, read with the label, and shown in a tooltip over the icon while it is pointed at and while the control the label names has keyboard focus. */
  info?: string;
  children: ReactNode;
}

export function Label({ as: Tag = 'label', tone, type, required, info, className, children, ...rest }: LabelProps) {
  return (
    <Tag className={cx(label({ tone, type }), className)} {...rest}>
      <span className={label.part('text')}>{children}</span>
      {required && (
        <span className={label.part('required')} aria-hidden="true">
          *
        </span>
      )}
      {info && <Info text={info} control={Tag === 'label' ? rest.htmlFor : undefined} />}
    </Tag>
  );
}

/**
 * The info icon, its help text its accessible name, so assistive technology reads it with the label. The tooltip
 * shows the same words over it while the pointer rests on it, and while the control the label names (its for
 * attribute) has keyboard focus, so a reader who never points sees them too.
 */
function Info({ text, control }: { text: string; control?: string }) {
  const { targetRef, hoverProps, show, hide, tip } = useTip({ text, arrow: 'bottom-center', inverse: true, purpose: 'name', help: true });
  const toggle = useRef({ show, hide });
  toggle.current = { show, hide };

  useEffect(() => {
    const field = control ? document.getElementById(control) : null;
    if (!field) return undefined;
    const focus = () => {
      if (field.matches(':focus-visible')) toggle.current.show();
    };
    const blur = () => toggle.current.hide();
    field.addEventListener('focus', focus);
    field.addEventListener('blur', blur);
    return () => {
      field.removeEventListener('focus', focus);
      field.removeEventListener('blur', blur);
    };
  }, [control]);

  return (
    <>
      <Icon ref={targetRef as RefObject<HTMLElement>} name="Info" label={text} className={label.part('icon')} {...hoverProps} />
      {tip}
    </>
  );
}
