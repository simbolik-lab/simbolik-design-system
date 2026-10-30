'use client';

/**
 * Menubar: a row of menu titles, as at the top of a desktop app, each opening a dropdown menu.
 *
 *   <Menubar label="Editor">
 *     <MenubarMenu label="File">
 *       <DropdownItem icon="Plus" kbd="⌘ N" onClick={create}>New file</DropdownItem>
 *       <DropdownItem icon="FolderSimple" kbd="⌘ O" onClick={open}>Open</DropdownItem>
 *       <DropdownDivider />
 *       <DropdownItem icon="Trash" danger onClick={remove}>Move to trash</DropdownItem>
 *     </MenubarMenu>
 *     <MenubarMenu label="Edit">…</MenubarMenu>
 *   </Menubar>
 *
 * Menubar props:
 *   label         Accessible name of the bar ("Editor").
 *   open          The label of the menu that shows, or null for none: the page holds it. Pair it with onOpenChange.
 *   defaultOpen   The menu that shows first when the bar holds it.
 *   onOpenChange  Called with the label of the menu that now shows, or null, whenever the bar opens or closes one.
 *   Other props (className, data-*) go to the bar.
 *
 * MenubarMenu takes `label`, the title's words and the menu's name, and the menu's items as its children: the
 * dropdown's items, labels, dividers and submenus (DropdownItem, DropdownLabel, DropdownDivider, DropdownSubmenu), so
 * single choice, ticking items and key hints work as in the dropdown. Choosing an item closes the menu and puts focus
 * back on its title.
 *
 * Keyboard (the WAI-ARIA menubar pattern): the bar is one Tab stop, the title last focused.
 *   On a title      ArrowRight and ArrowLeft move to the next and previous title, wrapping; Home and End to the first
 *                   and last. Enter, Space and ArrowDown open its menu on the first item; ArrowUp on the last.
 *   In a menu       The dropdown's keys (the arrows, Home, End, typed letters, Escape, Tab). ArrowRight and ArrowLeft
 *                   close it and open the next or previous title's menu on its first item, except that ArrowRight on
 *                   a submenu's item opens the submenu and ArrowLeft in a submenu closes it. Escape closes the menu
 *                   and puts focus back on its title.
 * Pointer: a press on a title opens its menu and another closes it; while a menu shows, the pointer moving onto
 * another title opens that one instead. A press outside closes it.
 *
 * Placing: each menu hangs below the bar, lined up with its title's start (the dropdown's placing, standing off from
 * the bar). The wrapper holds no styling: the stylesheet draws the bar, the button and dropdown stylesheets the rest.
 */
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { menubar } from './menubar.manifest.js';
import { Button } from '../button/button.js';
import { Dropdown, DropdownStandOff } from '../dropdown/dropdown.js';
import { dropdown } from '../dropdown/dropdown.manifest.js';
import { useControllable } from '../controllable.js';
import { cx } from '../variants.js';

/** What a menu needs to know about its bar. */
interface Bar {
  /** The label of the menu that shows, or null. */
  open: string | null;
  /** Opens a menu, or closes all with null; `first` puts focus on its first item once it shows. */
  show: (label: string | null, first?: boolean) => void;
  /** A menu opened or closed itself (a press, Escape, a choice, Tab, a press outside). */
  changed: (label: string, open: boolean) => void;
  /** The title that is the bar's Tab stop. */
  stop: string | null;
  setStop: (label: string) => void;
  /** The titles in order. */
  titles: string[];
  /** The menu that should put focus on its first item as it shows. */
  first: { current: string | null };
  /** The menu the pointer opened by moving onto its title, whose next press is only following the pointer. */
  hovered: { current: string | null };
}

const BarContext = createContext<Bar | null>(null);

export interface MenubarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** Accessible name of the bar. */
  label: string;
  /** The menus: MenubarMenu elements. */
  children: ReactNode;
  /** The label of the menu that shows, or null for none. The page holds it while it passes anything but undefined. */
  open?: string | null;
  /** The menu that shows first when the bar holds it. */
  defaultOpen?: string | null;
  /** Called with the label of the menu that now shows, or null. */
  onOpenChange?: (open: string | null) => void;
}

/** The labels of the bar's menus, in order. */
function titlesOf(children: ReactNode): string[] {
  return Children.toArray(children).flatMap((child) => (isValidElement(child) && child.type === MenubarMenu ? [(child.props as MenubarMenuProps).label] : []));
}

/** A row of menu titles, each opening a dropdown menu. See the header. */
export function Menubar({ label, children, open: controlled, defaultOpen = null, onOpenChange, className, ...rest }: MenubarProps) {
  const bar = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useControllable<string | null>({ value: controlled, defaultValue: defaultOpen, onChange: onOpenChange, name: 'Menubar open' });
  const titles = titlesOf(children);
  const [stop, setStop] = useState<string | null>(null);
  const first = useRef<string | null>(null);
  const hovered = useRef<string | null>(null);
  const current = useRef(open);
  current.current = open;

  const show = (next: string | null, focusFirst = false) => {
    first.current = focusFirst ? next : null;
    if (next !== null) setStop(next);
    if (next !== current.current) {
      current.current = next;
      setOpen(next);
    }
  };
  // A menu closing itself closes the bar's menu only if it is still the one that shows: moving to the next menu
  // closes the last one too, after the next is already open.
  const changed = (menu: string, isOpen: boolean) => {
    if (isOpen) show(menu);
    else if (current.current === menu) show(null);
    if (!isOpen && hovered.current === menu) hovered.current = null;
  };

  return (
    <div ref={bar} role="menubar" aria-label={label} className={cx(menubar({}), className)} {...rest}>
      <DropdownStandOff.Provider value={bar}>
        <BarContext.Provider value={{ open, show, changed, stop: stop ?? open ?? titles[0] ?? null, setStop, titles, first, hovered }}>{children}</BarContext.Provider>
      </DropdownStandOff.Provider>
    </div>
  );
}

export interface MenubarMenuProps {
  /** The title's words, which also name its menu ("File"). */
  label: string;
  /** The menu's items: the dropdown's items, labels, dividers and submenus. */
  children: ReactNode;
}

/** One title of the bar and its menu. */
export function MenubarMenu({ label, children }: MenubarMenuProps) {
  const bar = useContext(BarContext);
  const title = useRef<HTMLButtonElement>(null);
  const open = bar?.open === label;
  const titles = bar?.titles ?? [label];
  const at = titles.indexOf(label);

  /** The title `step` along the bar from this one, wrapping, or the first or last. */
  const neighbour = (step: number | 'first' | 'last') =>
    step === 'first' ? titles[0]! : step === 'last' ? titles[titles.length - 1]! : titles[(at + step + titles.length) % titles.length]!;
  /** The title element of another menu of the bar. */
  const titleOf = (name: string) => {
    const row = title.current?.closest(`.${menubar.manifest.block}`);
    return [...(row?.querySelectorAll<HTMLElement>(`.${menubar.part('item')}`) ?? [])].find((el) => el.textContent?.trim() === name) ?? null;
  };

  // Opened from the bar's keys onto this menu: focus goes to its first item once it shows (the dropdown's own effect
  // has run by then, and moved nothing).
  useEffect(() => {
    if (!open || !bar || bar.first.current !== label) return;
    bar.first.current = null;
    const panel = title.current?.parentElement?.querySelector<HTMLElement>(`.${dropdown.manifest.block}`);
    const items = [...(panel?.querySelectorAll<HTMLElement>(`.${dropdown.part('item')}`) ?? [])].filter((el) => el.closest(`.${dropdown.manifest.block}`) === panel && !(el as HTMLButtonElement).disabled);
    items[0]?.focus();
  }, [open]);

  if (!bar) return null;

  const onTitleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const to = e.key === 'ArrowRight' ? neighbour(1) : e.key === 'ArrowLeft' ? neighbour(-1) : e.key === 'Home' ? neighbour('first') : e.key === 'End' ? neighbour('last') : null;
    if (to === null) return;
    e.preventDefault();
    bar.setStop(to);
    titleOf(to)?.focus();
    // With a menu showing, the next one shows instead, focus staying on its title.
    if (bar.open !== null) bar.show(to);
  };

  // In the menu: the left and right arrows go to the neighbouring menu, on its first item. A submenu's item and a
  // submenu take them first and stop them, so they never get here.
  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    e.preventDefault();
    const to = neighbour(e.key === 'ArrowRight' ? 1 : -1);
    titleOf(to)?.focus({ preventScroll: true });
    bar.show(to, true);
  };

  // While a menu shows, the pointer moving onto another title shows that one; focus follows it if it was in the bar.
  const onTitlePointerEnter = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || bar.open === null || open) return;
    bar.hovered.current = label;
    if (title.current?.closest(`.${menubar.manifest.block}`)?.contains(document.activeElement)) title.current.focus({ preventScroll: true });
    bar.show(label);
  };

  // A press on a title the pointer just opened only follows the pointer: it leaves the menu open.
  const onTitleClick = (e: MouseEvent<HTMLElement>) => {
    if (bar.hovered.current === label && open) {
      bar.hovered.current = null;
      e.preventDefault();
    }
  };

  return (
    <Dropdown
      label={label}
      open={open}
      onOpenChange={(next) => bar.changed(label, next)}
      onKeyDown={onMenuKeyDown}
      trigger={
        <Button
          ref={title}
          tone="ghost"
          size="sm"
          role="menuitem"
          tabIndex={bar.stop === label ? 0 : -1}
          className={menubar.part('item')}
          onKeyDown={onTitleKeyDown}
          onClick={onTitleClick}
          onPointerEnter={onTitlePointerEnter}
          onFocus={() => bar.setStop(label)}
        >
          {label}
        </Button>
      }
    >
      {children}
    </Dropdown>
  );
}
