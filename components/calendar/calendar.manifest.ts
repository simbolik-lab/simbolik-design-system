import { defineVariants } from '../variants.js';

/**
 * Calendar. Figma "Calendar" 7984:1084 (its Selection axis, Single 7112:271 or Range 7984:956, and its Month text property) over
 * "Calendar day" 7112:238 (State: Default, Hover, Focus, Disabled × Selected × Today × Range: None, Start, Middle,
 * End). The day is a part, not a block: it has no use outside the calendar. Its chosen, today, unavailable and range
 * looks are modifiers of the part (--selected, --today, --unavailable, --range-start, --range-middle, --range-end),
 * which the wrapper sets from React Aria's calendar state; hover and focus are the browser's. Figma's Disabled state
 * is the unavailable look. The calendar fills its width, so it has no size axis.
 */
export const calendar = defineVariants({
  name: 'calendar',
  block: 'smbk-calendar',
  summary: 'A month of days to choose a date or a range of dates from, with buttons to the months before and after; it spreads its columns across the width it is given.',
  adapt: 'css',
  axes: {
    selection: {
      values: ['single', 'range'],
      default: 'single',
      description: 'One day, or a range from a first day to a last, joined by a band.',
    },
  },
  flags: {},
  parts: ['header', 'prev', 'title', 'next', 'grid', 'weekdays', 'weekday', 'week', 'cell', 'day'],
  figmaNodeId: '7984:1084',
});
