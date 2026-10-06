---
name: switch
title: Switch
type: component
block: smbk-switch
adaptStrategy: css
figmaNodeId: 4086:11238
status: candidate
---

# Switch

## Purpose

An on-or-off setting that takes effect the moment it is flipped, like a light switch. The thumb's position says the state; the brand fill says it is on. A checkbox is for a choice saved later; a switch is for a change made now.

## Anatomy

- The block, a label element holding everything.
- The control part, the real checkbox with the switch role, visually hidden.
- The track part, the rounded channel whose fill and outline change with the state.
- The thumb part, the raised square that sits at one end or the other.
- The label part, the text.

## When to use

- Settings and preferences that apply immediately.
- Turning a feature on or off in a panel.

## When not to use

- Anything submitted with a form. Use a checkbox.
- Choosing between two named options. Use the segmented control, which shows both names.

## Behavior

Flipping slides the thumb to the other end with the state motion, the same in both directions, and swaps the track fill at once, so a theme change never fades it. Under reduced motion the thumb jumps. Disabled grays the track and the thumb and drops the thumb's lift.

## Accessibility

- The control carries the switch role, so it is announced as a switch with on and off, and Space flips it.
- The label element names it; the text is required.
- The focus ring draws around the track.
- State is shown by position and fill, not by color alone.

## Composition

Contains the control, the track with its thumb, and the label. Sits in a settings list or a toolbar.

## Usage rules

### Do

- Label the setting, not the action: "Notifications", not "Turn on notifications".

### Don't

- Ask for confirmation after a switch. If a change needs confirming, it is not a switch.

## Related

- Checkbox: a choice saved with a form.
- Theme switch: a switch between the two themes, drawn as a segmented control.
