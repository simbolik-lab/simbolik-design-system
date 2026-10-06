import { defineVariants } from '../variants.js';

/** Toast. Figma "Toast" 4209:20131: the alert's structure, lifted with the highest elevation. */
export const toast = defineVariants({
  name: 'toast',
  block: 'smbk-toast',
  summary: 'A short-lived message that floats above the page: the alert\'s anatomy, raised, arriving and leaving on its own.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['default', 'info', 'success', 'warning', 'danger'],
      default: 'default',
    },
  },
  flags: {},
  parts: ['icon', 'body', 'title', 'description', 'action', 'dismiss'],
  figmaNodeId: '4209:20131',
});
