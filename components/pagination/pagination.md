---
name: pagination
title: Pagination
type: component
block: smbk-pagination
adaptStrategy: css
figmaNodeId: 4253:3044
status: candidate
---

# Pagination

## Purpose

Moves the reader between the pages of a list too long to show at once, and tells them where they are in it. The numbers type lets them jump anywhere; the select type is for long lists where a row of numbers would not fit.

## Anatomy

- The block, a navigation landmark.
- Numbers type: the list part, a bordered bar holding the previous part, one page part per shown page, a gap part where pages are skipped, and the next part.
- Select type: the previous part, the select part listing every page, and the next part, with no bar.
- Range type: a label part saying "Showing", the select part listing the row ranges, and a label part with the total, for a table's foot.

## When to use

- Search results, tables and archives split into pages.

## When not to use

- Feeds that grow as the reader scrolls. Use a "load more" button.
- Steps in a form. Use a progress indicator and Next buttons.
- Fewer than two pages. Show nothing.

## Behavior

The numbers bar can drop its border, which the table's foot does. The current page is held in the pressed look and cannot be pressed again. Previous is disabled on the first page and Next on the last; they stay in the tab order (aria-disabled), so pressing Next onto the last page keeps focus on it rather than dropping it to the top of the page. With many pages the numbers collapse to the first, the last, and a few around the current one, with a gap between; how many around the current one is a prop.

## Accessibility

- The landmark is named "Pagination" by default; pass another name when a page has two.
- The current page carries the current-page marker, and every number button is named "Page N" so the announcement is not just a digit.
- The arrow buttons are icon-only and carry their names.
- In the select type the select is named "Page".

## Composition

Contains buttons and a select. Sits under the list it pages.

## Usage rules

### Do

- Reflect the page in the address, so a reload or a shared link lands on the same page.

### Don't

- Show a numbers bar for hundreds of pages; use the select type.
- Use the range type outside a table.

## Related

- Button: what each control is.
- Select: the page list in the select type.
