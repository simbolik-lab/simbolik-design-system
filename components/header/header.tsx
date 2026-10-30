'use client';

import { cloneElement, isValidElement, useId, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { useControllable } from '../controllable.js';
import { header } from './header.manifest.js';
import { useFold } from '../fold.js';
import { Button } from '../button/button.js';
import { BarFrost, BarSecondRow, useCloseOnUnfold, useMenuEscape } from '../bar.js';
import { Divider } from '../divider/divider.js';
import { Dropdown, DropdownItem } from '../dropdown/dropdown.js';
import { Logo, type LogoPicture } from '../logo/logo.js';
import { NavItem } from '../nav-item/nav-item.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface HeaderLink {
  label: string;
  /** Where the link goes. An item with children opens them instead, in both forms, so its own address is not followed. */
  href: string;
  /** Marks the current page. */
  active?: boolean;
  /**
   * Phosphor icon name before the label: in the wide dropdown, on the dropdown item; everywhere else, on the
   * navigation item. Figma's dropdown item and navigation item both carry a leading icon.
   */
  icon?: string;
  /**
   * A count after the label, drawn as a small badge and read with the name: "Issues, 18". Shown on the
   * navigation item, so not on a link inside the wide bar's dropdown.
   */
  count?: number | string;
  /** A dot after the label saying something here changed, read with the name in the words of `dotLabel` ("changed" by default). Shown where the count is. */
  dot?: boolean;
  dotLabel?: string;
  /**
   * Further links under this one, one level deep. In a wide space the item becomes a navigation item with a
   * caret that opens them in a dropdown under it; in the narrow-space menu they open under the item in place.
   */
  children?: HeaderLink[];
  /** The group of children starts open. In the narrow-space menu, a group holding the current page starts open anyway. */
  defaultOpen?: boolean;
}

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, Omit<VariantProps<typeof header.manifest>, 'fold'> {
  homeHref?: string;
  /** Replaces the Simbolik logo. */
  brand?: ReactNode;
  /** A site's own logo as picture files, which keep their own colors, in place of the Simbolik logo: the logo's `picture`. */
  logoPicture?: LogoPicture;
  items: HeaderLink[];
  /**
   * The call to action: a button. Shown at the end of the bar in a wide space, even when the links have folded, and
   * as the last row of the menu in a narrow one.
   */
  cta?: ReactNode;
  themeSwitch?: ReactNode;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * In a wide space, a link's dropdown also opens while a mouse rests on it and closes a moment after the
   * mouse leaves (the dropdown's `openOnHover`); a press still opens it, so touch and keyboard are unchanged.
   * The narrow-space menu is unaffected. Off by default.
   */
  openOnHover?: boolean;
  /** Accessible name of the links in the wide bar, "Main" by default, as the app bar's. Give each its own when a page has more than one header. */
  navLabel?: string;
  /** The menu button's name, and the name of the menu it opens. "Menu" unless given, for a page in another language. */
  menuLabel?: string;
  /** A second row under the bar, such as line tabs, with a divider above it (Figma's Second row). */
  secondRow?: ReactNode;
  /**
   * In a wide space too narrow for the page links, fold them away: the menu button takes their place and opens them
   * under the bar, while the call to action and the theme switch stay: the wrapper measures the row. On by default;
   * `false` keeps the links in the row; `"links"` holds them folded without measuring.
   */
  fold?: boolean | 'none' | 'links';
}

function MenuGroup({ item, id }: { item: HeaderLink; id: string }) {
  const [open, setOpen] = useState(item.defaultOpen ?? item.children?.some((c) => c.active) ?? false);
  if (!item.children?.length) {
    return (
      <NavItem size="lg" href={item.href} block active={item.active} icon={item.icon} count={item.count} dot={item.dot} dotLabel={item.dotLabel}>
        {item.label}
      </NavItem>
    );
  }
  return (
    <>
      <NavItem size="lg" block caret aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} icon={item.icon} count={item.count} dot={item.dot} dotLabel={item.dotLabel}>
        {item.label}
      </NavItem>
      <ul id={id} className={header.part('group')} hidden={!open}>
        {item.children.map((child) => (
          <li key={child.href}>
            <NavItem size="lg" href={child.href} block active={child.active} icon={child.icon} count={child.count} dot={child.dot} dotLabel={child.dotLabel}>
              {child.label}
            </NavItem>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * A top-level link in the wide bar. With children it is the opener of a dropdown of links under it:
 * the dropdown's navigation purpose, which is the WAI-ARIA disclosure navigation pattern, better
 * suited to site navigation than a menu. The dropdown draws and moves the
 * panel and does the keyboard work; nothing of it is repeated here.
 */
function BarLink({ item, size, openOnHover }: { item: HeaderLink; size: 'md' | 'lg'; openOnHover: boolean }) {
  if (!item.children?.length) {
    return (
      <NavItem size={size} href={item.href} active={item.active} icon={item.icon} count={item.count} dot={item.dot} dotLabel={item.dotLabel}>
        {item.label}
      </NavItem>
    );
  }
  return (
    <Dropdown
      label={item.label}
      purpose="navigation"
      defaultOpen={item.defaultOpen}
      openOnHover={openOnHover}
      trigger={
        <NavItem size={size} caret active={item.active} icon={item.icon} count={item.count} dot={item.dot} dotLabel={item.dotLabel}>
          {item.label}
        </NavItem>
      }
    >
      {item.children.map((child) => (
        <DropdownItem key={child.href} href={child.href} icon={child.icon} aria-current={child.active ? 'page' : undefined}>
          {child.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}

/** The fold stages, least folded first: the classes the wrapper tries in turn. */
const FOLD = (['none', 'links'] as const).map((value) => header.modifier('fold', value));

/** Header: one markup for both forms; the layout switch decides which parts show, and in a wide space the wrapper folds the links when they do not fit. */
export function Header({ homeHref = '/', brand, logoPicture, items, cta, themeSwitch, expanded, onExpandedChange, openOnHover = false, navLabel = 'Main', menuLabel = 'Menu', secondRow, fold = true, look, size = 'md', background, line, zone, frosted, className, ...rest }: HeaderProps) {
  const id = useId();
  const [open, setOpen] = useControllable({ value: expanded, defaultValue: false, onChange: onExpandedChange, name: 'Header expanded' });
  const toggle = () => setOpen(!open);
  const wide = header.part('wide-only');
  const narrow = header.part('narrow-only');
  const menuButton = header.part('menu-button');
  const root = useRef<HTMLElement>(null);
  // A dropdown of the wide bar closes on its own Escape first, and leaves the menu open.
  useMenuEscape(root, open, setOpen, menuButton, true);
  const measured = useFold(root, (block) => block.querySelector<HTMLElement>(`.${header.part('bar')}`), FOLD, fold === true, [items.map((item) => item.label).join('|'), !!cta, !!themeSwitch, look, size].join(' '));
  const folded = typeof fold === 'string' ? fold : measured === 1 ? 'links' : 'none';
  useCloseOnUnfold(root, { unfolded: folded === 'none', expanded, open, setOpen });
  const split = look === 'split';
  // Figma's mobile header uses the medium theme switch and a medium, full-width call to action, a row of the menu. The
  // narrow switch takes the medium size and its own radio name, so the two never share a group.
  const narrowThemeSwitch = isValidElement(themeSwitch) ? cloneElement(themeSwitch as ReactElement<{ size?: string; name?: string }>, { size: 'md', name: `${(themeSwitch.props as { name?: string }).name ?? 'theme'}-narrow` }) : themeSwitch;
  const narrowCta = isValidElement(cta) ? cloneElement(cta as ReactElement<{ size?: string }>, { size: 'md' }) : cta;
  return (
    <header ref={root} className={cx(header({ look, size, background, line, fold: folded, expanded: open, zone, frosted }), className)} {...rest}>
      {frosted && <BarFrost className={header.part('frost')} />}
      <div className={header.part('panel')}>
        <div className={header.part('bar')}>
          <div className={header.part('start')}>
            <a className={header.part('brand')} href={homeHref}>
              {brand ?? <Logo form="logo" picture={logoPicture} className={header.part('logo')} />}
            </a>
          </div>
          <div className={header.part('trail')}>
            <nav aria-label={navLabel} className={`${header.part('nav')} ${wide}`}>
              <ul className={header.part('links')}>
                {items.map((item) => (
                  <li key={item.href}>
                    <BarLink item={item} size={size} openOnHover={openOnHover} />
                  </li>
                ))}
              </ul>
            </nav>
            <div className={header.part('end')}>
              {cta && <div className={wide}>{cta}</div>}
              {themeSwitch && <div className={wide}>{themeSwitch}</div>}
              {themeSwitch && <div className={`${header.part('theme')} ${narrow}`}>{narrowThemeSwitch}</div>}
              <Button tone="ghost" size="md" icon="List" icon-only aria-label={menuLabel} aria-expanded={open} aria-controls={`${id}-menu`} className={`${menuButton} ${narrow}`} onClick={toggle} />
            </div>
          </div>
        </div>
        {secondRow && (
          <BarSecondRow className={header.part('second-row')} navClassName={header.part('second-row-nav')} split={split}>
            {secondRow}
          </BarSecondRow>
        )}
        <div id={`${id}-menu`} className={header.part('menu')}>
          {!split && <Divider />}
          <nav aria-label={menuLabel}>
            <ul className={header.part('menu-list')}>
              {items.map((item, i) => (
                <li key={item.href}>
                  <MenuGroup item={item} id={`${id}-group-${i}`} />
                </li>
              ))}
            </ul>
          </nav>
          {cta && <div className={header.part('menu-cta')}>{narrowCta}</div>}
        </div>
      </div>
    </header>
  );
}
