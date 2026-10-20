---
name: diff-stat
title: Diff stat
type: component
block: smbk-diff-stat
adaptStrategy: css
figmaNodeId: 7580:1825
status: experimental
---

# Diff stat

## Purpose

Shows how much a change touched: the lines it added and the lines it removed, such as "+128 −12", then a row of five small squares that shows the balance at a glance, green for added and red for removed. It sits beside a change's title in a list of changes, a review or an agent's report of what it did.

## Anatomy

- The block: the two counts and the squares, side by side on one line.
- The added part, the lines added with a plus sign, in the success text color.
- The removed part, the lines removed with a minus sign, in the danger text color.
- The blocks part, five small squares; each block part is green for added, red for removed or the empty track color.
- The hidden part, the sentence a screen reader hears.

Both counts use the small code style with figures of one width, so counts line up down a list.

## When to use

- Beside a change, a commit or a file in a list of changes, where a reader wants to see its size before opening it.
- In a summary of what an agent or a person changed.

## When not to use

- For other counts that go up and down, such as visitors or sales. Use a [stat](../stat/stat.md) with its trend.
- For a share of a total. Use a [meter](../meter/meter.md).

## Behavior

The squares split five between the two counts by their share of the lines, rounded. A side with any lines at all keeps at least one square, so a small removal still shows; a change with no lines leaves all five empty. Counts are written with a comma between thousands.

## Accessibility

### What it does for you

- A screen reader hears one sentence, such as "128 lines added, 12 lines removed". The signs, the counts as drawn and the squares are hidden from it, so it does not read "plus 128 minus 12".
- The signs and the numbers carry the meaning; the colors and the squares only repeat it.
- In high-contrast mode every square is outlined and the ones with lines are filled with the text color.

### What you must do

- Give `label` your own sentence when the page is in another language or counts something other than lines.

### How to test

- With a screen reader, it is read as one sentence with both counts.
- With the colors removed, the signs and the numbers still say what was added and removed.
- In a forced-color mode, every square is outlined and the ones with lines are filled.
- With text at 200% and the page 320 pixels wide, the counts and squares stay whole.

## Composition

Holds only its counts and squares. Sits after a title, in a list row's end or in a line of details.

## Usage rules

### Do

- Keep it beside the change it describes.
- Give it the real counts; the squares follow from them.

### Don't

- Use it for anything but lines added and removed.
- Draw the squares without the counts.

## Related

- [Stat](../stat/stat.md): one figure with its name.
- [Meter](../meter/meter.md): how full something is.
