---
name: description-list
title: Description list
type: component
block: smbk-description-list
adaptStrategy: css
figmaNodeId: 7113:1025
status: experimental
---

# Description list

## Purpose

The facts about one thing, as rows of a name and its value: an account's contact details, a record's fields, a site's settings at a glance. Each row can carry an action, such as a link to change the value. It differs from the list, which holds many things of one kind, and from the table, which compares many things across the same columns.

## Anatomy

- The block, a div around everything.
- The heading part, over the rows. Optional.
- The rows part, a real dl.
- The row part, a div inside the dl holding one name and its value.
- The term part, the dt: the name of the value.
- The value part, a dd: the value itself, which may be words, a link or a badge.
- The absent part, inside the value, for a value that is not shown: the missing words, or the hidden words after the icon part.
- The action part, a second dd holding a link, such as Change.
- The hidden part: words for screen readers only, such as the name that follows Change.

## When to use

- The details of an account, a person, an order or a site, read at a glance.
- A summary to check before sending a form, each row with a way to change it.
- A short record of a thing's properties, such as size and speed.

## When not to use

- Many things of the same kind. Use the [list](../list/list.md).
- Many things compared across the same columns. Use the [table](../table/table.md).
- Values to edit in place. Use [fields](../field/field.md) in a form.

## Behavior

Stacked, each value sits under its name and the action under the value. Side by side, the names take a column of their own and each row ends with its action; the name, the value and the action share the line of their first words. Where the layout is narrow, side by side stacks before anything is cut off, and a long value wraps.

A value that is not given says "Not provided" in quieter words. A value that exists but is not shown here says "Hidden" after an eye icon, and nothing of the value is in the page. A value still loading is a line of skeleton as tall as the value, so nothing moves when it arrives. Each of these words can be changed.

## Accessibility

### What it does for you

- It is a real description list: a screen reader reads each name with its value.
- It takes no focus of its own. Each action link is a Tab stop.
- A missing value is said in words, never shown as a blank or a dash.
- A hidden value is never in the page, so it is not read; its icon is decoration and the word Hidden says it.
- A value still loading is read as "Loading".
- Side by side keeps the name before its value in the page, whatever the layout.

### What you must do

- Name each action for its row: words only a screen reader hears follow the visible ones, so a row of Change links reads "Change Email address", "Change Phone". Markup written by hand adds them in the hidden part.
- Leave a secret value out of the page rather than hiding it with style.

### How to test

- With a screen reader, each name is read with its value, a missing value as words, a hidden one as "Hidden", and a loading one as "Loading".
- Tab through the list: only the action links take focus, and each is read with its row's name.
- With text at 200% and the page 320 pixels wide, the names and values stay whole and the layout stacks.
- In a forced-color mode, the action links are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the next action link. |
| Enter | Follows the focused action link. |

## Composition

Holds rows. A value may hold words, a link, a badge or a tag. Sits on a page, in a card, a drawer, a modal or a side panel.

## Usage rules

### Do

- Say a missing value in words.
- Give each action a name of its own.
- Use side by side where there is room for the names' column, and stacked in a narrow card.

### Don't

- Leave a value blank or put a dash in its place.
- Show a secret value and hide it with style: leave it out of the page.
- Use it for many things of one kind.

## Related

- [List](../list/list.md): many things of one kind.
- [Table](../table/table.md): many things compared across columns.
- [Field group](../field-group/field-group.md): values a reader edits.
