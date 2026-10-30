import { defineVariants } from '../variants.js';

/**
 * Dropdown menu. Figma "Dropdown" 4800:63682 (Items Size: Default, Small) over
 * "DropdownItem" 4210:23371 (State: Default, Hover, Focus, Disabled × Type:
 * Default, Danger × Size: Default, Small; Checkbox, Leading Icon, Trailing Icon,
 * Kbd and Submenu booleans) and "DropdownHeading" 8265:3201, drawn by the label
 * part. Danger, the checkbox, the single choice's tick (the trailing icon) and the
 * submenu are per-item choices; the submenu part holds a submenu's item and its
 * second panel. The area part holds the part of a page a right-click menu opens
 * over, and the point part marks where the pointer was, for the panel to hang
 * from (Figma's "Right-click menu" example on the Dropdown page). The size is
 * the panel's, so every item in one panel is the same height. The align axis
 * says which edge of the opener the panel lines up with; it only matters when
 * the dropdown draws its opener. Figma draws no opener; the anchor part holds
 * the opener and the layer, and the layer the panel, lifted over the page while
 * it shows (floating.ts). Figma's Height axis (Hug, Limited) is no axis here: a
 * panel taller than the list height always stops there and scrolls.
 */
export const dropdown = defineVariants({
  name: 'dropdown',
  block: 'smbk-dropdown',
  summary: 'A raised list of actions or links that opens from a button: grouped items with an icon, a label, a key hint, an optional tick box or single-choice tick, items that open a second menu beside them, and a red one for the destructive action, in two item heights; it can also open at the pointer as a right-click menu.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'The height of every item: the medium or the small control height. Figma calls this "Items Size".',
    },
    align: {
      values: ['start', 'end'],
      default: 'start',
      description: 'Which edge of the opener the panel lines up with. End keeps a menu at the right of a bar inside the window.',
    },
  },
  flags: {},
  parts: ['anchor', 'layer', 'group', 'label', 'item', 'checkbox', 'icon', 'text', 'divider', 'glide', 'submenu', 'area', 'point'],
  figmaNodeId: '4800:63682',
});
