'use client';

import type { AnchorHTMLAttributes, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { link } from './link.manifest.js';
import { Icon } from '../icon/icon.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

interface CommonProps extends Omit<VariantProps<typeof link.manifest>, 'pressable'> {
  leadingIcon?: string;
  trailingIcon?: string;
  children: ReactNode;
}

interface AnchorProps extends CommonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  as?: 'a';
  /** A disabled link keeps its text but goes nowhere. Without an address it is plain text to a screen reader, not an unavailable link. */
  disabled?: boolean;
}

interface PressProps extends CommonProps, Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Makes the words a press that goes nowhere: a name that opens its card, as a popover's `trigger`, or words given
   * `onClick` that open a part of the page. They take the color and, unless `size` says otherwise, the size of the
   * text around them, and they break across lines with it, which a real button cannot, so they are an inline span
   * with the button's role and keys.
   */
  as: 'button';
  href?: undefined;
  disabled?: undefined;
}

export type LinkProps = AnchorProps | PressProps;

/** The words with their icons, the same whichever element holds them. */
function Words({ leadingIcon, trailingIcon, children }: Pick<CommonProps, 'leadingIcon' | 'trailingIcon' | 'children'>) {
  const iconPart = link.part('icon');
  return (
    <>
      {leadingIcon && <Icon name={leadingIcon} className={iconPart} />}
      <span className={link.part('label')}>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} className={iconPart} />}
    </>
  );
}

/** What a button's keys do, which a span does not get by itself: Enter and Space press it, once however long they are held, and Space leaves the page where it is. */
function pressOnKey(e: KeyboardEvent<HTMLSpanElement>) {
  if (e.defaultPrevented || (e.key !== 'Enter' && e.key !== ' ')) return;
  e.preventDefault();
  if (!e.repeat) e.currentTarget.click();
}

function LinkPress({ as: _as, size = 'inherit', standalone, leadingIcon, trailingIcon, className, onKeyDown, children, ...rest }: PressProps) {
  return (
    <span
      role="button"
      tabIndex={0}
      className={cx(link({ size, standalone, pressable: true }), className)}
      {...rest}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        pressOnKey(e);
      }}
    >
      <Words leadingIcon={leadingIcon} trailingIcon={trailingIcon}>{children}</Words>
    </span>
  );
}

export function Link(props: LinkProps) {
  if (props.as === 'button') return <LinkPress {...props} />;
  const { as: _as, size, standalone, leadingIcon, trailingIcon, disabled, className, href, children, ...rest } = props;
  return (
    <a className={cx(link({ size, standalone }), className)} href={disabled ? undefined : href} aria-disabled={disabled ? true : undefined} {...rest}>
      <Words leadingIcon={leadingIcon} trailingIcon={trailingIcon}>{children}</Words>
    </a>
  );
}
