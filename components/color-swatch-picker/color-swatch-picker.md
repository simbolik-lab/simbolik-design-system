---
name: color-swatch-picker
title: Color swatch picker
type: component
block: smbk-color-swatch-picker
adaptStrategy: css
figmaNodeId: 7408:540
status: experimental
---

# Color swatch picker

## Purpose

A set of colors to pick one from, such as a brand's colors, saved colors or colors to try, in rows that wrap. It is the fastest way to choose among a few set colors; for any color, use the color picker, which holds one at its foot.

## Anatomy

- The block, the list, in rows that wrap with the extra small step between items both ways.
- The item part, one per color: a color swatch inside the extra small inset, a 24 px swatch in a 32 px item, or a 16 px swatch in a 24 px item at the small size. The chosen item has a ring inside its edge with a gap round the swatch; the item with keyboard focus draws the ring in the focus color. Hover lays the hover surface behind the swatch, and a color that cannot be picked is dimmed.

## When to use

- To choose among a set of colors: a brand's palette, label colors, chart colors, saved colors.

## When not to use

- For any color at all. Use the [color picker](../color-picker/color-picker.md).
- To show colors that cannot be chosen. Use [color swatches](../color-swatch/color-swatch.md).

## Behavior

A press on a color picks it. The picker holds its own choice from a first color, or follows the one the page gives it, and reports each color picked. A color matches the choice when its code and opacity are the same.

On a touch screen every color keeps its size and takes an invisible press area round it, reaching halfway into the gap between the colors, so each stays one press.

## Accessibility

### What it does for you

- It is a listbox, one stop in the Tab order: Tab reaches the chosen color, or the first.
- Each color is an option named in words, such as “vibrant red”, or by the name given; the chosen one is selected.
- The chosen color is shown by a ring and a gap, a shape, not by color alone.
- A color that cannot be picked is passed over by the arrow keys.
- In forced colors mode the rings become outlines in the reader's colors.
- On a touch screen every color keeps its size and takes an invisible press area round it, so each stays one press.

### What you must do

- Name the list for what the colors are for, such as “Brand color”.
- Give the colors their own names when they have them; otherwise each is read by a name made from its value.

### How to test

- Tab once: focus lands on the chosen color, or the first, and the next Tab leaves the list.
- With the arrow keys, Home and End, move through the colors, then press Space or Enter to pick one. A color that cannot be picked is skipped.
- With a screen reader, the list is read by its name, each color by its name, and the chosen one as selected.
- With text at 200% and the page 320 pixels wide, the colors wrap and each stays whole.
- In a forced-color mode, the chosen color and the one with focus each show an outline.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the list, on the chosen color or the first. Tab again leaves it. |
| Left Arrow or Right Arrow | Moves to the previous or next color that can be picked. |
| Up Arrow or Down Arrow | Moves to the color above or below in the wrapped rows. |
| Home or End | Moves to the first or last color that can be picked. |
| Space or Enter | Picks the color with focus. |

## Composition

Each item holds a color swatch, hidden from screen readers since the item carries its name. The color picker's panel holds a small square swatch picker under a divider.

## Usage rules

### Do

- Name the list for what the color is for.
- Give the colors their own names when they have them.

### Don't

- Offer colors so alike that the ring is the only way to tell which is which.

## Related

- [Color swatch](../color-swatch/color-swatch.md): one color, shown.
- [Color picker](../color-picker/color-picker.md): any color, with saved colors at its foot.
