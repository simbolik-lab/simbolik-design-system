import { defineVariants } from '../variants.js';

/** Radio. Figma "Radio" 4086:11110: Size × State × Checked, 20 variants. Hover, focus and disabled are the native control's own; error is a flag. */
export const radio = defineVariants({
  name: 'radio',
  block: 'smbk-radio',
  summary: 'One of several choices, only one of which can be chosen, with its label beside it and an optional line under the label.',
  adapt: 'css',
  axes: {
    size: { values: ['md', 'sm'], default: 'md' },
  },
  flags: {
    error: { description: 'The choice is invalid, such as a required group left empty. An empty ring takes the danger edge; a chosen one keeps its fill inside a danger ring; the control also carries aria-invalid.' },
  },
  parts: ['control', 'circle', 'dot', 'label', 'text', 'description'],
  figmaNodeId: '4086:11110',
});
