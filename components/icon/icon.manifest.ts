import { defineVariants } from '../variants.js';

/**
 * Icon: a Phosphor glyph drawn into one of the icon size boxes.
 *
 * Read from Figma's "icon" component set, which every other component places
 * instances of. Phosphor's web font renders through font-size, so the size box
 * and the glyph size are one value here.
 */
export const icon = defineVariants({
  name: 'icon',
  block: 'smbk-icon',
  summary: 'A Phosphor glyph in one of the system icon sizes, inheriting the color of the text beside it.',
  adapt: 'css',
  axes: {
    size: {
      values: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      default: 'md',
      description: 'The icon size box. Components that place an icon usually set this themselves.',
    },
  },
  flags: {},
  parts: [],
  figmaNodeId: '',
});
