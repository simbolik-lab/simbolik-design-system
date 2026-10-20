import { defineVariants } from '../variants.js';

/** Field message. Figma "Field message" 7101:46: Type (Help, Warning, Error), 3 variants; the text is content. */
export const fieldMessage = defineVariants({
  name: 'field-message',
  block: 'smbk-field-message',
  summary: 'The line under a field or a group of choices: help that says what to enter, a warning to notice, or an error that says what is wrong.',
  adapt: 'css',
  axes: {
    type: {
      values: ['help', 'warning', 'error'],
      default: 'help',
      description: 'Help is quiet text with no icon. Warning leads with the warning icon; error leads with the circled cross and turns the danger color.',
    },
  },
  flags: {},
  parts: ['icon', 'text'],
  figmaNodeId: '7101:46',
});
