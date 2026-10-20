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

- The anchor part, present when the popover draws its own opener: it holds the opener and the layer part, and the layer holds the panel, which hangs from the anchor until it is placed.
- The opener, supplied by the consumer: a button. The popover tells it whether the panel is open and which panel it controls.
- The block, the raised panel at the popover width, in three sections spaced by the large stack step.
- The header part: the heading part (an optional icon part, the titles part with the title part and an optional description part) and an optional divider part under it. An optional close part, the small ghost icon button with its cross in the subtlest text color, sits centred on the title's first line, over the padding at the panel's end.
- The body part: a few lines in the description's look, or a field, or both.
- The footer part: a divider part, on unless turned off, then the actions at the end (one button, or a button group for several) or the helper part, a line of small text.

## When to use

- A short explanation with a way to read more, opened from an info button.
- A quick change that belongs to one thing on the page: invite someone, rename, pick a setting.
- A short review with two answers, such as approve and decline.

## When not to use

- A few words naming a button. Use the [tooltip](../tooltip/tooltip.md).
- A list of actions or links. Use the [dropdown](../dropdown/dropdown.md).
- A task that must be finished or canceled before anything else. Use the [modal](../modal/modal.md).
- A whole form or long reading. Use a page or a [drawer](../drawer/drawer.md); one click outside closes a popover.

## Behavior

Pressing the opener shows the panel beside it, under it unless the side axis prefers above, lined up with the opener's start or end edge; pressing it again, pressing Escape, pressing the close button, clicking outside or moving focus outside closes it. Only what is open on top closes: with a dropdown open inside the popover, Escape or a click outside closes the dropdown first, and a popover inside a modal closes before the modal. The panel is lifted over the page while it shows, so no scrolling or clipped part around the opener cuts it off. Without room on the side it prefers, as at the foot of the window, it opens on the other side; near the window's edge it moves inward; it is never taller than the room on its side, and scrolls inside itself when its content is taller. It stays beside the opener as the page scrolls.
The panel comes out of the opener: it drops across the gap, growing from its edge nearest the opener, and fades in with the enter purpose, rising and growing upward instead when it opened above, and goes back the same way, toward the opener, with the exit purpose; when the reader's system asks for less motion it fades in and out in place, without traveling or growing.
Without script it hangs under the opener, or over it on the above side. A closed panel is hidden, not removed, so anything typed into a field inside it is still there when it opens again.

Without an opener, the panel draws itself open in place, and opening, closing and placing it belong to whoever shows it; its close button calls the change handler.

The opener is given as `trigger`. It can be any element that renders one button and passes the id, aria attributes and click and key handlers it is given on to that button, as the dropdown's opener does; the design system's Button and a plain button both do. The full interface is written out at the top of the React wrapper.

## Accessibility

### What it does for you

- The panel is a non-modal dialog, named by its header's title, or by its label when it has no header.
- The opener says it opens a dialog, whether it is open, and which panel it controls.
- Opening leaves focus on the opener. The panel follows the opener in the page, wherever it shows, so the next Tab goes into it; the reader chooses whether to go in.
- Escape, from the opener or anywhere in the panel, closes it and returns focus to the opener, as the close button does. A click outside closes it without moving focus.
- Nothing in it is reachable only by hover.
- Every word it says by itself, such as the close button's name, keeps its English unless the page gives its own.

### What you must do

- Give it a close button whenever it holds a field or actions, so touch users have a clear way out. It is named "Close".
- Give the popover a title in its header, or a label when it has no header, so the dialog has a name.
- Give the close button's name in the page's own language when the page is not in English.

### How to test

- Press Enter, then Space, on the opener: the panel opens and closes, and focus stays on the opener. Press Tab with the panel open: focus goes into it.
- Press Escape inside the panel: it closes and focus returns to the opener.
- With a screen reader, the opener is read as a button that opens a dialog, open or closed, and the panel as a dialog by its title.
- With text at 200% and the page 320 pixels wide, the panel stays inside the window and scrolls inside itself when its content is taller.
- In a forced-color mode, the focus rings on the opener and the close button stay visible.
- On a touch screen, the close button closes it.

### Keyboard

| Key | What it does |
|---|---|
| Enter or Space | On the opener, opens or closes the panel. Focus stays on the opener. |
| Tab | With the panel open, moves from the opener into the panel, then through what it holds. |
| Escape | Closes the panel and returns focus to the opener. With a dropdown open inside it, closes the dropdown first. |

## Composition

Contains one header, one body and one footer, in that order; any of them may be left out. The body may hold text, a field or both. The footer holds one button, a button group, or helper text. Do not put a popover, a dropdown or a modal inside a popover. With an opener, the panel sits over everything on the page while it shows.

## Usage rules

### Do

- Keep it short: a title, a few lines, one or two actions.
- Give it a close button when it holds a field or actions.
- Align a popover at the end of a bar to the end, so it opens inward.
- Prefer the side above for an opener at the foot of a page or a panel.

### Don't

- Open it on hover alone.
- Put anything in it that the reader must not lose to a stray click outside.
- Use it for a site's navigation.

## Related

- [Tooltip](../tooltip/tooltip.md): a few words, nothing to press.
- [Dropdown](../dropdown/dropdown.md): a list of actions or links from a button.
- [Modal](../modal/modal.md): a task that blocks the page until it is answered.
- [Field](../field/field.md): what a popover's body holds for a quick change.
