import { defineVariants } from '../variants.js';

/**
 * Header. Figma "Header" 7392:2169 (Style × Platform × State), built from the app bar's parts: AppBarStart (Logo,
 * Logo small), AppBarNav (Links) and AppBarEnd (Site, Site menu). Figma's Platform axis is the layout switch, not a
 * variant; the open menu is a flag. In a wide space a link with children is a dropdown's opener (the dropdown's own
 * parts and classes). The looks, the zone, the frost and the second row are shared with the app bar and written
 * once, in bar/bar.css; this stylesheet arranges the header's own row.
 */
export const header = defineVariants({
  name: 'header',
  block: 'smbk-header',
  summary: 'The top of a website: brand, page links, a call to action and the theme switch, in five looks; the links fold into a menu when they do not fit.',
  adapt: 'css',
  axes: {
    look: {
      values: ['floating', 'floating-hug', 'flat', 'split', 'centred'],
      default: 'floating',
      description: 'Floating: a raised bar with rounded corners and a hairline edge, the links in the true middle. Floating hug: the same bar only as wide as its content, centered. Flat: a square bar with no edge or shadow, a line along its foot. Split: the brand on an island of its own at the start, the links and the end on one at the end. Centred: the links at the start, the brand in the middle (in a narrow space the theme switch steps aside so the brand can sit in the middle). Figma calls this Style; the app bar has the same looks.',
    },
    size: {
      values: ['md', 'lg'],
      default: 'md',
      description: "How large the page links in the wide bar are. md is Figma's header: the middle navigation item, the extra-small step apart. lg is the large item the large step apart, as the header drew them before. The narrow menu keeps its large items either way.",
    },
    background: {
      values: ['on', 'off'],
      default: 'on',
      description: "The bar's own surface. Off drops its fill, edge and shadow so it sits on whatever is behind it; the open menu keeps its surface, as Figma draws the open header only with one. Figma: Background (on by default).",
    },
    line: {
      values: ['on', 'off'],
      default: 'on',
      description: 'The hairline along the foot of a flat bar. Only the flat look draws it. Figma: Line (on by default).',
    },
    fold: {
      values: ['none', 'links'],
      default: 'none',
      description: 'Whether the page links have folded away in a wide space too narrow for them: the menu button then shows and opens them under the bar, while the call to action and the theme switch stay. The wrapper measures the row and sets it; markup written by hand sets it the same way.',
    },
  },
  flags: {
    expanded: { description: 'The menu is open under the bar: in a narrow space, or in a wide one whose links have folded away.' },
    zone: { description: "The bar's own room, as Figma draws it: the medium inset above and below a floating bar and a step in from the sides, and its row held to the content width. Off by default, so a page that already leaves room around its header keeps its own." },
    frosted: { description: 'A blur behind the bar, strongest at the top and gone by its foot, so what scrolls under it is never read sharply there. For a bar with its background off, or with its own room. Not drawn when the system asks for forced colors.' },
  },
  parts: ['panel', 'frost', 'bar', 'start', 'brand', 'logo', 'trail', 'nav', 'links', 'end', 'theme', 'menu-button', 'second-row', 'second-row-nav', 'menu', 'menu-list', 'group', 'menu-cta', 'wide-only', 'narrow-only'],
  figmaNodeId: '7392:2169',
});
