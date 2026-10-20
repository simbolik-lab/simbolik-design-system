import { defineVariants } from '../variants.js';

/**
 * Color picker. Figma "Color picker" 7411:823: Type (Field, Swatch) × State (Default, Hover, Focus, Open, Disabled) × Size (md, sm),
 * 20 variants, built on the Input: Field holds a swatch (sm at md, xs at sm), the code and a caret, up while open; Swatch holds a
 * swatch alone (md at md, xs at sm) inside the medium inset. What it opens is "Color picker panel" 7411:824: 256 wide, the
 * popover's surface, edge, corner and shadow, the large inset and the medium stack step, holding a color area, a hue slider and
 * an opacity slider (their label rows hidden), a row of the format select, a small color field and a secondary eyedropper icon
 * button, and a divider over a small square swatch picker. Opacity, Format, Eyedropper and Swatches are Figma's switches.
 * The trigger carries the input's well classes and the select's well, value and caret parts; the panel carries the popover's.
 */
export const colorPicker = defineVariants({
  name: 'color-picker',
  block: 'smbk-color-picker',
  summary: 'A field or a swatch that opens a panel to choose a color: by dragging in a square and along strips, by typing its code, or by picking a saved swatch.',
  adapt: 'css',
  axes: {
    type: {
      values: ['field', 'swatch'],
      default: 'field',
      description: 'Field shows the color and its code with a caret, as a select does; Swatch shows the color alone, for toolbars and tight rows.',
    },
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'The input’s two heights. Field holds a 20 or 16 px swatch; Swatch is a 40 or 32 px square holding a 24 or 16 px one.',
    },
  },
  flags: {
    error: { description: 'The color is not one the form can take. Draws the input’s danger border on the trigger.' },
    open: { description: 'The panel is showing. Set by the component while it is open; the caret turns up.' },
  },
  parts: ['trigger', 'swatch', 'value', 'name', 'caret', 'panel', 'area', 'slider', 'code', 'format', 'field', 'eyedropper', 'swatches', 'divider'],
  figmaNodeId: '7411:823',
});
