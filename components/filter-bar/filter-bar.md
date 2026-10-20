---
name: filter-bar
title: Filter bar
type: component
block: smbk-filter-bar
adaptStrategy: css
figmaNodeId: 7117:565
status: experimental
---

# Filter bar

## Purpose

Search, filters, sort and Clear all together above a list or a table, with the filters applied shown as chips and the number of results they leave. It is a search landmark, so a screen reader can jump to it, and every control in it keeps its own Tab stop. It differs from a toolbar, which is one Tab stop moved through with the arrow keys and is for commands, and from a search field alone, which narrows a list by its words only.

## Anatomy

- The block: a search landmark with a name of its own. It has no fill or edge; its controls keep theirs. Up to three rows, the large stack space apart.
- `controls`: the first row. `search` holds the search field, which takes the room left over; `filters` holds the filters opener; `sort` holds the sort list at a fixed width; `view` holds an optional view switch at the end.
- `opener`: the filters opener, the outline button with a funnel and its words, and beside it, while filters are applied, `opener-count`, the small badge with how many.
- `narrow-filters`: an optional opener shown in place of the filters in a narrow space, such as one that opens a drawer holding the filters and the sort.
- `applied`: the second row, shown only while filters are applied: each filter as a small removable chip, then `clear`, a button drawn as the small link that removes them all. The chips wrap onto more rows.
- `count`: the last row, the number of results the filters leave, in Body SM; while results load, the spinner's ring and "Updating results" in its place.

The controls are the medium size, 40 tall.

## When to use

- Above a list, a table or a board that people narrow by words and by a few attributes, and sort.
- When the filters applied must stay in view, so nobody wonders why an item is missing.

## When not to use

- A single search box over a short list. Use the [search field](../search-field/search-field.md) alone.
- Commands for a view, such as refresh or download. Use a [toolbar](../toolbar/toolbar.md); it can hold a search field and a filters opener too.
- Filters that take a page of their own, such as facets down the side of a large catalog. Lay those out on the page, with the chips of the filters applied above the results.
- Saying there are no results or that something failed. That belongs to the results, under the bar.

## Behavior

Ticking filters in the opener's menu applies them at once: each shows as a chip, the opener's badge counts them, and the count below says how many results are left. A chip's cross removes its filter; Clear all removes every one. The bar shows "Updating results" with the turning ring while the results load, and the count again when they arrive.

In a narrow space the search field and the filters opener stay and the sort list and the view switch go, since a narrow page reaches them where its filters open: a page can give a narrow opener of its own for a drawer that holds the filters and the sort. The applied chips stay in view and wrap.

The page holds the query, the filters applied and the count, and decides when the results change. Nothing moves.

## Accessibility

### What it does for you

- The bar is a search landmark with a name, given as its label.
- Tab goes through the search field, the filters opener, the sort list, the view switch, each chip's cross and Clear all, in that order.
- The opener says its count in words after its own words ("Filters, 2 applied"), so a voice command for "Filters" still finds it; the badge is hidden from screen readers.
- Each chip's cross is a real button named for its filter ("Remove Status: Open"). Removing one moves focus to the chip that takes its place, the next or else the one before; when the last goes, by its cross or by Clear all, focus goes back to the filters opener. A page that takes the filter away only once the results come back gets the same: focus waits on the cross until the chip goes.
- The count is a status message: a screen reader reads each new count, and "Updating results", without focus moving. It is in the page from the start, so the first count is not read out on arrival.
- The sort list is named for what it does ("Sort by"), so it is never taken for a filter.

### What you must do

- Name the bar with its label. A page with more than one names each differently.
- Name the search field and the sort list.

### How to test

- With the keyboard only, Tab through the bar: the order is the search field, the filters opener, the sort list, the view switch, each chip's cross, then Clear all.
- Remove a chip with Enter: focus moves to the chip that takes its place, and to the filters opener when the last goes.
- With a screen reader, the bar is found as a search landmark by its name, the opener is read with its count, and each cross is read with its filter.
- Change a filter: the new count is read out without focus moving.
- With text at 200% and the page 320 pixels wide, the search, the filters and the sort stay reachable.
- In a forced-color mode, the chips, crosses and focus rings are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab or Shift + Tab | Moves focus along the bar: the search field, the filters opener, the sort list, the view switch, each chip's cross and Clear all. |
| Enter or Space | On the filters opener, a chip's cross or Clear all, presses it. |

## Composition

Contains a search field, a filters opener (a button and a badge) given to a dropdown of ticking items or to a drawer, a select for the sort, an optional segmented control for the view, small removable chips, a button drawn as a link, and the spinner. Sits above the list, table or board it narrows. A toolbar's row of details uses its applied row and count.

## Usage rules

### Do

- Show every filter applied as a chip, and the number of results left.
- Name the bar, the search field and the sort list.
- Keep the filters and the sort where a narrow page can reach them.

### Don't

- Hide filters that are on behind the opener's count alone.
- Put the no-results message or an error inside the bar.
- Clear the filters when someone leaves the page and comes back, unless they asked for it.

## Related

- [Toolbar](../toolbar/toolbar.md): commands for a view, one Tab stop, which can hold a search field and a filters opener.
- [Search field](../search-field/search-field.md): the search on its own.
- [Chip](../chip/chip.md): the filters applied.
- [Dropdown](../dropdown/dropdown.md): the filters menu, with ticking items.
- [Drawer](../drawer/drawer.md): where a narrow page's filters open.
