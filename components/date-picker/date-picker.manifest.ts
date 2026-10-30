import { defineVariants } from '../variants.js';

/**
 * Date and time picker. Figma "Date and time picker" 7112:894: Type (Date, Time, Date and time) × State (Default,
 * Hover, Focus, Disabled, Error, Open; Time has no Open), 17 variants, each field an Input with, for a date, a ghost
 * icon button (CalendarBlank) in its Trailing action slot, and Open drawing the Calendar 7112:271 in a floating
 * panel under the date field. Hover and focus are the input's; disabled and read-only are the native attributes;
 * open is the button's aria-expanded. On a phone the calendar opens in a small modal instead, a different behaviour,
 * so the narrow form is chosen in JavaScript. The date range is the code's first: two date fields with the range
 * calendar (Calendar's Selection = Range), after the Figma test drawing on the v0.2.1 file's Testing page (8224:3607).
 */
export const datePicker = defineVariants({
  name: 'date-picker',
  block: 'smbk-date-picker',
  summary: 'A date, a time, or both, typed the reader’s own way or, for a date, chosen from a small calendar that opens under the field.',
  adapt: 'js',
  axes: {
    type: {
      values: ['date', 'time', 'date-time', 'date-range'],
      default: 'date',
      description: 'A date, with a button that opens the calendar; a time, typed; both, as a date field and a time field side by side that wrap under each other when there is no room (Figma’s "Date and time"); or a range, its first and last day side by side with a dash between, picked on the range calendar.',
    },
  },
  flags: {
    error: { description: 'The value is invalid. Draws the input’s danger border, kept while focused, and its error icon in each field.' },
  },
  parts: ['controls', 'input', 'trigger', 'popup', 'to'],
  figmaNodeId: '7112:894',
});
