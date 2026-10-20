import { defineVariants } from '../variants.js';

/** Switch. Figma "Switch" 4086:11238: Size × State × Checked, 24 variants, with an Icon boolean (the wrapper's `icon`). Hover, focus and disabled are the native control's own. */
export const switchControl = defineVariants({
  name: 'switch',
  block: 'smbk-switch',
  summary: 'An on-or-off control that takes effect at once: a filled track with a light thumb that slides to the on side.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'The track 24, 20 or 16 tall, with its thumb. The small thumb has no room for the tick or the cross.',
    },
  },
  flags: {},
  parts: ['control', 'track', 'thumb', 'on-icon', 'off-icon', 'label'],
  figmaNodeId: '4086:11238',
});
