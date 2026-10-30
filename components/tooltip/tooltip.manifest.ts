import { defineVariants } from '../variants.js';

/**
 * Tooltip. Figma "Tooltip" 4170:13949 (16 variants: Arrow × Inverse, and a Show arrow switch) over "TooltipItem"
 * 4170:13718. Figma draws no target; the anchor and the layer hold the target and the tooltip when the wrapper is
 * given one, and the arrow it is given is the one it prefers.
 */
export const tooltip = defineVariants({
  name: 'tooltip',
  block: 'smbk-tooltip',
  summary: 'A small floating label with an arrow, shown on hover or focus to name or explain the thing under it.',
  adapt: 'css',
  axes: {
    arrow: {
      values: ['top-start', 'top-center', 'top-end', 'bottom-start', 'bottom-center', 'bottom-end', 'left', 'right'],
      default: 'top-center',
      description: 'Which edge of the bubble the arrow sits on, and where along it: top points up at a target below the bubble, bottom points down at a target above it. Beside a target, the side it prefers: it takes the opposite side when this one has no room, and the arrow turns with it. Figma calls this "Arrow" and uses the same names.',
    },
  },
  flags: {
    inverse: { description: 'Dark surface with inverse text, for use over light content.' },
  },
  parts: ['bubble', 'key', 'arrow', 'anchor', 'layer'],
  figmaNodeId: '4170:13949',
});
