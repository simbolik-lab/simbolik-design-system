import { defineVariants } from '../variants.js';

/**
 * Legend item. Figma "Legend item" 7580:15 (Swatch, 6 variants; Show value). It names one series of a chart:
 * the swatch in the series' data color, the name, and the value if shown. A chart's legend is a list of them,
 * laid out by the chart; Figma has no legend part of its own.
 */
export const legendItem = defineVariants({
  name: 'legend-item',
  block: 'smbk-legend-item',
  summary: 'Names one series of a chart: a swatch in its color, its name, and its value if shown. A list of them is the chart\'s legend.',
  adapt: 'css',
  axes: {
    swatch: {
      values: ['1', '2', '3', '4', '5', '6', '7', '8', 'series', 'muted'],
      default: '1',
      description: 'The series\' color: 1 to 8 are the categorical colors in their fixed order, series the one color of a single series, muted the gray for everything else ("Others").',
    },
  },
  flags: {},
  parts: ['swatch', 'label', 'value'],
  figmaNodeId: '7580:15',
});
