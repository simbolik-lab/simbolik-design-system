import { defineVariants } from '../variants.js';

/**
 * Toast. Figma "Toast" 4209:20131: the alert's structure, lifted with the highest elevation. The region part is where
 * a page's toasts appear and are announced (the wrapper's ToastRegion); Figma does not draw it.
 */
export const toast = defineVariants({
  name: 'toast',
  block: 'smbk-toast',
  summary: 'A short-lived message that floats above the page: the alert\'s anatomy, raised, arriving in a corner and leaving on its own after a few seconds unless someone is reading it.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['default', 'info', 'success', 'warning', 'danger'],
      default: 'default',
      description: 'Neutral, or one of the four feedback families on their subtle surface, each with its own icon.',
    },
  },
  flags: {},
  parts: ['icon', 'body', 'title', 'description', 'action', 'dismiss', 'region'],
  figmaNodeId: '4209:20131',
});
