---
name: calendar
title: Calendar
type: component
block: smbk-calendar
adaptStrategy: css
figmaNodeId: 7984:1084
status: experimental
---

# Calendar

## Purpose

A month of days to choose a date from, or a range of dates from a first day to a last, with buttons to the months before and after. It is the calendar the date picker opens, and it can stand alone where the month itself is what the reader looks at, such as choosing a day to book. It differs from the date picker, which also takes a date typed in and opens the calendar only when asked.

## Anatomy

- The block, holding the header and the grid. Its selection modifier says how it chooses: `--selection-single` (one day, the default) or `--selection-range` (a range of days).
- The header part: the prev part and the next part, each the button's small ghost icon-only form with a caret, around the title part, the month and year in the label's large size.
- The grid part, a table with the grid's roles. Its weekdays part is a row of weekday parts, each day's name in the label's small size and the secondary text color, centred over its column.
- Six week parts, each seven cell parts. A cell of a day in the month holds the day part, the round mark a reader presses; a cell of another month's day is empty. A month that needs fewer than six weeks leaves the last ones empty, so the calendar keeps its height from month to month.
- The day part's looks are modifiers: `--selected` (the chosen day, filled with the brand action color), `--today` (a brand ring inside the mark) and `--unavailable` (a day that cannot be chosen, in the disabled text color and struck through).
- In a range, the first day carries `--range-start` and the last `--range-end`, each beside `--selected`; the days between carry `--range-middle`. The cell under each draws the band that joins them.

## When to use

- Inside the date picker, which opens it under the date field.
- Alone, when the reader chooses a day near now and seeing the week helps: a delivery day, a booking, a day in a schedule.
- With the range selection, when the reader chooses a stretch of days near now and seeing it laid over the weeks helps: a trip, a stay, a leave.

## When not to use

- A date the reader knows by heart, such as a birth date, or one years away: paging through months is slow. Use the [date picker](../date-picker/date-picker.md) and let them type it.
- A range that spans months, or one the reader knows by its dates: one month shows at a time, so typing the two dates is quicker.
- A month and year alone, such as a card's expiry date. Use two selects or an input.

## Behavior

The calendar shows the month of the chosen day, or of the day the page names to start on, or of today. The previous and next buttons move a month at a time; the previous button stops at the month of the earliest date when one is set, the next button at the latest.

One day is in the Tab order: the chosen day, or the one focused last. The arrow keys move by day and by week, crossing into the months before and after; Page Up and Page Down move by month, and with Shift by year; Home and End go to the start and end of the week. Enter or Space chooses the focused day, as a press does. Days before the earliest date, after the latest, and days the page marks unavailable cannot be chosen; the keys still move onto them, so a reader hears why.

A day is a medium control square with a round mark. Under the pointer, a day that can be chosen takes the ghost hover fill, and the chosen day its brand hover fill. The keyboard focus draws the focus ring around the mark. Today has a brand ring inside its mark, the chosen day the brand fill with its figures in the brand foreground, and an unavailable day the disabled text color with a line through it. A chosen day that is unavailable, as when such a date was typed into a date picker, keeps its fill, dimmed, and is struck through too. A disabled calendar shows every day in the disabled text color, out of reach.

With the range selection, the first press, or Enter, sets one end of the range; until the second, the range follows the pointer or the keyboard focus from it, so the reader sees what they are about to choose; the second press sets the other end, before or after the first. The first and last days take the chosen day's mark, and the days between sit on a band in the selected surface color, their figures in the default text color, joining the two marks. The band runs on across the space between the columns of a wide calendar; where the range carries on into the next week it ends round at the week's last column and starts round again on the next, and a range that goes on past the month ends round at its last day. A range of one day is its mark alone. A range never runs across an unavailable day: once one end is set, the days past the nearest unavailable day on either side are out of reach until the range is done. Leaving the calendar halfway, by a press outside it or with Tab, keeps the range up to the day last reached. The band follows the reading direction.

The calendar fills the width it is given and is never narrower than seven days. Given more room, its seven columns spread across it, the first and last at its edges, so the weekday names stay over their days.

The month's name, the weekday names, the first day of the week and the figures follow the reader's language, or the language the page sets with `locale`; the arrow keys follow the page's reading direction. Days are counted in the Gregorian calendar. Dates go in and come out as ISO dates, year, month and day as YYYY-MM-DD, whatever the language. The keys, the reading of dates and the announcements come from React Aria, which a React project installs beside React.

## Accessibility

### What it does for you

- The calendar is named by its month, with the name the page gives it before. The grid is named by the month too.
- Each day is a button read with its weekday, day, month and year, and says when it is today or chosen. Today is marked as the current date as well. The weekday row is hidden from screen readers, since every day says its weekday.
- The month is announced as the previous and next buttons change it, and the chosen date as it changes.
- With the range selection, the grid says that more than one day can be chosen. Every day in the range is read as chosen. Each day tells a screen reader that a press starts a range, and once one end is set, that a press finishes it; the range chosen is announced from its first date to its last. The band is never the only sign: each day in it is said to be chosen, and the two ends carry the chosen day's mark.
- An unavailable day is out of reach and said to be so. It is never shown by color alone: it is struck through.
- Today and the chosen day differ from other days by a ring and a fill, not only by color, and in high contrast mode they take the system's own colors.
- One day is in the Tab order, and the arrow keys move between days.

### What you must do

- Give the calendar an aria-label or aria-labelledby saying what the date is for, such as "Delivery date".
- Give an unavailable day a reason in words when the reader needs one, such as "closed at weekends". A screen reader then says it with the day.

### How to test

- Tab into the grid: one day takes focus, with its ring showing in both themes and in a forced-color mode. Move with the arrow keys, then press Enter or Space to choose a day.
- Press Page Down, then Page Up: the month changes and is announced.
- With a screen reader, the calendar is read by its name and month, each day by weekday, day, month and year, and today and the chosen day are said so.
- With a range, choose the first day and move on: the screen reader says a press finishes the range, and the range is announced when set.
- With text at 200% and the page 320 pixels wide, the grid keeps seven days and the days stay readable.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the previous month button, the next month button, then the one day in the grid that takes focus. |
| Left Arrow or Right Arrow | Moves focus one day. The directions follow the reader's language. |
| Up Arrow or Down Arrow | Moves focus one week. |
| Page Up or Page Down | Moves focus one month. |
| Shift + Page Up or Shift + Page Down | Moves focus one year. |
| Home or End | Moves focus to the first or last day of the week. |
| Enter or Space | Chooses the focused day. In a range, the first press sets one end and the second sets the other. |
| Escape | In a range, cancels the range being chosen. |

## Composition

The button's small ghost icon-only form for the previous and next buttons. Sits in the date picker's panel, or on a page of its own.

## Usage rules

### Do

- Name it for what the date is for.
- Set the earliest and latest dates the reader can choose, so the buttons stop where choosing stops.
- Give a reason in words for days that cannot be chosen.
- Choose a range with the range selection, not with two calendars side by side for the first and last day.

### Don't

- Use it alone for a date the reader knows by heart. Use the date picker.
- Show a day as unavailable by color alone in markup written by hand: give it the unavailable modifier, which strikes it through.
- Write a range by hand with the band alone: give its two ends the selected modifier beside their range modifier, so they carry the mark.

## Related

- [Date picker](../date-picker/date-picker.md): a date typed in, or chosen from this calendar in a panel under the field.
- [Popover](../popover/popover.md): the panel the date picker opens the calendar in.
- [Button](../button/button.md): the previous and next buttons.
