import { defineVariants } from '../variants.js';

/**
 * Sidebar. Figma "Sidebar" 4732:56128 (Display: Expanded, Collapsed; Logo, Search, User Profile and
 * Collapsable booleans) over "SidebarNavItem" 4240:29552 (State × Level: Parent, Child ×
 * Display). It replaces Figma's older sidebar with a title and collapse button at the top
 * ("Sidebar" 4240:29921). The item is a part here, not its own component, because nothing else
 * uses it. Kept closed, an item with children opens them in a flyout drawn with the dropdown's
 * look (Figma does not draw it). The auto display is not drawn in Figma either.
 */
export const sidebar = defineVariants({
  name: 'sidebar',
  block: 'smbk-sidebar',
  summary: 'The side panel of an application: the logo, search, labeled groups of links with children, the user, and at the foot a button that keeps it open, keeps it a column of icons, or lets it open over the page when pointed at.',
  adapt: 'css',
  axes: {
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
  parts: ['panel', 'logo', 'brand', 'brand-logo', 'brand-mark', 'search', 'search-field', 'search-button', 'nav', 'section', 'group-label', 'group-title', 'list', 'group', 'item', 'item-body', 'item-icon', 'item-label', 'item-caret', 'children', 'flyout', 'flyout-list', 'footer', 'user', 'user-name', 'user-detail', 'foot', 'toggle'],
  figmaNodeId: '4732:56128',
});
