---
name: empty-state
title: Empty state
type: component
block: smbk-empty-state
adaptStrategy: css
figmaNodeId: 7117:731
status: experimental
---

# Empty state

## Purpose

Fills an area when what belongs there is missing or failed to load: a list with nothing in it yet, a search with no results, a report the reader may not see, a page that is not there. It names the cause and offers the next best step, so the reader is never left facing a blank space or a bare "Something went wrong".

## Anatomy

- The block, which draws no surface: it fills whatever holds it.
- The icon part, an optional icon in the tone's icon color. Warning and danger have their own; an empty state in the default tone shows one only when given, chosen for its cause.
- The text part: the title part, a heading that says what is missing or what went wrong, over the optional description part, a line that says why and what would bring the content.
- The context part, optional free content: a search field holding the query, a short list of links.
- The actions part: the next best step, usually a brand button, then an optional second, quieter step, usually a link.
- The reference part, an optional reference in a code style, for the reader to quote to support after an error on the server.
- The hidden part, the status a screen reader reads the words from, when the page asks for it.

## When to use

- In place of a list, a table or a panel that has nothing to show: on first use, or after everything was cleared.
- In place of results, when a search or a filter matches nothing.
- Small, in one panel of a dashboard or a side panel that has nothing to show, among panels that do.
- When the content cannot be shown: no permission, offline, not found, an error on the server, or only part of it loaded.
- As a whole page, for a missing page or a page that failed to load.

## When not to use

- While the content is still loading. Show [skeletons](../skeleton/skeleton.md); show the empty state only once the answer has come.
- For a mistake in a form. Use the [field message](../field-message/field-message.md) and the [error summary](../error-summary/error-summary.md).
- For a message about the whole page that sits above its content. Use an [alert](../alert/alert.md) or a [banner](../banner/banner.md).

## Behavior

Inline lines everything up at the start, close to its edges, for the list or panel it stands in for. Centered places it in the middle of a larger area with more room round it, a larger icon, title and line. Page does the same for a whole page. Centered and page keep their words to a readable width and centre themselves in the space they are given; inline fills it. The words wrap.

Two sizes. Medium, the default, titles it in a heading style. Small is for one panel among many, as on a dashboard: the title in a label style straight over its line, a smaller icon and smaller gaps, so an empty panel reads no louder than the panels beside it or its own heading. Small keeps the scope's alignment: inline at the start, centered in the middle with less room round it.

With `announce`, a screen reader reads the title and the line as they appear, and again when they change, without moving focus: for an empty result after a search or a filter.

## Accessibility

### What it does for you

- It takes no focus. Its actions are ordinary buttons and links, after its words in the Tab order.
- The title is a heading of the level the page needs: 2 by default, 1 for a whole page.
- The icon is decorative, and the tone colors only the icon. The words and the icon's shape carry the meaning, never the color alone.
- With `announce`, a screen reader reads the title and the line as they appear, and again when they change, without moving focus.

### What you must do

- Show it in place of what it stands for, so a screen reader meets the words, not an empty table with its column headings.
- Set the heading level with `headingLevel` when the page needs another.
- Put any meaning the icon carries in the words.
- Name the cause in words. A reference or an error code alone is never enough, and never show the error's details.
- Set `announce` for an empty result after a search or a filter.

### How to test

- With a screen reader, the title is found as a heading of the right level, followed by its line.
- Tab through it: it takes no focus itself, and the actions come after its words.
- Trigger an empty result with `announce` set: the words are read as they appear, and focus does not move.
- With text at 200% and the page 320 pixels wide, the words wrap and stay whole.
- In a forced-color mode, the icon and the actions are still visible.

## Composition

Holds an icon, a title, a description, free content, up to two actions and a reference. Sits where the missing content would be: inside a card, a panel, under a table's heading row, or as a page's main content.

## Usage rules

### Do

- Name the cause: "No notes match these filters", not "Nothing here".
- Offer the step that fixes it: "Clear filters" for no results, "Ask for access" for no permission.
- Offer "Try again" and a reference only when the cause is an error on the server.
- Use the small size inside a panel or a card among others, with small buttons and links, and set the heading level under the panel's own title.

### Don't

- Show it before the content has had its chance to load.
- Use "Something went wrong" when the cause is known.
- Put a long explanation or the error's details in it.
- Use the medium size in one panel of a dashboard: its heading outweighs the panel's own title and the page's.

## Related

- [Skeleton](../skeleton/skeleton.md): what shows while the content is loading.
- [Alert](../alert/alert.md): a message about a page that still shows its content.
- [Error summary](../error-summary/error-summary.md): the mistakes in a form.
