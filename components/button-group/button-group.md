---
name: button-group
title: Button group
type: component
block: smbk-btn-group
adaptStrategy: css
figmaNodeId: 4163:5325
status: candidate
---

# Button group

## Purpose

Several buttons that belong together, presented as one control. Kept apart, they are simply a row with the right gap. Merged or segmented, they fuse into one bar with shared edges and hairline dividers, which is how a split action or a set of mutually exclusive choices reads as a single thing.

## Anatomy

The block is the container. Its children are buttons, unchanged; the group squares their inner corners, rounds the bar's outer corners, and draws the divider between neighbors. The outline tone draws the bar's border itself, so the buttons inside use the ghost tone.

A button that opens more options is a dropdown whose opener is that button, placed in the group where the button would stand. The dropdown holds its opener and its panel together, and the group passes its corners, its divider and its edge on to the opener, so it looks like any other button in the bar while the dropdown does the menu's keyboard and focus work.

## When to use

- A split action: a main button and an icon-only button that opens more options, merged.
- A small set of exclusive choices where a segmented control would be too small.
- Two or three related actions of equal weight, kept apart with the default type.

## When not to use

- For a single toggle between views. Use the segmented control.
- For unrelated actions that happen to sit side by side. Give them their own spacing.

## Behavior

None of its own. Each button behaves as a button. The group is a layout and a shared edge.

## Accessibility

The container carries the group role and needs an accessible name that says what the group is for; the wrapper requires one. Focus moves through the buttons in order. Because the fused bar hides the buttons' own borders, focus rings are what separates the focused button from its neighbors; they are never suppressed.

## Composition

Contains buttons only, all of one size and, in a fused bar, of one tone matching the group's. May sit anywhere a button may.

## Usage rules

### Do

- Give every button in a fused bar the same size as the group.
- Use ghost buttons inside an outline group; the group draws the border.

### Don't

- Mix tones inside a merged or segmented bar. The dividers are tuned to one fill.
- Put a link styled as a button next to real buttons in a fused bar without checking focus order.

## Related

- Button: what goes inside.
- Segmented control: exclusive choices as a single switch.
