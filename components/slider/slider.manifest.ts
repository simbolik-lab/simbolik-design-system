import { defineVariants } from '../variants.js';

/**
 * Slider. Figma "Slider" 4711:52100 (Style × Size × State × Type, 54 variants, with Label, Value, Min and Max,
 * Marks and Number box booleans) over "SliderThumb" 4711:51614 (Shape × State × Size, 30 variants). State is not
 * an axis here: hover, pressed, focus and disabled are the native input's own states, read by the stylesheet.
 * Figma's Style is the look axis here, as on the other components, since a style prop is React's own. The thumb's
 * shape follows the look (ticks the pill, standard the round), so it is not an axis.
 */
export const slider = defineVariants({
  name: 'slider',
  block: 'smbk-slider',
  summary: 'Chooses a number, or a lowest and highest number, along a range by dragging, clicking or the arrow keys: fine lines that turn red up to a narrow thumb, a thin line with a round thumb, or a filled bar; a number box beside it takes a typed value.',
  adapt: 'css',
  axes: {
    look: {
      values: ['ticks', 'standard', 'fill'],
      default: 'ticks',
      description: 'Ticks: a row of fine lines on a sunken band that turn red up to a narrow thumb. Standard: a thin rounded line, red up to a round thumb. Fill: a thick bar filled red up to a thin light handle, with optional marks between the lowest and highest values. Figma: Style=Ticks, Standard, Fill, Ticks the default.',
    },
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'The thumb and the line or bar: the ticks thumb is the selection size tall, the round thumb the icon size across, the fill bar the selection size tall. The row that takes the pointer stays at least the smallest touch size at every size. Figma: lg, md, sm, lg the default.',
    },
    type: {
      values: ['single', 'range'],
      default: 'single',
      description: 'One value, red from the start up to the thumb; or a range, two thumbs that stop when they meet and red between them. Figma: Type=Single, Range.',
    },
  },
  flags: {},
  parts: ['header', 'label', 'value', 'row', 'number', 'body', 'rail', 'track', 'fill', 'lines', 'thumb', 'bubble', 'control', 'bounds', 'marks'],
  figmaNodeId: '4711:52100',
});
