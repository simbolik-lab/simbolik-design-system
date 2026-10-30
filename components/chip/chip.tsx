'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode, SyntheticEvent } from 'react';
import { chip } from './chip.manifest.js';
import { Icon } from '../icon/icon.js';
import { Avatar } from '../avatar/avatar.js';
import { useNameWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

interface CommonProps extends VariantProps<typeof chip.manifest> {
  /** Initials or image address for the avatar shown before the label. */
  avatar?: { initials?: string; src?: string; alt?: string };
  /** When given, a remove control follows the label and the chip itself is not a button. */
  onRemove?: () => void;
  /** Accessible name of the remove control, e.g. "Remove Jane Doe". Needed with onRemove: without it the control is named "Remove" and the chip's words when they are plain text, and a warning shows in development. */
  removeLabel?: string;
  className?: string;
  children: ReactNode;
}

export type ChipProps = CommonProps &
  (
    | ({ onRemove?: undefined; href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)
    | ({ onRemove: () => void; href?: undefined } & Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'children'>)
    | ({
        /** Where the chip goes. Given, the chip is a link: never selected and never removable. */
        href: string;
        onRemove?: undefined;
        selected?: never;
      } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>)
  );

/**
 * Chip. A selectable chip is a real button, pressed to toggle it. A removable
 * chip is a span carrying its label and a small remove button, so that there is
 * never a button inside a button.
 *
 * `selected` decides whether the button is a toggle. Given at all, true or
 * false, the chip is a toggle and says so: pressed or not pressed. Left out,
 * the chip is a plain button and says neither. A toggle that is on shows a tick
 * in the avatar's place, so the choice shows by more than its fill, whether
 * React or a page's own script turned it on (aria-pressed).
 *
 * Given `href`, the chip is a link to that address, drawn the same: a row of
 * related places, such as a site's services.
 */
export function Chip(props: ChipProps) {
  const { tone, size, selected, avatar, onRemove, removeLabel, className, children, ...rest } = props;
  const classes = cx(chip({ tone, size, selected }), className);
  // A remove control with no name warns in development and is named "Remove" and the chip's words, never thrown.
  useNameWarning('A removable Chip’s remove control', !onRemove || Boolean(removeLabel), 'Give the chip a removeLabel, such as "Remove Design"; until then it is named "Remove" and the chip’s words.');
  const removeName = removeLabel || (typeof children === 'string' || typeof children === 'number' ? `Remove ${children}` : 'Remove');
  // aria-disabled keeps the chip in the tab order but it does nothing: a click, Enter or Space runs no handler,
  // a link goes nowhere, and the remove control removes nothing.
  const blocked = rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';
  const block = (e: SyntheticEvent) => e.preventDefault();
  const small = size === 'sm';
  // Only a toggle carries the tick: a removable chip or a link is never pressed. It is always in the markup and the
  // stylesheet shows it while the chip is on, so a page's script that presses the chip (aria-pressed) gets it too.
  const toggle = selected !== undefined && !onRemove && !('href' in rest && rest.href !== undefined);
  const content = (
    <>
      {toggle && <Icon name="Check" className={chip.part('tick')} />}
      {avatar && (
        <Avatar size={small ? '2xs' : 'xs'} tone="inverse" type={avatar.src ? 'image' : 'initials'} src={avatar.src} alt={avatar.alt ?? ''} className={chip.part('avatar')}>
          {avatar.initials}
        </Avatar>
      )}
      <span className={chip.part('label')}>{children}</span>
    </>
  );
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} {...(blocked && { onClick: block })}>
        {content}
      </a>
    );
  }
  if (onRemove) {
    return (
      <span className={classes} {...(rest as HTMLAttributes<HTMLSpanElement>)}>
        {content}
        <button type="button" className={chip.part('remove')} aria-label={removeName} aria-disabled={blocked || undefined} onClick={blocked ? block : () => onRemove()}>
          <Icon name="XCircle" />
        </button>
      </span>
    );
  }
  const buttonAttrs = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} aria-pressed={selected} {...buttonAttrs} {...(blocked && { onClick: block })}>
      {content}
    </button>
  );
}
