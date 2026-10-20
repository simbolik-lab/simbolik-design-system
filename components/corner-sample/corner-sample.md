---
name: corner-sample
title: Corner sample
type: component
block: smbk-corner-sample
adaptStrategy: css
figmaNodeId: 7429:1037
status: experimental
---

# Corner sample

## Purpose

Draws one corner at one radius, a small picture for lists of corner steps or corner roles in a tool that edits a design system's corners. To show what a radius does to a whole card or button, draw the card or button.

## Anatomy

- The block: a 24 px square on the subtle neutral surface whose top and left edges are drawn in the control border color, so it reads in both themes, with its top left corner rounded at the radius given.
- A radius as large as the square or larger, such as a capsule's, draws as the square's own size.

## When to use

- Beside each step of a corner scale or each corner role, with its name and size.

## When not to use

- To show a component's own corners. Show the component.

## Behavior

The radius is given as a number of pixels, a CSS length, or a CSS value such as a radius token's custom property. With none, the corner is square.

## Accessibility

### What it does for you

- The sample is a picture hidden from screen readers.
- In forced colors mode its edges take the reader's text color.

### What you must do

- Put the step's name and size beside the sample in words, which say what it shows. A screen reader reads those and nothing of the sample.

### How to test

- With a screen reader, the sample is skipped and the words beside it are read.
- In a forced-color mode, the sample's edges are visible.

## Composition

A corner sample sits in a row or a list beside its words. It holds nothing.

## Usage rules

### Do

- Put the step's name and size beside the sample.

### Don't

- Show samples alone, which leaves a screen reader with nothing.

## Related

- [Color range](../color-range/color-range.md): the same kind of strip for a color range.
