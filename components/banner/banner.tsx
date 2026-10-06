import type { AnchorHTMLAttributes, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { banner } from './banner.manifest.js';
import { Link } from '../link/link.js';
import { Button } from '../button/button.js';
import type { VariantProps } from '../variants.js';

export interface BannerLink extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string;
  label: ReactNode;
}

export interface BannerProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof banner.manifest> {
  /** The message: one short sentence. */
  children: ReactNode;
  /** The link after the message, drawn as Figma draws it: the small link, underlined. */
  link?: BannerLink;
  /** Shows the dismiss control. The page removes the banner and remembers the choice. */
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  /** The name the strip is announced by, as a region of the page. */
  label?: string;
}

export function Banner({ tone, children, link, onDismiss, label = 'Announcement', className, ...rest }: BannerProps) {
  const classes = [banner({ tone }), className].filter(Boolean).join(' ');
  return (
    <div role="region" aria-label={label} className={classes} {...rest}>
      <div className={banner.part('content')}>
        <p className={banner.part('message')}>{children}</p>
        {link && (() => {
          const { label: text, ...anchor } = link;
          return <Link size="sm" underline className={banner.part('link')} {...anchor}>{text}</Link>;
        })()}
      </div>
      {onDismiss && (
        <Button tone="ghost" size="sm" icon-only icon="X" aria-label="Dismiss" className={banner.part('dismiss')} onClick={onDismiss} />
      )}
    </div>
  );
}
