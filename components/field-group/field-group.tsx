import { useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { fieldGroup } from './field-group.manifest.js';
import { FieldGroupContext, type FieldGroupValue } from './field-group-context.js';
import { Label } from '../label/label.js';
import { FieldMessage } from '../field-message/field-message.js';
import { useControllable } from '../controllable.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface FieldGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'children' | 'defaultValue' | 'onChange'> {
  /** The question, shown as the group's legend; a screen reader names the group with it. */
  legend: ReactNode;
  /** Shows the required mark, and marks the radios required. */
  required?: boolean;
  /** Help under the question: what the choice decides, or how many to pick. */
  description?: ReactNode;
  /**
   * The answer is invalid: every option takes its error look, and this message under the options says what to
   * do ("Choose a delivery speed"). Given `true` with no message, the help text is shown there as the message.
   */
  error?: ReactNode;
  /** Disables every option. */
  disabled?: boolean;
  /** Vertical (the default) stacks the options; horizontal sets a few short ones in a row. */
  layout?: VariantProps<typeof fieldGroup.manifest>['layout'];
  /** The radios' shared name, sent with the form. The group makes one when none is given, so the radios still act as one. */
  name?: string;
  /**
   * The chosen radio's value, held by the page: each radio (or radio choice card) inside is checked when its own
   * `value` is this one, and `null` checks none. Follow it with `onChange`. Radios only; checkboxes keep their own.
   */
  value?: string | null;
  /** The radio chosen at the start, when the group holds the value itself rather than the page. */
  defaultValue?: string | null;
  /** Told the chosen radio's value each time one is chosen, whoever holds the value. */
  onChange?(value: string): void;
  /** Two to five Radios, Checkboxes or ChoiceCards, all of one kind. */
  children: ReactNode;
}

/**
 * Field group: a fieldset named by its legend, around several choices. The radios, checkboxes and choice cards
 * inside take the group's name, error and required state from it, so each is written once. Given `value` or
 * `defaultValue`, the group holds which radio is chosen (`useControllable`), as a select holds its option. The help
 * and the message describe the group (aria-describedby), and the message is an alert, read as it appears.
 */
export function FieldGroup({ legend, required, description, error, disabled, layout, name, value, defaultValue, onChange, className, children, ...rest }: FieldGroupProps) {
  const reactId = useId();
  // The group holds the chosen value only when the page gives one or a start; otherwise each radio holds its own.
  const holds = value !== undefined || defaultValue !== undefined;
  const [chosen, choose] = useControllable<string | null>({ value, defaultValue: defaultValue ?? null, onChange, name: 'FieldGroup value' });
  const invalid = Boolean(error);
  const message = invalid ? (error === true ? description : error) : undefined;
  const help = invalid && error === true ? undefined : description;
  const helpId = help ? `group${reactId}-description` : undefined;
  const messageId = message ? `group${reactId}-message` : undefined;
  const describedBy = [rest['aria-describedby'], helpId, messageId].filter(Boolean).join(' ') || undefined;
  const context: FieldGroupValue = {
    name: name ?? `group${reactId}`,
    givenName: name,
    error: invalid,
    required: Boolean(required),
    optionClass: fieldGroup.part('option'),
    ...(holds ? { value: chosen } : {}),
    ...(holds || onChange ? { choose } : {}),
  };
  const classes = cx(fieldGroup({ layout, error: invalid, disabled }), className);
  return (
    <fieldset className={classes} disabled={disabled} {...rest} aria-describedby={describedBy}>
      <legend className={fieldGroup.part('legend')}>
        <Label as="span" tone="strong" required={required}>
          {legend}
        </Label>
      </legend>
      {help && (
        <FieldMessage id={helpId} className={fieldGroup.part('description')}>
          {help}
        </FieldMessage>
      )}
      <div className={fieldGroup.part('options')}>
        <FieldGroupContext.Provider value={context}>{children}</FieldGroupContext.Provider>
      </div>
      {message && (
        <FieldMessage key="message" type="error" id={messageId} className={fieldGroup.part('message')}>
          {message}
        </FieldMessage>
      )}
    </fieldset>
  );
}
