import { defineVariants } from '../variants.js';

/** Divider. Figma "Divider" 1924:9 (two orientations) and "Divider Labelled" 1924:8774. */
export const divider = defineVariants({
  name: 'divider',
  block: 'smbk-divider',
  summary: 'A two-line rule — a shade line over a highlight line — that separates content, optionally with a word in the middle.',
  adapt: 'css',
  axes: {
    orientation: {
      values: ['horizontal', 'vertical'],
      default: 'horizontal',
    },
  },
  flags: {
    labelled: { description: 'A short uppercase word interrupts the line. Horizontal only.' },
  },
  parts: ['line', 'label'],
  figmaNodeId: '1924:9',
});
