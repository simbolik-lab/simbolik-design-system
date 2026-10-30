import { defineVariants } from '../variants.js';

/**
 * One-time code input. Figma "One-time code input" 8217:3276 (State: Empty, Focused, Partly filled, Complete, Error,
 * Disabled). Each cell is Figma's Input at md, resized to the large control's square, so the cells carry the input's
 * classes at its lg size; the states are the value, focus, the error flag and the native disabled attribute.
 */
export const oneTimeCodeInput = defineVariants({
  name: 'one-time-code-input',
  block: 'smbk-one-time-code-input',
  summary: 'Six boxes in two groups of three that act as one field, for a code sent by email or text message.',
  adapt: 'css',
  axes: {},
  flags: {
    error: { description: 'The code is wrong or has run out. Draws the danger edge on every cell, kept while focused; the control also carries aria-invalid.' },
  },
  parts: ['group', 'cell', 'digit', 'control'],
  figmaNodeId: '8217:3276',
});
