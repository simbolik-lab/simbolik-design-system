import { defineVariants } from '../variants.js';

/**
 * Diff stat. Figma "Diff stat" 7580:1825 (Balance: Adds, Mixed, Removes, 3 variants). Figma's Balance is
 * example data, the share of lines added and removed, so it is the wrapper's two numbers, not an axis.
 */
export const diffStat = defineVariants({
  name: 'diff-stat',
  block: 'smbk-diff-stat',
  summary: 'How much a change touched: the lines added and removed, such as "+128 −12", and a row of five small squares that shows the balance.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['hidden', 'added', 'removed', 'blocks', 'block'],
  figmaNodeId: '7580:1825',
});
