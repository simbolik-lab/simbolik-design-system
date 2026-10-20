import { defineVariants } from '../variants.js';

/**
 * Tree view. Figma "Tree view" 7607:118417 (a slot of rows) over "Tree item" 7580:1383 (Kind × Open × State × Level,
 * 36 variants; booleans Show meta and Changed). One component here, with no axes: each row is the `item` part, and
 * its Figma axes come from the markup. Kind is whether the item holds a group, Open is aria-expanded, Selected is
 * aria-selected, Hover the browser's own state, and Level the item's aria-level with --smbk-tree-level beside it,
 * since each row has its own and the code indents to any depth where Figma stops at four.
 */
export const treeView = defineVariants({
  name: 'tree-view',
  block: 'smbk-tree-view',
  summary: 'Folders and files, or any list that nests, opened and closed level by level: one row each, with a caret, an icon and the label.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['item', 'row', 'toggle', 'caret', 'icon', 'label', 'meta', 'changed', 'hidden', 'group'],
  figmaNodeId: '7607:118417',
});
