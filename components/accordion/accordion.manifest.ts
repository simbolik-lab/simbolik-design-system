import { defineVariants } from '../variants.js';

/**
 * Accordion. Figma "Accordion" 4128:20419 (Cards yes/no) over "AccordionItem" 4128:20300
 * (State × Card, 10 variants). Figma flags the item set as having errors; axes derived from names.
 */
export const accordion = defineVariants({
  name: 'accordion',
  block: 'smbk-accordion',
  summary: 'A stack of headings that each open to reveal their content, as separate cards or as a flat list divided by rules.',
  adapt: 'css',
  axes: {
    look: {
      values: ['cards', 'flat'],
      default: 'cards',
      description: 'Each item as a raised card, or a flat list separated by dividers. Figma calls this "Cards".',
    },
  },
  flags: {},
  parts: ['item', 'summary', 'title', 'caret', 'content', 'divider'],
  figmaNodeId: '4128:20419',
});
