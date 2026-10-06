import { defineVariants } from '../variants.js';

/** Radio. Figma "Radio" 4086:11110: Size × Focused × Checked × Disabled, 12 variants. */
export const radio = defineVariants({
  name: 'radio',
  block: 'smbk-radio',
  summary: 'One of several choices, only one of which can be chosen, with its label beside it.',
  adapt: 'css',
  axes: {
    size: { values: ['default', 'small'], default: 'default' },
  },
  flags: {},
  parts: ['control', 'circle', 'dot', 'label'],
  figmaNodeId: '4086:11110',
});
