---
name: segmented-control
title: Segmented control
type: component
block: smbk-segmented
adaptStrategy: css
figmaNodeId: 4209:19853
status: candidate
---

# Segmented control

## Purpose

Two to five named choices side by side in one bar, exactly one of them chosen, taking effect at once: a view switch, a period picker, a unit toggle. It is a radio group that looks like a control rather than a list.

## Anatomy

- The block, the bar: drawn as the tabs' bar is, a canvas well with a hairline border at the large, medium or small control height, its items the smallest inset in from its edge and apart and as tall as the bar inside it. Its items are equal by default, each as wide as the widest, sharing any width the bar is given; or each hugs its words.
- The indicator part, first in the bar: the chosen item's raised surface as one piece, which slides from choice to choice. Drawn only once the wrapper has placed it.
- The item part, one per choice, holding a hidden radio, an optional icon and a label. The chosen item sits on the raised surface with a highlight edge: the indicator's, or its own where there is no indicator.
- The icon part and the label part inside each item.

## When to use

- Switching between views of the same content: day, week, month.
- A setting with a few named values that all fit in a row.

## When not to use

- More than five choices, or long labels. Use the select.
- Choices that are not exclusive. Use checkboxes or chips.
- Navigation between pages. Use tabs.

## Behavior

Choosing raises the chosen item and lowers the previous one: the raised surface slides from the old choice to the new one with the state motion, and the words change color with the feedback motion. Hover colors a label and its icon with the link hover text. Arrow keys move the choice; the change takes effect at once, whatever the motion. A change of size, or items growing as fonts load, moves the surface at once rather than sliding. Under reduced motion everything changes at once.

## Accessibility

- The bar carries the radio-group role and needs an accessible name; the wrapper requires one.
- Each item is a real radio in a label, so the group behaves as radios do for keyboard and assistive technology.
- The chosen state is shown by fill, edge and elevation as well as color.

## Composition

Contains items only. Sits in toolbars, card headers and settings rows.

## Usage rules

### Do

- Give every item roughly the same label length so the bar reads as one control.

### Don't

- Leave nothing chosen. A segmented control always has a current value.

## Related

- Radio: exclusive choices as a list.
- Tabs: navigation between panels.
- Theme switch: this control specialized for the theme.
