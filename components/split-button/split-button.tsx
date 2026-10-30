'use client';

import { useState, type MouseEventHandler, type ReactNode } from 'react';
import { splitButton } from './split-button.manifest.js';
import { ButtonGroup } from '../button-group/button-group.js';
import { Button } from '../button/button.js';
import { Dropdown } from '../dropdown/dropdown.js';
import { useWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface SplitButtonProps extends VariantProps<typeof splitButton.manifest> {
  /** The default action's words, such as "Export PDF". They also name the pair for a screen reader. */
  label: string;
  /** The caret button's name, such as "More export options". It must differ from the action's words; when it does not, a warning shows in development. */
  menuLabel: string;
  /** Phosphor icon name shown before the action's words. */
  leadingIcon?: string;
  /** Runs the default action. */
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  /** Makes the default action a link to this address. */
  href?: string;
  /** Dims both buttons; neither can be pressed. */
  disabled?: boolean;
  /** Whether the menu starts open. */
  defaultOpen?: boolean;
  /** Called with the new state whenever the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Extra classes for adjusting it in place, such as a site's own class for its position. Never a fork. */
  className?: string;
  /** The menu: DropdownItems for the related actions, never the default one again. */
  children: ReactNode;
}

/**
 * Split button: the default action and a caret button joined into one bar, drawn as a segmented button group.
 * The caret button opens the dropdown under the bar, lined up with its end edge, and points up while it is open.
 * Two stops in the tab order: the action, then the caret. The menu's keyboard is the dropdown's: Enter, Space or
 * the down arrow open it on its first item, the arrows move, Escape closes it and returns focus to the caret.
 */
export function SplitButton({ tone = splitButton.manifest.axes.tone.default, size = splitButton.manifest.axes.size.default, label, menuLabel, leadingIcon, onClick, href, disabled, defaultOpen = false, onOpenChange, className, children }: SplitButtonProps) {
  const [open, setOpen] = useState(defaultOpen);
  useWarning(
    menuLabel.trim().toLowerCase() === label.trim().toLowerCase(),
    'A SplitButton’s menuLabel names the menu, so it must differ from the action’s words, such as "More export options". Until it does, a screen reader hears two buttons with one name.',
  );
  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };
  const action = href !== undefined && !disabled ? (
    <Button tone={tone} size={size} leadingIcon={leadingIcon} href={href} onClick={onClick}>{label}</Button>
  ) : (
    <Button tone={tone} size={size} leadingIcon={leadingIcon} onClick={onClick} disabled={disabled}>{label}</Button>
  );
  return (
    <ButtonGroup type="segmented" tone={tone} size={size} label={label} className={cx(splitButton({ tone, size }), className)}>
      {action}
      <Dropdown
        label={menuLabel}
        align="end"
        size={size === 'sm' ? 'sm' : 'md'}
        open={open}
        onOpenChange={change}
        trigger={<Button tone={tone} size={size} icon-only icon={open ? 'CaretUp' : 'CaretDown'} aria-label={menuLabel} disabled={disabled} />}
      >
        {children}
      </Dropdown>
    </ButtonGroup>
  );
}
