import { defineVariants } from '../variants.js';

/**
 * Splitter. Figma "Splitter" 7117:70 (Orientation × State, 10 variants; boolean Grip). Figma's Orientation names
 * the line ("Vertical line", "Horizontal line"); the axis value is the line's direction, which is also what
 * aria-orientation takes. Hover and Focus are the browser's states, Dragging the data-dragging attribute the wrapper
 * sets while the pointer holds it, and Disabled aria-disabled, so none of them is a class. The grip is an optional part.
 */
export const splitter = defineVariants({
  name: 'splitter',
  block: 'smbk-splitter',
  summary: 'The line between two panes that the reader drags, or moves with the arrow keys, to give one pane more room and the other less.',
  adapt: 'css',
  axes: {
    orientation: {
      values: ['vertical', 'horizontal'],
      default: 'vertical',
      description: 'Vertical is a line between two columns side by side, moved left and right. Horizontal is a line between two stacked panes, moved up and down.',
    },
  },
  flags: {},
  parts: ['line', 'grip', 'icon'],
  figmaNodeId: '7117:70',
});
