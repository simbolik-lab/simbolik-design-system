import { defineVariants } from '../variants.js';

/**
 * Button note. Figma "Button note" 7115:2068: Layout × Disabled × Size, 18 variants, with the Note text and the Info
 * icon boolean. Size only draws the nested button at its sizes and Disabled only dims it: the button carries both,
 * so neither is an axis here. The info icon is content.
 */
export const buttonNote = defineVariants({
  name: 'button-note',
  block: 'smbk-button-note',
  summary: 'A button with a short line of quiet words that says what pressing it will do, or why it cannot be pressed now.',
  adapt: 'css',
  axes: {
    layout: {
      values: ['beside', 'below', 'header-end'],
      default: 'beside',
      description: 'Beside puts the note next to the button and moves it under when there is no room; below always puts it under; header-end lines both up with the end of a page header.',
    },
  },
  flags: {},
  parts: ['note', 'icon', 'text'],
  figmaNodeId: '7115:2068',
});
