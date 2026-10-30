'use client';

import { useState, type ChangeEvent, type InputHTMLAttributes, type KeyboardEvent, type MouseEvent, type Ref } from 'react';
import { searchField } from './search-field.manifest.js';
import { input } from '../input/input.manifest.js';
import { Icon } from '../icon/icon.js';
import { Kbd } from '../kbd/kbd.js';
import { InputWell } from '../input/input-well.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, VariantProps<typeof searchField.manifest> {
  /** Called when the clear control is pressed. The clear control is offered only when given, and shows only while the field holds text. */
  onClear?: () => void;
  /** The key hint at the end, shown while the field is empty: whatever the shortcut is, with a space between keys, e.g. "⌘ K". Only a hint: the page wires the shortcut and names it on the control with aria-keyshortcuts. */
  shortcut?: string;
  /** The name of the clear control, which a screen reader says. "Clear search" unless given, for a page in another language. */
  clearLabel?: string;
  className?: string;
  /** Reaches the native input, e.g. to focus it when the page's shortcut is pressed. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Search field: the input's well and control, with a magnifier, a clear control and an optional key hint.
 * The clear control shows only while there is something to clear, and the key hint only while there is
 * not, so the end of the field holds one of them at a time. A read-only field offers neither. Pressing the
 * clear control calls onClear, empties a field the page does not control, and puts focus back in the field,
 * so the reader can type again at once. Escape in a field holding text empties it in every browser, as Chromium and Firefox already do for a
 * search field and Safari does not; the page hears it as a change to an empty value. In an empty field,
 * Escape is left to the page (to close the dialog the field is in, say).
 */
export function SearchField(props: SearchFieldProps) {
  const { size, error, onClear, shortcut, clearLabel = 'Clear search', className, ref, onChange, onKeyDown, ...rest } = useFieldControl(props);
  const readOnly = Boolean(rest.readOnly);
  // Whether a field the page does not control holds text; a controlled field says so through its value.
  const [typed, setTyped] = useState(() => String(rest.defaultValue ?? '') !== '');
  const filled = rest.value !== undefined ? String(rest.value) !== '' : typed;
  const change = (e: ChangeEvent<HTMLInputElement>) => {
    setTyped(e.target.value !== '');
    onChange?.(e);
  };
  const escape = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    const field = e.currentTarget;
    if (e.key !== 'Escape' || e.defaultPrevented || field.value === '' || field.readOnly) return;
    e.preventDefault();
    // The browser's own value setter, then an input event, so React reports the change as if typed, and a
    // field the page controls takes its empty value through onChange.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(field, '');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const clear = (e: MouseEvent<HTMLButtonElement>) => {
    const field = e.currentTarget.parentElement?.querySelector('input');
    onClear?.();
    if (field && rest.value === undefined) {
      field.value = '';
      setTyped(false);
    }
    field?.focus();
  };
  return (
    <InputWell
      className={cx(searchField({ size, error }), className)}
      // The input has no lg: a large search field draws the input's md well, and this block's lg class makes it larger.
      size={size === 'lg' ? 'md' : size}
      error={error}
      nameCheck="SearchField"
      leadingIcon="MagnifyingGlass"
      end={
        <>
          {onClear && filled && !readOnly && (
            <button type="button" className={searchField.part('clear')} aria-label={clearLabel} onClick={clear}>
              <Icon name="X" />
            </button>
          )}
          {shortcut && !filled && !readOnly && (
            <Kbd size="sm" className={searchField.part('kbd')} aria-hidden="true">
              {shortcut}
            </Kbd>
          )}
        </>
      }
    >
      <input ref={ref} type="search" className={`${input.part('control')} ${searchField.part('control')}`} aria-invalid={error ? true : undefined} {...rest} onChange={change} onKeyDown={escape} />
    </InputWell>
  );
}
readsField(SearchField);
