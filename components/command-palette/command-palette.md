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

A search-first panel for people who know what they want: type a few letters, move with the arrow keys, press Enter. It gathers pages and actions into groups under short small labels, so a large product can be reached from the keyboard without clicking through menus. It is not the page's main navigation; it is the quick way round it.

## Anatomy

- The block, a raised panel with a hairline edge and the highest resting shadow.
- The search part: the search icon part, the input part and the clear part, a cross in a box big enough to press, which empties the query.
- A divider, then the filters part when filters are in force: removable outline chips, small.
- The body part: one group part per group, each a group header part (the group label part, a subtle small label, and an optional "See all" ghost button) over a list part of item parts.
- Each item part: an optional item icon part, the item label part, an optional item meta part (a subtle label naming the category) and an optional keycap with the command's own shortcut. A command with a description puts the label over the item description part, a second line in smaller subtle text, inside the item text part.
- The status part, heard and not seen: the number of commands shown, announced as the query changes.
- The empty part, shown instead of the groups when nothing matches.
- The footer part: a divider over the hints part, key hints on the canvas surface for moving, choosing and closing.
- The dialog part, when the palette is open over the page: a native modal dialog on the scrim, holding the panel near the top of the window.

## When to use

- A product or documentation site with many pages or actions, where keyboard users want one place to reach them all.
- Behind the page's usual shortcut for it, Cmd+K or Ctrl+K.

## When not to use

- As the only way to reach something. Keep the visible navigation; the palette is a shortcut past it.
- For choosing a value in a form. Use the [select](../select/select.md).
- For a short menu of actions on one thing. Use the [dropdown](../dropdown/dropdown.md).

## Behavior

Typing filters the commands by their label, category and description, and groups with nothing left disappear; when nothing matches, the empty text shows. The first command is highlighted, and the arrow keys move the highlight through every visible command, across groups, wrapping at the ends. The highlighted command, whether reached by arrow or by pointer, takes the sunken surface and its label turns one weight bolder, so it shows without color too.
With a mouse, the highlight is one fill that slides from command to command with the pointer, and lights the nearest command when the pointer is between groups or in the padding, where a click runs it; it fades in where the pointer enters, lands without sliding when the reader's system asks for less motion, and steps aside while the keys move. Only the keys scroll the list to the highlight, so the list never moves under a resting pointer.
Every label keeps the room of its bolder self, so nothing beside it moves as the highlight passes (markup written by hand repeats the label's words in its `data-label` attribute).
Enter or a click runs it; Escape asks to close the palette. The search box carries the focus ring just inside its edge while it has focus, so the keyboard's place shows even when nothing matches. The clear control empties the query and returns focus to it. A group's "See all" button calls the page. The page can filter the commands itself instead, for example against a server, by turning the palette's own filtering off.

Shown in place, the palette is just the panel. Given `open` or `defaultOpen`, it sits over the page in a native modal dialog on the scrim: focus is held inside, the page behind holds still, keeping its scrollbar's room so nothing shifts sideways, and Escape or a click on the scrim asks to close it. Given `open`, the page holds the open state and closes the palette when it asks; given only `defaultOpen`, the palette holds its own and closes itself. Asking to close calls `onOpenChange(false)`. A click on the panel never asks, nor does a press that starts on the panel and ends on the scrim. The page decides what opens it, usually Cmd+K or Ctrl+K, and closes it again after running a command. Over the page it fades in and rises a spacing step into place over a scrim that fades in, and fades out a little faster as it closes, as the modal does; under reduced motion it still fades in and out, in place, without rising or dropping. In place, it does not move.

The palette sets no height of its own. When the page limits its height, the body scrolls.

## Accessibility

### What it does for you

- Focus stays in the search control throughout. It is a combo box whose listboxes are the groups, each named by its label; the highlighted command is announced through the active descendant, so arrowing never moves focus.
- Commands are options; a disabled one is marked so and cannot be run.
- A description is part of its command's text, read after the label. Words marked as matching the search show one weight bolder, never by color alone.
- The "See all" buttons are real buttons, reachable with Tab, named after their group.
- The keycaps and the footer hints are pictures of keys and are hidden from assistive technology; the combo box pattern already tells a screen reader how to move and choose.
- As the query changes, a status announces how many commands are shown ("12 results"), or the empty text when nothing matches. Nothing is announced before the reader types.
- Over the page, the dialog is named "Command palette" unless given another name, and the browser returns focus to where it was when the dialog closes.

### What you must do

- Give every word it says by itself, such as the clear control's name, the status words, the See all buttons and the key hints, in the page's language; each keeps its English unless the page gives its own.
- Close the palette when it asks to, after Escape or a click on the scrim, and decide what opens it, usually Cmd+K or Ctrl+K.

### How to test

- Open it with the page's shortcut, type, and move with the arrow keys: focus stays in the search box and each highlighted command is read aloud.
- Press Enter on a command to run it, and Escape to ask the page to close the palette. Focus returns to where it was.
- With a screen reader, type a query: the number of results is announced, or the empty text when nothing matches.
- With text at 200% and the page 320 pixels wide, the panel stays whole and its body scrolls.
- In a forced-color mode, the highlighted command and the search box's focus ring are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Down Arrow | Moves the highlight to the next command, across groups, wrapping at the end. |
| Up Arrow | Moves the highlight to the previous command, across groups, wrapping at the start. |
| Enter | Runs the highlighted command. |
| Escape | Asks the page to close the palette. |
| Tab | Moves focus on to the controls after the search box, such as a "See all" button. |

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

- [Search field](../search-field/search-field.md): the field on a page; the palette is the panel that search can open.
- [Dropdown](../dropdown/dropdown.md): a short menu of actions on one thing.
- [Kbd](../kbd/kbd.md), [label](../label/label.md), [chip](../chip/chip.md), [button](../button/button.md), [divider](../divider/divider.md): the pieces.
