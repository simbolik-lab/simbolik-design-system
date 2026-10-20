import { defineVariants } from '../variants.js';

/** Navigation item. Figma "NavItem" 4209:20209 (Size: lg, md, sm); its states map to link states and attributes. */
export const navItem = defineVariants({
  name: 'nav-item',
  block: 'smbk-nav-item',
  summary: 'One link in a navigation list, with an optional leading icon, an optional count or dot, and a caret when it opens a group of further links.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'lg is 40 tall with 16 px text and a 20 px icon, md 32 tall with 14 px text and a 16 px icon, sm 24 tall with 12 px text and a 12 px icon. The app bar, the header and their stacked menus use the large one; the footer uses the middle one. Figma: lg, md, sm (its default is md).',
    },
  },
  flags: {
    block: { description: 'Fills its row with the caret at the far end, for stacked lists. Figma: the expanded mobile menus.' },
  },
  parts: ['icon', 'label', 'pause', 'count', 'dot', 'caret'],
  figmaNodeId: '4209:20209',
});
