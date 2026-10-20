import type { HTMLAttributes, Ref } from 'react';
import { useColorSwatch } from 'react-aria';
import type { Color } from 'react-stately';
import { colorSwatch } from './color-swatch.manifest.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ColorSwatchProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof colorSwatch.manifest> {
  /** The color: a CSS color string such as "#3E63DD", "rgb(62 99 221 / 50%)" or "hsl(226 70% 55%)", or a React Aria color. None when not given. */
  color?: string | Color | null;
  /**
   * The color's name, read in place of the one made from its value: a brand or paint name, such as "Signal blue". Without
   * it a screen reader hears the color in words made from its value, such as "vibrant blue", and "No color" for none.
   */
  colorName?: string;
  /**
   * A swatch beside words that already name its color, such as the code in a color field: hidden from screen readers,
   * which would only hear the color twice.
   */
  decorative?: boolean;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Color swatch: one color, as an image a screen reader names in words. React Aria's color swatch gives the name and the
 * parsed color; the color is painted on the color part, over the checkerboard. Given no color, it draws the none look and is
 * named "No color".
 */
export function ColorSwatch({ size, shape, none: _none, color, colorName, decorative, className, ref, ...rest }: ColorSwatchProps) {
  const none = color == null || color === '';
  const { colorSwatchProps } = useColorSwatch({
    color: none ? undefined : color,
    colorName: none ? (colorName ?? 'No color') : colorName,
    'aria-label': rest['aria-label'],
    'aria-labelledby': rest['aria-labelledby'],
    id: rest.id,
  });
  const { style: paint, ...named } = colorSwatchProps;
  const classes = cx(colorSwatch({ size, shape, none }), className);
  const a11y = decorative ? { 'aria-hidden': true as const } : named;
  return (
    <span ref={ref} {...rest} {...a11y} className={classes}>
      {!none && <span className="smbk-color-checker" />}
      {!none && <span className={colorSwatch.part('color')} style={{ backgroundColor: paint?.backgroundColor }} />}
      {none && <span className={colorSwatch.part('slash')} />}
    </span>
  );
}
