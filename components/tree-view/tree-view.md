---
name: tree-view
title: Tree view
type: component
block: smbk-tree-view
adaptStrategy: css
figmaNodeId: 7607:118417
status: experimental
---

# Tree view

## Purpose

Shows a hierarchy the reader opens level by level: folders and files, sections and pages, categories and the things in them. Each folder opens to show the rows inside it, and the reader can choose a row to act on it. It differs from the sidebar, which is the site's or the application's navigation, and from the accordion, which opens sections of content rather than rows.

## Anatomy

- The block: the tree, a list of rows, with a name.
- `item`: one row's list item, a file or a folder. A folder holds `group`, the rows inside it, shown while it is open.
- `row`: what the reader sees and points at, 32 tall. Each level steps it 16 further in, and a fine line runs down under each open folder's caret beside the rows inside it.
- `toggle`: the caret's room, holding `caret` on a folder (pointing on while closed, down while open) and kept empty on a file, so labels line up.
- `icon`: a folder or a file, or any icon the row is given.
- `label`: the row's words, in Body SM; a weight step bolder on the chosen row.
- `meta`: an optional count or short note at the row's end, in Body XS.
- `changed`: an optional dot at the row's end for a changed item, with `hidden` words saying so.

## When to use

- Files and folders: a project's files, a library's assets, a document's parts.
- A hierarchy of three levels or more that the reader browses and chooses from, beside a pane that shows the chosen item.
- A structure the reader edits, such as the layers of a design or the parts of a page.

## When not to use

- The site's or the application's main navigation. Use the [sidebar](../sidebar/sidebar.md) or the [header](../header/header.md); a tree is for browsing a structure, and a list of links that opens in sections suits most sites better.
- Two levels with a few items each. Use a [list](../list/list.md) with headings, or an [accordion](../accordion/accordion.md).
- Content the reader reads rather than chooses from. Use an accordion.
- Many columns of data per row. Use a [table](../table/table.md).

## Behavior

The tree keeps which folders are open and which row is chosen, or the page controls both. Clicking a row, or pressing Enter on it, chooses it and opens or closes it if it is a folder; Space chooses it without opening it. The page acts on the chosen row, such as opening the file in the pane beside the tree. A tree can also be open-only, with no row chosen.

A closed folder's rows are hidden, and the page keeps them in place. The caret turns as a folder opens, at once under reduced motion. The chosen row's label is one weight bolder, and every label keeps the room of its bolder self, so nothing beside it moves as it turns bold (markup written by hand repeats the label's words in its `data-label` attribute). A long label wraps onto a second line rather than being cut short. The tree indents to any depth; past four or five levels, rethink the structure.

## Accessibility
### What it does for you

- It is a tree: the list has the tree role and a name, each row the tree item role with its level, each folder's rows a group, and each folder says whether it is open. The chosen row says it is selected. A screen reader hears "tree", its name, then each row's label, its level and its state.
- It is one Tab stop for the whole tree: Tab lands on the row focused last, else the chosen one, else the first.
- The focus ring is drawn just inside the row, so a tree in a scrolling panel never cuts it off.
- The chosen row is shown by a fill and a bolder label, not by color alone.
- The changed dot is said in words after the label ("changed", unless the page gives its own words).
- The meta is read after the label too.
- Each row is at least 32 tall.

### What you must do

- Write the meta so it makes sense after the label, such as "12 files", or add hidden words to it.
- Give the page's own words for the changed dot if "changed" does not fit.
- In hand-written markup, give the list the tree role and a name, each row the tree item role, `aria-level`, `aria-selected` where rows can be chosen, `aria-expanded` on each folder only, a group around each folder's rows, `--smbk-tree-level` beside its level (one less: the top rows are 0), and move focus with script; without script the tree cannot be used with the keyboard.

### How to test

- Tab: focus enters the tree once, on the last focused row, else the chosen one, else the first, with a focus ring just inside the row. Use the keys in the table to move, open and close folders, and choose rows; the next Tab leaves the tree.
- With a screen reader, it is read as a tree by its name, each row by its label, level and state, each folder as open or closed, and the chosen row as selected.
- In a right-to-left page, Left and Right swap.
- With text at 200% and the page 320 pixels wide, a long label wraps onto a second line rather than being cut short.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus into the tree, onto the row focused last, else the chosen one, else the first; pressed again, leaves the tree. |
| Down Arrow or Up Arrow | Moves to the next or previous row the reader can see. |
| Right Arrow | Opens a closed folder, or moves into an open one's first row. |
| Left Arrow | Closes an open folder, or moves out to the folder a row is in. In a right-to-left page Left and Right swap. |
| Home or End | Moves to the first or the last row. |
| Enter | Acts on the row, and opens or closes it if it is a folder. |
| Space | Chooses the row without opening it. |
| * | Opens every folder beside the row. |
| Any character | Typing a row's first letters moves to it. |

## Composition

Holds tree items only; each folder holds more. A row's label can be any short text; it holds no buttons or links of its own, since the row is the control. Sits in a side pane, often beside the item it opens with a splitter between them, or inside a card.

## Usage rules

### Do

- Name the tree for what it shows, such as "Files".
- Open the folders on the way to the chosen row, so it can be seen.
- Keep labels short; the path is in the levels.

### Don't

- Put a button or a link inside a row; use the row itself, and the page's own commands.
- Use a tree for a list one level deep.
- Use the changed dot or the meta for something the reader must not miss; say it in the pane beside the tree as well.

## Related

- [Sidebar](../sidebar/sidebar.md): the site's or application's navigation, which can nest a level.
- [Accordion](../accordion/accordion.md): sections of content that open and close.
- [Splitter](../splitter/splitter.md): the line between a tree's pane and the pane beside it.
- [List](../list/list.md): rows one level deep.
