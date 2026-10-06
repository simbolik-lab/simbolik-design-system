import { defineVariants } from '../variants.js';

/** Modal. Figma "Modal" 4212:26125 (Size: sm, md, lg). */
export const modal = defineVariants({
  name: 'modal',
  block: 'smbk-modal',
  summary: 'A centered dialog over a scrim for a short interruption: an icon and title, a body, and a footer of actions.',
  adapt: 'css',
  axes: {
    size: {
      values: ['sm', 'md', 'lg'],
      default: 'sm',
      description: 'The greatest width the panel takes.',
    },
  },
  flags: {
    inline: { description: 'Shown in place with no scrim, for previews and documentation.' },
  },
  parts: ['header', 'icon', 'title', 'close', 'body', 'footer'],
  figmaNodeId: '4212:26125',
});
