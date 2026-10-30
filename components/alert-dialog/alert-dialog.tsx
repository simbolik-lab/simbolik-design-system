'use client';

import { useId, useRef, type DialogHTMLAttributes, type ReactNode } from 'react';
import { mergeProps } from 'react-aria';
import { alertDialog } from './alert-dialog.manifest.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { Icon } from '../icon/icon.js';
import { useModalDialog } from '../dialog.js';
import { useControllable } from '../controllable.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface AlertDialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'open'>, VariantProps<typeof alertDialog.manifest> {
  /** Whether it is open, when the page holds it. Pair it with onOpenChange. */
  open?: boolean;
  /** The first state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with false when it asks to close: Cancel, Escape, or after the confirm action. */
  onOpenChange?: (open: boolean) => void;
  /** The question, which names the dialog: "Delete this project?" */
  title: ReactNode;
  /** What will happen, in a sentence or two; read with the title as the dialog opens. */
  description: ReactNode;
  /** A Phosphor icon before the title, as the modal's. */
  icon?: string;
  /** The confirm action's words, naming what it does: "Delete project". */
  confirmLabel: string;
  /** Called when the confirm action is pressed. The dialog then asks to close. */
  onConfirm?: () => void;
  /** The cancel action's words. "Cancel" unless given, for a page in another language. */
  cancelLabel?: string;
  /** The confirm action's tone: danger for what destroys, brand for what only cannot be undone. Danger unless given. */
  confirmTone?: 'danger' | 'brand';
  /** The title's heading level, second unless given. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Anything more the question needs under the description, such as a list of what goes. */
  children?: ReactNode;
}

/**
 * Alert dialog: a modal that asks before something that cannot be undone. It is the modal with the alertdialog role,
 * drawn by the modal's stylesheet: the title names it and the description is read with it as it opens; focus starts
 * on Cancel, the action that harms nothing; Escape and Cancel ask to close, and a click on the scrim does nothing, so
 * the question is never dismissed by accident. Its open state is the page's when given `open`, its own otherwise.
 */
export function AlertDialog({ size, inline, open, defaultOpen = false, onOpenChange, title, description, icon, confirmLabel, onConfirm, cancelLabel = 'Cancel', confirmTone = 'danger', headingLevel = 2, className, children, ...rest }: AlertDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const id = useId();
  const Heading = `h${headingLevel}` as const;
  const [opened, setOpened] = useControllable({ value: open, defaultValue: defaultOpen, onChange: onOpenChange, name: 'AlertDialog open' });
  const close = () => setOpened(false);

  // Opened over the page with focus on Cancel; closed on Escape, never on a click on the scrim (dialog.ts). The page's
  // own handlers run after these, never instead of them.
  const dialog = useModalDialog(ref, { open: opened, inline, onClose: close, initialFocus: cancel, scrimCloses: false });

  return (
    <dialog
      ref={ref}
      role="alertdialog"
      open={inline ? opened : undefined}
      className={cx(alertDialog({ size, inline }), className)}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      {...mergeProps(dialog.props, rest)}
    >
      <div className={alertDialog.part('header')}>
        {icon && <Icon name={icon} className={alertDialog.part('icon')} />}
        <Heading id={`${id}-title`} className={alertDialog.part('title')}>
          {title}
        </Heading>
      </div>
      <div className={alertDialog.part('body')}>
        <p id={`${id}-description`}>{description}</p>
        {children}
      </div>
      <Divider />
      <div className={alertDialog.part('footer')}>
        <Button ref={cancel} tone="outline" onClick={close}>
          {cancelLabel}
        </Button>
        <Button
          tone={confirmTone}
          onClick={() => {
            onConfirm?.();
            close();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
