import type { HTMLAttributes, ReactNode } from 'react';
import { tag } from './tag.manifest.js';
import { Icon } from '../icon/icon.js';
import { useNameWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, VariantProps<typeof tag.manifest> {
  /** Phosphor icon before the label. */
  icon?: string;
  onRemove?: () => void;
  /**
   * Accessible name of the remove control, such as "Remove Design". Needed with onRemove: without it the control is
   * named "Remove" and the tag's words when they are plain text, and a warning shows in development.
   */
  removeLabel?: string;
  children: ReactNode;
}

/**
 * Tag: a small label naming a category, with an optional icon and remove control.
 *
 *   <Tag tone="brand" icon="Star">Featured</Tag>
 */
export function Tag({ tone, icon, onRemove, removeLabel, className, children, ...rest }: TagProps) {
  const classes = cx(tag({ tone }), className);
  useNameWarning('A removable Tag’s remove control', !onRemove || Boolean(removeLabel), 'Give the tag a removeLabel, such as "Remove Design"; until then it is named "Remove" and the tag’s words.');
  const removeName = removeLabel || (typeof children === 'string' || typeof children === 'number' ? `Remove ${children}` : 'Remove');
  return (
    <span className={classes} {...rest}>
      {icon && <Icon name={icon} className={tag.part('icon')} />}
      <span className={tag.part('label')}>{children}</span>
      {onRemove && (
        <button type="button" className={tag.part('remove')} aria-label={removeName} onClick={() => onRemove()}>
          <Icon name="X" />
        </button>
      )}
    </span>
  );
}
