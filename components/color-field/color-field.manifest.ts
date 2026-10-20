import { defineVariants } from '../variants.js';

/**
 * Color field. Figma "Color field" 7408:727: State (Default, Hover, Focus, Disabled, Error, Read-only) × Size (md, sm), 12 variants,
 * built on the Input with a Color swatch (sm at md, xs at sm) and the code in its Leading content slot. The states are the input's;
 * read-only and disabled are the native attributes. The markup carries the input's block, size and error classes as well as these.
 */
export const colorField = defineVariants({
  name: 'color-field',
  block: 'smbk-color-field',
  summary: 'A text field for a color code, such as #3E63DD, with the color shown at its start.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'The input’s two heights, with a 20 px swatch at md and a 16 px one at sm. Small text never goes under 16 px on a phone.',
    },
  },
  flags: {
    error: { description: 'The color is not one the form can take. Draws the danger border, kept while focused, and the error icon after the code.' },
  },
  parts: ['swatch', 'control'],
  figmaNodeId: '7408:727',
});
