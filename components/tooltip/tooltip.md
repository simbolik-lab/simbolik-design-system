---
name: tooltip
title: Tooltip
type: component
block: smbk-tooltip
adaptStrategy: css
figmaNodeId: 4170:13949
status: candidate
---

# Tooltip

## Purpose

A small label that appears beside a control on hover or keyboard focus to say what it is or add a short explanation, and disappears when the pointer or focus moves on. It is the accessible name for icon-only controls made visible.

## Anatomy

- The block, positioned by the page beside its target.
- The bubble part, a small raised box holding one line of text.
- The arrow part, a small triangle on one edge, pointing at the target.

## When to use

- Naming an icon-only control.
- A short hint that would clutter the interface if always shown.

## When not to use

- Content that must be read to use the page. Put it on the page.
- Anything interactive. A tooltip cannot be clicked into.
- Long text. Use a popover.

## Behavior

The component draws the bubble and the arrow. Showing on hover and focus, hiding on escape, and positioning relative to the target are the page's until a shared positioning behavior exists; the arrow axis says which edge to draw it on. It fades in quickly when it appears and fades out the same way when the page hides it with the hidden attribute, without traveling; under reduced motion it appears and disappears at once.

A tooltip shown above its target takes a bottom arrow, so the arrow points down at the target. One shown below its target takes a top arrow.

## Accessibility

- The bubble carries the tooltip role and an id the target references with aria-describedby, so its text is read with the control.
- It must show on keyboard focus as well as hover, and hide on Escape.
- It never contains focusable content.

## Composition

Contains text only. Rendered next to its target, on the raised layer.

## Usage rules

### Do

- Keep it to a few words.

### Don't

- Repeat the visible label of the control in the tooltip.

## Related

- Label: uses a tooltip for its help icon.
