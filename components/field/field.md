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

- The block, a column spaced by the small stack step. Side by side, two columns: the label on the left, as tall as a small control so its words sit on the control's middle; the control on the right at a fixed width, with its line under it.
- The label part, the label component in its subtle tone, with its required mark when the field is required.
- The control, the field's own child, unwrapped: an input, a select, a text area or a search field. Its width and states are its own.
- The description part, a line under the control: a field message of the help type, carrying the field's class beside its own. In error it is a field message of the error type, a circled-cross icon and the error message, in the help text's place, with the same class.
- The warning part, optional: a field message of the warning type under the help text or the error, for something to notice that is not an error, such as Caps Lock being on in a password field.

## When to use

- Every form control that the reader fills in: a name, an email, a role, a message.
- A single control on its own, such as a field inside a popover.

## When not to use

- A group of checkboxes or radios under one question. Use the [field group](../field-group/field-group.md), a fieldset with its legend.
- A search box at the top of a list, named by what is around it. Use the [search field](../search-field/search-field.md) with an `aria-label`.

## Behavior

The field passes its state to the control: it gives the control its id unless it has one, links the line under it to it, marks it required, makes it disabled or read-only, and, in error, turns on the control's danger border and icon. The system's controls read all of this from the field around them, so a control inside a site's own component, such as a wrapper that adds a site's behaviour, is still named, described and marked by the field, though the wrapper passes nothing on. In error, the label and the message take the danger text color, as Figma binds them, and the message leads with its icon. Given an error message, the line shows the message in place of the help text; given only that the field is in error, it shows the help text as the message. Nothing in the field moves. Disabled, the label, its mark and the help text dim with the control. Read-only, only the control changes: it can be read and copied, not changed.

A warning is a line of its own under the help text or the error, with the warning icon; it does not mark the field invalid and does not stop the form. While the page passes `null` for it, the field keeps an empty place for it that takes no room, and the warning fills that place when it comes.

The id the field makes can change when the page changes, so give the control its own id when the page needs one that stays the same, such as for tests or a page rendered ahead of time.

The field fills the width of its container; the form decides how wide it is.

Two layouts. Stacked puts the label above the control. Side by side puts the label on the left of the control, for a column of settings: give the control its small size, since the label lines up with a small control's middle. The page keeps its order, label, control, line, so a screen reader and the Tab key meet them as before; only the layout moves. In a narrow space a side-by-side field stacks.

The select has no help line of its own. Put a select inside a field to give it help text.

## Accessibility

### What it does for you

- The label is a real label element tied to the control, so it names the control and a press on it reaches the control. It also names the control through `aria-labelledby`, which is what names a select's open list; a control given its own `aria-label` or `aria-labelledby` keeps it.
- The line under the control describes it through `aria-describedby`, so help and error messages are read with the control. The control's own `aria-describedby` is kept as well.
- An error marks the control invalid (`aria-invalid`) as well as turning it red. The message is an alert, so a screen reader reads it out as it appears, and the icons in the control and before the message make the error a shape as well as a color.
- A warning is a status: a screen reader reads it when it appears, once it has finished what it is saying, and reads it again with the control while it shows. It is announced only when its place was already on the page.
- Read-only keeps the control in the tab order, so its value can still be reached and read; disabled takes it out.
- The required mark is decorative; the control itself is marked required (the native attribute, or `aria-required` on the select).

### What you must do

- Always give a message with an error. Given `error` with no message, the field shows its help text as the message, which may not say what is wrong. The message should say what to change.
- Pass `null` for the warning while there is none, rather than leaving the prop out, so its place is on the page before the words arrive.
- Put any limit the reader must meet in the help text, so it is known before the first try. The help text comes before any error and is replaced by the message only when one is given.

### How to test

- With a screen reader, focus the control: it is read by its label, then its help or error, and as required where it is.
- Press the label with a pointer: focus moves to the control.
- Cause an error: the message is read as it appears and the control is read as invalid.
- With the colors removed, the error icons and the message still say something is wrong.
- Tab to a read-only control: it takes focus. A disabled one does not.
- With text at 200% and the page 320 pixels wide, the label, control and line stay whole.
- In a forced-color mode, the control, its icons and the message are still visible.

## Composition

Contains a label, exactly one control, and an optional line. The control is one of the system's form controls (an input, a text area, a select, a combobox, a search, number, password or color field, a date picker or a file upload), or a site's own component around one. The system's controls take their id, name, help, error, required, disabled and read-only state from the field around them, however deep inside the site's component they sit, so that component need not pass anything on. Any other child is handed them as props, so it must accept `error`, `required`, `disabled` and `readOnly`. Fields stack into forms; give a form of several fields the large stack step between them.

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

- [Input](../input/input.md), [Select](../select/select.md), [Text area](../text-area/text-area.md): the controls it holds.
- [Label](../label/label.md): the label it draws.
- [Field message](../field-message/field-message.md): the line under the control.
- [Field group](../field-group/field-group.md): several radios or checkboxes under one question.
- [Popover](../popover/popover.md): a field can sit in a popover's body.
