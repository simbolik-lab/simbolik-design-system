import { defineVariants } from '../variants.js';

/**
 * Curve editor. Figma "Curve editor" 7416:192: Type (Ease, Overshoot) × the Numbers switch, 240 wide, `space/stack/md` between
 * the plot and the numbers. The plot (240 square, `color/surface/sunken`, `color/border/subtle` 1 inside, `radius/control/md`)
 * holds the unit square (160, at 40 across and 56 down, `color/border/subtle` 1), the straight line (`color/border/subtle`
 * hairline, dashed 4/4), two arms (`color/border/strong` hairline), the curve (`color/action/brand/background`,
 * `border-width/2`) and, for Overshoot, a limit at the curve's peak (`color/border/strong` hairline, dashed 4/4). The numbers
 * row is four Input sm (`space/inline/sm`). "CurveHandle" 7416:121: `size/12`, `radius/full`, `color/action/brand/background` 2
 * inside; fill `color/surface/default`, Hover `color/surface/hover`, Pressed `color/action/brand/background`; Elevation/control,
 * Focus the focus style. Type is not an axis here: the curve's own numbers decide whether it overshoots.
 */
export const curveEditor = defineVariants({
  name: 'curve-editor',
  block: 'smbk-curve-editor',
  summary: 'A motion curve to shape by dragging its two handles, moving them with the arrow keys, or typing its four numbers.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['plot', 'drawing', 'square', 'line', 'arm', 'limit', 'curve', 'handle', 'numbers'],
  figmaNodeId: '7416:192',
});
