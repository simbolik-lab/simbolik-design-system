'use client';

/**
 * A native dialog opened over the page, for the modal, the alert dialog, the drawer and the command palette: one hook,
 * `useModalDialog`, for what the three do alike. Its look over the page (the scrim, the motion, the page held still
 * behind it) is dialog/dialog.css.
 *
 * - Opening: `showModal()`, so the browser holds focus inside and makes the page behind it inert; closing: `close()`.
 *   A dialog shown in place (`inline`, or a palette given no `open`) is left to the page.
 * - Escape: the browser asks the dialog to close (its `cancel` event); the hook calls `onClose` and leaves closing to
 *   whoever holds `open`: the page, or the component holding its own (`useControllable`, controllable.ts), which closes
 *   in `onClose`. Without `onClose`, Escape does nothing.
 * - The scrim: the dialog's backdrop, which is not an element of its own: a press on it reaches the dialog element as
 *   its target, just as a press on the dialog's own padding or edge does. Only where the press lands tells them apart,
 *   so a press counts as one on the scrim when it lands outside the panel's box, and only when it also started there:
 *   a press that starts on the panel and ends on the scrim, as when selecting words, leaves the dialog open.
 * - Layers (dismiss.ts): the dialog is a layer while it is open over the page. A press on its scrim or an Escape while
 *   a layer above it is open (a popover inside the modal) closes that layer only, and the dialog stays.
 * - The exit fade: `shown` is true from the moment the dialog opens until it has faded out after closing (the
 *   transitions dialog.css starts as it closes, read right after `close()`; in a browser that runs none, at once),
 *   for a dialog that drops its content once closed, as the palette does. Opening again during the fade keeps it.
 */

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent, type RefObject, type SyntheticEvent } from 'react';
import { useDialogLayer } from './dismiss.js';

/** Whether a point lies outside an element's box. */
function outside(element: Element | null, x: number, y: number): boolean {
  if (!element) return false;
  const box = element.getBoundingClientRect();
  return x < box.left || x > box.right || y < box.top || y > box.bottom;
}

export interface ModalDialogOptions {
  /** Whether it is open over the page. Undefined: never over the page (a palette shown in place). */
  open: boolean | undefined;
  /** Shown in place, for previews: the page holds it open with the `open` attribute, and nothing here applies. */
  inline?: boolean;
  /** Called when it asks to close: Escape, or a click on the scrim. */
  onClose?: () => void;
  /** The element drawn as the dialog, for the scrim's click: the dialog itself unless given (the palette's panel). */
  panel?: RefObject<Element | null>;
  /**
   * Focuses the dialog itself as it opens, named by its title, rather than its first control (the drawer: it often
   * holds a long list, and a phone's browser may draw the focus ring on a button the page focuses after a tap).
   */
  focusSelf?: boolean;
  /** Where focus starts as it opens, instead of the first control (the alert dialog's Cancel, the action that harms nothing). */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Whether a click on the scrim asks to close; true unless given. The alert dialog closes only on its actions and Escape. */
  scrimCloses?: boolean;
}

export interface ModalDialog {
  /** Whether its content is drawn: from opening until it has faded out after closing. */
  shown: boolean;
  /** The handlers to spread on the dialog element. */
  props: {
    onCancel: (event: SyntheticEvent<HTMLDialogElement>) => void;
    onPointerDown?: (event: PointerEvent<HTMLDialogElement>) => void;
    onClick?: (event: MouseEvent<HTMLDialogElement>) => void;
  };
}

/** Opens and closes `ref`'s dialog over the page with `open`, and asks the page to close it on Escape and on the scrim. */
export function useModalDialog(ref: RefObject<HTMLDialogElement | null>, { open, inline = false, onClose, panel = ref, focusSelf = false, initialFocus, scrimCloses = true }: ModalDialogOptions): ModalDialog {
  const over = !inline && open !== undefined;
  const layer = useDialogLayer(ref, over && open === true);
  const [shown, setShown] = useState(open === true);
  if (open && !shown) setShown(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || !over) return undefined;
    if (open && !el.open) {
      // With autofocus on the dialog itself, the browser's dialog focusing steps focus the panel, not its first control.
      if (focusSelf) el.setAttribute('autofocus', '');
      el.showModal();
      if (focusSelf && document.activeElement !== el) el.focus();
      if (initialFocus?.current && el.contains(initialFocus.current)) initialFocus.current.focus();
    } else if (!open && el.open) {
      el.close();
      const fading = typeof el.getAnimations === 'function' ? el.getAnimations() : [];
      if (!fading.length) {
        setShown(false);
        return undefined;
      }
      let current = true;
      void Promise.allSettled(fading.map((a) => a.finished)).then(() => {
        if (current && !el.open) setShown(false);
      });
      return () => {
        current = false;
      };
    }
    return undefined;
  }, [open, over]);

  const fromScrim = useRef(false);
  const onCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    // The same Escape closed a layer above the dialog.
    if (layer.escapeSpent()) return;
    onClose?.();
  };
  if (!over || !scrimCloses) return { shown, props: { onCancel } };
  return {
    shown,
    props: {
      onCancel,
      onPointerDown: (event) => {
        fromScrim.current = layer.isTop() && event.target === event.currentTarget && outside(panel.current, event.clientX, event.clientY);
      },
      onClick: (event) => {
        const started = fromScrim.current;
        fromScrim.current = false;
        if (started && event.target === event.currentTarget && outside(panel.current, event.clientX, event.clientY)) onClose?.();
      },
    },
  };
}
