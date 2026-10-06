import { defineVariants } from '../variants.js';

/** Text area. Figma "TextArea" 4800:64744: State (Default, Hover, Pressed, Focused, Filled, Error, Disabled), 7 variants; the states are the input's. */
export const textArea = defineVariants({
  name: 'text-area',
  block: 'smbk-text-area',
  summary: 'A text box for several lines: the input well grown tall, with a grip at its corner to make it taller.',
  adapt: 'css',
  axes: {},
  flags: {
    error: { description: 'The value is invalid. Draws the danger border; the control also carries aria-invalid.' },
  },
  parts: ['control', 'grip'],
  figmaNodeId: '4800:64744',
});
