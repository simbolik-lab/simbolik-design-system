import { defineVariants } from '../variants.js';

/** Link. Figma "Link" 4129:21956: State × Always underline × Size, 18 variants; icons are content. */
export const link = defineVariants({
  name: 'link',
  block: 'smbk-link',
  summary: 'Text that goes somewhere, in three sizes, with an optional icon and an optional permanent underline.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'Figma calls these Large, Medium and Small. Each is a body preset.',
    },
  },
  flags: {
    underline: { description: 'Underlined at rest, not only on hover. Figma calls this "Always underline".' },
  },
  parts: ['icon', 'label'],
  figmaNodeId: '4129:21956',
});
