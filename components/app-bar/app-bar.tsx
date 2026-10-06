import { cloneElement, isValidElement, useEffect, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode, type RefObject } from 'react';
import { appBar } from './app-bar.manifest.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { Logo } from '../logo/logo.js';
import { NavItem } from '../nav-item/nav-item.js';
import type { VariantProps } from '../variants.js';

export interface AppBarLink {
  label: string;
  href: string;
  /** Phosphor icon name shown before the label, in the bar and in the menu. */
  icon?: string;
  active?: boolean;
}

export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, Omit<VariantProps<typeof appBar.manifest>, 'scrolled-away'> {
  /** Where the brand links to. */
  homeHref?: string;
  /** Replaces the Simbolik logo. */
  brand?: ReactNode;
  /** The search field shown at the start of the end group in a wide space. */
  search?: ReactNode;
  /** Icon-only buttons shown in a wide space, e.g. notifications and settings. */
  actions?: ReactNode;
  themeSwitch?: ReactNode;
  /** The user's avatar or menu, shown in both forms; in a wide space a divider sets it apart. */
  user?: ReactNode;
  /** The links: in the bar after the brand in a wide space, in the menu in a narrow one. Figma: the NavItems toggle. */
  items?: AppBarLink[];
  /** Accessible name of the links in the bar. */
  navLabel?: string;
  /** Called when the narrow-space search button is pressed. The button shows only when given. */
  onSearch?: () => void;
  /** Controlled menu state. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Called when the narrow-space menu button is pressed, in place of the bar's own menu: the bar then draws no
   * menu, and the page opens its own, such as a drawer holding these links and more
   * on a phone. The button then says it opens a dialog.
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

/** App bar: one markup for both forms; the layout switch decides which parts show. */
export function AppBar({ homeHref = '/', brand, search, actions, themeSwitch, user, items = [], navLabel = 'Main', onSearch, expanded, onExpandedChange, onMenu, background, logo, links, 'hide-on-scroll': hideOnScroll, className, ...rest }: AppBarProps) {
  const [internal, setInternal] = useState(false);
  const open = expanded ?? internal;
  const toggle = () => {
    if (expanded === undefined) setInternal(!open);
    onExpandedChange?.(!open);
  };
  const header = useRef<HTMLElement>(null);
  // Escape closes the open menu and hands focus back to the menu button, as a disclosure should.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (expanded === undefined) setInternal(false);
      onExpandedChange?.(false);
      header.current?.querySelector<HTMLButtonElement>('button[aria-expanded]')?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, expanded, onExpandedChange]);
  const away = useHideOnScroll(header, !!hideOnScroll);
  const wide = appBar.part('wide-only');
  const narrow = appBar.part('narrow-only');
  // The switch appears twice, in the bar and in the menu; a second radio name keeps the two from sharing one group.
  const menuThemeSwitch = isValidElement(themeSwitch) ? cloneElement(themeSwitch as ReactElement<{ name?: string }>, { name: `${(themeSwitch.props as { name?: string }).name ?? 'theme'}-menu` }) : themeSwitch;
  return (
    <header ref={header} className={[appBar({ expanded: open, background, logo, links, 'hide-on-scroll': hideOnScroll, 'scrolled-away': away }), className].filter(Boolean).join(' ')} {...rest}>
      <div className={appBar.part('bar')}>
        <a className={appBar.part('brand')} href={homeHref}>
          {brand ?? (
            <>
              <Logo form="logo" className={`${appBar.part('logo')} ${wide}`} />
              <Logo form="logomark" className={`${appBar.part('logo')} ${narrow}`} />
            </>
          )}
        </a>
        {items.length > 0 && (
          <nav aria-label={navLabel} className={`${appBar.part('nav')} ${wide}`}>
            {items.map((item) => (
              <NavItem size="lg" key={item.href} href={item.href} icon={item.icon} active={item.active}>
                {item.label}
              </NavItem>
            ))}
          </nav>
        )}
        <div className={appBar.part('end')}>
          {search && <div className={`${appBar.part('search')} ${wide}`}>{search}</div>}
          {actions && <div className={`${appBar.part('actions')} ${wide}`}>{actions}</div>}
          {themeSwitch && <div className={wide}>{themeSwitch}</div>}
          {user && <Divider orientation="vertical" className={`${appBar.part('divider')} ${wide}`} />}
          {onSearch && <Button tone="ghost" size="md" icon="MagnifyingGlass" icon-only aria-label="Search" className={narrow} onClick={onSearch} />}
          {user}
          {onMenu ? (
            <Button tone="ghost" size="md" icon="List" icon-only aria-label="Menu" aria-haspopup="dialog" className={narrow} onClick={onMenu} />
          ) : (
            <Button tone="ghost" size="md" icon="List" icon-only aria-label="Menu" aria-expanded={open} className={narrow} onClick={toggle} />
          )}
        </div>
      </div>
      {!onMenu && (
        <div className={appBar.part('menu')}>
          <Divider />
          <nav aria-label="Menu">
            {items.map((item) => (
              <NavItem size="lg" key={item.href} href={item.href} icon={item.icon} block active={item.active}>
                {item.label}
              </NavItem>
            ))}
          </nav>
          {themeSwitch && (
            <>
              <Divider />
              <div className={appBar.part('menu-end')}>{menuThemeSwitch}</div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
