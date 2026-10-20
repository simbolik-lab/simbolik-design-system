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

A small label that names a category, a topic or a keyword on the thing it sits on. It reads as metadata, which is what separates it from a badge (a state) and from a chip (a choice).

## Anatomy

- The block, a short rounded rectangle of fixed height, on the same scale as the badge and the chip. The default tone is a see-through gray with no edge, so it shows on any surface.
- The icon part, an optional small glyph before the label.
- The label part, text in sentence case in the small label style.
- The remove part, an optional small cross control, inside a box large enough to press that adds no width.

## When to use

- Topics on an article or a card.
- Keywords a person has attached to something and may take off again.

## When not to use

- For status. Use a [badge](../badge/badge.md); the feedback tones here are for categories that happen to be colored, not for state.
- For a choice a person toggles. Use a [chip](../chip/chip.md).

## Behavior

None of its own. The remove control, when present, calls back.

On a touch screen the remove cross keeps its box and takes an invisible press area round it, out to the comfortable touch target.

## Accessibility
### What it does for you

- The label is read as text.
- The remove control is a real button. It is at least 24 by 24 pixels, the least a press needs, though its cross is small.
- The remove control's focus ring is drawn round the cross, and on a brand tag in the inverse focus color, so it shows on the fill.
- The icon is decorative.
- On a touch screen the remove cross keeps its box and takes an invisible press area round it, out to the comfortable touch target.

### What you must do

- Give the remove control an accessible name saying what it removes. Without one the wrapper warns in development and names it "Remove" and the tag's words.

### How to test

- Tab to the remove control: the focus ring shows round the cross, on a brand tag too, in both themes and in a forced-color mode. Press Enter, then Space: each calls back.
- With a screen reader, the label is read as text and the remove control as a button by what it removes.
- On a touch screen, a press just outside the cross still removes the tag.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the remove control, when the tag has one. |
| Enter or Space | Presses the remove control, which calls back. |

## Composition

Contains an icon, a label and a remove control. Sits in a wrapping row on a card or under a heading.

## Usage rules

### Do

- Keep the label to one or two words, so the tag stays a glance.

### Don't

- Make the tag itself clickable. If a tag should filter, it is a chip.

## Related

- [Badge](../badge/badge.md): status.
- [Chip](../chip/chip.md): a choice.
