---
name: alert-dialog
title: Alert dialog
type: component
block: smbk-alert-dialog
adaptStrategy: css
figmaNodeId:
status: proposed
---

# Alert dialog

## Purpose

Asks the reader to confirm before something that cannot be undone, such as deleting a project. It is a modal that stops the page, says what will happen, and offers two ways out: cancel, which harms nothing, and the action itself. Unlike the modal, it closes only on those two and Escape, never on a click beside it, so the question is never dismissed by accident.

## Anatomy

- The block, the modal's native dialog element over its scrim, with the alertdialog role. The modal's stylesheet draws it.
- The header part: an optional icon part and the title part, the question, on one line. There is no close button. While the confirm action is the danger one, the icon is drawn in the danger color.
- The body part: the description, what will happen, and anything more the question needs under it.
- A divider and the footer part, holding the cancel action and then the confirm action, at the end.

## When to use

- Before deleting, removing or overwriting something the reader cannot get back.
- Before an action that costs money or reaches other people and cannot be called back.

## When not to use

- A question with no lasting harm, or a small form: use a [modal](../modal/modal.md).
- Telling the reader something happened: use a [toast](../toast/toast.md).
- An action that can be undone: do it at once and offer Undo in a [toast](../toast/toast.md), rather than asking first.

## Behavior

Opens modally, with focus on the cancel action. Pressing cancel or Escape asks to close; pressing the confirm action calls `onConfirm` and then asks to close. A click on the scrim does nothing. A dialog that holds its own open state closes itself; one the page holds waits for the page to close it, through `onOpenChange(false)`. It fades in and rises into place over its scrim as the modal does, and under reduced motion fades in place. The size axis sets the greatest width, the modal's small or medium; the panel shrinks with the window.

The inline flag renders the panel in place with no scrim, so it can be seen in the Showroom and in documentation.

## Accessibility

### What it does for you

- It has the alertdialog role, so a screen reader announces it as an alert: its title names it and its description is read with it as it opens.
- Focus starts on the cancel action, the one that harms nothing, so pressing Enter by habit cancels. Focus is held inside while it is open and returns to the opener when it closes.
- A click beside it never closes it, so the reader must choose.
- The title is a second-level heading unless `headingLevel` gives another.

### What you must do

- Write the title as the question ("Delete this project?") and the description as what will happen, in a sentence or two.
- Name the confirm action after what it does ("Delete project"), never "OK" or "Yes".
- Give the cancel action's words in the page's own language when the page is not in English.

### How to test

- Press the control that opens it: focus is on the cancel action. Tab and Shift + Tab stay inside it.
- With a screen reader, it is announced as an alert dialog with its title and its description.
- Click on the scrim: it stays open. Press Escape: it closes, and focus returns to the opener.
- With text at 200% and the page 320 pixels wide, the panel shrinks with the window and both actions stay reachable.

### Keyboard

| Key | What it does |
|---|---|
| Tab or Shift + Tab | Moves focus between the actions and anything inside, and holds it there. |
| Enter or Space | Presses the focused action. Cancel has focus as it opens. |
| Escape | Asks to close, as cancel does. |

## Composition

The body takes the description and, under it, a short list or a line of detail. Nothing that asks for more input belongs in it: a form is a modal. It must not open another dialog.

## Usage rules

### Do

- Ask only before what cannot be undone.
- Say in the description exactly what goes ("Website redesign and its 24 pages").

### Don't

- Ask before everyday actions: an alert dialog asked too often is confirmed without reading.
- Put a second destructive action in it.

## Related

- [Modal](../modal/modal.md): a short interruption that a click beside it closes.
- [Toast](../toast/toast.md): a passing message, with Undo for an action that can be undone.
