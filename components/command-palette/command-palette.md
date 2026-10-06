---
name: command-palette
title: Command palette
type: component
block: smbk-command-palette
adaptStrategy: css
figmaNodeId: 4336:22996
status: candidate
---

# Command palette

## Purpose

A search-first panel for people who know what they want: type a few letters, move with the arrow keys, press Enter. It gathers pages and actions into groups under short mono labels, so a large product can be reached from the keyboard without clicking through menus. It is not the page's main navigation; it is the quick way round it.

## Anatomy

- The block, a raised panel with a hairline edge and the highest resting shadow.
- The search part: the search icon part, the input part and the clear part, a small cross that empties the query.
- A divider, then the filters part when filters are in force: removable outline chips, small.
- The body part: one group part per group, each a group header part (the group label part, a subtle mono label, and an optional "See all" ghost button) over a list part of item parts.
- Each item part: an optional item icon part, the item label part, an optional item meta part (a subtle label naming the category) and an optional keycap with the command's own shortcut.
- The empty part, shown instead of the groups when nothing matches.
- The footer part: a divider over the hints part, key hints on the canvas surface for moving, choosing and closing.
- The dialog part, when the palette is open over the page: a native modal dialog on the scrim, holding the panel near the top of the window.

## When to use

- A product or documentation site with many pages or actions, where keyboard users want one place to reach them all.
- Behind the page's usual shortcut for it, Cmd+K or Ctrl+K.

## When not to use

- As the only way to reach something. Keep the visible navigation; the palette is a shortcut past it.
- For choosing a value in a form. Use the select.
- For a short menu of actions on one thing. Use the dropdown.

## Behavior

Typing filters the commands by their label and category, and groups with nothing left disappear; when nothing matches, the empty text shows. The first command is highlighted, and the arrow keys move the highlight through every visible command, across groups, wrapping at the ends. The highlighted command, whether reached by arrow or by pointer, takes the canvas surface, and while the search has focus it also carries the focus ring just inside its edge, because the surface alone is too faint to find. Enter or a click runs it; Escape asks the page to close the palette. The clear control empties the query and returns focus to it. A group's "See all" button calls the page. The page can filter the commands itself instead, for example against a server, by turning the palette's own filtering off.

Shown in place, the palette is just the panel. Given the open state, it sits over the page in a native modal dialog on the scrim: focus is held inside, and Escape or a click outside asks the page to close it. The page decides what opens it, usually Cmd+K or Ctrl+K, and closes it again after running a command. Over the page it fades in and rises a spacing step into place over a scrim that fades in, and fades out a little faster as it closes, as the modal does; under reduced motion it appears and disappears at once. In place, it does not move.

The palette sets no height of its own. When the page limits its height, the body scrolls.

## Accessibility

- Focus stays in the search control throughout. It is a combo box whose listboxes are the groups, each named by its label; the highlighted command is announced through the active descendant, so arrowing never moves focus.
- Commands are options; a disabled one is marked so and cannot be run.
- The "See all" buttons are real buttons, reachable with Tab, named after their group.
- The keycaps and the footer hints are pictures of keys and are hidden from assistive technology; the combo box pattern already tells a screen reader how to move and choose.
- The empty text is a status, announced when the list empties.
- Over the page, the dialog is named "Command palette" unless given another name, and the browser returns focus to where it was when the dialog closes.

## Composition

Built from other components, as Figma builds it: the chips, the labels (mono over groups, default for categories), the ghost button, the keycaps and the dividers are those components. Sits over the page in its own modal dialog, or in place.

## Usage rules

### Do

- Group commands by what they are: pages, actions, recent.
- Give a command a shortcut keycap only when that shortcut really runs it.
- Keep the unfiltered list short; show recent items first and let typing reach the rest.

### Don't

- Put a command in two groups.
- Change what Enter does from "run the highlighted command".

## Related

- Search field: the field on a page; the palette is the panel that search can open.
- Dropdown: a short menu of actions on one thing.
- Kbd, label, chip, button, divider: the pieces.
