import { defineVariants } from '../variants.js';

/**
 * Footer. Figma "Footer" 7444:2151 (Style × Platform, switches Background and Divider), built from its parts:
 * FooterBrand 7443:399, FooterLinks 7443:938, FooterLegal 7443:1133 and FooterCTA 7443:1210. Figma's Platform axis
 * is the layout switch, not a variant; its Style axis is the look. The parts are parts of the footer here, not
 * components of their own: nothing else uses them.
 */
export const footer = defineVariants({
  name: 'footer',
  block: 'smbk-footer',
  summary: 'The foot of a website in six looks: the brand, page links in columns or a row, and a legal strip; on a phone the columns fold into rows that open.',
  adapt: 'css',
  axes: {
    look: {
      values: ['columns', 'minimal', 'centred', 'floating', 'call-to-action', 'big-wordmark'],
      default: 'columns',
      description:
        'Columns: the brand beside columns of page links, then the legal strip. Minimal: a divider over the legal strip alone, its copyright at the start, its legal links in the middle and its social links at the end. Centred: the brand, a row of page links and the legal strip, each centered. Floating: the columns look on a raised card. Call to action: a card asking for one action above the columns look. Big wordmark: the columns look with the name set as wide as the footer under it. On a phone the columns fold into rows that open. Figma calls this Style.',
    },
    divider: {
      values: ['on', 'off'],
      default: 'on',
      description: 'The divider above the legal strip. Figma: Divider (on by default).',
    },
    legal: {
      values: ['start', 'end'],
      default: 'start',
      description:
        "Where the legal links sit in the legal strip in a wide space. Start: after the copyright and the tagline, as Figma's strip draws them. End: at the strip's end, before the extras when there are some, the copyright and the tagline staying at the start. On a phone the strip stacks the same either way. The centred and minimal looks place their legal links themselves, so it changes the other four. End is not in Figma.",
    },
    'column-width': {
      values: ['hug', 'equal'],
      default: 'hug',
      description:
        "Hug: each column of links as wide as its longest link, and columns that run out of room wrap one at a time, as Figma draws them. Equal: every column as wide as the widest, the same gap between them, all in one row where they fit and otherwise in two rows as even as the count allows, four as two and two, sitting at the row's end. The folded columns on a phone are the same either way. Equal is not in Figma.",
    },
  },
  flags: {
    background: { description: 'A band behind the footer: the default surface with a hairline along its top, so the footer stands apart from a page on the canvas color. Figma: Background (off by default).' },
    zone: { description: "The footer's own room, as Figma draws it: its content held to the content width and centered, with Figma's space above, below and at the sides (a small margin around the floating card). Off by default, so a page that already places its footer keeps its own room." },
  },
  parts: [
    'content', 'main', 'brand', 'brand-link', 'logo', 'blurb', 'social', 'social-link', 'newsletter', 'newsletter-row', 'brand-divider',
    'columns', 'half', 'column', 'heading', 'list', 'link', 'new-tab', 'folds', 'fold', 'fold-heading', 'caret', 'fold-divider', 'row',
    'cta', 'cta-text', 'cta-headline', 'cta-line', 'cta-actions',
    'divider', 'legal', 'legal-start', 'notice', 'copyright', 'tagline', 'center', 'end', 'legal-links', 'legal-link', 'extras', 'fine-print',
    'wordmark', 'wide-only', 'narrow-only',
  ],
  figmaNodeId: '7444:2151',
});
