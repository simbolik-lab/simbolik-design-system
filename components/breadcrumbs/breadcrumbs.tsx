import type { HTMLAttributes } from 'react';
import { breadcrumbs } from './breadcrumbs.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface Crumb {
  label: string;
  /** Omit on the last crumb: it is the current page and goes nowhere. */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof breadcrumbs.manifest> {
  /** In order from the root to the current page. The last one is marked as the current page. */
  items: Crumb[];
  /** Accessible name of the navigation region. */
  label?: string;
}

/** Breadcrumbs: a navigation landmark holding an ordered list of links, the last marked as the current page. */
export function Breadcrumbs({ size, items, label = 'Breadcrumb', className, ...rest }: BreadcrumbsProps) {
  const classes = [breadcrumbs({ size }), className].filter(Boolean).join(' ');
  return (
    <nav aria-label={label} {...rest}>
      <ol className={classes}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className={breadcrumbs.part('item')}>
              {last ? (
                <a className={breadcrumbs.part('link')} aria-current="page">
                  {item.label}
                </a>
              ) : (
                <a className={breadcrumbs.part('link')} href={item.href}>
                  {item.label}
                </a>
              )}
              {!last && <Icon name="CaretRight" className={breadcrumbs.part('separator')} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
