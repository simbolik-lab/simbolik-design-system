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

A small label that names a category, a topic or a keyword on the thing it sits on. It reads as metadata, which is what separates it from a badge (a state) and from a chip (a choice). A pressable tag opens something about what it names, such as a small card about a person or a place.

## Anatomy

- The block, a short rounded rectangle of fixed height, on the same scale as the badge and the chip. The default tone is a see-through gray with no edge, so it shows on any surface. A pressable tag is a button drawn the same.
- The icon part, an optional small glyph before the label.
- The leading content part, the page's own small picture in the icon's place, at the icon's size. An inline SVG or an image fills the icon's box, and any other element is held to it. A tag has the icon or the picture, not both.
- The label part, text in sentence case in the small label style.
- The remove part, an optional small cross control, inside a box large enough to press that adds no width.

## When to use

- Topics on an article or a card.
- Keywords a person has attached to something and may take off again.
- A row of things that each open a small card about themselves when pressed, such as the members of a team or the stops on a route.

## When not to use

- For status. Use a [badge](../badge/badge.md); the feedback tones here are for categories that happen to be colored, not for state.
- For a choice a person toggles, or a filter. Use a [chip](../chip/chip.md).
- For a press that goes to another page or does something. Use a [link](../link/link.md) or a [button](../button/button.md).

## Behavior

None of its own. The remove control, when present, calls back.

Given a press handler, the tag is a button, and as a popover's opener it gets one from the popover. It keeps its shape, height and type, and takes the pointer, a hover look, a pressed look that sinks in and a focus ring round it. A pressable tag is never removable: given both, it is drawn removable and warns in development, because its remove control would be a button inside a button.

On a touch screen the remove cross keeps its box, and a pressable tag keeps its size, each taking an invisible press area round it, out to the comfortable touch target.

## Accessibility
### What it does for you

- The label is read as text.
- The remove control is a real button. It is at least 24 by 24 pixels, the least a press needs, though its cross is small.
- The remove control's focus ring is drawn round the cross, and on a brand tag in the inverse focus color, so it shows on the fill.
- A pressable tag is a real button, named by its words, and its focus ring is drawn round the tag. As a popover's opener it says that it opens a dialog and whether that is open.
- The icon is decorative.
- On a touch screen the remove cross and a pressable tag each take an invisible press area round them, out to the comfortable touch target.

### What you must do

- Give the remove control an accessible name saying what it removes. Without one the wrapper warns in development and names it "Remove" and the tag's words.
- Hide a picture of your own that only repeats the tag's words (`aria-hidden="true"` on an SVG, an empty `alt` on an image). Give it words of its own when it says something the label does not.
- Never put a pressable tag inside a link or another button.

### How to test

- Tab to the remove control: the focus ring shows round the cross, on a brand tag too, in both themes and in a forced-color mode. Press Enter, then Space: each calls back.
- Tab to a pressable tag: the focus ring shows round it. Press Enter, then Space: each opens what it names.
- With a screen reader, the label is read as text and the remove control as a button by what it removes; a pressable tag is read as a button by its words.
- On a touch screen, a press just outside the cross still removes the tag, and a press just outside a pressable tag still presses it.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to a pressable tag, or to the remove control when the tag has one. Each pressable tag in a row is a stop of its own. |
| Enter or Space | Presses the pressable tag, or the remove control, which calls back. |

## Composition

Contains an icon or a picture of the page's own, a label and a remove control. Sits in a wrapping row on a card or under a heading. A pressable tag is the opener of a [popover](../popover/popover.md) that shows a small card about what it names.

## Usage rules

### Do

- Keep the label to one or two words, so the tag stays a glance.
- Make a tag pressable when a press opens something about what it names, such as a card about a person or a place.

### Don't

- Make a tag pressable to filter a list or choose an option. That is a chip.
- Make a tag both pressable and removable. Open what it names from the tag, and remove it somewhere else.

## Related

- [Badge](../badge/badge.md): status.
- [Chip](../chip/chip.md): a choice or a filter.
- [Popover](../popover/popover.md): the card a pressable tag opens.
