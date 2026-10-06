import { cloneElement, useId, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { field } from './field.manifest.js';
import { Label } from '../label/label.js';

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The visible label. Required, so the control always has a name that stays while the reader types. */
  label: ReactNode;
  /** Shows the required mark and marks the control required. */
  required?: boolean;
  /** Help text under the control: what to enter, or why it is asked. */
  description?: ReactNode;
  /**
   * The value is invalid. `true` turns the field to the danger colour and keeps the description;
   * a message is shown in the description's place, saying what is wrong and how to put it right.
   */
  error?: ReactNode;
  /**
   * The control, which Figma's slot holds: an Input, a Select, a TextArea or a SearchField. The field
   * gives it its id (unless it has one), links the help text to it, and passes `error` and `required` on.
   */
  children: ReactElement;
}

interface ControlProps {
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  error?: boolean;
  required?: boolean;
}

/**
 * Field: a label, the control, and a line of help text or an error message under it.
 * The label names the control (its for attribute, and aria-labelledby, which also names
 * a select's open list), the line describes it (aria-describedby), and an error marks it
 * invalid. Markup only, no behaviour: the field never decides when a value is wrong.
 */
export function Field({ label, required, description, error, className, children, ...rest }: FieldProps) {
  const reactId = useId();
  const control = children as ReactElement<ControlProps>;
  const controlId = control.props.id ?? `field${reactId}`;
  const labelId = `${controlId}-label`;
  // A control that names itself keeps its own name.
  const labelledBy = control.props['aria-labelledby'] ?? (control.props['aria-label'] ? undefined : labelId);
  const invalid = Boolean(error);
  const line = invalid && error !== true ? error : description;
  const lineId = line ? `${controlId}-description` : undefined;
  const describedBy = [control.props['aria-describedby'], lineId].filter(Boolean).join(' ') || undefined;
  const classes = [field({ error: invalid }), className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      <Label tone="subtle" id={labelId} htmlFor={controlId} required={required} className={field.part('label')}>
        {label}
      </Label>
      {cloneElement(control, {
        id: controlId,
        'aria-labelledby': labelledBy,
        'aria-describedby': describedBy,
        ...(invalid ? { error: true } : {}),
        ...(required ? { required: true } : {}),
      })}
      {line && (
        <p id={lineId} className={field.part('description')}>
          {line}
        </p>
      )}
    </div>
  );
}
