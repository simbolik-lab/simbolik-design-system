---
name: skeleton
title: Skeleton
type: component
block: smbk-skeleton
adaptStrategy: css
figmaNodeId: 915:9
status: experimental
---

# Skeleton

## Purpose

A gray shape standing in for content that has not arrived yet, so the layout holds still and the person knows where things will appear. Its shape is the shape of what will come, since a skeleton's geometry must match the likely content: one of thirteen shapes for content that is not a component, each in a small, medium or large size, or, wrapped round a real component, that component's own shape.

## Anatomy

- A shape: one element. The text, title and label shapes are one line of their text: a bar as tall as its capitals, in the middle of one line height. Given more than one line, and always for the paragraph shape, the element holds a line part per line, one line height apart, and draws nothing itself; a paragraph's last line is shorter.
- The icon, avatar, badge, button and input shapes are solid blocks at those components' sizes, and the media shape a block at the proportion of the picture it replaces, 16:9 by default.
- A block: the list item, the card and the table row, one element holding other shapes. The list item is an avatar beside a label line over a smaller text line, in a text part. The card is a framed block with a 16:9 media shape, a title line and two text lines. The table row is a row at the control height with a rule along its foot, a small square for the selection box and a label line per column.
- A wrapper: one element round the component it stands in for, drawing no box of its own. The component inside keeps its size, place and corners and draws the skeleton instead of itself until it has loaded.

## When to use

- While a list, a card or a profile loads, in place of each text line, title, avatar, picture and button it will show.
- The list item, card and table row shapes for a whole row or card at once, on a page with no component to wrap.
- The size that matches the content: small, medium or large text, and the small, medium or large control.
- Wrapped round any component that waits for its data (an input filled from the server, a badge whose status is still coming, a button that cannot act yet), so the skeleton has that component's exact shape at whatever size it is.

## When not to use

- For a delay shorter than a moment. A flash of skeleton is worse than nothing.
- As a spinner for an action. Use the [progress bar](../progress/progress.md).

## Behavior

As it appears, a soft band sweeps across it from the start edge to the end edge, easing in and out, three times, so the reader can see the page is working; then it rests as the plain shape, since nothing may move on its own for more than five seconds beside other content. The band begins and ends outside the skeleton, so each sweep starts on the plain shape. Skeletons side by side of the same width sweep together. Under reduced motion it does not move: it is the plain shape, which says the same thing. A wait long enough to outlast the sweep is better shown with a progress bar.

## Accessibility
### What it does for you

- Skeletons are hidden from assistive technology.
- A wrapped component is also out of reach while it waits: the keyboard skips it and assistive technology does not see it, so nobody can press a button that cannot act yet.
- Once loaded, a wrapped component is reachable again. It never left the page, so it keeps its state and focus can move to it at once.
- The React wrapper gives the wrapper `inert` and `aria-hidden="true"` through its `loaded` flag, and removes both once the component has loaded.

### What you must do

- Make the region that shows skeletons announce that it is loading, and announce again when the content arrives.
- In plain markup, give the wrapper `inert` and `aria-hidden="true"` while it waits, and remove both once the component has loaded.

### How to test

- Tab through the page while a wrapped component waits: focus skips it. Once it has loaded, Tab reaches it.
- With a screen reader, the skeletons are not read, the region says it is loading, and says so again when the content arrives.
- With reduced motion on, the skeleton does not move.

## Composition

A shape contains nothing; a wrapper contains the one component it stands in for. Placed where the real content will be, ideally inside the same layout so nothing moves when it arrives. Wrap each component on its own: a wrapper round a row of components draws the whole row as one block.

## Usage rules

### Do

- Match shapes to the content: a title skeleton for a title, an avatar skeleton for an avatar.
- Wrap the real component when there is one: its own shape fits better than any block.
- Give a text skeleton the number of lines the text will have, so it is as tall as the paragraph that replaces it.
- Give a skeleton the width its content will have, and a media skeleton the ratio of the picture or video it replaces.

### Don't

- Keep skeletons on screen after an error. Show the error.

## Related

- [Progress bar](../progress/progress.md): a known amount of waiting.
