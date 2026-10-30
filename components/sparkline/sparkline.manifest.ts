import { defineVariants } from '../variants.js';

/**
 * Sparkline. Figma "Sparkline" 7580:152 (Shape × Area, 8 variants). Shape (rising, falling, steady, spiky) is
 * Figma's example data, not an axis: the wrapper draws whatever values it is given. Area is the `area` flag.
 */
export const sparkline = defineVariants({
  name: 'sparkline',
  block: 'smbk-sparkline',
  summary: 'A small line beside a figure that shows how it moved: rising, falling, steady or spiky. The figure carries the meaning.',
  adapt: 'css',
  axes: {},
  flags: {
    area: { description: 'The soft fill under the line.' },
  },
  parts: ['plot', 'svg', 'area', 'line', 'dot'],
  figmaNodeId: '7580:152',
});
