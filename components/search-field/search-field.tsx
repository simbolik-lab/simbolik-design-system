import { useState, type ChangeEvent, type InputHTMLAttributes, type KeyboardEvent, type MouseEvent, type MouseEventHandler, type Ref } from 'react';
import { searchField } from './search-field.manifest.js';
import { input } from '../input/input.manifest.js';
import { Icon } from '../icon/icon.js';
import { Kbd } from '../kbd/kbd.js';
import type { VariantProps } from '../variants.js';

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, VariantProps<typeof searchField.manifest> {
  /** Called when the clear control is pressed. The clear control is offered only when given, and shows only while the field holds text. */
  onClear?: MouseEventHandler<HTMLButtonElement>;
  /** The key hint at the end: whatever the shortcut is, with a space between keys, e.g. "⌘ K". Only a hint: the page wires the shortcut and names it on the control with aria-keyshortcuts. */
  shortcut?: string;
  className?: string;
  /** Reaches the native input, e.g. to focus it when the page's shortcut is pressed. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Search field: the input's well and control, with a magnifier, a clear control and an optional key hint.
 * The clear control shows only while there is something to clear. Pressing it calls onClear, empties a
 * field the page does not control, and puts focus back in the field, so the reader can type again at once.
 * Escape in a field holding text empties it in every browser, as Chromium and Firefox already do for a
 * search field and Safari does not; the page hears it as a change to an empty value. In an empty field,
 * Escape is left to the page (to close the dialog the field is in, say).
 */
export function SearchField({ size, error, onClear, shortcut, className, ref, onChange, onKeyDown, ...rest }: SearchFieldProps) {
  const classes = [input({ size, error }), searchField({ size, error }), className].filter(Boolean).join(' ');
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
    if (e.key !== 'Escape' || e.defaultPrevented || field.value === '') return;
    e.preventDefault();
    // The browser's own value setter, then an input event, so React reports the change as if typed, and a
    // field the page controls takes its empty value through onChange.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(field, '');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const clear = (e: MouseEvent<HTMLButtonElement>) => {
    const field = e.currentTarget.parentElement?.querySelector('input');
    onClear?.(e);
    if (field && rest.value === undefined) {
      field.value = '';
      setTyped(false);
    }
    field?.focus();
  };
  return (
    <span className={classes}>
      <Icon name="MagnifyingGlass" className={input.part('icon')} />
      <input ref={ref} type="search" className={`${input.part('control')} ${searchField.part('control')}`} aria-invalid={error ? true : undefined} {...rest} onChange={change} onKeyDown={escape} />
      {onClear && filled && (
        <button type="button" className={searchField.part('clear')} aria-label="Clear search" onClick={clear}>
          <Icon name="X" />
        </button>
      )}
      {shortcut && (
        <Kbd size="sm" className={searchField.part('kbd')} aria-hidden="true">
          {shortcut}
        </Kbd>
      )}
    </span>
  );
}
