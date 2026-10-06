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
- The icon part, a glyph at the start.
- The body part, holding the title part and the description part.
- The action part, an optional small secondary button (Figma's Action boolean).
- The dismiss part, an optional cross button.

## When to use

- Explaining a state the person needs to know about while they work.
- Confirming a completed action where the result stays visible.
- A note set into the page's own text, such as a warning at the step of a tutorial where things break. It is static, not live.

## When not to use

- Short-lived confirmations. Use a toast.
- Field-level errors. Those sit under the field.

## Behavior

None of its own. The dismiss control calls back and the page removes the alert; the action is whatever the page gives it.

## Accessibility

- An alert is live by default: a message that arrives while the reader is on the page. Danger and warning alerts carry the alert role and are announced at once; the others carry the status role and are announced politely.
- An alert that is part of the page as it loads, such as a note inside an article or a standing notice under a heading, is not a message and must not be announced. Give it `live` as false: it carries the note role and is read in place with the text around it. Its tone still shows through the icon and the words. It looks the same either way.
- Choose by how the alert gets there, not by its tone. A warning written into the page is static; a success that appears after the reader saves is live.
- The dismiss control is a real button with an accessible name.
- The tone is shown by the icon and the text as well as the color.
- The wrapper sets the role from `live` and the tone. Do not set a role on it yourself.
- In plain markup, give it the role the wrapper would: note for a static alert, alert for a live danger or warning alert, status for any other live alert.

## Composition

Contains an icon, a body, an action and a dismiss control. Sits at the top of a page, a section or a form.

## Usage rules

### Do

- Write the title as the situation and the description as what to do about it.

### Don't

- Show more than one alert of the same tone in one place. Combine them.

## Related

- Toast: the same message, transient.
- Badge: a status word without a message.
