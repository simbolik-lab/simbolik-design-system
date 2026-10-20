import { defineVariants } from '../variants.js';

/** Logo. Figma "logo-simbolik" 363:14503 (Variant: Logo, Logomark, Logotype × Source: Shapes, Picture). */
export const logo = defineVariants({
  name: 'logo',
  block: 'smbk-logo',
  summary: 'The Simbolik brand mark: the full logo, the mark alone, or the wordmark alone, colored by the text roles; or a site\'s own logo as shapes or as a picture file.',
  adapt: 'css',
  axes: {
    brand: {
      values: ['simbolik'],
      default: 'simbolik',
      description: "Which brand's logo. The logo stays simbolik's, and no license covers it; a product built on the design system replaces it with its own.",
    },
    form: {
      values: ['logo', 'logomark', 'logotype'],
      default: 'logo',
      description: 'The whole logo, the mark alone, or the wordmark alone. Figma calls this "Variant" / "Type".',
    },
    source: {
      values: ['shapes', 'picture'],
      default: 'shapes',
      description: 'Shapes are drawn in the page and take the system\'s colors, so they follow the theme; a picture is a site\'s logo file, drawn as an image with its own colors, and a dark version under the dark theme.',
    },
  },
  flags: {},
  parts: ['mark', 'type', 'picture', 'picture-dark'],
  figmaNodeId: '363:14503',
});
