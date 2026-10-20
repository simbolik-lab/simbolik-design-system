import { defineVariants } from '../variants.js';

/**
 * Donut chart. Figma "Donut chart" 7580:1283 (Parts: 4, 3, 2; Legend; texts Figure and Caption). Parts is the
 * number of items in the data, not an axis. Each part's color is a modifier of the `part` part
 * (smbk-donut-chart__part--swatch-2), set from its place. Legend is a boolean of Figma's, a prop here; Figure and
 * Caption are the centre's words.
 */
export const donutChart = defineVariants({
  name: 'donut-chart',
  block: 'smbk-donut-chart',
  summary: 'Two to eight parts of a whole as a ring, with the total in the middle and a legend beside it that names each part with its value.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['ring', 'svg', 'part', 'center', 'figure', 'caption', 'legend', 'table', 'data'],
  figmaNodeId: '7580:1283',
});
