import { defineVariants } from '../variants.js';

/**
 * Combobox. Figma "Combobox" 7109:2214 (Mode: Single, Multiple × State: Default, Hover, Focus, Disabled, Error,
 * Open × Size: md, sm) over "Combobox popup" 7109:1317 (Mode × Status: Options, Loading, No results, Error × Items
 * size) and "List status row" 7109:1161 (Type: No results, Loading, Error). Figma's Mode is the selection axis;
 * hover, focus and open are the browser's and the wrapper's, disabled is the native attribute. The popup is the
 * dropdown panel at the combobox's size and the status row a part of it, each type a modifier of the part. An option's
 * swatch or icon before its label, its detail and badge after it, and options in groups, are built code first, to be
 * drawn in Figma; the groups are drawn with the select's group part and the dropdown's label, group and divider.
 */
export const combobox = defineVariants({
  name: 'combobox',
  block: 'smbk-combobox',
  summary: 'A box to type in that suggests matches from a list, for one choice or several: the input’s well, the dropdown panel under it, and each pick a chip.',
  adapt: 'css',
  axes: {
    selection: {
      values: ['single', 'multiple'],
      default: 'single',
      description: 'One choice, shown as text in the box, or several, each kept as a removable chip before the text, with a tick box on every option. Figma calls this "Mode".',
    },
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'The input’s two heights, with the dropdown’s items at the same size when open. Small text never goes under 16 px on a phone.',
    },
  },
  flags: {
    error: { description: 'The value is invalid. Draws the danger border, kept while focused, and the error icon before the caret.' },
  },
  parts: ['control', 'lead', 'values', 'chip', 'input', 'clear', 'caret', 'list', 'options', 'option', 'option-lead', 'option-label', 'option-detail', 'option-badge', 'check', 'status', 'status-icon', 'announcement'],
  figmaNodeId: '7109:2214',
});
