import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { legendItem } from './legend-item.manifest.js';

export interface LegendItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'>, VariantProps<typeof legendItem.manifest> {
  /** The series' name, such as "Hosting". */
  label: ReactNode;
  /** The series' value, such as "$1,283", shown at the end of the line. */
  value?: ReactNode;
  /** Reaches the list item. */
  ref?: Ref<HTMLLIElement>;
}

/**
 * Legend item: one series of a chart, as a list item. Put them in a list (`ul`), in the order of the chart's
 * series. The swatch is decoration; the name is what a screen reader hears, then the value.
 */
export function LegendItem({ swatch, label, value, className, ...rest }: LegendItemProps) {
  const part = legendItem.part;
  const shown = value !== undefined && value !== null && value !== false && value !== '';
  return (
    <li className={cx(legendItem({ swatch }), className)} {...rest}>
      <span className={part('swatch')} aria-hidden="true" />
      <span className={part('label')}>{label}</span>
      {shown && <span className={part('value')}>{value}</span>}
    </li>
  );
}
