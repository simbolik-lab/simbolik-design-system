import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { tag } from './tag.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, VariantProps<typeof tag.manifest> {
  /** Phosphor icon before the label. */
  icon?: string;
  onRemove?: MouseEventHandler<HTMLButtonElement>;
  /** Accessible name of the remove control. Required with onRemove. */
  removeLabel?: string;
  children: ReactNode;
}

export function Tag({ scheme, icon, onRemove, removeLabel, className, children, ...rest }: TagProps) {
  const classes = [tag({ scheme }), className].filter(Boolean).join(' ');
  if (onRemove && !removeLabel) throw new Error('A removable Tag needs a removeLabel so its remove control has an accessible name.');
  return (
    <span className={classes} {...rest}>
      {icon && <Icon name={icon} className={tag.part('icon')} />}
      <span className={tag.part('label')}>{children}</span>
      {onRemove && (
        <button type="button" className={tag.part('remove')} aria-label={removeLabel} onClick={onRemove}>
          <Icon name="X" />
        </button>
      )}
    </span>
  );
}
