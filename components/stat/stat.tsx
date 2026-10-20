import { useId, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { StatusDot, type StatusDotProps } from '../status-dot/status-dot.js';
import { stat } from './stat.manifest.js';

export interface StatProps extends Omit<HTMLAttributes<HTMLDListElement>, 'children'>, Omit<VariantProps<typeof stat.manifest>, 'type'> {
  /** What the figure counts, above it, such as "Waiting on you". */
  name: ReactNode;
  /** The figure itself, such as 4 or "98.2%". */
  figure: ReactNode;
  /** A line under the figure that says what it means, such as "Pull requests to approve". */
  description?: ReactNode;
  /** Where the figure comes from. Given an address, the figure is a link and the whole tile follows it. */
  href?: string;
  /** A status dot before the name, in this tone, for a figure that needs attention. */
  dot?: StatusDotProps['tone'];
  /** What the dot means, in words a screen reader says, such as "Needs you". Required with a dot. */
  dotLabel?: string;
  /** Reaches the outer description list. */
  ref?: Ref<HTMLDListElement>;
}

/**
 * Stat: one figure, its name and a line of what it means, as a description list of its own.
 *
 *   <Stat name="Waiting on you" figure={4} description="Pull requests to approve" href="/reviews" />
 *
 * A linked stat is one link, named by the name and the figure together ("Waiting on you 4").
 */
export function Stat({ size, name, figure, description, href, dot, dotLabel, className, ...rest }: StatProps) {
  const part = stat.part;
  const id = useId();
  const classes = cx(stat({ size, type: href ? 'link' : 'static' }), className);
  return (
    <dl className={classes} {...rest}>
      <dt className={part('name')} id={`${id}-name`}>
        {dot && <StatusDot tone={dot} className={part('dot')} aria-label={dotLabel} />}
        {name}
      </dt>
      <dd className={part('figure')}>
        {href ? (
          <a className={part('link')} href={href} id={`${id}-figure`} aria-labelledby={`${id}-name ${id}-figure`}>
            {figure}
          </a>
        ) : (
          figure
        )}
      </dd>
      {description !== undefined && description !== null && description !== false && description !== '' && (
        <dd className={part('description')}>{description}</dd>
      )}
    </dl>
  );
}
