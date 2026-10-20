import { defineVariants } from '../variants.js';

/** Breadcrumbs. Figma "Breadcrumbs" 4136:867 (Size: md, sm; Overflow: Full, Collapsed; Leading icons: No, Yes), built from Link instances and CaretRight separators. Figma's Leading icons is an optional icon on each crumb, not an axis. */
export const breadcrumbs = defineVariants({
  name: 'breadcrumbs',
  block: 'smbk-breadcrumbs',
  summary: 'The trail of pages above this one, each a link, ending on the page the reader is on.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'Figma: Medium, Small.',
    },
    overflow: {
      values: ['full', 'collapsed'],
      default: 'full',
      description: 'Full shows every crumb, wrapping when the room runs out. Collapsed keeps the first crumb, the parent and the current page, and folds the crumbs between them behind a "more" button that opens them as a list of links; a trail of three or fewer shows whole.',
    },
  },
  flags: {},
  parts: ['item', 'link', 'icon', 'separator', 'more'],
  figmaNodeId: '4136:867',
});
