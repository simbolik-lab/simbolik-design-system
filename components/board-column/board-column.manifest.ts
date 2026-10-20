import { defineVariants } from '../variants.js';

/**
 * Board column. Figma "Board column" 7118:731 (Meter and Action booleans) with its groups, Figma "Board
 * group" 7118:654 (Count, Dot and Show all booleans), as parts: a group lives only in a column. Figma's
 * booleans are whether the wrapper is given a meter, an action, a count, a dot or a "Show all", not flags.
 * The column's width is the layout switch's choice: the large column width on a wide screen, the full width
 * in a narrow space.
 */
export const boardColumn = defineVariants({
  name: 'board-column',
  block: 'smbk-board-column',
  summary: 'A lane of cards on a board: a title with a capacity meter and an action, then groups of cards, each with a label and a count.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['head', 'heading', 'title', 'meter', 'action', 'group', 'group-head', 'dot', 'group-label', 'count', 'cards', 'card', 'more'],
  figmaNodeId: '7118:731',
});
