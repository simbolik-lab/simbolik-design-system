---
name: ruler
title: Ruler
type: component
block: smbk-ruler
adaptStrategy: css
figmaNodeId: 7417:374
status: experimental
---

# Ruler

## Purpose

Sets and shows the width of a preview: one band from nothing to the widest width, shaded by layout state, with the breakpoints, the common screen widths and a handle for the width now. It is for tools that preview pages or components at different widths. To set a width that has nothing to do with layout, use a slider.

## Anatomy

- The block: a row of the scale, the width now and the buttons. In a narrow space the scale takes the whole row and the rest goes under it.
- The scale part: the band over the widths.
- The band part, 24 px tall on the sunken surface: one zone part per layout state, each after the first shaded and named inside its stretch; a full line (the break part) at each breakpoint; a short tick (the tick part) at each screen width; and the handle part, a brand bar at the width now.
- The widths part: the numbers under the band, each a width part. They can be left out. In a narrow space only the screen widths keep their numbers.
- The now part: the width now, such as "1024 px".
- The controls part: Fit, a toggle that makes the preview fill the space (the fit part), and Hide (the hide part). Each shows only when the page handles it.

## When to use

- Above a preview whose width the reader sets, to show which layout state each width falls in.

## When not to use

- For a value that is not a width in pixels. Use a [slider](../slider/slider.md).

## Behavior

The page gives the layout states, each from the width it starts at, the screen widths to mark and the width at the far end; pass the system's own breakpoints so the states match the pages'. The ruler holds the width from a first value, or follows the one the page gives it, and reports each new width. A press on the band moves the handle there and dragging carries it; a press on a number sets that width. The handle stays between the narrowest screen width, or the least given, and the far end. Places along the band are set with logical properties, so a right-to-left page reads it from the right.

On a touch screen the band, each width and the buttons keep their look and take an invisible press area, out to the comfortable touch target where there is room and halfway to each other where they stand closer.

## Accessibility

### What it does for you

- The handle is a slider named "Preview width". It says its value in pixels with its layout state: "768 pixels, wide".
- The numbers under the band are buttons named in pixels ("320 pixels"); the one at the width now is pressed.
- Fit is a toggle button named "Fit the space"; Hide is named "Hide the ruler".
- The layout state is said in words, not told by shading alone.
- In forced colors mode the band's lines and the handle take the reader's colors.
- Every word it says by itself, such as the names of the widths, Fit and Hide, keeps its English unless the page gives its own.
- Dragging is never the only way: the keys move the handle too.
- On a touch screen the band, each width and the buttons take an invisible press area, out to the comfortable touch target where there is room and halfway to each other where they stand closer.

### What you must do

- Give the names of the widths, Fit and Hide in the page's own language when the page is not in English.
- Give it the system's own breakpoints, so the layout states it says in words match the pages'.

### How to test

- Tab to the handle: the focus ring shows. Press Left Arrow and Right Arrow: the width changes by 10 pixels, by 1 with Shift held; Page Up and Page Down change it by 100, and Home and End go to its ends.
- With a screen reader, the handle is read as a slider named "Preview width", with its value in pixels and its layout state.
- Press a number under the band: the handle moves to that width, and the number is read as pressed.
- With text at 200% and the page 320 pixels wide, the numbers and buttons stay reachable.
- In a forced-color mode, the band's lines and the handle are visible in the reader's colors.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the handle, then to the width buttons, Fit and Hide. |
| Left Arrow or Right Arrow | Moves the handle 10 pixels, or 1 with Shift. On a right-to-left page the directions swap. |
| Up Arrow or Down Arrow | Moves the handle wider or narrower by 10 pixels, or 1 with Shift. |
| Page Up or Page Down | Moves the handle 100 pixels. |
| Home or End | Moves the handle to its narrowest or widest end. |
| Enter or Space | On a width button, Fit or Hide, presses it. |

## Composition

Fit is the system's toggle button and Hide its button, both ghost icon buttons. The ruler sits above the preview it measures, as wide as the space the preview can take.

## Usage rules

### Do

- Give it the system's own breakpoints.
- Put it directly above the preview it sets.

### Don't

- Make up breakpoints of its own, which shows states no page has.

## Related

- [Slider](../slider/slider.md): any value along a line.
- [Segmented control](../segmented-control/segmented-control.md): a few widths to choose from by name.
