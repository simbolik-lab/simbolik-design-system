---
name: line-chart
title: Line chart
type: component
block: smbk-line-chart
adaptStrategy: css
figmaNodeId: 7580:757
status: experimental
---

# Line chart

## Purpose

Shows how one amount moved over time, such as spend per day or visits per week, so a reader sees its direction and its peaks at a glance. It can set this period against the last one, or fill the area under the line for an amount that adds up.

## Anatomy

- The block: the legend, the body and the table, one under the other.
- The legend part: a list of legend items, the series swatch for the line and the muted swatch for the period it is compared with.
- The body part, the picture: the y-axis part with a y-label part for each round value, highest first; the plot part beside it; the x-axis part under the plot with an x-label part for each label shown.
- In the plot, the grid part: a gridline part at each round value and the baseline part at zero; the series part, holding everything drawn from the values: the svg part with the area part (the area type), the comparison part (a second series, dashed) and the line part; and, for a marked value, the drop-line part down to the baseline and the marker part holding the point part and the readout part with its label and value. Markup written by hand may leave out the series part.
- The table part: every value in a table, for screen readers; or the data part, the same table in a closed disclosure under the chart.

## When to use

- A value over days, weeks or months, where the shape of the change matters more than each number.
- This period against the last one, such as this week against last week.

## When not to use

- To compare separate amounts, such as days or products side by side. Use a [bar chart](../bar-chart/bar-chart.md).
- For parts of a whole. Use a [donut chart](../donut-chart/donut-chart.md), or a bar chart stacked by kind.
- When one number answers the question. Show the number, with a [sparkline](../sparkline/sparkline.md) beside it if its shape helps.
- For more than two lines. Split them into small charts side by side that share one scale.

## Behavior

The chart fills the width it is given; the plot keeps one height. The value axis runs from zero, or from the lowest value when one is below zero, to a round number above the highest value, in about four round steps; give two charts the same lowest and highest values and their lines compare. Each value sits above its label, the labels spread evenly across the plot, the first and the last kept inside it. With many values, show every seventh label or so: the last label always shows. A marked value gets a dot, a line down to the baseline and its label and value above it. In a narrow layout every second label under the plot is left out, keeping the last. The first time the chart comes into view the lines, the area and the marked value are uncovered together from left to right, while the axes and grid lines stay, and later changes to the data land at once. Under reduced motion, and in markup written by hand, it appears at once. Nothing takes focus. The wrapper writes the values in English unless `locale` names another language or `format` writes them, so a page prepared on a server shows the same numbers once its script runs.

## Accessibility

### What it does for you

- The picture is an image named by the summary. It takes no focus.
- Every value is in a table titled by the chart's label, a row for each label and a column for each series. It is out of sight, for screen readers, unless the page shows it in the disclosure under the chart, which the keyboard reaches.
- The two lines differ by more than color: the period compared with is gray and dashed, and the legend names both in the same order.
- The marked value is drawn, not hovered: it needs no pointer, and its value is in the table too.
- In high contrast mode the plot keeps its colors, so the lines still match the legend.

### What you must do

- Write the summary as the chart's main message, in a sentence: what rose or fell, from what to what.
- In markup written by hand, name the body with `role="img"` and its summary, and keep the table.

### How to test

- With a screen reader, the chart is read as an image with its summary, and the table is reachable with its caption, a row per label and a column per series.
- With the data shown, Tab reaches the disclosure and Enter or Space opens it to the table.
- Check that every value in the picture is also in the table.
- With text at 200% and the page 320 pixels wide, the chart still fits its width and its labels stay readable.
- In a forced-color mode, the lines keep their colors and still match the legend.

### Keyboard

| Key | What it does |
|---|---|
| Tab | When the page shows the values, moves focus to the disclosure under the chart. The chart itself takes no focus. |
| Enter or Space | On the disclosure, opens or closes it. |

## Composition

Sits on a card or a page under a title that says what is counted, such as "Spend per day". Uses the legend item for its legend and, when its data is shown, the accordion and the table.

## Usage rules

### Do

- Say in the label what is counted and over what time, and in the summary what it shows.
- Start the value axis at zero, as it does unless told otherwise.
- Mark the one value the reader should look at, such as today or the highest.

### Don't

- Draw more than two lines in one chart.
- Leave out the legend when there are two lines.
- Put a value only in the picture: the table holds them all.

## Related

- [Bar chart](../bar-chart/bar-chart.md): separate amounts side by side, or stacked by kind.
- [Donut chart](../donut-chart/donut-chart.md): parts of a whole.
- [Sparkline](../sparkline/sparkline.md): a small line beside a figure, with no axes.
- [Legend item](../legend-item/legend-item.md): names each series.
