import type { HTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import { descriptionList } from './description-list.manifest.js';
import { Icon } from '../icon/icon.js';
import { Link } from '../link/link.js';
import { Skeleton } from '../skeleton/skeleton.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface DescriptionListProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof descriptionList.manifest> {
  /** The heading over the rows, such as "Contact details". */
  heading?: ReactNode;
  /** The heading's level in the page's outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** DescriptionListRows. */
  children?: ReactNode;
  /** Reaches the outer div. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Description list: a heading over a real dl, each DescriptionListRow a div holding a dt and its dd.
 * It takes no focus of its own; each row's action link is a stop in the tab order.
 */
export function DescriptionList({ layout, heading, headingLevel = 3, className, children, ...rest }: DescriptionListProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className={cx(descriptionList({ layout }), className)} {...rest}>
      {heading !== undefined && heading !== null && heading !== false && <Heading className={descriptionList.part('heading')}>{heading}</Heading>}
      <dl className={descriptionList.part('rows')}>{children}</dl>
    </div>
  );
}

export interface DescriptionListAction {
  /** Where the action goes, such as the form that changes the value. */
  href: string;
  /** The words shown. "Change" unless given others. */
  label?: string;
  /**
   * Words added for screen readers only, so each action has a name of its own: "Change" reads as
   * "Change email address". The term, when it is text, unless given others.
   */
  hiddenText?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export interface DescriptionListRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The name of the value, such as "Email address". */
  term: ReactNode;
  /** The value. A row with none says it is missing. */
  children?: ReactNode;
  /** The value is not given. Shows the missing words, also when the row has no value. */
  missing?: boolean;
  /** The value exists but is not shown here: the hidden words after an icon, and nothing of the value in the page. */
  redacted?: boolean;
  /** The value is still loading: a line of skeleton, and the loading words for screen readers. */
  loading?: boolean;
  /** The words for a missing value. */
  missingText?: string;
  /** The words for a hidden value. */
  redactedText?: string;
  /** The words a screen reader hears for a value still loading. */
  loadingText?: string;
  /** A link at the end of the row, such as Change. */
  action?: DescriptionListAction;
  /** Reaches the row's div. */
  ref?: Ref<HTMLDivElement>;
}

/** One row of a DescriptionList: the term, its value, and an optional action, each its own element of the dl. */
export function DescriptionListRow({ term, children, missing, redacted, loading, missingText = 'Not provided', redactedText = 'Hidden', loadingText = 'Loading', action, className, ...rest }: DescriptionListRowProps) {
  const empty = children === undefined || children === null || children === false || children === '';
  const part = descriptionList.part;
  let value: ReactNode = children;
  if (loading) {
    value = (
      <>
        <Skeleton shape="text" />
        <span className={part('hidden')}>{loadingText}</span>
      </>
    );
  } else if (redacted) {
    value = (
      <span className={part('absent')}>
        <Icon name="EyeSlash" className={part('icon')} />
        {redactedText}
      </span>
    );
  } else if (missing || empty) {
    value = <span className={part('absent')}>{missingText}</span>;
  }
  const hidden = action ? (action.hiddenText ?? (typeof term === 'string' ? term : undefined)) : undefined;
  return (
    <div className={cx(part('row'), className)} {...rest}>
      <dt className={part('term')}>{term}</dt>
      <dd className={part('value')} aria-busy={loading || undefined}>
        {value}
      </dd>
      {action && (
        <dd className={part('action')}>
          <Link size="md" href={action.href} onClick={action.onClick}>
            {action.label ?? 'Change'}
            {hidden && <span className={part('hidden')}> {hidden}</span>}
          </Link>
        </dd>
      )}
    </div>
  );
}
