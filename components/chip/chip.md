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

- The block, a capsule of fixed height by size, on the same scale as the badge and the tag. The default tone is a see-through gray with no edge, so it shows on any surface; the others draw a hairline edge.
- The tick part, a check mark before the label of a selected toggle chip, in the avatar's place.
- The avatar part, an optional small avatar before the label, dimmed when the chip is disabled.
- The label part, the text, carrying its own horizontal inset.
- The remove part, an optional small control with a circled cross that removes the chip, inside a box large enough to press.

A toggle chip that is on is drawn from its pressed attribute, as the toggle button is; the selected modifier draws the same, for markup that sets it.

## When to use

- Filters a person switches on and off.
- People or items chosen into a field, each removable.
- A row of categories where one or several may be selected.

- A short row of related places, such as a site's services, drawn as chips: each chip is then a link.

## When not to use

- For a single action. Use a [button](../button/button.md).
- For an inert status word. Use a [badge](../badge/badge.md) or a [tag](../tag/tag.md).

## Behavior

A selectable chip toggles between unselected and selected when pressed. Hovered, the brand and inverse tones lift with the first elevation level and the default tone darkens; pressed and selected, every tone sinks in and the selected chip shows a tick before its label, so the choice shows by more than color. A removable chip does not toggle; its remove control calls back and the page takes it out of the set.

A chip given an address is a link: pressing it goes there. It is never selected and never removable.

Whether a chip is a toggle is decided by the `selected` prop being given at all. A filter or choice chip is always given it, true when chosen and false when not. A chip that only acts, such as a suggestion, leaves it out.

A toggle chip carries its tick whether it is on or off, and shows it while it is pressed, so a page built ahead of time can press a chip with a script of its own, setting `aria-pressed` alone, and get the same tick as when React turns it on.

In markup, a link chip is an `a` element carrying the same classes, so it looks the same and has the same hover and focus. The React wrapper's types refuse `selected` and `onRemove` on a chip given an address.

On a touch screen a chip that is pressed, and a remove cross, keep their size and take an invisible press area round them, out to the comfortable touch target; a removable chip takes the press on its cross alone. Where chips stand closer, as in a filter bar or a combobox, each area stops halfway to the next.

## Accessibility

### What it does for you

- A selectable chip is a real button with a pressed state exposed to assistive technology. Given `selected` as true or false, the wrapper marks it pressed or not pressed, so a screen reader says it is a toggle and whether it is on even while it is off.
- The wrapper derives the pressed state from `selected`; a page rendered by React does not set it itself. A page's own script that presses a chip sets `aria-pressed`, and the tick follows it.
- A removable chip is plain text plus a real remove button, which the wrapper requires an accessible name for. The button is at least 24 by 24 pixels, the least a press needs, however small its cross.
- A chip given an address is a real link and is announced as one.
- The focus ring is the system rule on the chip. On the remove control it is drawn round the cross itself; on a brand or inverse chip it takes the chip's own text color, so it shows on the fill.

### What you must do

- Leave `selected` out for a chip that only acts: it then says neither pressed nor not pressed. Give it for a filter, which must say whether it is on.
- Give a removable chip's remove button an accessible name that says what is removed.
- Never make a chip both toggle and remove: that would need a button inside a button.
- Put a row of chips that are links in a navigation landmark or a named group, so the row says what its places are.

### How to test

- Tab to a chip: the focus ring shows in both themes and in a forced-color mode, round the cross on a remove button. Press Enter, then Space: each toggles or acts once.
- With a screen reader, a selectable chip is read as a toggle button, on or off, a link chip as a link, and a remove button by what it removes.
- On a touch screen, the remove cross is easy to hit.
- With text at 200% and the page 320 pixels wide, the label stays whole.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the chip, then to its remove button when it has one. |
| Enter | Presses the chip or its remove button, or follows the chip when it is a link. |
| Space | Presses the chip or its remove button. A chip that is a link is not followed by Space. |

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

- [Badge](../badge/badge.md): inert status.
- [Tag](../tag/tag.md): a category label with a remove control, not selectable.
- [Avatar](../avatar/avatar.md): what the chip may carry.
