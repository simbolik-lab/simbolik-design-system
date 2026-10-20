import { defineVariants } from '../variants.js';

/**
 * Meter. Figma "Meter" 7580:43 (Value 0 to 100 in tens × Tone, 44 variants) over the track of
 * "ProgressTrack" 4168:13602. Figma's Value is data, the wrapper's value, not an axis. The meter is
 * built on the progress bar and carries its classes; it adds its own tones only.
 */
export const meter = defineVariants({
  name: 'meter',
  block: 'smbk-meter',
  summary: 'A short bar showing how full something is inside a known range, such as storage used, with an optional label and value.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['series', 'success', 'warning', 'danger'],
      default: 'series',
      description: 'The fill: series is the chart color, for a level that is neither good nor bad; success, warning and danger say how the level stands. The page chooses it.',
    },
  },
  flags: {},
  parts: [],
  figmaNodeId: '7580:43',
});
