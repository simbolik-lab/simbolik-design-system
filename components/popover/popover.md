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
- The opener, supplied by the consumer: a button, or a piece of text made a press with the [link](../link/link.md)'s `as="button"`. The popover tells it whether the panel is open and which panel it controls. An opener the popover does not draw is named by its id, and the popover draws no anchor part and leaves that button as it is.
- The block, the raised panel at the popover width, in three sections spaced by the large stack step.
- An optional pointer part, a small triangle on the edge facing the opener that points at the opener's middle. With it, what the panel holds sits in the scroll part, which scrolls in the panel's place, since a panel that scrolled would cut the pointer off.
- The header part: the heading part (an optional icon part, the titles part with the title part and an optional description part) and an optional divider part under it. An optional close part, the small ghost icon button with its cross in the subtlest text color, sits centred on the title's first line, over the padding at the panel's end.
- The body part: a few lines in the description's look, or a field, or both.
- The footer part: a divider part, on unless turned off, then the actions at the end (one button, or a button group for several) or the helper part, a line of small text.

## When to use

- A short explanation with a way to read more, opened from an info button.
- A quick change that belongs to one thing on the page: invite someone, rename, pick a setting.
- A short review with two answers, such as approve and decline.
- A card that previews what a name or a tag points at, such as a person or a place, with opening on hover turned on.

## When not to use

- A few words naming a button. Use the [tooltip](../tooltip/tooltip.md).
- A list of actions or links. Use the [dropdown](../dropdown/dropdown.md).
- A task that must be finished or canceled before anything else. Use the [modal](../modal/modal.md).
- A whole form or long reading. Use a page or a [drawer](../drawer/drawer.md); one click outside closes a popover.
- Opening on hover, for a card that holds the only way to an action. The pointer leaving closes it, so leave the switch off and let a press open it.

## Behavior

Pressing the opener shows the panel beside it, on the side the side axis prefers: below unless it says above, left or right. It lines up with the opener's start or end edge, or its top or foot on the left and right. Pressing it again, pressing Escape, pressing the close button, clicking outside or moving focus outside closes it. Only what is open on top closes: with a dropdown open inside the popover, Escape or a click outside closes the dropdown first, and a popover inside a modal closes before the modal. The panel is lifted over the page while it shows, so no scrolling or clipped part around the opener cuts it off. Without room on the side it prefers, as at the foot of the window, it opens on the opposite side, and preferring the left or the right with room on neither, as on a phone, it opens below; near the window's edge it moves inward; it is never taller than the room on its side, and scrolls inside itself when its content is taller. It stays beside the opener as the page scrolls. An opener inside a part of the page that goes full screen keeps its panel shown over that part.
The panel comes out of the opener: it drops across the gap, growing from its edge nearest the opener, and fades in with the enter purpose, rising and growing upward instead when it opened above and sliding out sideways when it opened at the left or the right, and goes back the same way, toward the opener, with the exit purpose; when the reader's system asks for less motion it fades in and out in place, without traveling or growing.
Without script it hangs under the opener, over it on the above side, or beside it on the left and right sides, under it in a narrow space. A closed panel is hidden, not removed, so anything typed into a field inside it is still there when it opens again.

With `pointer`, a switch that is off unless a page turns it on, the panel points at the middle of its opener, on whichever side it opened, and keeps pointing there when it has moved inward at the window's edge. The pointer stays clear of the panel's corners, so at a very small opener it points a little past the middle. It stands a little further from the opener, by the pointer's reach.

With `openOnHover`, a switch that is off unless a page turns it on, the panel also opens once a mouse has rested on the opener for as long as a tooltip waits, so a pointer passing over opens nothing. It stays while the pointer moves from the opener into the panel, closes a moment after the pointer has left both, and stays open if the pointer comes back within that moment. Opened this way it leaves focus where it is, and Escape closes it without the pointer moving. Pressing the opener then keeps it open as a press would have opened it: focus moves in, and the pointer leaving no longer closes it; moving focus into the panel does the same. A press, the keyboard and touch open it just as they do without the switch.

Without an opener, the panel draws itself open in place, and opening, closing and placing it belong to whoever shows it; its close button calls the change handler.

The opener is given as `trigger`. It can be any element that renders one button and passes the id, aria attributes and click and key handlers it is given on to that button, as the dropdown's opener does; the design system's Button, Tag and a plain button all do. The full interface is written out at the top of the React wrapper.

A piece of text can be the opener too, such as a name that opens its card: give `trigger` a [link](../link/link.md) with `as="button"`. The words keep the look of the text around them and stay in their line, breaking with it. A panel cannot stand inside a paragraph, so a name in a `p` element is named with `openerId` and the popover goes after the paragraph.

An opener the popover cannot draw, such as the button a table row holds, is named instead: pass its id as `openerId`, in place of `trigger`. The popover then draws only its panel, where the page puts it, and the panel hangs on that button. The page holds `open` and sets it from the button's own press, which can simply turn it over: a press on that button is no press outside, so it closes what it opened and never opens it again. Focus moves in as the panel opens, and Escape and the close button give it back to that button, as with `trigger`. To hang the panel on something else, such as the name in a row whose button runs the width of the table, give that element's id as `hangOnId`; it takes no press and no focus. A copy of the button that takes presses for it counts as the button when it names the button's id in `data-copy-of`, as the table's held cell does by itself. Opening on hover takes a `trigger`, since the pointer rests on what the popover draws.

## Accessibility

### What it does for you

- The panel is a non-modal dialog, named by its header's title, or by its label when it has no header.
- An opener given as `trigger` says it opens a dialog, whether it is open, and which panel it controls.
- Opening moves focus into the panel, so a screen reader announces it: to its first field when it holds one, otherwise to the panel itself, named by its title, which draws no ring of its own. Tab goes on through the panel. A popover open as the page loads takes no focus.
- Escape, from the opener or anywhere in the panel, closes it and returns focus to the opener, as the close button does, an opener named with `openerId` included. A click outside closes it without moving focus.
- Nothing in it is reachable only by hover: with opening on hover turned on, a press and the keyboard still open it.
- The pointer is a picture only, hidden from screen readers.
- A panel a resting pointer opened stays while the pointer is on it, and closes with Escape without the pointer moving.
- Every word it says by itself, such as the close button's name, keeps its English unless the page gives its own.

### What you must do

- Give it a close button whenever it holds a field or actions, so touch users have a clear way out. It is named "Close".
- Give the popover a title in its header, or a label when it has no header, so the dialog has a name.
- Give the close button's name in the page's own language when the page is not in English.
- With `openerId`, the popover writes nothing on the button it does not draw: give that button `aria-haspopup="dialog"`, and say while the panel is open, as a table row's `current` does.

### How to test

- Press Enter on the opener: the panel opens and focus moves into it; a screen reader says its title. Press Tab: focus moves through the panel.
- Press Escape inside the panel: it closes and focus returns to the opener.
- With a screen reader, the opener is read as a button that opens a dialog, open or closed, and the panel as a dialog by its title.
- With text at 200% and the page 320 pixels wide, the panel stays inside the window and scrolls inside itself when its content is taller.
- In a forced-color mode, the focus rings on the opener and the close button stay visible, and so does the pointer.
- On a touch screen, the close button closes it.
- With opening on hover turned on, rest the pointer on the opener: the panel opens and focus stays where it was. Move the pointer onto the panel: it stays. Press Escape: it closes.
- With `openerId`, press Enter on the button named: the panel opens and focus moves into it. Press Escape: it closes and focus is back on that button. Press the button twice with the pointer: the second press closes the panel and it stays closed.

### Keyboard

| Key | What it does |
|---|---|
| Enter or Space | On the opener, opens the panel and moves focus into it, or closes it. |
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
- Prefer the left or the right where a panel under the opener would cover what a reader is comparing it with, such as the next row or the next item in a graph.
- Give it a pointer when openers sit close together, so it is clear which one the panel belongs to.
- Turn on opening on hover for a card that previews what its opener names, and keep what it says to something a reader can take in where they rest.
- Name an opener with `openerId` only where the popover cannot draw it, such as a table row's own button or words in a paragraph. A second button beside it would be two Tab stops with one job.
- Put a popover with `openerId` soon after its button on the page, such as in a cell of its row, so Tab goes on through the panel from where the reader was.

### Don't

- Open it on hover alone. A press and the keyboard always open it too, and the opener stays a button.
- Put anything in it that the reader must not lose to a stray click outside.
- Use it for a site's navigation.

## Related

- [Tooltip](../tooltip/tooltip.md): a few words, nothing to press.
- [Dropdown](../dropdown/dropdown.md): a list of actions or links from a button.
- [Modal](../modal/modal.md): a task that blocks the page until it is answered.
- [Field](../field/field.md): what a popover's body holds for a quick change.
- [Table](../table/table.md): a row whose own button opens a popover.
