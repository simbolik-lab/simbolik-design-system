---
name: section-heading
title: Section heading
type: component
block: smbk-section-heading
adaptStrategy: css
figmaNodeId: 7115:943
status: experimental
---

# Section heading

## Purpose

Heads a section of a page or a panel among many: its title, how many things it holds, a quiet line such as how fresh it is, and one action at its end, usually a way into the full list. It is smaller than the page header and holds no breadcrumbs or tabs.

## Anatomy

- The block, a row: the text at its start and the action at its end.
- The text part, holding the title row over the summary.
- The title-row part, holding the title and the count side by side.
- The title part, the heading, in a heading style.
- The count part, an optional badge beside the title, outside the heading.
- The summary part, an optional line in a small body style and the subtle text color.
- The action part, an optional action: a link such as "See all", a small ghost button, or a group of two.
- The hidden part, the words after the count that only a screen reader hears.

## When to use

- At the top of a section of a dashboard or an overview, above the list or the cards it counts.
- At the top of a card's body, for a panel among many.

## When not to use

- For the top of a whole page. Use the [page header](../page-header/page-header.md).
- For a heading with a paragraph of introduction under it. Use a heading and a paragraph.
- For the title of a card that has nothing to count and nothing to do. Use the [card](../card/card.md)'s own title.

## Behavior

The action is centred on the row. In a narrow layout the action moves under the summary, at its start. A long title wraps, with its count beside it. Small sets the title a heading step smaller with a smaller count.

## Accessibility

### What it does for you

- The title is a heading of the level the page needs: 2 by default.
- The count sits outside the heading, so the heading's name is the title alone ("Waiting on you"), however the count changes. The count describes the heading, so a screen reader hears it after the title.
- Reading and Tab order: the title, the count, the summary, then the action.

### What you must do

- Set `headingLevel` to fit the page's outline.
- Give the count its noun with `countLabel`, so a screen reader hears "3 waiting", not a bare number. Never show a count by color alone.
- Give an action that is an icon alone a name.

### How to test

- With a screen reader, the title is read as a heading of the right level, and the count is read after it with its noun. Check the headings list: the title shows without the count.
- Tab from the title: focus goes to the action, which shows the focus ring and has a name.
- With text at 200% and the page 320 pixels wide, a long title wraps with its count beside it, and the action moves under the summary.
- In a forced-color mode, the focus ring on the action stays visible.

## Composition

Holds a title, an optional count, an optional summary and one optional action. Sits at the top of a section or of a card's body, above the content it heads.

## Usage rules

### Do

- Keep the title to a few words that name what the section holds.
- Say how fresh the section is in the summary, when it changes on its own.
- Lead the action to the full list the section shows part of.

### Don't

- Put the count in the title's words.
- Give a section more than one action, or more than two buttons in a group.
- Use it where a page header belongs.

## Related

- [Page header](../page-header/page-header.md): the top of a whole page.
- [Badge](../badge/badge.md): the count.
- [Card](../card/card.md): a section heading can head its body.
