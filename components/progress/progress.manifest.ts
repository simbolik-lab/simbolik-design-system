import { defineVariants } from '../variants.js';

/**
 * Progress bar. Figma "Progress Bar" 4168:13627 (Size × State, optional label row)
 * over "ProgressTrack" 4168:13602 (Tone × Type × Value: default, slim and pixel tracks, known and unknown).
 */
export const progress = defineVariants({
  name: 'progress',
  block: 'smbk-progress',
  summary: 'A track with a fill showing how far something has got, with an optional label and value above it; it can say the work failed, or that its end is not known.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['default', 'brand', 'success', 'warning', 'danger'],
      default: 'brand',
      description: 'What fills the track. A failed bar is always danger.',
    },
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'Small uses the slim track and the smaller label styles, for dense rows and lists.',
    },
    type: {
      values: ['default', 'pixel'],
      default: 'default',
      description: 'Default is one smooth bar. Pixel cuts the track into twenty segments and fills whole ones.',
    },
    state: {
      values: ['default', 'failed', 'unknown'],
      default: 'default',
      description: 'Failed leads with the danger icon and words and offers to try again. Unknown shows a detached part of the track and no number, for work whose end is not known.',
    },
  },
  flags: {},
  parts: ['header', 'label', 'icon', 'value', 'retry', 'track', 'fill'],
  figmaNodeId: '4168:13627',
});
