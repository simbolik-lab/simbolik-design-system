'use client';

import { useRef, useState, type ButtonHTMLAttributes, type FocusEvent, type ReactNode, type Ref } from 'react';
import { mergeProps, useFocusable, useId, useLocale, useNumberField, useObjectRef, usePress, type AriaButtonProps } from 'react-aria';
import { useNumberFieldState } from 'react-stately';
import { numberField } from './number-field.manifest.js';
import { input } from '../input/input.manifest.js';
import { Button } from '../button/button.js';
import { useFormReset } from '../form.js';
import { InputWell } from '../input/input-well.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface NumberFieldProps extends VariantProps<typeof numberField.manifest> {
  /** The number, when the page holds it; `null` when empty. Pair it with onChange. */
  value?: number | null;
  /** The number it starts with, when the field holds its own; `null`, or left out, for empty. */
  defaultValue?: number | null;
  /**
   * Called with the new number once it is settled: after a step, or when the reader leaves the field or presses Enter;
   * `null` when emptied.
   */
  onChange?: (value: number | null) => void;
  /** The lowest number it takes. The minus button stops there, and a lower number typed is raised to it. */
  min?: number;
  /** The highest number it takes. The plus button stops there, and a higher number typed is lowered to it. */
  max?: number;
  /** How far one press, or the up or down arrow key, moves the number. 1 unless given; a typed number is rounded to a step. */
  step?: number;
  /** The unit after the number, in quieter text: "kg", "px", "%". A screen reader reads it after the number. */
  unit?: ReactNode;
  /** How the number is written: decimal places, a percentage, a currency (Intl.NumberFormat's options). */
  formatOptions?: Intl.NumberFormatOptions;
  /** The language numbers are read and written in, such as "de-DE", where 1,5 is one and a half. The reader's own unless given. */
  locale?: string;
  /** The minus button's whole name, in place of "Decrease" and the field's name. */
  decrementLabel?: string;
  /** The plus button's whole name, in place of "Increase" and the field's name. */
  incrementLabel?: string;
  /**
   * Leaves out the minus and plus buttons and the line before them: a bare number box, for a row of small boxes too narrow
   * for buttons, such as a curve's four numbers. The up and down arrow keys still step the number.
   */
  hideButtons?: boolean;
  id?: string;
  /** Sends the number with the form under this name, as plain digits whatever the language. */
  name?: string;
  form?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  /** Extra classes for the well, not the control. */
  className?: string;
  /** Reaches the text control, e.g. to focus it when a form is sent with it empty. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * A minus or plus button: React Aria's press handling (a press steps once, holding it repeats) on the system's ghost
 * icon button. It is React Aria's useButton taken apart, so that usePress gets no ref: given one, it writes a <style>
 * element into the page's head, which a Site's security policy refuses (its style-src allows no inline style). The one
 * rule that element holds, the touch-action that lets a touch press start at once, is in the stylesheet instead.
 */
function StepButton({ aria, size, icon, part }: { aria: AriaButtonProps & { allowFocusWhenDisabled?: boolean }; size: 'sm' | 'xs'; icon: string; part: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { isDisabled, onPressStart, onPressEnd, onPressChange, onPress, onPressUp, preventFocusOnPress, allowFocusWhenDisabled } = aria;
  const { pressProps } = usePress({ onPressStart, onPressEnd, onPressChange, onPress, onPressUp, isDisabled, preventFocusOnPress });
  const { focusableProps } = useFocusable(aria, ref);
  if (allowFocusWhenDisabled && isDisabled) focusableProps.tabIndex = -1;
  const named = { id: aria.id, 'aria-label': aria['aria-label'], 'aria-labelledby': aria['aria-labelledby'], 'aria-controls': aria['aria-controls'] };
  const buttonProps = mergeProps({ type: 'button', disabled: isDisabled }, focusableProps, pressProps, named);
  return <Button ref={ref} tone="ghost" size={size} icon-only icon={icon} className={part} {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}

/**
 * Number field: the input's well with a text control for a number, its unit, and minus and plus buttons. Its behaviour
 * is React Aria's number field: it reads and writes numbers the way the reader's language does, takes only what can make
 * a number, steps with the buttons and with the up and down arrow keys (Page Up and Page Down too; Home and End jump
 * to the limits), and settles a typed number when the reader leaves the field or presses Enter: kept inside the
 * limits, rounded to the step. The field is one Tab stop; the buttons are out of the Tab order, named "Decrease" and
 * "Increase" with the field's name, and the one at a limit is disabled. Scrolling never changes the number. With
 * hideButtons the field is the bare box: the same well and keys, no buttons.
 */
export function NumberField(props: NumberFieldProps) {
  const {
    size, error, value: given, defaultValue: start, onChange: report, min, max, step, unit, formatOptions, locale, decrementLabel, incrementLabel, hideButtons,
    id, name, form, placeholder, disabled, readOnly, required, autoFocus, onFocus, onBlur, className, ref, ...aria
  } = useFieldControl(props);
  const reader = useLocale().locale;
  const unitId = useId();
  const hasUnit = unit != null && unit !== false;
  // Empty is `null` here and NaN in React Aria's number field: turned on the way in and on the way out.
  const value = given === null ? NaN : given;
  const defaultValue = start === null ? NaN : start;
  const onChange = report && ((next: number) => report(Number.isNaN(next) ? null : next));
  const options = {
    value, defaultValue, onChange, minValue: min, maxValue: max, step, formatOptions,
    isDisabled: disabled, isReadOnly: readOnly, isRequired: required, isInvalid: error, isWheelDisabled: true,
    id, placeholder, autoFocus, onFocus, onBlur, decrementAriaLabel: decrementLabel, incrementAriaLabel: incrementLabel,
    'aria-label': aria['aria-label'], 'aria-labelledby': aria['aria-labelledby'],
    'aria-describedby': [hasUnit ? unitId : undefined, aria['aria-describedby']].filter(Boolean).join(' ') || undefined,
  };
  const state = useNumberFieldState({ ...options, locale: locale ?? reader });
  const control = useObjectRef(ref);
  const { inputProps, decrementButtonProps, incrementButtonProps } = useNumberField(options, state, control);
  const buttonSize = size === 'sm' ? 'xs' : 'sm';
  // Required is checked on the box the reader types in, as a native field is: a form sent with it empty stops, with
  // the browser's own message, and the field takes its error look until a number is typed. React Aria puts the
  // number back on the form's reset.
  const [missing, setMissing] = useState(false);
  const shown = Boolean(error) || (missing && Number.isNaN(state.numberValue));
  useFormReset(control, () => setMissing(false));
  return (
    <InputWell
      className={cx(numberField({ size, error: shown }), className)}
      size={size}
      error={shown}
      nameCheck="NumberField"
      trailingAction={
        (hasUnit || !hideButtons) && (
          <>
            {hasUnit && <span id={unitId} className={numberField.part('unit')}>{unit}</span>}
            {!hideButtons && (
              <>
                <span className={numberField.part('separator')} aria-hidden="true" />
                <StepButton aria={decrementButtonProps} size={buttonSize} icon="Minus" part={numberField.part('decrement')} />
                <StepButton aria={incrementButtonProps} size={buttonSize} icon="Plus" part={numberField.part('increment')} />
              </>
            )}
          </>
        )
      }
      // The number the form sends, as a plain number; nothing while disabled, as a disabled native field sends nothing.
      end={name && <input type="hidden" name={name} form={form} value={Number.isNaN(state.numberValue) ? '' : String(state.numberValue)} disabled={disabled} />}
    >
      <input
        ref={control}
        {...inputProps}
        className={`${input.part('control')} ${numberField.part('control')}`}
        required={required && !readOnly}
        aria-invalid={shown ? true : undefined}
        onInvalid={() => setMissing(true)}
      />
    </InputWell>
  );
}
readsField(NumberField);
