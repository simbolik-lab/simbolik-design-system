import { useEffect, useId, useRef, type DialogHTMLAttributes, type ReactNode } from 'react';
import { modal } from './modal.manifest.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'open'>, VariantProps<typeof modal.manifest> {
  open: boolean;
  /** Called when the modal asks to close: the close button, Escape, or a click on the scrim. */
  onClose?: () => void;
  title: ReactNode;
  /** Phosphor icon name drawn above the title. */
  icon?: string;
  /** Footer actions, e.g. Cancel and Accept buttons. The divider above them is drawn by the modal. */
  actions?: ReactNode;
  /** Hide the close button. Keep an action that closes instead. */
  hideClose?: boolean;
  children: ReactNode;
}

/**
 * Modal: a native dialog opened modally, so focus is held inside and Escape
 * closes it. Inline modals just render open, for previews.
 */
export function Modal({ size, inline, open, onClose, title, icon, actions, hideClose, className, children, ...rest }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const classes = [modal({ size, inline }), className].filter(Boolean).join(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el || inline) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open, inline]);

  const onClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === ref.current) onClose?.();
  };

  return (
    <dialog
      ref={ref}
      open={inline ? open : undefined}
      className={classes}
      aria-labelledby={`${id}-title`}
      onCancel={(e) => {
        e.preventDefault();
        onClose?.();
      }}
      onClick={inline ? undefined : onClick}
      {...rest}
    >
      <div className={modal.part('header')}>
        {icon && <Icon name={icon} className={modal.part('icon')} />}
        <h2 id={`${id}-title`} className={modal.part('title')}>
          {title}
        </h2>
        {!hideClose && <Button tone="ghost" size="md" icon="X" icon-only aria-label="Close" className={modal.part('close')} onClick={onClose} />}
      </div>
      <div className={modal.part('body')}>{children}</div>
      {actions && (
        <>
          <Divider />
          <div className={modal.part('footer')}>{actions}</div>
        </>
      )}
    </dialog>
  );
}
