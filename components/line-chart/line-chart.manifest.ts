import { defineVariants } from '../variants.js';

/**
 * Line chart. Figma "Line chart" 7580:757 (Type: Line, Area, Two lines; Data: Rising, Spiky; Legend, Marker,
 * X axis). Two lines is two series in the data, not a value of the axis: the second is drawn as the period it is
 * compared with. Data is Figma's example data. Legend, Marker and X axis are booleans of Figma's, props here.
 */
export const lineChart = defineVariants({
  name: 'line-chart',
  block: 'smbk-line-chart',
  summary: 'A trend over time: one line, or the same with a soft area under it, or this period against the last as a dashed line, with a value axis, light grid lines and one marked point.',
  adapt: 'css',
  axes: {
    type: {
      values: ['line', 'area'],
      default: 'line',
      description: 'The line alone, or with a soft fill of its color under it. A second series, the period it is compared with, is drawn as a dashed line either way.',
    },
  },
  flags: {},
  parts: ['legend', 'body', 'y-axis', 'y-label', 'plot', 'grid', 'gridline', 'baseline', 'series', 'svg', 'area', 'line', 'comparison', 'drop-line', 'marker', 'point', 'readout', 'x-axis', 'x-label', 'table', 'data'],
  figmaNodeId: '7580:757',
});
