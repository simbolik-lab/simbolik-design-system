---
name: color-area
title: Color area
type: component
block: smbk-color-area
adaptStrategy: css
figmaNodeId: 7407:327
status: experimental
---

# Color area

## Purpose

Changes two channels of a color at once by dragging a thumb in a square: saturation across and brightness up, over the colors of one hue. It is the quickest way to find a color by eye; the hue comes from a hue slider beside it, and an exact color from the color field.

## Anatomy

- The block, a square with the control's medium corner and a hairline edge drawn inside it, painted with the colors of one hue: white to the color across, clear to black up. The colors depend on the hue, so the page paints them as an inline background.
- The thumb part, a color thumb (`smbk-color-thumb`) at the color chosen, holding the two hidden range inputs that take the keys.

## When to use

- To choose a color by eye, with a hue slider for the hue, as the color picker's panel does.

## When not to use

- To enter an exact color. Use the [color field](../color-field/color-field.md).
- To choose from a few set colors. Use the [color swatch picker](../color-swatch-picker/color-swatch-picker.md).

## Behavior

Pressing anywhere in the square moves the thumb there, and dragging moves it on. While dragged, the thumb grows a step and lifts; under reduced motion it grows at once and only the shadow fades. The area is square and fills the width it is given, up to its own width.

The area holds its own color from a first color, or follows the color the page gives it; it reports the new color as the thumb moves, and again when the reader lets go. Disabled, the square turns the disabled surface and the thumb shows no color.

In plain markup, the page paints the square's colors, places the thumb with `left` and `top` as percentages, and paints the thumb's color, updating them as the color changes.

## Accessibility

### What it does for you

- The area is one stop in the Tab order. Left and Right step the saturation, Up and Down the brightness; Page Up and Page Down take larger steps.
- A screen reader hears it as a two-dimensional slider, with each channel's value and the color in words.
- A press anywhere in the square is the pointer's way; the keys are the keyboard's, so neither a drag nor a steady hand is needed.
- The thumb shows a focus ring while the area has keyboard focus.

### What you must do

- Give the area a name that says what it changes, with `aria-label` or `aria-labelledby`.

### How to test

- Tab to the area: one stop takes focus, and the thumb shows its focus ring in both themes and in a forced-color mode. Press the arrow keys: the thumb moves and the color changes.
- With a screen reader, the area is read as a slider with its name, each channel's value and the color in words, and each key press announces the new color.
- Press anywhere in the square with a pointer or on a touch screen: the thumb moves there.
- With the page 320 pixels wide, the square fits and the thumb stays inside it.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the area. It is one stop. |
| Left Arrow or Right Arrow | Steps the channel across the square, the saturation by default. |
| Up Arrow or Down Arrow | Steps the channel up the square, the brightness by default. |
| Page Up or Page Down | Takes a larger step. |

## Composition

Holds the color thumb. Sits over a hue slider in the color picker's panel.

## Usage rules

### Do

- Put a hue slider with it, sharing one color.
- Offer the color field nearby for an exact color.

### Don't

- Use it alone where the hue must change: it shows one hue only.

## Related

- [Color slider](../color-slider/color-slider.md): one channel along a strip.
- [Color picker](../color-picker/color-picker.md): the area, the sliders, the code and saved colors in one panel.
