import { defineVariants } from '../variants.js';

/** Navigation item. Figma "NavItem" 4209:20209 (Size: Large, Default, Small); its states map to link states and attributes. */
export const navItem = defineVariants({
  name: 'nav-item',
  block: 'smbk-nav-item',
  summary: 'One link in a navigation list, with an optional leading icon, and a caret when it opens a group of further links.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'Figma: Large, Default, Small. The app bar, the header and their stacked menus use the large one; the footer uses the middle one.',
    },
  },
  flags: {
    block: { description: 'Fills its row with the caret at the far end, for stacked lists. Figma: the expanded mobile menus.' },
  },
  parts: ['icon', 'label', 'caret'],
  figmaNodeId: '4209:20209',
});
