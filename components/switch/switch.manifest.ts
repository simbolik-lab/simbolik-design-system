import { defineVariants } from '../variants.js';

/** Switch. Figma "Switch" 4086:11238: Size × Checked × Disabled × Focused, 18 variants. */
export const switchControl = defineVariants({
  name: 'switch',
  block: 'smbk-switch',
  summary: 'An on-or-off control that takes effect at once: a track with a thumb that slides to the on side.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'Figma calls these Large, Default and Small.',
    },
  },
  flags: {},
  parts: ['control', 'track', 'thumb', 'label'],
  figmaNodeId: '4086:11238',
});
