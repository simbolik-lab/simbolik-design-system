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

The text above or beside a form control that says what it is for, with the two marks a field label commonly needs: a required mark and an information icon that opens help. It exists so that every field in the system labels itself the same way. Its small type, the small label style, also names groups, such as the groups of the command palette.

## Anatomy

- The block, a real label element, or a span where there is no control to name.
- The text part.
- The required part, an asterisk in the danger text color, hidden from assistive technology because the control itself carries the required state.
- The icon part, an information glyph at the icon size that goes with its text, in the subtlest text color, with help text as its accessible name. Its help shows in a tooltip over it.

## When to use

- Above every input, select, search field, checkbox group and switch that has a visible name, in the default type.
- Over a group of items, in the small type, as the command palette does.

## When not to use

- As a heading. Use a heading preset.
- For a caption under a control. That is help text, which belongs to the field.

## Behavior

The icon's help shows in a tooltip over it while the pointer rests on the icon, and while the control the label names has the keyboard focus, so a reader who never points sees it too; it stays while pointed at and goes on Escape. Without the for attribute, only pointing shows it.

## Accessibility

### What it does for you

- Associated with its control, it names the control. It takes no focus itself.
- The asterisk is decorative, hidden from assistive technology.
- The information icon carries its help text as a name, so the help is reachable without a pointer. The tooltip showing the same words is hidden from assistive technology, so they are not read twice.
- The help shows in a tooltip while the control the label names has the keyboard focus, so a reader who never points sees it too. Escape dismisses it.

### What you must do

- Associate the label with its control, either by wrapping it or through the `for` attribute; the wrapper passes that attribute through. Without `for`, only pointing shows the help.
- Where there is no control, render the label as a span and point the group it names at it with `aria-labelledby`.
- Mark the control `required`: the control's `required` attribute is what assistive technology reads, not the asterisk.

### How to test

- With a screen reader, focus the control: it is read with the label's text, and with the help text when there is an information icon, which is read once.
- With the keyboard, Tab to the control the label names: the help shows in a tooltip, and Escape dismisses it.
- With a required field, check that the control itself is marked required, not only the label.
- With text at 200% and the page 320 pixels wide, the label's text stays whole beside its marks.
- In a forced-color mode, the label's text stays visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the control the label names, which shows the help when the label has an information icon. |
| Escape | Hides the help while the control keeps focus. |

## Composition

Contains text, a mark and an icon. Belongs to a form field.

## Usage rules

### Do

- Associate every label with exactly one control.
- Use the subtle tone for secondary fields in dense forms, the strong tone otherwise.
- Keep small labels to a word or two, so each reads as the name of what is under it.

### Don't

- Use the required mark without marking the control required.
- Put a link inside a label.

## Related

- [Input](../input/input.md), [select](../select/select.md), [search field](../search-field/search-field.md), [checkbox](../checkbox/checkbox.md), [radio](../radio/radio.md) and [switch](../switch/switch.md) take a label.
- [Tooltip](../tooltip/tooltip.md): shows the icon's help.
- [Command palette](../command-palette/command-palette.md): small labels over its groups, default ones as item categories.
