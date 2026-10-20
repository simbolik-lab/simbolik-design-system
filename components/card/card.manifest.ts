import { defineVariants } from '../variants.js';

/**
 * Card. Figma "Card" 7363:823 (Surface × Layout, 25 variants, and a Dragged switch) with its parts, "CardHeader" 7357:668
 * (Type × Size), "CardBody" 7361:535 (Type: Text, Slot) and "CardFooter" 7362:518 (Type), read on 14 October 2026.
 * One component here: the header, body and footer are the card's parts, each kind and size a modifier of
 * its part (`smbk-card__header--type-person`), since every card holds its own kinds.
 */
export const card = defineVariants({
  name: 'card',
  block: 'smbk-card',
  summary: 'A bounded box about one thing: an optional picture, a header, a body and a footer, on one of five surfaces and in one of five layouts.',
  adapt: 'css',
  axes: {
    surface: {
      values: ['slab', 'raised', 'float', 'well', 'outline'],
      default: 'slab',
      description: 'The floor the card stands on: slab for panels, raised for cards to pick from, float for the one that leads, well cut into the page with its picture raised inside, outline with no fill.',
    },
    layout: {
      values: ['stacked', 'side', 'panel', 'compact', 'behind'],
      default: 'stacked',
      description: 'Stacked puts the picture on top, side beside the words, behind under them; panel lays the parts edge to edge with the header on a shaded band; compact is the tight card for a grid.',
    },
  },
  flags: {
    selected: { description: 'The brand edge round the card, for the one chosen among several. Say so in words too.' },
    brackets: { description: 'Brand marks at the four corners, a decoration that points at the card.' },
    'warning-edge': { description: 'A warning edge for a card that needs attention. Say why in words too.' },
    'danger-edge': { description: 'A danger edge for a card in trouble. Say why in words too.' },
    dragged: { description: 'Lifted with the overlay shadow while the card is being moved, as on a board. The page sets it for as long as the move lasts.' },
  },
  parts: [
    'media', 'content', 'header', 'top', 'icon-tile', 'icon', 'avatar', 'lights', 'header-text', 'eyebrow', 'title-row', 'title', 'link', 'number', 'window-title', 'meta', 'trailing', 'arrow',
    'body', 'divider', 'footer', 'footer-row', 'footer-start', 'footer-end',
  ],
  figmaNodeId: '7363:823',
});
