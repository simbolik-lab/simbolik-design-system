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

- The block, a pill that fixes its height by size. The soft look and the two neutral types draw a thin edge round it: a soft feedback badge in its type's own border color, the default type in the highlight edge color, the sunken type in the subtle border color. A flat or dot feedback badge has none, and neither has a dot of the default type.
- The label part, the text.
- The icon part, before or after the label. Optional.
- The dot look has no parts at all: it is a small filled circle.

## When to use

- A status word on a row, a card or a heading.
- A count on a navigation item.
- A dot beside an avatar or an icon to say "something here", where the color is backed by a label elsewhere.

## When not to use

- For something a person can press or dismiss. Use a chip or a tag.
- For a category that is not a state. Use a tag.
- As the only carrier of meaning by color. Give it a text or shape cue as well (WCAG 1.4.1 Use of Color).

## Behavior

None. It renders and stays put.

## Accessibility

A labeled badge is read as its text. A dot badge has no visible text, so the wrapper gives it an image role and needs a name; without one it is decorative and silent. The text of both looks on its surface, soft and flat, is measured on the color foundation's Contrast section, in both themes; a pair that falls short there is corrected in Figma, not here.

## Composition

Contains a label and up to two icons. Sits inline beside text, in a card header, in a navigation item.

## Usage rules

### Do

- Keep the label to a word or a number.
- Use the soft look, the default, for status almost everywhere; it stays quiet in dense lists. Use the flat look when the status should stand out.

### Don't

- Put a badge inside a button. The button's own label is the place for its state.
- Use the sunken type on a sunken surface; it disappears.

## Related

- Tag: a category label, removable.
- Chip: a selectable token.
