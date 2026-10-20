---
name: status-dot
title: Status dot
type: component
block: smbk-status-dot
adaptStrategy: css
figmaNodeId: 7096:77
status: experimental
---

# Status dot

## Purpose

Marks a status beside a name, such as a service that is online, a sync that is running or a job that failed: a small round dot in the status' color, with the status in words beside it. The words carry the meaning; the dot lets the eye find the status at a glance.

## Anatomy

- The block, a row as wide as its content.
- The dot part, a small circle in the tone's color: green for success, blue for info, amber for warning, red for danger, and gray for the default tone, a status that is neither good nor bad.
- The label part, the status in words in a small label style, after the dot. It is left out when the status is written somewhere else.

## When to use

- Beside a name in a list, a table or a card, to say the state of the thing named: online or offline, healthy or failing.
- In a footer or a toolbar, for the state of a whole service.

## When not to use

- For a count or a category. Use a [badge](../badge/badge.md) or a [tag](../tag/tag.md).
- For a message the reader must act on. Use an [alert](../alert/alert.md), a [banner](../banner/banner.md) or a [toast](../toast/toast.md).
- As the only sign of a status. The words, or a name for the dot, are always there.

## Behavior

The dot keeps its size; the words wrap after it when the line is too narrow. Nothing moves and nothing takes focus.

## Accessibility
### What it does for you

- A screen reader hears the words; the dot beside them is hidden from it.
- A dot with no words, given a name through `aria-label`, is read as one image ("Online").
- In high contrast mode every dot takes the text color, and the words tell the statuses apart.
- Nothing about it takes focus.

### What you must do

- Give a dot with no words a name, `aria-label`, so it is read as one image ("Online").
- Hide a dot beside a status already written out with `aria-hidden`.
- Never tell statuses apart by color alone: the words say which one it is.

### How to test

- With a screen reader, each status is read by its words only, and a dot with no words by its name.
- In a forced-color mode, every dot takes the text color and the statuses are still told apart by their words.
- Tab through the page: focus never lands on the dot.

## Composition

Sits beside a name, in a line of text, a table cell, a list row or a bar. Holds its words only.

## Usage rules

### Do

- Use a short word or two for the status: "Online", "Syncing", "Failed".
- Keep each tone to one meaning across a page.

### Don't

- Show a dot without words or a name.
- Use the danger tone for anything that is not a failure.

## Related

- [Badge](../badge/badge.md): a status as a pill with its words inside.
- [Uptime bar](../uptime-bar/uptime-bar.md): a service's status over time.
