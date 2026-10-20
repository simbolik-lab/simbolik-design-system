---
name: color-slider
title: Color slider
type: component
block: smbk-color-slider
adaptStrategy: css
figmaNodeId: 7407:320
status: experimental
---

# Color slider

## Purpose

Changes one channel of a color, its hue, saturation, lightness or opacity, by dragging a thumb along a strip that shows the colors the channel moves through. Unlike the slider, which picks a number, the strip shows what each place on it looks like, and the thumb shows the color as it is now.

## Anatomy

- The header part, the top row: the label part at the start and the value part at the end, in the small body text with figures of one width. It can be left out; the label still names the slider for screen readers.
- The track part, a strip with fully round ends and a hairline edge drawn inside it.
- The gradient part, the colors the channel moves through, which the page paints as an inline background. The opacity strip has a color checker (`smbk-color-checker`) under it.
- The rail part, the stretch the thumb's middle travels: the strip less half its height at each end, so the thumb never passes the round ends.
- The thumb part, a color thumb (`smbk-color-thumb`), holding the hidden range input that takes the keys.

## When to use

- To change one part of a color, such as making a brand color lighter or a shadow more see-through.
- Beside a color area, as the color picker's panel does: the hue slider sets the hue the area shows.

## When not to use

- To pick a number. Use the [slider](../slider/slider.md).
- To enter an exact color. Use the [color field](../color-field/color-field.md), which takes a code.
- To choose from a few set colors. Use the [color swatch picker](../color-swatch-picker/color-swatch-picker.md).

## Behavior

Pressing anywhere on the strip moves the thumb there, and dragging moves it on. While dragged, the thumb grows a step and lifts; it changes size with the state motion; under reduced motion it changes size at once and only the shadow fades. The label row shows the value: the hue in degrees, the others as percentages.

The slider holds its own color from a first color, or follows the color the page gives it. It reports the new color as the thumb moves, and again when the reader lets go. Disabled, the strip turns the disabled surface, the thumb shows no color, and the value the disabled text color.

The strip's colors and the thumb's place depend on the color, so they are set by the wrapper. In plain markup, the page paints the gradient part, places the thumb with `left` as a percentage of the rail, and paints the thumb's color, updating them as the color changes; a disabled thumb takes `data-disabled` and no color.

On a touch screen an invisible area round the strip takes a press out to the comfortable touch target above and below it, and only halfway to a color area or another strip right beside it.

## Accessibility

### What it does for you

- Each slider is a range input inside the thumb, one stop in the Tab order. Left and Right, or Up and Down, step the channel; Page Up and Page Down take larger steps; Home and End go to the ends.
- A screen reader hears the label, the value and the color in words, such as “Hue, 225°, blue”.
- The label names the slider even when the top row is hidden. The opacity slider is labeled “Opacity”.
- The thumb shows a focus ring, with the page's color in the gap, while its input has keyboard focus.
- The strip and the thumb keep their colors in forced colors mode, since the colors are what they show.

### What you must do

- Give the slider a `label` when the channel's own name, such as “Hue”, is not the name it should be read by. The channel's own name is used unless you give another.

### How to test

- Tab to the slider: one stop takes focus, and the thumb shows its ring in both themes and in a forced-color mode. Press the arrow keys, Page Up, Page Down, Home and End: the value moves and the color changes.
- With a screen reader, the slider is read by its label, its value and the color in words, such as “Hue, 225°, blue”, also when the top row is hidden.
- With the page 320 pixels wide, the strip fits and the thumb stays reachable.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the slider. It is one stop. |
| Left Arrow, Right Arrow, Up Arrow or Down Arrow | Steps the channel. |
| Page Up or Page Down | Takes a larger step. |
| Home or End | Goes to the lowest or highest value. |

## Composition

Holds the color thumb and, on the opacity strip, the color checker. The color picker's panel holds a hue slider and an opacity slider with their top rows hidden.

## Usage rules

### Do

- Pair the hue slider with the color area, sharing one color.
- Keep the top row when the slider stands alone, so its value can be read.

### Don't

- Hide the top row of a slider standing alone: the reader cannot see the value.
- Use it where an exact color matters without the color field beside it.

## Related

- [Color area](../color-area/color-area.md): two channels at once, in a square.
- [Color picker](../color-picker/color-picker.md): the area, the sliders, the code and saved colors in one panel.
- [Slider](../slider/slider.md): a number picked from a range.
