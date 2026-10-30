---
name: select
title: Select
type: component
block: smbk-select
adaptStrategy: css
figmaNodeId: 4253:2857
status: candidate
---

# Select

## Purpose

A choice from a fixed list, shown closed as the input well with a caret and open as the dropdown panel under it, one dropdown item per choice. It looks the same in every browser, which the native list does not, and it still works with a keyboard and a screen reader.

## Anatomy

- The block, holding the well and, while open, the list.
- The well part, a button that is the input's well: it carries the input's classes, so its chrome and states are the input's.
- The value part, the chosen choice's label or the placeholder.
- The icon part, the caret, at the well's end, at the field's icon size (it is the input's icon part too). A read-only select has none.
- In error, the input's error icon, a warning sign before the caret.
- The list part, the dropdown panel itself (it carries the dropdown's classes at the select's size), of option parts, each a dropdown item with its option label part and, on the chosen one, the check part.
- Optionally, group parts: each holds the dropdown's label as the group's heading and the dropdown's group of the options under it, with the dropdown's divider before each group that follows something.
- Optionally, on an option, the option lead part before the label, a small avatar or an icon, and the option description part, a second line under the label; the label and the second line sit in the option text part. An option with a second line or an avatar is the rich option, a taller row.
- The label and the help text are not the select's: put it in a field.

## When to use

- Choosing one of a handful of known values: a country, a role, a sort order.
- Choices that fall into a few named groups, such as offices by region: give the groups headings.
- Choosing a person or a thing that needs more than a name to tell apart: give each choice a picture or an icon and a second line, such as a person's role.

## When not to use

- Two or three choices that should all be visible. Use [radios](../radio/radio.md) or the [segmented control](../segmented-control/segmented-control.md).
- A long list to search through. Use a [combobox](../combobox/combobox.md).
- Multiple choices. Use [checkboxes](../checkbox/checkbox.md).

## Behavior

The closed well behaves as the input does: it lifts on hover, shows the field focus border when focused, and on error draws the danger border, kept while focused, and the warning icon. Any change to the input's look reaches the select. It comes in the input's two sizes, md and sm. A read-only select shows its choice flat on the page with a faint edge and no caret; it stays in the tab order but never opens, and its value still travels with the form. Pressing the well opens the dropdown panel under it with one item per choice, as tall as the dropdown's items at the same size (the small select has the small items); the chosen one carries a check. Arrow keys move the highlight, Home and End jump to the first and last choice that can be chosen (on a closed select they open the list there), Enter and Space choose; a disabled choice is passed over. Escape, a click outside, or focus leaving the select closes the list without choosing; Tab closes it and moves on to the next control, as it would from a closed select. Typing jumps to the next choice that starts with the letters typed (they add up while typed quickly; the same letter again steps through the choices that start with it), and opens a closed list on it.
With a mouse, the highlight is the dropdown's sliding hover fill: it follows the pointer from choice to choice, lights the nearest choice when the pointer is in the list's padding, where a click chooses it, and steps aside while the keys move, so the keyboard's highlight keeps its own fill and focus ring. The list drops in from the well, growing from its edge nearest the well (upward when it opens above), and fades in with the enter motion, as the dropdown panel does, and closes at once; under reduced motion it fades in without moving.

The open list shows over the whole page, so a part around the select that clips or scrolls, such as an open accordion panel, never cuts it off, and it keeps the theme, density and text size of the place it opened from. It is as wide as the well, never taller than the system's list height, and never makes the page longer or runs off the screen: it stops the list's own gap short of the window's edge and of a boundary the page may name (such as the part of the page whose end the list should not pass), and stays beside the well as the page scrolls. A longer list scrolls inside itself with the system's scrollbar, a thin, see-through bar over its choices that takes no room and shows while the mouse is over it or it scrolls, with a soft shade along its foot while more choices wait below, and scrolling it never hands on to the page. Where there is more room above the well than under it, the list opens upward and rises into place. The placing uses React Aria, which a React project installs beside React. It opens scrolled to the chosen choice, and the keyboard's highlight is always kept in view. A short list that fits looks exactly as it did. The value can be controlled from outside or left to the component, and travels in a hidden native select when the select has a form name, hidden from view and from screen readers. Give `autoComplete` the kind of value it holds, such as `country-name`, and the hidden select carries it, so the browser's autofill can fill it. A disabled select sends nothing with its form, as a disabled native control does. A required select stops its form being sent while no choice is made: the well takes focus and its error look, which stays until a choice is made; the page words the message in the field. The form's reset puts the starting choice back.

Choices can come in groups: each group's heading sits over its choices in the dropdown's small grey label, and a line divides it from what comes before. The headings are not choices: the arrows, Home, End and typing pass from the last choice of one group to the first of the next. A choice can also carry a picture or an icon before its label and a second line under it; with a second line or a picture, it is the taller rich row, the same at both sizes, its second line in the smaller, quieter text and cut short on one line as the label is. A choice given a picture address shows the picture in a small avatar, and its initials when the address is empty or the picture fails to load. The well shows only the chosen choice's label. A disabled rich choice dims its second line and its picture with its label.

The page can hold the list open or shut by giving the React wrapper `open`, as for a test or a picture of the page; `onOpenChange` then hears each request to open or close it (a press, a key, a choice, a click outside, focus leaving), and the page decides. Left out, the select opens and closes itself. A disabled or read-only select never opens, whatever `open` says.

A ref given to the React wrapper reaches the well, the button that opens the list, so a page can focus it. The select keeps working as usual with a ref attached.

A page names the boundary the list should not pass by giving `boundary` a ref to any element.

## Accessibility

### What it does for you

- The well is a combo box button that opens a listbox. In development, a select with no name logs a warning in the console.
- A read-only select says so with `aria-readonly`.
- The list is in the page only while it is open, and the well names it as the element it controls only then, as ARIA 1.2 asks of a combo box, so the well never points at something that is not there.
- The highlighted option is announced through the active descendant while the list is open, so focus never leaves the well. While the well has focus, the highlighted option carries the focus ring just inside its edge, so it can be found without telling the fills apart.
- Typing to jump works as the select-only combo box pattern describes; a space while a word is being typed is part of the word, not a choice.
- An error marks the well invalid as well as drawing the danger border.
- In a forced-color mode, the keyboard's highlight in the open list is drawn in the system's highlight colors, its second line included.
- A group of choices is a group in the listbox named by its heading, so a screen reader says which group a choice is in. The picture before a rich choice is not read out: the label names it. In the hidden native select the groups are option groups with the same headings.

### What you must do

- Give the well a label, with `aria-label` or `aria-labelledby`, or by a field.
- Put it in a field, which links its help text or error message to the well through `aria-describedby`, and whose required mark comes with `aria-required` on the well.

### How to test

- Tab to the select, then press Enter, Space or Down Arrow: the list opens on the chosen choice. Move with the arrow keys, Home and End, and press Enter to choose. Press Escape to close it without choosing.
- Type the first letters of a choice: the highlight jumps to it. Typing in a closed select opens the list on it.
- With a screen reader, the well is read as a combo box with its label and its value, and the highlighted option is read as the arrows move, with its group's heading when the arrows enter a group.
- A disabled choice is passed over by the arrows. A read-only select is reachable with Tab but never opens.
- With text at 200% and the page 320 pixels wide, the well and the open list stay inside the window, and a long list scrolls inside itself.
- In a forced-color mode, the highlighted choice in the open list is still told from the others.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the select. With the list open, closes it, chooses nothing and moves on. |
| Enter or Space | Opens the list when it is closed. With it open, chooses the highlighted choice. A space while a word is being typed is part of the word. |
| Down Arrow or Up Arrow | Opens the list when it is closed. With it open, moves the highlight down or up, passing over a disabled choice. |
| Home or End | Moves the highlight to the first or last choice that can be chosen, opening the list when it is closed. |
| Any character | Jumps to the next choice that starts with the letters typed, and opens a closed list on it. |
| Escape | Closes the list without choosing. |

## Composition

The input's well with a value and a caret, and the dropdown's panel, items, label and divider for the list; the avatar or the icon for a rich choice's picture. Takes its options as a list of values and labels, each with a second line, a picture or an icon if wanted, and groups of them under a heading. Sits in a field for its label and help text.

## Usage rules

### Do

- Put the most likely value first, or a placeholder that says what to choose.

### Don't

- Use a select for navigation. That is a [dropdown](../dropdown/dropdown.md).

## Related

- [Input](../input/input.md): free text.
- [Combobox](../combobox/combobox.md): a long list the reader types to search.
- [Dropdown](../dropdown/dropdown.md): the panel and items the open list is drawn as.
- [Field](../field/field.md): the label and help text around it.
- [Radio](../radio/radio.md): a few choices, all visible.
