---
name: number-field
title: Number field
type: component
block: smbk-number-field
adaptStrategy: css
figmaNodeId: 7106:947
status: experimental
---

# Number field

## Purpose

A text field for a quantity or a measure, where a unit and limits matter: a weight, a count of seats, a width in pixels. The reader types the number or steps it with the minus and plus buttons or the arrow keys, and the field keeps it between its lowest and highest values. It reads and writes numbers the way the reader's language does, so "1,5" and "1.5" both work where each is how one and a half is written.

## Anatomy

- The block, always on the input's well: its markup carries the input's classes as well as its own.
- The control part, a text control holding the number, which is also the input's control part. Its figures are all one width, so a number that steps does not shift sideways.
- In error, the input's error icon, a warning sign before the unit.
- The unit part, optional: the unit after the number, in quieter text, a step smaller than the number at the medium size.
- The separator part, a hairline between what is typed and the buttons.
- The decrement and increment parts, ghost icon buttons with a minus and a plus, in the input's trailing action. At the medium size they are small icon buttons; at the small size they are the extra-small square, with the same 16 px icons, so they fit inside the small well.

## When to use

- A quantity or a measure: a weight, a price, a count, a size in pixels, a percentage.
- A value with limits and a natural step, such as 1 to 50 seats in steps of 1.

## When not to use

- A number that is really a name: a phone number, a postcode, a card number, an order number. Use the [input](../input/input.md) with a numeric keyboard hint; steps and limits mean nothing there.
- A value picked roughly from a wide range, where the exact number matters less. Use the [slider](../slider/slider.md).
- A choice of a few fixed values. Use the [segmented control](../segmented-control/segmented-control.md) or the [select](../select/select.md).

## Behavior

The minus and plus buttons move the number by its step; holding one down keeps stepping. The up and down arrow keys do the same while the field has focus, as do Page Up and Page Down, and Home and End jump to the lowest and highest values when the field has them. At a limit the button that would pass it is disabled. Scrolling the page never changes the number.

The field takes only what can make a number in the reader's language: figures, the decimal mark, the minus sign. A typed number is settled when the reader leaves the field or presses Enter: kept inside the limits and rounded to the step, then written the reader's way. The page hears the new number then, and after every step, not on each key. An emptied field reports `null`, and the page empties the field by giving it `null`.

The wrapper holds its own number, or follows the number the page gives it. Given a name, it sends the number with the form as plain digits, whatever the language shows. Read-only, the number can be read and copied and the buttons are disabled; disabled, the field and its buttons are out of reach.

With `hideButtons` the field is a bare number box: the same well, text and keys without the line and the two buttons, for a row of boxes too narrow to hold them.

## Accessibility

### What it does for you

- A screen reader hears the field's name, "number field", the number, and then the unit.
- The field is one stop in the Tab order. The buttons are left out of it, because the arrow keys do the same from the field; they are named "Decrease" and "Increase" followed by the field's name, such as "Increase seats", so a screen reader on its own can still press them.
- Each button is a 24 px square or larger, the least a press needs.
- A number brought back inside the limits when the reader leaves the field is read out, so the change is never silent.
- In development, a number field with no name logs a warning in the console.
- In a forced-color mode, the hairline between the unit and the buttons is drawn in the reader's text color.

### What you must do

- Give it a label like any input; inside a field it has one.
- Say the limits in the field's help text, such as "From 1 to 50", so they are known before the first try.

### How to test

- Tab to the field: it is one stop, and the buttons are skipped. Press Up Arrow and Down Arrow: the number moves by its step, and the page hears it.
- Type a number outside the limits and press Enter: it is brought inside them and rounded to the step, and a screen reader says the new number.
- With a screen reader, the field is read with its name, "number field", its number and its unit, and each button as "Increase" or "Decrease" with the field's name.
- With text at 200% and the page 320 pixels wide, the number, the unit and the two buttons stay whole.
- In a forced-color mode, the focus border, the number and the hairline stay visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the field, and out of it, which settles a typed number. The two buttons are skipped. |
| Up Arrow or Down Arrow | Moves the number up or down by its step. |
| Page Up or Page Down | Moves the number up or down, as the arrow keys do. |
| Home or End | Jumps to the lowest or highest value, when the field has limits. |
| Enter | Settles a typed number: kept inside the limits, rounded to the step and written the reader's way. |

## Composition

The input's well, with the control, the error icon in error, and in the trailing action the unit, the hairline and the two buttons. Sits in a field, which carries the label and the limits as help text.

## Usage rules

### Do

- Give the unit beside the number, and in the label too when it decides what the reader types ("Weight in kg").
- Choose a step the reader expects: 1 for a count, 0.5 or 0.1 for a measure.

### Don't

- Use it for a phone number, a postcode or any number that is a name.
- Leave the limits unsaid: a number changed on leaving the field surprises a reader who did not know them.

## Related

- [Input](../input/input.md): the plain text field it is built on.
- [Field](../field/field.md): the label and the help text around it.
- [Slider](../slider/slider.md): a value picked roughly from a range.
