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

Text that takes a person somewhere. It is set in the body face at body sizes so that it sits inside running text or stands alone as an inline action, and it carries the link color family — rest, hover, pressed, disabled — and an underline. Inside running text the underline is always there; a link standing on its own shows it on hover and press only. Inside a sentence it is part of the sentence: it wraps across lines like the words around it.

## Anatomy

- The block, a real anchor.
- The label part, the text.
- The icon part, before or after the label. Optional. Figma hides the leading icon by default and shows a trailing one. It sits in the line like one more letter of the word beside it, so the two are never split across lines.

## When to use

- Navigation inside text: "read the guide", "see all".
- A standalone inline action that reads as text, not as a control.

## When not to use

- For an action that changes state on the page. Use a [button](../button/button.md), ghost tone if it should read lightly.
- As a button visually. The button wrapper can render a link with button classes when that is truly needed.

## Behavior

Hover darkens the text; pressed uses the pressed color. A standalone link draws its underline on hover and press. A disabled link keeps its text and loses its address. Without an address it is no longer a link, so a screen reader reads it as plain text; it does not say that a link is unavailable.

A link flows with the text it sits in. A long link inside a paragraph breaks across lines wherever the words around it would, and its underline follows it onto each line. An icon travels with its word: a trailing icon never starts a line on its own and a leading icon never ends one. The underline runs beneath the icon too. Standing alone in a flex or grid layout, a link is one line tall and wraps inside its own width if it has to.

On a touch screen a link standing on its own takes an invisible press area round its words, out to the comfortable touch target, and its look does not change. A link inside a sentence does not, so a press on the words around it never follows the link.

## Accessibility

### What it does for you

- It is a real anchor with an address, so Enter follows it. A link without an address is not a link; the disabled state removes the address on purpose, which leaves plain text behind.
- Focus draws the system ring, rounded, around the whole link; a link that wraps gets a ring around each of its lines.
- Nothing is cut short or pushed outside its container, so a link inside text still reads whole at twice the text size and at the narrowest reflow width (WCAG 1.4.4 Resize Text and 1.4.10 Reflow). Inline links wrap naturally, as the words around them do.
- A link inside running text is underlined at rest, so it can be told from the words around it without color (WCAG 1.4.1 Use of Color).
- Icons are decorative.
- On a touch screen a link standing on its own takes an invisible press area round its words, out to the comfortable touch target. A link inside a sentence does not, so a press on the words around it never follows the link.

### What you must do

- Make the link text say where it goes, since the icons do not.
- Drop the underline at rest, with the standalone flag, only on a link that stands on its own, where its place already says it is a link.
- Use a button carrying the link's classes, not an anchor, for an action that sits among words and changes the page rather than going anywhere, such as a filter bar's Clear all. It is announced as a button and pressed with Space or Enter.

### How to test

- Tab to the link: the focus ring shows around the whole link, and around each line of one that wraps, in both themes and in a forced-color mode.
- Press Enter: the link is followed.
- With a screen reader, it is read as a link by its text. A link with no address is read as plain text.
- With text at 200% and the page 320 pixels wide, a link inside a paragraph breaks across lines with the words around it and nothing is cut off.
- In a forced-color mode, a disabled link is drawn in the system's gray text color.
- On a touch screen, a press just outside a standalone link's words follows it; a press on the words around a link in a sentence does not.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the link. |
| Enter | Follows the link. |
| Enter or Space | Presses a button carrying the link's classes. |

## Composition

Contains a label and up to two icons. Sits in text, in a list, in a footer, in a card.

## Usage rules

### Do

- Keep the underline on links inside paragraphs; set `standalone` only on a link that stands on its own, in a list, a footer or a card.
- Match the link size to the surrounding text's preset. Inside a heading or a title, which no body size matches, set the size to `inherit`: the link takes the text's face and keeps its underline.

### Don't

- Attach a click handler to a link to make it act like a button.
- Put a link inside a button or a label.
- Put a space between the label and an icon when writing the markup by hand. The line may break at that space and leave the icon alone on the next line.
- Put a link that belongs to a sentence in a flex or grid row with the text around it. A flex or grid parent turns the link into a block, which wraps on its own instead of with the words; keep it directly in the sentence's text.

## Related

- [Button](../button/button.md): actions.
- [Breadcrumbs](../breadcrumbs/breadcrumbs.md), [footer](../footer/footer.md) and [navigation items](../nav-item/nav-item.md) are built from links.
