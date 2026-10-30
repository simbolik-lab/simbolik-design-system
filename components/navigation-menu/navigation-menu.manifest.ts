import { defineVariants } from '../variants.js';

/**
 * Navigation menu. Figma "NavigationMenu" 8217:3602 (State: Closed, Open), its links Figma's "NavigationLink"
 * 8217:3405 (State: Default, Hover, Focus), which is the link part here. The items are the navigation item at md. Its
 * states are whether a panel is open and the links' hover and focus, so its one axis is where the panel lines up.
 */
export const navigationMenu = defineVariants({
  name: 'navigation-menu',
  block: 'smbk-navigation-menu',
  summary: "A site header's links, where an item with a caret opens a wide panel of described links and a featured column.",
  adapt: 'css',
  axes: {
    align: {
      values: ['start', 'end'],
      default: 'start',
      description: 'Which edge of the row the open panel lines up with: start for links at the start of a header, end for links at its end, so the panel stays on the page.',
    },
  },
  flags: {},
  parts: [
    'list',
    'item',
    'trigger',
    'panel',
    'column',
    'heading',
    'links',
    'link',
    'link-icon',
    'link-text',
    'link-title',
    'link-description',
    'featured',
    'featured-text',
    'featured-title',
    'featured-description',
    'featured-link',
  ],
  figmaNodeId: '8217:3602',
});
