'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type FocusEvent, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { flushSync } from 'react-dom';
import { dropdown } from '../dropdown/dropdown.manifest.js';
import { sidebar } from './sidebar.manifest.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { Icon } from '../icon/icon.js';
import { Badge } from '../badge/badge.js';
import { StatusDot } from '../status-dot/status-dot.js';
import { Logo, type LogoProps } from '../logo/logo.js';
import { logo as logoClasses } from '../logo/logo.manifest.js';
import { useTip } from '../tooltip/tooltip.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { motionEasing, motionMs } from '../motion.js';
import { useControllable } from '../controllable.js';
import { useGlide } from '../glide.js';
import { useScrollbar } from '../scrollbar.js';
import { foldBack, settle, showsOpen, unfold, type Unfolding } from '../unfold.js';

export interface SidebarChild {
  label: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
  /** A count after the label, drawn as a small badge and read with the name: "Issues, 18". In the column of icons it joins the icon's name. */
  count?: number | string;
  /** A dot after the label saying something here changed; in the column it sits on the icon's corner. Read with the name in the words of `dotLabel`. */
  dot?: boolean;
  /** The dot's words, read after the label: "Inbox, new". Defaults to "changed". */
  dotLabel?: string;
}

/** What an item's count and dot add to its name, after its label: ", 18, changed". */
function marksWords(item: SidebarChild): string {
  const words: string[] = [];
  if (item.count !== undefined && item.count !== null && item.count !== '') words.push(String(item.count));
  if (item.dot) words.push(item.dotLabel ?? 'changed');
  return words.map((w) => `, ${w}`).join('');
}

/** The name an item's icon carries when the icon shows alone: the label, then its count and dot. */
const iconName = (item: SidebarChild) => item.label + marksWords(item);

/** The navigation's rows the pointer's fill glides between (glide.ts): every item, a parent's children with it. */
const NAV_GLIDE = { rows: `.${sidebar.part('item')}`, fill: sidebar.part('glide') };
/** A flyout is the dropdown's panel, so it glides as the dropdown does. */
const FLYOUT_GLIDE = { rows: `.${dropdown.part('item')}`, fill: dropdown.part('glide') };

/**
 * An item's count (the small badge) and dot (the status dot), drawn after its label. Both are pictures
 * only; their words are a line only a screen reader hears, so the name reads "Issues, 18, changed".
 * In the column the words and the count give way to the icon's name, and the dot moves onto the icon.
 */
function Marks({ item }: { item: SidebarChild }) {
  const words = marksWords(item);
  if (!words) return null;
  const counted = item.count !== undefined && item.count !== null && item.count !== '';
  return (
    <>
      <span className={sidebar.part('item-said')}>{words}</span>
      <span className={sidebar.part('item-marks')} aria-hidden="true">
        {counted && (
          <Badge size="sm" className={sidebar.part('item-count')} aria-hidden="true">
            {item.count}
          </Badge>
        )}
        {item.dot && <StatusDot tone="info" className={sidebar.part('item-dot')} aria-hidden="true" />}
      </span>
    </>
  );
}

export interface SidebarItem extends SidebarChild {
  /** Phosphor icon name. Shown alone when collapsed, so every item needs one. */
  icon: string;
  /** Links under this one. The item then opens them instead of going to its address. */
  children?: SidebarChild[];
  /** Start with the children shown. Defaults to open when a child is active. */
  open?: boolean;
}

/** The level of the groups' headings. */
type HeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface SidebarGroup {
  /** The heading over the group. A group without one is a plain list. */
  label?: string;
  items: SidebarItem[];
}

export interface FoldingOptions {
  /** Called once a glide has landed, straight after the panel loses `data-folding`. */
  onLand?: () => void;
}

/** What a group fades as it unfolds (unfold.ts): its children. */
const GROUP_UNFOLDING: Unfolding = { content: (group) => group.querySelector<HTMLElement>(`:scope > .${sidebar.part('children')}`) };

/**
 * A group's children unfold and fold back as an accordion's item does, moved by script the same in every browser
 * (unfold.ts): every press on a group's summary in the navigation is taken here, once the navigation is marked
 * data-motion, which sets the stylesheet's own motion, for markup written by hand, aside. A disabled group never opens.
 * A press the auto column holds back (it only opens the column) never reaches here.
 */
function useGroupMotion(nav: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = nav.current;
    if (!element) return undefined;
    element.dataset.motion = '';
    const press = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented) return;
      const summary = (event.target as Element).closest('summary');
      const group = summary?.parentElement;
      if (!summary || !(group instanceof HTMLDetailsElement) || !group.classList.contains(sidebar.part('group')) || summary !== group.querySelector(':scope > summary')) return;
      event.preventDefault();
      if (summary.getAttribute('aria-disabled') === 'true') return;
      if (showsOpen(group)) foldBack(group, GROUP_UNFOLDING);
      else unfold(group, GROUP_UNFOLDING);
    };
    element.addEventListener('click', press);
    return () => {
      element.removeEventListener('click', press);
      delete element.dataset.motion;
    };
  }, [nav]);
}

/** The parts the column folds away and the open panel unfolds: the group labels and the groups, open or not. */
const FOLDING_PARTS = `.${sidebar.part('group-label')}, details.${sidebar.part('group')}`;

/** A folding part's height, border box, and the padding over its content. */
interface PartSize {
  height: number;
  top: string;
}

const partSize = (part: HTMLElement): PartSize => ({ height: part.getBoundingClientRect().height, top: getComputedStyle(part).paddingTop });

/**
 * Where a folding part ends. An open group closing into the column keeps its children drawn while it folds (the
 * stylesheet), so it is not measured but ends at its summary's height, as the column draws it.
 */
function partEnd(part: HTMLElement, closing: boolean): PartSize {
  const summary = part instanceof HTMLDetailsElement && part.open && closing ? part.querySelector(':scope > summary') : null;
  return summary ? { height: summary.getBoundingClientRect().height, top: getComputedStyle(part).paddingTop } : partSize(part);
}

/**
 * The sidebar's width glides when its own button collapses or expands it: measured before and
 * after, and run with the fold purpose both ways (slow to leave and slow to land, so a press on the
 * way turns it round from where it is), while `data-folding` tells the stylesheet what to do with
 * the parts that come and go (sidebar.css). The parts the column hides, the group labels and an
 * open group's children, fold and unfold with it the same way, measured at both ends too, so they
 * move in every browser, not only one that can animate to a natural height, and the rows under them
 * move instead of jumping. Anything else that changes the state, such as a page restoring it from
 * storage, lands at once. Under reduced motion the width and the parts land at once, and only an
 * opening is marked, so the words that come back still fade in. Returns the function to call just
 * before a change that should glide.
 */
function useFolding(root: RefObject<HTMLElement | null>, collapsed: boolean, options: FoldingOptions = {}) {
  // The width and the parts' sizes when its button was pressed, until the change it asked for arrives.
  const from = useRef<{ width: number; parts: Map<HTMLElement, PartSize> } | null>(null);
  const running = useRef<Animation | null>(null);
  const folds = useRef<Animation[]>([]);
  const latest = useRef(options);
  latest.current = options;

  const pressed = () => {
    const element = root.current;
    if (!element) return;
    // A group still unfolding or folding back on its own lands first, where it was going.
    for (const group of element.querySelectorAll<HTMLDetailsElement>(`details.${sidebar.part('group')}`)) settle(group);
    // Read mid-motion as they are drawn now, so a press on the way turns them round from there.
    from.current = { width: element.getBoundingClientRect().width, parts: new Map([...element.querySelectorAll<HTMLElement>(FOLDING_PARTS)].map((part) => [part, partSize(part)])) };
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
    folds.current.forEach((fold) => fold.cancel());
    folds.current = [];
    const opening = !collapsed;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce && !opening) {
      running.current = null;
      element.removeAttribute('data-folding');
      latest.current.onLand?.();
      return;
    }
    // Marked before measuring, so the parts that come back take their starting style from it, and the parts' sizes
    // are read where they end (the stylesheet moves none of them while it is marked).
    element.setAttribute('data-folding', opening ? 'opening' : 'closing');
    const end = element.getBoundingClientRect().width;
    const timing: KeyframeAnimationOptions = { duration: reduce ? 0 : motionMs(element, 'fold-duration'), easing: motionEasing(element, 'fold') };
    const glide = element.animate([{ width: `${start.width}px` }, { width: `${end}px` }], timing);
    running.current = glide;
    // Each holds its last frame until the mark goes, so no part shows its resting size under the mark for a frame.
    folds.current = reduce
      ? []
      : [...start.parts].flatMap(([part, was]) => {
          if (!part.isConnected) return [];
          const now = partEnd(part, !opening);
          if (Math.abs(now.height - was.height) < 0.5) return [];
          return [part.animate([{ boxSizing: 'border-box', height: `${was.height}px`, paddingTop: was.top }, { boxSizing: 'border-box', height: `${now.height}px`, paddingTop: now.top }], { ...timing, fill: 'forwards' })];
        });
    const moved = folds.current;
    // The mark stays until the glide and the parts rising in have all landed. Closing, the parts
    // the column centres (the collapse button, the search button, the avatar) held their places
    // meanwhile; they then glide the last few pixels into the centre with the state purpose.
    const rising = element.getAnimations({ subtree: true }).filter((animation) => animation !== glide && animation instanceof CSSTransition && (animation.transitionProperty === 'opacity' || animation.transitionProperty === 'translate'));
    const land = () => {
      if (running.current !== glide) return;
      const settling = opening ? [] : [...element.querySelectorAll<HTMLElement>(`:scope > .${sidebar.part('search')} > *, :scope > .${sidebar.part('footer')} > *`)];
      const before = settling.map((part) => part.getBoundingClientRect().left);
      element.removeAttribute('data-folding');
      moved.forEach((fold) => fold.cancel());
      folds.current = [];
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
    // Cancelled by another press, which has marked it again, or by leaving the page: land either way. A part's motion
    // replaced by the next one settles at once, so the mark waits for every one of them, not the first to settle. A
    // word's fade on a row the fold has clipped away may never report its end (WebKit and Firefox, an open group's
    // children folding into the column), so the fades are waited for no longer than they last.
    const settledAll = (motions: Animation[]) => Promise.allSettled(motions.map((motion) => motion.finished));
    const longest = Math.max(0, ...rising.map((motion) => Number(motion.effect?.getComputedTiming().endTime ?? 0) - Number(motion.currentTime ?? 0)));
    void Promise.all([settledAll([glide, ...moved]), Promise.race([settledAll(rising), new Promise((done) => window.setTimeout(done, longest))])]).then(land);
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
function CollapsedGroup({ item, small }: { item: SidebarItem; small: boolean }) {
  const [open, setOpen] = useState(false);
  const group = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const refocusing = useRef(false);
  const id = useId();
  const cls = sidebar.part('item');
  useGlide(panel, FLYOUT_GLIDE);
  const bar = useScrollbar(panel);

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
          <Icon name={item.icon} className={sidebar.part('item-icon')} label={iconName(item)} />
          {item.dot && <StatusDot tone="info" className={sidebar.part('item-dot')} aria-hidden="true" />}
        </span>
      </button>
      <div ref={panel} id={id} className={`${dropdown({ size: small ? 'sm' : 'md' })} ${sidebar.part('flyout')}`} hidden={!open} {...bar}>
        <p className={dropdown.part('label')}>{item.label}</p>
        <ul className={sidebar.part('flyout-list')}>
          {item.children!.map((child) => (
            <li key={child.href}>
              <a className={dropdown.part('item')} href={child.disabled ? undefined : child.href} aria-current={child.active ? 'page' : undefined} aria-disabled={child.disabled ? true : undefined}>
                <span className={dropdown.part('text')}>{child.label}</span>
                <Marks item={child} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * An item without children while the sidebar is kept closed: its icon alone shows, so its name shows in a tooltip
 * beside the column while it is pointed at or has keyboard focus (the tooltip's own behaviour: it stays while
 * pointed at, Escape dismisses it). The name stays the icon's accessible name; the tooltip only shows it.
 */
function ClosedItem({ item }: { item: SidebarItem }) {
  const { targetRef, hoverProps, focusProps, tip } = useTip({ text: item.label, arrow: 'left', inverse: true, purpose: 'name' });
  return (
    <>
      <a
        ref={targetRef as RefObject<HTMLAnchorElement>}
        className={sidebar.part('item')}
        href={item.disabled ? undefined : item.href}
        aria-current={item.active ? 'page' : undefined}
        aria-disabled={item.disabled ? true : undefined}
        {...hoverProps}
        {...focusProps}
      >
        <span className={sidebar.part('item-body')}>
          <Icon name={item.icon} className={sidebar.part('item-icon')} label={iconName(item)} />
          <span className={sidebar.part('item-label')} data-label={item.label}>{item.label}</span>
          <Marks item={item} />
        </span>
      </a>
      {tip}
    </>
  );
}

function Item({ item, collapsed, named, small }: { item: SidebarItem; collapsed: boolean; named: boolean; small: boolean }) {
  if (collapsed && item.children?.length) return <CollapsedGroup item={item} small={small} />;
  if (collapsed) return <ClosedItem item={item} />;
  const cls = sidebar.part('item');
  const body = (
    <span className={sidebar.part('item-body')}>
      <Icon name={item.icon} className={sidebar.part('item-icon')} label={collapsed || named ? iconName(item) : undefined} />
      <span className={sidebar.part('item-label')} data-label={item.label}>{item.label}</span>
      <Marks item={item} />
    </span>
  );
  if (item.children?.length) {
    const holdsCurrent = item.active || item.children.some((c) => c.active);
    // Holding the current page, the parent row stays marked while its group is closed (the stylesheet reads it from
    // the page's own link), and says so to assistive technology, as the kept-closed column's opener does: among
    // its list's items it is the current one, aria-current="true", since the page's link is hidden with the group.
    return (
      <details className={sidebar.part('group')} open={item.open ?? item.children.some((c) => c.active)}>
        <summary className={cls} aria-disabled={item.disabled ? true : undefined} aria-current={holdsCurrent ? 'true' : undefined}>
          {body}
          <Icon name="CaretDown" className={sidebar.part('item-caret')} />
        </summary>
        <ul className={sidebar.part('children')}>
          {item.children.map((child) => (
            <li key={child.href}>
              <a className={`${cls} ${cls}--child`} href={child.disabled ? undefined : child.href} aria-current={child.active ? 'page' : undefined} aria-disabled={child.disabled ? true : undefined}>
                <span className={sidebar.part('item-label')} data-label={child.label}>{child.label}</span>
                <Marks item={child} />
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
function SidebarGroups({ groups, collapsed, named = collapsed, small = false, headingLevel = 3 }: { groups: SidebarGroup[]; collapsed: boolean; named?: boolean; small?: boolean; headingLevel?: HeadingLevel }) {
  const Heading = `h${headingLevel}` as const;
  return (
    <>
      {groups.map((group, i) => (
        <div key={i} className={sidebar.part('section')}>
          {group.label && (
            <Heading className={sidebar.part('group-label')}>
              <span className={sidebar.part('group-title')}>{group.label}</span>
            </Heading>
          )}
          <ul className={sidebar.part('list')}>
            {group.items.map((item) => (
              <li key={item.href}>
                <Item item={item} collapsed={collapsed} named={named} small={small} />
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
  /** The level of the group labels, which are headings. 3 unless given: one below the page's section headings. */
  headingLevel?: HeadingLevel;
  /** How tall an item's children are, as the sidebar's `child`: sm, a step smaller than their parent, unless given; md, as tall as their parent. */
  child?: VariantProps<typeof sidebar.manifest>['child'];
  className?: string;
}

/**
 * The sidebar's navigation on its own, without the panel: its groups, their labels and items, an item's
 * children folding under it, the current page marked, always expanded. For a drawer on a phone, where the
 * page's navigation has no column to sit in.
 *
 *   <Drawer position="left" title="Menu" …><SidebarNav label="Categories" groups={groups} /></Drawer>
 */
export function SidebarNav({ groups, label = 'Sidebar', headingLevel = 3, child, className }: SidebarNavProps) {
  const nav = useRef<HTMLElement>(null);
  useGlide(nav, NAV_GLIDE);
  useGroupMotion(nav);
  const bar = useScrollbar(nav);
  return (
    <nav ref={nav} aria-label={label} className={cx(sidebar.part('nav'), child && sidebar.modifier('child', child), className)} {...bar}>
      <SidebarGroups groups={groups} collapsed={false} headingLevel={headingLevel} />
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
  /** A site's own logo as picture files, which keep their own colors: the logo's `picture`, its whole logo when open and its mark in the column. */
  logoPicture?: LogoProps['picture'];
  /** Where the logo links to. */
  homeHref?: string;
  /** The search field shown when open. Figma: Search. */
  search?: ReactNode;
  /** Called when the column's search button is pressed. The button shows only when given. */
  onSearch?: () => void;
  /** The column's search button's name. "Search" unless given, for a page in another language. */
  searchLabel?: string;
  groups: SidebarGroup[];
  /** The user's avatar. With the name, Figma's User Profile. */
  avatar?: ReactNode;
  userName?: ReactNode;
  userDetail?: ReactNode;
  /**
   * The foot button that steps the display, with its divider. Off, the sidebar stays in the display
   * it is given: a column kept closed as an application's parent navigation, beside a second
   * sidebar kept open for the current page's. Figma: Collapsible, on by default.
   */
  collapsible?: boolean;
  /** Called with the display the foot button steps to. Give `display` as well to keep it outside. */
  onDisplayChange?: (display: SidebarDisplay) => void;
  /**
   * The foot button's names, one for each display it is pressed from, each saying what pressing it does. Unless given:
   * "Keep sidebar open" in auto, "Keep sidebar closed" kept open, "Open sidebar on hover" kept closed. Give the ones
   * a page in another language needs; the rest keep their English.
   */
  toggleLabels?: Partial<Record<SidebarDisplay, string>>;
  /** The level of the group labels, which are headings. 3 unless given: one below the page's section headings. */
  headingLevel?: HeadingLevel;
  /** Accessible name of the panel and of the navigation in it: one name for the region and its navigation, so a page with a second aside never has two complementary regions that sound the same. */
  label?: string;
}

/** The foot button steps through the displays in this order. */
const NEXT: Record<SidebarDisplay, SidebarDisplay> = { auto: 'expanded', expanded: 'collapsed', collapsed: 'auto' };
/** Its name says what pressing it does, unless the page gives its own (`toggleLabels`). */
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
 * out, with the fold purpose the panel's width uses. The lone mark and the whole logo's mark are
 * the same shapes at the same size, so the hand-over at either end cannot be seen. Under reduced
 * motion the one simply takes the other's place. `measure` is called just before a fold, with the
 * folding's own; `stop` once it has landed.
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
    if (!start || !element?.hasAttribute('data-folding') || reducedMotion()) return;
    stop();
    const { whole, mark, words } = parts();
    const base = markBox(whole);
    const end = open ? base : markBox(mark);
    if (!whole || !base || !end) return;
    const at = (box: DOMRect) => `${box.left - base.left}px ${box.top - base.top}px`;
    const timing: KeyframeAnimationOptions = { duration: motionMs(element, 'fold-duration'), easing: motionEasing(element, 'fold'), fill: 'forwards' };
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
export function Sidebar({ logo = true, brand = 'simbolik', logoShapes, logoPicture, homeHref = '/', search, onSearch, searchLabel = 'Search', groups, avatar, userName, userDetail, display, open, look, size, child, width, collapsible = true, onDisplayChange, toggleLabels, headingLevel = 3, label = 'Sidebar', className, suppressHydrationWarning, ...rest }: SidebarProps) {
  const [current, keepDisplay] = useControllable<SidebarDisplay>({ value: display, defaultValue: 'auto', onChange: onDisplayChange, name: 'Sidebar display' });
  const [autoOpen, setAutoOpen] = useState(false);
  const shown = current === 'expanded' || (current === 'auto' && (open ?? autoOpen));
  const room = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const nav = useRef<HTMLElement>(null);
  useGlide(nav, NAV_GLIDE);
  const navBar = useScrollbar(nav);
  useGroupMotion(nav);
  // The folding first: its effect marks the panel, which the morph's effect, declared after it, reads.
  const landed = useRef(() => {});
  const fold = useFolding(panel, !shown, { onLand: () => landed.current() });
  const morph = useLogoMorph(panel, shown);
  // Folding from kept open to kept closed, the open panel's rows stay until it lands, so their words fade and the
  // parts the column hides fold with it; the kept-closed column's own rows (flyouts, tooltips) take their place once
  // it has, drawn the same.
  const [keepRows, setKeepRows] = useState(false);
  landed.current = () => {
    morph.stop();
    setKeepRows(false);
  };
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
      duration: motionMs(element, 'fold-duration'),
      easing: motionEasing(element, 'fold'),
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
      if (from === 'expanded' && !reducedMotion()) setKeepRows(true);
    } else if (e.detail > 0) {
      // Back to auto by a pointer press: it stays a column until the pointer comes back, or it
      // would open under the very press that asked for auto.
      why.current.dismissed = true;
    }
    keepDisplay(to);
  };

  // Only a fold into kept closed keeps the open rows.
  useEffect(() => {
    if (current !== 'collapsed') setKeepRows(false);
  }, [current]);

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
      className={cx(sidebar({ look, size, child, width, display: current, collapsed: !shown, open: current === 'auto' && shown }), className)}
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
                <Logo brand={brand} shapes={logoShapes} picture={logoPicture} form="logo" className={part('brand-logo')} />
                <Logo brand={brand} shapes={logoShapes} picture={logoPicture} form="logomark" className={part('brand-mark')} />
              </a>
            </div>
            <Divider />
          </>
        )}
        {(search || onSearch) && (
          <div className={sidebar.part('search')}>
            {search && <div className={sidebar.part('search-field')}>{search}</div>}
            {onSearch && <Button tone="ghost" size="sm" icon="MagnifyingGlass" icon-only aria-label={searchLabel} className={sidebar.part('search-button')} onClick={onSearch} />}
          </div>
        )}
        <nav ref={nav} aria-label={label} className={sidebar.part('nav')} {...navBar}>
          <SidebarGroups groups={groups} collapsed={current === 'collapsed' && !keepRows} named={!shown} small={size === 'sm'} headingLevel={headingLevel} />
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
              <Button tone="ghost" size="sm" icon="SidebarSimple" icon-only aria-label={toggleLabels?.[current] ?? STEP_NAME[current]} aria-expanded={shown} className={part('toggle')} onClick={step} />
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
