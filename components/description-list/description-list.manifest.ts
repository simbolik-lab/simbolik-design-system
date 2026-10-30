import { defineVariants } from '../variants.js';

/**
 * Description list. Figma "Description list" 7113:1025 (Layout) and "Description list row" 7113:941
 * (Layout × Value, 8 variants), one component here: the row is the list's `row` part. Figma's Value axis
 * (complete, missing, redacted, loading) is content, not a class: the wrapper writes the words, the icon or the
 * skeleton, and a value that is not shown wears the `absent` part. The size axis is built code first, to be drawn in Figma.
 */
export const descriptionList = defineVariants({
  name: 'description-list',
  block: 'smbk-description-list',
  summary: 'The facts about one thing, as rows of a name and its value, such as an account’s details or a record’s fields, with an optional action on each.',
  adapt: 'css',
  axes: {
    layout: {
      values: ['stacked', 'side-by-side'],
      default: 'stacked',
      description: 'Stacked puts each value under its name; side by side gives the names a column of their own. Side by side stacks in a narrow space, unless small.',
    },
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'Small is for a narrow panel, about 320 to 360 wide: the small text sizes and closer rows, and side by side the names take about a quarter of the row, so short values stay on one line.',
    },
  },
  flags: {},
  parts: ['heading', 'rows', 'row', 'term', 'value', 'absent', 'icon', 'action', 'hidden'],
  figmaNodeId: '7113:1025',
});
