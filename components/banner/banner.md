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
- The content part, which centers the message and the link in the room the dismiss control leaves.
- The message part, one short sentence.
- The link part, optional: the small link, always underlined, placed after the message.
- The dismiss part, optional: the small ghost button with a cross.

## When to use

- News or a notice that concerns every page of a site, shown until the reader dismisses it or the situation ends.
- A notice that must stay, such as a service outage, without the dismiss control.

## When not to use

- A message about one page, form or section. Use an alert in that place.
- A confirmation that an action went through. Use a toast.
- Anything that needs the reader to decide before going on. Use a modal.

## Behavior

None of its own. The dismiss control calls back and the page removes the banner; the page also remembers that it was dismissed, so it does not come back on the next page. The link goes wherever the page points it.

The strip is one line tall. In a space too narrow for the message, the message wraps and stays centered, and the link follows it or drops beneath it; the strip grows to fit. The difference is presentational only.

## Accessibility

- The strip is a region of the page with a name, "Announcement" unless the page gives it another, so a screen reader can find it and skip it. A page showing more than one banner gives each its own name.
- It is part of the page as it loads, so it is not announced as a live message. A banner that appears while the reader is on the page, such as an outage notice pushed in later, is an alert's job, not a banner's.
- The dismiss control is a real button named "Dismiss". When the reader dismisses the banner, the page moves focus to the start of the page that remains, not to nowhere.
- The tone is shown by the words as well as the color; write the message so it makes sense without the color.
- Never give the strip the `banner` role. That role marks the page's own header, so a screen reader would report two headers. In plain markup, give it the region role and a name, as the wrapper does.

## Composition

Contains a message, a link and a dismiss control, and nothing else. Sits first on the page, before the header or the app bar, and spans the full width. Never inside a card, a sidebar or the page's content column.

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

- Alert: a message inside the page, beside what it is about.
- Toast: a short-lived confirmation that arrives and leaves on its own.
- Header and app bar: the bar the banner sits above.
