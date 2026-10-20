---
name: button-note
title: Button note
type: component
block: smbk-button-note
adaptStrategy: css
figmaNodeId: 7115:2068
status: experimental
---

# Button note

## Purpose

A button with a short line of quiet words that says what pressing it will do, or why it cannot be pressed now. A disabled button on its own leaves the reader guessing; with a note it always gives its reason. It differs from a field's help text, which explains what to enter, and from a tooltip, which hides its words until hovered.

## Anatomy

- The block, a row holding the button and its note.
- The button, any button at any size. Its size sets the row's; the note does not change with it.
- The note part, one or two lines of the small body text in the secondary text color.
- The icon part, an information icon before the words. Optional.
- The text part, the words.

## When to use

- A button whose effect is not obvious from its label: "Starts the release notes from what merged since the last release."
- A button that cannot be pressed now, to say why: "Nothing merged since the last release yet."
- A page header's main action, with a line under it that says what it will do.

## When not to use

- To explain a field. Use the [field](../field/field.md)'s help text.
- For a long explanation. Link to it, or put it in the page.
- For words that only matter on hover. A note is always shown.

## Behavior

Three layouts. Beside puts the note next to the button, centered on it; when the row has no room for both, the note moves under the button. Below always puts the note under the button. Header end lines the button and the note up with the end of a page header, the note's words aligned to that edge. The gap between the button and the note is the same at every size.

The note keeps the secondary text color when the button is disabled, never the faded disabled color, so the reason stays readable.

## Accessibility

### What it does for you

- The note is the button's description: a screen reader reads it after the button's name. The wrapper links them.
- A disabled button with a note stays focusable, so the reason can be reached and read. The wrapper turns the disabled attribute into the aria-disabled attribute, and the button does nothing when pressed.
- The note is not a stop in the tab order of its own.
- The information icon is decorative; the words say it all.

### What you must do

- In markup written by hand, give the note an id and point the button's description at it.
- In markup written by hand, turn a disabled button's disabled attribute into the aria-disabled attribute yourself, so the button stays focusable and does nothing when pressed.

### How to test

- Tab to the button: it takes focus and the note does not. A disabled one takes focus too, with the focus ring showing in both themes and in a forced-color mode.
- Press Enter, then Space: each runs the action once. On a disabled button, neither does anything.
- With a screen reader, the button is read by its name, then the note as its description.
- With text at 200% and the page 320 pixels wide, the note wraps and stays whole.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the button. A disabled button with a note is not skipped. |
| Enter or Space | Presses the button. A disabled button does nothing. |

## Composition

Contains one button and one note. Sits in a page header, a card's footer, a form's actions, a settings row.

## Usage rules

### Do

- Say why a disabled button cannot be pressed, and what would make it possible.
- Keep the note to a sentence.

### Don't

- Repeat the button's label in the note.
- Put a link or another control inside the note.

## Related

- [Button](../button/button.md): the button the note belongs to.
- [Field](../field/field.md): help text for what to enter.
- [Tooltip](../tooltip/tooltip.md): a short name for a control, shown on hover and focus.
