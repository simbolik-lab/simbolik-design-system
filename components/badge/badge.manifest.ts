import { defineVariants } from '../variants.js';

/**
 * Badge. Figma "Badge" 4126:20020: Look × Tone × Size, 27 variants; label and icons are content.
 * Figma's Look is Flat or Soft for the four feedback tones and Default for the neutral one, which has one
 * look; the look axis here is soft or flat for every tone. Figma's Tone is the tone axis. The dot is no longer in
 * Figma's set: the status dot is its own component.
 */
export const badge = defineVariants({
  name: 'badge',
  block: 'smbk-badge',
  summary: 'A small status marker: a soft or flat pill with a label and optional icons.',
  adapt: 'css',
  axes: {
    look: {
      values: ['soft', 'flat'],
      default: 'soft',
      description: 'Soft, the default, is the subtle surface inside an edge of the tone\'s color; flat is the tone\'s full surface. The default tone looks the same in soft and flat.',
    },
    tone: {
      values: ['default', 'success', 'info', 'warning', 'danger'],
      default: 'default',
      description: 'A see-through gray that shows on every surface, or one of the four feedback families.',
    },
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
      description: 'The pill scale shared with the chip and the tag: 32, 24 and 20 tall.',
    },
  },
  flags: {},
  parts: ['icon', 'label'],
  figmaNodeId: '4126:20020',
});
