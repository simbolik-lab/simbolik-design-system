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

Shows how far an amount of work has got: an upload, a multi-step form, a quota. The fill grows along a thin track; a label above says what is happening and, optionally, the percentage. It can also say that the work failed, or that it is going on with no known end.

## Anatomy

- The block, a column: the header row, then the track.
- The header part holds the label part and the value part, at either end. When the work failed, the label leads with the icon part, a crossed circle, and the retry part, a "Try again" button underlined like a link, takes the value's place.
- The track part, a thin bar in the subtle track color, pressed into the surface, slimmer at the small size.
- The fill part, the colored bar laid over it from the start, as wide as the progress and as tall as the track. When the end is not known, it is a detached part from three tenths of the track to seven.
- In the pixel type, the track and the fill are cut into twenty square segments, and the fill shows in whole ones.

## When to use

- Any wait with a known end: uploads, downloads, steps.
- A quota or a capacity, as a static reading.
- A wait whose end is not known, with the unknown state, when the work takes long enough to need a word about it.

## When not to use

- A [skeleton](../skeleton/skeleton.md)'s job: holding a layout while content loads.

## Behavior

The fill's width is data, set by the wrapper from the value. When the value changes, the fill grows or shrinks to it with the state motion, so the change can be followed; under reduced motion it jumps. The pixel type rounds the value to whole segments, each a twentieth. With `showValue` the label row shows the percentage, or the value in words when `aria-valuetext` gives them, as the meter does.

Leave the value out and the bar takes the unknown state: it shows no number, and its detached fill stays still. A failed bar keeps its fill where the work stopped, in the danger color whatever its tone, and its "Try again" calls `onRetry`; without one it offers no retry.

## Accessibility

### What it does for you

- The track carries the progress-bar role with its minimum, maximum and current value; the label is its accessible name. The component puts the role, the name and `aria-valuetext` on the track.
- Assistive technology reads the value from the role, so the visible percentage is a convenience, not the source. A value above the maximum is read as the maximum.
- An unknown bar has no current value, which tells assistive technology its end is not known.
- A failed bar says so in words, its label, not by its color alone. Its retry is a real button, at least 24 pixels square to press.
- In development the wrapper warns in the console when a bar has no name.
- In high contrast mode the empty track is outlined and the done part filled with the highlight color.

### What you must do

- Give a bar with no visible label an `aria-label`, or `aria-labelledby` pointing at words elsewhere on the page.
- Give `aria-valuetext` when the value reads better in words.
- Write a failed label that names what failed, such as "Upload failed".
- Say in the label how a bar stands when its tone means something, such as "nearly full". Color must not be the only cue (WCAG 1.4.1 Use of Color).

### How to test

- With a screen reader, it is read as a progress bar by its name, with its value. An unknown bar is read with no value.
- With a failed bar, the label says what failed, and Tab reaches "Try again", which Enter or Space presses.
- With text at 200% and the page 320 pixels wide, the label row stays whole and the bar fits its width.
- In a forced-color mode, the empty track is outlined and the done part is drawn in the highlight color.

### Keyboard

| Key | What it does |
|---|---|
| Tab | On a failed bar, moves focus to "Try again". The bar itself takes no focus. |
| Enter or Space | On "Try again", presses it. |

## Composition

Contains a header and a track. Fills the width it is given.

## Usage rules

### Do

- Give every progress bar a label, even when hidden, so the role has a name.
- Use the small size in dense rows and lists.
- Write a failed label that names what failed, such as "Upload failed".

### Don't

- Use the warning tone to mean "nearly full" without saying so in the label. Color must not be the only cue (WCAG 1.4.1 Use of Color).

## Related

- [Skeleton](../skeleton/skeleton.md): loading with no measure.
