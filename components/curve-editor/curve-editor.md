---
name: curve-editor
title: Curve editor
type: component
block: smbk-curve-editor
adaptStrategy: css
figmaNodeId: 7416:192
status: experimental
---

# Curve editor

## Purpose

Shapes a motion curve, the easing of an animation: time runs across and movement up, from the start in the lower left to the end in the upper right. The reader drags its two handles, moves them with the arrow keys, or types the four numbers CSS's `cubic-bezier()` takes. It is for tools that edit a design system's motion. To choose among a few named easings, use a select or a segmented control.

## Anatomy

- The block: a column of the plot over the numbers. It fills its width up to 240 px.
- The plot part: a square on the sunken surface. Its drawing holds the unit square (the square part), the straight line from start to end (the line part, dashed), the two arms from the ends to the handles (the arm part), the curve (the curve part, in the brand color) and, when the curve goes past its end or before its start, a dashed line at how far it goes (the limit part).
- The handle part, two of them: a 12 px dot with a brand ring, inside a 24 px target. Hover fills it with the hover surface; while it is dragged it fills with the brand color; with keyboard focus it shows the focus ring.
- The numbers part: four small number boxes, the first handle's time and movement, then the second's. They can be left out.

## When to use

- To set or adjust the easing of a motion token or an animation.

## When not to use

- To pick one of a few named easings. Offer them by name.
- For anything but a cubic curve: steps and springs are not curves of two handles.

## Behavior

A handle follows the pointer while it is dragged. Its time stays between 0 and 1, as CSS needs; its movement may go past either end, a springy curve that overshoots, as far as the plot's room above and below the square. The editor holds its curve from a first value, or follows the one the page gives it, and reports the four numbers after every move and every settled number. `curveToCss` writes them as CSS.

On a touch screen a press anywhere inside a number box lands on it, not only on its figures.

## Accessibility

### What it does for you

- The editor is a group. Each handle holds two range inputs, its time and its movement, named "First handle, time" and so on, and each says both values ("time 0.2, movement 0"). One of the two is the handle's stop in the Tab order.
- The keys move a handle: Left and Right move the time, Up and Down the movement, by 0.01, or 0.1 with Shift. Page Up and Page Down move the movement by 0.1; Home and End put the time at 0 and 1.
- The four number boxes give the same values to type, each named for its number ("x1, first handle's time"), and step with the up and down arrow keys. Dragging is never the only way.
- The drawing is hidden from screen readers; the inputs and the boxes are the content. In forced colors mode the curve and the handles take the reader's colors.
- On a touch screen a press anywhere inside a number box lands on it, not only on its figures.

### What you must do

- Name the editor for the motion it shapes, such as "Enter easing".
- Keep the number boxes where the reader needs the exact curve, or has nowhere else to read or type it.
- Give every word it says by itself, such as the handles' and the number boxes' names, in the page's language; each keeps its English unless the page gives its own.

### How to test

- Tab to a handle and move it with the arrow keys, with and without Shift, then with Page Up, Page Down, Home and End. The values change and the curve follows.
- Type a number in each box and step it with Up Arrow and Down Arrow.
- With a screen reader, the editor is read as a group by its name, each handle by its name and both values, each box by its number.
- With text at 200% and the page 320 pixels wide, the boxes and the plot stay whole.
- In a forced-color mode, the curve and the handles are visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab or Shift + Tab | Moves focus to the next or previous handle or number box. |
| Left Arrow or Right Arrow | Moves the focused handle's time by 0.01, down or up. With Shift, by 0.1. |
| Up Arrow or Down Arrow | Moves the focused handle's movement by 0.01, up or down. With Shift, by 0.1. In a number box, steps the number. |
| Page Up or Page Down | Moves the focused handle's movement by 0.1, up or down. |
| Home or End | Puts the focused handle's time at 0 or at 1. |

## Composition

The number boxes are the system's number field, small, without its buttons. The editor sits on a page or a panel beside what it sets, such as a motion token's name and duration.

## Usage rules

### Do

- Name the editor for the motion it shapes.
- Keep the numbers where the reader needs the exact curve.

### Don't

- Leave out the numbers where the reader has nowhere else to read or type the curve.

## Related

- [Number field](../number-field/number-field.md): one number to type.
- [Slider](../slider/slider.md): one value along a line.
