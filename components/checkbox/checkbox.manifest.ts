import { defineVariants } from '../variants.js';

/**
 * Checkbox. Figma "Checkbox" 4068:10770: Size × State × Checked × Variant, 60 variants. Hover, focus, disabled and the
 * mixed state are the native control's own; error is a flag. Figma's Variant is the tone axis.
 */
export const checkbox = defineVariants({
  name: 'checkbox',
  block: 'smbk-checkbox',
  summary: 'A box that is ticked or not, with its label beside it and an optional line under the label, for choices that are independent of each other.',
  adapt: 'css',
  axes: {
    size: { values: ['md', 'sm'], default: 'md' },
    tone: { values: ['default', 'subtle'], default: 'default', description: 'Default is raised with a lift; subtle is sunken with the strong border, for dense places such as table rows.' },
  },
  flags: {
    error: { description: 'The choice is invalid, such as terms that must be accepted. An empty box takes the danger edge; a ticked one keeps its fill inside a danger ring; the control also carries aria-invalid.' },
  },
  parts: ['control', 'box', 'icon', 'mixed-icon', 'label', 'text', 'description'],
  figmaNodeId: '4068:10770',
});
