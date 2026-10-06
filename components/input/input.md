---
name: input
title: Input
type: component
block: smbk-input
adaptStrategy: css
figmaNodeId: 4212:26450
status: candidate
---

# Input

## Purpose

A single-line text field. It is drawn as a shallow well pressed into the surface, with the field's chrome — border, focus color, icons — on a wrapper around the native control, so the control itself stays a plain text box that behaves like every other one in the browser.

## Anatomy

- The block, the well: sunken surface, hairline highlight edge, inset shadow, fixed height by size.
- The control part, the native text control, chromeless.
- The icon part, before or after the control. Optional. Figma hides the leading one by default and draws the trailing one a size smaller.

## When to use

Any short free-text value: a name, an email, a number, a search term when the search field's own clear control is not wanted.

## When not to use

- Long text. Use the text area.
- A choice from a list. Use the select.
- Searching a list on the page. Use the search field, which has the clear control.

## Behavior

Hover lifts the well to the raised surface. Focus draws the field focus color on the border, and nothing outside it: a field shows focus by its border alone, by design, with no ring. The error flag draws the danger border and marks the control invalid. A disabled control grays the well and drops its edge and shadow.

The disabled look follows the native disabled attribute on the control, so there is no disabled class to set.

A ref given to the wrapper reaches the native control, not the well, so a page can focus it, for example after a form is sent with the field empty. The text area and the search field do the same.

## Accessibility

- Every input needs a label: the label component, associated by the for attribute, or an aria-label when the design hides it.
- The error flag sets aria-invalid on the control; the message explaining the error must be linked with aria-describedby by the form that shows it.
- Icons are decorative. A trailing icon that does something is a button and belongs in the search field pattern, not here.
- Placeholder text is not a label: it disappears when typing starts.

## Composition

Contains the control and up to two icons. Belongs to a field with a label and, optionally, a description and an error message.

The search field, the select and the text area are built on it: their markup carries the input's classes, so a change to the input's look changes theirs. Figma builds the select on an Input instance and draws the search field and the text area with the input's own bindings.

## Usage rules

### Do

- Set the input type that matches the value, so the right keyboard appears.
- Use the small size only in dense tables and toolbars.

### Don't

- Set a width on the control. Set it on the well, or let the field decide.
- Use placeholder text as the only label.

## Related

- Search field: built on the input, for filtering, with a clear control and a key hint.
- Select: built on the input, a choice from a list.
- Text area: built on the input, several lines.
- Field: the label and help text around it.
- Label: the field's name.
