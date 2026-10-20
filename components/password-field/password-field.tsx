import { useEffect, useId, useRef, type FocusEvent, type InputHTMLAttributes, type KeyboardEvent, type Ref } from 'react';
import { flushSync } from 'react-dom';
import { passwordField } from './password-field.manifest.js';
import { input } from '../input/input.manifest.js';
import { Button } from '../button/button.js';
import { InputWell } from '../input/input-well.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import { useControllable } from '../controllable.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, VariantProps<typeof passwordField.manifest> {
  /** Whether the password shows as text, when the page holds the state. Pair it with onShownChange. */
  shown?: boolean;
  /** Whether it starts shown, when the field holds its own state. Hidden unless given. */
  defaultShown?: boolean;
  /** Called with the new state each time the button is pressed, and with false when the form is sent. */
  onShownChange?: (shown: boolean) => void;
  /** The button's name while the password is hidden. "Show password" unless given, for another language or "Show passphrase". */
  showLabel?: string;
  /** The button's name while the password shows. "Hide password" unless given. */
  hideLabel?: string;
  /**
   * Called with true when a key is pressed in the field while Caps Lock is on, and with false when it goes off or the
   * field loses focus, so the page can say so under the field (the field's warning).
   */
  onCapsLockChange?: (on: boolean) => void;
  /** Extra classes for the well, not the control. */
  className?: string;
  /** Reaches the native input, e.g. to focus it when a form is sent with it empty. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Password field: the input's well and control, with a ghost icon button at its end that shows and hides what is
 * typed. The button is named for what it will do ("Show password", "Hide password") and comes after the field in the
 * Tab order; pressing it keeps the value and the focus where they are, so a reader typing who clicks it types on. The
 * control asks the password
 * manager for the current password unless given another autocomplete, never blocks pasting, and never corrects or
 * capitalizes what is typed. Sending the form hides the password again, so the browser never keeps it as plain text.
 */
export function PasswordField(props: PasswordFieldProps) {
  const {
    size, error, shown, defaultShown = false, onShownChange, showLabel = 'Show password', hideLabel = 'Hide password', onCapsLockChange,
    className, ref, id, disabled, onKeyDown, onKeyUp, onBlur, ...rest
  } = useFieldControl(props);
  const well = useRef<HTMLElement>(null);
  const ownId = useId();
  const controlId = id ?? `password${ownId}`;
  const [visible, change] = useControllable({ value: shown, defaultValue: defaultShown, onChange: onShownChange, name: 'PasswordField shown' });
  const capsLock = useRef(false);

  // Sending the form hides the password first, so the browser's form history and password manager meet a password control.
  const latest = useRef({ visible, change });
  latest.current = { visible, change };
  useEffect(() => {
    const form = well.current?.querySelector('input')?.form;
    if (!form) return;
    const hide = () => {
      if (latest.current.visible) flushSync(() => latest.current.change(false));
    };
    form.addEventListener('submit', hide);
    return () => form.removeEventListener('submit', hide);
  }, []);

  const report = (on: boolean) => {
    if (on === capsLock.current) return;
    capsLock.current = on;
    onCapsLockChange?.(on);
  };
  const key = (e: KeyboardEvent<HTMLInputElement>) => report(e.getModifierState('CapsLock'));

  return (
    <InputWell
      ref={well}
      className={cx(passwordField({ size, error }), className)}
      size={size}
      error={error}
      nameCheck="PasswordField"
      trailingAction={
        <Button
          tone="ghost"
          size={size === 'sm' ? 'xs' : 'sm'}
          icon-only
          icon={visible ? 'EyeSlash' : 'Eye'}
          aria-label={visible ? hideLabel : showLabel}
          aria-controls={controlId}
          disabled={disabled}
          className={passwordField.part('toggle')}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => change(!visible)}
        />
      }
    >
      <input
        ref={ref}
        id={controlId}
        type={visible ? 'text' : 'password'}
        className={`${input.part('control')} ${passwordField.part('control')}`}
        autoComplete="current-password"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-invalid={error ? true : undefined}
        disabled={disabled}
        {...rest}
        onKeyDown={(e) => { onKeyDown?.(e); key(e); }}
        onKeyUp={(e) => { onKeyUp?.(e); key(e); }}
        onBlur={(e: FocusEvent<HTMLInputElement>) => { onBlur?.(e); report(false); }}
      />
    </InputWell>
  );
}
readsField(PasswordField);
