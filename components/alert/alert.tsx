'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { alert } from './alert.manifest.js';
import { Icon } from '../icon/icon.js';
import { toneIcons } from '../tone-icons.js';
import { DismissButton } from '../dismiss-button.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alert.manifest> {
  /** Phosphor icon. Defaults to the tone's own: a bell, an info circle, a tick, a warning sign or a crossed circle. */
  icon?: string;
  title?: ReactNode;
  /** The description: a sentence, several paragraphs or a short bulleted list. Text alone needs no wrapper. */
  children?: ReactNode;
  /** A small secondary button, as Figma's alert holds, or several; any action element. */
  action?: ReactNode;
  onDismiss?: () => void;
  /** The dismiss cross's name, what a screen reader says for it. "Dismiss" unless given, for a page in another language. */
  dismissLabel?: string;
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

export function Alert({ tone, icon, title, children, action, onDismiss, dismissLabel, live = true, className, ...rest }: AlertProps) {
  const classes = cx(alert({ tone }), className);
  const role = !live ? 'note' : tone === 'danger' || tone === 'warning' ? 'alert' : 'status';
  // The page's attributes go first, so the role the alert sets from `live` and the tone is never replaced by accident.
  return (
    <div {...rest} role={role} className={classes}>
      {alertContent((name) => alert.part(name), { tone, icon, title, children, action, onDismiss, dismissLabel })}
    </div>
  );
}

/** The parts inside an alert's box. */
export type AlertPart = 'icon' | 'body' | 'title' | 'description' | 'action' | 'dismiss';

/** What an alert's box holds, given to `alertContent`. */
export interface AlertContent {
  tone?: keyof typeof toneIcons;
  icon?: string;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  /** The cross's name. "Dismiss" unless given. */
  dismissLabel?: string;
}

/**
 * The inside of an alert's box: the tone's icon, the title over the description, the action and the cross, each
 * carrying the part class `part` names. The alert draws it with its own parts; the toast, built on the alert, with
 * the toast's, and its description as a paragraph (`description: 'p'`).
 */
export function alertContent(part: (name: AlertPart) => string, { tone, icon, title, children, action, onDismiss, dismissLabel = 'Dismiss' }: AlertContent, description: 'div' | 'p' = 'div'): ReactNode {
  const Description = description;
  return (
    <>
      <Icon name={icon ?? toneIcons[tone ?? 'default']} className={part('icon')} />
      <div className={part('body')}>
        {title && <p className={part('title')}>{title}</p>}
        {children && <Description className={part('description')}>{children}</Description>}
      </div>
      {action && <div className={part('action')}>{action}</div>}
      {onDismiss && <DismissButton bare label={dismissLabel} className={part('dismiss')} onClick={() => onDismiss()} />}
    </>
  );
}
