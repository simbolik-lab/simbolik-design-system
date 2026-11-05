import { defineVariants } from '../variants.js';

/**
 * Table. Figma "Table" 4318:16988 over TableHeader, TableHeaderCell (Default, Sort × Default, Active × Sort direction
 * × Align Start, End, with Filter and Info buttons), TableRow (Default, Hover, Selected, Disabled, Pinned, Highlighted
 * × Data, Group heading, with Rule above and Expandable), TableDetailRow 7122:1471, TableRowCell (thirteen content
 * types × Align) and TableFooter, on page 4312:13783.
 * Most content types are what the consumer puts in a cell: a value with icon and copy, a value with a description,
 * a link, an avatar, a badge, a tag, actions, a picture, a figure with a bar (TableBar). Prose is a column's setting,
 * as are the alignment, the width and a heading taller than one line; the row states and the group heading are a row's.
 * They are part modifiers, not axes. The look is the table's one axis: framed, as Figma's Table draws it; flat, for a small table inside a card; or
 * filled, a calmer heading and foot on a neutral fill; Figma's Table draws neither of the last two yet. Three of its
 * flags are behavior for long and wide tables, in the framed and filled looks: the heading row held in a frame of limited
 * height or in the page, and the first column held; Figma draws none. The fourth, for every look, lines a row's cells up
 * at its top, TableRow's Align=Top. Its density is neither: the `density` prop writes the system's density attribute on
 * the frame, which the tokens answer, so it has no class and no rule of its own.
 */
/**
 * What a column's `width` takes: `rest`, the room the other columns leave; a share of the table, in steps of five; or
 * a size token, by its path. Each is a modifier of the column part, `smbk-table__column--width-<value>`. There is no
 * way to give a number, so a width can only be a proportion or a token.
 */
export const tableColumnWidths = [
  'rest',
  'share-5', 'share-10', 'share-15', 'share-20', 'share-25', 'share-30', 'share-35', 'share-40', 'share-45', 'share-50',
  'share-55', 'share-60', 'share-65', 'share-70', 'share-75', 'share-80', 'share-85', 'share-90', 'share-95',
  'size-40', 'size-48', 'size-56', 'size-64', 'size-72', 'size-80', 'size-88', 'size-96',
  'size-width-240', 'size-width-320', 'size-width-400', 'size-width-480',
] as const;

/**
 * What the table's `minWidth` takes: `none`, or a size token, by its path. Each is a modifier of the table part,
 * `smbk-table__table--min-width-<value>`.
 */
export const tableMinWidths = ['none', 'size-width-320', 'size-width-400', 'size-width-480', 'size-width-640', 'size-width-720', 'size-width-960'] as const;

export const table = defineVariants({
  name: 'table',
  block: 'smbk-table',
  summary: 'Rows of data under headings that sort, filter and explain, with rows that open, pin or group, optional selection and a foot for the pagination.',
  adapt: 'css',
  axes: {
    look: {
      values: ['framed', 'flat', 'filled'],
      default: 'framed',
      description: "Framed: a bordered, rounded frame, the heading row on its own surface, room at the sides. Flat, for a small table inside a card: no frame, no heading surface, a rule over every row, no room at the sides, so the table's words line up with the card's other lines, and rows one line of text high. A flat table takes none of sticky-header, page-sticky-header and pin-first. Filled, for a calmer table on the page: the framed frame and rows, the heading row and the foot on a neutral fill, group rows sunken and low, no lines between headings, the same room at a row's ends and between its columns, and the arrow of a column not sorted only on hover and keyboard focus.",
    },
  },
  flags: {
    'sticky-header': { description: 'A long table in a frame of its own: the heading row stays at the frame\'s top and the foot at its foot while the rows scroll inside it. The consumer limits the frame\'s height; the frame is then a named region the keyboard can reach. Framed and filled looks.' },
    'page-sticky-header': { description: 'A long table in the page: the frame keeps no height of its own, and the heading row stays in view under the room the page keeps clear at its top while the page scrolls, with the foot at the foot of the window, until the table ends. The table still scrolls sideways, its heading with it. Framed and filled looks.' },
    'pin-first': { description: 'A wide table: the first column stays in view while the table scrolls sideways, so every row keeps its subject. For a table on the page canvas, in the framed and filled looks.' },
    'align-top': { description: 'Cells of very different heights: every cell starts at the top of its row, and its first line sits level with the first line of the others, so the eye reads straight across a tall row. All three looks.' },
  },
  parts: ['table', 'caption', 'column', 'header-row', 'header', 'header-cell', 'header-text', 'header-label', 'header-block', 'header-icon', 'sort', 'filter', 'filter-count', 'info', 'row', 'row-press', 'cell', 'start', 'lead', 'expander', 'pin', 'content', 'choose-space', 'value', 'value-icon', 'stack', 'description', 'copy', 'prose', 'figure', 'bar', 'group', 'group-label', 'group-count', 'detail-row', 'detail', 'detail-title', 'footer', 'scroll-hint', 'scroll-track', 'scroll-thumb'],
  figmaNodeId: '4318:16988',
});
