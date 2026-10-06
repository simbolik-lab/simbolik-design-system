import { defineVariants } from '../variants.js';

/**
 * App bar. Figma "App bar" 4239:28857: Desktop, Mobile Default, Mobile Expanded.
 * Figma's Platform axis is the layout switch, not a variant; the expanded state is a flag.
 */
export const appBar = defineVariants({
  name: 'app-bar',
  block: 'smbk-app-bar',
  summary: 'The top bar of an application: brand, navigation links, then search, action buttons, the theme switch and the user, folding into a menu when the space is narrow.',
  adapt: 'css',
  axes: {
    background: {
      values: ['on', 'off'],
      default: 'on',
      description: "The bar's own surface. Off drops its fill, edge and shadow so it sits on whatever is behind it; the open narrow menu keeps its surface, as Figma draws the expanded bar only with one. Figma: Background=On, Off (Figma's default is Off; the component keeps On so existing bars keep their look).",
    },
    logo: {
      values: ['on', 'off'],
      default: 'on',
      description: "The brand at the start of the bar in a wide space. Off drops it, for a page whose logo sits elsewhere, such as at the top of a sidebar that runs the page's full height; the links then start the bar. The narrow bar keeps its logo either way, as Figma draws it: the Logo boolean is bound in the Desktop variants only. Figma: Logo (boolean, on by default).",
    },
    links: {
      values: ['between', 'end'],
      default: 'between',
      description: "Where the links sit in a wide space. Between: after the brand, with the same room on either side of them, as Figma draws the bar. End: pushed to the end, just before the search, buttons and theme switch, for a bar laid over a page whose middle is its own, such as a home page with a large picture behind it. End is not in Figma. The narrow menu is the same either way.",
    },
  },
  flags: {
    expanded: { description: 'The narrow-space menu is open under the bar. Has no effect in a wide space.' },
    'hide-on-scroll': { description: "In a narrow space, the bar stays at the top of the window while the page scrolls, slides up out of sight as the reader scrolls down and comes back as they scroll up. For a page that scrolls the window; turned on page by page. Has no effect in a wide space. Not in Figma." },
    'scrolled-away': { description: 'The bar has slid up out of sight. The wrapper sets it while the reader scrolls down a page with hide on scroll on; plain markup sets it the same way. Has no effect without hide on scroll or in a wide space.' },
  },
  parts: ['bar', 'brand', 'logo', 'nav', 'end', 'search', 'actions', 'divider', 'menu', 'menu-end', 'wide-only', 'narrow-only'],
  figmaNodeId: '4239:28857',
});
