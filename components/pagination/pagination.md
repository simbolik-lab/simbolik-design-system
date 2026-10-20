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
- Numbers type: the list part, a bordered bar holding the previous part, one page part per shown page, a gap part where pages are skipped, and the next part. Beside them the status part, "6 of 11", shown in place of the numbers in a narrow space; markup written by hand includes it, as an item of the list right after the previous part.
- Select type: the previous part, the select part listing every page, and the next part, with no bar. Previous and Next are each there twice, with their words (the wide-only part) and as icons alone (the narrow-only part); the layout switch shows one of each.
- Range type: a label part saying "Showing", the select part listing the row ranges, and a label part with the total, for a table's foot.

## When to use

- Search results, tables and archives split into pages.

## When not to use

- Feeds that grow as the reader scrolls. Use a "load more" [button](../button/button.md).
- Steps in a form. Use a progress indicator and Next buttons.
- Fewer than two pages. Show nothing.

## Behavior

The numbers bar can drop its border, which the table's foot does; there the range type's select is the small one (`selectSize="sm"`), so every control in the foot is the same height. The current page is held in the pressed look, its number one weight bolder, and cannot be pressed again. Page numbers use digits of equal width, so they line up and do not shift as they change. In a narrow space, where a row of numbers would run off the screen, the numbers bar shows its short form instead: Previous, the page out of how many ("6 of 11"), and Next; the select type's Previous and Next show their icons alone. The form follows the layout switch, so a wrapper can force either. Previous is disabled on the first page and Next on the last; they stay in the tab order (aria-disabled), so pressing Next onto the last page keeps focus on it rather than dropping it to the top of the page. With many pages the numbers collapse to the first, the last, and a few around the current one, with a gap between; how many around the current one is a prop.

## Accessibility

### What it does for you

- The landmark is named "Pagination" by default.
- The current page carries the current-page marker, and every number button is named "Page N" so the announcement is not just a digit. It differs from the others by its weight as well as its fill, so it is found without telling colors apart.
- In the short form the page out of how many is plain text between the two buttons, read in that order.
- The arrow buttons are icon-only and carry their names.
- In the select type the select is named "Page". Its Previous and Next keep their names when they show their icons alone ("Previous page", "Next page"); the form not shown is hidden from everyone, so each is read once.
- Previous and Next stay in the tab order when disabled, so pressing Next onto the last page keeps focus on it.
- Every word it says by itself, such as the buttons' names, the select's name and the counts, keeps its English unless the page gives its own, so a page in another language can change it.
- In a forced-color mode, the current page is drawn in the system's highlight colors.

### What you must do

- Pass another name for the landmark when a page has two.
- Give the words in the page's own language when the page is not in English.

### How to test

- Tab through it: every number button, Previous and Next is a stop with the focus ring showing. On the last page, press Next: focus stays on it.
- Press Enter or Space on a number: that page opens, and it is held in the pressed look.
- With a screen reader, it is a navigation landmark named "Pagination", each number is read as "Page N", and the current one as current.
- With text at 200% and the page 320 pixels wide, the numbers bar shows its short form, "6 of 11", with Previous and Next.
- In a forced-color mode, the current page is still told from the others.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the next button or to the select. Previous and Next stay in the order when disabled. |
| Enter or Space | Presses the focused button: opens that page, or goes to the previous or next one. |

## Composition

Contains buttons and a select. Sits under the list it pages.

## Usage rules

### Do

- Reflect the page in the address, so a reload or a shared link lands on the same page.

### Don't

- Show a numbers bar for hundreds of pages; use the select type.
- Use the range type outside a table.

## Related

- [Button](../button/button.md): what each control is.
- [Select](../select/select.md): the page list in the select type.
