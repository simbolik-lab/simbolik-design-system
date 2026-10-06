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

## When to use

- Two to five choices that should all be read before choosing.

## When not to use

- More choices than fit comfortably. Use the select.
- Choices that switch something immediately with only two states. Use the switch or the segmented control.

## Behavior

Choosing fills the circle with the inverse action fill and shows the dot. Arrow keys move the choice within the group. Disabled grays the ring and, when chosen, fills it with the disabled surface.

## Accessibility

- Radios in one group share a name attribute; that is what makes arrow keys work and what assistive technology reads as a group.
- The group needs a group label: a fieldset with a legend, or a labeled group role.
- The label element gives each radio its name.

## Composition

Contains the control, the ring and the label. Always in a group of two or more, under a group label.

## Usage rules

### Do

- Pre-select the most common choice when there is one, so a group is never in a no-choice state that cannot be returned to.

### Don't

- Use a single radio. A lone radio cannot be un-chosen.

## Related

- Checkbox: independent choices.
- Segmented control: exclusive choices as a single control.
