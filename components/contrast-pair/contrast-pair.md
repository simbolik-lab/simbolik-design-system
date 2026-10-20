---
name: contrast-pair
title: Contrast pair
type: component
block: smbk-contrast-pair
adaptStrategy: css
figmaNodeId: 7416:115
status: experimental
---

# Contrast pair

## Purpose

Shows one text color on one background as they really look, with their contrast ratio and the mark it earns: AAA, AA, AA large or fails. It is for tools and pages that check a color system against the contrast rules. To show a range of colors with their contrast against white, use the color range.

## Anatomy

- The block: a row on the default surface inside a subtle edge.
- The sample part: a 48 px square in the background color with "Aa" in the text color, drawn with the two colors given.
- The text part, a column: the result part (the ratio part in Label MD, then a small soft badge, the badge part, that says the mark in words) over the names part, the two roles in Body XS, such as "Text subtle on surface default".
- The result axis: AAA at 7:1 and up and AA at 4.5:1 take the success badge, AA large at 3:1 the warning badge, and fails the danger badge.

## When to use

- To show whether a text color can be read on a background, in a theme builder, a token editor or a color system's documentation.
- Side by side in a grid, one per pair a system uses.

## When not to use

- To show a whole range of colors. Use the [color range](../color-range/color-range.md).
- For a color that is not text or a control's edge: the marks are the rules for text and for what identifies a control.

## Behavior

The ratio is worked out from the two colors as WCAG 2.2 counts it, a see-through color laid over what is under it, and written with two decimals, never rounded up past what it is. The mark follows from the ratio. A page that has measured the pair itself can give the ratio, or the mark, and the pair shows them as given.

The sample keeps its two colors whatever the page's theme: a pair is drawn as it is.

## Accessibility

### What it does for you

- The sample is hidden from screen readers. They read the ratio in words ("Contrast 5.03 to 1"), the mark and the two roles.
- The mark is a word in the badge, not a color alone.
- In forced colors mode the sample keeps its two colors, since they are what it shows, and the edges take the reader's text color.

### What you must do

- Name the two roles, so a reader who cannot see the sample still knows which pair the mark belongs to.
- Give every word it says by itself, such as the badge's words and the ratio read aloud, in the page's language; each keeps its English unless the page gives its own.

### How to test

- With a screen reader, the pair is read as the ratio, the mark and the two roles, and the sample is not read.
- The mark shows as a word in the badge, so it reads without color.
- In a forced-color mode, the sample still shows its two colors.
- With text at 200% and the page 320 pixels wide, the pair fills the width it is given and its words stay whole.

## Composition

The badge is the system's badge component, soft and small. Contrast pairs sit side by side in a grid that gives each its width; the pair fills the width it is given.

## Usage rules

### Do

- Name the two roles, so the reader knows which pair the mark belongs to.
- Let the pair work out its ratio and mark from its colors.

### Don't

- Give a mark the two colors do not earn.

## Related

- [Color range](../color-range/color-range.md): a range's steps with their contrast against white.
- [Badge](../badge/badge.md): the mark on its own.
