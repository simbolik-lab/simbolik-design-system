import { defineVariants } from '../variants.js';

/**
 * Board. Figma "Board" 7118:1603 (Platform: Desktop, Mobile). Figma's Platform is the layout switch's
 * choice, not an axis: side by side in a wide space, stacked in a narrow one.
 */
export const board = defineVariants({
  name: 'board',
  block: 'smbk-board',
  summary: 'Columns of cards, side by side on a wide screen in a frame that scrolls sideways, and stacked on a phone.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['columns', 'scroll-hint'],
  figmaNodeId: '7118:1603',
});
