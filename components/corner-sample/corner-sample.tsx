import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { cornerSample } from './corner-sample.manifest.js';
import { cx } from '../variants.js';

export interface CornerSampleProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * The corner's radius: a number of pixels, a CSS length such as "0.5rem", or a CSS value such as
   * "var(--smbk-radius-control-md)". A radius as large as the square or larger, such as a capsule's, draws as the square's
   * own size. None unless given.
   */
  radius?: number | string;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Corner sample: one corner drawn at one radius, a picture hidden from screen readers: the step's name and size beside it
 * say what it shows.
 */
export function CornerSample({ radius = 0, className, style, ref, ...rest }: CornerSampleProps) {
  const value = typeof radius === 'number' ? `${radius}px` : radius;
  return (
    <span
      ref={ref}
      aria-hidden="true"
      {...rest}
      style={{ ...style, '--smbk-corner-sample-radius': value } as CSSProperties}
      className={cx(cornerSample(), className)}
    />
  );
}
