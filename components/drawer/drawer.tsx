'use client';

import { useId, useRef, type DialogHTMLAttributes, type ReactNode } from 'react';
import { mergeProps } from 'react-aria';
import { drawer } from './drawer.manifest.js';
import { Divider } from '../divider/divider.js';
import { useModalDialog } from '../dialog.js';
import { useControllable } from '../controllable.js';
import { DismissButton } from '../dismiss-button.js';
import { useScrollbar } from '../scrollbar.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface DrawerProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'open'>, VariantProps<typeof drawer.manifest> {
  /** Whether it is open, when the page holds it. Pair it with onOpenChange. */
  open?: boolean;
  /** Whether it starts open, when the drawer holds its own open state. Closed unless given. */
  defaultOpen?: boolean;
  /**
   * Called with the new state when the drawer asks to close (`false`): the close button, Escape, or a click on the
   * scrim. Holding its own state, the drawer then closes; held by the page, the page closes it.
   */
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Footer actions, e.g. Cancel and Save buttons. The divider above them is drawn by the drawer. */
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
 * Drawer: a native dialog opened modally, so focus is held inside and Escape
 * closes it. Inline drawers just render open, for previews.
 *
 * Opening, focus goes to the panel itself (named by its title), not to its first
 * control: a drawer often holds a long list, and a phone's browser may draw the
 * focus ring on a button the page focuses after a tap, so the close button would
 * open looking pressed. Tab then reaches the
 * close button and everything after it.
 *
 * Its open state is the page's when given `open`, its own otherwise, starting
 * from `defaultOpen` (controllable.ts); asking to close tells
 * `onOpenChange(false)`.
 */
export function Drawer({ position, inline, open, defaultOpen = false, onOpenChange, title, description, actions, hideClose, closeLabel = 'Close', headingLevel = 2, className, children, ...rest }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const bar = useScrollbar(body);
  const id = useId();
  const Heading = `h${headingLevel}` as const;
  const classes = cx(drawer({ position, inline }), className);
  const [opened, setOpened] = useControllable({ value: open, defaultValue: defaultOpen, onChange: onOpenChange, name: 'Drawer open' });
  const close = () => setOpened(false);

  // Opened over the page with focus on the panel itself, closed on Escape and on a click on the scrim, never on one
  // on the panel (dialog.ts). The page's own handlers run after these, never instead of them.
  const dialog = useModalDialog(ref, { open: opened, inline, onClose: close, focusSelf: true });

  return (
    <dialog
      ref={ref}
      tabIndex={inline ? undefined : -1}
      open={inline ? opened : undefined}
      className={classes}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      {...mergeProps(dialog.props, rest)}
    >
      <div className={drawer.part('header')}>
        <div className={drawer.part('heading')}>
          <Heading id={`${id}-title`} className={drawer.part('title')}>
            {title}
          </Heading>
          {description && (
            <p id={`${id}-description`} className={drawer.part('description')}>
              {description}
            </p>
          )}
        </div>
        {!hideClose && <DismissButton label={closeLabel} className={drawer.part('close')} onClick={close} />}
        <Divider />
      </div>
      <div ref={body} className={drawer.part('body')} {...bar}>
        {children}
      </div>
      {actions && (
        <div className={drawer.part('footer')}>
          <Divider />
          <div className={drawer.part('actions')}>{actions}</div>
        </div>
      )}
    </dialog>
  );
}
