import { defineVariants } from '../variants.js';

/**
 * Empty state. Figma "Empty state" 7117:731 (Scope × Tone, 9 variants; Icon, Description and Reference booleans,
 * the Icon an instance swap, Primary and Secondary actions). Figma's causes (first use, no results, offline, an error
 * on the server) are examples, not properties. Its booleans are whether the wrapper is given an icon, a description
 * or a reference, not flags. Figma's Neutral tone is default here. The size axis is built code first, to be drawn in Figma.
 */
export const emptyState = defineVariants({
  name: 'empty-state',
  block: 'smbk-empty-state',
  summary: 'The words that fill an area when what belongs there is missing or failed to load, naming the cause and offering the next step.',
  adapt: 'css',
  axes: {
    scope: {
      values: ['inline', 'centered', 'page'],
      default: 'inline',
      description: 'Inline sits at the start of a list or a panel it stands in for. Centered fills a larger area, centred, with a larger title. Page is the whole page, as a missing page or a page that failed to load.',
    },
    tone: {
      values: ['default', 'warning', 'danger'],
      default: 'default',
      description: 'Warning and danger color the icon for a state that needs care or an error. The words carry the meaning; the color only backs them up.',
    },
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'Small is for one panel among many, as on a dashboard: the title in a label style, a smaller icon and smaller gaps, so an empty panel reads no louder than its neighbors.',
    },
  },
  flags: {},
  parts: ['icon', 'text', 'title', 'description', 'context', 'actions', 'reference', 'hidden'],
  figmaNodeId: '7117:731',
});
