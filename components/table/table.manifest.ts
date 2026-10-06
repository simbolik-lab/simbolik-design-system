import { defineVariants } from '../variants.js';

/**
 * Table. Figma "Table" 4318:16988 over TableHeader, TableHeaderCell (Default, Sort × Default, Active),
 * TableRow (Default, Hover, Disabled), TableRowCell (eleven content types) and TableFooter, on page 4312:13783.
 * The content types are what the consumer puts in a cell: a value with icon and copy, a value with a
 * description, a link, an avatar, a badge, a tag, actions, a picture. The table has no axes of its own.
 * Its two flags are behavior for long and wide tables; Figma draws neither.
 */
export const table = defineVariants({
  name: 'table',
  block: 'smbk-table',
  summary: 'Rows of data under sortable headings, with optional selection, drag handles and a foot for the pagination.',
  adapt: 'css',
  axes: {},
  flags: {
    'sticky-header': { description: 'A long table: the heading row stays in view while the table scrolls inside its frame. The consumer limits the frame\'s height; the frame is then a named region the keyboard can reach.' },
    'pin-first': { description: 'A wide table: the first column stays in view while the table scrolls sideways, so every row keeps its subject. For a table on the page canvas.' },
  },
  parts: ['table', 'caption', 'header-row', 'header', 'header-cell', 'header-text', 'header-label', 'header-name', 'header-icon', 'sort', 'row', 'cell', 'handle', 'content', 'value', 'value-icon', 'stack', 'description', 'copy', 'footer', 'scroll-hint', 'scroll-track', 'scroll-thumb'],
  figmaNodeId: '4318:16988',
});
