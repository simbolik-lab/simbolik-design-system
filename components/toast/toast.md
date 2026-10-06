---
name: toast
title: Toast
type: component
block: smbk-toast
adaptStrategy: css
figmaNodeId: 4209:20131
status: candidate
---

# Toast

## Purpose

A brief message that floats above the page to confirm something just happened — saved, sent, copied — and then leaves. It has the alert's anatomy and the highest elevation, because it is not part of the page.

## Anatomy

The same parts as the alert: icon, body with title and description, action, dismiss. The block is raised and has a fixed width.

## When to use

- Confirming an action whose result is not otherwise visible.
- A brief notice that needs no reply.

## When not to use

- Anything the person must read or act on. Use an alert, or a dialog.
- Errors that block a task. Those belong where the task is.

## Behavior

The component renders one toast. Where toasts stack and how long they stay are the page's concern. A toast fades in and rises a spacing step into place when it appears, and fades out dropping a smaller step when the page hides it with the hidden attribute; a toast removed from the page outright simply goes. Under reduced motion it appears and disappears at once.

## Accessibility

- The status role announces it politely without stealing focus.
- Because it leaves on its own, it must never be the only place a piece of information appears.
- A toast with an action must stay long enough to reach it by keyboard, or stay until dismissed.

## Composition

Same as the alert. Sits in a corner of the viewport, on the overlay layer.

## Usage rules

### Do

- Keep it to one line where possible.

### Don't

- Show a toast for something the person did not do, unless it is a status change they are waiting for.

## Related

- Alert: the same message, kept on the page.
