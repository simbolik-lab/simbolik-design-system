---
name: error-summary
title: Error summary
type: component
block: smbk-error-summary
adaptStrategy: css
figmaNodeId: 7110:412
status: experimental
---

# Error summary

## Purpose

Lists every mistake in a form at its top, after the form was sent with mistakes, so a reader sees at once how many things need fixing and can go straight to each. Each mistake is a link to its field. The message beside each field still says what is wrong there; the summary gathers those messages in one place.

## Anatomy

- The block, a box on the danger color's subtle surface, inside a hairline edge, with small container corners.
- The icon part, the danger icon, on the heading's first line.
- The content part, holding the text and the list.
- The text part: the heading part ("There is a problem") over the optional intro part, a line such as "Fix these so we can send your details:".
- The list part, one item part per mistake, in the order the fields come in the form.
- The link part, inside an item whose mistake belongs to a field: the mistake's words, underlined, in the danger text color. An item for a problem with the whole form holds its words alone.

## When to use

- At the top of a form, after it was sent with one mistake or more.
- For a long form, or one that runs over more than one screen, where a reader cannot see every field's message at once.

## When not to use

- Before the form is sent. Check fields as they are left, if at all, and show the message beside the field.
- For a problem the reader cannot fix, such as a server that is down. Use an [alert](../alert/alert.md) or an [empty state](../empty-state/empty-state.md).
- For a single short field, such as a search box. Its own message is enough.

## Behavior

The summary takes focus as it appears, so the page scrolls to it and a screen reader reads its heading. Send the form again with mistakes still in it and the summary takes focus again: give it a `focusKey` that changes with each send, such as a count of sends. A summary that shows only after the page reloads takes focus as the page loads.

Pressing a mistake's link brings the field's label into view and moves focus to the field. For a group of choices, such as radio buttons, focus moves to the first choice marked invalid, or the first choice, and the group's question comes into view. Without script, the link goes to the field's id, as any link to a part of a page does.

While it has focus, the summary draws the focus ring round itself, whether focus came from a press, the keyboard or the page.

## Accessibility

### What it does for you

- The summary is a group named by its heading, and the page moves focus to it, so a screen reader reads "There is a problem" without a live region. It is not a Tab stop: Tab from the summary reaches its first link.
- Each mistake with a field is a link, so it can be reached with Tab and listed with a screen reader's list of links.
- The heading's level follows the page's outline: 2 by default.
- The words carry the meaning; the danger color only backs them up.

### What you must do

- Word each mistake exactly as the message beside its field, and say how to fix it: "Enter a date in the future", never "Invalid date".
- Give each field the id its mistake names. Give a group of choices its id on the group (the field group's fieldset), and its choices are reached through it.
- Set the heading's level with `headingLevel` to follow the page's outline.
- Give it a `focusKey` that changes with each send, so it takes focus again when the form is sent with mistakes still in it.

### How to test

- Send the form with mistakes: focus moves to the summary and a screen reader reads its heading.
- Tab from the summary to the first link, then press Enter: focus moves to the field, with its label in view.
- With a screen reader's list of links, each mistake appears as a link.
- With text at 200% and the page 320 pixels wide, the words and links stay whole.
- In a forced-color mode, the summary's focus ring and the links are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus from the summary to its first link, then on through the links. |
| Enter | Follows the focused link, moving focus to its field. |

## Composition

Sits at the top of the form it summarizes, before the first field, inside the form or just above it. Holds only the heading, the intro line and the list of mistakes.

## Usage rules

### Do

- Show it only after the form was sent with mistakes, and take it away when they are fixed and the form is sent.
- List the mistakes in the order of the fields.
- Use the same words in the summary and beside the field.

### Don't

- Show a summary with no message beside each field.
- Move focus to it while someone is still filling in the form.
- List problems the reader cannot fix.

## Related

- [Field message](../field-message/field-message.md): the message beside each field, worded as its line in the summary.
- [Field](../field/field.md) and [field group](../field-group/field-group.md): the fields the links lead to.
- [Alert](../alert/alert.md): a message about the page or the form as a whole, with nothing to link to.
