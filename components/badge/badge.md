---
name: badge
title: Badge
type: component
block: smbk-badge
adaptStrategy: css
figmaNodeId: 4126:20020
status: candidate
---

# Badge

## Purpose

A small, inert marker that states a status or a count beside the thing it describes: published, three unread, warning. It is not pressed and not removed, which is what separates it from a chip and a tag.

## Anatomy

- The block, a pill that fixes its height by size, on the same scale as the chip and the tag. The default tone is a see-through gray with no edge, so it shows on any surface. A soft feedback badge draws a thin edge in its tone's own border color; a flat badge has none.
- The label part, the text, in the label style. Numbers take equal-width digits, so a count that changes does not shift what is beside it.
- The icon part, before or after the label. Optional.

## When to use

- A status word on a row, a card or a heading.
- A count on a navigation item.

## When not to use

- For something a person can press or dismiss. Use a [chip](../chip/chip.md) or a [tag](../tag/tag.md).
- For a category that is not a state. Use a tag.
- For a dot that marks a status beside a name. Use the [status dot](../status-dot/status-dot.md).
- As the only carrier of meaning by color. Give it a text or shape cue as well (WCAG 1.4.1 Use of Color).

## Behavior

None. It renders and stays put.

## Accessibility

### What it does for you

- A labeled badge is read as its text.
- The text of both looks on its surface, soft and flat, is measured on the color foundation's Contrast section, in both themes. A pair that falls short there is corrected in Figma, not here.

### What you must do

- Say the status in the badge's words, or beside it with an icon, so it never rests on color alone.

### How to test

- With a screen reader, the badge is read as its text.
- Tab past it: a badge takes no focus.

## Composition

Contains a label and up to two icons. Sits inline beside text, in a card header, in a navigation item.

## Usage rules

### Do

- Keep the label to a word or a number.
- Use the soft look, the default, for status almost everywhere; it stays quiet in dense lists. Use the flat look when the status should stand out.

### Don't

- Put a badge inside a button. The button's own label is the place for its state.
- Rely on the tone's color alone; say the status in words.

## Related

- [Tag](../tag/tag.md): a category label, removable.
- [Chip](../chip/chip.md): a selectable token.
- [Status dot](../status-dot/status-dot.md): a small dot in a status color, with the status in words beside it.
