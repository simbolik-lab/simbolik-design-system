import { defineVariants } from '../variants.js';

/**
 * Number field. Figma "Number field" 7106:947: State (Default, Hover, Focus, Disabled, Read-only, Error) × Size, 12 variants,
 * built from the Input with the unit, a hairline and two ghost icon buttons in its Trailing action slot. The states are the
 * input's; read-only and disabled are the native attributes, and the step buttons are disabled with them and at the limits.
 * The markup carries the input's block, size and error classes as well as these.
 */
export const numberField = defineVariants({
  name: 'number-field',
  block: 'smbk-number-field',
  summary: 'A text field for a quantity or a measure, with its unit and minus and plus buttons that step it between its limits.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'The input’s two heights, with its padding and text. The step buttons’ icons are 16 px at both; at sm each button is a 24 px square, so it fits inside the small well. Small text never goes under 16 px on a phone.',
    },
  },
  flags: {
    error: { description: 'The number is not one the form can take. Draws the danger border, kept while focused, and the error icon before the unit.' },
  },
  parts: ['control', 'unit', 'separator', 'decrement', 'increment'],
  figmaNodeId: '7106:947',
});
