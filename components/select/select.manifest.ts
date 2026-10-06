import { defineVariants } from '../variants.js';

/** Select. Figma "Select" 4253:2857 (State: Closed, Open × Size: Default, Small): the input well with a caret, and the dropdown panel with its items at the same size when open. */
export const select = defineVariants({
  name: 'select',
  block: 'smbk-select',
  summary: 'A choice from a list: the input well with a caret, opening the dropdown panel with one item per choice.',
  adapt: 'css',
  axes: {
    size: { values: ['default', 'small'], default: 'default' },
  },
  flags: {
    error: { description: 'The choice is invalid.' },
    open: { description: 'The list is showing. Set by the component while it is open.' },
  },
  parts: ['well', 'value', 'icon', 'list', 'option', 'option-label', 'check'],
  figmaNodeId: '4253:2857',
});
