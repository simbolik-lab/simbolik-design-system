import { type ButtonHTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react';
import { toggleButton } from './toggle-button.manifest.js';
import { Icon } from '../icon/icon.js';
import { useControllable } from '../controllable.js';
import { iconWords, useNameWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ToggleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'type' | 'aria-pressed'>, VariantProps<typeof toggleButton.manifest> {
  /** Whether it is on, when the page holds the state. Pair it with onPressedChange. */
  pressed?: boolean;
  /** Whether it starts on, when it holds its own state. */
  defaultPressed?: boolean;
  /** Called with the new state each time it is pressed. */
  onPressedChange?: (pressed: boolean) => void;
  /** Phosphor icon name shown before the label. */
  leadingIcon?: string;
  /** The icon of an icon-only toggle. */
  icon?: string;
  /** Extra classes for adjusting it in place, such as a site's own class for its position. Never a fork. */
  className?: string;
  children?: ReactNode;
  /** Reaches the native button, e.g. to focus it. */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Toggle button: a native button that says whether it is on (aria-pressed), drawn as the outline button (or the ghost
 * button, for a toolbar's tool) and sunken when on, all by the button's stylesheet. Space and Enter press it, as any button. It holds its own state unless given `pressed`. An icon-only
 * toggle must carry an accessible name, which stays the same whether it is on or off.
 */
export function ToggleButton({ tone, size, pressed, defaultPressed = false, onPressedChange, leadingIcon, icon, className, children, onClick, ...rest }: ToggleButtonProps) {
  const iconOnly = rest['icon-only'] === true;
  const { 'icon-only': _omit, ...attrs } = rest as Record<string, unknown>;
  const [on, setOn] = useControllable({ value: pressed, defaultValue: defaultPressed, onChange: onPressedChange, name: 'ToggleButton pressed' });
  const dimmed = attrs['aria-disabled'] === true || attrs['aria-disabled'] === 'true';

  // A nameless icon-only toggle warns in development and is named by its icon's words, never thrown, as the button.
  const nameless = iconOnly && !('aria-label' in attrs) && !('aria-labelledby' in attrs);
  useNameWarning('An icon-only ToggleButton', !nameless, 'Give it an aria-label that says what it turns on; until then it is named by its icon.');
  if (nameless) attrs['aria-label'] = iconWords(icon ?? leadingIcon ?? '');

  const press = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || dimmed) return;
    setOn(!on);
  };

  const look = tone ?? toggleButton.manifest.axes.tone.default;
  const classes = cx(toggleButton({ tone: look, size, 'icon-only': iconOnly }), className);
  const iconPart = toggleButton.part('icon');
  return (
    <button type="button" aria-pressed={on} className={classes} onClick={press} {...(attrs as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {iconOnly ? (
        <Icon name={icon ?? leadingIcon ?? ''} className={iconPart} />
      ) : (
        <>
          {leadingIcon && <Icon name={leadingIcon} className={iconPart} />}
          <span className={toggleButton.part('label')}>{children}</span>
        </>
      )}
    </button>
  );
}
