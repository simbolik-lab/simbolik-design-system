---
name: menubar
title: Menubar
type: component
block: smbk-menubar
adaptStrategy: css
figmaNodeId: 8222:3544
status: proposed
---

# Menubar

## Purpose

A row of menu titles, as at the top of a desktop app: File, Edit, View, Help. Each title opens a menu of commands, and once one is open the pointer or the arrow keys move straight to the next, so a tool with many commands can keep them all a step away without a button for each. Each menu is the dropdown's menu, with its items, groups, single choices, key hints and second menus. For the links of a site's header, use the header's navigation instead; for a bar of tools that act at once, use the toolbar.

## Anatomy

- The block, the bar: the default surface with its rim and rounded corners, holding the titles side by side.
- The item part, one title: the ghost button at its small size. While its menu shows it keeps the button's pressed fill.
- The menus: one dropdown for each title, its anchor holding the title and the panel, which hangs below the bar lined up with the title's start.

## When to use

- An app or a tool with many commands that people come back to: an editor, a design tool, a dashboard with its own documents.
- Commands that fall into a few familiar groups people expect at the top, such as File, Edit and View.

## When not to use

- A site's navigation between pages. Use the [header](../header/header.md) or the [sidebar](../sidebar/sidebar.md): links are not menu commands.
- A few actions on one thing. Use a [dropdown](../dropdown/dropdown.md) from a button.
- Tools used all the time, which should be one press away. Show them in a [toolbar](../toolbar/toolbar.md).
- A phone. A row of menus needs a pointer and room; give a narrow screen a menu button instead.

## Behavior

Pressing a title opens its menu below the bar, and pressing it again closes it. While a menu shows, moving the pointer onto another title opens that one in its place, so a pointer can sweep along the bar. Choosing an item closes the menu, and so do Escape, a press outside it and focus leaving it. Each menu moves, scrolls and closes as the dropdown does, and an item in it can open a second menu at its side.

The arrow keys move along the bar. In a menu, the left and right arrows close it and open the menu of the title beside it, with focus on its first item, except where they open or close a second menu.

The bar is as wide as its titles and wraps onto a second line in a space too narrow for them. Plain HTML pages get the look from the stylesheets; the keys, the opening and the placing live in the React wrapper.

## Accessibility

### What it does for you

- The bar is a menubar named by its label, and each title a menu item that says it opens a menu and whether it is open, following the menubar pattern of the WAI-ARIA Authoring Practices.
- The bar is one Tab stop: Tab reaches the title last focused, and the arrow keys move between titles.
- Each menu is named by its title and follows the dropdown's menu keys, and Escape closes it with focus back on its title.
- Choosing an item puts focus back on its title, so a keyboard user is never left on a closed menu.

### What you must do

- Give the bar a label that says what its menus act on, such as "Editor".
- Keep each title one or two words, and wire every key hint shown in a menu yourself; the menu only shows and announces it.

### How to test

- Tab to the bar: focus lands on one title. The left and right arrows move between titles and wrap; Home and End go to the first and last.
- On a title, Enter, Space or the down arrow opens its menu on the first item. In the menu, the right arrow opens the next title's menu and the left arrow the previous one, focus on its first item; Escape closes it with focus on its title.
- With a screen reader, the bar is read as a menubar, each title as a menu item that opens a menu, collapsed or expanded.
- With a menu open, move the pointer along the bar: each title's menu opens in turn.

### Keyboard

| Key | What it does |
|---|---|
| Right Arrow or Left Arrow | On a title, moves to the next or previous title, wrapping around; with a menu showing, that title's menu shows instead. In a menu, closes it and opens the next or previous title's menu on its first item. |
| Home or End | On a title, moves to the first or last title. |
| Enter, Space or Down Arrow | On a title, opens its menu with focus on the first item. |
| Up Arrow | On a title, opens its menu with focus on the last item. |
| Escape | In a menu, closes it and returns focus to its title. |
| Tab | Leaves the bar; in a menu, closes it and moves on. |

## Composition

Holds menubar menus only, each a title and a dropdown menu of items, labels, dividers and second menus. The menus sit in the raised layer, above the page and below overlays and dialogs.

## Usage rules

### Do

- Order the menus as people expect them: File, Edit, View, then what is the tool's own, Help last.
- Give each command its key hint where it has a shortcut.
- Keep the same commands in the same menus across every screen of the tool.

### Don't

- Put links to other pages in a menubar.
- Leave a title with an empty menu, or a menu with one item.
- Hide the only way to a common command in a menubar: show it in the toolbar or the page too.

## Related

- [Dropdown](../dropdown/dropdown.md): each menu, its items and its keys.
- [Toolbar](../toolbar/toolbar.md): tools a press away, often under a menubar.
- [Button](../button/button.md): the titles are its ghost button.
- [Header](../header/header.md): a site's navigation, which is links rather than menus.
