import { defineVariants } from '../variants.js';

/**
 * Timeline. Figma "Timeline" 7607:118483 (a slot of items) over "Timeline item" 7580:1607 (Tone × Position,
 * 10 variants). One component here: the item is the timeline's `item` part. Its Tone is a modifier of the part
 * (smbk-timeline__item--tone-success), since each event has its own; its Position is the item's place in the
 * list, so the last item drops its line by itself and there is no class for it.
 */
export const timeline = defineVariants({
  name: 'timeline',
  block: 'smbk-timeline',
  summary: 'Things that happened, one after another: each event a dot for its kind, what happened, when, and who or what did it, joined by a line.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['item', 'rail', 'marker', 'dot', 'line', 'body', 'disclosure', 'summary', 'top', 'title', 'time', 'caret', 'meta', 'detail', 'more', 'hidden'],
  figmaNodeId: '7607:118483',
});
