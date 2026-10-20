import { defineVariants } from '../variants.js';

/**
 * Color swatch. Figma "Color swatch" 7406:48: Size (lg, md, sm, xs) × Shape (Square, Round) × Value (Color, None), 16 variants.
 * The sizes bind size/32, 24, 20 and 16; the square's corner is radius/control md, sm, sm and xs. Value is not an axis here:
 * the color is data the page gives, and None is the `none` flag, set when no color is given. The checkerboard under the color is
 * the color checker's block.
 */
export const colorSwatch = defineVariants({
  name: 'color-swatch',
  block: 'smbk-color-swatch',
  summary: 'One color shown as a small square or dot, over a checkerboard so a see-through color shows, or crossed out when no color is set.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm', 'xs'],
      default: 'lg',
      description: '32, 24, 20 or 16 px across. The square’s corners get smaller with it.',
    },
    shape: {
      values: ['square', 'round'],
      default: 'square',
      description: 'Square for lists and fields; round for a row of dots.',
    },
  },
  flags: {
    none: { description: 'No color is set: the default surface crossed by a slash, named “No color”. Set by the component when it is given no color.' },
  },
  parts: ['color', 'slash'],
  figmaNodeId: '7406:48',
});
