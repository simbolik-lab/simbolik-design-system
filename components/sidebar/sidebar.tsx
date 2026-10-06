import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type FocusEvent, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { flushSync } from 'react-dom';
import { dropdown } from '../dropdown/dropdown.manifest.js';
import { sidebar } from './sidebar.manifest.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { Icon } from '../icon/icon.js';
import { Logo, type LogoProps } from '../logo/logo.js';
import { logo as logoClasses } from '../logo/logo.manifest.js';
import type { VariantProps } from '../variants.js';

export interface SidebarChild {
  label: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
}

export interface SidebarItem extends SidebarChild {
  /** Phosphor icon name. Shown alone when collapsed, so every item needs one. */
  icon: string;
  /** Links under this one. The item then opens them instead of going to its address. */
  children?: SidebarChild[];
  /** Start with the children shown. Defaults to open when a child is active. */
  open?: boolean;
}

export interface SidebarGroup {
  /** The heading over the group. A group without one is a plain list. */
  label?: string;
  items: SidebarItem[];
}

/** A motion token's value where an element sits: a duration in milliseconds, or an easing as written. */
function motionMs(element: Element, name: string): number {
  const value = getComputedStyle(element).getPropertyValue(`--smbk-motion-${name}`).trim();
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount)) return 0;
  return value.endsWith('ms') ? amount : amount * 1000;
}
function motionEasing(element: Element, purpose: string): string {
  return getComputedStyle(element).getPropertyValue(`--smbk-motion-${purpose}-easing`).trim() || 'linear';
}

export interface FoldingOptions {
  /** Called once a glide has landed, straight after the panel loses `data-folding`. */
  onLand?: () => void;
}

/**
 * The sidebar's width glides when its own button collapses or expands it: measured before and
 * after, and run with the enter purpose both ways (it answers the press at once and settles), while
 * `data-folding` tells the stylesheet what to do with the parts that come and go (sidebar.css).
 * Anything else that changes the state, such as a page restoring it from storage, lands at once,
 * and nothing moves under reduced motion. Returns the function to call just before a change that
 * should glide.
 */
function useFolding(root: RefObject<HTMLElement | null>, collapsed: boolean, options: FoldingOptions = {}) {
  // The width it had when its button was pressed, until the change it asked for arrives.
  const from = useRef<number | null>(null);
  const running = useRef<Animation | null>(null);
  const latest = useRef(options);
  latest.current = options;

  const pressed = () => {
    const element = root.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    from.current = element.getBoundingClientRect().width;
    // A change that never comes (a parent that keeps the state) must not be mistaken for a later one.
    window.requestAnimationFrame(() => {
      from.current = null;
    });
  };

  useLayoutEffect(() => {
    const element = root.current;
    const start = from.current;
    from.current = null;
    if (!element || start === null) return;
    running.current?.cancel();
    const opening = !collapsed;
    // Marked before measuring, so the parts that come back take their starting style from it.
    element.setAttribute('data-folding', opening ? 'opening' : 'closing');
    const end = element.getBoundingClientRect().width;
    const glide = element.animate([{ width: `${start}px` }, { width: `${end}px` }], {
      duration: motionMs(element, 'enter-duration'),
      easing: motionEasing(element, 'enter'),
    });
    running.current = glide;
    // The mark stays until the glide and the parts rising in have all landed. Closing, the parts
    // the column centres (the collapse button, the search button, the avatar) held their places
    // meanwhile; they then glide the last few pixels into the centre with the state purpose.
    const rising = element.getAnimations({ subtree: true }).filter((animation) => animation !== glide && animation instanceof CSSTransition && (animation.transitionProperty === 'opacity' || animation.transitionProperty === 'translate'));
    const land = () => {
      if (running.current !== glide) return;
      const settling = opening ? [] : [...element.querySelectorAll<HTMLElement>(`:scope > .${sidebar.part('search')} > *, :scope > .${sidebar.part('footer')} > *`)];
      const before = settling.map((part) => part.getBoundingClientRect().left);
      element.removeAttribute('data-folding');
      settling.forEach((part, i) => {
        const shift = (before[i] ?? 0) - part.getBoundingClientRect().left;
        if (Math.abs(shift) < 0.5 || !part.getClientRects().length) return;
        part.animate([{ translate: `${shift}px 0` }, { translate: '0 0' }], {
          duration: motionMs(element, 'state-duration'),
          easing: motionEasing(element, 'state'),
        });
      });
      latest.current.onLand?.();
    };
    // Cancelled by another press, which has marked it again, or by leaving the page: land either way.
    Promise.all([glide, ...rising].map((animation) => animation.finished)).then(land, land);
  }, [collapsed, root]);

  return pressed;
}

/**
 * Closes the one collapsed-group flyout that is open, if any: only one shows at a time, as with
 * the dropdown. Called with true when another flyout takes its place, so it goes at once.
 */
let closeOpenFlyout: ((instant?: boolean) => void) | null = null;

/**
 * An item with children while the sidebar is collapsed to its column of icons: pressing it,
 * pointing at it or focusing it opens its children in a flyout beside the column, a panel drawn
 * with the dropdown's own look, headed by the item's name. It is never hover-only. The pointer
 * has a moment to cross the gap; moving focus out of it, pressing elsewhere or Escape closes it,
 * and Escape hands focus back to the item. The panel is placed from the item's position and
 * kept inside the window, scrolling when its list is longer than the window. Only one flyout
 * shows at a time: opening one closes the one before at once, so moving along the column
 * never leaves the previous item's children showing while its close delay runs. The first
 * flyout eases in and the last eases out with the motion tokens; a swap from one to the next
 * does neither, both panels marked `data-swap` for that moment, so the column answers as
 * fast as the pointer moves along it.
 */
function CollapsedGroup({ item }: { item: SidebarItem }) {
  const [open, setOpen] = useState(false);
  const group = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const refocusing = useRef(false);
  const id = useId();
  const cls = sidebar.part('item');

  const place = useCallback(() => {
    const b = opener.current;
    const p = panel.current;
    const rail = group.current?.closest(`.${sidebar.part('panel')}`);
    if (!b || !p || !rail) return;
    // The gap to the column and to the window's edges is the panel's own margin, from the stylesheet.
    const gap = Number.parseFloat(getComputedStyle(p).marginLeft) || 0;
    p.style.left = `${rail.getBoundingClientRect().right}px`;
    p.style.maxHeight = `${window.innerHeight - 2 * gap}px`;
    let top = b.getBoundingClientRect().top;
    const height = p.offsetHeight;
    if (top + height > window.innerHeight - gap) top = window.innerHeight - gap - height;
    p.style.top = `${Math.max(gap, top)}px`;
  }, []);

  // A stable handle other groups call to close this one; instantly when another takes its place.
  const closeMe = useRef((instant?: boolean) => {
    window.clearTimeout(timer.current);
    if (instant && panel.current) panel.current.dataset.swap = '';
    setOpen(false);
  });

  const show = () => {
    window.clearTimeout(timer.current);
    const swapping = !!closeOpenFlyout && closeOpenFlyout !== closeMe.current;
    if (swapping) closeOpenFlyout!(true);
    closeOpenFlyout = closeMe.current;
    const p = panel.current;
    if (p) {
      if (swapping) {
        // Shown at once, then its own easing back for when it closes on its own.
        p.dataset.swap = '';
        requestAnimationFrame(() => requestAnimationFrame(() => delete p.dataset.swap));
      } else delete p.dataset.swap;
    }
    setOpen(true);
  };
  const hide = (refocus = false) => {
    window.clearTimeout(timer.current);
    setOpen(false);
    if (refocus) {
      refocusing.current = true;
      opener.current?.focus();
      refocusing.current = false;
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    place();
    const outside = (e: globalThis.PointerEvent) => {
      if (!group.current?.contains(e.target as Node)) hide();
    };
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('pointerdown', outside);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open, place]);

  // Once closed, it is no longer the open one; unmounting stops any wait.
  useEffect(() => {
    if (!open && closeOpenFlyout === closeMe.current) closeOpenFlyout = null;
  }, [open]);
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      if (closeOpenFlyout === closeMe.current) closeOpenFlyout = null;
    },
    [],
  );

  const holdsCurrent = item.active || item.children!.some((c) => c.active);
  return (
    <div
      ref={group}
      className={`${sidebar.part('group')} ${sidebar.part('group')}--flyout`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && show()}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return;
        window.clearTimeout(timer.current);
        // The pointer has the hover close delay to cross the gap to the flyout.
        timer.current = window.setTimeout(() => setOpen(false), group.current ? motionMs(group.current, 'hover-close-delay') : 0);
      }}
      onFocus={() => {
        if (!refocusing.current) show();
      }}
      onBlur={() => {
        // Decided a moment later, from where focus landed: some browsers report no target on a press.
        window.setTimeout(() => {
          if (!group.current?.contains(document.activeElement)) setOpen(false);
        }, 0);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          hide(true);
        }
      }}
    >
      <button
        ref={opener}
        type="button"
        className={cls}
        aria-expanded={open}
        aria-controls={id}
        // Holding the current page, the item is marked as an open group is when expanded (data-current, for the
        // stylesheet), and says so to assistive technology: among the column's items it is the current one,
        // aria-current="true" (ARIA's value for the current item in a set). Not "page": the button is not the
        // page, it opens the list that holds it, where the page's own link carries aria-current="page".
        data-current={holdsCurrent ? 'true' : undefined}
        aria-current={holdsCurrent ? 'true' : undefined}
        disabled={item.disabled}
        onClick={show}
      >
        <span className={sidebar.part('item-body')}>
          <Icon name={item.icon} className={sidebar.part('item-icon')} label={item.label} />
        </span>
      </button>
      <div ref={panel} id={id} className={`${dropdown.manifest.block} ${sidebar.part('flyout')}`} hidden={!open}>
        <p className={dropdown.part('label')}>{item.label}</p>
        <ul className={sidebar.part('flyout-list')}>
          {item.children!.map((child) => (
            <li key={child.href}>
              <a className={dropdown.part('item')} href={child.disabled ? undefined : child.href} aria-current={child.active ? 'page' : undefined} aria-disabled={child.disabled ? true : undefined}>
                <span className={dropdown.part('text')}>{child.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Item({ item, collapsed, named }: { item: SidebarItem; collapsed: boolean; named: boolean }) {
  if (collapsed && item.children?.length) return <CollapsedGroup item={item} />;
  const cls = sidebar.part('item');
  const body = (
    <span className={sidebar.part('item-body')}>
      <Icon name={item.icon} className={sidebar.part('item-icon')} label={collapsed || named ? item.label : undefined} />
      <span className={sidebar.part('item-label')}>{item.label}</span>
    </span>
  );
  if (item.children?.length) {
    return (
      <details className={sidebar.part('group')} open={item.open ?? item.children.some((c) => c.active)}>
        <summary className={cls} aria-disabled={item.disabled ? true : undefined}>
          {body}
          <Icon name="CaretDown" className={sidebar.part('item-caret')} />
        </summary>
        <ul className={sidebar.part('children')}>
          {item.children.map((child) => (
            <li key={child.href}>
              <a className={`${cls} ${cls}--child`} href={child.disabled ? undefined : child.href} aria-current={child.active ? 'page' : undefined} aria-disabled={child.disabled ? true : undefined}>
                <span className={sidebar.part('item-label')}>{child.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </details>
    );
  }
  return (
    <a className={cls} href={item.disabled ? undefined : item.href} aria-current={item.active ? 'page' : undefined} aria-disabled={item.disabled ? true : undefined}>
      {body}
    </a>
  );
}

/**
 * The groups, each with its label and items: the sidebar's navigation, whichever frame holds it.
 * Collapsed, an item with children opens a flyout. Named, the icons carry the labels as their names
 * while the markup stays the open panel's: for a panel that looks collapsed but opens in place,
 * whose items must stay the same elements so focus is not lost (the auto display at rest).
 */
function SidebarGroups({ groups, collapsed, named = collapsed }: { groups: SidebarGroup[]; collapsed: boolean; named?: boolean }) {
  return (
    <>
      {groups.map((group, i) => (
        <div key={i} className={sidebar.part('section')}>
          {group.label && (
            <h3 className={sidebar.part('group-label')}>
              <span className={sidebar.part('group-title')}>{group.label}</span>
            </h3>
          )}
          <ul className={sidebar.part('list')}>
            {group.items.map((item) => (
              <li key={item.href}>
                <Item item={item} collapsed={collapsed} named={named} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export interface SidebarNavProps {
  groups: SidebarGroup[];
  /** Accessible name of the navigation. */
  label?: string;
  className?: string;
}

/**
 * The sidebar's navigation on its own, without the panel: its groups, their labels and items, an item's
 * children folding under it, the current page marked, always expanded. For a drawer on a phone, where the
 * page's navigation has no column to sit in.
 *
 *   <Drawer position="left" title="Menu" …><SidebarNav label="Categories" groups={groups} /></Drawer>
 */
export function SidebarNav({ groups, label = 'Sidebar', className }: SidebarNavProps) {
  return (
    <nav aria-label={label} className={[sidebar.part('nav'), className].filter(Boolean).join(' ')}>
      <SidebarGroups groups={groups} collapsed={false} />
    </nav>
  );
}

export type SidebarDisplay = 'auto' | 'expanded' | 'collapsed';

export interface SidebarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>, Omit<VariantProps<typeof sidebar.manifest>, 'collapsed'> {
  /** The logo cell at the top. Figma: Logo, on by default. */
  logo?: boolean;
  /** Whose logo the cell shows. */
  brand?: LogoProps['brand'];
  /** A site's own logo for the cell, in place of the brand's: the logo's `shapes`, drawn whole when open and as its mark in the column. */
  logoShapes?: LogoProps['shapes'];
  /** Where the logo links to. */
  homeHref?: string;
  /** The search field shown when open. Figma: Search. */
  search?: ReactNode;
  /** Called when the column's search button is pressed. The button shows only when given. */
  onSearch?: () => void;
  groups: SidebarGroup[];
  /** The user's avatar. With the name, Figma's User Profile. */
  avatar?: ReactNode;
  userName?: ReactNode;
  userDetail?: ReactNode;
  /**
   * The foot button that steps the display, with its divider. Off, the sidebar stays in the display
   * it is given: a column kept closed as an application's parent navigation, beside a second
   * sidebar kept open for the current page's. Figma: Collapsable, on by default.
   */
  collapsible?: boolean;
  /** Called with the display the foot button steps to. Give `display` as well to keep it outside. */
  onDisplayChange?: (display: SidebarDisplay) => void;
  /** Accessible name of the panel and of the navigation in it: one name for the region and its navigation, so a page with a second aside never has two complementary regions that sound the same. */
  label?: string;
}

/** The foot button steps through the displays in this order. */
const NEXT: Record<SidebarDisplay, SidebarDisplay> = { auto: 'expanded', expanded: 'collapsed', collapsed: 'auto' };
/** Its name says what pressing it does. */
const STEP_NAME: Record<SidebarDisplay, string> = { auto: 'Keep sidebar open', expanded: 'Keep sidebar closed', collapsed: 'Open sidebar on hover' };

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Where a logo's mark is drawn now: the box around its mark shapes, moved or not. */
function markBox(svg: Element | null): DOMRect | null {
  const shapes = svg ? [...svg.querySelectorAll(`.${logoClasses.part('mark')}`)] : [];
  if (!shapes.length) return null;
  const boxes = shapes.map((shape) => shape.getBoundingClientRect());
  const left = Math.min(...boxes.map((b) => b.left));
  const top = Math.min(...boxes.map((b) => b.top));
  return new DOMRect(left, top, Math.max(...boxes.map((b) => b.right)) - left, Math.max(...boxes.map((b) => b.bottom)) - top);
}

/**
 * The logo turns from the mark alone into the whole logo and back as the panel folds, rather than
 * swapping: while it folds, the stylesheet shows the whole logo, and this glides it so its mark
 * starts (opening) or ends (closing) exactly where the lone mark is drawn, its words fading in or
 * out, with the enter motion the panel's width uses. The lone mark and the whole logo's mark are
 * the same shapes at the same size, so the hand-over at either end cannot be seen. `measure` is
 * called just before a fold, with the folding's own; `stop` once it has landed.
 */
function useLogoMorph(panel: RefObject<HTMLElement | null>, open: boolean) {
  const from = useRef<{ box: DOMRect; words: number } | null>(null);
  const running = useRef<Animation[]>([]);
  const parts = () => {
    const whole = panel.current?.querySelector(`.${sidebar.part('brand-logo')}`) ?? null;
    const mark = panel.current?.querySelector(`.${sidebar.part('brand-mark')}`) ?? null;
    return { whole, mark, words: whole ? [...whole.querySelectorAll<SVGElement>(`.${logoClasses.part('type')}`)] : [] };
  };
  const stop = () => {
    running.current.forEach((animation) => animation.cancel());
    running.current = [];
  };
  const measure = () => {
    const { whole, mark, words } = parts();
    const seen = [whole, mark].find((svg) => svg && getComputedStyle(svg).visibility === 'visible') ?? null;
    const box = markBox(seen);
    // Read before anything is stopped, so a fold that turns back mid-way starts from where the logo is.
    from.current = box ? { box, words: seen === whole && words[0] ? Number(getComputedStyle(words[0]).opacity) : 0 } : null;
    window.requestAnimationFrame(() => {
      from.current = null;
    });
  };
  // After the folding's own effect, which has marked the panel.
  useLayoutEffect(() => {
    const start = from.current;
    from.current = null;
    const element = panel.current;
    if (!start || !element?.hasAttribute('data-folding')) return;
    stop();
    const { whole, mark, words } = parts();
    const base = markBox(whole);
    const end = open ? base : markBox(mark);
    if (!whole || !base || !end) return;
    const at = (box: DOMRect) => `${box.left - base.left}px ${box.top - base.top}px`;
    const timing: KeyframeAnimationOptions = { duration: motionMs(element, 'enter-duration'), easing: motionEasing(element, 'enter'), fill: 'forwards' };
    running.current = [
      whole.animate([{ translate: at(start.box) }, { translate: at(end) }], timing),
      ...words.map((word) => word.animate([{ opacity: start.words }, { opacity: open ? 1 : 0 }], timing)),
    ];
    // panel is a ref; stop and parts read it when called.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return { measure, stop };
}

/**
 * Sidebar: a complementary panel holding a navigation landmark, with the logo at the top and the
 * collapse button at the foot, in three displays; auto is where it starts. In auto it is a column of icons that
 * opens over the page, without moving it, once the mouse has rested on it for the motion
 * tokens' hover open delay, and closes the hover close delay after the mouse leaves; keyboard
 * focus opens it at once and moving focus out closes it; a press on its items opens it and does
 * no more (a touch screen has no hover), and a press elsewhere closes it; Escape closes it until
 * the pointer or focus leaves. Its items keep the open panel's markup while it rests, so opening never swaps
 * the element that has focus. The foot button steps auto, kept open, kept closed, auto; without it
 * (`collapsible={false}`) the sidebar keeps the display it is given.
 *
 *   <Sidebar logoShapes={OUR_LOGO} homeHref="/" groups={groups} display={display} onDisplayChange={remember} />
 *   <Sidebar display="collapsed" collapsible={false} groups={apps} />
 */
export function Sidebar({ logo = true, brand = 'simbolik', logoShapes, homeHref = '/', search, onSearch, groups, avatar, userName, userDetail, display, open, collapsible = true, onDisplayChange, label = 'Sidebar', className, suppressHydrationWarning, ...rest }: SidebarProps) {
  const [internal, setInternal] = useState<SidebarDisplay>('auto');
  const current = display ?? internal;
  const [autoOpen, setAutoOpen] = useState(false);
  const shown = current === 'expanded' || (current === 'auto' && (open ?? autoOpen));
  const room = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  // The folding first: its effect marks the panel, which the morph's effect, declared after it, reads.
  const landed = useRef(() => {});
  const fold = useFolding(panel, !shown, { onLand: () => landed.current() });
  const morph = useLogoMorph(panel, shown);
  landed.current = morph.stop;
  // Just before a change that should glide: the panel's width, and the logo's mark.
  const pressed = () => {
    morph.measure();
    fold();
  };

  // What the handlers read, always the latest render's.
  const live = useRef({ current, autoOpen, forced: open !== undefined });
  live.current = { current, autoOpen, forced: open !== undefined };
  // Why the auto display should be open: the mouse resting on it, keyboard focus in it, a press
  // on it; and whether Escape has sent it away until the pointer or focus leaves.
  const why = useRef({ hover: false, focus: false, press: false, dismissed: false });
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const lastPointer = useRef('');

  /**
   * Opens or closes the auto display to match `why`, gliding as the collapse button does. Called
   * from a timer or a page-wide listener, it draws the change at once (`sync`), because the glide
   * is measured from this moment and a frame drawn in between would lose it.
   */
  const settle = (sync = false) => {
    const { current: now, autoOpen: isOpen, forced } = live.current;
    const w = why.current;
    const want = (w.hover || w.focus || w.press) && !w.dismissed;
    if (now !== 'auto' || forced || want === isOpen) return;
    pressed();
    live.current.autoOpen = want;
    if (sync) flushSync(() => setAutoOpen(want));
    else setAutoOpen(want);
  };

  const hoverSoon = () => {
    window.clearTimeout(closeTimer.current);
    if (why.current.hover || openTimer.current !== undefined || !room.current) return;
    openTimer.current = window.setTimeout(() => {
      openTimer.current = undefined;
      why.current.hover = true;
      settle(true);
    }, motionMs(room.current, 'hover-open-delay'));
  };

  const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !room.current) return;
    window.clearTimeout(openTimer.current);
    openTimer.current = undefined;
    closeTimer.current = window.setTimeout(() => {
      why.current.hover = false;
      if (!why.current.focus) why.current.dismissed = false;
      settle(true);
    }, motionMs(room.current, 'hover-close-delay'));
  };

  /**
   * A press on the resting column's items opens it and does nothing more. Opening moves the items
   * (an open group's children show), so the press must not act on whatever arrives under it: a
   * touch screen, which has no hover, taps once to open and again to choose. The logo, the search
   * button and the foot button do not move, so they act at once; a key press is never held back.
   */
  const onClickCapture = (e: MouseEvent) => {
    const { current: now, autoOpen: isOpen, forced } = live.current;
    if (now !== 'auto' || isOpen || forced || e.detail === 0) return;
    if (!(e.target as Element).closest(`.${sidebar.part('nav')}`)) return;
    e.preventDefault();
    e.stopPropagation();
    window.clearTimeout(openTimer.current);
    openTimer.current = undefined;
    // A mouse keeps it open while it rests there; any other press until a press elsewhere.
    if (lastPointer.current === 'mouse') why.current.hover = true;
    else why.current.press = true;
    why.current.dismissed = false;
    settle();
  };

  const onFocus = (e: FocusEvent) => {
    // Only keyboard focus opens it; a mouse press inside leaves it to the hover.
    why.current.focus = (e.target as Element).matches(':focus-visible');
    settle();
  };

  const onBlur = (e: FocusEvent) => {
    if (e.relatedTarget instanceof Node && room.current?.contains(e.relatedTarget)) return;
    why.current.focus = false;
    why.current.press = false;
    if (!why.current.hover) why.current.dismissed = false;
    settle();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || live.current.current !== 'auto' || !live.current.autoOpen) return;
    // A field's own Escape comes first.
    if ((e.target as Element).closest('input, textarea, select')) return;
    e.stopPropagation();
    why.current.dismissed = true;
    settle();
  };

  // Kept open from the open auto display, the panel is already open; the room widens under it instead.
  const roomFrom = useRef<number | null>(null);
  useLayoutEffect(() => {
    const element = room.current;
    const start = roomFrom.current;
    roomFrom.current = null;
    if (!element || start === null) return;
    const end = element.getBoundingClientRect().width;
    if (Math.abs(end - start) < 0.5) return;
    element.setAttribute('data-gliding', '');
    const glide = element.animate([{ width: `${start}px` }, { width: `${end}px` }], {
      duration: motionMs(element, 'enter-duration'),
      easing: motionEasing(element, 'enter'),
    });
    const land = () => element.removeAttribute('data-gliding');
    glide.finished.then(land, land);
  }, [current]);

  const step = (e: MouseEvent) => {
    const from = current;
    const to = NEXT[from];
    if (from === 'auto' && shown) {
      if (!reducedMotion() && room.current) roomFrom.current = room.current.getBoundingClientRect().width;
    } else if (from !== 'collapsed') {
      pressed();
    } else if (e.detail > 0) {
      // Back to auto by a pointer press: it stays a column until the pointer comes back, or it
      // would open under the very press that asked for auto.
      why.current.dismissed = true;
    }
    if (display === undefined) setInternal(to);
    onDisplayChange?.(to);
  };

  // Leaving auto forgets that it was open; coming back to it opens it if the pointer or focus asks.
  useEffect(() => {
    if (current === 'auto') settle();
    else if (live.current.autoOpen) {
      live.current.autoOpen = false;
      setAutoOpen(false);
    }
    // settle reads the latest state through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // A press outside closes a column that a press opened.
  useEffect(() => {
    if (current !== 'auto' || !autoOpen) return undefined;
    const outside = (e: globalThis.PointerEvent) => {
      if (!why.current.press || room.current?.contains(e.target as Node)) return;
      why.current.press = false;
      settle(true);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, autoOpen]);

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const part = sidebar.part;
  return (
    <div
      {...rest}
      ref={room}
      className={[sidebar({ display: current, collapsed: !shown, open: current === 'auto' && shown }), className].filter(Boolean).join(' ')}
      suppressHydrationWarning={suppressHydrationWarning}
      onPointerEnter={(e) => e.pointerType === 'mouse' && hoverSoon()}
      onPointerMove={(e) => e.pointerType === 'mouse' && hoverSoon()}
      onPointerLeave={onPointerLeave}
      onPointerDown={(e) => (lastPointer.current = e.pointerType)}
      onClickCapture={onClickCapture}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <aside ref={panel} aria-label={label} className={part('panel')}>
        {logo && (
          <>
            <div className={part('logo')}>
              <a className={part('brand')} href={homeHref}>
                <Logo brand={brand} shapes={logoShapes} form="logo" className={part('brand-logo')} />
                <Logo brand={brand} shapes={logoShapes} form="logomark" className={part('brand-mark')} />
              </a>
            </div>
            <Divider />
          </>
        )}
        {(search || onSearch) && (
          <div className={sidebar.part('search')}>
            {search && <div className={sidebar.part('search-field')}>{search}</div>}
            {onSearch && <Button tone="ghost" size="sm" icon="MagnifyingGlass" icon-only aria-label="Search" className={sidebar.part('search-button')} onClick={onSearch} />}
          </div>
        )}
        <nav aria-label={label} className={sidebar.part('nav')}>
          <SidebarGroups groups={groups} collapsed={current === 'collapsed'} named={!shown} />
        </nav>
        {(avatar || userName) && (
          <>
            <Divider />
            <div className={sidebar.part('footer')}>
              {avatar}
              <div className={sidebar.part('user')}>
                {userName && <span className={sidebar.part('user-name')}>{userName}</span>}
                {userDetail && <span className={sidebar.part('user-detail')}>{userDetail}</span>}
              </div>
            </div>
          </>
        )}
        {collapsible && (
          <>
            <Divider />
            <div className={part('foot')}>
              <Button tone="ghost" size="sm" icon="SidebarSimple" icon-only aria-label={STEP_NAME[current]} aria-expanded={shown} className={part('toggle')} onClick={step} />
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
