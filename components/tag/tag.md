---
name: tag
title: Tag
type: component
block: smbk-tag
adaptStrategy: css
figmaNodeId: 4088:12242
status: candidate
---

# Tag

## Purpose

A small uppercase label that names a category, a topic or a keyword on the thing it sits on. It reads as metadata, in the monospace label face, which is what separates it from a badge (a state) and from a chip (a choice).

## Anatomy

- The block, a short rounded rectangle of fixed height.
- The icon part, an optional small glyph before the label.
- The label part, uppercase text in the small label preset.
- The remove part, an optional small cross control.

## When to use

- Topics on an article or a card.
- Keywords a person has attached to something and may take off again.

## When not to use

- For status. Use a badge; the feedback schemes here are for categories that happen to be colored, not for state.
- For a choice a person toggles. Use a chip.

## Behavior

None of its own. The remove control, when present, calls back.

## Accessibility

The label is read as text. The remove control is a real button and needs an accessible name saying what it removes; the wrapper requires it. The icon is decorative.

## Composition

Contains an icon, a label and a remove control. Sits in a wrapping row on a card or under a heading.

## Usage rules

### Do

- Keep the label to one or two words; it is uppercase and monospace, and long text shouts.

### Don't

- Make the tag itself clickable. If a tag should filter, it is a chip.

## Related

- Badge: status.
- Chip: a choice.
