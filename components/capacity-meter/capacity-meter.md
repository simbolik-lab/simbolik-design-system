---
name: capacity-meter
title: Capacity meter
type: component
block: smbk-capacity-meter
adaptStrategy: css
figmaNodeId: 7118:653
status: experimental
---

# Capacity meter

## Purpose

Shows how many of a few places are taken: how many agents are working on a project out of the two it allows, how many seats on a plan are in use. A row of short bars, one per place, as many filled as are taken, then the same in words, such as "1 of 2 places".

## Anatomy

- The block: the bars, then the words, side by side.
- The segments part, the row of bars.
- The segment part, one bar per place: the track color while free, the inverse surface once taken.
- The words part, the count in a small body style and the subtle text color: "1 of 2 places", or words of your own.

## When to use

- For a small, fixed number of places, two to four, where a reader wants to see at a glance whether there is room.
- In the head of a board column, under its title.

## When not to use

- For a large number, or a share of a total such as storage. Use a [meter](../meter/meter.md).
- For how far along a task is. Use a [progress bar](../progress/progress.md).
- For a count with no limit. Use a [badge](../badge/badge.md) or plain text.

## Behavior

The number of places is never below one, and the places taken are kept between none and all of them. The words are built from the two numbers and the word for what is counted, places by default; words of your own replace them.

## Accessibility

### What it does for you

- The whole is one meter. A screen reader hears its name and the words as its value, such as "Agents on the blog, meter, 1 of 2 places".
- The words say what the bars show, so the color of the bars is never the only sign.
- In high-contrast mode each bar is outlined and the taken ones are filled with the text color.

### What you must do

- Give it a name: `aria-label`, or `aria-labelledby` pointing at the heading it sits under.
- Make words of your own say the count, since they are also the value a screen reader hears.

### How to test

- With a screen reader, the meter is read by its name and its words as the value, such as "1 of 2 places".
- Tab past it: the meter takes no focus.
- In a forced-color mode, the bars are outlined and the taken ones filled.
- With text at 200% and the page 320 pixels wide, the words wrap and stay whole.

## Composition

Holds only its bars and words. Sits under a title, in a column's head or in a row of details.

## Usage rules

### Do

- Name it for what it counts and where.
- Keep it to two, three or four places.

### Don't

- Use it for more places than can be counted at a glance.
- Write words that leave out the count.

## Related

- [Meter](../meter/meter.md): how full something is, as one bar.
- [Board column](../board-column/board-column.md): the column head that holds it.
