import type { HTMLAttributes, ReactNode } from 'react';
import { tooltip } from './tooltip.manifest.js';
import type { VariantProps } from '../variants.js';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tooltip.manifest> {
  children: ReactNode;
}

/**
 * Tooltip: the bubble and its arrow. Give it an id and point the target's
 * aria-describedby at it; showing and placing it is the page's job until a
 * positioning behaviour is added.
 */
export function Tooltip({ arrow, inverse, className, children, ...rest }: TooltipProps) {
  return (
    <span role="tooltip" className={[tooltip({ arrow, inverse }), className].filter(Boolean).join(' ')} {...rest}>
      <span className={tooltip.part('bubble')}>{children}</span>
      <span className={tooltip.part('arrow')} aria-hidden="true" />
    </span>
  );
}
