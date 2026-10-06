import { defineVariants } from '../variants.js';

/** Input. Figma "Input" 4212:26450: State × Size, 14 variants; icons are content. */
export const input = defineVariants({
  name: 'input',
  block: 'smbk-input',
  summary: 'A single-line text field: a sunken well with an optional icon at either end, in two sizes.',
  adapt: 'css',
  axes: {
    size: { values: ['default', 'small'], default: 'default' },
  },
  flags: {
    error: { description: 'The value is invalid. Draws the danger border; the control also carries aria-invalid.' },
  },
  parts: ['control', 'icon'],
  figmaNodeId: '4212:26450',
});
