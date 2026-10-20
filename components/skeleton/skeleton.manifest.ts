import { defineVariants } from '../variants.js';

/**
 * Skeleton. Figma "Skeleton" 915:9: thirteen shapes in three sizes. A fourteenth, component, is not in
 * Figma: the skeleton wraps a real component and takes its shape.
 */
export const skeleton = defineVariants({
  name: 'skeleton',
  block: 'smbk-skeleton',
  summary: 'A placeholder shown while the real content loads: lines of text, a title, a label, an icon, an avatar, a badge, a button, an input, a media box, a list item, a card or a table row, or the shape of any component it wraps.',
  adapt: 'css',
  axes: {
    shape: {
      values: ['text', 'title', 'label', 'paragraph', 'icon', 'avatar', 'badge', 'button', 'input', 'media', 'list-item', 'card', 'table-row', 'component'],
      default: 'text',
      description: "Figma's thirteen shapes, for content that is not a component; component, not in Figma, for anything else: the skeleton wraps the real component, which keeps its size, place and corners and draws the skeleton instead of itself until it has loaded.",
    },
    size: {
      values: ['sm', 'md', 'lg'],
      default: 'md',
      description: 'The size of the content it stands in for: the text styles a step smaller or larger, and the icon, avatar, badge, button, input and table row at their small, medium or large size. The media shape and a wrapped component take their size from what they stand for.',
    },
  },
  flags: {
    loaded: { description: 'The wrapped component has loaded and shows as itself. Only the component shape has something to show.' },
  },
  parts: ['line', 'text'],
  figmaNodeId: '915:9',
});
