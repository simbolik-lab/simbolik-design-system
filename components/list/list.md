---
name: list
title: List
type: component
block: smbk-list
adaptStrategy: css
figmaNodeId: 7113:863
status: experimental
---

# List

## Purpose

Rows of the same kind, one thing each: a checklist, steps to follow, a feed, a settings menu, a set of choices. Plain, bulleted and numbered lists are text. Navigation, action and selectable lists are rows with an icon, a title and a quiet line under it, and each row goes somewhere, does something or can be chosen. For the facts about one thing, a name beside each value, use the description list; for data with columns, the table.

## Anatomy

- The block, around everything: a nav for a navigation list, a div otherwise.
- The title part, which names the list. Optional, but a navigation or selectable list without one needs an accessible name of its own; the wrapper warns in development when it has none.
- The items part, the list itself: a ul, or an ol for a numbered list; a listbox for a selectable list.
- The item part, one li per row.
- In a text list, the marker part (a bullet, or a number the stylesheet counts when the marker is left empty) and the text part. A plain row holds its words with no marker.
- In the other lists, the row part inside each item: a link, a button, or a plain box whose end holds a button. Inside the row, in order: the start part (such as an avatar), the leading part (an icon), the body part holding the item title part and the quiet meta part, the trailing part (an icon), the check part (a selectable row's tick) and the end part (such as a badge or a button).
- The divider part, the divider component, ending each row but the last when the list has dividers.
- The empty part, the words shown in place of the rows when there are none.

## When to use

- A checklist or a set of points whose order does not matter: bulleted.
- Steps to follow in order: numbered.
- A short menu of pages or settings, with the current one marked: navigation.
- A feed or a list of recent things, each opened by pressing it, or each with a button of its own: action.
- A short set of choices shown all at once, one or several chosen: selectable.

## When not to use

- Names with their values, such as an account's details. Use the [description list](../description-list/description-list.md).
- Data with several columns to compare or sort. Use the [table](../table/table.md).
- A choice in a form with a few short options. Use [radios](../radio/radio.md) or [checkboxes](../checkbox/checkbox.md) in a [field group](../field-group/field-group.md).
- A long set of choices that would push the page down. Use the [select](../select/select.md).
- The site's main navigation. Use the [header](../header/header.md), the [app bar](../app-bar/app-bar.md) or the [sidebar](../sidebar/sidebar.md).

## Behavior

Text rows sit a line of list spacing apart; a row that wraps keeps its lines under the text, not under the marker, and the numbers of a numbered list share one column. Rows that can be pressed touch each other, at least 40 tall at the small size and 48 at the medium size, which adds room above and below. Hovering one fills it lightly and pressing it fills it more. With the React wrapper, in a list whose rows can all be pressed, the light fill is one shape that slides from row to row with the mouse and lights the nearest row when the pointer is on a divider or past the last row, where a click presses that row; it fades in where the pointer enters and out as it leaves, lands without sliding when the reader's system asks for less motion, and steps aside while the keys move. A current or chosen row keeps its own fill over it; a touch screen shows no hover fill, and plain HTML keeps each row's own.

The current row of a navigation list sits on the default surface with a light rim, and its title is one weight bolder. Every title keeps the room of its bolder self, so nothing beside it moves as it turns bold (markup written by hand repeats the title's words in its `data-label` attribute). A chosen option takes the see-through selected fill, with a tick at its end; the tick is in every option and only shows when it is chosen, so a row never changes width. A tickless selectable list (`tickless`, the `smbk-list--tickless` class) draws no tick: its chosen row shows by the fill and a title one weight bolder, for rows that open as they are chosen. A disabled row dims its words and icons.

A link row can open its page in a new tab (`target="_blank"`, with the `rel` the page wants), for rows that lead to other sites, so the reader keeps their place in the list. Its name then ends with "(opens in a new tab)", heard by a screen reader and not seen; `newTabText` changes the words. Nothing changes in how it looks: show it with an arrow-out icon after the title (`trailingIcon="ArrowSquareOut"`).

A selectable list holds its own choice, or follows the one the page gives it and reports each change; given a name, it sends the chosen values with its form. Nothing else animates.

## Accessibility

### What it does for you

- A text list is a real list, so a screen reader says how many rows it has. Its role is written on the element, because some browsers stop calling a list a list once its bullets are gone.
- A list is named by its title. A navigation list is a navigation region named the same way.
- A plain, bulleted or numbered list takes no focus. Links and buttons inside it are Tab stops in reading order.
- A navigation row is a link, and the current one says so to a screen reader.
- An action row is a button, or a box holding one.
- A selectable list is a listbox and its rows are options, each saying whether it is chosen. The list is one Tab stop. A disabled option is skipped.
- A row is named by its title, and its quiet line describes it. A link row that opens a new tab ends its name with "(opens in a new tab)", so the change of tab is never a surprise.
- The marked rows never rely on color alone: the current row's title is bolder, and a chosen option shows a tick, or in a tickless list a bolder title.
- In a forced-color mode, the current row and a chosen option are drawn in the system's highlight colors.

### What you must do

- Give each list its own title, or an `aria-label`. On a page with several navigation lists, make the titles differ, so the regions can be told apart.
- Never put a button or link inside a row that is itself a link or a button. Put it in the end of a row that is not pressed, so each target does one thing.
- Give the new-tab words in the page's own language with `newTabText` when the page is not in English. In markup written by hand, give a row that opens a new tab both attributes and end its title with an element of the `smbk-visually-hidden` class holding a space and "(opens in a new tab)", marked `data-unseen`.

### How to test

- With the keyboard, Tab through a list of links or buttons: each is one stop, in reading order, with the focus ring showing.
- With a selectable list, Tab reaches it once. The arrow keys move between options, Home and End jump to the ends, typing the first letters of a title moves to it, and Space or Enter chooses.
- With a screen reader, a text list is announced with its number of rows, a navigation list as a navigation region by its title, the current row as current, and a selectable list as a listbox whose options say whether they are chosen.
- With text at 200% and the page 320 pixels wide, a long title wraps under its own text and rows stay whole.
- In a forced-color mode, the current row and a chosen option are still told from the rest.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the next link or button in a row. A selectable list is one stop; a disabled option is skipped. |
| Enter | On a navigation row, follows its link. On an action row, presses its button. |
| Space | On an action row, presses its button. |
| Down Arrow or Up Arrow | In a selectable list, moves to the next or previous option. |
| Home or End | In a selectable list, moves to the first or last option. |
| Any character | In a selectable list, moves to the option whose title starts with the letters typed. |
| Space or Enter | In a selectable list, chooses the focused option. |

## Composition

Holds list items. A row may hold an avatar in its start, an icon before and after its title, and badges, a time or a button in its end; a selectable row holds no button or link. Sits on a page, in a card, a drawer or a side panel.

## Usage rules

### Do

- Number rows only when their order matters.
- Open a row in a new tab only when it leads to another site and the reader would want to come back to the list.
- Keep a row's title short and put the detail in its quiet line.
- Use dividers between rows that are pressed or chosen, where the rows touch.
- Make a selectable list tickless when choosing a row opens it, such as an inbox beside its reading pane, so the open row does not read as kept for later.

### Don't

- Put a button inside a row that is a link or a button.
- Rule off every row of a text list: its spacing already groups it.
- Use a list for names with their values.

## Related

- [Description list](../description-list/description-list.md): the facts about one thing, each name beside its value.
- [Table](../table/table.md): data with columns.
- [Select](../select/select.md): one choice from a long set, in a form.
- [Nav item](../nav-item/nav-item.md): a link in a bar or a menu of the site's navigation.
