import { defineVariants } from '../variants.js';

/**
 * Stat. Figma "Stat" 7118:401 (Size × Type × State, 10 variants; Dot and Description booleans). Hover,
 * pressed and focus are the browser's states, not an axis. Figma's Dot and Description switches are
 * whether the wrapper is given a dot or a description, not flags. The trend and the chart are not in Figma's
 * set: they hold what the card's old stat body held beside and under its figure.
 */
export const stat = defineVariants({
  name: 'stat',
  block: 'smbk-stat',
  summary: 'One figure with its name and a line of what it means, plain or as a link to where the figure comes from.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'sm'],
      default: 'lg',
      description: 'Small sits closer to its edges and sets the figure a heading step smaller, for a row of many stats.',
    },
    type: {
      values: ['static', 'link'],
      default: 'static',
      description: 'A link takes the link colors and underline on its figure, and the whole tile follows it. The wrapper sets it when it is given an address.',
    },
  },
  flags: {},
  parts: ['name', 'dot', 'figure', 'link', 'trend', 'description', 'chart'],
  figmaNodeId: '7118:401',
});
