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
- The icon part, before or after the control. Optional. Both are the same size, the one that goes with the field's size.
- The error icon part, a warning sign after the value, shown only in error.
- The leading content part, after the leading icon and before the value: a swatch, a unit, an avatar. Optional, and drawn only when given, so an empty one takes no room.
- The trailing action part, last: an action on the value, such as a small ghost button to copy it. Optional, and drawn only when given.

## When to use

Any short free-text value: a name, an email, a number that is really a name such as a phone number or a postcode, a search term when the search field's own clear control is not wanted.

## When not to use

- Long text. Use the [text area](../text-area/text-area.md).
- A choice from a list. Use the [select](../select/select.md).
- Searching a list on the page. Use the [search field](../search-field/search-field.md), which has the clear control.
- A password. Use the [password field](../password-field/password-field.md), which can show what was typed.
- A quantity or a measure with limits and a step. Use the [number field](../number-field/number-field.md).

## Behavior

Hover lifts the well to the raised surface. Focus draws the field focus color on the border, and nothing outside it: a field shows focus by its border alone, by design, with no ring. The error flag draws the danger border, which stays while the field has focus, adds the warning icon after the value, and marks the control invalid, so an error is a shape as well as a color. A read-only field sits flat on the page's surface with a faint edge and no shadow, and does not lift on hover; its value can be selected and copied, and it stays in the tab order. A disabled control grays the well and drops its edge and shadow.

The read-only and disabled looks follow the native readonly and disabled attributes on the control, so there is no class to set for either.

There are three sizes, lg, md and sm, 48, 40 and 32 tall. The large size keeps the medium text and icons on a taller field with more room at its sides, for a sign-in or search form that sits beside large buttons. The small size's text is 14 px from tablet width up and 16 px on a phone, so a phone's browser never zooms into the field when it takes focus. Every size fills the width of its space; a clear cross for the value goes in the trailing action.

What sits in the leading content and the trailing action is the page's: a button there keeps its own size and draws its own focus ring, and the well keeps its focus edge while focus is anywhere inside it.

A ref given to the wrapper reaches the native control, not the well, so a page can focus it, for example after a form is sent with the field empty. The text area and the search field do the same.

On a touch screen the field keeps its height, and the value's box reaches out to the comfortable touch target above and below its line, so a press anywhere across the well, or just past it, lands in the field. A button inside the well takes its own press area, reaching only halfway toward the value.

## Accessibility

### What it does for you

- It is a native text control inside a well, so typing, selecting and copying work as in any text field.
- The error flag sets `aria-invalid` on the control. The warning icon is decorative.
- A control (or the well itself) marked `aria-invalid="true"` draws the danger edge without the error class, so markup written by hand, or a page that marks its own errors, gets the error look; add the warning icon to the markup yourself. The checkbox, radio, choice card and file upload do the same.
- A read-only field keeps its value selectable and copyable and stays in the tab order.
- In development, an input on the page with no name logs a warning in the console.
- Icons are decorative.
- A button in the trailing action keeps its own size and focus ring, and is its own stop for the Tab key, after the control.
- On a touch screen the value's box reaches out to the comfortable touch target above and below its line, so a press across the well, or just past it, lands in the field.

### What you must do

- Give every input a label: the label component, associated by the `for` attribute, or an `aria-label` when the design hides it.
- Link the message that explains an error to the control with `aria-describedby`, from the form that shows it. The field component does this and sets the flag too.
- Use `readonly`, not `disabled`, for a value the reader may need to read or copy: a disabled control is skipped by Tab and often not read out.
- Give a button in the trailing action its own accessible name, such as "Copy the invite link".
- Say in the label too whatever the leading content tells the reader, since the leading content is not part of the field's name.
- Do not use placeholder text as a label: it disappears when typing starts.

### How to test

- Tab to it: the field's border changes to the focus color. With a trailing action, Tab again reaches the button, which shows its own focus ring.
- With a screen reader, the field is read with its label. In error, it is read as invalid, with the message as its description.
- A read-only field can be reached with Tab and its value copied. A disabled one is skipped.
- With text at 200% and the page 320 pixels wide, the value and the label stay readable.
- In a forced-color mode, the focus border and the text stay visible.
- On a touch screen, pressing just above or below the value's line puts the cursor in the field.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus into the control, then to a button in the trailing action. A disabled control is skipped; a read-only one is not. |
| Shift + Tab | Moves focus back the same way. |

## Composition

Contains the control, up to two icons, and optionally leading content and a trailing action. Belongs to a field with a label and, optionally, a description and an error message.

The search field, the select and the text area are built on it: their markup carries the input's classes, so a change to the input's look changes theirs. Figma builds the select on an Input instance and draws the search field and the text area with the input's own bindings.

## Usage rules

### Do

- Set the input type that matches the value, so the right keyboard appears.
- Use the small size only in dense tables and toolbars.
- Use the large size only beside large buttons, so a form's controls stand the same height.

### Don't

- Set a width on the control. Set it on the well, or let the field decide.
- Use placeholder text as the only label.

## Related

- [Search field](../search-field/search-field.md): built on the input, for filtering, with a clear control and a key hint.
- [Select](../select/select.md): built on the input, a choice from a list.
- [Text area](../text-area/text-area.md): built on the input, several lines.
- [Field](../field/field.md): the label and help text around it.
- [Label](../label/label.md): the field's name.
