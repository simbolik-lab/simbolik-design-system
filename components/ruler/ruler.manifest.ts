import { defineVariants } from '../variants.js';

/**
 * Ruler. Figma "Ruler" 7417:374: State (Default, Focus) × the Widths switch, 2 variants, a row (`space/inline/md`, centred) of
 * the scale (`space/stack/xs`), the width now (Label MD, `color/text/default`) and Fit and Hide (Icon button Ghost sm,
 * ArrowsOutLineHorizontal and EyeSlash). The band: `size/24` tall, `color/surface/sunken`, `color/border/subtle` 1 inside,
 * `radius/control/sm`, 0 to 1600 across; zones Wide and Side columns on `color/surface/neutral-subtle` (the last with the band's
 * corner at its end), named in Label SM `color/text/subtle` 6 in; breakpoints (768, 1280) full `color/border/strong` hairlines;
 * screen widths (320, 640, 1024, 1440) 6 tall ticks at the foot in the same; the handle 4 × 32 on
 * `color/action/brand/background`, `radius/full`, 4 above and below the band, Focus the focus style. The widths under it in
 * Body XS `color/text/subtlest`. State is the handle's :focus-visible, not a class; the widths and zones are data.
 */
export const ruler = defineVariants({
  name: 'ruler',
  block: 'smbk-ruler',
  summary: 'A width ruler for a preview: the layout states and breakpoints along one band, the screen widths, and a handle for the width now.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['scale', 'band', 'zone', 'break', 'tick', 'handle', 'widths', 'width', 'now', 'controls', 'fit', 'hide'],
  figmaNodeId: '7417:374',
});
