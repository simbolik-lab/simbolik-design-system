import { defineVariants } from '../variants.js';

/**
 * Log. Figma "Log" 7118:1670 (State: Empty, Running, Finished, Scrolled up; Header boolean). Of Figma's
 * states, running and finished are the page's to say, so they are the axis; Empty is a log with no lines
 * yet, and Scrolled up is the reader's own scroll, which the wrapper follows. Figma's Header switch is
 * whether the wrapper is given a title.
 */
export const log = defineVariants({
  name: 'log',
  block: 'smbk-log',
  summary: 'What a program prints as it runs: wrapped lines in a well that keeps the newest in view until the reader scrolls up.',
  adapt: 'css',
  axes: {
    state: {
      values: ['running', 'finished'],
      default: 'running',
      description: 'Running while the program prints, finished once it stops. The badge says which, and a screen reader hears when it starts and when it ends.',
    },
  },
  flags: {},
  parts: ['header', 'title', 'status', 'well', 'scroll', 'note', 'divider', 'lines', 'jump', 'announcement'],
  figmaNodeId: '7118:1670',
});
