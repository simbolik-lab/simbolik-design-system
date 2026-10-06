import { defineVariants } from '../variants.js';

/** Breadcrumbs. Figma "Breadcrumbs" 4136:867 (Medium, Small), built from Link instances and CaretRight separators. */
export const breadcrumbs = defineVariants({
  name: 'breadcrumbs',
  block: 'smbk-breadcrumbs',
  summary: 'The trail of pages above this one, each a link, ending on the page the reader is on.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'Figma: Medium, Small.',
    },
  },
  flags: {},
  parts: ['item', 'link', 'separator'],
  figmaNodeId: '4136:867',
});
