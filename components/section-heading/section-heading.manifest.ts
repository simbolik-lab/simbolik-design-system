import { defineVariants } from '../variants.js';

/**
 * Section heading. Figma "Section heading" 7115:943 (Size × Layout, 4 variants; Count, Summary and Action
 * booleans). Figma's Layout is the layout switch, not an axis; its booleans are whether the wrapper is
 * given a count, a summary or an action, not flags.
 */
export const sectionHeading = defineVariants({
  name: 'section-heading',
  block: 'smbk-section-heading',
  summary: 'The heading row of a section or a panel: its title, how many it holds, a quiet line such as how fresh it is, and one action at its end.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'Small sets the title a heading step smaller with a smaller count, for a panel among many.',
    },
  },
  flags: {},
  parts: ['text', 'title-row', 'title', 'count', 'summary', 'action', 'hidden'],
  figmaNodeId: '7115:943',
});
