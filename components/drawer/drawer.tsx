import { useEffect, useId, useRef, type DialogHTMLAttributes, type ReactNode } from 'react';
import { drawer } from './drawer.manifest.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import type { VariantProps } from '../variants.js';

export interface DrawerProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'open'>, VariantProps<typeof drawer.manifest> {
  open: boolean;
  /** Called when the drawer asks to close: the close button, Escape, or a click on the scrim. */
  onClose?: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** Footer actions, e.g. Cancel and Save buttons. The divider above them is drawn by the drawer. */
  actions?: ReactNode;
  /** Hide the close button. Keep an action that closes instead. */
  hideClose?: boolean;
  children: ReactNode;
}

/**
 * Drawer: a native dialog opened modally, so focus is held inside and Escape
 * closes it. Inline drawers just render open, for previews.
 *
 * Opening, focus goes to the panel itself (named by its title), not to its first
 * control: a drawer often holds a long list, and a phone's browser may draw the
 * focus ring on a button the page focuses after a tap, so the close button would
 * open looking pressed. Tab then reaches the
 * close button and everything after it.
 */
export function Drawer({ position, inline, open, onClose, title, description, actions, hideClose, className, children, ...rest }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const classes = [drawer({ position, inline }), className].filter(Boolean).join(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el || inline) return;
    if (open && !el.open) {
      // With autofocus on the dialog itself, the browser's dialog focusing steps focus the panel, not its first control.
      el.setAttribute('autofocus', '');
      el.showModal();
      if (document.activeElement !== el) el.focus();
    } else if (!open && el.open) el.close();
  }, [open, inline]);

  const onClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === ref.current) onClose?.();
  };

  return (
    <dialog
      ref={ref}
      tabIndex={inline ? undefined : -1}
      open={inline ? open : undefined}
      className={classes}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose?.();
      }}
      onClick={inline ? undefined : onClick}
      {...rest}
    >
      <div className={drawer.part('header')}>
        <div className={drawer.part('heading')}>
          <h2 id={`${id}-title`} className={drawer.part('title')}>
            {title}
          </h2>
          {description && (
            <p id={`${id}-description`} className={drawer.part('description')}>
              {description}
            </p>
          )}
        </div>
        {!hideClose && <Button tone="ghost" size="md" icon="X" icon-only aria-label="Close" className={drawer.part('close')} onClick={onClose} />}
        <Divider />
      </div>
      <div className={drawer.part('body')}>{children}</div>
      {actions && (
        <div className={drawer.part('footer')}>
          <Divider />
          <div className={drawer.part('actions')}>{actions}</div>
        </div>
      )}
    </dialog>
  );
}
