import { defineVariants } from '../variants.js';

/**
 * Slider. Figma "Slider" 4711:52100 (Size × State × Type, 12 variants, with
 * Label, Value and Min and Max booleans) over "SliderThumb" 4711:51614
 * (State × Size, 15 variants). State is not an axis here: hover, pressed, focus and disabled
 * are the native input's own states, read by the stylesheet.
 */
export const slider = defineVariants({
  name: 'slider',
  block: 'smbk-slider',
  summary: 'Chooses a number, or a lowest and highest number, along a range by dragging, clicking or the arrow keys: a row of fine lines that turn red up to a narrow thumb, or between two.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'The thumb and the lines: the thumb is the selection size tall and the lines one step shorter. The row that takes the pointer stays the smallest touch size at every size. Figma: lg, md, sm, lg the default.',
    },
    type: {
      values: ['single', 'range'],
      default: 'single',
      description: 'One value, the lines red from the start up to the thumb; or a range, two thumbs that stop when they meet and the lines red between them. Figma: Type=Single, Range.',
    },
  },
  flags: {},
  parts: ['header', 'label', 'value', 'body', 'rail', 'track', 'fill', 'lines', 'thumb', 'bubble', 'control', 'bounds'],
  figmaNodeId: '4711:52100',
});
