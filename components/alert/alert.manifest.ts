import { defineVariants } from '../variants.js';

/** Alert. Figma "Alert" 4139:6031: five variants; action, dismiss, title and description are content. */
export const alert = defineVariants({
  name: 'alert',
  block: 'smbk-alert',
  summary: 'An inline message that stays on the page: an icon, a title, a description, and an optional action or dismiss control.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['default', 'info', 'success', 'warning', 'danger'],
      default: 'default',
      description: 'Neutral, or one of the four feedback families on their subtle surface. Figma calls this "Variant".',
    },
  },
  flags: {},
  parts: ['icon', 'body', 'title', 'description', 'action', 'dismiss'],
  figmaNodeId: '4139:6031',
});
