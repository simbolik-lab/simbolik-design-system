import { defineVariants } from '../variants.js';

/**
 * Tooltip. Figma "Tooltip" 4170:13949 (16 variants: Inverse × Arrow Position) over "TooltipItem" 4170:13718.
 * Figma flags the set as having errors; the axes were derived from its variant names.
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
      description: 'Which edge of the bubble the arrow sits on, and where along it: top points up at a target below the bubble, bottom points down at a target above it. Figma calls this "Arrow Position" and uses the same names (TopCenter is top-center, TopLeft is top-start).',
    },
  },
  flags: {
    inverse: { description: 'Dark surface with inverse text, for use over light content.' },
  },
  parts: ['bubble', 'arrow'],
  figmaNodeId: '4170:13949',
});
