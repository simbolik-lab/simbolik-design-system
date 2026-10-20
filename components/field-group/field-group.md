---
name: field-group
title: Field group
type: component
block: smbk-field-group
adaptStrategy: css
figmaNodeId: 7101:469
status: experimental
---

# Field group

## Purpose

Several radios, checkboxes or choice cards under one question. It is a fieldset whose legend asks the question, so a screen reader names the group before its first choice, with help under the question and one error message for the whole group. It is to a set of choices what the field is to one control.

## Anatomy

- The block, a fieldset with no edge of its own.
- The legend part, the question: the label component in its strong tone, with the required mark when an answer is needed.
- The description part, optional help under the question: a field message of the help type.
- The options part, the choices: two to five radios, checkboxes or choice cards, all of one kind.
- The option part, given to each radio or checkbox in the group: its label a step larger than a lone control's, its mark a wider step away, and an optional line under the label.
- The message part, in error, under the options: a field message of the error type.

## When to use

- One question answered by picking one of a few choices (radios) or any of them (checkboxes).
- A few choices that each need a line of explanation, as choice cards.

## When not to use

- A single control. Use the [field](../field/field.md).
- More than about five choices. Use the [select](../select/select.md).
- A choice that takes effect at once with two states. Use the [switch](../switch/switch.md) or the [segmented control](../segmented-control/segmented-control.md).

## Behavior

The radios, checkboxes and choice cards inside take the group's name, its error and its required state, so each is written once, on the group. The radios share one name, the page's or one the group makes, so they act as one choice.

The group can hold which radio is chosen, as a select holds its option. Give it `value` and follow it with `onChange`, which is told the value of each radio chosen; or give it `defaultValue` and the group keeps the choice itself. Each radio, or radio choice card, is checked when its own `value` is the group's, and an empty value checks none. Without either, each radio keeps its own state, and `onChange` still hears every choice. Checkboxes keep their own state in either case.

Two layouts. Vertical stacks the options at the medium stack step. Horizontal sets them in a row that wraps, for two or three short labels with nothing under them.

In error, every option takes its error look and the message under the options says what to do. Given `error` with no message, the help text moves there as the message. Disabled, every option dims and is out of reach, while the question and its help stay readable; one option can also be disabled alone.

## Accessibility

### What it does for you

- The legend names the group: a screen reader says the question when focus moves into its first choice.
- The help and the message describe the group through `aria-describedby`, and the message is an alert, read as it appears.
- Radios take one stop for the Tab key, and the arrow keys move the choice; each checkbox is its own stop, and Space ticks it.
- Required puts the mark on the question and marks each radio required.
- In error, each option is marked invalid, and the message says what to change in words, with an icon.

### What you must do

- Write the legend as the question, so it is what a screen reader says on entering the group.
- For "at least one checkbox", check in the page and show the message: it has no native form.
- In error, write the message as what to change.

### How to test

- Tab into the group: for radios, focus lands on the chosen radio, or the first, and the arrow keys move the choice. Each checkbox is its own stop, and Space ticks it.
- With a screen reader, entering the group says the question, and the help and message are read with the choice.
- In error, the message is read as it appears and each option is read as invalid.
- With text at 200% and the page 320 pixels wide, the legend and options stay whole.
- In a forced-color mode, the options and the error icon are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab or Shift + Tab | Moves focus into and out of the group: one stop for all its radios, one stop for each checkbox. |
| Up Arrow, Down Arrow, Left Arrow or Right Arrow | Among radios, moves focus to the neighboring radio and chooses it. |
| Space | On a checkbox, ticks or unticks it. |

## Composition

Contains a legend, optional help, two to five options of one kind, and a message in error. Groups and fields stack into forms at the large stack step.

## Usage rules

### Do

- Ask a question in the legend, and keep the option labels short.
- Pre-select the most common radio when there is one.

### Don't

- Mix radios, checkboxes and cards in one group.
- Lay long labels or options with lines under them out in a row.

## Related

- [Radio](../radio/radio.md), [Checkbox](../checkbox/checkbox.md): the choices it holds.
- [Choice card](../choice-card/choice-card.md): a choice drawn as a card.
- [Field](../field/field.md): one control with its label.
- [Field message](../field-message/field-message.md): the help and the error under the question.
