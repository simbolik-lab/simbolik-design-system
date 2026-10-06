import type { LabelHTMLAttributes, ReactNode } from 'react';
import { label } from './label.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface LabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'>, VariantProps<typeof label.manifest> {
  /** The element. A label names a form control; a span carries the same look where there is no control, e.g. a group heading or an item's category. */
  as?: 'label' | 'span';
  /** Shows the required mark. The field itself must still be marked required. */
  required?: boolean;
  /** Help text behind an info icon. Rendered as the icon's accessible name until the tooltip component exists. */
  info?: string;
  children: ReactNode;
}

export function Label({ as: Tag = 'label', tone, type, required, info, className, children, ...rest }: LabelProps) {
  return (
    <Tag className={[label({ tone, type }), className].filter(Boolean).join(' ')} {...rest}>
      <span className={label.part('text')}>{children}</span>
      {required && (
        <span className={label.part('required')} aria-hidden="true">
          *
        </span>
      )}
      {info && <Icon name="Info" label={info} className={label.part('icon')} />}
    </Tag>
  );
}
