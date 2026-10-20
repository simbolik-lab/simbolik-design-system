---
name: board-column
title: Board column
type: component
block: smbk-board-column
adaptStrategy: css
figmaNodeId: 7118:731
status: experimental
---

# Board column

## Purpose

One lane of a board: the work for one project, one person or one stage. Its head says what the lane is and how full it is; under it, its cards are grouped by where each one stands, such as "Waiting on you" and "In progress".

## Anatomy

- The block, a lane pressed into the page: the canvas surface with the strong inset shadow, inside a subtle hairline, with the medium container corners.
- The head part: the heading part on the left, holding the title part in a small heading style and, under it, the meter part, and the action part at the end.
- The meter part holds a capacity meter, or a line of text that sums the lane up.
- The action part holds a small ghost icon button that adds to the lane.
- The group part, one per group: the group head part (the dot part, a status dot; the group label part in a small label style and the subtle text color; the count part, a small soft badge), then the cards part, a list with one card part per item, then the more part, a small ghost button that shows the rest.

## When to use

- Inside a board, one column per lane.
- On its own, for one lane of work in a narrow side panel.

## When not to use

- For a list that is not split into lanes. Use a [list](../list/list.md).
- For content that is not a set of comparable items. Use a [card](../card/card.md) or a section.

## Behavior

On a wide screen a column is the large column width; in a narrow space it fills the width it is given. It is as tall as its cards. Given a height by the page, it scrolls inside itself with the system's thin scrollbar.

A group shows the cards it is given; to keep a long group short, show a few and put a "Show all" button under them.

## Accessibility

### What it does for you

- Each column is a region named by its title, so a screen reader can list the lanes and jump between them.
- The title is a third-level heading by default.
- Each group is a list named by its label and its count, such as "Waiting on you 6", one item per card.
- The group's dot is decoration: the label says what the group is.
- While a column with a height has more to show than fits, it is a stop for the Tab key, so the arrow keys can scroll it, and shows the focus ring inside its edge.

### What you must do

- Give each column a title of its own.
- Set `headingLevel` to fit the page's outline, one below the heading above the board.
- Name the add button for what it adds and where, such as "Add an agent to the blog", and the "Show all" button for what it shows, such as "Show all 6 waiting".

### How to test

- Tab through a column: focus goes through the head, the cards and "Show all" in reading order, with the focus ring showing in both themes and in a forced-color mode.
- Give a column a height it cannot fit in: it takes focus as a stop, and the arrow keys scroll it.
- With a screen reader, each column is found as a region by its title, and each group as a list with its label and count.
- With text at 200% and the page 320 pixels wide, the title and cards wrap and nothing is cut off.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus through the head's buttons, the cards that are links or buttons, and "Show all". A column that scrolls is a stop of its own. |
| Up Arrow or Down Arrow | Scrolls a column that has more to show than fits, while the column has focus. |
| Enter | Follows a focused link, or presses a focused button. |
| Space | Presses a focused button. |

## Composition

Holds a title, an optional capacity meter or line of text, an optional add button, and one or more groups of cards (the card, compact on the raised surface). The count is the badge, the dot the status dot, the buttons the button. Sits in a board.

## Usage rules

### Do

- Give each column a short title of its own.
- Order the groups by what needs the reader first.

### Don't

- Use a bare "Add" on every column.
- Let a group run on for dozens of cards; show a few and offer the rest.

## Related

- [Board](../board/board.md): the columns side by side.
- [Card](../card/card.md): the items in a group.
- [Capacity meter](../capacity-meter/capacity-meter.md): the places taken, in the head.
