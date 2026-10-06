import { defineVariants } from '../variants.js';

/** Kbd. Figma "Kbd" 888:8: three sizes; the key text is content. */
export const kbd = defineVariants({
  name: 'kbd',
  block: 'smbk-kbd',
  summary: 'A keyboard key: a small raised square with the key\'s symbol in the label face.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'Figma calls these Large, Medium and Small.',
    },
  },
  flags: {},
  parts: [],
  figmaNodeId: '888:8',
});
