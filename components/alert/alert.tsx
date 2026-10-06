import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { alert } from './alert.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alert.manifest> {
  /** Phosphor icon. Defaults to the bell Figma draws. */
  icon?: string;
  title?: ReactNode;
  children?: ReactNode;
  /** A small secondary button, as Figma's alert holds, or any action element. */
  action?: ReactNode;
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Whether the alert is a message that arrives while the reader is on the
   * page (true, the default) or part of the page as it loads (false).
   * A live alert is announced: danger and warning at once with the alert
   * role, the others politely with the status role. A static one carries the
   * note role and is read in place like the text around it, never announced.
   * It never changes how the alert looks.
   */
  live?: boolean;
}

export function Alert({ tone, icon = 'Bell', title, children, action, onDismiss, live = true, className, ...rest }: AlertProps) {
  const classes = [alert({ tone }), className].filter(Boolean).join(' ');
  const role = !live ? 'note' : tone === 'danger' || tone === 'warning' ? 'alert' : 'status';
  return (
    <div role={role} className={classes} {...rest}>
      <Icon name={icon} className={alert.part('icon')} />
      <div className={alert.part('body')}>
        {title && <p className={alert.part('title')}>{title}</p>}
        {children && <p className={alert.part('description')}>{children}</p>}
      </div>
      {action && <div className={alert.part('action')}>{action}</div>}
      {onDismiss && (
        <button type="button" className={alert.part('dismiss')} aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="X" />
        </button>
      )}
    </div>
  );
}
