import { defineVariants } from '../variants.js';

/**
 * Popover. Figma "Popover" 4804:65705, built from "PopoverHeader" 4804:65619
 * (Icon, Discard, Description and Divider booleans), "PopoverBody" 4804:65655
 * (Type: Description, Field) and "PopoverFooter" 4803:65513 (Type: Button,
 * Button Group, Helper Text; a Divider boolean). Figma draws no opener; its
 * placements (below lined up with the opener's start or end, and above) were
 * drawn as examples outside the set. The two axes say where the panel prefers
 * to sit, and only matter when the popover draws its opener.
 */
export const popover = defineVariants({
  name: 'popover',
  block: 'smbk-popover',
  summary: 'A small raised panel that opens from a button and stays beside it, holding a title, a few lines or a field, and actions, without blocking the page.',
  adapt: 'css',
  axes: {
    align: {
      values: ['start', 'end'],
      default: 'start',
      description: 'Which edge of the opener the panel lines up with. End keeps a popover at the right of a bar inside the window.',
    },
    side: {
      values: ['below', 'above'],
      default: 'below',
      description: 'The side of the opener the panel prefers. With script it takes the other side when this one has no room, as at the foot of the window.',
    },
  },
  flags: {},
  parts: ['anchor', 'layer', 'header', 'heading', 'icon', 'titles', 'title', 'description', 'close', 'divider', 'body', 'footer', 'helper'],
  figmaNodeId: '4804:65705',
});
