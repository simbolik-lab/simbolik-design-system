import { defineVariants } from '../variants.js';

/** Text area. Figma "TextArea" 4800:64744: State (Default, Hover, Focus, Filled, Error, Disabled, Read-only), 7 variants; the states are the input's. */
export const textArea = defineVariants({
  name: 'text-area',
  block: 'smbk-text-area',
  summary: 'A text box for several lines: the input well grown tall, with a grip at its corner to make it taller.',
  adapt: 'css',
  axes: {},
  flags: {
    error: { description: 'The value is invalid. Draws the danger border, kept while focused, and the error icon at the top end; the control also carries aria-invalid.' },
  },
  parts: ['control', 'grip'],
  figmaNodeId: '4800:64744',
});
