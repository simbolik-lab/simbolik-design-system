import { defineVariants } from '../variants.js';

/**
 * Search field. Figma "Search Field" 4212:26902: State × Size, 21 variants; the icons and the Kbd are Figma toggles, content here.
 * Built on the input: its markup carries the input's block, size and error classes as well as these, and the magnifier is the
 * input's icon part. The input has no lg, so a large search field carries the input's md classes and this block's lg class,
 * which is the one place this stylesheet changes the input's recipe.
 */
export const searchField = defineVariants({
  name: 'search-field',
  block: 'smbk-search',
  summary: 'A text field for filtering or searching, with a magnifier before the text, a clear control after it and an optional key hint at the end.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'md',
      description: 'lg is 48 tall with larger text, for a search that leads a page; md and sm are the input’s two heights, with their padding, icons and text. Small text never goes under 16 px on a phone.',
    },
  },
  flags: {
    error: { description: 'The query is invalid. Draws the danger border, kept while focused, and the error icon.' },
  },
  parts: ['control', 'clear', 'kbd'],
  figmaNodeId: '4212:26902',
});
