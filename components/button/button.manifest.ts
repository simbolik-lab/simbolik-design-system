import { defineVariants } from '../variants.js';

/**
 * Button. Read from Figma "Button" (node 4136:5058): 150 variants across
 * Variant × State × Size × Icon Only, plus leading/trailing icon booleans.
 *
 * States (hover, pressed, focus, disabled) are CSS pseudo-classes, not axes.
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
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'Control height, padding, radius and icon size step together.',
    },
  },
  flags: {
    'icon-only': { description: 'A square button holding one icon and no label. Needs an accessible name.' },
  },
  parts: ['icon', 'label'],
  figmaNodeId: '4136:5058',
});
