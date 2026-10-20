import { defineVariants } from '../variants.js';

/**
 * Field group. Figma "Field group" 7101:469: State (Default, Disabled, Error) × Layout (Vertical, Horizontal), 6 variants,
 * with a Help boolean and a slot of two to five Choice options (7101:128) or Choice cards of one kind. Disabled is the
 * fieldset's own attribute, so it is a flag that draws nothing of its own; error is a flag.
 */
export const fieldGroup = defineVariants({
  name: 'field-group',
  block: 'smbk-field-group',
  summary: 'Several radios, checkboxes or choice cards under one question: a fieldset with its legend, help, and one error message for the group.',
  adapt: 'css',
  axes: {
    layout: {
      values: ['vertical', 'horizontal'],
      default: 'vertical',
      description: 'Vertical stacks the options. Horizontal sets them in a row that wraps, only for a few short labels without lines under them.',
    },
  },
  flags: {
    error: { description: 'The answer is invalid, such as a required question left empty. Every option takes its error look and one message under the options says what to do.' },
    disabled: { description: 'Every option is disabled; the question and its help stay readable.' },
  },
  parts: ['legend', 'description', 'options', 'option', 'message'],
  figmaNodeId: '7101:469',
});
