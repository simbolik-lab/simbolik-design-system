import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { toast } from './toast.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof toast.manifest> {
  icon?: string;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: MouseEventHandler<HTMLButtonElement>;
}

/** Toast: one message. Stacking, timing and placement belong to the page that shows toasts. */
export function Toast({ tone, icon = 'Bell', title, children, action, onDismiss, className, ...rest }: ToastProps) {
  const classes = [toast({ tone }), className].filter(Boolean).join(' ');
  return (
    <div role="status" className={classes} {...rest}>
      <Icon name={icon} className={toast.part('icon')} />
      <div className={toast.part('body')}>
        {title && <p className={toast.part('title')}>{title}</p>}
        {children && <p className={toast.part('description')}>{children}</p>}
      </div>
      {action && <div className={toast.part('action')}>{action}</div>}
      {onDismiss && (
        <button type="button" className={toast.part('dismiss')} aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="X" />
        </button>
      )}
    </div>
  );
}
