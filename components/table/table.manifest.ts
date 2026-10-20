import { defineVariants } from '../variants.js';

/**
 * Table. Figma "Table" 4318:16988 over TableHeader, TableHeaderCell (Default, Sort × Default, Active × Sort direction
 * × Align Start, End, with Filter and Info buttons), TableRow (Default, Hover, Selected, Disabled, Pinned, Highlighted
 * × Data, Group heading, with Rule above and Expandable), TableDetailRow 7122:1471, TableRowCell (thirteen content
 * types × Align) and TableFooter, on page 4312:13783.
 * Most content types are what the consumer puts in a cell: a value with icon and copy, a value with a description,
 * a link, an avatar, a badge, a tag, actions, a picture, a figure with a bar (TableBar). Prose is a column's setting,
 * as is the alignment; the row states and the group heading are a row's. They are part modifiers, not axes: the
 * table has no axes of its own. Its two flags are behavior for long and wide tables; Figma draws neither.
 */
export const table = defineVariants({
  name: 'table',
  block: 'smbk-table',
  summary: 'Rows of data under headings that sort, filter and explain, with rows that open, pin or group, optional selection and a foot for the pagination.',
  adapt: 'css',
  axes: {},
  flags: {
    'sticky-header': { description: 'A long table: the heading row stays in view while the table scrolls inside its frame. The consumer limits the frame\'s height; the frame is then a named region the keyboard can reach.' },
    'pin-first': { description: 'A wide table: the first column stays in view while the table scrolls sideways, so every row keeps its subject. For a table on the page canvas.' },
  },
  parts: ['table', 'caption', 'header-row', 'header', 'header-cell', 'header-text', 'header-label', 'header-icon', 'sort', 'filter', 'filter-count', 'info', 'row', 'cell', 'start', 'lead', 'expander', 'pin', 'content', 'value', 'value-icon', 'stack', 'description', 'copy', 'prose', 'figure', 'bar', 'group', 'group-label', 'group-count', 'detail-row', 'detail', 'detail-title', 'footer', 'scroll-hint', 'scroll-track', 'scroll-thumb'],
  figmaNodeId: '4318:16988',
});
