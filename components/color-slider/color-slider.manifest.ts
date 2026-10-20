import { defineVariants } from '../variants.js';

/**
 * Color slider. Figma "Color slider" 7407:320: Channel (Hue, Alpha, Saturation, Lightness) × State (Default, Focus, Disabled) ×
 * Size (md, sm), 24 variants, with the Label and Value booleans; the Label switch hides the whole top row. The strip is size/24 or
 * size/20 high with fully round ends and the edge-shade hairline; its thumb is the color thumb at md or sm. The states are the
 * thumb's own and the native disabled attribute, not classes. Alpha is called Opacity where a reader sees it.
 */
export const colorSlider = defineVariants({
  name: 'color-slider',
  block: 'smbk-color-slider',
  summary: 'Picks one channel of a color, its hue, opacity, saturation or lightness, by dragging along a strip that shows the colors it moves through.',
  adapt: 'css',
  axes: {
    channel: {
      values: ['hue', 'alpha', 'saturation', 'lightness'],
      default: 'hue',
      description: 'Which part of the color the slider changes. Alpha is the opacity, drawn over the checkerboard and labeled “Opacity”.',
    },
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'A 24 px strip with a 20 px thumb, or a 20 px strip with a 16 px thumb.',
    },
  },
  flags: {},
  parts: ['header', 'label', 'value', 'track', 'gradient', 'rail', 'thumb'],
  figmaNodeId: '7407:320',
});
