---
name: combobox
title: Combobox
type: component
block: smbk-combobox
adaptStrategy: css
figmaNodeId: 7109:2214
status: experimental
---

# Combobox

## Purpose

A box to type in that suggests matches from a list, for one choice or several: a city, a person, a tag. Typing narrows the list under the box, and the reader picks from it with the keys or a press. It differs from the select, which opens a fixed list to choose from without typing, and from the search field, which takes free text and suggests nothing.

## Anatomy

- The block, holding the box and, while open, the list.
- The control part, the input's well: it carries the input's classes, so its chrome, hover, focus, error, read-only and disabled looks and its two sizes are the input's.
- The values part, one row inside the well that wraps: the chips, then the text.
- The chip part, one per pick when the combobox takes several: a chip at its small size, with its remove cross, named "Remove" and the pick's label.
- The input part, the text box typed in, which is the combobox for a screen reader.
- In error, the input's error icon, a warning sign before the caret.
- The clear part, the search field's cross, shown while the box holds text or a choice. It empties the box and removes the choice.
- The caret part, the input's icon, in a press box that opens and closes the list.
- The list part, the dropdown panel itself (it carries the dropdown's classes at the combobox's size). Inside it, the options part, a listbox of option parts, each a dropdown item with its option label part and, for one choice, the check part on the chosen one; for several, the checkbox's small box on every option, ticked on each pick.
- The status part, a row the list shows instead of options: no results, loading with the turning ring, or an error with its icon, always in words. Its type is a modifier: `--type-no-results`, `--type-loading`, `--type-error`.
- The announcement part, for screen readers only: says the list is loading or failed as it happens.
- The label and the help text are not the combobox's: put it in a field.

## When to use

- A long list the reader searches by name: a country among two hundred, a person in a team, a city.
- A list a page fetches as the reader types, such as a search on a server.
- Several picks from a long list, each kept visible as a chip: the tags on a post, the cities on a trip.

## When not to use

- A handful of choices. Use a [select](../select/select.md), or [radios](../radio/radio.md) when they should all be visible.
- Free text with no list to choose from. Use an [input](../input/input.md), or a [search field](../search-field/search-field.md) for a search.
- Going somewhere rather than choosing a value, such as a site search that opens a page. Use a search field and a page of results, or the [command palette](../command-palette/command-palette.md).
- Several choices from a short list. Use [checkboxes](../checkbox/checkbox.md).

## Behavior

The box behaves as the input does: it lifts on hover, shows the field focus border when focused, and in error draws the danger border, kept while focused, and the warning icon. It comes in the input's two sizes, md and sm; the list's items follow the size.

Typing opens the list under the box with the options that match what is typed, anywhere in the label by default, or only at its start, ignoring case and accents in the reader's language. Down and Up open the list on its first or last option, or on the chosen one, and then move the active option; focus never leaves the box. Enter picks the active option. With one choice, the list closes and the box shows the choice; with several, the pick becomes a chip before the text, the list stays open for the next, and Enter on a picked option removes it. Escape closes the list and puts the box back as it was before typing; a second Escape empties a single choice. Tab leaves and picks nothing. Leaving the box puts it back as well: what is typed is a search, never the value. The caret opens and closes the list with a press. With several picks, each chip's cross removes it, and Backspace in an empty box removes the last one.

What is typed and the value chosen are kept apart, and each can be controlled from outside or left to the combobox. A page that finds the options itself, as a search on a server does, sets `filter` to none, passes the matches as the options as they arrive, and sets `status` to loading meanwhile, or to error when the search failed; an empty list says there are no results. The page cancels an earlier search when a newer one starts. While a search runs, keep the chosen options among the options passed, so the box can show their labels.

The open list shows over the whole page, so a part around the combobox that clips or scrolls never cuts it off, and it keeps the theme, density and text size of the place it opened from. It is as wide as the well, never taller than the system's list height or than the room it has in the window, under the well or above it when there is more room there, and stays beside the well as the page scrolls. A longer list scrolls inside itself with the system's thin scrollbar and a soft shade along its foot, and keeps the active option in view. With a mouse, the active option is the dropdown's sliding hover fill: it follows the pointer from option to option, lights the nearest option when the pointer is in the list's padding, where a click picks it, and steps aside while the keys move, so the keyboard's active option keeps its own focus ring. The list drops in with the dropdown's motion; under reduced motion it fades in and out without moving. The placing and the keys come from React Aria, which a React project installs beside React.

The box grows a row at a time as chips wrap, and the text keeps room for about eight characters after them. A long label on a chip is cut short with an ellipsis. A read-only combobox shows its choice or chips with no caret, no clear cross and no remove crosses, and stays in the tab order. A disabled one is dimmed and out of reach, its chips with it, and sends nothing with its form.

The value travels in hidden inputs when the combobox has a form name: one for a single choice, one for each pick. A ref given to the React wrapper reaches the box typed in, so a page can focus it.

`defaultOpen` shows the list open from the start, as in a picture of the page; focus in the box makes it the working list.

## Accessibility

### What it does for you

- The box is a combo box with a list autocomplete that controls a listbox.
- The active option is announced through the active descendant, so focus stays in the box. While the box has focus, the active option carries the focus ring just inside its edge as well as its fill, so it is never shown by color alone.
- The number of matches is announced as the list opens and as it changes. The loading and error rows are announced as they appear; no results is said in words in the list.
- With several picks, the listbox says so, every option says whether it is picked, and each chip's cross is a button named "Remove" and the pick's label.
- While the list is open, the rest of the page is hidden from a screen reader, so its reading stays in the box and the list; it comes back as the list closes.
- The caret and the clear cross are out of the Tab order: the keys open the list and Escape empties the box. A screen reader can still reach and press them.
- An error marks the box invalid as well as drawing the danger border.

### What you must do

- Give the box a label, from a field, or with `aria-label` or `aria-labelledby`. In development, a combobox with no name logs a warning in the console.
- Put it in a field, which links its help text or error message to the box through `aria-describedby` and adds `aria-required` to the box when it is required.
- Change the words of the chips' crosses with `removeLabel` when the page is in another language.
- Check that a choice was made in the form. A required combobox does not stop a form being sent while nothing is chosen.

### How to test

- With the keyboard only, type a few letters, move with Down Arrow and Up Arrow, press Enter to pick, then press Escape. Focus stays in the box throughout.
- With a screen reader, the box is read as a combo box by its label, the number of matches is spoken as you type, and each option says whether it is picked.
- With several picks, the cross on each chip is read as "Remove" and the pick's label.
- Trigger the loading and error rows: each is spoken as it appears.
- With text at 200% and the page 320 pixels wide, the box grows a row at a time and the list stays inside the window.
- In a forced-color mode, the active option still shows its ring.

### Keyboard

| Key | What it does |
|---|---|
| Any character | Types in the box and opens the list with the options that match. |
| Down Arrow | Opens the list on the chosen option, or the first; with the list open, moves the active option down. |
| Up Arrow | Opens the list on the chosen option, or the last; with the list open, moves the active option up. |
| Enter | Picks the active option. With several picks, Enter on a picked option removes it. |
| Escape | Closes the list and puts the box back as it was before typing. A second Escape empties a single choice. |
| Tab | Leaves the box and picks nothing. |
| Backspace | With several picks and an empty box, removes the last pick. |

## Composition

The input's well, a chip per pick, the search field's clear cross, the dropdown's panel and items for the list, the checkbox's small box for several picks, and the spinner in the loading row. Takes its options as a list of values and labels. Sits in a field for its label and help text.

## Usage rules

### Do

- Put it in a field, with a label that stays in view while the reader types.
- Say what to type in the placeholder or the help text, such as "Type a few letters".
- Write the error row's words as what went wrong and what to do.

### Don't

- Use a combobox for a few choices. Use a select or radios.
- Use it for navigation. Use a search field or the command palette.
- Show options that do not match what was typed.

## Related

- [Select](../select/select.md): a fixed list to choose from without typing.
- [Search field](../search-field/search-field.md): free text with no suggestions.
- [Chip](../chip/chip.md): each pick, when the combobox takes several.
- [Dropdown](../dropdown/dropdown.md): the panel and items the open list is drawn as.
- [Field](../field/field.md): the label and help text around it.
