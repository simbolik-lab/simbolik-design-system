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

Text that takes a person somewhere. It is set in the body face at body sizes so that it sits inside running text or stands alone as an inline action, and it carries the link color family (rest, hover, pressed, disabled) and an underline. Inside running text the underline is always there; a link standing on its own shows it on hover and press only. Inside a sentence it is part of the sentence: it wraps across lines like the words around it.

With `as="button"` the same words open something where they stand instead of going anywhere: a name that opens its card, or words that open a part of the page. They keep the color and size of the text around them, and the link's underline says they can be pressed.

## Anatomy

- The block, a real anchor. With `as="button"`, inline words with a button's role and keys, because a real button is one box that cannot break across lines with the words around it.
- The label part, the text. In a link with an icon, the label draws the underline, so the line stops where the words stop.
- The icon part, before or after the label. Optional. Figma hides the leading icon by default and shows a trailing one. It sits in the line like one more letter of the word beside it, so the two are never split across lines.

## When to use

- Navigation inside text: "read the guide", "see all".
- A standalone inline action that reads as text, not as a control.
- With `as="button"`: a piece of text that opens something about what it names, such as a name in a table cell or in a line of words that opens its card. It is the [popover](../popover/popover.md)'s opener when the words should stay words.
- With `as="button"`: words in a sentence that open a part of the page and have no address of their own.

## When not to use

- For an action that changes state on the page, such as saving or deleting. Use a [button](../button/button.md), ghost tone if it should read lightly, even where it could be pressed words: pressed words open something, and a control that changes things should look like one.
- With `as="button"`, for anything with an address. A real link opens in a new tab and copies its address, so give it `href` and leave `as` out.
- As a button visually. The button wrapper can render a link with button classes when that is truly needed.

## Behavior

Hover darkens the text; pressed uses the pressed color. The underline sits a small gap below the words. It is quiet at rest, stronger on hover and strongest while pressed, and it is see-through at rest and on hover, so it looks the same on any surface. A standalone link draws its underline on hover and press. A disabled link keeps its text and loses its address. Without an address it is no longer a link, so a screen reader reads it as plain text; it does not say that a link is unavailable.

A link flows with the text it sits in. A long link inside a paragraph breaks across lines wherever the words around it would, and its underline follows it onto each line. An icon travels with its word: a trailing icon never starts a line on its own and a leading icon never ends one. The underline runs under the words only, never under the icon or the gap beside it, in every state. Standing alone in a flex or grid layout, a link is one line tall and wraps inside its own width if it has to.

On a touch screen a link standing on its own takes an invisible press area round its words, out to the comfortable touch target, and its look does not change. A link inside a sentence does not, so a press on the words around it never follows the link.

With `as="button"` the words take the color of the text around them, and its size unless `size` says otherwise. Under the pointer they keep that color and the line grows stronger; pressed, the words turn to the subtle text color and the line is at its strongest. Nothing but the line tells them from the words beside them, so the line stays, in a sentence or on their own, and `standalone` only gives them the press area on a touch screen. There is no disabled form: when there is nothing to open, write plain text.

As the [popover](../popover/popover.md)'s `trigger` the words stay in their line and break with it. A paragraph cannot hold the panel, so inside a `p` element put the popover after the paragraph and name the words with `openerId`.

## Accessibility

### What it does for you

- It is a real anchor with an address, so Enter follows it. A link without an address is not a link; the disabled state removes the address on purpose, which leaves plain text behind.
- With `as="button"` it is a button to a screen reader and a Tab stop, and Enter and Space press it, once however long they are held. Its words name it. As a popover's opener it says that it opens a dialog and whether that dialog is open.
- Focus draws the system ring, rounded, around the whole link; a link that wraps gets a ring around each of its lines.
- Nothing is cut short or pushed outside its container, so a link inside text still reads whole at twice the text size and at the narrowest reflow width (WCAG 1.4.4 Resize Text and 1.4.10 Reflow). Inline links wrap naturally, as the words around them do.
- A link inside running text is underlined at rest, so it can be told from the words around it without color (WCAG 1.4.1 Use of Color).
- Icons are decorative.
- On a touch screen a link standing on its own takes an invisible press area round its words, out to the comfortable touch target. A link inside a sentence does not, so a press on the words around it never follows the link.

### What you must do

- Make the link text say where it goes, since the icons do not.
- Drop the underline at rest, with the standalone flag, only on a link that stands on its own, where its place already says it is a link.
- Use a button carrying the link's classes, not an anchor, for an action that sits among words and changes the page rather than going anywhere, such as a filter bar's Clear all. It is announced as a button and pressed with Space or Enter.
- Set `standalone` on pressed words that stand on their own, such as a name in a table cell, so they take the press area on a touch screen. Leave it off inside a sentence.
- Write the role and the keys yourself when writing pressed words by hand: `role="button"`, `tabindex="0"`, and Enter and Space pressing it.

### How to test

- Tab to the link: the focus ring shows around the whole link, and around each line of one that wraps, in both themes and in a forced-color mode.
- Press Enter: the link is followed.
- With `as="button"`, press Enter and Space: each presses it once, the page does not scroll, and a screen reader calls it a button.
- With a screen reader, it is read as a link by its text. A link with no address is read as plain text.
- With text at 200% and the page 320 pixels wide, a link inside a paragraph breaks across lines with the words around it and nothing is cut off.
- In a forced-color mode, a disabled link is drawn in the system's gray text color.
- On a touch screen, a press just outside a standalone link's words follows it; a press on the words around a link in a sentence does not.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the link. |
| Enter | Follows the link. |
| Enter or Space | Presses words with `as="button"`, and a button carrying the link's classes. |

## Composition

Contains a label and up to two icons. Sits in text, in a list, in a footer, in a card.

## Usage rules

### Do

- Keep the underline on links inside paragraphs; set `standalone` only on a link that stands on its own, in a list, a footer or a card.
- Keep a link's words in the label part when writing the markup by hand. A link with an icon draws its underline on the label, so words outside it would leave the line running under the icon.
- Match the link size to the surrounding text's preset. Inside a heading or a title, which no body size matches, set the size to `inherit`: the link takes the text's face and keeps its underline.
- Use `as="button"` for a name that opens its card, in place of a button with its look taken off.

### Don't

- Attach a click handler to a link to make it act like a button. Use `as="button"`, which has the role and the keys.
- Put a link inside a button or a label.
- Put a space between the label and an icon when writing the markup by hand. The line may break at that space and leave the icon alone on the next line.
- Put a link that belongs to a sentence in a flex or grid row with the text around it. A flex or grid parent turns the link into a block, which wraps on its own instead of with the words; keep it directly in the sentence's text.

## Related

- [Button](../button/button.md): actions.
- [Popover](../popover/popover.md): the card a name opens.
- [Breadcrumbs](../breadcrumbs/breadcrumbs.md), [footer](../footer/footer.md) and [navigation items](../nav-item/nav-item.md) are built from links.
