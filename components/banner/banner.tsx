'use client';

import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { banner } from './banner.manifest.js';
import { Link } from '../link/link.js';
import { DismissButton } from '../dismiss-button.js';
import { Icon } from '../icon/icon.js';
import { toneIcons } from '../tone-icons.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface BannerLink extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string;
  label: ReactNode;
}

export interface BannerProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof banner.manifest> {
  /** The message: one short sentence. */
  children: ReactNode;
  /**
   * Phosphor icon before the message. Defaults to the tone's own: a megaphone on the neutral tone, and the alert's
   * icons on the others. False leaves it out, as Figma's Icon switch does; on a feedback tone, keep it.
   */
  icon?: string | false;
  /** The link after the message, drawn as Figma draws it: the small link, underlined. */
  link?: BannerLink;
  /** Shows the dismiss control. The page removes the banner and remembers the choice. */
  onDismiss?: () => void;
  /** The dismiss control's name, what a screen reader says for it. "Dismiss" unless given, for a page in another language. */
  dismissLabel?: string;
  /** The name the strip is announced by, as a region of the page. */
  label?: string;
}

const icons = { ...toneIcons, default: 'Megaphone' } as const;

export function Banner({ tone, children, icon, link, onDismiss, dismissLabel = 'Dismiss', label = 'Announcement', className, ...rest }: BannerProps) {
  const classes = cx(banner({ tone }), className);
  return (
    <div role="region" aria-label={label} className={classes} {...rest}>
      <div className={banner.part('content')}>
        <div className={banner.part('lead')}>
          {icon !== false && <Icon name={icon ?? icons[tone ?? 'default']} className={banner.part('icon')} />}
          <p className={banner.part('message')}>{children}</p>
        </div>
        {link && (() => {
          const { label: text, ...anchor } = link;
          return <Link size="sm" className={banner.part('link')} {...anchor}>{text}</Link>;
        })()}
      </div>
      {onDismiss && <DismissButton size="sm" label={dismissLabel} className={banner.part('dismiss')} onClick={() => onDismiss()} />}
    </div>
  );
}
