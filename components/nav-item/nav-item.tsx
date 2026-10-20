import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { navItem } from './nav-item.manifest.js';
import { Icon } from '../icon/icon.js';
import { Badge } from '../badge/badge.js';
import { StatusDot } from '../status-dot/status-dot.js';
import { labelText } from '../label-text.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

interface Common extends VariantProps<typeof navItem.manifest> {
  /** Phosphor icon name shown before the label. Figma: the Leading Icon toggle. */
  icon?: string;
  /** Shows the caret. Set when the item opens a group of links. */
  caret?: boolean;
  /** Marks the item as the current page. */
  active?: boolean;
  /**
   * A count after the label, such as the number of open issues, drawn as a small badge. It is part of
   * the item's name, after a pause: "Issues, 18". Figma: the Count toggle.
   */
  count?: number | string;
  /**
   * A dot after the label saying something here changed. It is part of the item's name, in the words of
   * `dotLabel`. Figma: the Dot toggle.
   */
  dot?: boolean;
  /** The dot's words, read after the label: "Inbox, new". Defaults to "changed". */
  dotLabel?: string;
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
  const { size, block, icon, caret, active, count, dot, dotLabel = 'changed', disabled, className, children, ...rest } = props;
  const classes = cx(navItem({ size, block }), className);
  const pause = <span className={navItem.part('pause')}>, </span>;
  const counted = count !== undefined && count !== null && count !== '';
  const inner = (
    <>
      {icon && <Icon name={icon} className={navItem.part('icon')} />}
      <span className={navItem.part('label')} data-label={labelText(children)}>
        {children}
      </span>
      {counted && (
        <>
          {pause}
          <Badge size="sm" className={navItem.part('count')}>
            {count}
          </Badge>
        </>
      )}
      {dot && (
        <>
          {pause}
          <StatusDot tone="info" aria-label={dotLabel} className={navItem.part('dot')} />
        </>
      )}
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
