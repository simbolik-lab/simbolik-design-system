import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { Avatar, avatarInitials, type AvatarProps } from '../avatar/avatar.js';
import { avatarWithName } from './avatar-with-name.manifest.js';

export interface AvatarWithNameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof avatarWithName.manifest> {
  /** The person's name, shown beside the avatar. */
  name: ReactNode;
  /** An optional line under the name, such as their role or a date. */
  secondLine?: ReactNode;
  /** The person's picture. Without one the avatar shows their initials. */
  src?: string;
  /** The initials shown without a picture. By default the first letters of the first and last words of the name. */
  initials?: string;
  /** The avatar's tone, its colors. Default by default, as Figma draws it. */
  tone?: AvatarProps['tone'];
  /** Reaches the outer element. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Avatar with name: an avatar, then the name over an optional second line.
 *
 *   <AvatarWithName size="md" name="Ana Silva" secondLine="Design lead" src={photo} />
 *
 * The avatar is decoration, since the name is written beside it: its picture has an empty text
 * alternative and its initials are hidden from screen readers, which read the name, then the second line.
 */
export function AvatarWithName({ size, name, secondLine, src, initials, tone, className, ...rest }: AvatarWithNameProps) {
  const part = avatarWithName.part;
  const second = secondLine !== undefined && secondLine !== null && secondLine !== false && secondLine !== '';
  return (
    <div className={cx(avatarWithName({ size }), className)} {...rest}>
      <Avatar size={size ?? avatarWithName.manifest.axes.size.default} tone={tone} src={src} alt="" className={part('avatar')}>
        {initials ?? (typeof name === 'string' ? avatarInitials(name) : '')}
      </Avatar>
      <span className={part('text')}>
        <span className={part('name')}>{name}</span>
        {second && <span className={part('second-line')}>{secondLine}</span>}
      </span>
    </div>
  );
}
