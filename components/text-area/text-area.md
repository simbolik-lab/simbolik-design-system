---
name: text-area
title: Text area
type: component
block: smbk-text-area
adaptStrategy: css
figmaNodeId: 4800:64744
status: candidate
---

# Text area

## Purpose

A text box for answers that run to sentences: a message, a description, a note. It is the input's well grown tall, so it looks and reacts exactly like the input, with a grip in its corner that the reader can drag to make it taller. For a single short value, use the input.

## Anatomy

- The block, the well. It always sits on the input's block, which draws the sunken surface, the hairline highlight edge, the inset shadow and every state.
- The control part, the native textarea, carrying the input's control part as well. It holds the padding, so the browser's resize handle sits in the well's corner.
- The grip part, the notches icon a hairline step in from the corner. It only draws; the browser's handle under it takes the pointer.
- In error, the input's error icon, a warning sign at the top end, on the first line.

## When to use

- Free text likely to wrap or hold several sentences: a support request, a comment, a project description.

## When not to use

- A name, an email, a number or any other short value. Use the [input](../input/input.md); a tall box asks for more than is wanted.
- Rich text with formatting. That needs an editor, which this system does not have.
- A choice from known values. Use the [select](../select/select.md), [radios](../radio/radio.md) or [checkboxes](../checkbox/checkbox.md).

## Behavior

It starts two rows tall, the height Figma draws, and takes any other number of rows. The reader can drag the corner to make it taller; its width follows the layout. Text longer than the box scrolls inside it with the system's thin scrollbar. The text is the input's body text. Hover lifts the well to the raised surface, focus draws the field focus border, and the error flag draws the danger border, which stays while focused, puts the warning icon at the top end with the text stopping short of it, and marks the control invalid. A read-only text area sits flat on the page with a faint edge, has no grip and cannot be resized; its text can be selected and copied. A disabled text area grays the well, cannot be typed in and cannot be resized. All of these are the input's own looks, so a change to the input reaches the text area.

Firefox cannot hide its own resize handle, so there the grip is not drawn and Firefox's handle shows in the corner instead.

## Accessibility
### What it does for you

- It is the browser's own textarea, so typing, pasting, undo, selection and line breaks behave as everywhere else.
- The error flag sets aria-invalid.
- The grip is decorative and hidden from assistive technology; the browser's own handle does the resizing.

### What you must do

- Give it a label: the field component around it gives one, or the label component with the for attribute. In development, a text area with no name logs a warning in the console.
- Let the field link the message that explains an error.
- Never use placeholder text as a label: it disappears when typing starts.

### How to test

- Tab to it: the focus border shows, in both themes and in a forced-color mode. Type, paste, undo and break lines as in any text box.
- With a screen reader, it is read as a text box by its label, and an error as invalid with its message.
- With text at 200% and the page 320 pixels wide, the box follows the width the layout gives it and long text scrolls inside it.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the text area, and on from it. |
| Enter | Starts a new line. |

## Composition

Contains the native textarea and the grip. Belongs inside a field, which gives it a label and a line of help or an error message.

## Usage rules

### Do

- Set the starting rows to the length of answer expected, so the box says how much to write.
- Say any length limit before the reader starts, in the field's help text.

### Don't

- Use it for a short single value.
- Clear what the reader wrote when the form shows an error.
- Round it into a capsule. Its corner is a control corner, as every field's is; a capsule reads as a one-line search or a tag.

## Related

- [Input](../input/input.md): one line.
- [Field](../field/field.md): the label and the help text around it.
- [Select](../select/select.md): a choice from a list.
