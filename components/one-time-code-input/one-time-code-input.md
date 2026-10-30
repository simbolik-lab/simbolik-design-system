---
name: one-time-code-input
title: One-time code input
type: component
block: smbk-one-time-code-input
adaptStrategy: css
figmaNodeId: 8217:3276
status: proposed
---

# One-time code input

## Purpose

A field for a short code sent by email or text message to prove who someone is: six boxes in two groups of three, one digit in each, so a reader can check the code against the message at a glance. It acts as one field: one value, one name, one place the phone's suggested code goes. For any other short value, such as a postcode or a PIN a person chose themselves, use a plain input.

## Anatomy

- The block, holding the two groups and the control.
- The group part, three cells side by side; a wider gap between the two groups splits the code in half, as it is read.
- The cell part, one box: the input's well at the large control's height, square, with the large control's corners. Its markup carries the input's classes.
- The digit part, the digit a cell shows.
- The control part, one native text control laid unseen over every cell. It holds the code; the cells only show it.

## When to use

- Checking a sign-in, a new email address or a payment with a code the product has just sent.
- Any code of exactly six digits that a person copies from a message.

## When not to use

- A code with letters in it, or of another length. Use an [input](../input/input.md).
- A password or a PIN the person chose. Use the [password field](../password-field/password-field.md).
- A number someone works out or adjusts. Use the [number field](../number-field/number-field.md).

## Behavior

Typing a digit fills the active cell and moves to the next. Backspace clears the last digit and goes back a cell, so pressing it again and again empties the cells from the end; on a filled cell picked in the middle it clears that cell's digit, and the digits after it close up, since the code is one value with no gaps. The arrow keys, Home and End move between the cells, and a press picks the cell under it, never one past the next empty cell. On a filled cell, typing replaces its digit. A paste fills every cell from the start with the digits it holds, whatever else it holds, such as spaces or a dash. Anything but a digit is kept out.

The cell where the next digit goes takes the focus edge while the field has focus. In error every cell draws the danger edge, kept while focused. Disabled and read-only cells take the input's disabled and read-only looks.

On a phone the keyboard shows digits, and the phone can offer the code from a message it has just received, which fills every cell. In a space narrower than the six cells, they narrow together and keep their height, so the page never scrolls sideways.

The value is one string of digits. The React component reports it with `onChange` each time it changes, and the whole code with `onComplete` once the sixth digit is in. In a form, the control's `name` sends the code as one value.

## Accessibility

### What it does for you

- It is one native text field, so a screen reader announces one field by its name, with the digits typed so far as its value, and a form, a password manager and the phone's code suggestion all see one field.
- The cells are hidden from assistive technology, since the field already holds their digits.
- Inside a field component it takes the field's label, help and error lines, its required, disabled and read-only states, and marks itself invalid in error.
- It asks for the numeric keyboard and says it takes a one-time code (`autocomplete="one-time-code"`), so the phone can offer the code.

### What you must do

- Give it a name: put it in a field with a label such as "Verification code", or give it an `aria-label`.
- Say under it where the code was sent and how long it lasts, in the field's help line, and how to get a new one.
- Never send the code away, or clear the cells, on a timer the reader cannot stop. If the code runs out, say so in the field's error line and offer a new one.
- In markup written by hand, write the cells with the input's classes at the large size, hide the groups from assistive technology, mark the cell where the next digit goes `data-active`, and write the error modifier on each cell in error. The cells only show the digits; keeping them in step with the control needs script.

### How to test

- Tab to the field: the first empty cell takes the focus edge.
- Type six digits: each fills a cell and moves on. Press Backspace: the last digit clears. Paste a code with a space in it: every cell fills.
- With a screen reader, the field is read once, by its label, with its digits as its value and its help line after.
- On a phone, the keyboard shows digits.
- With the page 320 pixels wide, the cells narrow and nothing scrolls sideways.

### Keyboard

| Key | What it does |
|---|---|
| 0 to 9 | Fills the active cell and moves to the next. |
| Backspace | Clears the last digit and goes back a cell; on a filled cell picked in the middle, clears its digit. |
| Left arrow or Right arrow | Moves to the cell before or after, never past the next empty cell. |
| Home or End | Moves to the first cell, or to the cell after the last digit. |

## Composition

It sits inside a field, with a label over it and the help line under it, usually with a button to send the code and a link to ask for a new one. It holds nothing else.

## Usage rules

### Do

- Put it in a field with a label and a help line saying where the code went.
- Offer a way to get a new code beside it.
- Send the code with `onComplete` only where a wrong code costs nothing; otherwise let the reader press a button.

### Don't

- Use it for a value of any other length or with letters.
- Split the code into six separate fields of your own: a paste, the phone's suggestion and a screen reader all expect one.

## Related

- [Input](../input/input.md): the well each cell is drawn with, for any other short value.
- [Field](../field/field.md): the label, help and error lines around it.
- [Password field](../password-field/password-field.md): a secret the person chose.
