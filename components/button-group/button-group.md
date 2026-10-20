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

Several buttons that belong together, presented as one control. Kept apart, they are simply a row with the right gap that wraps when it runs out of room. Segmented, they fuse into one bar with shared edges and hairline dividers, which is how a set of mutually exclusive choices reads as a single thing.

## Anatomy

The block is the container. Its children are buttons, unchanged; the group squares their inner corners, rounds the bar's outer corners, and draws the divider between neighbors. The outline tone draws the bar's border itself, so the buttons inside use the ghost tone.

A button that opens more options is a dropdown whose opener is that button, placed in the group where the button would stand. The dropdown holds its opener and its panel together, and the group passes its corners, its divider and its edge on to the opener, so it looks like any other button in the bar while the dropdown does the menu's keyboard and focus work.

## When to use

- A small set of exclusive choices where a segmented control would be too small.
- A row of actions that must stay together on a narrow page: the default type wraps onto a second line rather than running off the edge.
- Two or three related actions of equal weight, kept apart with the default type.

## When not to use

- For a main action with a menu of related ones. Use the [split button](../split-button/split-button.md).
- For a single toggle between views. Use the [segmented control](../segmented-control/segmented-control.md).
- For unrelated actions that happen to sit side by side. Give them their own spacing.

## Behavior

None of its own. Each button behaves as a button. The group is a layout and a shared edge.

The default type, in a row, never grows wider than the space it is given: when its buttons do not fit on one line, the next ones wrap onto a second line, with a small gap between the lines. A segmented bar and a vertical group stay as they are.

## Accessibility

### What it does for you

- The container carries the group role, and the wrapper requires an accessible name for it.
- Focus moves through the buttons in order.
- Because the fused bar hides the buttons' own borders, focus rings are what separates the focused button from its neighbors. They are never suppressed, and a focused button sits above its neighbors so the shared edge never covers its ring.

### What you must do

- Give the group an accessible name that says what the group is for.

### How to test

- Tab through the group: focus moves from button to button in order, and each focus ring shows whole, in both themes and in a forced-color mode.
- Press Enter, then Space on a button: each runs its action once.
- With a screen reader, the group is read by its name, and each button by its label.
- With text at 200% and the page 320 pixels wide, the labels stay whole.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the next button in the group. |
| Shift + Tab | Moves focus to the previous button. |
| Enter or Space | Presses the focused button. |

## Composition

Contains buttons only, all of one size and, in a fused bar, of one tone matching the group's. May sit anywhere a button may.

## Usage rules

### Do

- Give every button in a fused bar the same size as the group.
- Use ghost buttons inside an outline group; the group draws the border.

### Don't

- Mix tones inside a segmented bar. The dividers are tuned to one fill.
- Build a main action with a menu from a segmented bar and a dropdown. Use the split button.
- Put a link styled as a button next to real buttons in a fused bar without checking focus order.

## Related

- [Button](../button/button.md): what goes inside.
- [Segmented control](../segmented-control/segmented-control.md): exclusive choices as a single switch.
- [Split button](../split-button/split-button.md): a main action with a menu of related ones, built on the segmented bar.
