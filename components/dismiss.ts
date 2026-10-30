'use client';

/**
 * One rule for closing what is open over the page: an outside press or Escape closes the top open layer, and only it.
 *
 * A layer is anything open over the page: a panel beside its opener (the popover, the dropdown, the select's and the
 * combobox's lists, the date picker's calendar, and through them the split button's menu and the color picker), and a
 * dialog over the page (the modal, the drawer, the command palette, dialog.ts). They are kept in the order they opened;
 * the last opened is the top.
 *
 * - A press outside the top layer closes it, and nothing under it: a press on a modal's scrim while a popover inside
 *   the modal is open closes the popover, and the modal stays. A press inside it closes nothing.
 * - Escape closes the top layer wherever focus is, and nothing under it: with a popover open inside a modal, the first
 *   Escape closes the popover and the second the modal.
 * - When focus was inside the layer that closed, the wrapper puts it back on the opener (`onClose(true)`); otherwise
 *   focus stays where it is (`onClose(false)`), as after a press outside.
 * - A dialog over the page is a layer too, but the browser closes it: Escape reaches it as its `cancel` event, a press
 *   outside it is a press on its scrim. While a dialog is the top layer, Escape and presses are left to it.
 * - Optionally (`blur`), focus moving to anything outside the layer closes it, whichever layer is on top.
 *
 * One listener for presses and one for keys sit on the document while anything is open; a layer also takes Escape
 * from inside itself (`props.onKeyDown`), so it stops there and a component around it never sees it.
 */
import { useEffect, useRef, type FocusEvent, type KeyboardEvent, type RefObject } from 'react';

interface Layer {
  /** Everything that belongs to the layer: the opener and the panel (the anchor around both), or the dialog. */
  root: RefObject<Element | null>;
  /** Closes it, putting focus back on the opener when `back`. Null for a dialog, which the browser closes. */
  close: ((back: boolean) => void) | null;
}

/** The open layers, in the order they opened. */
const layers: Layer[] = [];

/** Whether an Escape was spent closing a layer, until the task that pressed it ends. */
let spent = false;

const top = (): Layer | undefined => layers[layers.length - 1];
const within = (layer: Layer, node: unknown) => node instanceof Node && Boolean(layer.root.current?.contains(node));

/** Closes the top layer for an Escape, if this module closes it; says whether it did. */
function escape(event: { preventDefault(): void }): boolean {
  const layer = top();
  if (!layer?.close) return false;
  event.preventDefault();
  // The browser may still ask a dialog under the layer to close on the same key (its cancel event): it asks no one.
  spent = true;
  setTimeout(() => {
    spent = false;
  }, 0);
  layer.close(within(layer, document.activeElement));
  return true;
}

function onDocumentKey(event: globalThis.KeyboardEvent) {
  if (event.key === 'Escape' && !event.defaultPrevented) escape(event);
}

function onDocumentPress(event: PointerEvent) {
  const layer = top();
  if (layer?.close && !within(layer, event.target)) layer.close(false);
}

function raise(layer: Layer) {
  if (layers.length === 0) {
    document.addEventListener('pointerdown', onDocumentPress);
    document.addEventListener('keydown', onDocumentKey);
  }
  layers.push(layer);
}

function lower(layer: Layer) {
  const at = layers.indexOf(layer);
  if (at >= 0) layers.splice(at, 1);
  if (layers.length === 0) {
    document.removeEventListener('pointerdown', onDocumentPress);
    document.removeEventListener('keydown', onDocumentKey);
  }
}

/** Keeps `layer` among the open layers while `isOpen`. */
function useLayer(layer: Layer, isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return undefined;
    raise(layer);
    return () => lower(layer);
  }, [layer, isOpen]);
}

export interface DismissOptions {
  /** Whether the layer is open. */
  open: boolean;
  /** Everything that belongs to it: a press or focus here is inside. The anchor around the opener and the panel. */
  root: RefObject<Element | null>;
  /** Closes it. `back` is true when focus was inside it: put focus back on the opener. */
  onClose: (back: boolean) => void;
  /** Also close when focus moves to anything outside `root`. */
  blur?: boolean;
}

/**
 * Makes an opener and its panel a layer while `open`: an outside press or Escape closes it when it is the top layer
 * (see the header). Spread what it returns on `root` (or call its handlers from the root's own): `onKeyDown` takes
 * Escape from inside it, and with `blur`, `onBlur` closes it as focus leaves.
 */
export function useDismiss({ open: isOpen, root, onClose, blur = false }: DismissOptions) {
  const close = useRef(onClose);
  close.current = onClose;
  const layer = useRef<Layer>({ root, close: (back) => close.current(back) }).current;
  useLayer(layer, isOpen);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.defaultPrevented || !isOpen) return;
    if (escape(event)) event.stopPropagation();
  };
  // A blur with nowhere to go is a press, which the press rule handles.
  const onBlur = (event: FocusEvent) => {
    const next = event.relatedTarget;
    if (isOpen && next instanceof Node && root.current && !root.current.contains(next)) close.current(false);
  };
  return { onKeyDown, onBlur: blur ? onBlur : undefined };
}

/**
 * Makes a dialog over the page a layer while `open`, for dialog.ts: the browser closes it, and this says whether it is
 * the top layer (a press on its scrim counts only then) and whether an Escape was just spent on a layer above it.
 */
export function useDialogLayer(root: RefObject<Element | null>, isOpen: boolean) {
  const layer = useRef<Layer>({ root, close: null }).current;
  useLayer(layer, isOpen);
  return {
    isTop: () => top() === layer,
    escapeSpent: () => spent,
  };
}
