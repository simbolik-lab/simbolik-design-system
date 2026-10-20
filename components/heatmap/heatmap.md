---
name: heatmap
title: Heatmap
type: component
block: smbk-heatmap
adaptStrategy: css
figmaNodeId: 7580:375
status: experimental
---

# Heatmap

## Purpose

Shows how much happened on each day over a quarter or a half year, a square for each day shaded from less to more, so a reader sees busy weeks, quiet ones and the rhythm of the week at a glance. It differs from a bar chart, which compares totals a reader can read off.

## Anatomy

- The block, as wide as its weeks.
- The chart part: the weekdays part at the left, naming Monday, Wednesday and Friday in weekday parts, then a week part for each week, Monday at the top. Each week holds a month part, naming the month above the week it starts in, and a cell part for each day. A cell's level is a modifier of the part: level 0 for nothing, then levels 1 to 4 in the sequential data colors from light to strong; a blank cell is a day outside the data.
- The legend part: the summary part at the left, such as "141 days with work", and the scale part at the right, the words less and more around one square of each level.
- The table part: the same values, a week to a row, for screen readers only.

## When to use

- How much a person or a team worked, published or changed, day by day, over 13 or 26 weeks.
- A pattern across the days of the week, such as quiet weekends.

## When not to use

- When the reader needs exact amounts. Use a [bar chart](../bar-chart/bar-chart.md) or a [table](../table/table.md).
- For values that can be below zero or that go both ways. Use a chart with a diverging scale.
- For fewer than about eight weeks. A short table or a bar chart says it better.

## Behavior

The wrapper shades each day by a quarter of the highest value per level, or of a highest value the page gives, so several heatmaps can share one scale. A week runs Monday to Sunday; days before the first value and after the last are left empty. In a narrow layout the heatmap shows its last 13 weeks, naming the months as if they began there; the table keeps every week. The wrapper writes the month and weekday names and the table's values in English unless `locale` names another language (or `format` writes the values), so a page prepared on a server shows the same words once its script runs. Pointing at a day shows the browser's own tooltip, with its date and value; hand-written markup puts the same words in a `title` on the day. Nothing moves and nothing takes focus.

## Accessibility

### What it does for you

- The picture is hidden from screen readers. They read a table instead, titled by the heatmap's label, with a row for each week and a column for each day, holding each day's value.
- The summary is in words under the grid and read in its place.
- The shades are never the only way to read a value: the table holds them all. The lightest shades are faint against the page, which is why the table is always there.
- In high contrast mode the squares keep their shades, so the scale still reads from less to more.
- Nothing in it takes focus.

### What you must do

- Give a label: it titles the table a screen reader reads.
- Give the summary the fact that matters, such as how many days had work.
- In markup written by hand, keep the table and hide the chart part and the scale part.

### How to test

- With a screen reader, the picture is skipped, the table is read by its label with each week and day's value, and the summary is read in words.
- With the colors removed, the table and the summary still hold every value.
- In a forced-color mode, the squares keep their shades and the scale reads from less to more.
- With text at 200% and the page 320 pixels wide, the heatmap shows its last 13 weeks and the legend stays whole.

## Composition

Sits on a card or a page under a title that says what is counted, such as "Changes per day". Holds the chart, its legend and its table.

## Usage rules

### Do

- Say what the values are in the label and the title, with their unit.
- Give a summary that answers the reader's first question.
- Give heatmaps side by side one highest value, so their shades compare.

### Don't

- Use the heatmap's shades for anything but more and less.
- Leave out the label: it titles the table a screen reader reads.

## Related

- [Bar chart](../bar-chart/bar-chart.md): totals to compare and read off.
- [Uptime bar](../uptime-bar/uptime-bar.md): whether something worked each day, not how much happened.
- [Table](../table/table.md): the exact values.
