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
- The icon part, the caret, at the well's end.
- The list part, the dropdown panel itself (it carries the dropdown's classes at the select's size), of option parts, each a dropdown item with its option label part and, on the chosen one, the check part.
- The label and the help text are not the select's: put it in a field.

## When to use

- Choosing one of a handful of known values: a country, a role, a sort order.

## When not to use

- Two or three choices that should all be visible. Use radios or the segmented control.
- A list to search through. That is a combo box, which does not exist yet.
- Multiple choices. Use checkboxes.

## Behavior

The closed well behaves as the input does: it lifts on hover, shows the field focus border when focused, and draws the danger border on error. Any change to the input's look reaches the select. Pressing the well opens the dropdown panel under it with one item per choice, as tall as the dropdown's items at the same size (the small select has the small items); the chosen one carries a check. Arrow keys move the highlight, Home and End jump to the first and last choice that can be chosen, Enter and Space choose; a disabled choice is passed over. Escape, a click outside, or focus leaving the select closes the list without choosing; Tab closes it and moves on to the next control, as it would from a closed select. Typing jumps to the next choice that starts with the letters typed (they add up while typed quickly; the same letter again steps through the choices that start with it), and opens a closed list on it. The list drops in from the well and fades in with the enter motion, as the dropdown panel does, and closes at once; under reduced motion it appears at once.

The open list never makes the page longer or runs off the screen. It stops the list's own gap short of the window's edge, of any scrolling part it sits in, and of a boundary the page may name (such as the part of the page whose end the list should not pass). A longer list scrolls inside itself with the system's thin scrollbar, and scrolling it never hands on to the page. Where there is more room above the well than under it, the list opens upward, and then only fades in. It opens scrolled to the chosen choice, and the keyboard's highlight is always kept in view. A short list that fits looks exactly as it did. The value can be controlled from outside or left to the component, and travels in a hidden input when the select has a form name. A disabled select sends nothing with its form, as a disabled native control does. A required select does not stop a form being sent while no choice is made: it says it is required (to a screen reader, and through the field's mark), but checking that a choice was made before sending is the form's work.

A ref given to the React wrapper reaches the well, the button that opens the list, so a page can focus it. The select keeps working as usual with a ref attached.

A page names the boundary the list should not pass by giving `boundary` a ref to any element.

## Accessibility

- The well is a combo box button that opens a listbox; it needs a label, given with aria-label or aria-labelledby.
- The list is in the page only while it is open, and the well names it as the element it controls only then, as ARIA 1.2 asks of a combo box, so the well never points at something that is not there.
- The highlighted option is announced through the active descendant while the list is open, so focus never leaves the well. While the well has focus, the highlighted option carries the focus ring just inside its edge, so it can be found without telling the fills apart.
- Typing to jump works as the select-only combo box pattern describes; a space while a word is being typed is part of the word, not a choice.
- The field around it links its help text or error message to the well through aria-describedby, and its required mark comes with aria-required on the well.
- An error marks the well invalid as well as drawing the danger border.

## Composition

The input's well with a value and a caret, and the dropdown's panel and items for the list. Takes its options as a list of values and labels. Sits in a field for its label and help text.

## Usage rules

### Do

- Put the most likely value first, or a placeholder that says what to choose.

### Don't

- Use a select for navigation. That is a dropdown.

## Related

- Input: free text.
- Dropdown: the panel and items the open list is drawn as.
- Field: the label and help text around it.
- Radio: a few choices, all visible.
