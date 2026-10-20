import { defineVariants } from '../variants.js';

/** Segmented control. Figma "SegmentedControl" 4209:19853 over "SegmentItem" 4207:19346. */
export const segmentedControl = defineVariants({
  name: 'segmented-control',
  block: 'smbk-segmented',
  summary: 'A row of named choices in one bar, exactly one of which is selected, with the selected one raised.',
  adapt: 'css',
  axes: {
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'lg',
    },
    'item-width': {
      values: ['equal', 'hug'],
      default: 'equal',
      description: "Equal: every item as wide as the widest, so they share the bar equally, and fill it when the bar is given a width; Figma's items fill their bar this way. Hug: each item as wide as its words. Not in Figma, which draws equal only.",
    },
    content: {
      values: ['label', 'icon', 'description'],
      default: 'label',
      description: "What each item shows. Label: its words, with an icon before them when it has one. Icon: its icon alone (or a short word, for a choice with no icon), its label still the choice's name and shown in a tooltip while pointed at or focused. Description: its label with a short line under it, the bar growing to hold it. Figma's segment item calls this Content: Label, Icon only, Label and description. One for the whole bar.",
    },
    look: {
      values: ['standard', 'theme'],
      default: 'standard',
      description: "Standard: the bar as Figma's segmented control draws it. Theme: the theme switch's look, for a bar of icons alone: square items, each icon a step larger than the standard bar's at its size, and an icon hovered in the brand text color. The theme switch draws it.",
    },
  },
  flags: {},
  parts: ['indicator', 'item', 'icon', 'label', 'short', 'description'],
  figmaNodeId: '4209:19853',
});
