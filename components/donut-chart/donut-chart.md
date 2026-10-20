---
name: donut-chart
title: Donut chart
type: component
block: smbk-donut-chart
adaptStrategy: css
figmaNodeId: 7580:1283
status: experimental
---

# Donut chart

## Purpose

Shows how a whole splits into two to eight parts, such as a week's spend by product, with the total in the middle and each part's value beside the ring.

## Anatomy

- The block: the ring and the legend side by side, the table after them.
- The ring part, the picture: the svg part with a part for each part of the whole, clockwise from the top, its color a modifier of the part; the center part holding the figure part, the total unless given, and the caption part under it.
- The legend part: a list of legend items, each part's name and value, in the order the ring runs.
- The table part: each part's value and share in a table, for screen readers; or the data part, the same table in a closed disclosure under the chart.

## When to use

- A total and the two to eight parts it is made of, where the reader wants the parts' sizes against the whole.

## When not to use

- For parts that must be compared exactly, or that are close in size. Use a [bar chart](../bar-chart/bar-chart.md), or the numbers.
- For change over time. Use a [line chart](../line-chart/line-chart.md) or a bar chart.
- For more than eight parts. Gather the smallest, or use a bar chart.
- When one number answers the question. Show the number.

## Behavior

The ring keeps one size; the legend takes the room beside it. The parts run clockwise from the top in the eight series colors, in a fixed order, a small gap between each. A ninth part and the rest are gathered as Other, in gray. The middle shows the total unless the page gives another figure, with an optional caption such as the period. In a narrow layout the legend goes under the ring. The first time the chart comes into view the ring sweeps round from the top, while the middle and the legend stay, and later changes to the data land at once. Under reduced motion, and in markup written by hand, it appears at once. With a mouse, pointing at a part of the ring fades the other parts, so the one pointed at stands out. Pointing at a part also shows the browser's own tooltip, with its name, value and share; hand-written markup puts the same words in a `title` element inside the part's path. Nothing takes focus. The wrapper writes the values and shares in English unless `locale` names another language or `format` writes the values, so a page prepared on a server shows the same numbers once its script runs.

## Accessibility

### What it does for you

- The ring is an image named by the summary.
- The legend is a list a screen reader reads, each part with its value.
- Every part is in a table titled by the chart's label, with its value and its share of the whole. The table lists each part, even those gathered as Other in the picture. It is out of sight, for screen readers, unless the page shows it in the disclosure under the chart, which the keyboard reaches.
- The parts differ by color, so the legend names them in the order the ring runs, with their values; the eight series colors are chosen to stay apart for readers with color blindness, the first and the last too, which meet at the top.
- In high contrast mode the ring keeps its colors, so each part still matches the legend.
- Nothing in the ring takes focus; the legend and the table name every part and value.

### What you must do

- Write the summary as the chart's main message: the total and the largest part, with its share.
- In markup written by hand, name the ring with `role="img"` and its summary, and keep the legend and the table.

### How to test

- With a screen reader, the ring is read as an image by its summary, then the legend as a list with each part and its value.
- Show the data: Tab to the disclosure under the chart and open it with the keyboard. The table gives each part with its value and share.
- With the colors removed, the legend still names every part and its value.
- With text at 200% and the page 320 pixels wide, the legend goes under the ring and stays whole.
- In a forced-color mode, each part of the ring still matches the legend.

### Keyboard

| Key | What it does |
|---|---|
| Tab | When the page shows the data, moves focus to the disclosure under the chart. |
| Enter or Space | Opens or closes the disclosure that shows the table. |

## Composition

Sits on a card under a title that says what is split, such as "Spend by product". Uses the legend item for its legend and, when its data is shown, the accordion and the table.

## Usage rules

### Do

- Keep to a few parts, eight at most, and give each its value in the legend.
- Put the period or the unit under the total, such as "7 days".
- Say the largest part and its share in the summary.

### Don't

- Leave out the legend: color alone cannot name the parts.
- Use a donut for parts that are nearly the same size.
- Put a value only in the picture: the legend and the table hold them.

## Related

- [Bar chart](../bar-chart/bar-chart.md): parts of a total for each day or month, stacked.
- [Legend item](../legend-item/legend-item.md): names each part.
- [Line chart](../line-chart/line-chart.md): change over time.
