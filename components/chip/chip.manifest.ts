import { defineVariants } from '../variants.js';

/** Chip. Figma "Chip" 4253:1311: Variant × State × Size, 40 variants. Avatar and remove control are content. */
export const chip = defineVariants({
  name: 'chip',
  block: 'smbk-chip',
  summary: 'A small selectable token — a filter, a choice, a person — that can carry an avatar and be removed.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['default', 'brand', 'outline', 'inverse'],
      default: 'brand',
      description: 'Which action family the chip draws from. Figma calls this "Variant".',
    },
    size: {
      values: ['default', 'small'],
      default: 'default',
    },
  },
  flags: {
    selected: { description: 'The chip is currently chosen. Pressed styling, held. Given as true or false, the chip is a toggle and announces pressed or not pressed; left out, it is a plain button.' },
  },
  parts: ['avatar', 'label', 'remove'],
  figmaNodeId: '4253:1311',
});
