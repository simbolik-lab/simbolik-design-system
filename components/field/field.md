---
name: field
title: Field
type: component
block: smbk-field
adaptStrategy: css
figmaNodeId: 4800:63897
status: candidate
---

# Field

## Purpose

The frame that turns a bare control into a form question: a label above it that stays while the reader types, an optional mark saying it must be filled, and a line under it with help or, when something is wrong, the error message. It holds one control, as Figma's slot does: an input, a select or a text area. It does not draw the control and never decides when a value is wrong; the form does.

## Anatomy

- The block, a column spaced by the small stack step.
- The label part, the label component in its subtle tone, with its required mark when the field is required.
- The control, the field's own child, unwrapped: an input, a select, a text area or a search field. Its width and states are its own.
- The description part, a line of small help text under the control. In error, it holds the error message instead, when one is given.

## When to use

- Every form control that the reader fills in: a name, an email, a role, a message.
- A single control on its own, such as a field inside a popover.

## When not to use

- A group of checkboxes or radios under one question. That needs a fieldset with a legend, which this system does not draw yet.
- A search box at the top of a list, named by what is around it. Use the search field with an aria-label.
- Labels that sit beside the control in a row. The field always stacks.

## Behavior

The field passes its state to the control: it gives the control its id unless it has one, links the line under it to it, marks it required, and, in error, turns on the control's danger border. In error, the label and the line take the danger text color, as Figma binds them. Given an error message, the line shows the message in place of the help text; given only that the field is in error, it keeps the help text and turns it red. Nothing in the field moves.

The id the field makes can change when the page changes, so give the control its own id when the page needs one that stays the same, such as for tests or a page rendered ahead of time.

The field fills the width of its container; the form decides how wide it is.

The select has no help line of its own. Put a select inside a field to give it help text.

## Accessibility

- The label is a real label element tied to the control, so it names the control and a press on it reaches the control. It also names the control through aria-labelledby, which is what names a select's open list; a control given its own aria-label or aria-labelledby keeps it.
- The line under the control describes it through aria-describedby, so help and error messages are read with the control. The control's own aria-describedby is kept as well.
- An error marks the control invalid (aria-invalid) as well as turning it red, and the message says what to change. The message is what keeps color from being the only sign: given `error` with no message, the field shows the error by color alone (the red border, label and line) and only a screen reader hears that the value is invalid. Always give a message with an error.
- The required mark is decorative; the control itself is marked required (the native attribute, or aria-required on the select).
- The help text comes before any error and is replaced by the message only when one is given; put any limit the reader must meet in the help text, so it is known before the first try.

## Composition

Contains a label, exactly one control, and an optional line. The control must be one of the system's fields, because the field passes `error` and `required` to it. Fields stack into forms; give a form of several fields the large stack step between them.

## Usage rules

### Do

- Name the value in the label ("Email address"), not the instruction ("Enter your email").
- Write an error message that says how to put it right.
- Keep the help text short: one line in most widths.

### Don't

- Use the placeholder as the only label.
- Show an error before the reader has had a chance to answer.
- Put two controls in one field.

## Related

- Input, Select, Text area: the controls it holds.
- Label: the label it draws.
- Popover: a field can sit in a popover's body.
