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

The same parts as the alert: icon, body with title and description, action, dismiss. Each tone has its own icon, as the alert's, and the cross sits in a box big enough to press. The block is raised and has a fixed width.

- The region part, where a page's toasts appear: the corner at the end of the viewport's foot, one under another, the newest last. On a phone it spans the viewport less its inset, and so do its toasts.

## When to use

- Confirming an action whose result is not otherwise visible.
- A brief notice that needs no reply.

## When not to use

- Anything the person must read or act on. Use an [alert](../alert/alert.md), or a dialog.
- Errors that block a task. Those belong where the task is.

## Behavior

A toast region shows, times and closes a page's toasts. Put `ToastRegion` round the page once, as it loads, and call `useToasts().show()` anywhere inside it with the toast's tone, title, description and action; it returns an id that `dismiss()` takes.

- A toast stays six seconds, then leaves. A danger toast, and a toast with an action, stay until they are closed. A toast can set its own time, or none.
- While the pointer is on the region or focus is in it, every timer stops, and each starts again with the time it had left once the pointer and focus have gone. A page in a tab nobody is looking at holds them too.
- Escape closes the toast focus is in, and focus moves on to the next toast, or back where it was before it went into the region.
- Three toasts show at once; the others wait their turn and show as earlier ones leave.

A toast fades in and rises a spacing step into place when it appears, and fades out dropping a smaller step as it leaves. Under reduced motion it fades in and out in place, without rising or dropping.

On its own, without a region, the component renders one toast that stays until the page removes it or hides it with the hidden attribute, which plays the same exit. 

## Accessibility
### What it does for you

- Each toast's title and description are announced as it shows, without moving focus: politely, or at once for a danger toast. Two hidden announcers inside the region say them, so none is said twice. A toast in a region has no role of its own; the region is a named landmark.
- A toast on its own carries the status role itself, or the alert role when it is a danger toast.
- F6 moves focus to the newest toast while any shows, so a toast with an action can be reached without tabbing through the page, and F6 again goes back where focus was. The region names the key for screen readers.
- A toast with an action stays until it is closed, unless given a time. A danger toast stays until closed, so it cannot vanish unread.
- While the pointer is on the region or focus is in it, every timer stops, so a toast does not leave while it is being read or reached.
- Escape closes the toast focus is in, and focus moves on to the next toast, or back where it was before it went into the region.

### What you must do

- Put the region in the page as it loads, never with its first toast: it must be there before the first toast arrives, or that toast is not announced.
- Never let a toast be the only place a piece of information appears, because it leaves on its own.
- Give a toast with a time one long enough to reach the action by keyboard.
- Put an error the reader must act on where the task is, not in a toast.
- In plain markup, give the region the status role, `aria-atomic="false"`, so each toast is announced alone, and a name, and give the toasts in it no role; put a danger toast's words in an element with the alert role that is in the page from the start. Timing, holding and Escape are then the page's own script, and must keep to the rules above.
- Give the page's own words for everything it says by itself, such as the dismiss cross's name, which keeps its English until you do; a page in another language can change it.

### How to test

- With a screen reader, show a toast: it is announced without focus moving. Show one more after the page has loaded and check it is announced too.
- Tab into the region: the timers stop, the dismiss cross and any action take focus with a focus ring, and Escape closes the toast.
- Show a toast and press F6: focus moves to it. Press F6 again: focus goes back. Show a danger toast: it is announced at once, interrupting.
- Show a danger toast and one with an action: both stay until closed.
- With reduced motion on, a toast fades in and out in place.

### Keyboard

| Key | What it does |
|---|---|
| F6 | While a toast shows, moves focus to the newest toast's action or dismiss cross; from inside the region, back to where focus was. |
| Tab | Moves focus to a toast's action and its dismiss cross. |
| Enter or Space | Presses the action or the dismiss cross. |
| Escape | Closes the toast focus is in and moves focus to the next toast, or back to where it was before it entered the region. |

## Composition

Same as the alert. Sits in the toast region, in a corner of the viewport, above everything else on the page.

## Usage rules

### Do

- Keep it to one line where possible.

### Don't

- Show a toast for something the person did not do, unless it is a status change they are waiting for.

## Related

- [Alert](../alert/alert.md): the same message, kept on the page.
