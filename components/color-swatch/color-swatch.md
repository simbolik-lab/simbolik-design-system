---
name: color-swatch
title: Color swatch
type: component
block: smbk-color-swatch
adaptStrategy: css
figmaNodeId: 7406:48
status: experimental
---

# Color swatch

## Purpose

Shows one color as a small square or dot: a saved color, a color in a list of settings, the color a field holds. A see-through color shows a checkerboard behind it, so its opacity can be seen, and no color at all shows as a crossed-out square. The swatch only shows a color; to choose one, use the color swatch picker or the color picker.

## Anatomy

- The block, a square or a dot with a hairline edge drawn inside it, over everything else.
- The checkerboard, the color checker's block (`smbk-color-checker`): an empty element first inside the swatch, drawn under the color.
- The color part, which the page paints with the color as an inline background color.
- The slash part, drawn instead of the checkerboard and the color when no color is set: a line from corner to corner in the danger icon color.

## When to use

- To show a color beside its name or its code, in a list of colors or a row of settings.
- Inside the color field, the color picker and the swatch picker, which hold one.

## When not to use

- To let the reader pick a color. Use the [color swatch picker](../color-swatch-picker/color-swatch-picker.md) for a few set colors, or the [color picker](../color-picker/color-picker.md) for any color.
- For a status or a category. Use the [status dot](../status-dot/status-dot.md), the [badge](../badge/badge.md) or the [legend item](../legend-item/legend-item.md), which carry their meaning in words too.

## Behavior

The swatch holds no state. Given no color, it shows the none look.

In plain markup, put an empty `smbk-color-checker` element first inside the swatch and the color part after it, with the color as its inline background color; for none, give the block `smbk-color-swatch--none` and the slash part alone.

## Accessibility

### What it does for you

- A swatch is an image that a screen reader names by its color in words, such as “vibrant blue”, made from its value. With no color, it is named “No color”.
- No color is shown by a slash, a shape, not by a color alone.
- In forced colors mode the swatch keeps its color, since the color is what it shows, and its edge and slash take the reader's text color.

### What you must do

- Give the swatch the color's own name when it has one, such as “Signal blue”.
- Beside words that already name the color, such as a code in a field, hide the swatch from screen readers (`decorative`, or `aria-hidden="true"`), so the color is not heard twice.
- In plain markup, give the swatch `role="img"` and an `aria-label`.

### How to test

- With a screen reader, a swatch on its own is read as an image by its color name, and one with no color as “No color”. One beside the color's name or code is not read.
- With no color set, the swatch shows a slash, not a blank or pale square.
- In a forced-color mode, the swatch keeps its color and its edge and slash are visible.
- With text at 200% and the page 320 pixels wide, the swatch keeps its shape.

## Composition

Holds the color checker. Sits in the color field and the color picker's trigger, and in each item of the color swatch picker.

## Usage rules

### Do

- Name a brand's colors as the brand does.
- Leave the color out when none is set, so the swatch is crossed out.

### Don't

- Show “no color” as white or a pale gray: it reads as a color that is set.
- Rely on the swatch alone where the exact color matters; show the code beside it.

## Related

- [Color swatch picker](../color-swatch-picker/color-swatch-picker.md): a set of swatches to pick one from.
- [Color field](../color-field/color-field.md): a color typed as a code, with its swatch.
- [Color picker](../color-picker/color-picker.md): any color, chosen in a panel.
