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

A gray shape standing in for content that has not arrived yet, so the layout holds still and the person knows where things will appear. Its shape is the shape of what will come, since a skeleton's geometry must match the likely content: one of six shapes for content that is not a component, or, wrapped round a real component, that component's own shape.

## Anatomy

- A shape: one element. The text, title and label shapes are one line of their text, as tall as that text draws (trimmed to its capital height); for a paragraph the element holds a line part per line, one line height apart, and draws nothing itself.
- A wrapper: one element round the component it stands in for, drawing no box of its own. The component inside keeps its size, place and corners and draws the skeleton instead of itself until it has loaded.

## When to use

- While a list, a card or a profile loads, in place of each text line, title, avatar, picture and button it will show.
- Wrapped round any component that waits for its data (an input filled from the server, a badge whose status is still coming, a button that cannot act yet), so the skeleton has that component's exact shape at whatever size it is.

## When not to use

- For a delay shorter than a moment. A flash of skeleton is worse than nothing.
- As a spinner for an action. Use the progress bar.

## Behavior

While it waits, a soft band sweeps across it from the start edge to the end edge, easing in and out, and starts again, so the reader can see the page is still working. The band begins and ends outside the skeleton, so each sweep starts on the plain shape. Skeletons side by side of the same width sweep together. Under reduced motion it does not move: it is the plain shape, which says the same thing.

## Accessibility

Skeletons are hidden from assistive technology. The region that shows them should announce that it is loading, and announce again when the content arrives. A wrapped component is also out of reach while it waits: the keyboard skips it and assistive technology does not see it, so nobody can press a button that cannot act yet. Once loaded it is reachable again, and it never left the page, so it keeps its state and focus can move to it at once.

In plain markup, give the wrapper `inert` and `aria-hidden="true"` while it waits, and remove both once the component has loaded. The React wrapper does this through its `loaded` flag.

## Composition

A shape contains nothing; a wrapper contains the one component it stands in for. Placed where the real content will be, ideally inside the same layout so nothing moves when it arrives. Wrap each component on its own: a wrapper round a row of components draws the whole row as one block.

## Usage rules

### Do

- Match shapes to the content: a title skeleton for a title, an avatar skeleton for an avatar.
- Give a text skeleton the number of lines the text will have, so it is as tall as the paragraph that replaces it.
- Give a skeleton the width its content will have, and a media skeleton the ratio of the picture or video it replaces.

### Don't

- Keep skeletons on screen after an error. Show the error.

## Related

- Progress bar: a known amount of waiting.
