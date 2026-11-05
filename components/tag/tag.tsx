'use client';

import type { ButtonHTMLAttributes, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { tag } from './tag.manifest.js';
import { Icon } from '../icon/icon.js';
import { useNameWarning, useWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

interface CommonProps extends Omit<VariantProps<typeof tag.manifest>, 'pressable'> {
  className?: string;
  children: ReactNode;
}

/** What sits before the label: an icon of the font, or a picture of the page's own, never both. */
type Leading =
  | {
      /** Phosphor icon before the label. */
      icon?: string;
      leadingContent?: undefined;
    }
  | {
      icon?: undefined;
      /**
       * The page's own picture before the label, in the icon's place and at the icon's size: an inline svg, drawn in
       * the tag's text color where it fills or strokes with currentColor, or an img, each filling the icon's box; any
       * other element is held to the box. It is read with the tag's words, so hide one that only repeats them
       * (aria-hidden on the svg, an empty alt on the img).
       */
      leadingContent?: ReactNode;
    };

/** A tag is pressed or removed, never both: its remove control would be a button inside a button. */
type Action =
  | ({
      onClick?: undefined;
      onRemove?: () => void;
      /**
       * Accessible name of the remove control, such as "Remove Design". Needed with onRemove: without it the control
       * is named "Remove" and the tag's words when they are plain text, and a warning shows in development.
       */
      removeLabel?: string;
    } & Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'children' | 'onClick'>)
  | ({
      /**
       * Makes the tag a button that opens something about what it names, such as a card. A popover gives it one
       * when the tag is its trigger.
       */
      onClick: MouseEventHandler<HTMLButtonElement>;
      onRemove?: undefined;
      removeLabel?: undefined;
    } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'onClick' | 'disabled'>);

export type TagProps = CommonProps & Leading & Action;

/**
 * Tag: a small label naming a category, with an optional icon or picture and remove control.
 *
 *   <Tag tone="brand" icon="Star">Featured</Tag>
 *
 * Given onClick, the tag is a button that opens something about what it names, drawn in the tag's own shape with a
 * control's hover, pressed and focus looks; otherwise it is a span. As a popover's trigger it gets its onClick, id and
 * aria-* from the popover:
 *
 *   <Popover trigger={<Tag leadingContent={<svg aria-hidden="true" …/>}>Behemoth</Tag>}>…</Popover>
 *
 * A removable tag is never pressable: given both, it is drawn removable and warns in development.
 */
export function Tag(props: TagProps) {
  const { tone, icon, leadingContent, onClick, onRemove, removeLabel, className, children, ...rest } = props;
  const picture = leadingContent != null && leadingContent !== false;
  const pressable = onClick !== undefined && !onRemove;
  useWarning(onClick !== undefined && Boolean(onRemove), 'A Tag cannot be pressed and removable at once, since its remove control would be a button inside a button. It is drawn removable, without the press: drop onRemove, or open what it names from elsewhere.');
  useWarning(picture && Boolean(icon), 'A Tag takes an icon or leadingContent before its label, not both. It draws the leading content.');
  useNameWarning('A removable Tag’s remove control', !onRemove || Boolean(removeLabel), 'Give the tag a removeLabel, such as "Remove Design"; until then it is named "Remove" and the tag’s words.');
  const classes = cx(tag({ tone, pressable }), className);
  const removeName = removeLabel || (typeof children === 'string' || typeof children === 'number' ? `Remove ${children}` : 'Remove');
  const content = (
    <>
      {picture ? <span className={tag.part('leading-content')}>{leadingContent}</span> : icon && <Icon name={icon} className={tag.part('icon')} />}
      <span className={tag.part('label')}>{children}</span>
    </>
  );
  if (pressable) {
    return (
      <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} onClick={onClick}>
        {content}
      </button>
    );
  }
  return (
    <span className={classes} {...(rest as HTMLAttributes<HTMLSpanElement>)}>
      {content}
      {onRemove && (
        <button type="button" className={tag.part('remove')} aria-label={removeName} onClick={() => onRemove()}>
          <Icon name="X" />
        </button>
      )}
    </span>
  );
}
