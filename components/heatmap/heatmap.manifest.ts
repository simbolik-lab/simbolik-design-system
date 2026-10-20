import { defineVariants } from '../variants.js';

/**
 * Heatmap. Figma "Heatmap" 7580:375 (Weeks: 26, 13; Legend). Weeks is the data's length, not an axis: the
 * wrapper draws as many weeks as the values cover, and a narrow layout shows the last 13 of them. Each day's
 * level is a modifier of the `cell` part (smbk-heatmap__cell--level-3), set from the data. Legend is a boolean of
 * Figma's, a prop here.
 */
export const heatmap = defineVariants({
  name: 'heatmap',
  block: 'smbk-heatmap',
  summary: 'A grid of days, a column for each week, each day shaded by how much happened, with the months above, a summary and a scale from less to more.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['chart', 'weekdays', 'weekday', 'week', 'month', 'month-name', 'cell', 'legend', 'summary', 'scale', 'scale-word', 'table', 'hidden'],
  figmaNodeId: '7580:375',
});
