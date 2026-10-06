import { defineVariants } from '../variants.js';

/** Pagination. Figma "Pagination" 4253:3044 (Type: Default, Select, Range; Border: Yes, No). */
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
  parts: ['list', 'item', 'page', 'gap', 'previous', 'next', 'select', 'label'],
  figmaNodeId: '4253:3044',
});
