import { defineVariants } from '../variants.js';

/**
 * Color area. Figma "Color area" 7407:327: State (Default, Focus, Disabled), 3 variants. A 224 square with the control's medium
 * corner and the edge-shade hairline: the hue under a white-to-clear and a clear-to-black gradient, and a color thumb at md. Figma's
 * description says it fills the width it is given (the picker's panel), so here it is square, as wide as its room, never wider than
 * the 224 frame (size/color-area/width, authored). The states are the thumb's and the native disabled attribute, not classes.
 */
export const colorArea = defineVariants({
  name: 'color-area',
  block: 'smbk-color-area',
  summary: 'Picks two channels of a color at once, saturation across and brightness up, by dragging a thumb in a square of the colors of one hue.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['thumb'],
  figmaNodeId: '7407:327',
});
