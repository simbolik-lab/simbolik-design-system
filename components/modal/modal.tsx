import { useId, useRef, type DialogHTMLAttributes, type ReactNode } from 'react';
import { modal } from './modal.manifest.js';
import { Divider } from '../divider/divider.js';
import { Icon } from '../icon/icon.js';
import { useModalDialog } from '../dialog.js';
import { useControllable } from '../controllable.js';
import { DismissButton } from '../dismiss-button.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'open'>, VariantProps<typeof modal.manifest> {
  /** Whether it is open, when the page holds it. Pair it with onOpenChange. */
  open?: boolean;
  /** Whether it starts open, when the modal holds its own open state. Closed unless given. */
  defaultOpen?: boolean;
  /**
   * Called with the new state when the modal asks to close (`false`): the close button, Escape, or a click on the
   * scrim. Holding its own state, the modal then closes; held by the page, the page closes it.
   */
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  /** Phosphor icon name drawn above the title. */
  icon?: string;
  /** Footer actions, e.g. Cancel and Accept buttons. The divider above them is drawn by the modal. */
  actions?: ReactNode;
  /** Hide the close button. Keep an action that closes instead. */
  hideClose?: boolean;
  /** The close button's name, what a screen reader says for it. "Close" unless given, for a page in another language. */
  closeLabel?: string;
  /**
   * The title's heading level. 2 unless given: a dialog over the page sits under the page's own title. Give the level
   * one below the heading the dialog belongs under when it opens from deeper in the page.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
}

/**
 * Modal: a native dialog opened modally, so focus is held inside and Escape
 * closes it. Inline modals just render open, for previews. Its open state is the
 * page's when given `open`, its own otherwise, starting from `defaultOpen`
 * (controllable.ts); asking to close tells `onOpenChange(false)`.
 */
export function Modal({ size, inline, open, defaultOpen = false, onOpenChange, title, icon, actions, hideClose, closeLabel = 'Close', headingLevel = 2, className, children, ...rest }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const Heading = `h${headingLevel}` as const;
  const classes = cx(modal({ size, inline }), className);
  const [opened, setOpened] = useControllable({ value: open, defaultValue: defaultOpen, onChange: onOpenChange, name: 'Modal open' });
  const close = () => setOpened(false);

  // Opened over the page, closed on Escape and on a click on the scrim, never on one on the panel (dialog.ts).
  const dialog = useModalDialog(ref, { open: opened, inline, onClose: close });

  return (
    <dialog
      ref={ref}
      open={inline ? opened : undefined}
      className={classes}
      aria-labelledby={`${id}-title`}
      {...dialog.props}
      {...rest}
    >
      <div className={modal.part('header')}>
        {icon && <Icon name={icon} className={modal.part('icon')} />}
        <Heading id={`${id}-title`} className={modal.part('title')}>
          {title}
        </Heading>
        {!hideClose && <DismissButton label={closeLabel} className={modal.part('close')} onClick={close} />}
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
