---
name: choice-card
title: Choice card
type: component
block: smbk-choice-card
adaptStrategy: css
figmaNodeId: 7105:1911
status: experimental
---

# Choice card

## Purpose

One choice drawn as a card: a title, a line under it, and the radio's circle or the checkbox's box. The whole card is the label of one real radio or checkbox, so it is picked by a press anywhere on it. It gives a few choices that each need explaining more room and a larger target than a radio row.

## Anatomy

- The block, the card: a label element holding everything, on the default surface with a hairline edge and a lift. It also carries the radio's or the checkbox's classes, which draw the mark.
- The mark, the radio's circle or the checkbox's box, on the title's first line. It always shows, so being picked is never told by color alone.
- The text part, the title over the line.
- The label part, the title.
- The description part, an optional line under the title.

## When to use

- Two to five choices that each need a line of explanation: a plan, a delivery speed, a look.
- With the checkbox mark, a few add-ons that can each be picked.

## When not to use

- Many choices, or short ones. Use [radios](../radio/radio.md), or the [select](../select/select.md).
- An answer that should be sent the moment it is pressed. Use [buttons](../button/button.md): arrow keys move the choice in a set of radios and would send every choice they pass.

## Behavior

Picking a card checks its control and draws the brand edge at the emphasis width, inside the card so it keeps its size, with the mark filled. Under the pointer the card lifts onto the raised surface; pressed, it sinks onto the sunken surface. With `error`, every card takes the danger edge, picked or not. Disabled, the card sits on the disabled surface with its words dimmed; a picked disabled card keeps its edge in the disabled border color.

The radio mark is the default; with the checkbox mark, several cards can be picked. Inside a field group a card takes the group's name, error and required state, and a radio card follows the chosen value when the group holds it.

## Accessibility

### What it does for you

- The control is a real radio or checkbox, named by the title and described by the line, so a screen reader says the title, radio or checkbox, picked or not, then the line.
- Radios in one group take one stop for the Tab key and the arrow keys move the choice; Space picks.
- The focus ring goes around the whole card.

### What you must do

- Put a set of cards in a field group, whose legend names it.

### How to test

- Tab to a set of radio cards: one stop takes focus, with the ring around the whole card in both themes and in a forced-color mode. Move with the arrow keys, then press Space to pick.
- With a screen reader, a card is read as its title, a radio or a checkbox, picked or not, then its line, and the set by its legend.
- With text at 200% and the page 320 pixels wide, the title and line wrap and the card stays whole.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the card. Radios in one group take one stop. |
| Up Arrow, Down Arrow, Left Arrow or Right Arrow | Moves the choice to the next or previous radio card in the group. |
| Space | Picks a radio card, or toggles a checkbox card. |

## Composition

Contains the mark, the title and an optional line. Stacks in a field group, one kind throughout.

## Usage rules

### Do

- Keep the title to a few words and the line to one sentence.
- Pre-select the most common choice when there is one.

### Don't

- Put buttons or links inside a card: a press anywhere picks it.
- Show more than about five cards in one group.

## Related

- [Field group](../field-group/field-group.md): the question over a set of cards.
- [Radio](../radio/radio.md), [Checkbox](../checkbox/checkbox.md): the controls a card is built on.
- [Card](../card/card.md): a container that is not a choice.
