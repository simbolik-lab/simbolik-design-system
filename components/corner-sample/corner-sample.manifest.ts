import { defineVariants } from '../variants.js';

/**
 * Corner sample. Figma "Corner sample" 7429:1037: Radius (None, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, Full), 10 variants, each a
 * `size/24` square on `color/surface/neutral-subtle` with its top and left edges `color/border/control` at `border-width/2`
 * inside and its top left corner rounded: 0, 2, 4, 6, 8, 12, 16, 20, 24 and, for Full, 24 (typed, not bound). Radius is not an
 * axis here: the corner is data the page gives (a length, or a radius token), since the steps are a reader's own scale.
 */
export const cornerSample = defineVariants({
  name: 'corner-sample',
  block: 'smbk-corner-sample',
  summary: 'One corner drawn at one radius, for a list of corner steps or roles beside their names and sizes.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: [],
  figmaNodeId: '7429:1037',
});
