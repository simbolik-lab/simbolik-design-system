---
name: label
title: Label
type: component
block: smbk-label
adaptStrategy: css
figmaNodeId: 4255:6252
status: candidate
---

# Label

## Purpose

The text above or beside a form control that says what it is for, with the two marks a field label commonly needs: a required mark and an information icon that opens help. It exists so that every field in the system labels itself the same way. Its mono type, small capitals in the mono face, also names groups, such as the groups of the command palette.

## Anatomy

- The block, a real label element, or a span where there is no control to name.
- The text part.
- The required part, an asterisk in the danger text color, hidden from assistive technology because the control itself carries the required state.
- The icon part, a small information glyph with help text as its accessible name.

## When to use

- Above every input, select, search field, checkbox group and switch that has a visible name, in the default type.
- Over a group of items, in the mono type, as the command palette does.

## When not to use

- As a heading. Use a heading preset.
- For a caption under a control. That is help text, which belongs to the field.

## Behavior

None of its own. The icon's help text is its accessible name; the icon does not open a tooltip.

## Accessibility

The label must be associated with its control, either by wrapping it or through the for attribute; the wrapper passes that attribute through. Where there is no control, render it as a span and point the group it names at it with aria-labelledby. The asterisk is decorative: the control's required attribute is what assistive technology reads. The information icon carries its help text as a name so the help is reachable without a pointer.

## Composition

Contains text, a mark and an icon. Belongs to a form field.

## Usage rules

### Do

- Associate every label with exactly one control.
- Use the subtle tone for secondary fields in dense forms, the strong tone otherwise.
- Keep mono labels to a word or two; capitals in the mono face read slowly.

### Don't

- Use the required mark without marking the control required.
- Put a link inside a label.

## Related

- Input, select, search field, checkbox, radio and switch take a label.
- Tooltip, once built, is what the icon opens.
- Command palette: mono labels over its groups, default ones as item categories.
