---
name: modal
title: Modal
type: component
block: smbk-modal
adaptStrategy: css
figmaNodeId: 4212:26125
status: experimental
---

# Modal

## Purpose

Stops the reader for one short thing: a confirmation, a small form, a choice that must be made before going on. The page behind is dimmed and cannot be used until the modal closes. A drawer is for longer tasks beside the page; a modal is for a moment in the middle of it.

## Anatomy

- The block, a native dialog element centered over a scrim.
- The header part: an optional icon part and the title part on one line, and the close part in the modal's top corner, the large inset from its top and end edges, overlapping the end of that line; the title keeps clear of it.
- The body part, which scrolls when tall.
- A divider and the footer part, optional, holding the actions aligned to the end.

## When to use

- Confirming something that cannot be undone.
- A form of two or three fields that belongs to the page behind.
- A choice the reader must make before the page can continue.

## When not to use

- Anything the reader may want to read the page during. Use a [drawer](../drawer/drawer.md).
- Success messages. Use a [toast](../toast/toast.md).
- Long content. Use a page.

## Behavior

Opens modally. Escape, the close button and a click on the scrim all ask to close: a modal that holds its own open state closes itself, and one the page holds waits for the page to close it. A click anywhere on the panel, its padding and edge included, never asks, nor does a press that starts on the panel and ends on the scrim, as when selecting words. With a popover, a dropdown or a list open inside the modal, Escape and a click on the scrim close that first, and the modal stays. The size axis sets the greatest width; the panel shrinks with the window. It fades in and rises a spacing step into place over a scrim that fades in, and fades out a little faster as it closes; under reduced motion it still fades in and out, in place, without rising or dropping. Inline modals do not move.

The inline flag renders the panel in place with no scrim, so it can be seen in the Showroom and in documentation.

The React wrapper opens and closes it with the dialog's own modal open method, as other layers open: given `open`, the page holds the open state; without it, the modal holds its own, closed unless given `defaultOpen`. Asking to close calls `onOpenChange(false)`. Do not also set the dialog's open attribute.

## Accessibility

### What it does for you

- It is a native dialog opened modally: focus moves inside, is held there, and returns to the opener on close.
- It is labeled by its title, a second-level heading unless `headingLevel` gives another, for a modal opened from deeper in the page's outline.
- The close button is icon-only and named "Close". Every word it says by itself, such as the close button's name, keeps its English unless the page gives its own, so a page in another language can change it.
- Escape, the close button and a click on the scrim ask to close; the page decides by handling the request.

### What you must do

- Give the modal a title, and set `headingLevel` where the second level does not fit the page's outline.
- If the close button is hidden, put an action in the footer that closes the modal.
- Do not open a modal without the reader having done something.
- Give the close button's name in the page's own language when the page is not in English.

### How to test

- Press the control that opens it: focus moves into the modal. Tab and Shift + Tab stay inside it, and Escape asks to close it. After it closes, focus is back on the control that opened it.
- With a screen reader, it is announced as a dialog by its title, and the close button is read as "Close".
- With text at 200% and the page 320 pixels wide, the panel shrinks with the window and its content stays reachable.
- In a forced-color mode, the focus ring on its buttons and the panel's edge stay visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab or Shift + Tab | Moves focus between the controls inside the modal and holds it there. |
| Escape | Asks to close the modal. Inside it, an open popover, dropdown or list closes first. |
| Enter or Space | On the close button or a footer button, presses it. |

## Composition

The body takes any content. The footer takes buttons. A modal must not open another modal.

## Usage rules

### Do

- Name the primary action after what it does: "Delete", not "OK".
- Put the primary action last and give it the brand tone, or the danger tone for a destructive one.

### Don't

- Stack modals.
- Use a modal to show a picture. Use the page.

## Related

- [Drawer](../drawer/drawer.md): a panel from the edge, for longer tasks beside the page.
- [Alert](../alert/alert.md): an inline message that does not interrupt.
- [Toast](../toast/toast.md): a passing message.
