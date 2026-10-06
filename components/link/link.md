---
name: link
title: Link
type: component
block: smbk-link
adaptStrategy: css
figmaNodeId: 4129:21956
status: candidate
---

# Link

## Purpose

Text that takes a person somewhere. It is set in the body face at body sizes so that it sits inside running text or stands alone as an inline action, and it carries the link color family — rest, hover, pressed, disabled — and an underline that appears on hover unless it is always on. Inside a sentence it is part of the sentence: it wraps across lines like the words around it.

## Anatomy

- The block, a real anchor.
- The label part, the text.
- The icon part, before or after the label. Optional. Figma hides the leading icon by default and shows a trailing one. It sits in the line like one more letter of the word beside it, so the two are never split across lines.

## When to use

- Navigation inside text: "read the guide", "see all".
- A standalone inline action that reads as text, not as a control.

## When not to use

- For an action that changes state on the page. Use a button, ghost tone if it should read lightly.
- As a button visually. The button wrapper can render a link with button classes when that is truly needed.

## Behavior

Hover darkens the text and draws the underline; pressed uses the pressed color. A disabled link keeps its text and loses its address. Without an address it is no longer a link, so a screen reader reads it as plain text; it does not say that a link is unavailable.

A link flows with the text it sits in. A long link inside a paragraph breaks across lines wherever the words around it would, and its underline follows it onto each line. An icon travels with its word: a trailing icon never starts a line on its own and a leading icon never ends one. The underline runs beneath the icon too. Standing alone in a flex or grid layout, a link is one line tall and wraps inside its own width if it has to.

## Accessibility

- A real anchor with an address. A link without an address is not a link; the disabled state removes the address on purpose, which leaves plain text behind.
- Focus draws the system ring, rounded, around the whole link; a link that wraps gets a ring around each of its lines.
- Nothing is cut short or pushed outside its container, so a link inside text still reads whole at twice the text size and at the narrowest reflow width (WCAG 1.4.4 Resize Text and 1.4.10 Reflow). Inline links wrap naturally, as the words around them do.
- Icons are decorative. The link text alone must say where it goes.
- Underline on hover is a color-independent cue for hover; the always-underline flag makes the link identifiable without color at rest, which links inside running text need (WCAG 1.4.1 Use of Color).

## Composition

Contains a label and up to two icons. Sits in text, in a list, in a footer, in a card.

## Usage rules

### Do

- Turn the permanent underline on for links inside paragraphs.
- Match the link size to the surrounding text's preset.

### Don't

- Attach a click handler to a link to make it act like a button.
- Put a link inside a button or a label.
- Put a space between the label and an icon when writing the markup by hand. The line may break at that space and leave the icon alone on the next line.
- Put a link that belongs to a sentence in a flex or grid row with the text around it. A flex or grid parent turns the link into a block, which wraps on its own instead of with the words; keep it directly in the sentence's text.

## Related

- Button: actions.
- Breadcrumbs, footer and navigation items are built from links.
