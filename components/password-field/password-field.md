---
name: password-field
title: Password field
type: component
block: smbk-password-field
adaptStrategy: css
figmaNodeId: 7106:682
status: experimental
---

# Password field

## Purpose

A text field for a password or a passphrase. It hides what is typed and has a button at its end that shows it, so the reader can check a long password before sending it instead of typing it again. Everything else is the input's: the well, the sizes, the states and the error look.

## Anatomy

- The block, always on the input's well: its markup carries the input's classes as well as its own.
- The control part, a native password control, which is also the input's control part. It shows dots while the password is hidden and the words while it is shown.
- In error, the input's error icon, a warning sign before the button.
- The toggle part, a ghost icon button in the input's trailing action: an eye while the password is hidden, an eye with a line through it while it is shown. At the medium size it is the small icon button; at the small size it is the extra-small square, with the same 16 px eye, so it fits inside the small well.

## When to use

- Signing in, and choosing or changing a password.
- Any secret the reader types and may want to check: a passphrase, a recovery code.

## When not to use

- A code the reader copies from a message and never needs to hide, such as a one-time code. Use the [input](../input/input.md).
- A key or a token the page shows for copying. Use the input, read-only, with a copy button in its trailing action.

## Behavior

The password starts hidden. Pressing the button shows it as plain text and turns the eye into a crossed-out eye; pressing it again hides it. Nothing else changes: the value stays, the field keeps its size, and the reader keeps typing where they were. Pressed with a mouse while typing, the focus stays in the field; reached with Tab and pressed with Enter or Space, the focus stays on the button. Sending the form hides the password again first, so the browser never keeps it as plain text.

The wrapper holds its own state, or follows the state the page gives it and reports each press. A long password scrolls inside the field and never widens it.

The control asks the browser's password manager for the saved password unless given another autocomplete: a form that creates a password passes `new-password`, so the manager offers a strong one. Pasting is always allowed, and the control never corrects, capitalizes or checks the spelling of what is typed.

The field can say when Caps Lock is on: it reports Caps Lock each time a key is pressed in it, and reports it off when the field loses focus. The page shows the notice as the field's warning, under the help text.

A disabled field disables its button too. A read-only field keeps the button, so the value can still be read.

## Accessibility

### What it does for you

- In development, a password field with no name logs a warning in the console.
- The button says what it will do: "Show password" while the password is hidden, "Hide password" while it shows. Its name changes rather than a pressed state, so a screen reader hears the action, not a state to work out.
- The button comes after the field in the Tab order and draws the system's focus ring.
- A screen reader hears the field as a secure text field while the password is hidden and as a text field while it shows.
- A Caps Lock notice shown as the field's warning is read out when it appears, without cutting in.
- Pressed with a mouse while typing, the button leaves the focus in the field; reached with Tab and pressed, the focus stays on the button.

### What you must do

- Give it a label like any input; inside a field it has one.
- Pass `showLabel` and `hideLabel` for another language or for "Show passphrase".
- Write an error that says what to put right, without saying whether the name or the password was the wrong one.

### How to test

- Tab to the field, then Tab again: the button takes focus and shows the focus ring. Press Enter, then Space: the password shows, then hides, and focus stays on the button.
- With a screen reader, the hidden field is read as a secure text field, and the button as "Show password" or "Hide password", whichever it will do.
- Turn Caps Lock on while typing: the notice is read out when it appears.
- With text at 200% and the page 320 pixels wide, a long password scrolls inside the field and the button stays beside it.
- In a forced-color mode, the field's focus border and the button's focus ring stay visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the field, then to the show and hide button. |
| Enter or Space | On the button, shows or hides the password. |

## Composition

The input's well, with the control, the error icon in error, and the button in the trailing action. Sits in a field, which carries the label, the rules for the password as help text, and the Caps Lock notice as a warning.

## Usage rules

### Do

- Put the password's rules in the field's help text, so they are known before the first try.
- Pass `new-password` when the form creates a password.

### Don't

- Block pasting into the field: it stops password managers and long, safe passwords.
- Ask the reader to type a new password twice when the field can show it.

## Related

- [Input](../input/input.md): the plain text field it is built on.
- [Field](../field/field.md): the label, the help text and the warning around it.
- [Field message](../field-message/field-message.md): the Caps Lock notice is a warning message.
