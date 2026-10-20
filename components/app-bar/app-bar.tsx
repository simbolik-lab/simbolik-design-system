import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode, type RefObject } from 'react';
import { useControllable } from '../controllable.js';
import { appBar } from './app-bar.manifest.js';
import { useFold } from '../fold.js';
import { Button } from '../button/button.js';
import { BarFrost, BarSecondRow, useCloseOnUnfold, useMenuEscape } from '../bar.js';
import { Logo, type LogoPicture } from '../logo/logo.js';
import { NavItem } from '../nav-item/nav-item.js';
import { Badge } from '../badge/badge.js';
import { StatusDot } from '../status-dot/status-dot.js';
import { TabsNav } from '../tabs/tabs.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface AppBarLink {
  label: string;
  href: string;
  /** Phosphor icon name shown before the label, in the bar and in the menu. */
  icon?: string;
  active?: boolean;
  /** A count after the label, drawn as a small badge and read with the name: "Issues, 18". */
  count?: number | string;
  /** A dot after the label saying something here changed, read with the name in the words of `dotLabel` ("changed" by default). */
  dot?: boolean;
  dotLabel?: string;
}

export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, Omit<VariantProps<typeof appBar.manifest>, 'scrolled-away' | 'fold'> {
  /** Where the brand links to. */
  homeHref?: string;
  /** Replaces the Simbolik logo, inside the link home. */
  brand?: ReactNode;
  /**
   * Replaces the whole start of the bar, the link home included: a back button and a title, or a workspace
   * switcher (Figma's AppBarStart Back and Switcher). Shown in both forms.
   */
  start?: ReactNode;
  /** A badge after the brand, such as the release a site is: kept when the logo is off, and read after the brand. */
  badge?: ReactNode;
  /**
   * Replaces the links in the middle of a wide bar: tabs, a search field, icon links or a title (Figma's AppBarNav
   * Tabs, Search, Icon links and Title). Hidden in a narrow space, and never folded: only links fold. The menu still
   * lists `items`.
   */
  nav?: ReactNode;
  /** A second row under the bar, such as line tabs, with a divider above it (Figma's Second row). */
  secondRow?: ReactNode;
  /**
   * In a wide space too narrow for the whole row, fold the action buttons away and then the links, the menu button
   * opening the links under the bar: the wrapper measures the row. On by default; `false` keeps every part in the
   * row; a stage (`"actions"`, `"links"`) holds the bar at that stage without measuring.
   */
  fold?: boolean | 'none' | 'actions' | 'links';
  /**
   * A site's own logo as picture files, which keep their own colors, in place of the Simbolik logo: the logo's
   * `picture`, its whole logo in a wide space and its mark in a narrow one.
   */
  logoPicture?: LogoPicture;
  /** The search field shown at the start of the end group in a wide space. Without one, a bar given `onSearch` shows its search button there instead. */
  search?: ReactNode;
  /** Icon-only buttons shown in a wide space, e.g. notifications and settings. */
  actions?: ReactNode;
  themeSwitch?: ReactNode;
  /** The user's avatar or menu, shown in both forms. */
  user?: ReactNode;
  /** The links: in the bar after the brand in a wide space, in the menu in a narrow one. Figma: the NavItems toggle. */
  items?: AppBarLink[];
  /** Accessible name of the links in the bar. */
  navLabel?: string;
  /**
   * Called when the search button is pressed. The button shows only when given: in a narrow space, and in a wide one
   * with no search field, at the start of the end group as Figma's AppBarEnd draws Search, where it never folds away.
   */
  onSearch?: () => void;
  /** The search button's name. "Search" unless given, for a page in another language. */
  searchLabel?: string;
  /** The menu button's name, and the name of the menu it opens. "Menu" unless given, for a page in another language. */
  menuLabel?: string;
  /** Controlled menu state. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Called when the menu button is pressed (in a narrow space, or in a wide one whose links have folded), in place
   * of the bar's own menu: the bar then draws no menu, and the page opens its own, such as a drawer holding these
   * links and more on a phone. The button then says it opens a dialog.
   */
  onMenu?: () => void;
}

/** How far the window must scroll one way before a bar that hides on scroll follows, so a trembling wheel or finger does not flicker it. Part of the behavior, not a design value. */
const SCROLL_STEP = 6;

/**
 * Hide on scroll: whether the bar has slid away. The stylesheet keeps the bar at the top of the window in a narrow
 * space; this hides it while the reader scrolls the window down and brings it back the moment they scroll up. It
 * never hides while the page is still within the bar's own height and the gap above it of the top, nor while one of
 * its menus is open on screen or keyboard focus is inside it, and it comes back as soon as keyboard focus moves
 * into it. Where the bar does not stick (a wide space, or the flag off) it stays shown, as it is on the server and
 * until the page's script runs.
 */
function useHideOnScroll(header: RefObject<HTMLElement | null>, on: boolean): boolean {
  const [away, setAway] = useState(false);
  useEffect(() => {
    const bar = header.current;
    if (!on || !bar) {
      setAway(false);
      return undefined;
    }
    // Where the window was when the bar last moved, or since then the furthest it has gone the same way: a turn of
    // more than the step from there moves the bar, however slowly the window scrolls.
    let last = window.scrollY;
    let shown = true;
    let frame = 0;
    const show = (on: boolean) => {
      shown = on;
      setAway(!on);
    };
    // Only what is drawn counts: an opener the layout switch hides holds nothing.
    const held = () => bar.querySelector(':focus-visible') !== null || [...bar.querySelectorAll('[aria-expanded="true"]')].some((opener) => opener.checkVisibility());
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const style = getComputedStyle(bar);
      if (style.position !== 'sticky' || y <= (Number.parseFloat(style.top) || 0) + bar.offsetHeight || held()) {
        show(true);
        last = y;
      } else if (shown ? y < last : y > last) {
        last = y;
      } else if (Math.abs(y - last) > SCROLL_STEP) {
        show(!shown);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onFocus = () => {
      if (!bar.querySelector(':focus-visible')) return;
      show(true);
      last = window.scrollY;
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    bar.addEventListener('focusin', onFocus);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      bar.removeEventListener('focusin', onFocus);
    };
  }, [header, on]);
  return away;
}

/** A link's count or dot as a tab's badge, drawn and named as a navigation item draws them: "Issues, 18", "Inbox, changed". */
function mark(item: AppBarLink): ReactNode {
  if (item.count !== undefined && item.count !== null && item.count !== '') return <Badge size="sm">{item.count}</Badge>;
  if (item.dot) return <StatusDot tone="info" aria-label={item.dotLabel ?? 'changed'} />;
  return undefined;
}

/** The fold stages, least folded first: the classes the wrapper tries in turn. */
const FOLD = (['none', 'actions', 'links'] as const).map((value) => appBar.modifier('fold', value));

/** App bar: one markup for both forms; the layout switch decides which parts show, and in a wide space the wrapper folds what does not fit. */
export function AppBar({ homeHref = '/', brand, start, badge, logoPicture, nav, search, actions, themeSwitch, user, items = [], navLabel = 'Main', onSearch, searchLabel = 'Search', menuLabel = 'Menu', expanded, onExpandedChange, onMenu, secondRow, fold = true, look, size = 'md', background, line, logo, links, 'nav-type': navType, 'sidebar-start': sidebarStart, zone, frosted, 'hide-on-scroll': hideOnScroll, className, ...rest }: AppBarProps) {
  const id = useId();
  const [open, setOpen] = useControllable({ value: expanded, defaultValue: false, onChange: onExpandedChange, name: 'AppBar expanded' });
  const toggle = () => setOpen(!open);
  const header = useRef<HTMLElement>(null);
  useMenuEscape(header, open, setOpen, appBar.part('menu-button'));
  const away = useHideOnScroll(header, !!hideOnScroll);
  // Only links fold: a bar whose middle holds something else folds its actions alone.
  const stages = nav ? FOLD.slice(0, 2) : FOLD;
  const measured = useFold(header, (block) => block.querySelector<HTMLElement>(`.${appBar.part('bar')}`), stages, fold === true, [items.map((item) => item.label).join('|'), !!nav, !!search, !!actions, !!user, !!themeSwitch, !!badge, look, size, logo, links, navType, sidebarStart].join(' '));
  const folded = typeof fold === 'string' ? fold : (['none', 'actions', 'links'] as const)[measured]!;
  useCloseOnUnfold(header, { unfolded: folded !== 'links', expanded, open, setOpen });
  const wide = appBar.part('wide-only');
  const narrow = appBar.part('narrow-only');
  const split = look === 'split';
  // The switch appears twice, in the bar and in the menu; a second radio name keeps the two from sharing one group.
  const menuThemeSwitch = isValidElement(themeSwitch) ? cloneElement(themeSwitch as ReactElement<{ name?: string }>, { name: `${(themeSwitch.props as { name?: string }).name ?? 'theme'}-menu` }) : themeSwitch;
  const menuButton = appBar.part('menu-button');
  return (
    <header ref={header} className={cx(appBar({ look, size, background, line, logo, links, 'nav-type': navType, 'sidebar-start': sidebarStart, fold: folded, expanded: open, zone, frosted, 'hide-on-scroll': hideOnScroll, 'scrolled-away': away }), className)} {...rest}>
      {frosted && <BarFrost className={appBar.part('frost')} />}
      <div className={appBar.part('panel')}>
        <div className={appBar.part('bar')}>
          <div className={appBar.part('start')}>
            {start ?? (
              <a className={appBar.part('brand')} href={homeHref}>
                {brand ?? (
                  <>
                    <Logo form="logo" picture={logoPicture} className={`${appBar.part('logo')} ${wide}`} />
                    <Logo form="logomark" picture={logoPicture} className={`${appBar.part('logo')} ${narrow}`} />
                  </>
                )}
              </a>
            )}
            {badge && <span className={appBar.part('badge')}>{badge}</span>}
          </div>
          <div className={appBar.part('trail')}>
            {nav ? (
              <div className={`${appBar.part('nav')} ${wide}`}>{nav}</div>
            ) : (
              items.length > 0 &&
              (navType === 'tabs' ? (
                <TabsNav look="line" size="sm" label={navLabel} className={`${appBar.part('nav')} ${wide}`} items={items.map((item) => ({ href: item.href, label: item.label, icon: item.icon, current: item.active, badge: mark(item) }))} />
              ) : (
                <nav aria-label={navLabel} className={`${appBar.part('nav')} ${wide}`}>
                  {items.map((item) => (
                    <NavItem size={size} key={item.href} href={item.href} icon={item.icon} active={item.active} count={item.count} dot={item.dot} dotLabel={item.dotLabel}>
                      {item.label}
                    </NavItem>
                  ))}
                </nav>
              ))
            )}
            <div className={appBar.part('end')}>
              {search && <div className={`${appBar.part('search')} ${wide}`}>{search}</div>}
              {onSearch && <Button tone="ghost" size="md" icon="MagnifyingGlass" icon-only aria-label={searchLabel} className={search ? narrow : undefined} onClick={onSearch} />}
              {actions && <div className={`${appBar.part('actions')} ${wide}`}>{actions}</div>}
              {themeSwitch && <div className={wide}>{themeSwitch}</div>}
              {user}
              {onMenu ? (
                <Button tone="ghost" size="md" icon="List" icon-only aria-label={menuLabel} aria-haspopup="dialog" className={`${menuButton} ${narrow}`} onClick={onMenu} />
              ) : (
                <Button tone="ghost" size="md" icon="List" icon-only aria-label={menuLabel} aria-expanded={open} aria-controls={`${id}-menu`} className={`${menuButton} ${narrow}`} onClick={toggle} />
              )}
            </div>
          </div>
        </div>
        {secondRow && (
          <BarSecondRow className={appBar.part('second-row')} navClassName={appBar.part('second-row-nav')} split={split}>
            {secondRow}
          </BarSecondRow>
        )}
        {!onMenu && (
          <div id={`${id}-menu`} className={appBar.part('menu')}>
            <nav aria-label={menuLabel}>
              {items.map((item) => (
                <NavItem size="lg" key={item.href} href={item.href} icon={item.icon} block active={item.active} count={item.count} dot={item.dot} dotLabel={item.dotLabel}>
                  {item.label}
                </NavItem>
              ))}
            </nav>
            {themeSwitch && <div className={appBar.part('menu-end')}>{menuThemeSwitch}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
