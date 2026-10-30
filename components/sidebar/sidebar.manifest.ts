import { defineVariants } from '../variants.js';

/**
 * Sidebar. Figma "Sidebar" 4732:56128 (Style: Floating, Flat; Display: Expanded, Collapsed; Logo,
 * Search, User Profile and Collapsible booleans) over "SidebarNavItem" 4240:29552 (State × Level:
 * Parent, Child × Display × Size: md, sm). It replaces Figma's older sidebar with a title and
 * collapse button at the top. The item is a part here, not its own component, because nothing else
 * uses it: the parent's Size is the size axis, the child's the child axis. Kept closed, an item with
 * children opens them in a flyout drawn with the dropdown's look (Figma does not draw it). The auto
 * display is not drawn in Figma either.
 */
export const sidebar = defineVariants({
  name: 'sidebar',
  block: 'smbk-sidebar',
  summary: 'The side panel of an application: the logo, search, labeled groups of links with children, the user, and at the foot a button that keeps it open, keeps it a column of icons, or lets it open over the page when pointed at.',
  adapt: 'css',
  axes: {
    look: {
      values: ['floating', 'flat'],
      default: 'floating',
      description: "Floating is the raised panel with its corner, rim and shadow, which the page keeps a little way in from the window's edges. Flat is square and on the page's own surface, with no shadow and a hairline along its end edge, for a sidebar that runs flush to the window's edges. Figma calls this \"Style\".",
    },
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'md rows are 40 tall with 16 px text and 20 px icons, their children 32 tall with 14 px text unless child is md. sm rows are all 32 tall with 14 px text and 16 px icons, for a denser application. The column, the logo, search, user and foot cells keep their size. Figma: the item\'s Size, md and sm.',
    },
    child: {
      values: ['sm', 'md'],
      default: 'sm',
      description: "How tall an item's children are at the medium size. sm draws them a step smaller than their parent, 32 tall with 14 px text. md draws them as tall as their parent, 40 tall with 16 px text, for children that matter as much as the item above them. Their labels start in the same place either way. At the small size every row is small, so md changes nothing there. Figma: the child item's Size, sm and md.",
    },
    width: {
      values: ['md', 'sm'],
      default: 'md',
      description: "How wide the open panel is. md is the sidebar width. sm is the 240 width, for a dense application's list of pages beside its work. Only the open panel narrows: the column of icons, its cells and its rows keep their size. Not yet drawn in Figma, which draws the md width only.",
    },
    display: {
      values: ['auto', 'expanded', 'collapsed'],
      default: 'auto',
      description: "Auto: a column of icons that opens over the page while it is pointed at or holds keyboard focus. Expanded: kept open, taking its room beside the page. Collapsed: kept as the column, whose items with children open flyouts. The button at the foot steps through them in that order. Figma: Display=Expanded, Collapsed; auto is not drawn in Figma.",
    },
  },
  flags: {
    collapsed: { description: "The column's look: icons only. The wrapper sets it when the display is collapsed, or auto and not open; plain markup sets it the same way." },
    open: { description: 'The auto display is open over the page, as when pointed at. No effect on the other two.' },
  },
  parts: ['panel', 'logo', 'brand', 'brand-logo', 'brand-mark', 'search', 'search-field', 'search-button', 'nav', 'section', 'group-label', 'group-title', 'list', 'group', 'item', 'item-body', 'item-icon', 'item-label', 'item-said', 'item-marks', 'item-count', 'item-dot', 'item-caret', 'children', 'flyout', 'flyout-list', 'footer', 'user', 'user-name', 'user-detail', 'foot', 'toggle', 'glide'],
  figmaNodeId: '4732:56128',
});
