import { defineVariants } from '../variants.js';

/** Logo. Figma "logo-simbolik" 363:14503 (Logo, Logomark, Logotype). */
export const logo = defineVariants({
  name: 'logo',
  block: 'smbk-logo',
  summary: 'The Simbolik brand mark: the full logo, the mark alone, or the wordmark alone, colored by the text roles.',
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
  },
  flags: {},
  parts: ['mark', 'type'],
  figmaNodeId: '363:14503',
});
