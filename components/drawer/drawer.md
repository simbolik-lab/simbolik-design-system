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
- The header part, holding the heading part (the title part and an optional description part), the close part, and a divider.
- The body part, which scrolls when the content is taller than the window.
- The footer part, optional: a divider and the actions part, buttons aligned to the end.

## When to use

- Filters and settings that apply to the page behind.
- Detail of one row in a table, without leaving the table.
- The navigation on narrow screens.

## When not to use

- A short confirmation. Use a modal.
- Content the reader needs alongside the page for a long time. Put it in the page.

## Behavior

Opens modally: the page behind is dimmed and cannot be used. Escape, the close button and a click on the scrim all ask to close; the consumer decides by handling the request. The four positions change only where the panel sits, which corners are rounded and which edge it slides from. It slides in from its edge by its own size over a scrim that fades in, and slides back out a little faster as it closes; under reduced motion it appears and disappears at once. Inline drawers do not move.

The inline flag renders the panel in place with no scrim, so it can be seen in the Showroom and in documentation.

The `open` prop drives the open state, and the React wrapper opens the dialog modally for you. Do not also set the dialog's open attribute.

## Accessibility

- A native dialog opened modally: focus moves to the panel itself as it opens, so a screen reader names the drawer by its title, is held inside, and returns to the opener on close. Tab from the panel reaches the close button first. The panel is a container, not a control, so it draws no focus ring; the first control is not focused on opening, because a phone's browser may draw its ring after a tap and it would look pressed.
- Labeled by its title and described by its description.
- The close button is icon-only and named "Close". If it is hidden, an action in the footer must close the drawer.

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

- Modal: a centered dialog for a short interruption.
- Sidebar: the permanent panel a drawer stands in for on narrow screens.
