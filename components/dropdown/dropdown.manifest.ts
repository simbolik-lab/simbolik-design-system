import { defineVariants } from '../variants.js';

/**
 * Dropdown menu. Figma "Dropdown" 4800:63682 (Items Size: Default, Small) over
 * "DropdownItem" 4210:23371 (State: Default, Hover, Focus, Disabled × Type:
 * Default, Danger × Size: Default, Small; Checkbox, Leading Icon, Trailing Icon
 * and Kbd booleans). Danger and the checkbox are per-item choices; the size is
 * the panel's, so every item in one panel is the same height. The align axis
 * says which edge of the opener the panel lines up with; it only matters when
 * the dropdown draws its opener. Figma draws no opener; the anchor part holds
 * the opener and the panel.
 */
export const dropdown = defineVariants({
  name: 'dropdown',
  block: 'smbk-dropdown',
  summary: 'A raised list of actions or links that opens from a button: grouped items with an icon, a label, a key hint, an optional tick box, and a red one for the destructive action, in two item heights.',
  adapt: 'css',
  axes: {
    size: {
      values: ['default', 'small'],
      default: 'default',
      description: 'The height of every item: the medium or the small control height. Figma calls this "Items Size".',
    },
    align: {
      values: ['start', 'end'],
      default: 'start',
      description: 'Which edge of the opener the panel lines up with. End keeps a menu at the right of a bar inside the window.',
    },
  },
  flags: {},
  parts: ['anchor', 'group', 'label', 'item', 'checkbox', 'icon', 'text', 'divider'],
  figmaNodeId: '4800:63682',
});
