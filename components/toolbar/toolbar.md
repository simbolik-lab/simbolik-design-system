---
name: toolbar
title: Toolbar
type: component
block: smbk-toolbar
adaptStrategy: css
figmaNodeId: 7343:1575
status: experimental
---

# Toolbar

## Purpose

A labelled bar of related tools for one view, one selection or one editor: what the bar acts on, a group or two of tools, and its main action. A keyboard reaches it with one Tab and moves along it with the arrow keys, so a bar of twenty tools costs one stop, not twenty. It differs from a button group, which is a few actions side by side with a Tab stop each, and from an app bar, which is the application's own navigation and is not a toolbar.

## Anatomy

- The block: the bar, labelled, on the raised surface. Floating, it is as wide as its tools, with a rim, rounded corners and a shadow; docked, it runs flat across the top of a panel with a line under it.
- `row`: the zones, side by side. When the space is too narrow for them all, the row wraps onto a second line rather than pushing the page sideways.
- `context`: what the bar acts on, always first. A title with an optional icon and a count, a back button with a trail of pages, the selection in words, a status, a person, a notice of the mode the page is in, a summary, or a list to pick from.
- `tools`: one group of tools, after a vertical divider. Icon-only tools (the small ghost icon button, or the ghost toggle button for a tool that stays on, each named in a tooltip), buttons with words, a segmented control, a search field and a filters opener, chips, a switch, a slider, the value of a setting. A bar may hold two.
- `actions`: always last, after a divider: the overflow menu and at most one main action, a split button, a pair such as Cancel and Save, a few icon buttons, a close button, or stop and start. Docked, it sits at the bar's end.
- `divider`: the vertical divider that starts a tools or actions zone. A divider that would start the whole row is not drawn.
- `title`, `value`: what the bar acts on, the period a calendar shows, a setting's value, in Label MD. `icon` goes before a title.
- `text`, `meta`: a status, a summary, a setting's name, a note beside an action, in Body SM; `meta` is the quieter note after it, such as when it last changed.
- `status`: a status's dot, or the spinner's ring while busy, with its words and its note.
- `field`: a field in the bar, such as the list that picks what it acts on or a search field, at the width the bar gives a field.
- `details`: an optional row under the zones: the filters applied as removable chips with Clear all, then the result count at the row's end, the filter bar's own parts.
- `wide-only`, `narrow-only`: keep a zone, or anything wrapped in one of them, to a wide or a narrow space.

Every control in the bar is the system's own component at its small size, 32 tall, so the bar is 48 tall.

## When to use

- A view of a list, a board, a calendar or a map with commands for it: refresh, search, download, change the period.
- An editor's formatting and history tools, with the saving status beside them.
- A selection's bulk actions, with the selection's size in words.
- The header of a panel: back, its title, Cancel and Save.
- A small bar floating over a canvas or a text selection.

## When not to use

- The application's or the site's navigation. Use the [app bar](../app-bar/app-bar.md), the [header](../header/header.md) or the [sidebar](../sidebar/sidebar.md).
- Two or three actions under a form or in a dialog. Use a [button group](../button-group/button-group.md).
- Search, filters and sort above a list, with nothing else. Use the [filter bar](../filter-bar/filter-bar.md), a search landmark whose controls each keep their own Tab stop.
- A row of choices of which exactly one is on. Use a [segmented control](../segmented-control/segmented-control.md), inside a toolbar if it shares the bar with other tools.

## Behavior

The zones sit in their order whatever the page passes: context first, actions last. Each tools group and the actions start with a divider unless it is turned off. In a narrow space a part marked wide-only goes and one marked narrow-only comes: the tools can fold into one opener, such as a Filters button with a count, and the overflow menu can take the commands that went. Where a bar sticks, at the top of a scrolling panel or the foot of the window, is the page's to set.

An icon-only tool can show its key after its name in its tooltip, such as "Zoom in" then "]", drawn as a small key cap; the page listens for the key. The overflow menu opens a small dropdown lined up with the bar's end. The value of a setting is a small secondary button with a caret, which opens a popover holding the control that changes it, such as a fill slider.

A status in the bar, the selection's count and the result count are read out when they change. Nothing moves when the bar appears.

## Accessibility
### What it does for you

- The bar has the toolbar role and a name of its own, given as its label.
- It is one Tab stop: Tab reaches the bar once, on the tool used last, or the first. Left and Right move between its buttons, toggles, links, chips and choices; Home and End go to the first and the last. The arrows follow the reading direction. The next Tab leaves the bar.
- A field inside the bar, such as a search field, a select, a slider or a number field, keeps its own Tab stop and its own arrow keys, so typing and choosing work as anywhere else; the arrows pass over it. A menu or a panel a tool opens keeps its own keys.
- A tool that stays on is a toggle button and says whether it is pressed; a command never does. Its name stays the same on and off.
- A tool written as the toolbar's own icon-only tool shows its name in a tooltip under it while it is pointed at or reached with the keyboard, and the overflow button does the same; the tooltip is hidden from screen readers, which hear the name once.
- An icon-only tool given a key (`shortcut`) shows it after its name in the tooltip, as a key cap, and carries it as `aria-keyshortcuts`, so a screen reader can say it too. A segmented control in the bar can take a key the same way.
- A zone given a label is a named group, so a screen reader says which group a tool is in.
- The selection's count says the scope in words ("3 selected") and is read out as it changes, so the actions after it never act on an unstated selection.
- The overflow menu keeps each tool's name, tick and disabled state; its button is named "More actions" unless given another name.

### What you must do

- Give every toolbar on a page a different name.
- Give every icon-only tool a name.
- Listen for a tool's key yourself, and press the tool when it comes: the toolbar only shows and names the key. Take a single key only outside text fields, and never one a screen reader or the browser needs.
- Hand-written markup must give the bar the toolbar role and a name, and move focus with the arrow keys itself; without script every tool is its own Tab stop.

### How to test

- Tab: focus enters the bar once, on the tool used last or the first, with the focus ring. Press Left and Right, Home and End to move along it; the next Tab leaves the bar.
- Move onto a search field or a select in the bar: it keeps its own Tab stop, and typing and choosing work as anywhere else.
- With a screen reader, the bar is read as a toolbar by its name, a tool that stays on as pressed or not pressed, a labeled zone as a named group, and a changing count is read out as it changes.
- In a right-to-left page, the arrows follow the reading direction.
- With text at 200% and the page 320 pixels wide, tools fold into the opener and overflow menu where the page marks them so.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus into the bar, onto the tool used last or the first; pressed again, leaves the bar. A field in the bar keeps its own Tab stop. |
| Left Arrow or Right Arrow | Moves to the previous or next tool, following the reading direction. |
| Home or End | Moves to the first or the last tool. |
| Enter or Space | Presses the tool in focus. |

## Composition

Contains the system's components at their small size: buttons, icon buttons and toggle buttons with their tooltips, a split button, a segmented control, a search field, a select, chips, a badge, an avatar, breadcrumbs, a switch, a slider, a dropdown for the overflow menu and a popover for a value. The details row is the filter bar's applied row and count. Sits at the top of a view or a panel, over a canvas, or beside a selection.

## Usage rules

### Do

- Name the bar for what it acts on.
- Order the tools by how often they are used, and group related ones.
- Keep one main action, at the end; put the rest in the overflow menu.
- Use the small size of every control in it.

### Don't

- Put two main actions in one bar.
- Make a command look pressed: only a toggle stays on.
- Hide every tool behind unnamed icons.
- Put more than one text field in one bar: each is a Tab stop of its own.

## Related

- [Filter bar](../filter-bar/filter-bar.md): search, filters and sort above a list or a table.
- [Button group](../button-group/button-group.md): a few actions side by side.
- [Toggle button](../toggle-button/toggle-button.md): a tool that stays on or off.
- [Split button](../split-button/split-button.md): the main action with its alternatives.
- [Dropdown](../dropdown/dropdown.md): the overflow menu.
