---
name: table
title: Table
type: component
block: smbk-table
adaptStrategy: css
figmaNodeId: 4318:16988
status: candidate
---

# Table

## Purpose

Rows of the same kind of thing, one per line, under headings the reader can sort by: clusters, users, orders. It is for comparing and finding, not for laying out a page. A card grid is for things that each need room; a table is for many things that each need a line.

## Anatomy

- The block, a bordered and rounded frame around a real table element, with a hidden caption naming it.
- The header row on the default surface, with a rule under it in the control color. Each header part holds a heading in the small label style and, when sortable, an arrow: up on a column sorted ascending, down on one sorted descending, both ways on a column not sorted; hairlines separate the headings. The first heading may carry the choose-all checkbox. After the heading may come a filter button, a funnel with a count beside it while filters apply, and an info button; both are the extra-small quiet icon button.
- A column of figures lines up at the end: its heading, its arrow (before the label, so the label meets the figures' edge) and its cells.
- The row part, one per record, with a subtle rule under it, taking the hover fill under the pointer. A chosen row takes its own fill, beside its ticked checkbox, and its descriptions turn one step darker so they stay readable on it. A disabled row is dimmed.
- The cell part, holding a value part: text with an optional icon before it, a description straight under it, both in the tiny style, and a copy button after it. A cell may instead hold an avatar beside a link, a tag, a badge, a row of icon buttons, a picture, or a figure with a bar after it, the progress track filled to its share; the content part lines them up. Numbers take digits of equal width, so they line up down a column.
- A prose column holds sentences: its cells wrap between a narrowest and a widest measure, and the other cells of the row line up with the first line.
- Row states beside chosen and disabled: a pinned row has a brand edge on its start side and a pin at its start; a highlighted row takes the info tint; a rule above a row, stronger than the rest, starts a new group.
- A row that opens has a caret at its start, pointing to the end while closed and down while open, and unfolds a detail row under it: one cell across every column on the sunken surface, often a title over a few lines. In a table with such rows, or pinned ones, every first cell keeps the same room at its start, so the columns line up.
- A group heading row: one cell across the row with a label and a count in the subtle color, starting the rows under it.
- The choose checkbox, when rows are chosen: a subtle small checkbox in the first column, and the same in the first heading for every row.
- The footer part, under a strong rule, for the range pagination on the left, with its small select, and the numbers pagination on the right.
- Two forms for big tables. The long form keeps the heading row in view while the table scrolls inside its frame, whose height the page limits. The pinned form keeps the first column in view while a wide table scrolls sideways. Each sticking cell draws its own rules, so they stay with it.

## When to use

- Lists of records with several attributes each, where the reader scans and compares.
- Anything the reader may want to sort or select in bulk.

## When not to use

- Fewer than three columns. A [list](../list/list.md) will do.
- Content that needs room or pictures. Use [cards](../card/card.md). A column of short sentences is fine as a prose column.
- A narrow screen. Tables do not reflow; give the reader a list there.

## Behavior

A row is at least one medium control high, and grows with what its cells hold: a value over its description keeps a medium inset above and below it, so its two lines never run up to the rules, and a prose cell's sentences grow the row line by line.

Pressing a heading's filter button opens a list of choices that tick; ticking one leaves the list open, and the consumer filters the rows and passes the new count. Pressing the info button opens its explanation in a popover beside it; Escape, a press outside or moving focus away closes it. Pressing a row's caret opens or closes its detail row; the table keeps which rows are open, or the consumer does when it passes them in. Pressing a sortable heading asks the consumer to sort by it; the sorted heading reads in the default text color, shows its direction with its arrow and announces it. The sort button and the copy button each give the pointer at least 24 by 24 px to press. Choosing rows is the consumer's to handle; the table draws the checkboxes and the chosen rows' fill and reports the presses. In a selectable table a row can be left out of the choosing (`selectable: false`): it has no checkbox and keeps the checkbox's room empty, so its first value lines up with the others, and the heading's checkbox speaks for the rows that can be chosen, ticked when every one of them is; pressing it asks the consumer to choose, or let go of, those rows only. A row also passes on any `data-` attribute given to it, such as `'data-task': '42'`, to its row element, for the page's own scripts, checks and links. Rows cannot be reordered: the table draws no drag handle, and `draggable` draws nothing. A table wider than its place scrolls sideways inside its frame, so no column is ever hidden; with the first column pinned, every row keeps its subject in view while it does. A long table given a lower frame scrolls inside it with its headings in view. Nothing animates.

A table wider than its frame scrolls sideways inside it, and a long table given a lower frame scrolls down inside it, with the system's scrollbar: a thin, see-through bar over its rows that takes no room and shows while the mouse is over it or it scrolls. Where no scrollbar takes room (the system's, or the browser's on a phone or a trackpad), a thin bar along the frame's foot also shows that there is more to the side and how much of the table is in view, and follows the scroll; it holds the frame's visible edges, and in a long table its foot. It fades while the system's scrollbar shows, in the same strip, so there is never a second bar.

On a touch screen the sort, copy and caret buttons, the heading's filter and info buttons and a choose box keep their size and take an invisible press area round them, out to the comfortable touch target but never past their own row; side by side in a cell, they reach only halfway to each other. In a table with a pinned first column, what scrolls into view stops beside the pinned column, never under it.

## Accessibility
### What it does for you

- It is a real table with a caption, column headings with scope, and sort state on the sorted heading.
- The choose-all checkbox is named, shows a mixed state when some rows are chosen, and each row's checkbox is named after the row. A row that cannot be chosen has no checkbox, so nothing that does nothing is reached, and the choose-all checkbox counts only the rows that can be.
- The info button on a heading is a real button that Tab reaches, named for what it explains ("About Budget"); Enter, Space, a click or a tap opens its popover, and Escape returns focus to it.
- The filter button is named for its column and says how many filters apply ("Filter Stage, 2 applied"), so the count is heard, not only seen. Its list is a menu of items that tick, moved through with the arrow keys and ticked with Space, and Escape closes it and returns focus.
- A row's caret is a button named for its row ("Details for Brand refresh") that says whether the row is open and points at the detail row; a closed detail row is hidden, so it is out of the reading order.
- A group heading is a heading cell for the rows under it, each group a body of its own.
- A pinned row is told by its pin, which says "Pinned" to screen readers, not by its edge alone.
- A cell's bar is hidden from screen readers; the figure beside it is the value.
- A chosen row is told by its ticked checkbox, not by its fill alone.
- In the long form the frame scrolls up and down, so it is a region named after the caption that Tab can reach, and the arrow keys scroll it.
- A table too wide for its frame scrolls sideways inside it; while it does, the frame is the same named region that Tab reaches. A frame with nothing to scroll takes no Tab.
- The scroll hint is decoration: hidden from assistive technology, and it takes no press; the table scrolls as it always does.
- On a touch screen the sort, copy and caret buttons, the heading's filter and info buttons and a choose box take an invisible press area out to the comfortable touch target, never past their own row.

### What you must do

- Give the table a caption.
- When some rows cannot be chosen, say why near the table or in the row, such as its state: the missing checkbox is not explained by itself.
- In markup written by hand, put an empty `smbk-table__choose-space` element where a row that cannot be chosen would have its checkbox.
- Say in words, from the page, why a row is highlighted: a highlighted row's tint says nothing to a screen reader.
- Give the page's own words for everything the table says by itself, such as the names of its checkboxes, carets, pins, filter, info and copy buttons, which keep their English until you do; a page in another language can change them.

### How to test

- Tab through a heading: the sort, filter and info buttons each take focus with a focus ring, and Enter or Space presses them. Open a filter list, move with the arrow keys, tick with Space, and press Escape: the list closes and focus returns to the filter button.
- Tab to a row's caret and press Enter or Space: the detail row opens and the caret says it is open.
- With a screen reader, the table is read with its caption and headings, the sorted heading with its direction, each row's checkbox by the row's name, and the filter button with its count.
- In a table wider than its frame or taller than its place, Tab reaches the frame by its name, and the arrow keys scroll it.
- On a touch screen, the small buttons take a press just outside their own edge.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus through the heading's sort, filter, info and copy buttons, the row checkboxes and carets, and the scrolling frame when it has something to scroll. |
| Enter or Space | On a button (sort, filter, info, caret, copy), presses it. |
| Space | On a checkbox, ticks or clears it. |
| Down Arrow or Up Arrow | In a filter list, moves to the next or previous item. |
| Space | On an item of a filter list, ticks it and leaves the list open. |
| Escape | Closes a filter list or the info popover and returns focus to its button. |
| Arrow keys | On the scrolling frame, scroll it. |

## Composition

Cells take a value, or an avatar, link, tag, badge, buttons, picture or a figure with a bar from the system. A heading's filter list takes dropdown items that tick; a detail row takes a title and text, or a small panel such as a short history or a form. The foot takes paginations. Sits in a page or a card; do not put a table in a table, a detail row included.

## Usage rules

### Do

- Put the identifying column first.
- Keep a value to one line; put the rest in the description, and give sentences a prose column.
- Line figures up at the end of their column.
- Name each row with `label` when it has a caret or a checkbox, so their names say which row they act on.
- Give a table longer than the screen the long form and a frame lower than the window, so its headings stay in view.
- Pin the first column of a table wider than its place, on the page canvas.
- In markup written by hand, give a chosen row the row's selected modifier as well as ticking its checkbox.

### Don't

- Sort on the client for more rows than fit in memory.
- Use the row hover as the only sign of interactivity.
- Let a highlight carry meaning by its tint alone.
- Put a long explanation in a heading's info: it is for a sentence or two.

## Related

- [Pagination](../pagination/pagination.md): the foot's two types.
- [Checkbox](../checkbox/checkbox.md): the subtle variant, in the rows and in the header.
- [Button](../button/button.md), [Dropdown](../dropdown/dropdown.md) and [Popover](../popover/popover.md): the heading's filter and info buttons, the filter's list and the info's panel.
- [Progress](../progress/progress.md): the track and fill of a cell's bar.
- [Card](../card/card.md): for records that need room.
