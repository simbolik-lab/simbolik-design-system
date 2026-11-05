import { defineVariants } from '../variants.js';

/** Link. Figma "Link" 4129:21956: State × Always underline × Size; icons are content. Figma's Always underline = No is the standalone flag. The pressable flag is the wrapper's `as="button"`, drawn beside it as "Link pressable" 8409:2913. */
export const link = defineVariants({
  name: 'link',
  block: 'smbk-link',
  summary: 'Text that goes somewhere, in three sizes or the size of the text around it, with an optional icon; underlined, unless it stands on its own. As a button it stays in the color of the words around it and opens something where it stands.',
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
    pressable: { description: 'Words that are pressed rather than followed, such as a name that opens its card: a button in the color of the text around it, its line always there.' },
  },
  parts: ['icon', 'label'],
  figmaNodeId: '4129:21956',
});
