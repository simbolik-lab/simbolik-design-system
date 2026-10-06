import { defineVariants } from '../variants.js';

/**
 * Card. Figma "Card" 4255:7087 (Default, Image top, Image side, Image BG) with
 * CardHeader 4174:18777, CardBody 4244:30463 and CardFooter 4174:18782.
 * Figma flags this set as having errors; the axes were derived from its variant names.
 */
export const card = defineVariants({
  name: 'card',
  block: 'smbk-card',
  summary: 'A raised container for one thing: an optional picture, a header with eyebrow and title, body text, and a footer with an action.',
  adapt: 'css',
  axes: {
    media: {
      values: ['none', 'top', 'side', 'background'],
      default: 'none',
      description: 'Where the picture goes. Figma: Default, Image (Top / Side), Image BG.',
    },
  },
  flags: {},
  parts: ['media', 'content', 'header', 'eyebrow', 'title', 'icon', 'body', 'footer'],
  figmaNodeId: '4255:7087',
});
