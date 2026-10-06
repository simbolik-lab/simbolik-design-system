import { defineVariants } from '../variants.js';

/** Drawer. Figma "Drawer" 4212:23947 (Position: Left, Right, Top, Bottom) with "DrawerBody" 4237:27911 (Nav, Text). */
export const drawer = defineVariants({
  name: 'drawer',
  block: 'smbk-drawer',
  summary: 'A panel that slides in from one edge of the window over a scrim, with a header, a scrolling body and a footer of actions.',
  adapt: 'css',
  axes: {
    position: {
      values: ['right', 'left', 'top', 'bottom'],
      default: 'right',
      description: 'Which edge the panel comes from.',
    },
  },
  flags: {
    inline: { description: 'Shown in place with no scrim, for previews and documentation.' },
  },
  parts: ['header', 'heading', 'title', 'description', 'close', 'body', 'footer', 'actions'],
  figmaNodeId: '4212:23947',
});
