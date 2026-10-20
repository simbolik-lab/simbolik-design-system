import type { HTMLAttributes, ReactNode } from 'react';
import { avatar } from './avatar.manifest.js';
import { Icon } from '../icon/icon.js';
import { usePictureFallback } from '../picture-fallback.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, VariantProps<typeof avatar.manifest> {
  /** Picture address, for the image type. */
  src?: string;
  /** What the picture shows, or whose initials these are. Required for an image; empty when the name is written beside the avatar. */
  alt?: string;
  /** Phosphor icon name, for the icon type. */
  icon?: string;
  /** Initials, for the initials type, and drawn in the picture's place when it fails to load. */
  children?: ReactNode;
}

/** The first letters of the first and last words of a name, for an avatar without a picture: "Ana Silva" gives "AS". */
export function avatarInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

/**
 * Avatar: a person or thing as a circle, with initials, an icon or a picture.
 *
 *   <Avatar size="md" tone="brand">MC</Avatar>
 */
export function Avatar({ size, tone, type, src, alt, icon, className, children, ...rest }: AvatarProps) {
  const picture = usePictureFallback(src);
  const asked = type ?? (src ? 'image' : icon ? 'icon' : 'initials');
  // A picture that fails to load, or an image avatar given none, gives way to the initials, or the icon when there are
  // none, with the same name: never the browser's broken-picture mark.
  const initials = children !== undefined && children !== null && children !== false && children !== '';
  const kind = asked === 'image' && (!src || picture.failed) ? (initials ? 'initials' : 'icon') : asked;
  const classes = cx(avatar({ size, tone, type: kind }), className);
  // Initials given alt are one image named by it, the person's name rather than their letters; without alt they are hidden, as an empty alt hides a picture.
  const named = kind === 'initials' && alt ? { role: 'img', 'aria-label': alt } : undefined;
  return (
    <span className={classes} {...named} {...rest}>
      {kind === 'image' && <img className={avatar.part('image')} src={src} alt={alt ?? ''} {...picture.props} />}
      {kind === 'icon' && <Icon name={icon ?? 'User'} className={avatar.part('icon')} label={alt} />}
      {kind === 'initials' && (
        <span className={avatar.part('initials')} aria-hidden="true">
          {children}
        </span>
      )}
    </span>
  );
}
