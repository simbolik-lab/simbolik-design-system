import { defineVariants } from '../variants.js';

/**
 * Choice card. Figma "Choice card" 7105:1911: State (Default, Hover, Pressed, Focus, Disabled, Error) × Selected, 12 variants,
 * with a Description boolean and the Mark an instance swap (Radio, Checkbox). Hover, pressed, focus, disabled and chosen are the
 * native control's own; error is a flag. Built on the radio and the checkbox: the card carries the mark's block and size classes.
 */
export const choiceCard = defineVariants({
  name: 'choice-card',
  block: 'smbk-choice-card',
  summary: 'One choice drawn as a card, with a label and a line under it: picked like a radio, or ticked like a checkbox.',
  adapt: 'css',
  axes: {
    mark: {
      values: ['radio', 'checkbox'],
      default: 'radio',
      description: 'A radio when one card of a group is picked; a checkbox when several can be.',
    },
  },
  flags: {
    error: { description: 'The choice is invalid, such as a required question left empty. The card takes the danger edge, and its mark its error look.' },
  },
  parts: ['text', 'label', 'description'],
  figmaNodeId: '7105:1911',
});
