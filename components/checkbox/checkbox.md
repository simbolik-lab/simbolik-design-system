---
name: checkbox
title: Checkbox
type: component
block: smbk-checkbox
adaptStrategy: css
figmaNodeId: 4068:10770
status: candidate
---

# Checkbox

## Purpose

A yes-or-no choice that stands on its own, or one of several that may all be chosen. The box shows the state; the label beside it says what is being chosen.

## Anatomy

- The block, a label element holding everything, so pressing the text toggles the box.
- The control part, the real checkbox, visually hidden but present for keyboard and assistive technology.
- The box part, the drawn square.
- The icon part, the tick, shown when checked.
- The label part, the text.

## When to use

- Agreeing to something.
- Choosing any number of items from a short list.
- Switching a setting that takes effect when the form is saved.

## When not to use

- One choice from several. Use radios.
- A setting that takes effect immediately. Use the switch.

## Behavior

Two looks: the default box is raised with a lift; the subtle box is sunken with the strong border and no lift, for dense places such as table rows. Both check the same way.

Pressing the box or the label toggles it. Checked fills the box with the inverse surface and shows the tick. Disabled grays both box and label.

The box part can also stand alone inside another control that carries the state itself, such as a dropdown item that ticks. A real checkbox cannot sit inside a button, so there the box is drawn ticked with its checked modifier (`smbk-checkbox__box--checked`) instead of by a checked input.

## Accessibility

- The real control carries the state and the keyboard behavior; Space toggles it.
- The label element is the accessible name, so the text is required.
- The focus ring draws around the box, not the whole row, so it reads at the control.
- An indeterminate state is not drawn yet; set it on the control and it is announced, but the box shows unchecked.

## Composition

Contains the control, the box and the label. Sits in a stack of checkboxes, in a form, in a list row.

## Usage rules

### Do

- Write labels as the thing being chosen, not as a question.
- Stack related checkboxes vertically under one group label.

### Don't

- Use a checkbox with no visible label and rely on an aria-label alone, except in a table row where the column header names it.

## Related

- Radio: one of several.
- Switch: immediate on or off.
