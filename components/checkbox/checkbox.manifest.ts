import { defineVariants } from '../variants.js';

/** Checkbox. Figma "Checkbox" 4068:10770: Size × Focus × Checked × Disabled, 12 variants. */
export const checkbox = defineVariants({
  name: 'checkbox',
  block: 'smbk-checkbox',
  summary: 'A box that is ticked or not, with its label beside it, for choices that are independent of each other.',
  adapt: 'css',
  axes: {
    size: { values: ['default', 'small'], default: 'default' },
    variant: { values: ['default', 'subtle'], default: 'default', description: 'Default is raised with a lift; subtle is sunken with the strong border, for dense places such as table rows.' },
  },
  flags: {},
  parts: ['control', 'box', 'icon', 'label'],
  figmaNodeId: '4068:10770',
});
