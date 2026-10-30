import { defineVariants } from '../variants.js';

/**
 * Collapsible. Figma "Collapsible" 8196:2813 (State: Default, Hover, Focus, Disabled, Expanded; a Leading icon
 * boolean and an Icon swap). Its states are the trigger's hover and focus, the disabled flag and the open details
 * element, so the manifest has no axis.
 */
export const collapsible = defineVariants({
  name: 'collapsible',
  block: 'smbk-collapsible',
  summary: 'One row that shows or hides the content under it, for detail most readers can skip.',
  adapt: 'css',
  axes: {},
  flags: {
    disabled: { description: 'The row dims and cannot be opened or closed. Figma: State Disabled.' },
  },
  parts: ['trigger', 'icon', 'label', 'caret', 'panel'],
  figmaNodeId: '8196:2813',
});
