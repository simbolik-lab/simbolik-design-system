import type { HTMLAttributes } from 'react';
import { imagePlaceholder } from './image-placeholder.manifest.js';
import { cx } from '../variants.js';

export interface ImagePlaceholderProps extends HTMLAttributes<HTMLSpanElement> {
  /** Width over height of the picture it stands for, e.g. [1, 1]. */
  ratio?: [number, number];
  /** Describes what will appear here, for assistive technology. Omit when decorative. */
  label?: string;
}

export function ImagePlaceholder({ ratio, label, className, style, ...rest }: ImagePlaceholderProps) {
  const aspect = ratio ? { aspectRatio: `${ratio[0]} / ${ratio[1]}` } : undefined;
  return (
    <span
      className={cx(imagePlaceholder(), className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      style={{ ...aspect, ...style }}
      {...rest}
    />
  );
}
