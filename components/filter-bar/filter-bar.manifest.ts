import { defineVariants } from '../variants.js';

/**
 * Filter bar. Figma "Filter bar" 7117:565: Layout (Wide, Narrow) × Condition (Pristine, Query entered, Filters
 * applied, Loading), 8 variants. Layout is the layout switch, not an axis (the narrow form reads --smbk-layout); the
 * conditions are content (a typed query, applied filters, the count's words), so there are no axes and no flags.
 * The search field, the filters button, the sort list, the chips and the spinner are the system's own; this block
 * lays them out and adds the applied row's Clear all and the result count.
 */
export const filterBar = defineVariants({
  name: 'filter-bar',
  block: 'smbk-filter-bar',
  summary: 'Search, filters, sort and Clear all together above a list or a table, with the filters applied as chips and the number of results they leave.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['controls', 'search', 'filters', 'narrow-filters', 'sort', 'view', 'opener', 'opener-count', 'applied', 'clear', 'count'],
  figmaNodeId: '7117:565',
});
