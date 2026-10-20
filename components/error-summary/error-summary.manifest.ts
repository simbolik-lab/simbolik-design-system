import { defineVariants } from '../variants.js';

/**
 * Error summary. Figma "Error summary" 7110:412 (Size × State, 4 variants; Intro line boolean) and "Error summary
 * item" 7110:350 (Type = Link, Text only), one component here: the item is the summary's `item` part, its link the
 * `link` part, and Text only is an item without a link, not a class. Figma's Focus state is the browser's focus.
 */
export const errorSummary = defineVariants({
  name: 'error-summary',
  block: 'smbk-error-summary',
  summary: 'A box at the top of a form after a failed send, listing every mistake as a link that moves focus to its field.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'Small sits closer to its edges with a smaller heading, for a dialog or a narrow form.',
    },
  },
  flags: {},
  parts: ['icon', 'content', 'text', 'heading', 'intro', 'list', 'item', 'link'],
  figmaNodeId: '7110:412',
});
