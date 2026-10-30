---
name: accordion
title: Accordion
type: component
block: smbk-accordion
adaptStrategy: css
figmaNodeId: 4128:20419
status: candidate
---

# Accordion

## Purpose

A list of headings, each of which opens to show its content and closes again, so that a long set of questions or sections fits in a short space and the reader chooses what to expand. Frequently asked questions are the classic case.

## Anatomy

- The block, a column of items.
- The item part, one section: a native disclosure element, drawn as a raised card or as a flat row.
- The divider part, flat look only: the divider component after each item.
- The summary part, the always-visible heading row, holding the title part and the caret part. It carries the item's padding, so the whole row is what a press opens.
- The content part, revealed when open, with the item's padding at its sides and foot.

## When to use

- Questions and answers.
- Optional detail under a short heading, in settings and forms. In a narrow column, such as a settings panel, use the small size: a smaller title and text, tighter padding and a smaller caret.

## When not to use

- Content most people need. Show it.
- Navigation between views. Use [tabs](../tabs/tabs.md).
- One section only. That is a disclosure, which this can be, but a single card looks odd; use the flat look.

## Behavior

Pressing the summary opens or closes the item; the caret turns and takes the brand color while open. One item stays open at a time: opening one closes the one that was open. Set `multiple` to let several stay open, for answers a reader may want to compare side by side. In markup written by hand, give every item of one accordion the same name for one at a time, and none for several.

An item unfolds with the expand motion and folds back the same way: its height grows from the heading row while the content fades in from a slight blur, the foot of what shows fades rather than meeting the edge with a hard cut, and the caret turns with it. A press halfway turns it round from where it is. The React component moves it, the same in every browser. Markup written by hand is moved by the stylesheet where the browser can animate to a natural height, without the fading foot, and opens at once elsewhere. Under reduced motion the height changes at once and the fade still plays: an item opens and then its content fades in, and its content fades out and then it shuts.

On a touch screen a heading row keeps its height; one shorter than the comfortable touch target, the small size's, takes an invisible press area out to it.

## Accessibility

### What it does for you

- It is made of native disclosure elements, so Enter and Space toggle an item and the open state is announced, with no script of yours.
- Its focus ring is drawn around the whole item while the item's summary has keyboard focus. In the flat look the item also lifts to the raised surface.
- A disabled item cannot be opened or closed, by the mouse, the keyboard or a screen reader's press. It stays in the tab order, so a keyboard or screen reader user learns it is there, and it is announced as dimmed or unavailable.
- In the flat look, the divider after each item is hidden from assistive technology, since each item is already its own disclosure.

### What you must do

- Wrap the title in a heading element when the accordion structures the page. The title is plain text inside the summary.
- Use the React component for a disabled item, or leave the item out. In markup written by hand only the mouse is kept off a disabled item, since a screen reader can still press its summary.

### How to test

- Tab to an item: the focus ring shows around the whole item, in both themes and in a forced-color mode.
- Press Enter, then Space: each opens or closes the item. Tab reaches a disabled item, which is announced as unavailable and does nothing.
- With a screen reader, each item is read as a disclosure by its title, with its open or closed state.
- With text at 200% and the page 320 pixels wide, titles wrap and nothing is cut off.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the next item's summary, a disabled one included. |
| Enter or Space | Opens the focused item, or closes it when it is open. A disabled item does nothing. |

## Composition

Contains items. Items contain any content. Sits on a page or inside a card.

## Usage rules

### Do

- Keep titles to one line.
- Open the first item by default when the page would otherwise look empty.
- In markup written by hand for the flat look, add the divider after each item's disclosure element, not inside it, where it would be hidden while the item is closed, and hide it from assistive technology.
- Give a title that holds more than words, such as a tag beside a topic or a name with a count, a block-level row of its own, a flex or grid row.

### Don't

- Nest accordions.
- Round an item into a capsule. Its corner is a control corner, however short the item is.

## Related

- [Divider](../divider/divider.md): what separates flat items.
- [Tabs](../tabs/tabs.md): switching between views rather than expanding.
