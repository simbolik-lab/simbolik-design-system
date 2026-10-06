import { defineVariants } from '../variants.js';

/** Button group. Figma "ButtonGroup" 4163:5325: Type × Variant × Size × Orientation, 33 variants. */
export const buttonGroup = defineVariants({
  name: 'button-group',
  block: 'smbk-btn-group',
  summary: 'Several buttons acting as one control: spaced apart, merged into one bar with dividers, or segmented.',
  adapt: 'css',
  axes: {
    type: {
      values: ['default', 'merged', 'segmented'],
      default: 'merged',
      description: 'Default keeps buttons apart. Merged and segmented fuse them into one bar with hairline dividers.',
    },
    tone: {
      values: ['brand', 'secondary', 'outline'],
      default: 'secondary',
      description: 'Which action family the fused bar draws its dividers and border from. Figma calls this "Variant". Buttons inside an outline group use the ghost tone.',
    },
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'Matches the size of the buttons inside; sets the bar radius.',
    },
    orientation: {
      values: ['horizontal', 'vertical'],
      default: 'horizontal',
    },
  },
  flags: {},
  parts: [],
  figmaNodeId: '4163:5325',
});
