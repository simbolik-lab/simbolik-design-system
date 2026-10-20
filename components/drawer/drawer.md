---
name: drawer
title: Drawer
type: component
block: smbk-drawer
adaptStrategy: css
figmaNodeId: 4212:23947
status: experimental
---

# Drawer

## Purpose

A panel that slides in from an edge of the window and sits over the page, for a task that needs more room than a modal but should not leave the page: filters, a settings form, the site navigation on a narrow screen. A modal interrupts in the middle; a drawer keeps the page visible beside it.

## Anatomy

- The block, a native dialog element fixed to one edge, with a scrim behind it.
- The header part, holding the heading part (the title part with an optional description part straight under it), the close part centred on the title's first line, and a divider.
- The body part, which scrolls when the content is taller than the window.
- The footer part, optional: a divider and the actions part, buttons aligned to the end.

## When to use

- Filters and settings that apply to the page behind.
- Detail of one row in a table, without leaving the table.
- The navigation on narrow screens.

## When not to use

- A short confirmation. Use a [modal](../modal/modal.md).
- Content the reader needs alongside the page for a long time. Put it in the page.

## Behavior

Opens modally: the page behind is dimmed and cannot be used. Escape, the close button and a click on the scrim all ask to close: a drawer that holds its own open state closes itself, and one the page holds waits for the page to close it. A click anywhere on the panel, its edge included, never asks, nor does a press that starts on the panel and ends on the scrim, as when selecting words. With a popover, a dropdown or a list open inside the drawer, Escape and a click on the scrim close that first, and the drawer stays. The four positions change only where the panel sits, which corners are rounded and which edge it slides from. It slides in from its edge by its own size over a scrim that fades in, and slides back out a little faster as it closes; under reduced motion it appears in place and fades in and out instead of sliding, over the same scrim. Inline drawers do not move.

The inline flag renders the panel in place with no scrim, so it can be seen in the Showroom and in documentation.

The React wrapper opens the dialog modally for you, as other layers open: given `open`, the page holds the open state; without it, the drawer holds its own, closed unless given `defaultOpen`. Asking to close calls `onOpenChange(false)`. Do not also set the dialog's open attribute.

## Accessibility

### What it does for you

- It is a native dialog opened modally: focus moves to the panel itself as it opens, so a screen reader names the drawer by its title, is held inside, and returns to the opener on close. Tab from the panel reaches the close button first.
- The panel is a container, not a control, so it draws no focus ring; the first control is not focused on opening, because a phone's browser may draw its ring after a tap and it would look pressed.
- It is labeled by its title and described by its description. The title is a second-level heading unless `headingLevel` gives another.
- The close button is icon-only and named "Close".

### What you must do

- Give `headingLevel` for a drawer opened from deeper in the page's outline.
- If the close button is hidden, make an action in the footer close the drawer.
- Give every word it says by itself, such as the close button's name, in the page's language with `closeLabel`; it keeps its English unless the page gives its own.
- Keep the title to a few words; it is the accessible name.

### How to test

- Open it with the keyboard: focus moves into the drawer, the page behind cannot be reached, and the first Tab lands on the close button.
- Press Escape: the drawer asks to close, and once closed focus returns to the opener.
- With a screen reader, the drawer is read as a dialog by its title, followed by its description.
- With text at 200% and the page 320 pixels wide, the panel and its footer actions stay whole.
- In a forced-color mode, the panel's edge and the close button are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab or Shift + Tab | Moves focus through the controls inside the drawer. Focus is held inside while it is open. |
| Escape | Asks the page to close the drawer. |
| Enter or Space | On the close button or a footer action, presses it. |

## Composition

The body takes any content, including a navigation list. The footer takes buttons. A drawer must not open another drawer.

## Usage rules

### Do

- Put the primary action last in the footer and give it the brand tone.
- Keep the title to a few words; it is the accessible name.

### Don't

- Open a drawer on page load.
- Put a form's only submit button outside the drawer.

## Related

- [Modal](../modal/modal.md): a centered dialog for a short interruption.
- [Sidebar](../sidebar/sidebar.md): the permanent panel a drawer stands in for on narrow screens.
