import { defineVariants } from '../variants.js';

/**
 * Spinner. Figma "Spinner" 7110:461: Size × Tone × Reduced motion, 12 variants, and the label text.
 * Reduced motion is no axis here: the stylesheet follows the reader's setting, stopping the ring and showing the words.
 */
export const spinner = defineVariants({
  name: 'spinner',
  block: 'smbk-spinner',
  summary: 'A small turning ring that says something is being worked on, for a wait with no known end: alone, beside its words, or inside a busy button.',
  adapt: 'css',
  axes: {
    size: {
      values: ['sm', 'md', 'lg'],
      default: 'sm',
      description: 'The ring is the icon size of its step: sm sits beside small text and inside small controls, md beside body text, lg alone in a region.',
    },
    tone: {
      values: ['default', 'subtle'],
      default: 'default',
      description: 'Default draws the ring in the main icon color; subtle in the quieter one, for a wait beside secondary text.',
    },
  },
  flags: {
    label: { description: 'Shows the words beside the ring. Without it they are still read aloud, and they show anyway when the reader asks for reduced motion.' },
  },
  parts: ['ring', 'label'],
  figmaNodeId: '7110:461',
});
