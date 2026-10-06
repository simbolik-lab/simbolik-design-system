import { defineVariants } from '../variants.js';

/** Banner. Figma "Banner" 4381:2200: five variants; the link and the dismiss control are content (Figma's Link and Discard booleans). */
export const banner = defineVariants({
  name: 'banner',
  block: 'smbk-banner',
  summary: 'A one-line announcement across the top of a site or app: a short message, an optional link and an optional dismiss control, on a full-width strip.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['default', 'info', 'success', 'warning', 'danger'],
      default: 'default',
      description: 'Neutral, or one of the four feedback families on their subtle surface with their border beneath. Figma calls this "Variant".',
    },
  },
  flags: {},
  parts: ['content', 'message', 'link', 'dismiss'],
  figmaNodeId: '4381:2200',
});
