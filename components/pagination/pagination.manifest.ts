import { defineVariants } from '../variants.js';

/**
 * Pagination. Figma "Pagination" 4253:3044 (Type: Default, Select, Range; Border: Yes, No; Page: First, Middle, Last).
 * Figma's Page shows where the current page sits, which is the page prop here. The short forms in a narrow
 * space are the layout switch, not an axis, and Figma does not draw them.
 */
export const pagination = defineVariants({
  name: 'pagination',
  block: 'smbk-pagination',
  summary: 'Moves between the pages of a long list: numbered buttons in a bar, Previous and Next around a select of pages, or a range readout for a table.',
  adapt: 'css',
  axes: {
    type: {
      values: ['numbers', 'select', 'range'],
      default: 'numbers',
      description: 'Figma: Default (numbers), Select, Range.',
    },
  },
  flags: {
    borderless: { description: 'The numbers bar without its border. Figma: Border=No.' },
  },
  parts: ['list', 'item', 'page', 'gap', 'status', 'previous', 'next', 'select', 'label', 'wide-only', 'narrow-only'],
  figmaNodeId: '4253:3044',
});
