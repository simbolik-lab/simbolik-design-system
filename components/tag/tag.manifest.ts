import { defineVariants } from '../variants.js';

/**
 * Tag. Figma "Tag" 4088:12242: Tone × State, 14 variants; icon and remove control are content, the State shows the
 * remove button's focus.
 */
export const tag = defineVariants({
  name: 'tag',
  block: 'smbk-tag',
  summary: 'A small label naming a category, with an optional leading icon and remove control.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['default', 'brand', 'outline', 'info', 'success', 'danger', 'warning'],
      default: 'default',
      description: 'A see-through gray that shows on every surface, brand, outlined, or one of the four feedback families on their subtle surfaces.',
    },
  },
  flags: {},
  parts: ['icon', 'label', 'remove'],
  figmaNodeId: '4088:12242',
});
