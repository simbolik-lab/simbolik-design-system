import type { HTMLAttributes, ReactNode } from 'react';
import { card } from './card.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, VariantProps<typeof card.manifest> {
  /** Picture address. Required for any media placement other than none. */
  image?: string;
  imageAlt?: string;
  /**
   * The picture's own size in pixels. Given both, the page holds the
   * picture's place at its shape before it loads, so nothing below it moves.
   */
  imageWidth?: number;
  imageHeight?: number;
  /** `lazy` waits to fetch the picture until it nears the screen: for cards further down a long page. */
  imageLoading?: 'lazy' | 'eager';
  eyebrow?: string;
  title?: ReactNode;
  /** Phosphor icon drawn above the header. */
  icon?: string;
  /** Body text or elements. */
  children?: ReactNode;
  /** Footer content: a button, a link, or a byline. The divider is drawn by the card. */
  footer?: ReactNode;
  /**
   * The title's heading level, chosen by where the card sits in the page's
   * outline: one below the heading the card sits under. It never changes how
   * the title looks. Defaults to 3.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export function Card({ media, image, imageAlt, imageWidth, imageHeight, imageLoading, eyebrow, title, icon, className, children, footer, headingLevel = 3, ...rest }: CardProps) {
  const placement = media ?? (image ? 'top' : 'none');
  const Heading = `h${headingLevel}` as const;
  const classes = [card({ media: placement }), className].filter(Boolean).join(' ');
  return (
    <article className={classes} {...rest}>
      {placement !== 'none' && (
        <img className={card.part('media')} src={image} alt={imageAlt ?? ''} width={imageWidth} height={imageHeight} loading={imageLoading} />
      )}
      <div className={card.part('content')}>
        {(eyebrow || title || icon) && (
          <header className={card.part('header')}>
            {icon && <Icon name={icon} className={card.part('icon')} />}
            {eyebrow && <p className={card.part('eyebrow')}>{eyebrow}</p>}
            {title && <Heading className={card.part('title')}>{title}</Heading>}
          </header>
        )}
        {children && <div className={card.part('body')}>{children}</div>}
        {footer && <footer className={card.part('footer')}>{footer}</footer>}
      </div>
    </article>
  );
}
