import { defineVariants } from '../variants.js';

/**
 * App bar. Figma "App bar" 7353:700 (Style × Platform × State), built from AppBarStart 7352:340, AppBarNav 7352:552
 * and AppBarEnd 7352:625. Figma's Platform axis is the layout switch, not a variant; the open menu is a flag.
 * Its Start, Nav and End switches are the parts a page passes or leaves out; Second row is the `secondRow` slot.
 * AppBarNav's Type is the nav type axis for the two forms the bar draws from its links (Links, Tabs); its Search,
 * Icon links and Title are what a page passes in the `nav` slot.
 * The looks, the zone, the frost and the second row are shared with the header and written once, in bar/bar.css.
 */
export const appBar = defineVariants({
  name: 'app-bar',
  block: 'smbk-app-bar',
  summary: 'The top bar of an application: brand, navigation links, then search, action buttons, the theme switch and the user, in five looks; the links fold into a menu when they do not fit.',
  adapt: 'css',
  axes: {
    look: {
      values: ['floating', 'floating-hug', 'flat', 'split', 'centred'],
      default: 'floating',
      description: 'Floating: a raised bar with rounded corners and a hairline edge, the links in the true middle. Floating hug: the same bar only as wide as its content, centered. Flat: a square bar with no edge or shadow, a line along its foot. Split: the brand on an island of its own at the start, the links and the end group on one at the end. Centred: the links at the start, the brand in the middle. Figma calls this Style.',
    },
    size: {
      values: ['md', 'lg'],
      default: 'md',
      description: "How large the links in the wide bar are. md is Figma's: the middle navigation item. lg is the large item, as the bar drew them before. The menu keeps its large items either way.",
    },
    background: {
      values: ['on', 'off'],
      default: 'on',
      description: "The bar's own surface. Off drops its fill, edge and shadow so it sits on whatever is behind it; the open menu keeps its surface, as Figma draws the open bar only with one, and a bar that hides on scroll takes the page's own surface while it sticks. Figma: Background (on by default).",
    },
    line: {
      values: ['on', 'off'],
      default: 'on',
      description: 'The hairline along the foot of a flat bar. Only the flat look draws it. Figma: Line (on by default).',
    },
    logo: {
      values: ['on', 'off'],
      default: 'on',
      description: "The brand at the start of the bar in a wide space. Off drops it, for a page whose logo sits elsewhere, such as at the top of a sidebar that runs the page's full height; the links then start the bar, and a badge stays. The narrow bar keeps its logo either way.",
    },
    links: {
      values: ['between', 'start', 'end'],
      default: 'between',
      description: 'Where the links sit in a wide space. Between: in the middle of the bar, as Figma draws it. Start: right after the brand, the free room after them, as the Showroom App bar draws them. End: pushed to the end, just before the search, buttons and theme switch, for a bar laid over a page whose middle is its own, such as a home page with a large picture behind it. Start and end are not in the App bar component in Figma. The menu is the same either way.',
    },
    'nav-type': {
      values: ['links', 'tabs'],
      default: 'links',
      description: "How the wide bar draws its links. Links: navigation items. Tabs: small line tabs that fill the bar's whole height, the current page's underline on the bar's foot; the bar is then 64 tall. Either way they are links, the current one marked as the current page, and the menu lists them as navigation items. Figma: AppBarNav's Type.",
    },
    fold: {
      values: ['none', 'actions', 'links'],
      default: 'none',
      description: 'What has folded away in a wide space too narrow for the whole row. Actions: the action buttons are gone. Links: the actions and the links are gone and the menu button shows, opening the links under the bar. The wrapper measures the row and sets it; markup written by hand sets it the same way.',
    },
  },
  flags: {
    expanded: { description: 'The menu is open under the bar: in a narrow space, or in a wide one whose links have folded away.' },
    'hide-on-scroll': { description: 'In a narrow space, the bar stays at the top of the window while the page scrolls, slides up out of sight as the reader scrolls down and comes back as they scroll up. For a page that scrolls the window; turned on page by page. Has no effect in a wide space. Not in Figma.' },
    'scrolled-away': { description: 'The bar has slid up out of sight. The wrapper sets it while the reader scrolls down a page with hide on scroll on; plain markup sets it the same way. Has no effect without hide on scroll or in a wide space.' },
    zone: { description: "The bar's own room, as Figma draws it: the medium inset above and below a floating bar and a step in from the sides, and its row held to the content width. Off by default, so a page that already leaves room around its bar keeps its own." },
    'sidebar-start': { description: "In a wide space the start is as wide as the expanded sidebar, its logo the sidebar's logo size and in line with the sidebar's rows, so links that follow it (links start) begin where the page beside a sidebar begins. For a bar across the top of a page with a sidebar under it at the same side gutter as the bar's own inset. Not in the App bar component in Figma; drawn in the Showroom App bar." },
    frosted: { description: 'A blur behind the bar, strongest at the top and gone by its foot, so what scrolls under it is never read sharply there. For a bar with its background off, or with its own room. Not drawn when the system asks for forced colors.' },
  },
  parts: ['panel', 'frost', 'bar', 'start', 'brand', 'logo', 'badge', 'title', 'trail', 'nav', 'end', 'search', 'actions', 'divider', 'menu-button', 'second-row', 'second-row-nav', 'menu', 'menu-end', 'wide-only', 'narrow-only'],
  figmaNodeId: '7353:700',
});
