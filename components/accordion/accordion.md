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
- The summary part, the always-visible heading row, holding the title part and the caret part.
- The content part, revealed when open.

## When to use

- Questions and answers.
- Optional detail under a short heading, in settings and forms.

## When not to use

- Content most people need. Show it.
- Navigation between views. Use tabs.
- One section only. That is a disclosure, which this can be, but a single card looks odd; use the flat look.

## Behavior

Pressing the summary opens or closes the item; the caret turns and takes the brand color while open. Items given the same name close each other. The content grows open with the enter motion and closes a little faster with the exit motion, and the caret turns with the state motion; under reduced motion the item opens and closes at once.

## Accessibility

- Native disclosure elements: Enter and Space toggle, the open state is announced, and no script is needed.
- The title is text inside the summary; wrap it in a heading element when the accordion structures the page.
- A disabled item cannot be opened and is removed from the tab order.
- In the flat look, the divider after each item is hidden from assistive technology, since each item is already its own disclosure.

## Composition

Contains items. Items contain any content. Sits on a page or inside a card.

## Usage rules

### Do

- Keep titles to one line.
- Open the first item by default when the page would otherwise look empty.
- In markup written by hand for the flat look, add the divider after each item's disclosure element, not inside it, where it would be hidden while the item is closed, and hide it from assistive technology.
- Give a title that holds more than words, such as a tag beside a topic or a name with a count, a block-level row of its own, a flex or grid row. An inline row is trimmed at the baseline of its first line, so a line that wraps under it is cut off.

### Don't

- Nest accordions.

## Related

- Divider: what separates flat items.
- Tabs: switching between views rather than expanding.
