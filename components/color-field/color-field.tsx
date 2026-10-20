import type { FocusEvent, Ref } from 'react';
import { useColorField, useObjectRef } from 'react-aria';
import { useColorFieldState, type Color } from 'react-stately';
import { colorField } from './color-field.manifest.js';
import { input } from '../input/input.manifest.js';
import { ColorSwatch } from '../color-swatch/color-swatch.js';
import { InputWell } from '../input/input-well.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import type { ColorInput } from '../color.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ColorFieldProps extends VariantProps<typeof colorField.manifest> {
  /** The color, when the page holds it; null when empty. Pair it with onChange. */
  value?: ColorInput | null;
  /** The color it starts with, when the field holds its own. Empty unless given. */
  defaultValue?: ColorInput | null;
  /** Called with the new color once it is settled: when the reader leaves the field or presses Enter, or after a step. Null when emptied. */
  onChange?: (color: Color | null) => void;
  id?: string;
  /** Sends the code with the form under this name. */
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
  /** Reaches the text control. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Color field: the input's well with a text control for a hex color code and a swatch of the color before it. Its
 * behaviour is React Aria's color field: it takes a code typed or pasted, with or without the #, in three or six digits,
 * and settles it when the reader leaves the field or presses Enter, written as #3E63DD. A code that is not a color is put
 * back to the last good color then. The up and down arrow keys step the color. The swatch shows the settled color and is
 * hidden from screen readers, which read the code.
 */
export function ColorField(props: ColorFieldProps) {
  const {
    size, error, value, defaultValue, onChange, id, name, form, placeholder, disabled, readOnly, required, autoFocus, onFocus, onBlur, className, ref, ...aria
  } = useFieldControl(props);
  const options = {
    value, defaultValue, onChange, id, name, form, placeholder, autoFocus, onFocus, onBlur,
    isDisabled: disabled, isReadOnly: readOnly, isRequired: required, isInvalid: error, isWheelDisabled: true, validationBehavior: 'aria' as const,
    'aria-label': aria['aria-label'], 'aria-labelledby': aria['aria-labelledby'], 'aria-describedby': aria['aria-describedby'],
  };
  const state = useColorFieldState(options);
  const control = useObjectRef(ref);
  const { inputProps } = useColorField(options, state, control);
  return (
    <InputWell
      className={cx(colorField({ size, error }), className)}
      size={size}
      error={error}
      nameCheck="ColorField"
      leadingContent={<ColorSwatch color={state.colorValue} size={size === 'sm' ? 'xs' : 'sm'} decorative className={colorField.part('swatch')} />}
    >
      <input ref={control} {...inputProps} autoCapitalize="off" spellCheck={false} className={`${input.part('control')} ${colorField.part('control')}`} />
    </InputWell>
  );
}
readsField(ColorField);
