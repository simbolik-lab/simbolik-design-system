import { defineVariants } from '../variants.js';

/**
 * Status dot. Figma "Status dot" 7096:77 (Tone, 5 variants; Label). It replaced the badge's dot look.
 * Figma's Neutral tone is default here. Figma's Label switch is whether the wrapper is given words, not a flag.
 */
export const statusDot = defineVariants({
  name: 'status-dot',
  block: 'smbk-status-dot',
  summary: 'A small colored dot that marks a status, with the status in words beside it.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['success', 'info', 'warning', 'danger', 'default'],
      default: 'success',
      description: 'The status the dot marks: success, info, warning and danger take the feedback colors; default the subtle gray, for a status that is neither good nor bad, such as offline.',
    },
  },
  flags: {},
  parts: ['dot', 'label'],
  figmaNodeId: '7096:77',
});
