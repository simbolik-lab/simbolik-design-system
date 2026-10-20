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
- The mixed-icon part, the dash, shown when the control is mixed.
- The label part, the text.
- The description part, an optional line under the label that says more about the choice. With it, the label and the line stack in the text part beside the box, which sits on the label's first line.

## When to use

- Agreeing to something.
- Choosing any number of items from a short list.
- Switching a setting that takes effect when the form is saved.

## When not to use

- One choice from several. Use [radios](../radio/radio.md).
- A setting that takes effect immediately. Use the [switch](../switch/switch.md).

## Behavior

Two tones: the default box is raised with a lift; the subtle box is sunken with the strong border and no lift, for dense places such as table rows. Both check the same way.

Pressing the box or the label toggles it. Checked fills the box with the inverse surface and shows the tick. Mixed, the control's indeterminate state, fills it the same way and shows a dash: use it on a box that stands for a list whose items are partly ticked. Pressing a mixed box ticks it, as the browser does. The React wrapper sets the mixed state from its `indeterminate` prop; in plain markup a script sets the control's property. Disabled grays both box and label.

Under the pointer, an empty box darkens its edge and a ticked or mixed one darkens its fill.

With `error`, an empty box takes the danger edge and a ticked or mixed one keeps its fill inside a danger ring, under the pointer too. The control carries `aria-invalid`. The color is not the message: say what is wrong in words beside it, as the field's error line does.

Two sizes: md, a 20 box, and sm, a 16 box, for dense places. At either size the whole row is at least 24 tall, so it is easy to press.

The box part can also stand alone inside another control that carries the state itself, such as a dropdown item that ticks. A real checkbox cannot sit inside a button, so there the box is drawn ticked with its checked modifier (`smbk-checkbox__box--checked`) instead of by a checked input.

On a touch screen a row with a real control keeps its height and takes an invisible press area out to the comfortable touch target; between options stacked one under another, or set side by side, it reaches only halfway into the gap, so each option stays one press.

## Accessibility

### What it does for you

- The real control carries the state and the keyboard behavior; Space toggles it.
- The label element is the accessible name.
- The focus ring draws around the box, not the whole row, so it reads at the control.
- The mixed state is announced as mixed, and the box shows the dash. The React wrapper's `indeterminate` sets the control's `indeterminate` property after each render.
- In error, the control is marked invalid.
- A line under the label is read after the checkbox's name, not as part of it.
- The tick and the dash are hidden from assistive technology; the control carries the state.

### What you must do

- Give it label text, which is required. Name a box with no words beside it, such as a table row's, with `aria-label` instead.
- In plain markup, set the mixed state by script, since no attribute sets it: it is the control's `indeterminate` property. The browser clears it at the next press, so work it out again from the list each time.
- Tie the words that say why to the control or to its group when it is in error.
- Put several checkboxes under one question in a field group, whose legend names them as a group.

### How to test

- Tab to the checkbox: the focus ring shows around the box, in both themes and in a forced-color mode. Press Space: it toggles.
- With a screen reader, it is read by its label as a checkbox, checked, not checked or mixed, then the line under the label. In error, it is read as invalid, with the reason.
- With a group, the legend is read with each checkbox.
- With text at 200% and the page 320 pixels wide, the label wraps and the box stays whole.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the checkbox. |
| Space | Toggles the checkbox. |

## Composition

Contains the control, the box and the label. Sits in a stack of checkboxes, in a form, in a list row.

## Usage rules

### Do

- Write labels as the thing being chosen, not as a question.
- Stack related checkboxes vertically under one group label.

### Don't

- Use a checkbox with no visible label and rely on an aria-label alone, except in a table row where the column header names it.
- Round the box into a circle or a capsule. Its corner is a control corner; a round mark reads as a radio.

## Related

- [Radio](../radio/radio.md): one of several.
- [Field group](../field-group/field-group.md): the question over several checkboxes.
- [Choice card](../choice-card/choice-card.md): one choice drawn as a card.
- [Switch](../switch/switch.md): immediate on or off.
