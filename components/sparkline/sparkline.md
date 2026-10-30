---
name: sparkline
title: Sparkline
type: component
block: smbk-sparkline
adaptStrategy: css
figmaNodeId: 7580:152
status: experimental
---

# Sparkline

## Purpose

Shows at a glance how a figure has moved: rising, falling, steady or spiky. It is the smallest chart, a line with no axes, drawn beside the figure it belongs to, which carries the meaning. It differs from a line chart, which has axes, a legend and values a reader can read off.

## Anatomy

- The block, as wide as the space it is given and as tall as a small control.
- The plot part, as big as the block, holding the svg and dot parts.
- The svg part, holding the area part, a soft fill of the line's color down to the foot, shown with the area flag, and the line part, through the values from the oldest at the left to the newest at the right.
- The dot part, on the last value, which stays round however wide the sparkline is.

## When to use

- Beside a figure on a card or in a table row, to show its trend over the last days or weeks.
- Several figures side by side, each with its own sparkline on one shared scale.

## When not to use

- When the reader needs to read values off the line, compare series or see dates. Use a [line chart](../line-chart/line-chart.md).
- When the figure has no history worth showing. Leave it out rather than draw a flat line.
- As the only place a trend is told. Say it in words too, such as "up 12% on last week".

## Behavior

The wrapper draws the line from the values it is given, as a smooth curve that never swings past a value, scaled from the lowest to the highest value unless a shared scale is given. Values that are all the same draw a level line halfway up. The line keeps its width and the dot stays round as the sparkline stretches. The first time it comes into view the line is uncovered from left to right, and later changes to the values land at once. Under reduced motion, and in markup written by hand, it appears at once. Nothing takes focus.

## Accessibility
### What it does for you

- The figure beside it carries the meaning, so the sparkline is hidden from screen readers unless it is given a summary, such as "Visits rising over 30 days", which it then carries as an image's name.
- Nothing about it takes focus.
- In high contrast mode the line and the dot take the text color and the area is left out.

### What you must do

- Say the trend in words beside the figure, so a reader who cannot see the line still has it.

### How to test

- With a screen reader, a sparkline with no summary is skipped, and one with a summary is read as an image by those words.
- Tab through the page: focus never lands on the sparkline.
- In a forced-color mode, the line and the dot show in the text color.

## Composition

Sits beside a figure: in a card's figure area, in a table cell, in a list row. Holds nothing.

## Usage rules

### Do

- Put the figure first and the sparkline beside or under it.
- Give sparklines side by side one shared scale, so their slopes compare.
- Keep the area for a single sparkline that stands on its own; side by side, the lines alone read cleaner.

### Don't

- Leave the sparkline to tell the trend alone.
- Draw a sparkline from two or three values; a figure and its change in words say it better.

## Related

- [Line chart](../line-chart/line-chart.md): a trend with axes and values to read.
- [Card](../card/card.md): a figure with its sparkline under a title.
