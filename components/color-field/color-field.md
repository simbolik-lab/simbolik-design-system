---
name: color-field
title: Color field
type: component
block: smbk-color-field
adaptStrategy: css
figmaNodeId: 7408:727
status: experimental
---

# Color field

## Purpose

A text field for a color code, such as #3E63DD, with a swatch of the color at its start. It is the way to enter an exact color, typed or pasted; to choose a color by eye, use the color picker, whose panel holds one.

## Anatomy

- The block, always on the input's well: its markup carries the input's classes as well as its own.
- The swatch part, a color swatch in the input's leading content, 20 px at the medium size and 16 px at the small one, showing the color the field holds.
- The control part, a text control holding the code, which is also the input's control part.
- In error, the input's error icon, a warning sign after the code.

## When to use

- To enter an exact color, such as a brand's color from its guidelines.
- Beside a color picker or in its panel, for the code.

## When not to use

- To choose a color by eye. Use the [color picker](../color-picker/color-picker.md).
- To choose among a few set colors. Use the [color swatch picker](../color-swatch-picker/color-swatch-picker.md).

## Behavior

The field takes a hex code, with or without the #, in three or six digits. The code is settled when the reader leaves the field or presses Enter, and written as #3E63DD; the swatch then shows the color. A code that is not a color is put back to the last good color. The up and down arrow keys step the color. The page hears the new color when it is settled, and nothing when the field is emptied.

The wrapper holds its own color, or follows the color the page gives it. The field never decides that a color is wrong for the form: the page sets the error and the field's message says why. Read-only, the code can be read and copied; disabled, the field is out of reach.

## Accessibility

### What it does for you

- A screen reader hears the field's name and the code.
- The swatch is hidden from screen readers, which would only hear the color again.
- In development, a color field with no name logs a warning in the console.
- The up and down arrow keys step the color, and Enter settles a typed code.

### What you must do

- Give it a label like any input; inside a field it has one.
- Say what to type in the help text, such as “Six digits after #”.

### How to test

- Tab to the field: the focus ring shows in both themes and in a forced-color mode. Type a code and press Enter: it settles as written, such as #3E63DD. Type something that is not a color and press Enter: it goes back to the last good color.
- With a screen reader, the field is read by its label and its code, and the swatch is not read.
- With text at 200% and the page 320 pixels wide, the code stays whole.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the field. Leaving the field settles the code. |
| Enter | Settles the typed code. |
| Up Arrow or Down Arrow | Steps the color. |

## Composition

The input's well, with a color swatch in its leading content, the control, and the error icon in error. Sits in a field, which carries the label, the help and the message.

## Usage rules

### Do

- Say the format in the help text.
- Say in the message what to type when the color is wrong for the form.

### Don't

- Use it alone where readers choose colors by eye; pair it with the color picker.

## Related

- [Input](../input/input.md): the plain text field it is built on.
- [Field](../field/field.md): the label and the help text around it.
- [Color picker](../color-picker/color-picker.md): a color chosen in a panel, holding a color field.
