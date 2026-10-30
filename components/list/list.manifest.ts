import { defineVariants } from '../variants.js';

/**
 * List. Figma "List" 7113:863 (Type × Dividers, 12 variants) and "List item" 7113:173 (State × Size, 14 variants),
 * one component here: the item is the list's `item` part, its drawn row the `row` part, as Figma's code name
 * `smbk-list__item` says. The item's Size is the list's axis, since every row of a list is one size. The item's
 * states are the row's own: hover, pressed, focus, aria-current, aria-selected and disabled, never classes.
 */
export const list = defineVariants({
  name: 'list',
  block: 'smbk-list',
  summary: 'Rows of the same kind, one thing each: plain, bulleted or numbered text, or rows with an icon, a title and a quiet line that go somewhere, do something or can be chosen.',
  adapt: 'css',
  axes: {
    type: {
      values: ['plain', 'bulleted', 'numbered', 'navigation', 'action', 'selectable'],
      default: 'plain',
      description: 'Plain, bulleted and numbered lists are text. Navigation rows are links, action rows are buttons or hold one, and selectable rows are options a reader chooses.',
    },
    size: {
      values: ['sm', 'md'],
      default: 'sm',
      description: 'The rows of navigation, action and selectable lists: sm rows are at least 40 tall, md rows 48, with more room above and below. Text lists have one size.',
    },
  },
  flags: {
    dividers: { description: 'A line between rows, for rows that are actions or choices. Text lists are grouped by their spacing and rarely need one.' },
    tickless: { description: 'A selectable list whose chosen row shows by its fill and a bolder title, with no tick: for a list where choosing a row opens it, such as an inbox beside its reading pane, where a tick would read as chosen for later. The keyboard and what a screen reader hears stay the same.' },
  },
  parts: ['title', 'items', 'item', 'marker', 'text', 'row', 'start', 'leading', 'body', 'item-title', 'meta', 'trailing', 'check', 'end', 'divider', 'empty', 'glide'],
  figmaNodeId: '7113:863',
});
