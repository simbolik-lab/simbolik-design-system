import { defineVariants } from '../variants.js';

/**
 * Password field. Figma "Password input" 7106:682: Visibility (Hidden, Shown) × State × Size, 24 variants, built from the
 * Input with a ghost icon button in its Trailing action slot. Visibility is the control's type and the button's icon and
 * name, which the wrapper sets, not a class; the states are the input's. The markup carries the input's block, size and
 * error classes as well as these, so this block adds only what the reveal button needs.
 */
export const passwordField = defineVariants({
  name: 'password-field',
  block: 'smbk-password-field',
  summary: 'A text field for a password or a passphrase, with a button at its end that shows and hides what is typed.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'The input’s two heights, with its padding and text. The button’s eye is 16 px at both; at sm the button is a 24 px square, so it fits inside the small well. Small text never goes under 16 px on a phone.',
    },
  },
  flags: {
    error: { description: 'The password is wrong or breaks a rule. Draws the danger border, kept while focused, and the error icon before the button.' },
  },
  parts: ['control', 'toggle'],
  figmaNodeId: '7106:682',
});
