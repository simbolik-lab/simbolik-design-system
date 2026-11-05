import type { HTMLAttributes } from 'react';
import { breadcrumbs } from './breadcrumbs.manifest.js';
import { Icon } from '../icon/icon.js';
import { Button } from '../button/button.js';
import { Dropdown, DropdownItem } from '../dropdown/dropdown.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface Crumb {
  label: string;
  /** Omit on the last crumb: it is the current page and goes nowhere. */
  href?: string;
  /** A Phosphor icon before the name, decorative: the name says where the crumb goes. */
  icon?: string;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof breadcrumbs.manifest> {
  /** In order from the root to the current page. The last one is marked as the current page. */
  items: Crumb[];
  /** Accessible name of the navigation region. */
  label?: string;
  /** The name of the "more" button that opens the hidden crumbs, when folded. */
  moreLabel?: string;
}

/**
 * Breadcrumbs: a navigation landmark holding an ordered list of links, the last marked as the current page.
 * Folded (`overflow="collapsed"`), a trail of more than three keeps the first crumb, the parent and the current
 * page, and a "more" button between them opens the crumbs in between as a group of links (the dropdown's
 * navigation purpose).
 */
export function Breadcrumbs({ size, overflow, items, label = 'Breadcrumb', moreLabel = 'More pages', className, ...rest }: BreadcrumbsProps) {
  const classes = cx(breadcrumbs({ size, overflow }), className);
  const folded = overflow === 'collapsed' && items.length > 3;
  const hidden = folded ? items.slice(1, -2) : [];
  const separator = <Icon name="CaretRight" className={breadcrumbs.part('separator')} />;
  const crumb = (item: Crumb, i: number) => {
    const last = i === items.length - 1;
    const name = (
      <>
        {item.icon && <Icon name={item.icon} className={breadcrumbs.part('icon')} />}
        <span className={breadcrumbs.part('label')}>{item.label}</span>
      </>
    );
    return (
      <li key={i} className={breadcrumbs.part('item')}>
        {last ? (
          <a className={breadcrumbs.part('link')} aria-current="page">
            {name}
          </a>
        ) : (
          <a className={breadcrumbs.part('link')} href={item.href}>
            {name}
          </a>
        )}
        {!last && separator}
      </li>
    );
  };
  return (
    <nav aria-label={label} {...rest}>
      <ol className={classes}>
        {folded ? (
          <>
            {crumb(items[0]!, 0)}
            <li className={breadcrumbs.part('item')}>
              <Dropdown
                label={moreLabel}
                purpose="navigation"
                size={size === 'sm' ? 'sm' : 'md'}
                trigger={<Button tone="ghost" size="xs" icon="DotsThree" icon-only aria-label={moreLabel} className={breadcrumbs.part('more')} />}
              >
                {hidden.map((item, i) => (
                  <DropdownItem key={i} href={item.href} icon={item.icon}>
                    {item.label}
                  </DropdownItem>
                ))}
              </Dropdown>
              {separator}
            </li>
            {items.slice(-2).map((item, i) => crumb(item, items.length - 2 + i))}
          </>
        ) : (
          items.map(crumb)
        )}
      </ol>
    </nav>
  );
}
