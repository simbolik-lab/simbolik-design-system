import { defineVariants } from '../variants.js';

/**
 * Search field. Figma "Search Field" 4212:26902: State × Size, 14 variants; the icons and the Kbd are Figma toggles, content here.
 * Built on the input: its markup carries the input's block, size and error classes as well as these, and the magnifier is the input's icon part.
 */
export const searchField = defineVariants({
  name: 'search-field',
  block: 'smbk-search',
  summary: 'A text field for filtering or searching, with a magnifier before the text, a clear control after it and an optional key hint at the end.',
  adapt: 'css',
  axes: {
    size: { values: ['default', 'small'], default: 'default' },
  },
  flags: {
    error: { description: 'The query is invalid.' },
  },
  parts: ['control', 'clear', 'kbd'],
  figmaNodeId: '4212:26902',
});
