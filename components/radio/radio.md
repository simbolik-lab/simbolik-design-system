---
name: radio
title: Radio
type: component
block: smbk-radio
adaptStrategy: css
figmaNodeId: 4086:11110
status: candidate
---

# Radio

## Purpose

One choice out of a small set, all of which are visible. Choosing one un-chooses the others in its group. That exclusivity is what separates it from a checkbox.

## Anatomy

- The block, a label element holding everything.
- The control part, the real radio, visually hidden.
- The circle part, the drawn ring.
- The dot part, the filled center when chosen.
- The label part, the text.
- The description part, an optional line under the label that says more about the choice. With it, the label and the line stack in the text part beside the circle, which sits on the label's first line.

## When to use

- Two to five choices that should all be read before choosing.

## When not to use

- More choices than fit comfortably. Use the [select](../select/select.md).
- Choices that switch something immediately with only two states. Use the [switch](../switch/switch.md) or the [segmented control](../segmented-control/segmented-control.md).

## Behavior

Choosing fills the circle with the inverse action fill and shows the dot. Arrow keys move the choice within the group. When the field group holds the chosen value, a radio is checked when its own `value` is the group's, and choosing it tells the group; each radio then needs a `value`. Disabled grays the ring and, when chosen, fills it with the disabled foreground, so a disabled choice still shows which one it is.

Under the pointer, an empty ring darkens its edge and a chosen one darkens its fill.

With `error`, an empty ring takes the danger edge and a chosen one keeps its fill inside a danger ring, under the pointer too. The control carries `aria-invalid`. Give every radio of the group the flag, and say what is wrong in words beside the group.

Two sizes: md, a 20 ring, and sm, a 16 ring. At either size the whole row is at least 24 tall.

On a touch screen each option's row keeps its height and takes an invisible press area out to the comfortable touch target; between options stacked one under another, or set side by side, it reaches only halfway into the gap, so each option stays one press.

## Accessibility

### What it does for you

- Each radio is a native radio input, so arrow keys move the choice within its group.
- The label element gives each radio its name, and a line under the label is read after the radio's name, not as part of it.
- In error, each control is marked invalid with `aria-invalid`.
- The ring and the dot do not rely on color alone: a chosen radio shows its dot, and a disabled one still shows which is chosen.
- In a forced-color mode, a chosen radio is filled with the highlight color and its dot is drawn in the highlight's text color.
- On a touch screen each option's row takes an invisible press area out to the comfortable touch target, reaching only halfway into the gap between options, so each stays one press.

### What you must do

- Give radios in one group a shared name attribute; that is what makes arrow keys work and what assistive technology reads as a group.
- Give the group a group label: put the radios in a field group, a fieldset whose legend names the group, which also gives them their shared name.
- Tie the words that say why a group is in error to the group.

### How to test

- Tab to the group: focus lands on the chosen radio, or the first one when none is chosen. The arrow keys move and choose within the group, and Tab leaves it.
- With a screen reader, the group is read by its legend, each radio by its label, with its place in the group and whether it is chosen.
- With text at 200% and the page 320 pixels wide, each label wraps and its row stays at least 24 tall.
- In a forced-color mode, the chosen radio is still told from the others.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus into the group, to the chosen radio or the first, and out of it. |
| Down Arrow or Right Arrow | Moves to the next radio in the group and chooses it. |
| Up Arrow or Left Arrow | Moves to the previous radio in the group and chooses it. |
| Space | Chooses the focused radio. |

## Composition

Contains the control, the ring and the label. Always in a group of two or more, under a group label.

## Usage rules

### Do

- Pre-select the most common choice when there is one, so a group is never in a no-choice state that cannot be returned to.

### Don't

- Use a single radio. A lone radio cannot be un-chosen.

## Related

- [Checkbox](../checkbox/checkbox.md): independent choices.
- [Field group](../field-group/field-group.md): the question over a group of radios.
- [Choice card](../choice-card/choice-card.md): one choice drawn as a card.
- [Segmented control](../segmented-control/segmented-control.md): exclusive choices as a single control.
