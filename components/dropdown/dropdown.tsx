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
 *     <DropdownDivider />
 *     <DropdownItem icon="Trash" danger onClick={remove}>Delete</DropdownItem>
 *   </Dropdown>
 *
 * Dropdown props:
 *   label         Accessible name of the list: the menu's for actions, the link group's for navigation.
 *   trigger       The opener: any element that renders one button and passes id, aria-*, onClick and
 *                 onKeyDown through to it (Button, NavItem, a plain <button>). The dropdown adds id (unless
 *                 it has one), aria-expanded, aria-controls, and for actions aria-haspopup="menu". Its own
 *                 onClick and onKeyDown run first; calling preventDefault in them stops the dropdown's.
 *   purpose       "actions" (default): commands. The panel is a menu, the items are menu items, Tab leaves.
 *                 "navigation": links to other pages. No menu roles; the links stay in the tab order.
 *   size          "default" or "small": the height of every item, the medium or the small control height.
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
 * A DropdownLabel starts a group: the dropdown puts it and the items after it, up to the next divider or
 * label, in one element with the group role, named by the label, so a screen reader says which group an
 * item is in. An item's key hint is drawn as a key cap hidden from screen readers and given to the item
 * as aria-keyshortcuts ("⌘ X" becomes "Meta+X"), so the item's name is its words alone.
 *
 * Keyboard (the WAI-ARIA menu button pattern):
 *   On the opener   Enter, Space or ArrowDown opens on the first item; ArrowUp opens on the last.
 *                   For navigation, Enter and Space open and close and focus stays on the opener.
 *   In the panel    ArrowDown and ArrowUp move between items and wrap; Home and End jump to the ends;
 *                   Escape closes and returns focus to the opener; Tab closes and moves on.
 *   Anywhere else   Escape closes it, as when the pointer opened it; focus stays where it is.
 *   A click or tap outside closes it, and so does focus moving anywhere outside.
 *
 * Movement belongs to the stylesheet: the panel drops in from the opener and fades, and does not move
 * under reduced motion. The wrapper holds no styling: the stylesheet draws everything.
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
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { dropdown } from './dropdown.manifest.js';
import { Icon } from '../icon/icon.js';
import { Kbd } from '../kbd/kbd.js';
import { checkbox } from '../checkbox/checkbox.manifest.js';
import { Divider } from '../divider/divider.js';
import type { VariantProps } from '../variants.js';

export type DropdownPurpose = 'actions' | 'navigation';

/** What an item needs to know about the dropdown around it. */
interface DropdownContext {
  purpose: DropdownPurpose;
  /** True when the dropdown draws its own opener and moves focus between items itself. */
  managed: boolean;
  /** An item was chosen. */
  chosen: () => void;
}

const Context = createContext<DropdownContext | null>(null);

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof dropdown.manifest> {
  /** Accessible name of the list, e.g. "Row actions" or "Services". */
  label: string;
  children: ReactNode;
  /** The opener. When given, the dropdown draws it and opens the panel under it. */
  trigger?: ReactElement;
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

/** Dropdown: the panel alone, or the panel with its opener when `trigger` is given. See the opener API above. */
export function Dropdown(props: DropdownProps) {
  return props.trigger ? <DropdownWithOpener {...props} trigger={props.trigger} /> : <DropdownPanel {...props} />;
}

const noop = () => {};

/** The panel alone. Opening, placing and keyboard movement belong to whoever shows it. */
function DropdownPanel({ label, size, align, trigger: _trigger, purpose = 'actions', open: _open, defaultOpen: _defaultOpen, onOpenChange: _onOpenChange, openOnHover: _openOnHover, className, children, ...rest }: DropdownProps) {
  const id = useId();
  return (
    <div role={panelRole(purpose)} aria-label={label} className={[dropdown({ size, align }), className].filter(Boolean).join(' ')} {...rest}>
      <Context.Provider value={{ purpose, managed: false, chosen: noop }}>{grouped(children, id)}</Context.Provider>
    </div>
  );
}

type FocusTarget = 'first' | 'last' | 'opener' | null;

/** A hover delay from the motion tokens, in milliseconds, read from the element's computed style. */
function hoverDelay(element: Element, which: 'open' | 'close'): number {
  const value = getComputedStyle(element).getPropertyValue(`--smbk-motion-hover-${which}-delay`).trim();
  const amount = parseFloat(value);
  if (!Number.isFinite(amount)) return 0;
  return value.endsWith('ms') ? amount : amount * 1000;
}

/** Closes the dropdown the pointer opened, if one is open, so a pointer moving along a bar never shows two. */
let closeHovered: (() => void) | null = null;

/** The opener and the panel hanging under it, with the menu button's keyboard and focus behaviour. */
function DropdownWithOpener({ label, size, align, trigger, purpose = 'actions', open: controlled, defaultOpen = false, onOpenChange, openOnHover = false, className, children, onKeyDown, ...rest }: DropdownProps & { trigger: ReactElement }) {
  const id = useId();
  const openerProps = trigger.props as { id?: string; onClick?: (e: MouseEvent<HTMLElement>) => void; onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void };
  const openerId = openerProps.id ?? `${id}-opener`;
  const panelId = `${id}-panel`;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const anchor = useRef<HTMLSpanElement>(null);
  const pendingFocus = useRef<FocusTarget>(null);
  // Hover: whether the pointer opened it (a press did not), the waiting timer, and the state as it is now,
  // for the timer to read when it fires.
  const byHover = useRef(false);
  const hoverTimer = useRef(0);
  const isOpen = useRef(open);
  isOpen.current = open;

  /** The items focus can land on, in order: disabled ones are skipped. */
  const items = (): HTMLElement[] => {
    const panel = document.getElementById(panelId);
    if (!panel) return [];
    return [...panel.querySelectorAll<HTMLElement>(`.${dropdown.part('item')}`)].filter((el) => !(el as HTMLButtonElement).disabled && el.getAttribute('aria-disabled') !== 'true');
  };

  const moveFocus = (target: FocusTarget) => {
    if (target === 'opener') document.getElementById(openerId)?.focus();
    else if (target) {
      const list = items();
      (target === 'first' ? list[0] : list[list.length - 1])?.focus();
    }
  };

  const setOpen = (next: boolean, focus: FocusTarget = null) => {
    if (!next) byHover.current = false;
    if (next === isOpen.current) {
      moveFocus(focus);
      return;
    }
    isOpen.current = next;
    pendingFocus.current = focus;
    if (controlled === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  // The pointer resting on the opener or the panel opens it; leaving both closes what the pointer opened.
  // Only a mouse hovers: touch and pen presses open it through the opener's click, as without hover.
  const closeThis = useRef(() => setOpen(false));
  closeThis.current = () => setOpen(false);
  const closeMe = useRef(() => closeThis.current());

  const onPointerEnter = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== 'mouse' || !anchor.current) return;
    window.clearTimeout(hoverTimer.current);
    if (isOpen.current) return;
    hoverTimer.current = window.setTimeout(() => {
      if (isOpen.current) return;
      if (closeHovered && closeHovered !== closeMe.current) closeHovered();
      closeHovered = closeMe.current;
      setOpen(true);
      byHover.current = true;
    }, hoverDelay(anchor.current, 'open'));
  };

  const onPointerLeave = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== 'mouse' || !anchor.current) return;
    window.clearTimeout(hoverTimer.current);
    if (!isOpen.current || !byHover.current) return;
    hoverTimer.current = window.setTimeout(() => setOpen(false), hoverDelay(anchor.current, 'close'));
  };

  // Once closed, it no longer counts as the one the pointer opened; unmounting stops any wait.
  useEffect(() => {
    if (!open && closeHovered === closeMe.current) closeHovered = null;
  }, [open]);
  useEffect(
    () => () => {
      window.clearTimeout(hoverTimer.current);
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

  // A click or tap anywhere outside closes it.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (anchor.current && !anchor.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  });

  // Escape closes it wherever focus is: a panel the pointer opened, or one opened by a click that did not focus
  // the opener (Safari), has no focus inside it. The opener and the panel handle Escape first and stop it; this
  // takes what reaches the page, and returns focus to the opener only if focus was inside.
  useEffect(() => {
    if (!open) return;
    const escape = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      setOpen(false, anchor.current?.contains(document.activeElement) ? 'opener' : null);
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  });

  const onOpenerClick = (e: MouseEvent<HTMLElement>) => {
    openerProps.onClick?.(e);
    if (e.defaultPrevented) return;
    window.clearTimeout(hoverTimer.current);
    // A click on a panel the pointer opened leaves it open: the click was only following the hover.
    if (open && byHover.current) return;
    if (open) setOpen(false);
    else setOpen(true, purpose === 'actions' ? 'first' : null);
  };

  const onOpenerKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    openerProps.onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true, e.key === 'ArrowDown' ? 'first' : 'last');
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    }
  };

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const list = items();
    const at = list.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => {
      e.preventDefault();
      list[(i + list.length) % list.length]?.focus();
    };
    if (e.key === 'ArrowDown') go(at + 1);
    else if (e.key === 'ArrowUp') go(at < 0 ? list.length - 1 : at - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(list.length - 1);
    else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false, 'opener');
    } else if (e.key === 'Tab' && purpose === 'actions') setOpen(false);
  };

  // Focus moving to anything outside closes it. A blur with nowhere to go is a click, handled above.
  const onBlur = (e: FocusEvent<HTMLSpanElement>) => {
    const next = e.relatedTarget as Node | null;
    if (open && next && anchor.current && !anchor.current.contains(next)) setOpen(false);
  };

  const opener = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    id: openerId,
    'aria-haspopup': purpose === 'actions' ? 'menu' : undefined,
    'aria-expanded': open,
    'aria-controls': panelId,
    onClick: onOpenerClick,
    onKeyDown: onOpenerKeyDown,
  });

  const chosen = () => setOpen(false, purpose === 'actions' ? 'opener' : null);

  return (
    <span
      ref={anchor}
      className={dropdown.part('anchor')}
      onBlur={onBlur}
      onPointerEnter={openOnHover ? onPointerEnter : undefined}
      onPointerLeave={openOnHover ? onPointerLeave : undefined}
    >
      {opener}
      <div
        id={panelId}
        role={panelRole(purpose)}
        aria-label={label}
        className={[dropdown({ size, align }), className].filter(Boolean).join(' ')}
        hidden={!open}
        onKeyDown={onPanelKeyDown}
        {...rest}
      >
        <Context.Provider value={{ purpose, managed: true, chosen }}>{grouped(children, id)}</Context.Provider>
      </div>
    </span>
  );
}

export interface DropdownLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** A short heading over a group of items. The dropdown groups it with the items after it and names the group by it. */
export function DropdownLabel({ className, children, ...rest }: DropdownLabelProps) {
  return (
    <div role="presentation" className={[dropdown.part('label'), className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

/** Key names as aria-keyshortcuts writes them, for the symbols and short words a key hint is written with. */
const KEY_NAMES: Record<string, string> = {
  '⌘': 'Meta', cmd: 'Meta', command: 'Meta', meta: 'Meta',
  '⌃': 'Control', ctrl: 'Control', control: 'Control',
  '⌥': 'Alt', opt: 'Alt', option: 'Alt', alt: 'Alt',
  '⇧': 'Shift', shift: 'Shift',
  '⌫': 'Backspace', backspace: 'Backspace', '⌦': 'Delete', del: 'Delete', delete: 'Delete',
  '↵': 'Enter', '⏎': 'Enter', '⌤': 'Enter', return: 'Enter', enter: 'Enter',
  '⎋': 'Escape', esc: 'Escape', escape: 'Escape', '⇥': 'Tab', tab: 'Tab', '␣': 'Space', space: 'Space',
  '↑': 'ArrowUp', '↓': 'ArrowDown', '←': 'ArrowLeft', '→': 'ArrowRight',
  '+': 'Plus',
};

/** A key hint as aria-keyshortcuts: keys apart by a space or a plus, as the key cap shows them. "⌘ X" is "Meta+X", "Ctrl+S" is "Control+S". */
function keyShortcut(hint: string): string {
  const keys = hint
    .trim()
    .split(/\s+/)
    .flatMap((part) => (part.length > 1 && part.includes('+') ? part.split(/\+(?=.)/) : [part]));
  return keys.map((k) => KEY_NAMES[k.toLowerCase()] ?? (k.length === 1 ? k.toUpperCase() : k)).join('+');
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
  className?: string;
  children: ReactNode;
}

export type DropdownItemProps = DropdownItemCommon &
  (
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>)
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'>)
  );

/** One action in the menu, or one link when it has an address. */
export function DropdownItem(props: DropdownItemProps) {
  const { icon, trailingIcon, kbd, danger, checked, onCheckedChange, className, children, ...rest } = props;
  const context = useContext(Context);
  const actions = (context?.purpose ?? 'actions') === 'actions';
  const ticks = checked !== undefined;
  const item = dropdown.part('item');
  const classes = [item, danger ? `${item}--danger` : '', className].filter(Boolean).join(' ');
  // In a managed menu the arrow keys move focus between items, so Tab skips them and leaves.
  const shared = {
    role: actions ? (ticks ? 'menuitemcheckbox' : 'menuitem') : undefined,
    'aria-checked': actions && ticks ? checked : undefined,
    'aria-keyshortcuts': kbd ? keyShortcut(kbd) : undefined,
    tabIndex: actions && context?.managed ? -1 : undefined,
    className: classes,
  };
  // A ticking item toggles and keeps the dropdown open; any other item is a choice that closes it.
  const done = () => (ticks ? onCheckedChange?.(!checked) : context?.chosen());
  // Figma's order: the checkbox, the leading icon, the label, the trailing icon, the key hint.
  const inner = (
    <>
      {ticks && (
        <span className={`${checkbox({ size: 'small' })} ${dropdown.part('checkbox')}`} aria-hidden="true">
          <span className={[checkbox.part('box'), checked ? `${checkbox.part('box')}--checked` : ''].filter(Boolean).join(' ')}>
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
    </>
  );
  if (rest.href !== undefined) {
    const { onClick, ...link } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...shared} {...link} onClick={(e) => { onClick?.(e); done(); }}>
        {inner}
      </a>
    );
  }
  const { onClick, type, href: _href, ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
  return (
    <button type={type ?? 'button'} {...shared} {...button} onClick={(e) => { onClick?.(e); done(); }}>
      {inner}
    </button>
  );
}

/** A line between groups of items. */
export function DropdownDivider() {
  return <Divider role="separator" className={dropdown.part('divider')} />;
}
