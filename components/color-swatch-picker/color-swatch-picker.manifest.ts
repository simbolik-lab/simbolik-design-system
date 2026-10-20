import { defineVariants } from '../variants.js';

/**
 * Color swatch picker. Figma "Color swatch picker" 7408:540 (Shape × Size, 4 variants), wrapping rows of
 * "ColorSwatchPickerItem" 7408:295 (State: Default, Hover, Focus, Disabled × Selected: No, Yes × Shape × Size, 32 variants).
 * Each item holds a color swatch (md in a 32 item, xs in a 24 item) inside the extra small inset; chosen draws a 2 px ring in the
 * inverse border color with a gap, focus the ring in the focus color, hover the hover surface, disabled the disabled opacity.
 * Selected and the states are attributes and pseudo-classes (aria-selected, :hover, :focus-visible, aria-disabled), not classes.
 */
export const colorSwatchPicker = defineVariants({
  name: 'color-swatch-picker',
  block: 'smbk-color-swatch-picker',
  summary: 'A set of colors to pick one from, such as saved colors or colors to try, in rows that wrap.',
  adapt: 'css',
  axes: {
    shape: {
      values: ['square', 'round'],
      default: 'square',
      description: 'Square swatches, or dots.',
    },
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'A 32 px item holding a 24 px swatch, or a 24 px item holding a 16 px one.',
    },
  },
  flags: {},
  parts: ['item'],
  figmaNodeId: '7408:540',
});
