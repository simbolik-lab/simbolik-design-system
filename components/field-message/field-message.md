---
name: field-message
title: Field message
type: component
block: smbk-field-message
adaptStrategy: css
figmaNodeId: 7101:46
status: experimental
---

# Field message

## Purpose

The line under a control or a group of choices. It says what to enter, flags something to notice, or says what is wrong and how to put it right. Every form part draws its line with it, so help, warnings and errors look and read the same everywhere.

## Anatomy

- The block, one line of the small body text that wraps when it must.
- The icon part, before the words: the warning sign for a warning, the circled cross for an error. Help has none.
- The text part, the words.

## When to use

- Help under a control: what to enter, or why it is asked.
- A warning the reader should notice while filling it in, such as Caps Lock being on in a password.
- An error under a control or a group of choices, saying what is wrong and how to fix it.

## When not to use

- A single control's help or error inside a field. The [field](../field/field.md) draws its line with this component and links it for you.
- A message about the whole form or page. Use the [alert](../alert/alert.md).
- A message that comes and goes on its own. Use the [toast](../toast/toast.md).

## Behavior

Three types. Help is quiet text with no icon. A warning leads with the warning icon in the warning color, its words in the secondary text color. An error leads with the circled cross and turns its words the danger color. Nothing moves.

It is a paragraph, for a line of words. With `as="div"` it is a div, its words in a div too, for words written as blocks, such as paragraphs or a list, which a paragraph cannot hold; the component that places it spaces the blocks, as the field group does.

## Accessibility

### What it does for you

- An error is an alert, so a screen reader reads it as it appears; a warning that appears while the reader types is better as a status, which waits for a pause. Pass the role to change it.
- A status is read out only when words arrive in a place already on the page. Draw the message with no words (`null`) while there is nothing to say: it keeps an empty place, with no icon, and the words fill it when they come.
- A warning and an error are words with an icon, never color alone. The icon is decorative; the words say it all.

### What you must do

- Give the message an id and point the control's or the group's `aria-describedby` at it, so it is read with the control's name.
- Pass `null` as the words while there is nothing to say, so the place is on the page before the words arrive.
- Choose the role: leave an error as an alert, and pass the status role for a warning that appears while the reader types.

### How to test

- With a screen reader, focus the control: the message is read after its name.
- Cause an error: it is read as it appears. Cause a warning while typing: it is read after a pause.
- With the colors removed, the icon and the words still say it is a warning or an error.
- With text at 200% and the page 320 pixels wide, the words wrap and stay whole.
- In a forced-color mode, the icon is still visible.

## Composition

Contains an optional icon and the words. Sits under a control, a field or a field group.

## Usage rules

### Do

- Write an error as what to do: "Choose a delivery speed", not "Required".
- Keep help to one short line.

### Don't

- Show an error before the reader has had a chance to answer.
- Use a warning for an error: a warning does not stop the form.

## Related

- [Field](../field/field.md): draws its help, error and warning lines with it.
- [Field group](../field-group/field-group.md): one message for a group of choices.
- [Alert](../alert/alert.md): a message about the whole form or page.
