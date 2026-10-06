import { defineVariants } from '../variants.js';

/** Tag. Figma "Tag" 4088:12242: seven schemes; icon and remove control are content. */
export const tag = defineVariants({
  name: 'tag',
  block: 'smbk-tag',
  summary: 'A small uppercase label naming a category, with an optional leading icon and remove control.',
  adapt: 'css',
  axes: {
    scheme: {
      values: ['default', 'brand', 'outline', 'info', 'positive', 'negative', 'warning'],
      default: 'default',
      description: 'Neutral, brand, outlined, or one of the four feedback families on their subtle surfaces.',
    },
  },
  flags: {},
  parts: ['icon', 'label', 'remove'],
  figmaNodeId: '4088:12242',
});
