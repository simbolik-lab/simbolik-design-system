---
name: chip
title: Chip
type: component
block: smbk-chip
adaptStrategy: css
figmaNodeId: 4253:1311
status: candidate
---

# Chip

## Purpose

A small capsule that stands for one choice in a set — a filter, a category, a person — and can be pressed to select it or removed from the set. It is interactive, which is what separates it from a badge, and it is one of many, which is what separates it from a button.

## Anatomy

- The block, a capsule with a hairline border and a fixed height by size.
- The avatar part, an optional small avatar before the label, dimmed when the chip is disabled.
- The label part, the text, carrying its own horizontal inset.
- The remove part, an optional small control with a circled cross that removes the chip.

## When to use

- Filters a person switches on and off.
- People or items chosen into a field, each removable.
- A row of categories where one or several may be selected.

- A short row of related places, such as a site's services, drawn as chips: each chip is then a link.

## When not to use

- For a single action. Use a button.
- For an inert status word. Use a badge or a tag.

## Behavior

A selectable chip toggles between unselected and selected when pressed; hover and pressed lift it with the first elevation level on the filled tones. A removable chip does not toggle; its remove control calls back and the page takes it out of the set.

A chip given an address is a link: pressing it goes there. It is never selected and never removable.

Whether a chip is a toggle is decided by the `selected` prop being given at all. A filter or choice chip is always given it, true when chosen and false when not. A chip that only acts, such as a suggestion, leaves it out.

In markup, a link chip is an `a` element carrying the same classes, so it looks the same and has the same hover and focus. The React wrapper's types refuse `selected` and `onRemove` on a chip given an address.

## Accessibility

- A selectable chip is a real button with a pressed state exposed to assistive technology. Given `selected` as true or false, the wrapper marks it pressed or not pressed, so a screen reader says it is a toggle and whether it is on even while it is off. Left out, the chip says neither, which is right for a chip that only acts and wrong for a filter.
- The page does not set the pressed state itself; the wrapper derives it from `selected`.
- A removable chip is plain text plus a real remove button, which must be given an accessible name that says what is removed; the wrapper requires it.
- Never both at once: a chip that toggles and removes would need a button inside a button.
- A chip given an address is a real link and is announced as one. Put a row of them in a navigation landmark or a named group so the row says what its places are.
- The focus ring is the system rule, on the chip or on the remove control, whichever has focus.

## Composition

Contains an optional avatar, a label and an optional remove control. Sits in a row that wraps, or inside a field's value area.

## Usage rules

### Do

- Keep labels short; a chip that wraps is a card.
- Use the small size only where the row is dense and the chips are many.
- Give every chip in a filter row its selected state, on or off, so each one says it is a toggle.

### Don't

- Color chips by category with the tones. Tones are emphasis, not meaning.
- Put an icon-only chip on a page. A chip is text.

## Related

- Badge: inert status.
- Tag: a category label with a remove control, not selectable.
- Avatar: what the chip may carry.
