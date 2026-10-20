---
name: banner
title: Banner
type: component
block: smbk-banner
adaptStrategy: css
figmaNodeId: 4381:2200
status: candidate
---

# Banner

## Purpose

A short announcement that runs across the full width at the very top of a site or an app, above the header or the app bar: a new release, planned maintenance, a trial about to end. It speaks about the whole site, not about the page under it, which is what separates it from an alert, which sits inside the page next to what it is about.

## Anatomy

- The block, a full-width strip with no rounding and one hairline line along its bottom edge, drawn inside the strip so it takes no room.
- The content part, which centers the lead and the link in the room the dismiss control leaves.
- The lead part, holding the icon part and the message part side by side.
- The icon part: a megaphone on the neutral tone, and on the feedback tones an info circle, a tick, a warning sign or a crossed circle, in the tone's icon color. Any Phosphor icon can replace it, and it can be left out.
- The message part, one short sentence.
- The link part, optional: the small link, underlined, placed after the message.
- The dismiss part, optional: the small ghost button with a cross.

## When to use

- News or a notice that concerns every page of a site, shown until the reader dismisses it or the situation ends.
- A notice that must stay, such as a service outage, without the dismiss control.

## When not to use

- A message about one page, form or section. Use an [alert](../alert/alert.md) in that place.
- A confirmation that an action went through. Use a [toast](../toast/toast.md).
- Anything that needs the reader to decide before going on. Use a [modal](../modal/modal.md).

## Behavior

None of its own. The dismiss control calls back and the page removes the banner; the page also remembers that it was dismissed, so it does not come back on the next page. The link goes wherever the page points it.

The strip is one line tall. In a wide space too narrow for the message, the message wraps beside its icon and stays centered, and the link follows it or drops beneath it; the strip grows to fit. In a narrow space, such as a phone, everything starts at the start edge: the message wraps beside its icon and the link sits under them. The form follows the layout switch, so an element around the banner can force either. The difference is presentational only.

## Accessibility

### What it does for you

- The strip is a region of the page with a name, "Announcement" unless the page gives it another, so a screen reader can find it and skip it.
- It is part of the page as it loads, so it is not announced as a live message.
- The dismiss control is a real button named "Dismiss".
- The tone is shown by the icon's shape and the words as well as the color.

### What you must do

- Give each banner its own name when a page shows more than one.
- Use an alert for a banner that appears while the reader is on the page, such as an outage notice pushed in later. That is an alert's job, not a banner's.
- When the reader dismisses the banner, move focus to the start of the page that remains, not to nowhere.
- Write the message so it makes sense without the color, and keep the icon on a feedback tone.
- Never give the strip the `banner` role. That role marks the page's own header, so a screen reader would report two headers. In plain markup, give it the region role and a name, as the wrapper does.
- Give the dismiss control's name, and every other word the banner says by itself, in the page's own language. They keep their English unless the page gives its own.

### How to test

- Tab through it: its link and the dismiss control take focus in turn, with the focus ring showing in both themes and in a forced-color mode.
- Press Enter, then Space on the dismiss control: each dismisses the banner, and focus lands on the page that remains.
- With a screen reader, the banner is found as a region named "Announcement" or the name you gave, and it is not announced when the page loads.
- With text at 200% and the page 320 pixels wide, the message wraps and the controls stay reachable.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the banner's link, then to the dismiss control. |
| Enter | Follows the focused link, or presses the dismiss control. |
| Space | Presses the dismiss control. |

## Composition

Contains an icon, a message, a link and a dismiss control, and nothing else. Sits first on the page, before the header or the app bar, and spans the full width. Never inside a card, a sidebar or the page's content column.

## Usage rules

### Do

- Keep the message to one short sentence and let the link carry the details.
- Show one banner at a time.
- Give the link words that say where it goes, such as "Read the notes", never "Click here".

### Don't

- Write a paragraph in it. It wraps into a block that pushes the page down.
- Stack banners, or use one for a message about the page below it.
- Pass a link component as the message. Give the wrapper the link as `link`, with its address and its words, and it draws the link after the message.

## Related

- [Alert](../alert/alert.md): a message inside the page, beside what it is about.
- [Toast](../toast/toast.md): a short-lived confirmation that arrives and leaves on its own.
- [Header](../header/header.md) and [app bar](../app-bar/app-bar.md): the bar the banner sits above.
