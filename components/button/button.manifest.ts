import { defineVariants } from '../variants.js';

/**
 * Button. Read from Figma "Button" (node 4136:5058): Tone × State × Size, plus
 * leading and trailing icon booleans; the icon-only form is Figma's "Icon button" (7096:430).
 *
 * States (hover, pressed, focus, disabled) are CSS pseudo-classes, not axes. Figma's Loading state is the
 * loading flag, since a busy button is something the page sets, not something the pointer does. The xs size is
 * the Icon button set's, drawn for the ghost tone only.
 * Leading and trailing icons are content, not classes.
 */
export const button = defineVariants({
  name: 'button',
  block: 'smbk-btn',
  summary: 'The action control: five tones, three sizes, with optional leading and trailing icons or an icon alone.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['brand', 'secondary', 'outline', 'ghost', 'danger'],
      default: 'brand',
      description: 'Which action color family the button draws from. Figma calls this axis "Variant".',
    },
    size: {
      values: ['lg', 'md', 'sm', 'xs'],
      default: 'md',
      description: 'Control height, padding, radius, label and icon size step together, one recipe per height. md fits apps and forms; a marketing page may place lg. xs is for a ghost icon-only button beside text, such as a help button in a table heading, and is refused on any other.',
    },
  },
  flags: {
    'icon-only': { description: 'A square button holding one icon and no label. Needs an accessible name.' },
    loading: { description: 'The action is running: a turning ring over the hidden label, the same width, and presses do nothing. It says it is busy.' },
  },
  parts: ['icon', 'label', 'spinner'],
  figmaNodeId: '4136:5058',
});
