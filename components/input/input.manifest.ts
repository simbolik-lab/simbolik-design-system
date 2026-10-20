import { defineVariants } from '../variants.js';

/**
 * Input. Figma "Input" 4212:26450: State × Size, 14 variants; the icons, the Leading content slot and the Trailing action slot
 * are content. Read-only and disabled are the native attributes.
 */
export const input = defineVariants({
  name: 'input',
  block: 'smbk-input',
  summary: 'A single-line text field: a sunken well with an optional icon at either end, room for content before the value and an action after it, in two sizes.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'The control height, with its padding, icons and text: md for forms, sm for dense tables and toolbars. Small text never goes under 16 px on a phone.',
    },
  },
  flags: {
    error: { description: 'The value is invalid. Draws the danger border, kept while focused, and the error icon; the control also carries aria-invalid.' },
  },
  parts: ['control', 'icon', 'error-icon', 'leading-content', 'trailing-action'],
  figmaNodeId: '4212:26450',
});
