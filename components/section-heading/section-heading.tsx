'use client';

import { useId, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { sectionHeading } from './section-heading.manifest.js';
import { Badge } from '../badge/badge.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>, VariantProps<typeof sectionHeading.manifest> {
  /** The section's name, such as "Waiting on you". The heading's name is this alone. */
  title: ReactNode;
  /** The heading's level in the page's outline: 2 under the page's title, deeper inside another section. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** How many the section holds, drawn as a badge beside the title, outside the heading. */
  count?: ReactNode;
  /** Words a screen reader hears after the count, saying what it counts, such as "waiting": "3 waiting". */
  countLabel?: string;
  /** A quiet line under the title, such as how fresh the section is: "Updated a minute ago". */
  summary?: ReactNode;
  /** One action at the row's end: a link such as "See all", a small ghost button, or a group of two. */
  action?: ReactNode;
  /** Reaches the outer div. */
  ref?: Ref<HTMLDivElement>;
}

const given = (node: ReactNode) => node !== undefined && node !== null && node !== false && node !== '';

/**
 * Section heading: a heading of the level the page needs, its count as a badge beside it but outside the heading
 * element, tied to it as its description, a line under them, and one action at the row's end.
 *
 *   <SectionHeading title="Waiting on you" count={3} countLabel="waiting" summary="Updated a minute ago"
 *     action={<Link size="sm" href="/queue">See all</Link>} />
 *
 * A screen reader hears the heading as "Waiting on you" and its description as "3 waiting".
 */
export function SectionHeading({ size, title, headingLevel = 2, count, countLabel, summary, action, className, ...rest }: SectionHeadingProps) {
  const id = useId();
  const part = sectionHeading.part;
  const Heading = `h${headingLevel}` as const;
  const counted = given(count);
  const countId = counted ? `${id}-count` : undefined;
  return (
    <div className={cx(sectionHeading({ size }), className)} {...rest}>
      <div className={part('text')}>
        <div className={part('title-row')}>
          <Heading className={part('title')} aria-describedby={countId}>
            {title}
          </Heading>
          {counted && (
            <Badge id={countId} size={size === 'sm' ? 'sm' : 'md'} className={part('count')}>
              {count}
              {countLabel && <span className={part('hidden')}> {countLabel}</span>}
            </Badge>
          )}
        </div>
        {given(summary) && <p className={part('summary')}>{summary}</p>}
      </div>
      {given(action) && <div className={part('action')}>{action}</div>}
    </div>
  );
}
