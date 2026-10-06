import { defineVariants } from '../variants.js';

/**
 * Table of contents. Figma "TableofContents" 4505:11351 (Platform: Desktop, Mobile; Open) over
 * "TableofContentsItem" (State × Type: Parent, Child). Platform is the layout switch, not an axis:
 * the card in a wide space, the folding box in a narrow one, as Figma draws them.
 * The extra part (content under the list, inside the card) is not drawn in Figma.
 */
export const tableOfContents = defineVariants({
  name: 'table-of-contents',
  block: 'smbk-toc',
  summary: 'A card listing the sections of the page, children indented, the one in view marked; in a narrow space a box whose heading row opens and closes the list.',
  adapt: 'css',
  axes: {},
  flags: {
    open: { description: 'The narrow form only: the list shows under the heading row. Figma: Open. In a wide space the list always shows.' },
  },
  parts: ['nav', 'label', 'label-text', 'toggle', 'heading', 'heading-text', 'icon', 'caret', 'body', 'indicator', 'list', 'item', 'extra'],
  figmaNodeId: '4505:11351',
});
