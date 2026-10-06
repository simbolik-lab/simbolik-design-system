import type { HTMLAttributes, ReactNode } from 'react';
import { avatar } from './avatar.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, VariantProps<typeof avatar.manifest> {
  /** Picture address, for the image type. */
  src?: string;
  /** What the picture shows, or whose initials these are. Required for an image; empty when the name is written beside the avatar. */
  alt?: string;
  /** Phosphor icon name, for the icon type. */
  icon?: string;
  /** Initials, for the initials type. */
  children?: ReactNode;
}

export function Avatar({ size, scheme, type, src, alt, icon, className, children, ...rest }: AvatarProps) {
  const kind = type ?? (src ? 'image' : icon ? 'icon' : 'initials');
  const classes = [avatar({ size, scheme, type: kind }), className].filter(Boolean).join(' ');
  // Initials given alt are one image named by it, the person's name rather than their letters; without alt they are hidden, as an empty alt hides a picture.
  const named = kind === 'initials' && alt ? { role: 'img', 'aria-label': alt } : undefined;
  return (
    <span className={classes} {...named} {...rest}>
      {kind === 'image' && <img className={avatar.part('image')} src={src} alt={alt ?? ''} />}
      {kind === 'icon' && <Icon name={icon ?? 'User'} className={avatar.part('icon')} label={alt} />}
      {kind === 'initials' && (
        <span className={avatar.part('initials')} aria-hidden="true">
          {children}
        </span>
      )}
    </span>
  );
}
