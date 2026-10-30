---
name: date-picker
title: Date and time picker
type: component
block: smbk-date-picker
adaptStrategy: js
figmaNodeId: 7112:894
status: experimental
---

# Date and time picker

## Purpose

A field for a date, a time, both, or a range of days from a first to a last. The reader types the date their own way, or presses the calendar button and chooses it from a small calendar that opens under the field. Typing always works, so a date the reader knows, such as a birth date, is quick to give, and the calendar helps with a date near now.

## Anatomy

- The block, holding the fields and, for a date, the calendar's panel.
- The controls part, a row of the fields that wraps.
- The input part, one per field, the input's well: it carries the input's classes, so its chrome, hover, focus, error, read-only and disabled looks are the input's. The date field is `smbk-date-picker__input--date`, the time field `--time`; a range's last day is a second date field, also `--end`.
- In error, the input's error icon in each field, a warning sign after the value.
- The trigger part, in the date field's trailing action: the button's small ghost icon-only form with a calendar, named "Choose date". It opens and closes the calendar.
- The to part, in a range: the dash between its two days, hidden from screen readers. In a narrow space the two fields stack and the dash goes.
- The popup part, the popover's panel (it carries the popover's classes) with the medium inset around the calendar and the medium container corners, holding the calendar. It is a dialog named "Choose date".
- The type is a modifier: `--type-date`, `--type-time`, `--type-date-time`, `--type-date-range`.
- The label and the help text are not the picker's: put it in a field.

## When to use

- A date or a time a form asks for: a delivery day, a start time, a meeting.
- A date the reader knows, such as a birth date: they type it.
- A date near now, where seeing the week helps: the calendar.
- A stay, a trip or a report's period, from one day to another: the date range.

## When not to use

- A month and year alone, a range of times, or a time chosen from a list. They are not part of this picker.
- A day chosen on a page that shows the month anyway, such as a booking page. Use the [calendar](../calendar/calendar.md) on its own.
- A rough time, such as "this week" or "later". Use [radios](../radio/radio.md) or a [select](../select/select.md).

## Behavior

Each field behaves as the input does: it lifts on hover, shows the field focus border when focused, and in error draws the danger border, kept while focused, and the warning icon.

The date is typed in the order the reader's language writes it, day, month and year, with whatever between them: "27/03/2026", "27.3.26" and "27032026" all read in Britain, "03/27/2026" in the United States. A four-digit year first reads as an ISO date. A two-digit year is the nearest one to now, no more than twenty years ahead. The time is typed in hours and minutes, "14:30", "1430" or "2:30 pm", with the language's words for before and after noon. When the reader leaves a field, or presses Enter, what they typed is read and written again the language's way; what cannot be read stays as it was typed, for the reader to put right, and is never guessed.

The value that leaves the picker is one form whatever the language: an ISO date (YYYY-MM-DD), a 24-hour time (HH:MM, such as "14:30"), both joined by T (YYYY-MM-DDTHH:MM), or for a range the first and last day joined by a slash, as ISO writes a period (YYYY-MM-DD/YYYY-MM-DD). It is settled when a day is picked, or as the reader leaves a field or presses Enter, and given to `onChange` with, when the fields hold no value the picker can give, the reason: not a date, not a time, a date and time (or a range's two days) missing one of them, too early, too late, unavailable, or a range whose last day comes before its first. A value missing one part is reported only as the reader leaves the picker, so moving from one field to the other says nothing yet. The picker never decides the message: the page words it in the field's error, such as "Date must be a real date" or "Date must be in the future". With a form name, the value travels in a hidden input in its one form; a range sends two values under the name, its first day and then its last.

The calendar button, or Alt+Down in the date field, opens the calendar under the date field with the keyboard focus on the chosen day, or on today. Picking a day puts it in the field, closes the calendar and puts the focus back on the button. Escape closes it the same way, and a press outside closes it. Tab and Shift+Tab go round the calendar's buttons and its focused day, as in a dialog. The panel shows over the whole page, keeps the theme, density and text size of the place it opened from, and opens above the field when there is more room there. It drops in with the popover's motion; under reduced motion it fades in and out without moving. In a narrow space, as on a phone, the calendar opens in a small modal instead, with its title and close button.

With both a date and a time, the date field takes the room left beside the time field and never narrows below its least width; with less room, the time field moves under it. A range's two day fields share the row with a dash between; the calendar button sits in the first, and opens the range calendar, where the first press sets one end and the second the other, and picking the second fills both fields and closes it. In a narrow space the two fields stack, each a full row. A read-only picker shows its value with no calendar button and stays in the tab order. A disabled one is dimmed and out of reach, and sends nothing with its form. A required picker stops its form being sent while it holds no value, a range while it lacks either day: its first empty field takes focus and every field takes the error look, which stays until the picker holds a value; the page words the message in the field. A disabled or read-only picker never stops its form.

Days before `min`, after `max`, and days `isDateUnavailable` marks are struck through in the calendar and cannot be picked; one typed in is still read, and reported. For the time type, `min` and `max` are times. Dates and times are written in the Gregorian calendar, in the reader's language or the one set with `locale`, and `hourCycle` sets 12 or 24 hours. A ref given to the React wrapper reaches the first field, so a page can focus it.

`defaultOpen` shows the calendar open from the start, as in a picture of the page, without moving focus; a press elsewhere closes it. The behaviour comes from React Aria, which a React project installs beside React.

## Accessibility

### What it does for you

- With both a date and a time, the two fields are a group named by the field's label, and each field is named by the label and its own word: "Meeting starts Date", "Meeting starts Time". A range's two fields are the same: "Stay Start date", "Stay End date".
- The calendar button is named "Choose date" and says it opens a dialog and whether it is open. The open calendar is a dialog of the same name; each day is read with its weekday, day, month and year, and the chosen date is announced as it changes.
- An unavailable day is struck through, not shown by color alone, and with a reason in words from `isDateUnavailable` a screen reader says it with the day.
- An error marks the fields invalid as well as drawing the danger border; the message names the problem in words, beside the warning icon.

### What you must do

- Name the picker: put it in a field, whose label names the date field, or give it an `aria-label`. In development, a picker with no name logs a warning in the console. The field also links its help text or error message to every field through `aria-describedby`, and its required mark comes with `aria-required` on them.
- Say the format in the field's help text, as an example written the reader's way: `DateFormatExample` writes one, "For example, 03/27/2026" in the United States, "27/03/2026" in Britain. A placeholder goes as typing starts, so it is never the only place the format is said.
- Change the words of the fields' names with `dateLabel` and `timeLabel` (`startLabel` and `endLabel` in a range), and the calendar button's with `chooseLabel`, for a page in another language.
- Give a reason in words from `isDateUnavailable` for each day that cannot be picked.
- Word each error as what is wrong; the picker never decides the message.
- For the reader's own birth date, give `autoComplete="bday"`, so the browser can fill it in.

### How to test

- With the keyboard only, type a date, press Tab to the calendar button and press Enter: the calendar opens on the chosen day, or today. Move with the arrow keys, press Enter on a day, and focus returns to the button. Press Escape to close it without picking.
- With a screen reader, each field is read by its label and its own word, the calendar button as opening a dialog, and each day with its weekday and full date.
- Mark a day unavailable with a reason and check it is spoken with the day.
- Type a date that cannot be read: the field keeps what was typed, and the error your page words appears beside it.
- With text at 200% and the page 320 pixels wide, each field stays whole, the time field moves under the date field when there is no room beside it, and the calendar opens in a small modal in a narrow space.
- In a forced-color mode, the fields, the button and the struck-through days are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus from the date field to the time field and the calendar button. |
| Enter | In a field, reads what was typed and writes it again the language's way. On the calendar button, opens the calendar. In the calendar, chooses the focused day. |
| Alt + Down Arrow | In the date field, opens the calendar with focus on the chosen day, or on today. |
| Escape | Closes the open calendar and puts focus back on the button. |
| Tab or Shift + Tab | In the open calendar, goes round its buttons and its focused day. |
| Arrow keys | In the calendar, move the focused day by day and by week, crossing into the months before and after. |
| Page Up or Page Down | In the calendar, move by month; with Shift, by year. |
| Home or End | In the calendar, move to the start or end of the week. |
| Space | On the calendar button, opens the calendar. In the calendar, chooses the focused day. |

## Composition

The input's well for each field, the button's small ghost icon-only form for the calendar button, the popover's panel and the calendar for the open calendar, and the modal for it in a narrow space. Sits in a field for its label and help text.

## Usage rules

### Do

- Put it in a field, with the format as an example in the help text.
- Word errors as what is wrong: "Date must be a real date", "Date must be in the future".
- Let the reader type a date they know, and keep the calendar for dates near now.

### Don't

- Say the format only in the placeholder.
- Use it for a range of dates or a month and year alone.
- Change what the reader typed into a guess: report it and let them put it right.

## Related

- [Calendar](../calendar/calendar.md): the month the picker opens, on its own.
- [Input](../input/input.md): the well each field is drawn with.
- [Field](../field/field.md): the label, the help text and the error around it.
- [Popover](../popover/popover.md): the panel the calendar opens in.
- [Modal](../modal/modal.md): where the calendar opens in a narrow space.
