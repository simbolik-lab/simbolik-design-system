import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { header } from './header.manifest.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { Dropdown, DropdownItem } from '../dropdown/dropdown.js';
import { Logo } from '../logo/logo.js';
import { NavItem } from '../nav-item/nav-item.js';
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
   * Further links under this one, one level deep. In a wide space the item becomes a navigation item with a
   * caret that opens them in a dropdown under it; in the narrow-space menu they open under the item in place.
   */
  children?: HeaderLink[];
  /** The group of children starts open. In the narrow-space menu, a group holding the current page starts open anyway. */
  defaultOpen?: boolean;
}

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof header.manifest> {
  homeHref?: string;
  /** Replaces the Simbolik logo. */
  brand?: ReactNode;
  items: HeaderLink[];
  /** The call to action: a button. Shown at the end of the bar in a wide space and as the last row of the menu in a narrow one. */
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
}

function MenuGroup({ item, id }: { item: HeaderLink; id: string }) {
  const [open, setOpen] = useState(item.defaultOpen ?? item.children?.some((c) => c.active) ?? false);
  if (!item.children?.length) {
    return (
      <NavItem size="lg" href={item.href} block active={item.active} icon={item.icon}>
        {item.label}
      </NavItem>
    );
  }
  return (
    <>
      <NavItem size="lg" block caret aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} icon={item.icon}>
        {item.label}
      </NavItem>
      <ul id={id} className={header.part('group')} hidden={!open}>
        {item.children.map((child) => (
          <li key={child.href}>
            <NavItem size="lg" href={child.href} block active={child.active} icon={child.icon}>
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
      <NavItem size={size} href={item.href} active={item.active} icon={item.icon}>
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
        <NavItem size={size} caret active={item.active} icon={item.icon}>
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

/** Header: one markup for both forms; the layout switch decides which parts show. */
export function Header({ homeHref = '/', brand, items, cta, themeSwitch, expanded, onExpandedChange, openOnHover = false, navLabel = 'Main', size = 'lg', background, className, ...rest }: HeaderProps) {
  const id = useId();
  const [internal, setInternal] = useState(false);
  const open = expanded ?? internal;
  const toggle = () => {
    if (expanded === undefined) setInternal(!open);
    onExpandedChange?.(!open);
  };
  const wide = header.part('wide-only');
  const narrow = header.part('narrow-only');
  const root = useRef<HTMLElement>(null);
  // Escape closes the open menu and hands focus back to the menu button, as a disclosure should (the app bar's way).
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (expanded === undefined) setInternal(false);
      onExpandedChange?.(false);
      root.current?.querySelector<HTMLButtonElement>(`button.${narrow}[aria-expanded]`)?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, expanded, onExpandedChange, narrow]);
  // Figma's mobile header uses the medium theme switch and a large, full-width call to action. The narrow switch takes
  // the medium size and its own radio name, so the two never share a group.
  const narrowThemeSwitch = isValidElement(themeSwitch) ? cloneElement(themeSwitch as ReactElement<{ size?: string; name?: string }>, { size: 'md', name: `${(themeSwitch.props as { name?: string }).name ?? 'theme'}-narrow` }) : themeSwitch;
  const narrowCta = isValidElement(cta) ? cloneElement(cta as ReactElement<{ size?: string }>, { size: 'lg' }) : cta;
  return (
    <header ref={root} className={[header({ size, background, expanded: open }), className].filter(Boolean).join(' ')} {...rest}>
      <div className={header.part('bar')}>
        <a className={header.part('brand')} href={homeHref}>
          {brand ?? <Logo form="logo" className={header.part('logo')} />}
        </a>
        <nav aria-label={navLabel} className={wide}>
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
          {themeSwitch && <div className={narrow}>{narrowThemeSwitch}</div>}
          <Button tone="ghost" size="md" icon="List" icon-only aria-label="Menu" aria-expanded={open} className={narrow} onClick={toggle} />
        </div>
      </div>
      <div className={header.part('menu')}>
        <Divider />
        <nav aria-label="Menu">
          <ul className={header.part('menu-list')}>
            {items.map((item, i) => (
              <li key={item.href}>
                <MenuGroup item={item} id={`${id}-group-${i}`} />
                <Divider />
              </li>
            ))}
          </ul>
        </nav>
        {cta && <div className={header.part('menu-cta')}>{narrowCta}</div>}
      </div>
    </header>
  );
}
