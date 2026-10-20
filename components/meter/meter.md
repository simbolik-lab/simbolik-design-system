---
name: meter
title: Meter
type: component
block: smbk-meter
adaptStrategy: css
figmaNodeId: 7580:43
status: experimental
---

# Meter

## Purpose

Shows how full something is inside a known range: the storage used, the share of a monthly allowance spent, the seats taken. It answers "how much", not "how far along": for work that is getting done, use the progress bar.

## Anatomy

- The block, which also carries the progress bar's block class, as wide as its space.
- The header, an optional row with the label at the start and the value at the end, the progress bar's.
- The track, a short bar with round ends in the subtle track color, pressed in.
- The fill, laid over the track from the start edge as far as the value, in the tone's color.

The meter is built on the progress bar: its parts carry the progress bar's part classes, so the label row, the track and its round ends are the same, and only the meter's taller track and its tones are its own.

## When to use

- For a level inside a range that does not change while the reader watches: storage, quota, a budget.
- Several meters in a list, to compare levels with the same range.

## When not to use

- For the progress of an upload, an install or any task. Use the [progress bar](../progress/progress.md).
- For a value with no known end. Write the number.
- For a value over time. Use a chart.

## Behavior

The value is kept inside the range. The fill's length is the value's share of the range. The tone is chosen by the page: the chart color for a plain level, success, warning or danger for one that stands well or badly. The meter does not change its tone by itself.

The meter does not move on its own and takes no focus.

## Accessibility

### What it does for you

- The track is a meter to a screen reader, with its least and greatest values and the value now. A screen reader says it as a meter with the value.
- It takes no focus and no keys, and it does not move on its own.
- In high contrast mode the track is outlined and the fill drawn in the highlight color, as the progress bar's.

### What you must do

- Name it: its label, or an `aria-label`, or `aria-labelledby` pointing at words that name it.
- When a percentage is not what it measures, give the value in words with `aria-valuetext`, such as "62 of 100 GB". With the value shown, those words are what the row shows.
- Never let the tone be the only sign: say how the level stands in the label or the value, such as "almost full".

### How to test

- With a screen reader, it is read as a meter by its name, with its value, or with the words of `aria-valuetext` when given.
- Check that the level can be told without color: the label or the value says how it stands.
- With text at 200% and the page 320 pixels wide, the label row stays whole and the track fits its width.
- In a forced-color mode, the track is outlined and the fill is drawn in the highlight color.

## Composition

Holds its label row and its track. Sits in a card, a list row, a settings page or beside a figure.

## Usage rules

### Do

- Name what is measured in the label: "Storage", "Seats".
- Give the value in its own unit when the percentage hides it.

### Don't

- Use a meter to show a task getting done.
- Use the danger tone for a level that is not a problem.

## Related

- [Progress bar](../progress/progress.md): how far along a task is.
- [Progress ring](../progress-ring/progress-ring.md): how far along, as a ring.
- [Stat](../stat/stat.md): a single figure with its name.
