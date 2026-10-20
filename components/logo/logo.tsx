import type { HTMLAttributes, SVGAttributes } from 'react';
import { logo } from './logo.manifest.js';
import { LOGO_SHAPES, type LogoShape } from './logo.shapes.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export type { LogoShape };

/**
 * A site's own logo as picture files, which keep their own colors: the whole logo, and the mark and the
 * wordmark alone where the logo has those forms, each with an optional dark version shown under the dark
 * theme. Give a dark version unless the file reads on both the light and the dark surfaces.
 */
export interface LogoPicture {
  /** The brand's name: the pictures' text alternative unless the page gives another. */
  name: string;
  /** The whole logo's file. */
  logo: string;
  logoDark?: string;
  /** The mark alone, for the logomark form (a narrow bar, a closed sidebar). */
  mark?: string;
  markDark?: string;
  /** The wordmark alone, for the logotype form. */
  type?: string;
  typeDark?: string;
}

export interface LogoProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'>, VariantProps<typeof logo.manifest> {
  /** Accessible name. Defaults to the brand name. */
  label?: string;
  /**
   * A site's own logo, drawn in place of the brand's: its name, its frame, the view boxes of the mark and the wordmark,
   * and their paths, in the form of the built-in brand's shapes (logo.shapes.ts). It takes the same color roles.
   */
  shapes?: LogoShape;
  /**
   * A site's own logo as picture files, drawn in place of the brand's shapes: the file for the form, and
   * its dark version under the dark theme. It keeps its own colors, so it does not follow the theme's.
   */
  picture?: LogoPicture;
}

/**
 * Logo: the shapes exported from Figma, drawn inline so the roles colour them. A site's own shapes take the brand's
 * place, and the block then carries no brand modifier, since the shapes are no brand of the system's. A site's own
 * picture files take it the same way, drawn as images that keep their own colors:
 *
 *   <Logo shapes={OUR_LOGO} form="logomark" />
 *   <Logo picture={{ name: 'Example', logo: '/logo.svg', logoDark: '/logo-dark.svg' }} />
 */
export function Logo({ brand = 'simbolik', form = 'logo', source, label, shapes, picture, className, ...rest }: LogoProps) {
  if (picture || source === 'picture') {
    if (!picture) throw new Error('A picture logo needs its files: give the logo a `picture`.');
    const files = form === 'logo' ? [picture.logo, picture.logoDark] : form === 'logomark' ? [picture.mark, picture.markDark] : [picture.type, picture.typeDark];
    if (!files[0]) throw new Error(`The ${picture.name} logo has no ${form === 'logomark' ? 'mark' : 'wordmark'} picture.`);
    const name = label ?? picture.name;
    return (
      <span
        className={cx(`${logo.manifest.block} ${logo.modifier('form', form)} ${logo.modifier('source', 'picture')}`, className)}
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
      >
        <img className={logo.part('picture')} src={files[0]} alt={name} />
        {files[1] && <img className={logo.part('picture-dark')} src={files[1]} alt={name} />}
      </span>
    );
  }
  const shape = shapes ?? LOGO_SHAPES[brand];
  const showMark = form !== 'logotype';
  const showType = form !== 'logomark';
  if (form === 'logotype' && !shape.typeBox) throw new Error(`The ${shape.name} logo has no wordmark-only form.`);
  // The view box for each form, from the frame sizes Figma exports.
  const bounds = form === 'logo' ? `0 0 ${shape.width} ${shape.height}` : form === 'logomark' ? shape.markBox : shape.typeBox;
  return (
    <svg
      className={cx(shapes ? `${logo.manifest.block} ${logo.modifier('form', form)} ${logo.modifier('source', 'shapes')}` : logo({ brand, form }), className)}
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
