---
name: board
title: Board
type: component
block: smbk-board
adaptStrategy: css
figmaNodeId: 7118:1603
status: experimental
---

# Board

## Purpose

Shows work in lanes: one column per project, person or stage, each with its cards. On a wide screen the lanes sit side by side, so the reader can compare them; on a phone they stack, one under another.

## Anatomy

- The block, a frame that scrolls sideways when its columns run past it.
- The columns part, the row of board columns, the large inline gap apart.
- The scroll hint part, a thin bar along the frame's foot that shows there is more sideways and how much is in view. It shows where the browser's own scrollbar takes no room, such as on a phone or a trackpad, and wherever the system's scrollbar is drawn over the frame; it fades while that bar shows, in the same strip.

## When to use

- For a few lanes of comparable work that a reader scans side by side.
- For a dashboard of projects, each with its items grouped by where they stand.

## When not to use

- For one lane. Use a [board column](../board-column/board-column.md) alone.
- For many items with many details each. Use a [table](../table/table.md).

## Behavior

On a wide screen the columns sit side by side at the large column width. When they need more room than the frame has, the frame scrolls sideways inside itself, so the page never does. In a narrow space the columns stack at full width, the large stack gap apart, and nothing scrolls sideways. Put `data-layout="narrow"` or `"wide"` on an element around the board to choose either form.

Moving cards between columns by dragging is not part of the board.

## Accessibility

### What it does for you

- While the columns run past the frame, the frame is a region named by the board's label and a stop for the Tab key, so the arrow keys can scroll it sideways. It shows the focus ring inside its edge. When everything fits, it is neither.
- The columns are read in the order they come in the page, left to right on a wide screen and top to bottom on a phone.
- Each column is a region of its own, named by its title.

### What you must do

- Give the board an `aria-label` that says what it shows, such as "Agents by project".

### How to test

- On a wide screen with columns past the frame, Tab to the frame: the focus ring shows inside its edge, and the arrow keys scroll it sideways.
- With a screen reader, the frame and each column are found as regions by their names, and the columns are read in page order.
- With text at 200% and the page 320 pixels wide, the columns stack and nothing scrolls sideways.
- In a forced-color mode, the focus ring on the frame stays visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the frame while the columns run past it, then into the columns. |
| Left Arrow or Right Arrow | Scrolls the frame sideways while it has focus. |

## Composition

Holds board columns only. Sits in a page's main content, usually under a page header.

## Usage rules

### Do

- Keep to a few columns, each named.
- Put the column that needs the reader first, first.

### Don't

- Hide columns on a phone; they stack instead.
- Nest a board in a board column.

## Related

- [Board column](../board-column/board-column.md): one lane.
- [Card](../card/card.md): one item, compact on the raised surface, its title the link the whole card follows.
- [Table](../table/table.md): many items with many details.
