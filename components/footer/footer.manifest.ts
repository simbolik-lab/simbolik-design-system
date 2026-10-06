import { defineVariants } from '../variants.js';

/**
 * Footer. Figma "Footer" 4255:9405: Platform (Desktop, Mobile) × Variant (Default, Minimal).
 * Figma's Platform axis is the layout switch, not a variant; its Variant axis is the look.
 */
export const footer = defineVariants({
  name: 'footer',
  block: 'smbk-footer',
  summary: 'The foot of a website: the brand and its social links, columns of page links, and a legal strip, reflowing to two columns when the space is narrow; or, minimal, the legal strip alone.',
  adapt: 'css',
  axes: {
    look: {
      values: ['default', 'minimal'],
      default: 'default',
      description: 'Default is the whole footer: brand, social links, columns of page links and the legal strip. Minimal is a divider over one strip: the copyright at the start, the legal links in the middle and the social links at the end (or other content in either place), stacked and centered in a narrow space. Figma calls this "Variant".',
    },
  },
  flags: {},
  parts: ['main', 'brand', 'brand-link', 'logo', 'social', 'social-link', 'brand-divider', 'columns', 'column', 'heading', 'list', 'link', 'new-tab', 'divider', 'legal', 'notice', 'tagline', 'center', 'end', 'legal-links', 'legal-link'],
  figmaNodeId: '4255:9405',
});
