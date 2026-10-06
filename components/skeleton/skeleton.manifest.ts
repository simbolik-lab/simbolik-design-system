import { defineVariants } from '../variants.js';

/**
 * Skeleton. Figma "Skeleton" 915:9: six shapes. A seventh, component, is not in Figma: the
 * skeleton wraps a real component and takes its shape.
 */
export const skeleton = defineVariants({
  name: 'skeleton',
  block: 'smbk-skeleton',
  summary: 'A placeholder shown while the real content loads: a line of text, a title, a label, an avatar, a media box or a button, or the shape of any component it wraps.',
  adapt: 'css',
  axes: {
    shape: {
      values: ['text', 'title', 'label', 'avatar', 'media', 'button', 'component'],
      default: 'text',
      description: "Figma's six shapes, each one size, for content that is not a component; component, not in Figma, for anything else: the skeleton wraps the real component, which keeps its size, place and corners and draws the skeleton instead of itself until it has loaded.",
    },
  },
  flags: {
    loaded: { description: 'The wrapped component has loaded and shows as itself. Only the component shape has something to show.' },
  },
  parts: ['line'],
  figmaNodeId: '915:9',
});
