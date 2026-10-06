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

## When to use

- Free text likely to wrap or hold several sentences: a support request, a comment, a project description.

## When not to use

- A name, an email, a number or any other short value. Use the input; a tall box asks for more than is wanted.
- Rich text with formatting. That needs an editor, which this system does not have.
- A choice from known values. Use the select, radios or checkboxes.

## Behavior

It starts three rows tall, the height Figma draws, and takes any other number of rows. The reader can drag the corner to make it taller; its width follows the layout. Text longer than the box scrolls inside it with the system's thin scrollbar. Hover lifts the well to the raised surface, focus draws the field focus border, the error flag draws the danger border and marks the control invalid, and a disabled text area grays the well, cannot be typed in and cannot be resized. All of these are the input's own looks, so a change to the input reaches the text area.

Firefox cannot hide its own resize handle, so there the grip is not drawn and Firefox's handle shows in the corner instead.

## Accessibility

- It is the browser's own textarea, so typing, pasting, undo, selection and line breaks behave as everywhere else.
- It needs a label: the field component around it gives one, or the label component with the for attribute.
- The error flag sets aria-invalid; the field links the message that explains it.
- Placeholder text is not a label: it disappears when typing starts.
- The grip is decorative and hidden from assistive technology; the browser's own handle does the resizing.

## Composition

Contains the native textarea and the grip. Belongs inside a field, which gives it a label and a line of help or an error message.

## Usage rules

### Do

- Set the starting rows to the length of answer expected, so the box says how much to write.
- Say any length limit before the reader starts, in the field's help text.

### Don't

- Use it for a short single value.
- Clear what the reader wrote when the form shows an error.

## Related

- Input: one line.
- Field: the label and the help text around it.
- Select: a choice from a list.
