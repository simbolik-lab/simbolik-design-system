import { defineVariants } from '../variants.js';

/**
 * Header. Figma "Header" 4209:22809: Desktop, Mobile Default, Mobile Expanded.
 * Figma's Platform axis is the layout switch, not a variant; the expanded state is a flag.
 * In a wide space a link with children is a dropdown's opener (the dropdown's own parts and classes).
 */
export const header = defineVariants({
  name: 'header',
  block: 'smbk-header',
  summary: 'The top of a website: brand, page links, a call to action and the theme switch, folding into a menu when the space is narrow.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'lg'],
      default: 'lg',
      description: "How large the page links in the wide bar are. lg is Figma's header: the large navigation items (Size=Large), as the app bar's; md is a smaller link for a quieter bar. The narrow menu keeps its own size (Figma: Size=Default).",
    },
    background: {
      values: ['on', 'off'],
      default: 'on',
      description: "The bar's own surface. Off drops its fill, edge and shadow so it sits on whatever is behind it; the open narrow menu keeps its surface, as Figma draws the expanded header only with one. Figma: Background=Yes, No (Yes the default); the values are the app bar's, so the two bars read alike.",
    },
  },
  flags: {
    expanded: { description: 'The narrow-space menu is open under the bar. Has no effect in a wide space.' },
  },
  parts: ['bar', 'brand', 'logo', 'links', 'end', 'menu', 'menu-list', 'group', 'menu-cta', 'wide-only', 'narrow-only'],
  figmaNodeId: '4209:22809',
});
