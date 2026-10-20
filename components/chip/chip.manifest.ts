import { defineVariants } from '../variants.js';

/** Chip. Figma "Chip" 4253:1311: Tone × State × Size, 56 variants. Avatar and remove control are content; the tick is the selected state's. */
export const chip = defineVariants({
  name: 'chip',
  block: 'smbk-chip',
  summary: 'A small selectable token — a filter, a choice, a person — that can carry an avatar and be removed.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['default', 'brand', 'outline', 'inverse'],
      default: 'brand',
      description: 'Which action family the chip draws from; default is a see-through gray that shows on every surface.',
    },
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'The pill scale shared with the badge and the tag: 32 and 24 tall.',
    },
  },
  flags: {
    selected: { description: 'The chip is currently chosen: pressed in, with a tick before its label. Given as true or false, the chip is a toggle and announces pressed or not pressed; left out, it is a plain button.' },
  },
  parts: ['tick', 'avatar', 'label', 'remove'],
  figmaNodeId: '4253:1311',
});
