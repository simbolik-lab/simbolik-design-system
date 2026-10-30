'use client';

import { useEffect, useId, useRef, useState, type HTMLAttributes, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { navigationMenu } from './navigation-menu.manifest.js';
import { NavItem } from '../nav-item/nav-item.js';
import { Icon } from '../icon/icon.js';
import { Link } from '../link/link.js';
import { ImagePlaceholder } from '../image-placeholder/image-placeholder.js';
import { useControllable } from '../controllable.js';
import { useDismiss } from '../dismiss.js';
import { isNarrow, motionMs } from '../motion.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/** A link in a panel: Figma's NavigationLink. */
export interface NavigationMenuLink {
  title: string;
  /** One line under the title saying what is there. */
  description?: string;
  href: string;
  /** Phosphor icon name before the title. */
  icon?: string;
  /** Marks the current page. */
  active?: boolean;
}

/** A column of links in a panel, under an optional heading that names the list. */
export interface NavigationMenuColumn {
  heading?: string;
  links: NavigationMenuLink[];
}

/** The featured column at a panel's end: a picture, a title, a line and a link. */
export interface NavigationMenuFeatured {
  title: string;
  description?: string;
  href: string;
  /** The link's words, such as "Read the notes". The title describes it to a screen reader. */
  linkLabel: string;
  /** The picture: an img or a picture element. An image placeholder stands in until given. */
  image?: ReactNode;
}

export interface NavigationMenuItem {
  label: string;
  /** Where a plain item goes. An item with columns opens its panel instead. */
  href?: string;
  /** Marks the current page (a plain item) or the current section (an item with a panel). */
  active?: boolean;
  /** The panel's columns of links. Given, the item is a button with a caret that opens the panel. */
  columns?: NavigationMenuColumn[];
  featured?: NavigationMenuFeatured;
}

export interface NavigationMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof navigationMenu.manifest> {
  items: NavigationMenuItem[];
  /** The label of the item whose panel is open, held by the page; `null` for none. Leave it out for the menu to keep its own. */
  open?: string | null;
  /** The item whose panel starts open, when the menu keeps its own. */
  defaultOpen?: string | null;
  /** Told the label of the item whose panel opened, or `null` as it closes. */
  onOpenChange?: (open: string | null) => void;
  /**
   * In a wide space, a panel also opens while a mouse rests on its item and closes a moment after the mouse leaves
   * the item and its panel; a press still opens it and keeps it open, so touch and keyboard are unchanged. Off by
   * default.
   */
  openOnHover?: boolean;
}

/**
 * Navigation menu: the disclosure navigation pattern, not an ARIA menu. A `nav` holds a list; a plain item is a
 * navigation item that links, an item with a panel is a navigation item that is a button with `aria-expanded` and
 * `aria-controls`, followed by its panel, so Tab moves from the button through the open panel's links. One panel is
 * open at a time. Escape, a press outside and focus leaving the item close it (dismiss.ts), focus going back to the
 * button when it was inside. In a narrow space (the layout switch) the list stacks and a panel opens in place under
 * its item, where only its button or Escape close it.
 */
export function NavigationMenu({ items, align, open, defaultOpen = null, onOpenChange, openOnHover = false, className, ...rest }: NavigationMenuProps) {
  const id = useId();
  const [current, setCurrent] = useControllable<string | null>({ value: open, defaultValue: defaultOpen, onChange: onOpenChange, name: 'NavigationMenu open' });
  const now = useRef(current);
  now.current = current;
  // Hover: the waiting timer, and the label of the panel the pointer opened (a press pins it).
  const hoverTimer = useRef(0);
  const byHover = useRef<string | null>(null);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const show = (label: string | null) => {
    if (label !== now.current) {
      now.current = label;
      setCurrent(label);
    }
    if (label === null || byHover.current !== label) byHover.current = null;
  };

  const hover = (label: string) => ({
    onPointerEnter: (event: ReactPointerEvent<HTMLLIElement>) => {
      if (event.pointerType !== 'mouse' || isNarrow(event.currentTarget)) return;
      window.clearTimeout(hoverTimer.current);
      if (now.current === label) return;
      hoverTimer.current = window.setTimeout(() => {
        show(label);
        byHover.current = label;
      }, motionMs(event.currentTarget, 'hover-open-delay'));
    },
    onPointerLeave: (event: ReactPointerEvent<HTMLLIElement>) => {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(hoverTimer.current);
      if (now.current !== label || byHover.current !== label) return;
      hoverTimer.current = window.setTimeout(() => {
        if (now.current === label && byHover.current === label) show(null);
      }, motionMs(event.currentTarget, 'hover-close-delay'));
    },
  });

  const label = rest['aria-label'] ?? (rest['aria-labelledby'] ? undefined : 'Main');
  return (
    <nav className={cx(navigationMenu({ align }), className)} {...rest} aria-label={label}>
      <ul className={navigationMenu.part('list')}>
        {items.map((item, i) =>
          item.columns?.length ? (
            <PanelItem
              key={item.label}
              item={item}
              panelId={`${id}-panel-${i}`}
              open={current === item.label}
              onToggle={(next) => {
                // A press on a panel the pointer opened keeps it open, as the pointer meant.
                if (!next && byHover.current === item.label) {
                  byHover.current = null;
                  return;
                }
                show(next ? item.label : null);
              }}
              onClose={() => {
                if (now.current === item.label) show(null);
              }}
              hover={openOnHover ? hover(item.label) : undefined}
            />
          ) : (
            <li key={item.label} className={navigationMenu.part('item')}>
              <NavItem size="md" href={item.href ?? '#'} active={item.active}>
                {item.label}
              </NavItem>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

interface PanelItemProps {
  item: NavigationMenuItem;
  panelId: string;
  open: boolean;
  onToggle: (next: boolean) => void;
  onClose: () => void;
  hover?: { onPointerEnter: (event: ReactPointerEvent<HTMLLIElement>) => void; onPointerLeave: (event: ReactPointerEvent<HTMLLIElement>) => void };
}

function PanelItem({ item, panelId, open, onToggle, onClose, hover }: PanelItemProps) {
  const root = useRef<HTMLLIElement>(null);
  // In a narrow space the panel opens in place, in the flow of a stacked list: a press elsewhere or focus moving on
  // leaves it open, as a group in a list stays open.
  const [inPlace, setInPlace] = useState(false);
  useEffect(() => {
    if (open && root.current) setInPlace(isNarrow(root.current));
  }, [open]);
  const close = (back: boolean) => {
    onClose();
    if (back) root.current?.querySelector<HTMLElement>(`.${navigationMenu.part('trigger')}`)?.focus();
  };
  const dismiss = useDismiss({ open: open && !inPlace, root, onClose: close, blur: true });
  return (
    <li
      ref={root}
      className={navigationMenu.part('item')}
      onKeyDown={(event) => {
        dismiss.onKeyDown(event);
        if (open && inPlace && event.key === 'Escape' && !event.defaultPrevented) {
          event.preventDefault();
          event.stopPropagation();
          close(true);
        }
      }}
      onBlur={inPlace ? undefined : dismiss.onBlur}
      {...hover}
    >
      <NavItem
        size="md"
        caret
        active={item.active}
        aria-expanded={open}
        aria-controls={panelId}
        className={navigationMenu.part('trigger')}
        onClick={() => onToggle(!open)}
      >
        {item.label}
      </NavItem>
      <div id={panelId} className={navigationMenu.part('panel')} hidden={!open}>
        {item.columns?.map((column, c) => {
          const headingId = column.heading ? `${panelId}-heading-${c}` : undefined;
          return (
            <div key={c} className={navigationMenu.part('column')}>
              {column.heading && (
                <p id={headingId} className={navigationMenu.part('heading')}>
                  {column.heading}
                </p>
              )}
              <ul className={navigationMenu.part('links')} aria-labelledby={headingId}>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a className={navigationMenu.part('link')} href={link.href} aria-current={link.active ? 'page' : undefined}>
                      {link.icon && <Icon name={link.icon} className={navigationMenu.part('link-icon')} />}
                      <span className={navigationMenu.part('link-text')}>
                        <span className={navigationMenu.part('link-title')}>{link.title}</span>
                        {link.description && <span className={navigationMenu.part('link-description')}>{link.description}</span>}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {item.featured && <Featured featured={item.featured} id={`${panelId}-featured`} />}
      </div>
    </li>
  );
}

function Featured({ featured, id }: { featured: NavigationMenuFeatured; id: string }) {
  return (
    <div className={navigationMenu.part('featured')}>
      {featured.image ?? <ImagePlaceholder ratio={[9, 4]} />}
      <div className={navigationMenu.part('featured-text')}>
        <p id={id} className={navigationMenu.part('featured-title')}>
          {featured.title}
        </p>
        {featured.description && <p className={navigationMenu.part('featured-description')}>{featured.description}</p>}
      </div>
      <Link size="sm" standalone href={featured.href} trailingIcon="ArrowRight" aria-describedby={id} className={navigationMenu.part('featured-link')}>
        {featured.linkLabel}
      </Link>
    </div>
  );
}
