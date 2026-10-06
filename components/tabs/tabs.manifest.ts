import { defineVariants } from '../variants.js';

/**
 * Tabs. Figma "Tabs" 4171:15599 (Size × Orientation) over "TabItem" 4170:15306.
 * Figma's size axis: Default and Small.
 */
export const tabs = defineVariants({
  name: 'tabs',
  block: 'smbk-tabs',
  summary: 'A bar of named views, one shown at a time, each tab in front of its own panel.',
  adapt: 'css',
  axes: {
    size: {
      values: ['md', 'sm'],
      default: 'md',
      description: 'Figma: Default and Small.',
    },
    orientation: {
      values: ['horizontal', 'vertical'],
      default: 'horizontal',
    },
    'item-width': {
      values: ['equal', 'hug'],
      default: 'hug',
      description: "Hug: each tab as wide as its words, and the bar as wide as its tabs, as Figma draws them. Equal: the bar spans the tabs' whole width, over their panel, and its tabs share it equally. A vertical bar's tabs are always as wide as its widest, so this changes the horizontal bar only. Not in Figma, which draws hug only.",
    },
  },
  flags: {},
  parts: ['list', 'indicator', 'tab', 'icon', 'label', 'badge', 'panel'],
  figmaNodeId: '4171:15599',
});
