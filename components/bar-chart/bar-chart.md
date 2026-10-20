---
name: bar-chart
title: Bar chart
type: component
block: smbk-bar-chart
adaptStrategy: css
figmaNodeId: 7580:947
status: experimental
---

# Bar chart

## Purpose

Shows amounts side by side, such as a week of days or a month, so a reader compares them by the height of their bars. Stacked, each bar splits its amount by kind, such as spend by product per day.

## Anatomy

- The block: the legend, the body and the table, one under the other.
- The legend part: a list of legend items, one for the series of plain bars, or one for each kind of stacked bars in the order they stack.
- The body part, the picture: the y-axis part with a y-label part for each round value, highest first; the plot part beside it; the x-axis part under the plot, an x-cell part under each bar holding its x-label part when shown.
- In the plot, the grid part: a gridline part at each round value and the baseline part at zero, and the bars part holding a bar part for each label. A bar holds a segment part for each kind, the first at the foot; a segment's color is a modifier of the part, and the current bar's segment is darker.
- The table part: every value in a table, for screen readers; or the data part, the same table in a closed disclosure under the chart.

## When to use

- Amounts for each day, week or month, where the reader compares one with another.
- The same amounts split into two to eight kinds, where both the total and its parts matter.

## When not to use

- For the shape of a change over a long time. Use a [line chart](../line-chart/line-chart.md).
- For one total split into parts with no time. Use a [donut chart](../donut-chart/donut-chart.md).
- For values below zero. The bars start at zero.
- For more than about forty bars. Group them into weeks or months.

## Behavior

The chart fills the width it is given; the plot keeps one height. The value axis runs from zero to a round number above the tallest bar, in about four round steps; give two charts the same highest value and their bars compare. Bars share the width evenly, and more than 14 bars sit closer together. With many bars, show every seventh label or so: the last label always shows. Plain bars draw the first series; the bar still counting, such as today's, can be drawn a step darker. Stacked bars draw up to eight kinds in the eight series colors, in a fixed order, and gather a ninth and the rest as Other, in gray. In a narrow layout every second label is left out, keeping the last. The first time the chart comes into view the bars grow up from the baseline, one after another, and later changes to the data land at once. Under reduced motion, and in markup written by hand, it appears at once. With a mouse, pointing at a bar fades the other bars, so the one pointed at stands out; a stacked bar fades or stands out as a whole. Pointing at a bar also shows the browser's own tooltip, with its label and value, and for a stacked bar each kind and the total; hand-written markup puts the same words in a `title` on the bar. Nothing takes focus. The wrapper writes the values in English unless `locale` names another language or `format` writes them, so a page prepared on a server shows the same numbers once its script runs.

## Accessibility

### What it does for you

- The picture is an image named by the summary.
- Every value is in a table titled by the chart's label, a row for each bar and a column for each kind, with the total when stacked. The table lists each kind, even those gathered as Other in the picture.
- The table is out of sight, for screen readers, unless the page shows it in the disclosure under the chart, which the keyboard reaches.
- Stacked kinds differ by color, so the legend names them in the order they stack, from the foot up, and the table holds every value. The eight series colors are chosen to stay apart for readers with color blindness.
- The darker current bar is also named by its label, such as Today.
- In high contrast mode the plot keeps its colors, so each kind still matches the legend.
- The picture takes no focus.

### What you must do

- Write the summary as the chart's main message, in a sentence, such as which day cost the most.
- Show the table in the disclosure under the chart when sighted readers also need the exact values.
- In markup written by hand, name the body with `role="img"` and its summary, and keep the table.

### How to test

- With a screen reader, the chart is read as an image named by its summary, and its table is found by the chart's label, with a row for each bar.
- With the keyboard, Tab to the disclosure when the page shows the table, then open and close it.
- In a forced-color mode, each kind in the plot still matches its legend entry.
- With text at 200% and the page 320 pixels wide, the legend wraps and the axis labels stay readable.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the disclosure under the chart, when the page shows the table. The picture itself takes no focus. |
| Enter or Space | Opens the focused disclosure, or closes it when it is open. |

## Composition

Sits on a card or a page under a title that says what is counted, such as "Spend per day". Uses the legend item for its legend and, when its data is shown, the accordion and the table.

## Usage rules

### Do

- Say in the label what is counted and over what time, and in the summary what it shows.
- Keep a stack to a few kinds, the largest first, and name them in the legend.
- Mark the bar still counting, and label it so.

### Don't

- Stack more than eight kinds: the rest become Other.
- Leave out the legend on stacked bars.
- Put a value only in the picture: the table holds them all.

## Related

- [Line chart](../line-chart/line-chart.md): one amount's change over time.
- [Donut chart](../donut-chart/donut-chart.md): parts of a whole.
- [Heatmap](../heatmap/heatmap.md): how much happened on each day over months.
- [Legend item](../legend-item/legend-item.md): names each series.
