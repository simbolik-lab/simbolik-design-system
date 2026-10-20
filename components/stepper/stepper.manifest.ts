import { defineVariants } from '../variants.js';

/**
 * Stepper. Figma "Stepper" 7117:303 (Layout: Horizontal, Vertical, Summary) over "Stepper item" 7117:227
 * (Status × State × Orientation, 18 variants). One component here: the item is the stepper's `item` part.
 * Its Status is a modifier of the part (smbk-stepper__item--status-complete), since each step has its own;
 * its Orientation follows the stepper's layout, and Hover and Focus are the step's own states, never classes.
 */
export const stepper = defineVariants({
  name: 'stepper',
  block: 'smbk-stepper',
  summary: 'Where the reader is in a form or task of three or more ordered steps: each step\'s mark, name and status in words, joined by a line; or "Step 2 of 4" with the step\'s name and a slim track.',
  adapt: 'css',
  axes: {
    layout: {
      values: ['horizontal', 'vertical', 'summary'],
      default: 'horizontal',
      description: 'Horizontal lists the steps in a row and gives the summary instead where the layout is narrow. Vertical lists them one under another. Summary gives "Step 2 of 4", the step\'s name and a slim track at any width.',
    },
  },
  flags: {},
  parts: ['list', 'item', 'step', 'marker-row', 'marker', 'number', 'icon', 'connector', 'text', 'label', 'status', 'hidden', 'summary', 'summary-text', 'count', 'step-name', 'track'],
  figmaNodeId: '7117:303',
});
