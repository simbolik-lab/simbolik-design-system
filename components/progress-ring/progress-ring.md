---
name: progress-ring
title: Progress ring
type: component
block: smbk-progress-ring
adaptStrategy: css
figmaNodeId: 7580:184
status: experimental
---

# Progress ring

## Purpose

Shows how far something has got as a ring that fills, with the percentage in the middle: a profile completed, a course taken, the steps of a setup done. It takes less room than a progress bar and sits well beside a name or at the start of a list row.

## Anatomy

- The block, a square as wide as the ring.
- The track part, the ring itself: the empty ring in the subtle track color, and the done part laid over it from the top, clockwise, in the chart color, with round ends.
- The value part, the percentage in the middle in a label style, at the medium size only.

## When to use

- For progress with a known end, beside the name of what is measured.
- In a list or a checklist, a small ring per row.

## When not to use

- For work whose end is not known. Use a [spinner](../spinner/spinner.md) or a [progress bar](../progress/progress.md) with no value.
- For how full something is, such as storage. Use a [meter](../meter/meter.md).
- For a value over time or a share of several parts. Use a chart.

## Behavior

The value is kept inside the range. The done part grows clockwise from the top; at the end the whole ring turns to the success color. When the value changes, the done part grows or shrinks to it, and does not move under reduced motion. Nothing moves as the page loads.

The small ring is thinner and has no value in the middle: name it with words beside it.

## Accessibility

### What it does for you

- The ring is a progress bar to a screen reader, with its value, and is said as progress.
- The percentage in the middle is hidden from screen readers, which hear the value from the ring itself.
- It takes no focus and no keys.
- In high contrast mode the done part is drawn in the highlight color over a ring in the text color.

### What you must do

- Name it: an `aria-label`, or `aria-labelledby` pointing at the words beside it.
- When a percentage is not what it measures, give the value in words with `aria-valuetext`, such as "2 of 4 steps".
- Name the small ring with words beside it, since it has no value in the middle.

### How to test

- With a screen reader, it is read as a progress bar by its name, with its value, or with the words of `aria-valuetext` when given. The percentage in the middle is not read a second time.
- Change the value: the done part grows or shrinks to it, and with reduced motion it does not move.
- With text at 200% and the page 320 pixels wide, the ring and the words beside it stay whole.
- In a forced-color mode, the done part is drawn in the highlight color over a ring in the text color.

## Composition

Holds its ring and its value. Sits beside a name, at the start of a list row or in a card.

## Usage rules

### Do

- Say what the ring measures beside it.
- Use the small ring in rows, the medium one where it stands on its own.

### Don't

- Use a ring for work whose end is not known.
- Put a ring with no words near it where the reader cannot tell what it measures.

## Related

- [Progress bar](../progress/progress.md): the same, as a bar, with failure and unknown states.
- [Meter](../meter/meter.md): how full something is.
- [Spinner](../spinner/spinner.md): work with no known end.
