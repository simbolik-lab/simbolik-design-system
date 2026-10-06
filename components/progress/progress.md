---
name: progress
title: Progress bar
type: component
block: smbk-progress
adaptStrategy: css
figmaNodeId: 4168:13627
status: candidate
---

# Progress bar

## Purpose

Shows how far a known amount of work has got: an upload, a multi-step form, a quota. The fill grows along a thin track; a label above says what is happening and, optionally, the percentage.

## Anatomy

- The block, a column: the header row, then the track.
- The header part holds the label part and the value part, at either end.
- The track part, a thin solid line in the strong border color.
- The fill part, the colored bar laid over it, as wide as the progress; at the default size it is thicker than the line, at the compact size flush with it.

## When to use

- Any wait with a known end: uploads, downloads, steps.
- A quota or a capacity, as a static reading.

## When not to use

- A wait with no known end. That needs an indeterminate indicator, which does not exist yet.
- A skeleton's job: holding a layout while content loads.

## Behavior

The fill's width is data, set by the wrapper from the value. When the value changes, the fill grows or shrinks to it with the state motion, so the change can be followed; under reduced motion it jumps.

## Accessibility

The track carries the progress-bar role with its minimum, maximum and current value; the label is its accessible name. A bar with no visible label takes `aria-label` (or `aria-labelledby`, pointing at words elsewhere on the page), and `aria-valuetext` when the value reads better in words; the component puts all three on the track, where the role is. Assistive technology reads the value from the role, so the visible percentage is a convenience, not the source.

## Composition

Contains a header and a track. Fills the width it is given.

## Usage rules

### Do

- Give every progress bar a label, even when hidden, so the role has a name.
- Use the compact size in dense rows and lists.

### Don't

- Use the warning tone to mean "nearly full" without saying so in the label. Color must not be the only cue (WCAG 1.4.1 Use of Color).

## Related

- Skeleton: loading with no measure.
