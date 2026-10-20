import { defineVariants } from '../variants.js';

/**
 * Shadow editor. Figma "Shadow editor" 7417:172 (one component; Preview and Add layer booleans), 288 wide, `space/stack/md`
 * apart: the preview (`color/surface/canvas`, `color/border/subtle` 1 inside, `radius/container/sm`, 128 tall, centring a
 * 112 × 64 card on `color/surface/default` with `radius/container/sm` and the edited shadow, data), two ShadowLayer and an Add
 * layer Button (Ghost sm, Plus). "ShadowLayer" 7417:87 (Remove boolean): `color/surface/default`, `color/border/subtle` 1 inside,
 * `radius/container/sm`, `space/inset/md`, `space/stack/sm`; a head (DotsSixVertical `size/icon/sm` and the name in Label MD
 * `color/text/default`, `space/inline/xs`; Remove, an Icon button Ghost xs with Trash), a row of X, Y, Blur and Spread
 * (`space/inline/sm`) and a row of the Colour (Color picker Field sm) and Opacity (Input sm, 64), each an Input sm under a
 * Body XS `color/text/subtle` label, `space/stack/xs`. ShadowLayer is the `layer` part here, not a component of its own.
 */
export const shadowEditor = defineVariants({
  name: 'shadow-editor',
  block: 'smbk-shadow-editor',
  summary: 'Edits one shadow: a preview card drawn with it, its layers with their offsets, blur, spread, color and opacity, and a button to add a layer.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['preview', 'card', 'layers', 'layer', 'head', 'title', 'handle', 'name', 'remove', 'fields', 'paint', 'field', 'label', 'add', 'hidden'],
  figmaNodeId: '7417:172',
});
