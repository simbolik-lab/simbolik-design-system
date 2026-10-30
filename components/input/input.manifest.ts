import { defineVariants } from '../variants.js';

/**
 * Input. Figma "Input" 4212:26450: State × Size, 14 variants; the icons, the Leading content slot and the Trailing action slot
 * are content. Read-only and disabled are the native attributes. The lg size has no variant in Figma: it is the md
 * input on the large control's height, padding and corners.
 */
export const input = defineVariants({
  name: 'input',
  block: 'smbk-input',
  summary: 'A single-line text field: a sunken well with an optional icon at either end, room for content before the value and an action after it, in three sizes.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'md',
      description: 'The control height, with its padding, icons and text: md for forms, lg beside large buttons (a sign-in or search form on a marketing page), sm for dense tables and toolbars. Small text never goes under 16 px on a phone.',
    },
  },
  flags: {
    error: { description: 'The value is invalid. Draws the danger border, kept while focused, and the error icon; the control also carries aria-invalid.' },
  },
  parts: ['control', 'icon', 'error-icon', 'leading-content', 'trailing-action'],
  figmaNodeId: '4212:26450',
});
