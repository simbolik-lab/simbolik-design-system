import type { HTMLAttributes, ReactNode } from 'react';
import { fieldMessage } from './field-message.manifest.js';
import { Icon } from '../icon/icon.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface FieldMessageProps extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>, VariantProps<typeof fieldMessage.manifest> {
  /**
   * The words: what to enter, what to notice, or what is wrong and how to put it right. With none (null, undefined or
   * false) the message is an empty place, with no icon, that words can arrive in later, as a warning a screen reader
   * should hear arrive does.
   */
  children: ReactNode;
  /** Extra classes for the icon. */
  iconClassName?: string;
}

/** The icon each type leads with; help has none. */
export const fieldMessageIcon = { help: undefined, warning: 'Warning', error: 'XCircle' } as const;

/**
 * Field message: the line under a control or a group of choices, and the one way every form part draws it: the
 * field's help, error and warning, the field group's, the file upload's. Give it an id and point the control's
 * aria-describedby at it, so it is read with the control. An error is an alert, so a screen reader reads it as it
 * appears; pass another role to change that.
 */
export function FieldMessage({ type = 'help', role, className, iconClassName, id, children, ...rest }: FieldMessageProps) {
  const icon = fieldMessageIcon[type];
  const said = children != null && children !== false;
  return (
    <p id={id} role={role ?? (type === 'error' ? 'alert' : undefined)} className={cx(fieldMessage({ type }), className)} {...rest}>
      {said && icon && <Icon name={icon} className={cx(fieldMessage.part('icon'), iconClassName)} />}
      {said && <span className={fieldMessage.part('text')}>{children}</span>}
    </p>
  );
}
