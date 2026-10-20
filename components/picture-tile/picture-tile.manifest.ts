import { defineVariants } from '../variants.js';

/**
 * Picture tile. Figma "Picture tile" 7119:143 (Selected × State × Ratio, 20 variants). Figma's State is the
 * browser's own (pointing, pressing, focus, disabled), drawn by the stylesheet; Selected is the flag, which
 * the wrapper also gives as `aria-pressed`. Ratio's values are Figma's with the colon written as a hyphen.
 */
export const pictureTile = defineVariants({
  name: 'picture-tile',
  block: 'smbk-picture-tile',
  summary: 'A pressable tile with a picture and a short label under it, for choosing among looks, presets or templates in a gallery.',
  adapt: 'css',
  axes: {
    ratio: {
      values: ['4-3', '1-1'],
      default: '4-3',
      description: 'The picture\'s proportion, width to height: 4:3 or square.',
    },
  },
  flags: {
    selected: { description: 'The chosen tile: the rim edge at the emphasis width and a tick at the picture\'s corner. Pressed for assistive technology.' },
  },
  parts: ['picture', 'label', 'tick'],
  figmaNodeId: '7119:143',
});
