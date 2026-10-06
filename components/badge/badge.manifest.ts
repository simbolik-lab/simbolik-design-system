import { defineVariants } from '../variants.js';

/**
 * Badge. Figma "Badge" 4126:20020: Variant × Type × Size, 34 variants; label and icons are content.
 * Figma's Variant is Flat, Soft or Dot for the four feedback types and Default for the neutral ones,
 * which have one look each; the look axis here is soft, flat or dot for every type.
 */
export const badge = defineVariants({
  name: 'badge',
  block: 'smbk-badge',
  summary: 'A small status marker: a soft or flat pill with a label and optional icons, or a bare dot.',
  adapt: 'css',
  axes: {
    look: {
      values: ['soft', 'flat', 'dot'],
      default: 'soft',
      description: 'Soft, the default, is the subtle surface inside an edge of the type\'s color; flat is the type\'s full surface; dot is a bare dot with no label. The neutral types look the same in soft and flat. Figma calls this "Variant", and its Default is the neutral types\' one look.',
    },
    type: {
      values: ['default', 'success', 'info', 'warning', 'danger', 'sunken'],
      default: 'default',
      description: 'Neutral surfaces or one of the four feedback families.',
    },
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
    },
  },
  flags: {},
  parts: ['icon', 'label'],
  figmaNodeId: '4126:20020',
});
