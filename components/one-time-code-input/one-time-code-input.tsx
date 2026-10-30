'use client';

import { useLayoutEffect, useState, type ClipboardEvent, type InputEvent as ReactInputEvent, type InputHTMLAttributes, type KeyboardEvent, type MouseEvent, type Ref } from 'react';
import { useObjectRef } from 'react-aria';
import { oneTimeCodeInput } from './one-time-code-input.manifest.js';
import { input } from '../input/input.manifest.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import { useControllable } from '../controllable.js';
import { useNameCheck } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/** How many digits a code has, and how the cells are grouped: two groups of three, as a code is read. */
const LENGTH = 6;
const GROUPS = [
  [0, 1, 2],
  [3, 4, 5],
] as const;

export interface OneTimeCodeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'maxLength' | 'minLength' | 'children'>,
    VariantProps<typeof oneTimeCodeInput.manifest> {
  /** The digits typed so far, when the page holds them: at most six, digits only. Pair it with onChange. */
  value?: string;
  /** The digits it starts with, when it holds its own. */
  defaultValue?: string;
  /** Told the digits each time they change, as one string: typed, cleared, pasted or filled in by the phone. */
  onChange?: (value: string) => void;
  /** Told the whole code once all six digits are in, such as to send it at once. */
  onComplete?: (code: string) => void;
  /** Extra classes for the block, not the control. */
  className?: string;
  /** Reaches the native input that holds the code, e.g. to focus it. */
  ref?: Ref<HTMLInputElement>;
}

/** Digits only, at most six: what a paste, the phone's fill or a page's value becomes. */
const clean = (text: string) => text.replace(/\D/g, '').slice(0, LENGTH);

/**
 * One-time code input: one native text control holds the code, so it is one field for a screen reader, a form, a
 * password manager and the phone's own code suggestion, with `autocomplete="one-time-code"` and a numeric keyboard. It
 * lies unseen over six cells drawn with the input's well, which show its digits; the cell where the next digit goes is
 * marked data-active, and takes the focus edge while the control has focus.
 *
 * The control's selection says which cell is active: on a filled cell its digit is selected, so typing replaces it and
 * moves on; past the last digit the caret waits in the next empty cell (on the last cell's digit once all six are
 * in). A digit moves to the next cell, Backspace clears the last digit and goes back (a picked digit in the middle is
 * cleared and the rest close up, the browser's own deletion), the arrows, Home and End move between cells, a press picks the
 * cell under it (never past the next empty one), and a paste fills every cell. Anything but a digit is kept out.
 */
export function OneTimeCodeInput(props: OneTimeCodeInputProps) {
  const {
    error,
    value: given,
    defaultValue = '',
    onChange,
    onComplete,
    className,
    ref,
    disabled,
    readOnly,
    onKeyDown,
    onPaste,
    onFocus,
    onSelect,
    onClick,
    onBeforeInput,
    ...rest
  } = useFieldControl(props);
  const control = useObjectRef(ref);
  useNameCheck('One-time code input', control, 'input');
  const [value, setValue] = useControllable<string>({ value: given === undefined ? undefined : clean(given), defaultValue: () => clean(defaultValue), onChange, name: 'OneTimeCodeInput value' });
  // The cell the next digit goes to, or the one whose digit the caret holds while focused.
  const [active, setActive] = useState(() => Math.min(value.length, LENGTH - 1));

  const commit = (next: string) => {
    if (next === value) return;
    setValue(next);
    if (next.length === LENGTH) onComplete?.(next);
  };

  /** Puts the selection on cell `at`: its digit when it has one, else the caret in the next empty cell. */
  const place = (el: HTMLInputElement, at: number) => {
    const length = el.value.length;
    const cell = Math.max(0, Math.min(at, length, LENGTH - 1));
    if (cell < length) el.setSelectionRange(cell, cell + 1);
    else el.setSelectionRange(length, length);
    setActive(cell);
  };

  /** After the browser moved the caret: one cell's digit selected, or the caret after the last digit. A selection of several digits (select all) is left as it is. */
  const settle = (el: HTMLInputElement) => {
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    if (end - start > 1) {
      setActive(Math.min(start, LENGTH - 1));
      return;
    }
    if (end - start === 1 || (start === el.value.length && start < LENGTH)) {
      setActive(Math.min(start, LENGTH - 1));
      return;
    }
    place(el, start);
  };

  // A value the page or a paste set lands with the selection where it belongs; away from focus, the active cell is the next empty one.
  useLayoutEffect(() => {
    const el = control.current;
    if (!el) return;
    if (el.ownerDocument.activeElement === el) settle(el);
    else setActive(Math.min(value.length, LENGTH - 1));
    // settle reads only the element and sets state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, control]);

  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const el = event.currentTarget;
    const start = el.selectionStart ?? 0;
    // On a filled cell the browser would only drop the selection; the arrow moves to the cell before.
    if (event.key === 'ArrowLeft' && (el.selectionEnd ?? start) - start === 1) {
      event.preventDefault();
      place(el, start - 1);
    }
    // Home and End go to the first cell and the one after the last digit on every system, a Mac's included.
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      place(el, event.key === 'Home' ? 0 : el.value.length);
    }
  };

  const beforeInput = (event: ReactInputEvent<HTMLInputElement>) => {
    onBeforeInput?.(event);
    if (event.data && /\D/.test(event.data) && (event.nativeEvent as globalThis.InputEvent).inputType === 'insertText') event.preventDefault();
  };

  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(event);
    if (event.defaultPrevented || disabled || readOnly) return;
    const digits = clean(event.clipboardData.getData('text'));
    event.preventDefault();
    if (!digits) return;
    commit(digits);
  };

  const press = (event: MouseEvent<HTMLInputElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const el = event.currentTarget;
    const cells = [...(el.parentElement?.querySelectorAll<HTMLElement>(`.${oneTimeCodeInput.part('cell')}`) ?? [])];
    const under = cells.findIndex((cell) => event.clientX < cell.getBoundingClientRect().right);
    place(el, under < 0 ? LENGTH - 1 : under);
  };

  return (
    <span className={cx(oneTimeCodeInput({ error }), className)}>
      {GROUPS.map((group, g) => (
        <span key={g} className={oneTimeCodeInput.part('group')} aria-hidden="true">
          {group.map((i) => (
            <span key={i} className={cx(input({ size: 'lg', error }), oneTimeCodeInput.part('cell'))} data-active={i === active ? '' : undefined}>
              <span className={oneTimeCodeInput.part('digit')}>{value[i] ?? ''}</span>
            </span>
          ))}
        </span>
      ))}
      <input
        ref={control}
        className={oneTimeCodeInput.part('control')}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        spellCheck={false}
        maxLength={LENGTH}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? true : undefined}
        onChange={(event) => commit(clean(event.currentTarget.value))}
        onBeforeInput={beforeInput}
        onKeyDown={keyDown}
        onPaste={paste}
        onFocus={(event) => {
          onFocus?.(event);
          settle(event.currentTarget);
        }}
        onSelect={(event) => {
          onSelect?.(event);
          settle(event.currentTarget);
        }}
        onClick={press}
        {...rest}
      />
    </span>
  );
}
readsField(OneTimeCodeInput);
