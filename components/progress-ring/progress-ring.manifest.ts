import { defineVariants } from '../variants.js';

/**
 * Progress ring. Figma "Progress ring" 7580:184 (Value 0 to 100 in tens × Size, 22 variants). Figma's
 * Value is data, the wrapper's value, not an axis; its 100 variant, drawn in the success color, is the
 * complete flag, which the wrapper sets when the value reaches the end.
 */
export const progressRing = defineVariants({
  name: 'progress-ring',
  block: 'smbk-progress-ring',
  summary: 'A ring that fills clockwise from the top to show how far something has got, with the value in the middle.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'Medium shows the value in the middle; small is a thinner ring with no room for it, for a row or a list.',
    },
  },
  flags: {
    complete: { description: 'The value has reached the end: the whole ring turns to the success color. The wrapper sets it; plain markup sets it the same way.' },
  },
  parts: ['track', 'value'],
  figmaNodeId: '7580:184',
});
