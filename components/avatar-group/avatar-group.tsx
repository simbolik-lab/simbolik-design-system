import type { HTMLAttributes, Ref } from 'react';
import { Avatar, avatarInitials, type AvatarProps } from '../avatar/avatar.js';
import { avatarGroup } from './avatar-group.manifest.js';
import { cx } from '../variants.js';

/** One person in the group. */
export interface AvatarGroupPerson {
  /** Their name: the avatar's text alternative. */
  name: string;
  /** Their picture. Without one the avatar shows their initials. */
  src?: string;
  /** The initials shown without a picture. By default the first letters of the first and last words of the name. */
  initials?: string;
}

export interface AvatarGroupProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  /** The people, in the order they are drawn. */
  people: AvatarGroupPerson[];
  /** How many avatars to draw before the count of the rest. Three by default, as Figma draws it. */
  max?: number;
  /** How many people there are in all, when more than the list holds. The list's length by default. */
  total?: number;
  /**
   * The group's name, saying who they are and how many: "Assigned to 8 people". By default the count,
   * "8 people".
   */
  label?: string;
  /** What a screen reader hears for the count of the rest, given it: "and 3 more" unless given, for a page in another language. */
  moreLabel?: (count: number) => string;
  /** The avatars' tone, their colors. Brand by default, as Figma draws it. */
  tone?: AvatarProps['tone'];
  /** Reaches the list. */
  ref?: Ref<HTMLUListElement>;
}

const englishMore = (count: number) => `and ${count} more`;

/**
 * Avatar group: a list of people as overlapping avatars, then "+N" for the rest.
 *
 *   <AvatarGroup people={team} max={3} label="Assigned to 5 people" />
 *
 * The list is named by `label`, or by the count, so a screen reader says how many people it holds; each
 * avatar is named by the person's name, and the count is read as words ("and 3 more").
 */
export function AvatarGroup({ people, max = 3, total, label, moreLabel = englishMore, tone = 'brand', className, ...rest }: AvatarGroupProps) {
  const part = avatarGroup.part;
  const all = Math.max(total ?? people.length, people.length);
  const shown = people.slice(0, Math.max(0, Math.floor(max)));
  const more = all - shown.length;
  return (
    <ul role="list" aria-label={label ?? `${all} ${all === 1 ? 'person' : 'people'}`} className={cx(avatarGroup(), className)} {...rest}>
      {shown.map((p, i) => (
        <li key={`${p.name}-${i}`} className={part('item')}>
          <Avatar size="xs" tone={tone} src={p.src} alt={p.name}>
            {p.initials ?? avatarInitials(p.name)}
          </Avatar>
        </li>
      ))}
      {more > 0 && (
        <li className={part('more')}>
          <span aria-hidden="true">+{more}</span>
          <span className={part('hidden')}>{moreLabel(more)}</span>
        </li>
      )}
    </ul>
  );
}
