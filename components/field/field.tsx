'use client';

import { cloneElement, useId, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { field } from './field.manifest.js';
import { Label } from '../label/label.js';
import { FieldMessage } from '../field-message/field-message.js';
import { FieldProvider, isFieldReader, withField, type FieldControlProps, type FieldControlValue } from './field-context.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The visible label. Required, so the control always has a name that stays while the reader types. */
  label: ReactNode;
  /** Shows the required mark and marks the control required. */
  required?: boolean;
  /** Help text under the control: what to enter, or why it is asked. */
  description?: ReactNode;
  /**
   * The value is invalid: a message shown in the help text's place, saying what is wrong and how to put
   * it right. Given `true` with no message, the help text is shown as the message.
   */
  error?: ReactNode;
  /**
   * Something to notice that is not an error, such as Caps Lock being on in a password field: a line with the warning
   * icon under the help text or the error, read out when it appears. Pass null while there is nothing to say, rather
   * than leaving it out: the field then keeps an empty, unseen place for it, which a screen reader needs in order to
   * hear the warning arrive.
   */
  warning?: ReactNode;
  /** Disables the control, and turns the label and the help text the disabled color. */
  disabled?: boolean;
  /** Makes the control read-only: it can be read, copied and reached with Tab, not changed. */
  readOnly?: boolean;
  /**
   * Stacked (the default) puts the label above the control. Side by side puts it on the left, for a column of
   * settings; give the control `size="sm"`, as the label lines up with a small control's middle. In a narrow
   * space the field stacks.
   */
  layout?: VariantProps<typeof field.manifest>['layout'];
  /**
   * The control, which Figma's slot holds: any of the system's form controls, or a site's own component around
   * one. The field gives it its id (unless it has one), names it with the label, links the help text to it, and
   * passes `error`, `required`, `disabled` and `readOnly` on. The system's controls read all of it from the field
   * itself (`useFieldControl`), so a component around one need not pass anything on; any other child is handed
   * them as props.
   */
  children: ReactElement;
}

/**
 * Field: a label, the control, and a line of help text or an error message under it.
 * The label names the control (its for attribute, and aria-labelledby, which also names
 * a select's open list), the line describes it (aria-describedby), and an error marks it
 * invalid. The error message is an alert, so a screen reader reads it as it appears.
 * Markup only, no behaviour: the field never decides when a value is wrong.
 */
export function Field({ label, required, description, error, warning, disabled, readOnly, layout, className, children, ...rest }: FieldProps) {
  const reactId = useId();
  const control = children as ReactElement<FieldControlProps>;
  const controlId = control.props.id ?? `field${reactId}`;
  const invalid = Boolean(error);
  const line = invalid && error !== true ? error : description;
  const lineId = line ? `${controlId}-description` : undefined;
  const warned = warning != null && warning !== false;
  const warningId = warned ? `${controlId}-warning` : undefined;
  const context: FieldControlValue = {
    id: controlId,
    labelId: `${controlId}-label`,
    describedBy: [lineId, warningId].filter(Boolean).join(' ') || undefined,
    error: invalid,
    required: Boolean(required),
    disabled: Boolean(disabled),
    readOnly: Boolean(readOnly),
  };
  const classes = cx(field({ layout, error: invalid, disabled, readonly: readOnly }), className);
  return (
    <div className={classes} {...rest}>
      <Label tone="subtle" id={context.labelId} htmlFor={controlId} required={required} className={field.part('label')}>
        {label}
      </Label>
      {/* A system control reads the field itself; any other child, such as a site's own component, is handed the same
          props, and a system control inside it still reads the field. */}
      <FieldProvider value={context}>{isFieldReader(control.type) ? control : cloneElement(control, withField(control.props, context))}</FieldProvider>
      {/* The message and the help line are different elements, so the alert is new to the page each time it appears and is read out. */}
      {line && invalid && (
        <FieldMessage key="message" id={lineId} type="error" className={field.part('description')}>
          {line}
        </FieldMessage>
      )}
      {line && !invalid && (
        <FieldMessage key="help" id={lineId} className={field.part('description')}>
          {line}
        </FieldMessage>
      )}
      {/* The warning's place is a status that waits for a pause in speech. It stays on the page, empty, while the page passes
          null, because a screen reader announces what arrives in a status it already knows, not a status that arrives full. */}
      {warning !== undefined && (
        <FieldMessage id={warningId} type="warning" role="status" className={field.part('warning')}>
          {warning}
        </FieldMessage>
      )}
    </div>
  );
}
