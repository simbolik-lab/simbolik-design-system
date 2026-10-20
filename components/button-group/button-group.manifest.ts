import { defineVariants } from '../variants.js';

/** Button group. Figma "ButtonGroup" 4163:5325: Type × Tone × Size × Orientation, 36 variants. */
export const buttonGroup = defineVariants({
  name: 'button-group',
  block: 'smbk-btn-group',
  summary: 'Several buttons acting as one control: spaced apart, or segmented into one bar with dividers.',
  adapt: 'css',
  axes: {
    type: {
      values: ['default', 'segmented'],
      default: 'segmented',
      description: 'Default keeps buttons apart. Segmented fuses them into one bar with hairline dividers.',
    },
    tone: {
      values: ['brand', 'secondary', 'outline'],
      default: 'secondary',
      description: 'Which action family the fused bar draws its dividers and border from. Buttons inside an outline bar use the ghost tone.',
    },
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'md',
      description: 'Matches the size of the buttons inside, md like the button; sets the gap and the bar radius.',
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
