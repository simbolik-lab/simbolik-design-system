import type { ButtonHTMLAttributes, ReactNode, Ref, RefObject } from 'react';
import { useObjectRef } from 'react-aria';
import { input } from './input.manifest.js';
import { Icon } from '../icon/icon.js';
import { useNameCheck } from '../name-check.js';
import { OutsideField } from '../field/field-context.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/** What the name check looks for in a well: the control a reader types in or opens, never a hidden form value. */
const CONTROL = 'input:not([type="hidden"]), textarea, [role="combobox"]';

export interface InputWellProps extends Omit<ButtonHTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof input.manifest> {
  /** The element the well is: a span around a text control (the default), or the button a select opens its list with. */
  as?: 'span' | 'button';
  /** The component's name, for the name check: in development, a warning when the control in the well has no name. Left out, nothing is checked. */
  nameCheck?: string;
  /** Phosphor icon name shown before the control. */
  leadingIcon?: string;
  /** Anything else before the control, after the leading icon, in the leading content part. */
  leadingContent?: ReactNode;
  /** The control: a native input or textarea, or what a select or a combobox shows in the well. */
  children: ReactNode;
  /** Phosphor icon name shown after the control and the error icon. */
  trailingIcon?: string;
  /** An action after the control, in the trailing action part: a button, a unit, a step pair. */
  trailingAction?: ReactNode;
  /** What else ends the well, after the action, as it is: a search field's clear cross and key hint, a caret, a grip, a hidden form value. */
  end?: ReactNode;
  /** The component's classes after the input's: its block and modifiers, or its part, and the page's own. */
  className?: string;
  /** Reaches the well. */
  ref?: Ref<HTMLElement>;
}

/**
 * The input's well, the one shell every field built on the input draws: the input's classes with the component's
 * after them, the leading icon and content, the control, the error icon while in error, the trailing icon and
 * action, and the name check. The part order is Figma's Input: leading icon, leading content, value, error icon,
 * trailing icon, trailing action. The attributes keep the order the component writes them in, the classes in
 * `className`'s place. What sits in the well is outside any field around the component (`OutsideField`): the
 * field's control is the component itself. The system's own part: a site uses the components built on it.
 */
export function InputWell(props: InputWellProps) {
  const { as = 'span', size, error, nameCheck, leadingIcon, leadingContent, children, trailingIcon, trailingAction, end, ref, ...attrs } = props;
  const own = useObjectRef(ref);
  useNameCheck(nameCheck, own, CONTROL);
  attrs.className = cx(input({ size, error }), attrs.className);
  const parts = (
    <OutsideField>
      {leadingIcon && <Icon name={leadingIcon} className={input.part('icon')} />}
      {leadingContent != null && leadingContent !== false && <span className={input.part('leading-content')}>{leadingContent}</span>}
      {children}
      {error && <Icon name="Warning" className={input.part('error-icon')} />}
      {trailingIcon && <Icon name={trailingIcon} className={input.part('icon')} />}
      {trailingAction != null && trailingAction !== false && <span className={input.part('trailing-action')}>{trailingAction}</span>}
      {end}
    </OutsideField>
  );
  return as === 'button' ? (
    <button ref={own as RefObject<HTMLButtonElement | null>} {...attrs}>
      {parts}
    </button>
  ) : (
    <span ref={own as RefObject<HTMLSpanElement | null>} {...attrs}>
      {parts}
    </span>
  );
}
