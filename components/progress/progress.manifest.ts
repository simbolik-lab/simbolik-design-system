import { defineVariants } from '../variants.js';

/**
 * Progress bar. Figma "Progress Bar" 4168:13627 (two sizes, optional label row)
 * over "ProgressTrack" 4168:13602 (four fills, default and slim tracks).
 */
export const progress = defineVariants({
  name: 'progress',
  block: 'smbk-progress',
  summary: 'A track with a fill showing how far something has got, with an optional label and value above it.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['default', 'brand', 'success', 'warning'],
      default: 'brand',
      description: 'What fills the track. Figma calls this the track "Variant".',
    },
    size: {
      values: ['default', 'compact'],
      default: 'default',
      description: 'Compact uses the slim track and the smaller label presets.',
    },
  },
  flags: {},
  parts: ['header', 'label', 'value', 'track', 'fill'],
  figmaNodeId: '4168:13627',
});
