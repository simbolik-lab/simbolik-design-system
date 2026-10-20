---
name: color-picker
title: Color picker
type: component
block: smbk-color-picker
adaptStrategy: css
figmaNodeId: 7411:823
status: experimental
---

# Color picker

## Purpose

Lets the reader set a color, such as a brand color, a chart series or a label's color. It is a field or a swatch that opens a panel: a color area, a hue slider and an opacity slider to find a color by eye, the code to type an exact one, an eyedropper to take one from the screen, and saved colors to pick from. Every part works from the keyboard and says its value in words.

## Anatomy

- The block, around the trigger and the panel.
- The trigger part, a button that is the input's well: its markup carries the input's classes and the select's well, value and icon parts. The field type holds the swatch part (a color swatch), the value part (the code) and the caret part, which turns up while the panel is open; the swatch type holds the swatch alone in a square as tall as the input.
- The name part, the code and the color in words, read by screen readers only: it names the trigger after its label, and the visible code is hidden from them so it is not heard twice.
- The panel part, the popover's panel at the picker's own width, holding, the medium stack step apart:
  - the area part, a color area that fills the panel's width;
  - two slider parts, a hue slider and an opacity slider, with their top rows hidden;
  - the code part, a row of the format part (a small select), the field part (a small color field) and the eyedropper part (a small secondary icon button);
  - the swatches part, a divider part over a small square color swatch picker.
- The opacity slider, the format, the eyedropper and the swatches can each be left out.

## When to use

- A setting that is a color: a brand color, a theme's accent, a chart series, a label.
- The swatch type in a toolbar or a tight row of settings, such as fill and line.

## When not to use

- To choose among a few set colors only. Use the [color swatch picker](../color-swatch-picker/color-swatch-picker.md).
- To enter a code with nothing else. Use the [color field](../color-field/color-field.md).

## Behavior

Pressing the trigger opens the panel under it, or above it when there is more room there; pressing it again closes it. Every part of the panel shares one color, so a change in one shows in all, and in the trigger. The picker holds its own color from a first color, or follows the color the page gives it, and reports each change.

The eyedropper is shown only in a browser that has one, once the page runs; it takes a color from anywhere on the screen and keeps the color's opacity. The format menu offers the hex code. A change in the code field keeps the color's opacity too. Given a name, the picker sends the color with the form as a hex code with its opacity.

Disabled, the trigger is dimmed and does not open; read-only, the color can be read and the panel does not open. The panel alone is also a component, for a page that shows and places it itself, such as a side panel of settings.

## Accessibility

### What it does for you

- The trigger is one button, named by its label and the color: the code and its name in words, such as “Brand color, #3E63DD, vibrant blue”. It says it opens a dialog, and whether it is open.
- Enter, Space or the down arrow open the panel, a dialog named “Color picker”. Focus stays on the trigger, and Tab goes into the panel next, through the area, the sliders, the format, the code, the eyedropper and the swatches.
- Escape closes the panel and puts focus back on the trigger; a press outside or focus moving away close it too.
- Each part of the panel keeps its own keys and says its value in words: see the color area, the color slider, the color field and the color swatch picker.
- The eyedropper button is named “Pick a color from the screen”.

### What you must do

- Give the trigger a label, such as “Brand color”, so its name says what the color is for.
- Give the words the picker says by itself, such as the names of the panel's sliders, format, code, eyedropper and swatches, in the page's own language. They keep their English unless the page gives its own.

### How to test

- Tab to the trigger and press Enter, Space or Down Arrow: the panel opens with focus still on the trigger. Press Tab: focus goes into the panel through each part in turn.
- Press Escape: the panel closes and focus is back on the trigger.
- With a screen reader, the trigger is read by its label, the code and the color's name, as a button that opens a dialog, and the panel as a dialog named “Color picker”.
- With text at 200% and the page 320 pixels wide, the panel stays whole and every part stays reachable.
- In a forced-color mode, the focus ring shows on every part.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the trigger. With the panel open, moves into the panel and through its parts. |
| Enter, Space or Down Arrow | On the trigger, opens the panel. |
| Escape | Closes the panel and puts focus back on the trigger. |

## Composition

The trigger is the input's well, built as the select's, with a color swatch; the panel is the popover's, holding a color area, two color sliders, a select, a color field, a secondary icon button, a divider and a color swatch picker.

## Usage rules

### Do

- Label the picker with what the color is for.
- Give saved colors when the reader is likely to reuse them, such as a brand's palette.

### Don't

- Use the swatch type where there is room for the field: the code is what many readers check.
- Put a picker in a row so tight its panel has no room; the panel is as wide as it is.

## Related

- [Color swatch picker](../color-swatch-picker/color-swatch-picker.md): a few set colors.
- [Color field](../color-field/color-field.md): a color typed as a code.
- [Popover](../popover/popover.md): the panel it opens in.
