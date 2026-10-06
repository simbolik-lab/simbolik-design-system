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

- Anything the reader may want to read the page during. Use a drawer.
- Success messages. Use a toast.
- Long content. Use a page.

## Behavior

Opens modally. Escape, the close button and a click on the scrim all ask to close; the consumer decides by handling the request. The size axis sets the greatest width; the panel shrinks with the window. It fades in and rises a spacing step into place over a scrim that fades in, and fades out a little faster as it closes; under reduced motion it appears and disappears at once. Inline modals do not move.

The inline flag renders the panel in place with no scrim, so it can be seen in the Showroom and in documentation.

The wrapper's open prop opens and closes it, calling the dialog's own modal open method. Do not also set the dialog's open attribute.

## Accessibility

- A native dialog opened modally: focus moves inside, is held there, and returns to the opener on close.
- Labeled by its title.
- The close button is icon-only and named "Close". If it is hidden, an action in the footer must close the modal.
- Do not open a modal without the reader having done something.

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

- Drawer: a panel from the edge, for longer tasks beside the page.
- Alert: an inline message that does not interrupt.
- Toast: a passing message.
