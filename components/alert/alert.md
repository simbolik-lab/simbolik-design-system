---
name: alert
title: Alert
type: component
block: smbk-alert
adaptStrategy: css
figmaNodeId: 4139:6031
status: candidate
---

# Alert

## Purpose

A message that belongs to the page and stays until the situation changes: a warning above a form, a notice that something is unavailable, confirmation that an action went through. It is inline, which is what separates it from a toast, which arrives and leaves on its own.

## Anatomy

- The block, a bordered row on the default or a subtle feedback surface.
- The icon part, a glyph at the start, centered on the title's line. Each tone has its own: a bell for the neutral tone, an info circle, a tick, a warning sign and a crossed circle for info, success, warning and danger, in the tone's icon color. Any Phosphor icon can replace it.
- The body part, holding the title part and the description part, the title sitting straight on its text. The description holds a sentence, several paragraphs or a short bulleted list, in the description's text style.
- The action part, an optional small secondary button (Figma's Action boolean), or several.
- The dismiss part, an optional cross button, the size of the icon in a box big enough to press.

## When to use

- Explaining a state the person needs to know about while they work.
- Confirming a completed action where the result stays visible.
- A note set into the page's own text, such as a warning at the step of a tutorial where things break. It is static, not live.

## When not to use

- Short-lived confirmations. Use a [toast](../toast/toast.md).
- Field-level errors. Those sit under the field.

## Behavior

None of its own. The dismiss control calls back and the page removes the alert; the action is whatever the page gives it.

In a narrow space, such as a phone, the action moves under the title and description, lined up with them, so the words keep the alert's full width; several buttons wrap onto more lines when they need to. The cross stays at the end of the first line. The form follows the layout switch, so an element around the alert can force either.

## Accessibility

### What it does for you

- An alert is live by default: a message that arrives while the reader is on the page. Danger and warning alerts carry the alert role and are announced at once; the others carry the status role and are announced politely.
- The wrapper sets the role from `live` and the tone, and a role given to it is ignored: choose the announcement with `live`.
- The dismiss control is a real button with an accessible name.
- The tone is shown by the icon's shape and the text as well as the color.

### What you must do

- Give an alert that is part of the page as it loads `live` as false. A note inside an article or a standing notice under a heading is not a message and must not be announced. It carries the note role and is read in place with the text around it. Its tone still shows through the icon and the words, and it looks the same either way.
- Choose by how the alert gets there, not by its tone. A warning written into the page is static; a success that appears after the reader saves is live.
- Keep a list in the description short, since it is read as part of the one message. Put nothing that can be pressed in it: the action and the dismiss control are the alert's only controls.
- Give a replacement icon that carries the tone as clearly as the one it replaces.
- In plain markup, give it the role the wrapper would: note for a static alert, alert for a live danger or warning alert, status for any other live alert.
- Give the dismiss cross's name, and every other word the alert says by itself, in the page's own language. They keep their English unless the page gives its own.

### How to test

- Tab through it: the action and the dismiss control take focus in turn, with the focus ring showing in both themes and in a forced-color mode.
- Press Enter, then Space on the dismiss control: each dismisses the alert.
- With a screen reader, a live alert is announced when it appears, a danger or warning one at once. A static one is read in place and not announced.
- With text at 200% and the page 320 pixels wide, the title and description wrap and the controls stay reachable.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the action, then to the dismiss control. |
| Enter or Space | Presses the focused action or dismiss control. |

## Composition

Contains an icon, a body, an action and a dismiss control. Sits at the top of a page, a section or a form.

## Usage rules

### Do

- Write the title as the situation and the description as what to do about it.

### Don't

- Show more than one alert of the same tone in one place. Combine them.

## Related

- [Toast](../toast/toast.md): the same message, transient.
- [Badge](../badge/badge.md): a status word without a message.
