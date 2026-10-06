import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { navItem } from './nav-item.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

interface Common extends VariantProps<typeof navItem.manifest> {
  /** Phosphor icon name shown before the label. Figma: the Leading Icon toggle. */
  icon?: string;
  /** Shows the caret. Set when the item opens a group of links. */
  caret?: boolean;
  /** Marks the item as the current page. */
  active?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export type NavItemProps = Common &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)
  );

/** Navigation item: a link when it has an address, a button when it opens something. */
export function NavItem(props: NavItemProps) {
  const { size, block, icon, caret, active, disabled, className, children, ...rest } = props;
  const classes = [navItem({ size, block }), className].filter(Boolean).join(' ');
  const inner = (
    <>
      {icon && <Icon name={icon} className={navItem.part('icon')} />}
      <span className={navItem.part('label')}>{children}</span>
      {caret && <Icon name="CaretDown" className={navItem.part('caret')} />}
    </>
  );
  if (rest.href !== undefined) {
    const { href, ...a } = rest as { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={classes} href={disabled ? undefined : href} aria-current={active ? 'page' : undefined} aria-disabled={disabled ? true : undefined} {...a}>
        {inner}
      </a>
    );
  }
  const { href: _h, ...b } = rest as { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} aria-current={active ? 'page' : undefined} disabled={disabled} {...b}>
      {inner}
    </button>
  );
}
