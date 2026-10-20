import { defineVariants } from '../variants.js';

/**
 * Capacity meter. Figma "Capacity meter" 7118:653 (Segments 2 to 4 × Filled 0 to Segments, 12 variants).
 * Figma's Segments and Filled are data, the wrapper's numbers, not axes. It follows the meter's rules (a
 * meter with its value in words) but draws separate bars, so it has its own block rather than the meter's.
 */
export const capacityMeter = defineVariants({
  name: 'capacity-meter',
  block: 'smbk-capacity-meter',
  summary: 'A row of two to four short bars, as many filled as places are taken, with the same in words, such as "1 of 2 places".',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['segments', 'segment', 'words'],
  figmaNodeId: '7118:653',
});
