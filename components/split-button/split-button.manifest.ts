import { defineVariants } from '../variants.js';

/**
 * Split button. Figma "Split button" 7115:1869: Tone (Brand, Secondary, Outline) × Size × State (Default, Open,
 * Disabled), 27 variants. Built on the button group: its markup carries the group's segmented classes at the same
 * tone and size as well as these. Open and Disabled are states, not axes: the dropdown opens it, and the wrapper's
 * disabled prop dims both buttons.
 */
export const splitButton = defineVariants({
  name: 'split-button',
  block: 'smbk-split-button',
  summary: 'One safe default action with a menu of related ones: a button and a caret button joined into one bar, the caret opening the menu.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['brand', 'secondary', 'outline'],
      default: 'brand',
      description: 'The action family of both buttons and the line between them. There is no danger tone: a destructive default is never hidden behind a menu.',
    },
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'md',
      description: 'The button’s heights; the caret button is a square of the same height, and the menu’s rows are small under the small size.',
    },
  },
  flags: {},
  parts: [],
  figmaNodeId: '7115:1869',
});
