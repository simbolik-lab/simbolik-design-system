import type { SVGAttributes } from 'react';
import { logo } from './logo.manifest.js';
import { LOGO_SHAPES, type LogoShape } from './logo.shapes.js';
import type { VariantProps } from '../variants.js';

export type { LogoShape };

export interface LogoProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'>, VariantProps<typeof logo.manifest> {
  /** Accessible name. Defaults to the brand name. */
  label?: string;
  /**
   * A site's own logo, drawn in place of the brand's: its name, its frame, the view boxes of the mark and the wordmark,
   * and their paths, in the form of the built-in brand's shapes (logo.shapes.ts). It takes the same color roles.
   */
  shapes?: LogoShape;
}

/**
 * Logo: the shapes exported from Figma, drawn inline so the roles colour them. A site's own shapes take the brand's
 * place, and the block then carries no brand modifier, since the shapes are no brand of the system's.
 *
 *   <Logo shapes={OUR_LOGO} form="logomark" />
 */
export function Logo({ brand = 'simbolik', form = 'logo', label, shapes, className, ...rest }: LogoProps) {
  const shape = shapes ?? LOGO_SHAPES[brand];
  const showMark = form !== 'logotype';
  const showType = form !== 'logomark';
  if (form === 'logotype' && !shape.typeBox) throw new Error(`The ${shape.name} logo has no wordmark-only form.`);
  // The view box for each form, from the frame sizes Figma exports.
  const bounds = form === 'logo' ? `0 0 ${shape.width} ${shape.height}` : form === 'logomark' ? shape.markBox : shape.typeBox;
  return (
    <svg
      className={[shapes ? `${logo.manifest.block} ${logo.modifier('form', form)}` : logo({ brand, form }), className].filter(Boolean).join(' ')}
      viewBox={bounds}
      role="img"
      aria-label={label ?? shape.name}
      {...rest}
    >
      {showMark && shape.mark.map((d, i) => <path key={`m${i}`} className={logo.part('mark')} d={d} />)}
      {showType && shape.type.map((d, i) => <path key={`t${i}`} className={logo.part('type')} d={d} />)}
    </svg>
  );
}
