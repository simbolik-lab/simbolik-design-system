import type { HTMLAttributes } from 'react';
import { icon } from './icon.manifest.js';
import type { VariantProps } from '../variants.js';

export interface IconProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof icon.manifest> {
  /** Phosphor icon name, as Figma names it ("ArrowCircleRight") or as Phosphor does ("arrow-circle-right"). */
  name: string;
  /** Accessible name. Omit for a decorative icon, which is then hidden from assistive technology. */
  label?: string;
}

/** "ArrowCircleRight" -> "arrow-circle-right". Phosphor's font class is derived from it. */
export function phosphorClass(name: string): string {
  const kebab = name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
  return `ph ph-${kebab}`;
}

export function Icon({ name, label, size, className, ...rest }: IconProps) {
  const classes = [phosphorClass(name), icon({ size }), className].filter(Boolean).join(' ');
  return label ? (
    <i className={classes} role="img" aria-label={label} {...rest} />
  ) : (
    <i className={classes} aria-hidden="true" {...rest} />
  );
}
