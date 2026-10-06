import { defineVariants } from '../variants.js';

/**
 * Field. Figma "Field" 4800:63897: Error (No, Yes), with a Description boolean
 * and a slot that holds the control: an input, a select or a text area.
 */
export const field = defineVariants({
  name: 'field',
  block: 'smbk-field',
  summary: 'The frame around one form control: its label with an optional required mark above it, and help text or an error message under it.',
  adapt: 'css',
  axes: {},
  flags: {
    error: { description: 'The value is invalid. The label and the line under the control turn the danger color, and the control draws its danger border.' },
  },
  parts: ['label', 'description'],
  figmaNodeId: '4800:63897',
});
