'use client';

/**
 * Dropdown: a raised list of actions or links.
 *
 * OPENER API — how to open it from a button
 * -----------------------------------------
 * Give the dropdown its opener as `trigger`. It then draws the opener, hangs the
 * panel under it, and does the keyboard and focus work of a menu button. Without
 * `trigger` it draws the panel only, for a consumer that opens and places it itself.
 *
 *   // A menu of links in a site header: purpose "navigation"
 *   <Dropdown label="Services" purpose="navigation" trigger={<NavItem caret>Services</NavItem>}>
 *     <DropdownItem href="/services/audits">Audits</DropdownItem>
 *     <DropdownItem href="/services/training">Training</DropdownItem>
 *   </Dropdown>
 *
 *   // A menu of commands: purpose "actions", the default
 *   <Dropdown label="Project actions" align="end"
 *     trigger={<Button tone="ghost" size="md" icon="DotsThree" icon-only aria-label="Project actions" />}>
 *     <DropdownItem icon="PencilSimple" onClick={rename}>Rename</DropdownItem>
 *     <DropdownSubmenu icon="FolderSimple" label="Move to">
 *       <DropdownItem icon="FolderSimple" onClick={() => move('design')}>Design system</DropdownItem>
 *       <DropdownItem icon="FolderSimple" onClick={() => move('site')}>Marketing site</DropdownItem>
 *     </DropdownSubmenu>
 *     <DropdownDivider />
 *     <DropdownItem icon="Trash" danger onClick={remove}>Delete</DropdownItem>
 *   </Dropdown>
 *
 * RIGHT-CLICK API — the same menu, opened where the pointer is
 * -------------------------------------------------------------
 * Give the dropdown the part of the page it belongs to as `area` instead of `trigger`. The dropdown draws the area
 * inside an element of its own and opens the menu at the pointer on a right click there, on a finger held down there
 * on a touch screen, and from the keyboard on Shift+F10 or the menu key, then beside the element that has focus. The
 * browser's own menu does not show over the area. Everything else is the menu's own: its items, keys and closing.
 *
 *   <Dropdown label="Card actions" area={<Card>…</Card>}>
 *     <DropdownItem icon="Copy" kbd="⌘ C">Copy</DropdownItem>
 *     <DropdownDivider />
 *     <DropdownItem icon="Trash" danger>Delete</DropdownItem>
 *   </Dropdown>
 *
 * Dropdown props:
 *   label         Accessible name of the list: the menu's for actions, the link group's for navigation.
 *   trigger       The opener: any element that renders one button and passes id, aria-*, onClick and
 *                 onKeyDown through to it (Button, NavItem, a plain <button>). The dropdown adds id (unless
 *                 it has one), aria-expanded, aria-controls, and for actions aria-haspopup="menu". Its own
 *                 onClick and onKeyDown run first; calling preventDefault in them stops the dropdown's.
 *   area          The part of the page a right click opens the menu over (see the right-click API). Not with trigger.
 *   purpose       "actions" (default): commands. The panel is a menu, the items are menu items, Tab leaves.
 *                 "navigation": links to other pages. No menu roles; the links stay in the tab order.
 *   size          "md" (default) or "sm": the height of every item, the medium or the small control height.
 *   align         "start" (default) or "end": which edge of the opener the panel lines up with.
 *   open          Controlled open state. Pair it with onOpenChange.
 *   defaultOpen   The first state when uncontrolled.
 *   onOpenChange  Called with the new state whenever the dropdown opens or closes itself.
 *   openOnHover   Also opens while a mouse rests on the opener, and closes a moment after the mouse has left
 *                 both the opener and the panel (the hover delays, motion.hover). A press on the opener still
 *                 opens it, so touch and keyboard work as without it (a menu never opens
 *                 on hover alone), and a click on a panel the pointer opened leaves it open. Only one dropdown
 *                 opened this way shows at a time. For a site header's menus of links.
 *   Other props (className, onKeyDown, data-*) go to the panel.
 *
 * DropdownItem takes `href` to draw a link instead of a button; use it for navigation. Choosing an
 * item closes the dropdown; for actions, focus goes back to the opener.
 *
 * An item given `checked` (true or false) ticks: it draws the checkbox's box before its icon, is a
 * menu item checkbox that says whether it is ticked, and pressing it calls `onCheckedChange` with the
 * new value and leaves the dropdown open, so several can be ticked in one go.
 *
 * An item given `selected` (true or false) is one of a single choice: the chosen one draws a tick after its label,
 * each is a menu item radio that says whether it is the chosen one, and pressing one calls its onClick and closes the
 * dropdown. Put the items of one choice after a DropdownLabel, so they are one group named by it.
 *
 * DropdownSubmenu is an item that opens a second menu beside it: `label` its words, `icon` its icon, its children the
 * second menu's items, which may hold labels, dividers and submenus of their own. It draws a caret at its end, says it
 * opens a menu and whether it is open, and opens with the right arrow, Enter or Space (focus on its first item), a
 * press, or a mouse resting on it a moment. The left arrow or Escape closes it and puts focus back on its item; it
 * also closes a moment after the mouse has left it and its menu, and with the menu it came from. Only one submenu of
 * a panel shows at a time. `open`, `defaultOpen` and `onOpenChange` work as the dropdown's. Choosing an item in it
 * closes the whole dropdown.
 *
 * A DropdownLabel starts a group: the dropdown puts it and the items after it, up to the next divider or
 * label, in one element with the group role, named by the label, so a screen reader says which group an
 * item is in. An item's key hint is drawn as a key cap hidden from screen readers and given to the item
 * as aria-keyshortcuts ("⌘ X" becomes "Meta+X"), so the item's name is its words alone.
 *
 * Keyboard (the WAI-ARIA menu button pattern):
 *   On the opener   Enter, Space or ArrowDown opens on the first item; ArrowUp opens on the last. A press
 *                   with the pointer opens with focus on the menu itself, no item focused.
 *                   For navigation, Enter and Space open and close and focus stays on the opener.
 *   In the panel    ArrowDown and ArrowUp move between items and wrap, a disabled one included (it does
 *                   nothing when pressed); Home and End jump to the ends; typing moves to the next item
 *                   starting with the letters typed; Escape closes and returns focus to the opener; Tab
 *                   closes and moves on. On a submenu's item, ArrowRight opens it; in a submenu, ArrowLeft
 *                   and Escape close it.
 *   Anywhere else   Escape closes it, as when the pointer opened it; focus stays where it is.
 *   A click or tap outside closes it, and so does focus moving anywhere outside.
 *
 * Placing (floating.ts, with React Aria): while open, the panel is lifted over the page, so no clipping or
 * scrolling part around the opener cuts it off, and placed beside the opener on the side with room: under it,
 * or above it when there is more room there. It is never taller than that room or the list height, and a
 * longer list scrolls inside it, with a shade at its foot while there is more below. It stays beside the opener
 * as the page scrolls. Without script it hangs under the opener. A submenu is placed the same way at the right of
 * its item, its first item level with it, or at the left when there is no room at the right; without script, an open
 * submenu hangs at the right of its item.
 *
 * Pointing (glide.ts): one hover fill per panel slides to the item under the mouse, the nearest one when the
 * pointer is between items or in the padding, and a press there presses the lit item. The keyboard's focused
 * item keeps its own fill and ring; touch draws no fill. A submenu's item keeps the hover fill while its menu shows.
 *
 * Movement belongs to the stylesheet: the panel drops in from the opener (rises, when it opens above; slides in
 * from its item, for a submenu) and fades, and does not move under reduced motion. The wrapper holds no styling:
 * the stylesheet draws everything.
 */
import {
  Children,
  cloneElement,
  isValidElement,
  type PointerEvent as ReactPointerEvent,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { dropdown } from './dropdown.manifest.js';
import { Icon } from '../icon/icon.js';
import { Kbd } from '../kbd/kbd.js';
import { keyShortcut } from '../key-shortcut.js';
import { checkbox } from '../checkbox/checkbox.manifest.js';
import { Divider } from '../divider/divider.js';
import { useFloating } from '../floating.js';
import { useDismiss } from '../dismiss.js';
import { useControllable } from '../controllable.js';
import { motionMs } from '../motion.js';
import { useGlide } from '../glide.js';
import { useScrollbar } from '../scrollbar.js';
import { useTypeAhead } from '../type-ahead.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export type DropdownPurpose = 'actions' | 'navigation';

/** The submenu showing in one panel, so opening another closes it first. */
interface OpenSubmenu {
  close: (() => void) | null;
}

/** What an item needs to know about the panel around it. */
interface DropdownContext {
  purpose: DropdownPurpose;
  /** True when the dropdown draws its own opener and moves focus between items itself. */
  managed: boolean;
  /** An item was chosen. */
  chosen: () => void;
  /** Whether the panel the item sits in shows: a submenu closes with it. */
  shown: boolean;
  /** The panel's item height, which a submenu's panel keeps. */
  size: VariantProps<typeof dropdown.manifest>['size'];
  /** The submenu showing in this panel. */
  submenu: OpenSubmenu;
}

const Context = createContext<DropdownContext | null>(null);

/**
 * An element around the dropdown's opener its panel hangs from instead of the opener: the menubar's bar, so its menus
 * hang the gap below the bar rather than below their title. For the menubar; a page has no need of it.
 */
export const DropdownStandOff = createContext<RefObject<HTMLElement | null> | null>(null);

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof dropdown.manifest> {
  /** Accessible name of the list, e.g. "Row actions" or "Services". */
  label: string;
  children: ReactNode;
  /** The opener. When given, the dropdown draws it and opens the panel under it. */
  trigger?: ReactElement;
  /** The part of the page the menu opens over on a right click, a held finger, Shift+F10 or the menu key. Not with `trigger`. */
  area?: ReactNode;
  /** Commands (a menu) or links to other pages (a group of links). */
  purpose?: DropdownPurpose;
  /** Controlled open state. */
  open?: boolean;
  /** The first state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new state whenever the dropdown opens or closes itself. */
  onOpenChange?: (open: boolean) => void;
  /** Also open while a mouse rests on the opener; a press still opens it. See the opener API above. */
  openOnHover?: boolean;
}

/** Roles and name of the panel for each purpose: a menu, or a named group of links. */
const panelRole = (purpose: DropdownPurpose) => (purpose === 'actions' ? 'menu' : 'group');

/**
 * The panel's children with each label and the items after it, up to the next divider or label, wrapped in
 * one group named by the label (role="group", aria-labelledby). Items before the first label stay as they are.
 */
function grouped(children: ReactNode, baseId: string): ReactNode[] {
  const out: ReactNode[] = [];
  let open: { labelId: string; nodes: ReactNode[] } | null = null;
  const close = (current: typeof open) => {
    if (current) {
      out.push(
        <div key={`group-${current.labelId}`} role="group" aria-labelledby={current.labelId} className={dropdown.part('group')}>
          {current.nodes}
        </div>,
      );
    }
    return null;
  };
  Children.toArray(children).forEach((child, i) => {
    if (isValidElement(child) && child.type === DropdownLabel) {
      open = close(open);
      const labelId = (child.props as DropdownLabelProps).id ?? `${baseId}-group-${i}`;
      open = { labelId, nodes: [cloneElement(child as ReactElement<DropdownLabelProps>, { id: labelId })] };
    } else if (isValidElement(child) && child.type === DropdownDivider) {
      open = close(open);
      out.push(child);
    } else if (open) open.nodes.push(child);
    else out.push(child);
  });
  close(open);
  return out;
}

/** Dropdown: the panel alone, or the panel with its opener when `trigger` or `area` is given. See the APIs above. */
export function Dropdown(props: DropdownProps) {
  return props.trigger || props.area !== undefined ? <DropdownWithOpener {...props} /> : <DropdownPanel {...props} />;
}

const noop = () => {};

const ITEM = dropdown.part('item');

/** The rows the pointer's fill glides between (glide.ts): every item, the disabled ones skipped. */
const GLIDE = { rows: `.${ITEM}`, fill: dropdown.part('glide') };

/** The panel an element sits in: its own, not one around it. */
const panelOf = (el: EventTarget | null) => (el instanceof Element ? el.closest(`.${dropdown.manifest.block}`) : null);

/** The items of one panel focus can land on, in order: its own, not a submenu's; a disabled item too, marked
 * aria-disabled, so its existence is announced (the ARIA menu pattern). Only an item written with the native disabled
 * attribute is passed over. */
function itemsOf(panel: HTMLElement | null): HTMLElement[] {
  if (!panel) return [];
  return [...panel.querySelectorAll<HTMLElement>(`.${ITEM}`)].filter((el) => panelOf(el) === panel && !(el as HTMLButtonElement).disabled);
}

/** Moves focus to a panel's first or last item. */
function focusItem(panel: HTMLElement | null, which: 'first' | 'last') {
  const list = itemsOf(panel);
  (which === 'first' ? list[0] : list[list.length - 1])?.focus();
}

/** How long typed letters keep adding to one search before a new one starts, as in the select. */
const TYPE_AHEAD_MS = 500;

/**
 * The keys that move focus inside one panel: the arrows, Home, End and typed letters. Returns a handler that acts on
 * a key pressed on one of the panel's own items (or the panel), not on a submenu's, and says whether it did.
 */
function useMenuKeys() {
  const typeAhead = useTypeAhead(TYPE_AHEAD_MS, { cycle: true });
  return (e: KeyboardEvent<HTMLElement>, panel: HTMLElement | null): boolean => {
    if (!panel || panelOf(e.target) !== panel) return false;
    const list = itemsOf(panel);
    if (!list.length) return false;
    const at = list.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => {
      e.preventDefault();
      list[(i + list.length) % list.length]?.focus();
      return true;
    };
    if (e.key === 'ArrowDown') return go(at + 1);
    if (e.key === 'ArrowUp') return go(at < 0 ? list.length - 1 : at - 1);
    if (e.key === 'Home') return go(0);
    if (e.key === 'End') return go(list.length - 1);
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key !== ' ' || typeAhead.typing())) {
      // Typing moves focus to the next item whose words start with the letters typed so far; the same letter again
      // steps through the items that start with it.
      const words = list.map((el) => el.querySelector(`.${dropdown.part('text')}`)?.textContent?.trim() ?? null);
      const to = typeAhead.find(e.key, words, at);
      if (to >= 0) return go(to);
      if (e.key === ' ') {
        e.preventDefault();
        return true;
      }
    }
    return false;
  };
}

/** The panel alone. Opening, placing and keyboard movement belong to whoever shows it. */
function DropdownPanel({ label, size, align, trigger: _trigger, area: _area, purpose = 'actions', open: _open, defaultOpen: _defaultOpen, onOpenChange: _onOpenChange, openOnHover: _openOnHover, className, children, ...rest }: DropdownProps) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const submenu = useRef<OpenSubmenu>({ close: null }).current;
  useGlide(panel, GLIDE);
  const bar = useScrollbar(panel);
  return (
    <div ref={panel} role={panelRole(purpose)} aria-label={label} className={cx(dropdown({ size, align }), className)} {...bar} {...rest}>
      <Context.Provider value={{ purpose, managed: false, chosen: noop, shown: true, size, submenu }}>{grouped(children, id)}</Context.Provider>
    </div>
  );
}

type FocusTarget = 'first' | 'last' | 'opener' | 'panel' | null;

/** Closes the dropdown the pointer opened, if one is open, so a pointer moving along a bar never shows two. */
let closeHovered: (() => void) | null = null;

/** Whether a key opens a right-click menu from the keyboard: Shift+F10, or the menu key. */
const menuKey = (e: KeyboardEvent) => (e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu';

/** The opener and the panel hanging under it, with the menu button's keyboard and focus behaviour; or, given `area`,
 * the area and the panel it opens at the pointer. */
function DropdownWithOpener({ label, size, align, trigger, area, purpose = 'actions', open: controlled, defaultOpen = false, onOpenChange, openOnHover = false, className, children, onKeyDown, ...rest }: DropdownProps) {
  const id = useId();
  const atPointer = !trigger;
  const openerProps = (trigger?.props ?? {}) as { id?: string; onClick?: (e: MouseEvent<HTMLElement>) => void; onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void };
  const openerId = openerProps.id ?? `${id}-opener`;
  const panelId = `${id}-panel`;
  const [open, keepOpen] = useControllable({ value: controlled, defaultValue: defaultOpen, onChange: onOpenChange, name: 'Dropdown open' });
  const anchor = useRef<HTMLDivElement>(null);
  const point = useRef<HTMLSpanElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<FocusTarget>(null);
  const submenu = useRef<OpenSubmenu>({ close: null }).current;
  // Hover: whether the pointer opened it (a press did not), the waiting timer, and the state as it is now,
  // for the timer to read when it fires.
  const byHover = useRef(false);
  const hoverTimer = useRef(0);
  const isOpen = useRef(open);
  isOpen.current = open;
  // A right-click menu: where focus was as it opened, to put it back; the held finger's timer; whether a key opened it.
  const returnTo = useRef<HTMLElement | null>(null);
  const holdTimer = useRef(0);
  const byKey = useRef(false);

  const menuKeys = useMenuKeys();

  const moveFocus = (target: FocusTarget) => {
    if (target === 'opener') {
      if (atPointer) {
        const back = returnTo.current;
        if (back?.isConnected) back.focus({ preventScroll: true });
      } else document.getElementById(openerId)?.focus();
    } else if (target === 'panel') panel.current?.focus({ preventScroll: true });
    else if (target) focusItem(panel.current, target);
  };

  const setOpen = (next: boolean, focus: FocusTarget = null) => {
    if (!next) {
      byHover.current = false;
      byKey.current = false;
    }
    if (next === isOpen.current) {
      moveFocus(focus);
      return;
    }
    isOpen.current = next;
    pendingFocus.current = focus;
    keepOpen(next);
  };

  // The pointer resting on the opener or the panel opens it; leaving both closes what the pointer opened.
  // Only a mouse hovers: touch and pen presses open it through the opener's click, as without hover.
  const closeThis = useRef(() => setOpen(false));
  closeThis.current = () => setOpen(false);
  const closeMe = useRef(() => closeThis.current());

  const onPointerEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !anchor.current) return;
    window.clearTimeout(hoverTimer.current);
    if (isOpen.current) return;
    hoverTimer.current = window.setTimeout(() => {
      if (isOpen.current) return;
      if (closeHovered && closeHovered !== closeMe.current) closeHovered();
      closeHovered = closeMe.current;
      setOpen(true);
      byHover.current = true;
    }, motionMs(anchor.current, 'hover-open-delay'));
  };

  const onPointerLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !anchor.current) return;
    window.clearTimeout(hoverTimer.current);
    if (!isOpen.current || !byHover.current) return;
    hoverTimer.current = window.setTimeout(() => setOpen(false), motionMs(anchor.current, 'hover-close-delay'));
  };

  // Once closed, it no longer counts as the one the pointer opened; unmounting stops any wait.
  useEffect(() => {
    if (!open && closeHovered === closeMe.current) closeHovered = null;
  }, [open]);
  useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(holdTimer.current);
      if (closeHovered === closeMe.current) closeHovered = null;
    },
    [],
  );

  // Focus moves once the panel is shown or hidden, never before.
  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    moveFocus(target);
  }, [open]);

  // A press outside, Escape wherever focus is (a panel the pointer opened, or one opened by a click that did not
  // focus the opener, as in Safari, has no focus inside it) and focus moving anywhere outside close it while it is the
  // top layer (dismiss.ts); Escape with focus inside, on the opener or an item, puts focus back on the opener.
  const dismiss = useDismiss({ open, root: anchor, onClose: (back) => setOpen(false, back ? 'opener' : null), blur: true });

  const onOpenerClick = (e: MouseEvent<HTMLElement>) => {
    openerProps.onClick?.(e);
    if (e.defaultPrevented) return;
    window.clearTimeout(hoverTimer.current);
    // A click on a panel the pointer opened leaves it open: the click was only following the hover.
    if (open && byHover.current) return;
    // Opened from the keyboard (Enter or Space make a click with no count) focus goes to the first item; opened by a
    // press, to the menu itself, so no item looks chosen and the arrows still start from the top.
    if (open) setOpen(false);
    else setOpen(true, purpose === 'actions' ? (e.detail === 0 ? 'first' : 'panel') : null);
  };

  const onOpenerKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    openerProps.onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true, e.key === 'ArrowDown' ? 'first' : 'last');
    }
  };

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (menuKeys(e, panel.current)) return;
    // Tab leaves a menu, from a submenu too.
    if (e.key === 'Tab' && purpose === 'actions') setOpen(false);
  };

  // ---- a right-click menu: the area, and the point the panel hangs from ----

  /** Puts the point the panel hangs from at a place in the window, and opens the panel there (or moves it there). */
  const openAt = (x: number, y: number, focus: FocusTarget) => {
    const box = anchor.current?.getBoundingClientRect();
    const spot = point.current;
    if (!box || !spot) return;
    spot.style.left = `${x - box.left}px`;
    spot.style.top = `${y - box.top}px`;
    if (!isOpen.current) {
      const active = document.activeElement;
      returnTo.current = active instanceof HTMLElement && active !== document.body ? active : null;
    }
    const moving = isOpen.current;
    setOpen(true, focus);
    if (moving) place.update();
  };

  const inPanel = (target: EventTarget | null) => target instanceof Node && Boolean(panel.current?.contains(target));

  const onAreaContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    if (e.defaultPrevented) return;
    e.preventDefault();
    // A right click on the menu itself shows nothing; the menu a key opened stays where the key placed it.
    if (inPanel(e.target)) return;
    if (byKey.current && isOpen.current) {
      byKey.current = false;
      return;
    }
    window.clearTimeout(holdTimer.current);
    openAt(e.clientX, e.clientY, 'panel');
  };

  // A finger held still on the area opens the menu where it is; lifting it or scrolling first opens nothing.
  const onAreaPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch' || inPanel(e.target) || !anchor.current) return;
    window.clearTimeout(holdTimer.current);
    const { clientX, clientY } = e;
    holdTimer.current = window.setTimeout(() => openAt(clientX, clientY, 'panel'), motionMs(anchor.current, 'hold-delay'));
  };
  const stopHold = () => window.clearTimeout(holdTimer.current);

  const onAreaKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    dismiss.onKeyDown(e);
    if (e.defaultPrevented || !menuKey(e) || inPanel(e.target)) return;
    e.preventDefault();
    // Opened from the keyboard: beside the element that has focus, on the first item.
    const at = (e.target as Element).getBoundingClientRect();
    byKey.current = true;
    openAt(at.left, at.bottom, 'first');
  };

  const chosen = () => setOpen(false, purpose === 'actions' ? 'opener' : null);

  const standOff = useContext(DropdownStandOff) ?? undefined;
  const place = useFloating({ target: atPointer ? point : anchor, layer, panel, open, align: align === 'end' ? 'end' : 'start', standOff });
  useGlide(panel, GLIDE);
  const bar = useScrollbar(panel);

  const layered = (
    <div ref={layer} className={dropdown.part('layer')}>
      <div
        ref={panel}
        id={panelId}
        role={panelRole(purpose)}
        aria-label={label}
        className={cx(dropdown({ size, align }), className)}
        tabIndex={-1}
        {...bar}
        {...rest}
        hidden={!open}
        data-side={place.side ?? undefined}
        onKeyDown={onPanelKeyDown}
      >
        <Context.Provider value={{ purpose, managed: true, chosen, shown: open, size, submenu }}>{grouped(children, id)}</Context.Provider>
      </div>
    </div>
  );

  if (atPointer) {
    return (
      <div
        ref={anchor}
        className={dropdown.part('area')}
        onBlur={dismiss.onBlur}
        onKeyDown={onAreaKeyDown}
        onContextMenu={onAreaContextMenu}
        onPointerDown={onAreaPointerDown}
        onPointerUp={stopHold}
        onPointerCancel={stopHold}
      >
        {area}
        <span ref={point} className={dropdown.part('point')} aria-hidden="true" />
        {layered}
      </div>
    );
  }

  const opener = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    id: openerId,
    'aria-haspopup': purpose === 'actions' ? 'menu' : undefined,
    'aria-expanded': open,
    'aria-controls': panelId,
    onClick: onOpenerClick,
    onKeyDown: onOpenerKeyDown,
  });

  return (
    <div
      ref={anchor}
      className={dropdown.part('anchor')}
      {...dismiss}
      onPointerEnter={openOnHover ? onPointerEnter : undefined}
      onPointerLeave={openOnHover ? onPointerLeave : undefined}
    >
      {opener}
      {layered}
    </div>
  );
}

export interface DropdownLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** A short heading over a group of items. The dropdown groups it with the items after it and names the group by it. */
export function DropdownLabel({ className, children, ...rest }: DropdownLabelProps) {
  return (
    <div role="presentation" className={cx(dropdown.part('label'), className)} {...rest}>
      {children}
    </div>
  );
}

/** What an item draws, in Figma's order: the checkbox, the leading icon, the label, the trailing icon (or the tick of a
 * single choice), the key hint, and a submenu's caret. */
function itemInner({ ticks, checked, icon, trailingIcon, kbd, caret, children }: { ticks: boolean; checked?: boolean; icon?: string; trailingIcon?: string; kbd?: string; caret?: boolean; children: ReactNode }) {
  return (
    <>
      {ticks && (
        <span className={`${checkbox({ size: 'sm' })} ${dropdown.part('checkbox')}`} aria-hidden="true">
          <span className={cx(checkbox.part('box'), checked ? `${checkbox.part('box')}--checked` : '')}>
            <Icon name="Check" className={checkbox.part('icon')} />
          </span>
        </span>
      )}
      {icon && <Icon name={icon} className={dropdown.part('icon')} />}
      <span className={dropdown.part('text')}>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} className={dropdown.part('icon')} />}
      {kbd && (
        <Kbd size="sm" aria-hidden="true">
          {kbd}
        </Kbd>
      )}
      {caret && <Icon name="CaretRight" className={dropdown.part('icon')} />}
    </>
  );
}

interface DropdownItemCommon {
  /** Phosphor icon name before the label. */
  icon?: string;
  /** Phosphor icon name after the label. */
  trailingIcon?: string;
  /** Keyboard hint drawn as a keycap after the label, keys apart by a space ("⌘ X"). Only a hint: the page wires the
   * shortcut. Screen readers get it as the item's aria-keyshortcuts, not as part of its name. */
  kbd?: string;
  /** The destructive action of the menu. Figma: Type=Danger. */
  danger?: boolean;
  /** Makes the item tick: true or false draws the checkbox's box, ticked or not. Figma: the Checkbox boolean. */
  checked?: boolean;
  /** Called with the new value when a ticking item is pressed. The dropdown stays open. */
  onCheckedChange?: (checked: boolean) => void;
  /** Makes the item one of a single choice: true for the chosen one, which draws a tick after its label (Figma: the
   * Trailing Icon tick), false for the others. Pressing it calls onClick and closes the dropdown. */
  selected?: boolean;
  className?: string;
  children: ReactNode;
}

export type DropdownItemProps = DropdownItemCommon &
  (
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>)
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'>)
  );

/** The role of an item in a menu: a plain item, a ticking one, or one of a single choice. */
const itemRole = (ticks: boolean, choice: boolean) => (choice ? 'menuitemradio' : ticks ? 'menuitemcheckbox' : 'menuitem');

/** One action in the menu, or one link when it has an address. */
export function DropdownItem(props: DropdownItemProps) {
  const { icon, trailingIcon, kbd, danger, checked, onCheckedChange, selected, className, children, ...rest } = props;
  const context = useContext(Context);
  const actions = (context?.purpose ?? 'actions') === 'actions';
  const ticks = checked !== undefined;
  const choice = !ticks && selected !== undefined;
  const classes = cx(ITEM, danger ? `${ITEM}--danger` : '', className);
  // In a managed menu the arrow keys move focus between items, so Tab skips them and leaves.
  const shared = {
    role: actions ? itemRole(ticks, choice) : undefined,
    'aria-checked': actions && (ticks || choice) ? (ticks ? checked : selected) : undefined,
    'aria-keyshortcuts': kbd ? keyShortcut(kbd) : undefined,
    tabIndex: actions && context?.managed ? -1 : undefined,
    className: classes,
  };
  // A ticking item toggles and keeps the dropdown open; any other item is a choice that closes it.
  const done = () => (ticks ? onCheckedChange?.(!checked) : context?.chosen());
  const inner = itemInner({ ticks, checked, icon, trailingIcon: choice ? (selected ? 'Check' : undefined) : trailingIcon, kbd, children });
  if (rest.href !== undefined) {
    const { onClick, ...link } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...shared} {...link} onClick={(e) => { onClick?.(e); done(); }}>
        {inner}
      </a>
    );
  }
  const { onClick, type, href: _href, disabled, ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
  // A disabled action in a menu stays where focus can reach it, so its existence is announced: it is marked
  // aria-disabled, not disabled, and a press does nothing. Outside a menu it is a disabled button.
  const reachable = Boolean(disabled) && actions;
  return (
    <button
      type={type ?? 'button'}
      {...shared}
      {...button}
      disabled={reachable ? undefined : disabled}
      aria-disabled={reachable ? true : button['aria-disabled']}
      onClick={(e) => {
        if (reachable) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
        done();
      }}
    >
      {inner}
    </button>
  );
}

export interface DropdownSubmenuProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'onClick'> {
  /** The item's words, which also name the second menu. */
  label: ReactNode;
  /** Phosphor icon name before the label. */
  icon?: string;
  /** The second menu's items, labels and dividers. */
  children: ReactNode;
  /** Controlled open state of the second menu. */
  open?: boolean;
  /** The first state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new state whenever the second menu opens or closes itself. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** An item that opens a second menu beside it (Figma: DropdownItem's Submenu switch, a caret at its end). See the header. */
export function DropdownSubmenu({ label, icon, children, open: controlled, defaultOpen = false, onOpenChange, className, disabled, onKeyDown, ...rest }: DropdownSubmenuProps) {
  const id = useId();
  const itemId = `${id}-item`;
  const panelId = `${id}-panel`;
  const parent = useContext(Context);
  const purpose = parent?.purpose ?? 'actions';
  const [open, keepOpen] = useControllable({ value: controlled, defaultValue: defaultOpen, onChange: onOpenChange, name: 'Dropdown submenu open' });
  const item = useRef<HTMLButtonElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<'first' | 'item' | null>(null);
  const isOpen = useRef(open);
  isOpen.current = open;
  const hoverTimer = useRef(0);
  const submenu = useRef<OpenSubmenu>({ close: null }).current;
  const menuKeys = useMenuKeys();

  const close = useRef(() => {});
  const setOpen = (next: boolean, focus: 'first' | 'item' | null = null) => {
    window.clearTimeout(hoverTimer.current);
    if (next && parent) {
      // One submenu of a panel shows at a time.
      if (parent.submenu.close && parent.submenu.close !== close.current) parent.submenu.close();
      parent.submenu.close = close.current;
    }
    if (next === isOpen.current) {
      if (focus === 'first') focusItem(panel.current, 'first');
      else if (focus === 'item') item.current?.focus();
      return;
    }
    isOpen.current = next;
    pendingFocus.current = focus;
    keepOpen(next);
  };
  // Closing from elsewhere (another submenu opening): focus inside goes back to this item.
  close.current = () => setOpen(false, panel.current?.contains(document.activeElement) ? 'item' : null);

  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target === 'first') focusItem(panel.current, 'first');
    else if (target === 'item') item.current?.focus();
    if (!open && parent?.submenu.close === close.current) parent.submenu.close = null;
  }, [open]);

  // It closes with the panel it opened from.
  const shown = parent?.shown ?? true;
  useEffect(() => {
    if (!shown && isOpen.current) setOpen(false);
  }, [shown]);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const reachable = Boolean(disabled) && purpose === 'actions';

  // A mouse resting on the item opens it; leaving the item and its menu closes it a moment later, unless it comes back.
  const onPointerEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !item.current) return;
    window.clearTimeout(hoverTimer.current);
    if (isOpen.current || disabled || !item.current.contains(e.target as Node)) return;
    hoverTimer.current = window.setTimeout(() => setOpen(true), motionMs(item.current, 'hover-open-delay'));
  };
  const onPointerLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !item.current) return;
    window.clearTimeout(hoverTimer.current);
    if (!isOpen.current) return;
    hoverTimer.current = window.setTimeout(() => close.current(), motionMs(item.current, 'hover-close-delay'));
  };

  const onItemClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (reachable) {
      e.preventDefault();
      return;
    }
    // From the keyboard (Enter or Space make a click with no count) focus goes to its first item; a press leaves it here.
    setOpen(true, e.detail === 0 ? 'first' : null);
  };

  const onItemKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.key !== 'ArrowRight' || disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setOpen(true, 'first');
  };

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || panelOf(e.target) !== panel.current) return;
    if (e.key === 'Escape' || e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false, 'item');
      return;
    }
    if (menuKeys(e, panel.current)) e.stopPropagation();
  };

  // Choosing an item in it closes the whole dropdown; in a panel nobody manages, it closes this menu at least.
  const chosen = () => {
    setOpen(false);
    parent?.chosen();
  };

  const { side } = useFloating({ target: item, layer, panel, open, side: 'right', align: 'start', nested: true });
  useGlide(panel, GLIDE);
  const bar = useScrollbar(panel);

  return (
    <div className={cx(dropdown.part('submenu'), className)} role="none" onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <button
        ref={item}
        type="button"
        id={itemId}
        role={purpose === 'actions' ? 'menuitem' : undefined}
        aria-haspopup={purpose === 'actions' ? 'menu' : 'true'}
        aria-expanded={open}
        aria-controls={panelId}
        tabIndex={purpose === 'actions' && parent?.managed ? -1 : undefined}
        className={ITEM}
        {...rest}
        disabled={reachable ? undefined : disabled}
        aria-disabled={reachable ? true : rest['aria-disabled']}
        onClick={onItemClick}
        onKeyDown={onItemKeyDown}
      >
        {itemInner({ ticks: false, icon, caret: true, children: label })}
      </button>
      <div ref={layer} className={dropdown.part('layer')}>
        <div
          ref={panel}
          id={panelId}
          role={panelRole(purpose)}
          aria-labelledby={itemId}
          className={dropdown({ size: parent?.size })}
          tabIndex={-1}
          {...bar}
          hidden={!open}
          data-side={side ?? undefined}
          onKeyDown={onPanelKeyDown}
        >
          <Context.Provider value={{ purpose, managed: parent?.managed ?? false, chosen, shown: open, size: parent?.size, submenu }}>{grouped(children, id)}</Context.Provider>
        </div>
      </div>
    </div>
  );
}

/** A line between groups of items. */
export function DropdownDivider() {
  return <Divider role="separator" className={dropdown.part('divider')} />;
}

