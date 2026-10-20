import { defineVariants } from '../variants.js';

/**
 * Color range. Figma "Color range" 7416:21 (one variant; the Guidance frame lists a Name boolean) holding eleven
 * "ColorRangeStep" 7416:19 (State: Default, Hover, Selected, Focus; Ratio boolean): a name row (`space/inline/md`, baseline),
 * then the steps sharing the width (`space/inline/xs`), each a 40 tall swatch (`size/40`, `radius/control/sm`, its edge
 * `color/border/edge-shade-subtle` 1 inside) over its name (Label SM, `color/text/default`) and ratio (Body XS,
 * `color/text/subtle`), `space/stack/xs` apart. Hover strokes `color/border/strong` 1, Selected `color/border/inverse` 2,
 * Focus `color/border/focus` 2. The states are attributes and pseudo-classes, not classes; the colors and ratios are data.
 */
export const colorRange = defineVariants({
  name: 'color-range',
  block: 'smbk-color-range',
  summary: 'The steps of one color range in a strip, each with its swatch, its name and its contrast against white, with the step in use ringed.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['head', 'title', 'meta', 'steps', 'step', 'swatch', 'name', 'ratio', 'hidden'],
  figmaNodeId: '7416:21',
});
