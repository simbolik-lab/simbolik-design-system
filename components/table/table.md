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
- The header row on the default surface, with a rule under it in the control color. Each header part holds a heading in the small label style, an optional info icon, and, when sortable, an arrows icon; hairlines separate the headings. The first heading may carry the choose-all checkbox.
- The row part, one per record, with a subtle rule under it, lifting to the overlay surface on hover. A disabled row is dimmed.
- The cell part, holding a value part: text with an optional icon before it, a description under it in the tiny style, and a copy control after it. A cell may instead hold an avatar beside a link, a tag, a badge, a row of icon buttons or a picture; the content part lines them up.
- The control column, when rows drag or are chosen: a drag handle and a subtle small checkbox.
- The footer part, for the range pagination on the left and the numbers pagination on the right.
- Two forms for big tables. The long form keeps the heading row in view while the table scrolls inside its frame, whose height the page limits. The pinned form keeps the first column in view while a wide table scrolls sideways. Each sticking cell draws its own rules, so they stay with it.

## When to use

- Lists of records with several attributes each, where the reader scans and compares.
- Anything the reader may want to sort or select in bulk.

## When not to use

- Fewer than three columns. A list will do.
- Content that needs room, pictures or long text. Use cards.
- A narrow screen. Tables do not reflow; give the reader a list there.

## Behavior

Pressing a sortable heading asks the consumer to sort by it; the sorted heading reads in the default text color and announces its direction. Choosing rows and reordering them are the consumer's to handle; the table draws the checkboxes and the handles and reports the presses. A table wider than its place scrolls sideways inside its frame, so no column is ever hidden; with the first column pinned, every row keeps its subject in view while it does. A long table given a lower frame scrolls inside it with its headings in view. Nothing animates.

A table wider than its frame scrolls sideways inside it. Where the browser's own scrollbar hides until the frame scrolls (a phone, a trackpad), a thin bar along the frame's foot shows that there is more to the side and how much of the table is in view, and follows the scroll; it holds the frame's visible edges, and in a long table its foot. Where the browser's scrollbar always shows, the bar stays away, so there is never a second one. The frame's own scrollbar is the system's thin one.

## Accessibility

- A real table with a caption, column headings with scope, and sort state on the sorted heading.
- The choose-all checkbox is named, shows a mixed state when some rows are chosen, and each row's checkbox is named after the row.
- The info icon on a heading carries its help text as its name.
- Drag handles are decorative; reordering must also be possible without a mouse, which is the consumer's to provide.
- The handles' column has a heading too, "Reorder", written out of sight so a screen reader reads it as the column's header.
- In the long form the frame scrolls up and down, so it is a region named after the caption that Tab can reach, and the arrow keys scroll it.
- A table too wide for its frame scrolls sideways inside it; while it does, the frame is the same named region that Tab reaches. A frame with nothing to scroll takes no Tab.
- The scroll hint is decoration: hidden from assistive technology, and it takes no press; the table scrolls as it always does.

## Composition

Cells take a value, or an avatar, link, tag, badge, buttons or picture from the system. The foot takes paginations. Sits in a page or a card; do not put a table in a table.

## Usage rules

### Do

- Put the identifying column first.
- Keep cell text to one line; put the rest in the description.
- Give a table longer than the screen the long form and a frame lower than the window, so its headings stay in view.
- Pin the first column of a table wider than its place, on the page canvas.

### Don't

- Sort on the client for more rows than fit in memory.
- Use the row hover as the only sign of interactivity.

## Related

- Pagination: the foot's two types.
- Checkbox: the subtle variant in rows, the default in the header.
- Card: for records that need room.
