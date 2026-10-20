import { defineVariants } from '../variants.js';

/** Link. Figma "Link" 4129:21956: State × Always underline × Size; icons are content. Figma's Always underline = No is the standalone flag. */
export const link = defineVariants({
  name: 'link',
  block: 'smbk-link',
  summary: 'Text that goes somewhere, in three sizes or the size of the text around it, with an optional icon; underlined, unless it stands on its own.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm', 'inherit'],
      default: 'lg',
      description: 'Figma calls these Large, Medium and Small, each a body preset; inherit takes the size of the text around it, as in a heading or a card title.',
    },
  },
  flags: {
    standalone: { description: 'A link standing on its own, outside running text: underlined on hover and press only.' },
  },
  parts: ['icon', 'label'],
  figmaNodeId: '4129:21956',
});
