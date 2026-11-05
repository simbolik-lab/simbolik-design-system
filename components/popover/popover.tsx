'use client';

/**
 * Popover: a small raised panel beside the button that opened it, holding a title,
 * a few lines or a field, and actions. It does not block the page.
 *
 * OPENER API — how to open it from a button
 * -----------------------------------------
 * Give the popover its opener as `trigger`, as the dropdown takes one. It then draws
 * the opener, places the panel beside it, and does the keyboard and focus work. Without
 * `trigger` it draws the panel only, open, for a consumer that shows and places it itself.
 *
 *   <Popover trigger={<Button tone="outline" size="md" trailingIcon="CaretDown">Share</Button>}>
 *     <PopoverHeader title="Share this page" />
 *     <PopoverBody>Anyone with the link can read it.</PopoverBody>
 *     <PopoverFooter><Button tone="outline" size="sm" trailingIcon="Copy">Copy link</Button></PopoverFooter>
 *   </Popover>
 *
 * Popover props:
 *   trigger       The opener: any element that renders one button and passes id, aria-*, onClick and
 *                 onKeyDown through to it (Button, Tag, a plain <button>, or words: Link with as="button", which
 *                 stay in their line). The popover adds id (unless it has one), aria-haspopup="dialog",
 *                 aria-expanded and aria-controls. Its own onClick runs first; calling preventDefault in it stops
 *                 the popover's.
 *   label         Accessible name of the panel. Needed only without a PopoverHeader, whose title names it.
 *   align         "start" (default) or "end": which edge of the opener the panel lines up with.
 *   side          "below" (default), "above", "left" or "right": the side of the opener the panel prefers. Without
 *                 room there, as at the foot of the window, it opens on the opposite side; left or right with room on
 *                 neither, as on a phone, it opens below.
 *   pointer       A small triangle on the panel's edge, pointing at the middle of the opener, on whichever side the
 *                 panel opened. Off unless turned on.
 *   open          Controlled open state. Pair it with onOpenChange.
 *   defaultOpen   The first state when uncontrolled.
 *   onOpenChange  Called with the new state whenever the popover opens or closes itself.
 *   openOnHover   Also opens while a mouse rests on the opener, after the tooltip's wait, and closes a moment after the
 *                 mouse has left both the opener and the panel (the hover close delay). For a card that previews what
 *                 its opener names. A press, the keyboard and touch open it as without it. Off unless turned on.
 *                 It takes a `trigger`.
 *   openerId      In place of `trigger`, for an opener the popover does not draw: the id of a button already on the page,
 *                 such as a Table row's own (`tableRowPressId`). See the opener it does not draw, below.
 *   hangOnId      The id of the element the panel hangs on, when that is not the opener: the name in a row, say, where
 *                 the row's own button runs the whole width of the table.
 *   Other props (className, data-*) go to the panel.
 *
 * The opener it does not draw: with `openerId`, the page holds `open` and its button's press sets it, the button stays
 * as it is, and the popover draws no anchor, only the layer with the panel in it, where the page puts it. The panel hangs
 * on that button, or on `hangOnId`. Focus moves in as it opens and goes back to that button, as with `trigger`. A press
 * on that button is the opener's, not a press outside, so it can close what it opened, and so is a press on a copy of it
 * that names it in `data-copy-of`, as the copy a Table holds in a held cell does. The popover writes nothing on the
 * button, so the page says what it opens (`aria-haspopup`).
 *
 * Focus: opening moves focus into the panel, so a screen reader says it opened: to its first field when it holds
 * one, otherwise to the panel itself, named by its title (as the drawer does, it draws no ring of its own), and Tab
 * goes on through it. A popover open as the page loads takes no focus. Escape, from the opener or
 * anywhere in the panel, closes it and returns focus to the opener, as does the header's close button.
 * Escape with focus elsewhere on the page also closes it, and leaves focus where it is.
 * A click or tap outside closes it, and so does focus moving anywhere outside. A closed panel is hidden,
 * not removed, so what was typed into a field inside it is kept.
 *
 * Hover (openOnHover): a panel the pointer opened leaves focus where it is, and Escape closes it without moving the
 * pointer. Pressing the opener then keeps it open as a press would have opened it: focus moves in, and the pointer
 * leaving no longer closes it. Neither does it close while focus is inside it.
 *
 * Placing (floating.ts, with React Aria): while open, the panel is lifted over the page, so no clipping or
 * scrolling part around the opener cuts it off, and placed beside the opener on the side it prefers, or the other
 * when that one lacks room, moved inward at the window's edge. It is never taller than the room on its side and
 * scrolls inside itself when its content is taller. It stays beside the opener as the page scrolls. It stays where
 * it is in the page, so Tab still goes from the opener into it, and an opener inside a part that goes full screen
 * keeps its panel shown.
 *
 * Pointer: a panel that scrolled would cut off what sticks out past its edge, so with `pointer` what it holds scrolls
 * in a part of its own (the scroll part), and the pointer sits beside that part. floating.ts places it, as it does a
 * tooltip's arrow.
 *
 * Movement belongs to the stylesheet: the panel drops in from the opener and fades (rising when it opened above),
 * and does not move under reduced motion. The wrapper holds no styling: the stylesheet draws everything.
 */
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { popover } from './popover.manifest.js';
import { DismissButton } from '../dismiss-button.js';
import { Divider } from '../divider/divider.js';
import { useFloating } from '../floating.js';
import { useDismiss } from '../dismiss.js';
import { useControllable } from '../controllable.js';
import { motionMs } from '../motion.js';
import { useScrollRegion } from '../scroll-hint.js';
import { useScrollbar } from '../scrollbar.js';
import { Icon } from '../icon/icon.js';
import { useWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/** What the header needs from the popover around it. */
interface PopoverContext {
  /** The id the header's title takes, which names the panel. */
  titleId: string;
  /** Closes the popover, returning focus to the opener when there is one. */
  close: () => void;
}

const Context = createContext<PopoverContext | null>(null);

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof popover.manifest> {
  /** Accessible name of the panel, when it has no header title to name it. */
  label?: string;
  children: ReactNode;
  /** The opener. When given, the popover draws it and opens the panel under it. */
  trigger?: ReactElement;
  /** Controlled open state. */
  open?: boolean;
  /** The first state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new state whenever the popover opens or closes itself. */
  onOpenChange?: (open: boolean) => void;
  /** Also opens while a mouse rests on the opener, leaving focus where it is, and closes a moment after the mouse has left both the opener and the panel. For a card that previews what its opener names. It takes a `trigger`. */
  openOnHover?: boolean;
  /**
   * In place of `trigger`, the id of a button already on the page, such as a Table row's own (`tableRowPressId`), for
   * an opener the popover cannot draw. The panel hangs on it and gives focus back to it, and a press on it is no press
   * outside. The page holds `open`, and the button's press sets it.
   */
  openerId?: string;
  /** The id of the element the panel hangs on, when that is not the opener. It takes no press and no focus. */
  hangOnId?: string;
}

/** With a pointer, what the panel holds: it scrolls here, where a panel that scrolled would cut the pointer off. */
function PopoverScroll({ label, labelledBy, children }: { label?: string; labelledBy?: string; children: ReactNode }) {
  const { frame, region } = useScrollRegion<HTMLDivElement>({ axis: 'y', label, labelledBy });
  return (
    <div ref={frame} className={popover.part('scroll')} {...region}>
      {children}
    </div>
  );
}

/** Popover: the panel alone, or the panel with its opener when `trigger` is given. See the opener API above. */
export function Popover(props: PopoverProps) {
  return props.trigger || props.openerId ? <PopoverWithOpener {...props} /> : <PopoverPanel {...props} />;
}

/** The panel alone, shown. Its close button asks whoever shows it to close it. */
function PopoverPanel({ label, align, side, pointer, trigger: _trigger, open: _open, defaultOpen: _defaultOpen, onOpenChange, openOnHover: _openOnHover, openerId: _openerId, hangOnId: _hangOnId, className, children, ...rest }: PopoverProps) {
  const titleId = `${useId()}-title`;
  const held = <Context.Provider value={{ titleId, close: () => onOpenChange?.(false) }}>{children}</Context.Provider>;
  return (
    <div role="dialog" aria-label={label} aria-labelledby={label ? undefined : titleId} className={cx(popover({ align, side, pointer }), className)} {...rest}>
      {pointer ? (
        <>
          <PopoverScroll label={label} labelledBy={label ? undefined : titleId}>
            {held}
          </PopoverScroll>
          <span className={popover.part('pointer')} aria-hidden="true" />
        </>
      ) : (
        held
      )}
    </div>
  );
}

/** What opening focuses first inside the panel: a field to type or choose in. */
const FIELDS = 'input:not([type="hidden"]):not(:disabled), textarea:not(:disabled), select:not(:disabled), [contenteditable="true"]';

/** The element with an id, as a ref: read each time, since the page may draw it again, and null on the server. */
const elementById = (id: string): RefObject<HTMLElement | null> => ({
  get current() {
    return typeof document === 'undefined' ? null : document.getElementById(id);
  },
});

/** The opener and the panel placed beside it, with the popover's keyboard and focus behaviour. */
function PopoverWithOpener({ label, align, side, pointer, trigger, openerId: pageOpener, hangOnId, open: controlled, defaultOpen = false, onOpenChange, openOnHover = false, className, children, ...rest }: PopoverProps) {
  useWarning(Boolean(trigger && pageOpener), 'A Popover takes trigger or openerId, not both: it draws the trigger and leaves openerId out.');
  useWarning(openOnHover && !trigger, 'A Popover with openerId cannot open on hover, since the pointer rests on a part it does not draw: give it a trigger, or leave openOnHover out.');
  const id = useId();
  const openerProps = (trigger?.props ?? {}) as { id?: string; onClick?: (e: MouseEvent<HTMLElement>) => void };
  const openerId = (trigger ? openerProps.id : pageOpener) ?? `${id}-opener`;
  const panelId = `${id}-panel`;
  const titleId = `${id}-title`;
  const [open, keepOpen] = useControllable({ value: controlled, defaultValue: defaultOpen, onChange: onOpenChange, name: 'Popover open' });
  const anchor = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  // Hover: whether the pointer opened it (a press did not), the waiting timer, and the state as it is now, for the
  // timer to read when it fires.
  const byHover = useRef(false);
  const hoverTimer = useRef(0);
  const isOpen = useRef(open);
  isOpen.current = open;

  const setOpen = (next: boolean, focusOpener = false) => {
    if (focusOpener) document.getElementById(openerId)?.focus();
    if (next === open) return;
    keepOpen(next);
  };

  // A press outside, Escape wherever focus is (a click that did not focus the opener, as in Safari, leaves focus
  // outside it) and focus moving anywhere outside close it while it is the top layer (dismiss.ts); Escape with focus
  // inside puts focus back on the opener.
  // An opener it does not draw lies outside what it draws, so the popover says which presses and focus are that opener's.
  const isOpener = (node: Node) => {
    const element = node instanceof Element ? node : node.parentElement;
    return Boolean(document.getElementById(openerId)?.contains(node)) || element?.closest('[data-copy-of]')?.getAttribute('data-copy-of') === openerId;
  };
  const dismiss = useDismiss({ open, root: trigger ? anchor : layer, opener: trigger ? undefined : isOpener, onClose: (back) => setOpen(false, back), blur: true });

  // Focus moves into the panel: to its first field, or the panel itself.
  const focusPanel = () => {
    const p = panel.current;
    if (p && !p.contains(document.activeElement)) (p.querySelector<HTMLElement>(FIELDS) ?? p).focus({ preventScroll: true });
  };

  // Opening moves focus in, once the panel shows. Not as the page loads, and not when the pointer opened it: a card
  // read by resting on its opener leaves focus where it is. Any change of state ends a wait for the pointer.
  const wasOpen = useRef(open);
  useEffect(() => {
    const was = wasOpen.current;
    wasOpen.current = open;
    window.clearTimeout(hoverTimer.current);
    if (!open) byHover.current = false;
    else if (!was && !byHover.current) focusPanel();
  }, [open]);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // The pointer resting on the opener opens it; leaving both the opener and the panel closes what the pointer opened,
  // unless focus went into it. The panel hangs inside the anchor, so moving onto it is not leaving, and the close delay
  // carries the pointer over the gap between them. Only a mouse hovers: touch and pen open it through the opener's click.
  const onPointerEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !anchor.current) return;
    window.clearTimeout(hoverTimer.current);
    if (isOpen.current || document.getElementById(openerId)?.matches(':disabled, [aria-disabled="true"]')) return;
    hoverTimer.current = window.setTimeout(() => {
      if (isOpen.current) return;
      byHover.current = true;
      keepOpen(true);
    }, motionMs(anchor.current, 'tooltip-open-delay'));
  };

  const onPointerLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !anchor.current) return;
    window.clearTimeout(hoverTimer.current);
    if (!isOpen.current || !byHover.current) return;
    hoverTimer.current = window.setTimeout(() => {
      if (panel.current?.contains(document.activeElement)) byHover.current = false;
      else keepOpen(false);
    }, motionMs(anchor.current, 'hover-close-delay'));
  };

  const onOpenerClick = (e: MouseEvent<HTMLElement>) => {
    openerProps.onClick?.(e);
    if (e.defaultPrevented) return;
    window.clearTimeout(hoverTimer.current);
    // A press on a panel the pointer opened keeps it open, now as a press opens it.
    if (open && byHover.current) {
      byHover.current = false;
      focusPanel();
      return;
    }
    setOpen(!open);
  };

  // What the panel hangs on: the element the page names, or else the anchor around the opener it draws.
  const named = hangOnId ?? (trigger ? undefined : openerId);
  const hung = useMemo(() => (named === undefined ? anchor : elementById(named)), [named]);

  const placed = useFloating({ target: hung, layer, panel, open, side: side ?? 'below', fallback: 'below', align: align === 'end' ? 'end' : 'start', listHeight: false, arrow: pointer ? tip : undefined });
  const bar = useScrollbar(panel, { enabled: !pointer });
  const held = <Context.Provider value={{ titleId, close: () => setOpen(false, true) }}>{children}</Context.Provider>;

  const lifted = (
    <div ref={layer} className={popover.part('layer')} {...(trigger ? undefined : dismiss)}>
      <div
        ref={panel}
        id={panelId}
        role="dialog"
        aria-label={label}
        aria-labelledby={label ? undefined : titleId}
        className={cx(popover({ align, side, pointer }), className)}
        tabIndex={-1}
        {...bar}
        {...rest}
        hidden={!open}
        data-side={placed.side ?? undefined}
        data-placed={placed.arrowOffset !== null ? '' : undefined}
      >
        {pointer ? (
          <>
            <PopoverScroll label={label} labelledBy={label ? undefined : titleId}>
              {held}
            </PopoverScroll>
            <span ref={tip} className={popover.part('pointer')} aria-hidden="true" />
          </>
        ) : (
          held
        )}
      </div>
    </div>
  );

  // With an opener it does not draw there is nothing to hold beside the layer, which has no box until it is lifted.
  if (!trigger) return lifted;

  const opener = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    id: openerId,
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': panelId,
    onClick: onOpenerClick,
  });

  return (
    <div ref={anchor} className={popover.part('anchor')} {...dismiss} onPointerEnter={openOnHover ? onPointerEnter : undefined} onPointerLeave={openOnHover ? onPointerLeave : undefined}>
      {opener}
      {lifted}
    </div>
  );
}

export interface PopoverHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** The title, which names the panel. */
  title: ReactNode;
  /** A line or two under the title. */
  description?: ReactNode;
  /** Phosphor icon name before the title. */
  icon?: string;
  /** A close button in the panel's corner. Figma: Discard. */
  closeButton?: boolean;
  /** The close button's name, what a screen reader says for it. "Close" unless given, for a page in another language. */
  closeLabel?: string;
  /** A line under the header. */
  divider?: boolean;
}

/** The top of the panel: an optional icon, the title and description, an optional close button and divider. */
export function PopoverHeader({ title, description, icon, closeButton, closeLabel = 'Close', divider, className, ...rest }: PopoverHeaderProps) {
  const context = useContext(Context);
  return (
    <div className={cx(popover.part('header'), className)} {...rest}>
      <div className={popover.part('heading')}>
        {icon && <Icon name={icon} className={popover.part('icon')} />}
        <div className={popover.part('titles')}>
          <p id={context?.titleId} className={popover.part('title')}>
            {title}
          </p>
          {description && <p className={popover.part('description')}>{description}</p>}
        </div>
        {closeButton && <DismissButton size="sm" label={closeLabel} className={popover.part('close')} onClick={context?.close} />}
      </div>
      {divider && <Divider className={popover.part('divider')} />}
    </div>
  );
}

export interface PopoverBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** The middle of the panel. Plain text is set in the description's look; anything else, such as a field, as it is. */
export function PopoverBody({ className, children, ...rest }: PopoverBodyProps) {
  return (
    <div className={cx(popover.part('body'), className)} {...rest}>
      {Children.map(children, (child) => (typeof child === 'string' || typeof child === 'number' ? <p className={popover.part('description')}>{child}</p> : child))}
    </div>
  );
}

export interface PopoverFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** A line over the footer. On unless turned off, as Figma draws it. */
  divider?: boolean;
  /** A short line of help in place of, or under, the actions. Figma: Helper Text. */
  helper?: ReactNode;
  /** The actions, lined up at the end: one button, or a button group for several. */
  children?: ReactNode;
}

/** The foot of the panel: a divider, then the actions at the end or a line of helper text. */
export function PopoverFooter({ divider = true, helper, className, children, ...rest }: PopoverFooterProps) {
  return (
    <div className={cx(popover.part('footer'), className)} {...rest}>
      {divider && <Divider className={popover.part('divider')} />}
      {children}
      {helper && <p className={popover.part('helper')}>{helper}</p>}
    </div>
  );
}
