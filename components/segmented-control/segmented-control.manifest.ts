import { defineVariants } from '../variants.js';

/** Segmented control. Figma "SegmentedControl" 4209:19853 over "SegmentItem" 4207:19346. */
export const segmentedControl = defineVariants({
  name: 'segmented-control',
  block: 'smbk-segmented',
  summary: 'A row of named choices in one bar, exactly one of which is selected, with the selected one raised.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
    },
    'item-width': {
      values: ['equal', 'hug'],
      default: 'equal',
      description: "Equal: every item as wide as the widest, so they share the bar equally, and fill it when the bar is given a width; Figma's items fill their bar this way. Hug: each item as wide as its words. Not in Figma, which draws equal only.",
    },
  },
  flags: {},
  parts: ['indicator', 'item', 'icon', 'label'],
  figmaNodeId: '4209:19853',
});
