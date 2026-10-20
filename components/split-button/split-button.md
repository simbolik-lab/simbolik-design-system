---
name: split-button
title: Split button
type: component
block: smbk-split-button
adaptStrategy: css
figmaNodeId: 7115:1869
status: experimental
---

# Split button

## Purpose

One safe default action with a menu of related ones: "Export PDF", with CSV and JSON in the menu. The main button runs the default at once; the caret button beside it opens the menu of alternatives. It differs from a button that only opens a menu, where every choice is behind the menu, and from a button group, where every action is in view.

## Anatomy

- The block, a segmented button group: the markup has the group's classes at the same tone and size as well as this block's, so the joined corners and the line between the two buttons are the group's.
- The default action, a button with its words and an optional icon before them.
- The caret button, an icon-only button with a caret, square at the button's height. It points down, and up while the menu is open.
- The menu, a dropdown that hangs under the bar, lined up with its end edge. Its rows are small under the small size.

## When to use

- One action most people want, with a few close variations: export in another format, save in another way, send later.
- When the default must stay one press away while the alternatives stay out of sight.

## When not to use

- When no choice is clearly the default. Use a [button](../button/button.md) that opens a menu.
- When every action matters equally and fits. Use a [button group](../button-group/button-group.md).
- For a destructive default. There is no danger tone: never hide a destructive action behind the menu or make it the default.

## Behavior

Pressing the main button runs the default action without opening the menu. Pressing the caret button opens the menu under the bar, lined up with its end edge; choosing an item runs it and closes the menu. A click outside or Escape closes it. Disabled, both buttons dim and neither can be pressed.

Three tones: brand, secondary and outline. In the outline tone the line between the two buttons is as strong as the outer edge.

## Accessibility
### What it does for you

- It is a group of two real buttons, named by the default action's words, and two stops in the tab order: the action, then the caret.
- The caret button says it opens a menu and whether it is open.
- The menu's keyboard is the dropdown's: Enter, Space or the down arrow open it on its first item, the arrows move between items, Escape closes it and puts focus back on the caret button.
- Each button keeps its own focus ring, which the joined edge never hides.
- The row mirrors for right-to-left languages.

### What you must do

- Give the caret button a name of its own that says what the menu holds, such as "More export options". It must differ from the action's words; the wrapper warns in development when it does not, since a screen reader would hear two buttons with one name.

### How to test

- Tab: focus lands on the action, then the caret, each with its focus ring in both themes and in a forced-color mode.
- On the caret, press Enter, Space or the down arrow: the menu opens on its first item. Arrow between items, press Enter to choose one, and press Escape to close it with focus back on the caret.
- With a screen reader, the two buttons are read with different names, and the caret as a menu button that is open or closed.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the action, then to the caret button. |
| Enter or Space | On the action, runs it. On the caret button, opens the menu on its first item. |
| Down Arrow | On the caret button, opens the menu on its first item. In the menu, moves to the next item. |
| Up Arrow | In the menu, moves to the previous item. |
| Escape | Closes the menu and puts focus back on the caret button. |

## Composition

Contains one button and one dropdown whose opener is the caret button. The menu holds dropdown items for the alternatives, never the default action again. Sits wherever a button would: a page header, a toolbar, a card's footer.

## Usage rules

### Do

- Make the default the action most people want.
- Name the caret button for what the menu holds.
- Keep the menu short: the close alternatives, not every action on the page.

### Don't

- Repeat the default action in the menu.
- Put a destructive action as the default.
- Use it when there is no clear default.

## Related

- [Button group](../button-group/button-group.md): several actions in view at once.
- [Dropdown](../dropdown/dropdown.md): the menu it opens.
- [Button](../button/button.md): a single action.
