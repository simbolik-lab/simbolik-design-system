'use client';

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { emptyState } from './empty-state.manifest.js';
import { Icon } from '../icon/icon.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof emptyState.manifest> {
  /** What is missing or what went wrong, said plainly: "No notes match these filters". */
  title: ReactNode;
  /** The heading's level in the page's outline. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** A line under the title that says why, and what would bring the content: "Try fewer filters, or clear them all to see every note." */
  description?: ReactNode;
  /**
   * The icon, a Phosphor name, or false for none. Warning and danger show their own icon (Warning, XCircle) unless
   * given another; the default tone shows one only when given, since its cause decides it (MagnifyingGlass for no results).
   */
  icon?: string | false;
  /** The next best step, usually a brand button: "Clear filters", never a generic "Try again" when the cause is known. */
  primaryAction?: ReactNode;
  /** A second, quieter step, usually a link: "Learn more", "Contact support". */
  secondaryAction?: ReactNode;
  /** A reference to quote to support, such as "Reference: 7F2-K9Q", for an error on the server. Never a diagnostic. */
  reference?: ReactNode;
  /**
   * Reads the title and line out as they appear, and again when they change, without moving focus: for an empty
   * result after a search or a filter. Leave it off for an empty state shown as the page loads.
   */
  announce?: boolean;
  /** Free content between the words and the actions: a search field with the query kept, a short list of links. */
  children?: ReactNode;
  /** Reaches the outer div. */
  ref?: Ref<HTMLDivElement>;
}

const toneIcon = { default: undefined, warning: 'Warning', danger: 'XCircle' } as const;
const given = (node: ReactNode) => node !== undefined && node !== null && node !== false && node !== '';

/**
 * Empty state: stands in for a list, a table or a page that has nothing to show, or failed to load. Show it in place
 * of what it stands for, and only once the answer has come: never "nothing here" while still loading. It takes no
 * focus; its actions are ordinary buttons and links after its words.
 *
 *   <EmptyState scope="centered" icon="MagnifyingGlass" title="No notes match these filters"
 *     description="Try fewer filters, or clear them all to see every note."
 *     primaryAction={<Button onClick={clear}>Clear filters</Button>} announce />
 */
export function EmptyState({ scope, tone, size, title, headingLevel = 2, description, icon, primaryAction, secondaryAction, reference, announce, className, children, ...rest }: EmptyStateProps) {
  const part = emptyState.part;
  const Heading = `h${headingLevel}` as const;
  const shown = icon === false ? undefined : (icon ?? toneIcon[tone ?? 'default']);
  const hasActions = given(primaryAction) || given(secondaryAction);
  // A status region is read out when words arrive in it, not when it arrives full: it is drawn empty, and the words
  // shown are copied into it once they are on the page.
  const text = useRef<HTMLDivElement>(null);
  const [said, setSaid] = useState('');
  useEffect(() => {
    if (!announce) return;
    const words = [...(text.current?.children ?? [])].map((el) => el.textContent?.trim() ?? '').filter(Boolean).join('. ');
    if (words !== said) setSaid(words);
  });
  return (
    <div className={cx(emptyState({ scope, tone, size }), className)} {...rest}>
      {shown && <Icon name={shown} className={part('icon')} />}
      <div ref={text} className={part('text')}>
        <Heading className={part('title')}>
          {title}
        </Heading>
        {given(description) && <p className={part('description')}>{description}</p>}
      </div>
      {given(children) && <div className={part('context')}>{children}</div>}
      {hasActions && (
        <div className={part('actions')}>
          {primaryAction}
          {secondaryAction}
        </div>
      )}
      {given(reference) && <p className={part('reference')}>{reference}</p>}
      {announce && (
        <span role="status" className={part('hidden')}>
          {said}
        </span>
      )}
    </div>
  );
}
