---
name: legend-item
title: Legend item
type: component
block: smbk-legend-item
adaptStrategy: css
figmaNodeId: 7580:15
status: experimental
---

# Legend item

## Purpose

Names one series of a chart: a small swatch in the series' color, its name, and its value if the chart shows one. A chart's legend is a list of legend items, one per series, in the chart's order. The name, not the swatch, says which series is which.

## Anatomy

- The block, a list item as wide as its list.
- The swatch part, a small square in the series' color. Its swatch is one of the eight categorical colors, the series color of a chart with one series, or muted, the gray for everything else.
- The label part, the series' name, filling the line.
- The value part, the series' value, at the end of the line in the subtle color.

## When to use

- Beside or under a chart with two or more series, to name each one.
- With values, as a small table of the chart's parts: a donut's shares, a bar's totals.

## When not to use

- A chart with one series. Its title names it.
- As a control that hides or shows a series. A legend item takes no action.
- Without the series also labelled on the chart where eight or fewer are shown, or a table of the values.

## Behavior

The name wraps when the line is too narrow; the value keeps its place at the end. Nothing moves and nothing takes focus.

## Accessibility

### What it does for you

- The swatch is decoration and hidden from screen readers; they hear the name, then the value.
- Legend items are list items. Nothing takes focus.
- In high contrast mode the swatch keeps its series' color, so it still matches the chart.

### What you must do

- Put legend items in a list, `ul` with `role="list"` where the page removes its bullets, so a screen reader says how many series there are.
- Never tell series apart by color alone. Label the series on the chart too, or give the chart a table of its values.

### How to test

- With a screen reader, the list is announced with its number of items, and each item is read as its name, then its value, with no mention of the swatch.
- With text at 200% and the page 320 pixels wide, a long name wraps and the value keeps its place at the end.
- In a forced-color mode, each swatch still shows its series' color, matching the chart's marks.

## Composition

Sits in a list beside or under a chart, or in a card next to the chart it names. Holds text only.

## Usage rules

### Do

- Give the series in the chart's order, with the colors in their fixed order: 1 to 8.
- Gather everything past the eighth series into one muted item, such as "Others".
- Use the same name in the legend as on the chart and in its table.

### Don't

- Repeat a color for a ninth series.
- Use the feedback colors for series; they mean success, warning and danger.

## Related

- The charts that use it for their legends.
- [Badge](../badge/badge.md) and [tag](../tag/tag.md): a status or a category on its own, not a chart's series.
