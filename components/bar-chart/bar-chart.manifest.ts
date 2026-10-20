import { defineVariants } from '../variants.js';

/**
 * Bar chart. Figma "Bar chart" 7580:947 (Type: Bars, Stacked; Data: Week, Month; Legend, X axis). Data is
 * Figma's example data, a week or a month of bars: the wrapper draws as many bars as it has labels and sets them
 * closer together when there are many. Each segment's color is a modifier of the `segment` part
 * (smbk-bar-chart__segment--swatch-2), set from the series' place. Legend and X axis are booleans of Figma's,
 * props here.
 */
export const barChart = defineVariants({
  name: 'bar-chart',
  block: 'smbk-bar-chart',
  summary: 'Amounts side by side, such as a week of days or a month: plain bars, or bars stacked by kind with a legend, over a value axis and light grid lines.',
  adapt: 'css',
  axes: {
    type: {
      values: ['bars', 'stacked'],
      default: 'bars',
      description: 'One series as plain bars, the current one darker; or up to eight series stacked in each bar in the categorical colors, the rest gathered as Other.',
    },
  },
  flags: {},
  parts: ['legend', 'body', 'y-axis', 'y-label', 'plot', 'grid', 'gridline', 'baseline', 'bars', 'bar', 'segment', 'x-axis', 'x-cell', 'x-label', 'table', 'data'],
  figmaNodeId: '7580:947',
});
