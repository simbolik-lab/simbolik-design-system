import type { MouseEventHandler } from 'react';
import { Button } from './button/button.js';
import { Icon } from './icon/icon.js';

export interface DismissButtonProps {
  /** The part class the component gives it, which places it and, when `bare`, draws it. */
  className: string;
  /** Its accessible name: what pressing it does. "Close" unless given. */
  label?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** The ghost icon-only button's size, as Figma draws it in each component. Medium unless given. */
  size?: 'sm' | 'md';
  /**
   * The cross alone in the small press box (press-box/press-box.css), drawn by the part class, as the alert and the
   * toast draw it, rather than the ghost icon-only button.
   */
  bare?: boolean;
}

/**
 * The cross that closes or dismisses what it sits in: the alert, the banner, the toast, the modal, the drawer and the
 * popover's header. A button named by `label`, holding the X icon: the system's ghost icon-only button, or with `bare`
 * the cross alone in the small press box.
 */
export function DismissButton({ className, label = 'Close', onClick, size = 'md', bare = false }: DismissButtonProps) {
  if (bare) {
    return (
      <button type="button" className={className} aria-label={label} onClick={onClick}>
        <Icon name="X" />
      </button>
    );
  }
  return <Button tone="ghost" size={size} icon="X" icon-only aria-label={label} className={className} onClick={onClick} />;
}
