---
name: popover
title: Popover
type: component
block: smbk-popover
adaptStrategy: css
figmaNodeId: 4804:65705
status: candidate
---

# Popover

## Purpose

A small raised panel that opens from a button and stays beside it, for a little more than a tooltip can hold: a title, a few lines, a field, and one or two actions. The page behind it stays usable. It differs from the tooltip, which holds a few words and nothing to press; from the dropdown, which is a list of actions or links; and from the modal, which stops everything else until it is answered.

## Anatomy

- The anchor part, present when the popover draws its own opener: it holds the opener and the panel, and the panel hangs from it.
- The opener, supplied by the consumer: a button. The popover tells it whether the panel is open and which panel it controls.
- The block, the raised panel at the popover width, in three sections spaced by the large stack step.
- The header part: the heading part (an optional icon part, the titles part with the title part and an optional description part) and an optional divider part under it. An optional close part, the ghost icon button, sits over the panel's corner.
- The body part: a few lines in the description's look, or a field, or both.
- The footer part: a divider part, on unless turned off, then the actions at the end (one button, or a button group for several) or the helper part, a line of small text.

## When to use

- A short explanation with a way to read more, opened from an info button.
- A quick change that belongs to one thing on the page: invite someone, rename, pick a setting.
- A short review with two answers, such as approve and decline.

## When not to use

- A few words naming a button. Use the tooltip.
- A list of actions or links. Use the dropdown.
- A task that must be finished or canceled before anything else. Use the modal.
- A whole form or long reading. Use a page or a drawer; one click outside closes a popover.

## Behavior

Pressing the opener shows the panel under it, lined up with the opener's start or end edge; pressing it again, pressing Escape, pressing the close button, clicking outside or moving focus outside closes it. The panel drops in from the opener across the gap and fades in with the enter purpose, and goes back the same way with the exit purpose; when the reader's system asks for less motion it simply appears and disappears. A closed panel is hidden, not removed, so anything typed into a field inside it is still there when it opens again.

Without an opener, the panel draws itself open in place, and opening, closing and placing it belong to whoever shows it; its close button calls the change handler.

The opener is given as `trigger`. It can be any element that renders one button and passes the id, aria attributes and click and key handlers it is given on to that button, as the dropdown's opener does; the design system's Button and a plain button both do. The full interface is written out at the top of the React wrapper.

## Accessibility

- The panel is a non-modal dialog, named by its header's title, or by its label when it has no header.
- The opener says it opens a dialog, whether it is open, and which panel it controls.
- Opening leaves focus on the opener. The panel follows the opener in the page, so the next Tab goes into it; the reader chooses whether to go in.
- Escape, from the opener or anywhere in the panel, closes it and returns focus to the opener, as the close button does. A click outside closes it without moving focus.
- The close button is named "Close". Give one whenever the popover holds a field or actions, so touch users have a clear way out.
- Nothing in it is reachable only by hover.

## Composition

Contains one header, one body and one footer, in that order; any of them may be left out. The body may hold text, a field or both. The footer holds one button, a button group, or helper text. Do not put a popover, a dropdown or a modal inside a popover. With an opener, the panel sits in the overlay layer.

## Usage rules

### Do

- Keep it short: a title, a few lines, one or two actions.
- Give it a close button when it holds a field or actions.
- Align a popover at the end of a bar to the end, so it opens inward.

### Don't

- Open it on hover alone.
- Put anything in it that the reader must not lose to a stray click outside.
- Use it for a site's navigation.

## Related

- Tooltip: a few words, nothing to press.
- Dropdown: a list of actions or links from a button.
- Modal: a task that blocks the page until it is answered.
- Field: what a popover's body holds for a quick change.
