---
name: navigation-menu
title: Navigation menu
type: component
block: smbk-navigation-menu
adaptStrategy: css
figmaNodeId: 8217:3602
status: proposed
---

# Navigation menu

## Purpose

A site header's links, where an item with a caret opens a wide panel under the row: columns of links, each with an icon, a title and a line saying what is there, and an optional featured column with a picture and one link. It suits a site with more pages than a row can hold, grouped so a visitor can see what each section offers before going there. For a short list of links under one item, the header's own dropdown is enough.

## Anatomy

- The block, a navigation landmark, named "Main" unless given another name.
- The list part, the row of items.
- The item part, one entry in the row: a navigation item that links, or one with a caret, the trigger part, that opens its panel.
- The panel part, under the row, lined up with its start or end edge: on the overlay surface with the overlay shadow.
- The column part, one list of links under an optional heading part that names it.
- The link part, one link in a panel: the link icon, then the link title over the link description.
- The featured part, optional, at the panel's end: a picture, the featured title and description, and a link.

## When to use

- The main links of a marketing site or a documentation site, with sections that each hold several pages worth describing.
- A header where a visitor benefits from seeing a section's pages, and what each is for, before choosing one.

## When not to use

- A few links under one item, with no descriptions. Use the [header](../header/header.md)'s links, whose dropdown lists them.
- Actions, such as Rename or Delete. Use the [dropdown](../dropdown/dropdown.md).
- An app's own navigation between its views. Use the [sidebar](../sidebar/sidebar.md) or the [app bar](../app-bar/app-bar.md).

## Behavior

Pressing an item with a caret opens its panel under the row and raises the item, and the caret turns; pressing it again closes it. One panel is open at a time: opening another closes the first. Escape, a press anywhere outside the item and its panel, or Tab moving focus past the panel's last link close it. The panel drops in and fades as it opens and fades out as it closes; under reduced motion it only fades.

With `openOnHover`, in a wide space a panel also opens while a mouse rests on its item and closes a moment after the mouse leaves the item and its panel. A press still opens it, and a press on a panel the mouse opened keeps it open, so touch and the keyboard work the same either way. It is off by default: a panel that opens as the pointer passes over the row gets in the way.

The panel lines up with the row's start edge, or with its end edge (`align="end"`) for links at the end of a header, so it stays on the page.

In a narrow space, as on a phone, the row stacks into a list, each item fills it with its caret at the far end, and a panel opens in place under its item, its columns and its featured column one under another. There it stays open until its item is pressed again or Escape is pressed, as a group in a list does.

## Accessibility

### What it does for you

- It follows the disclosure pattern for navigation, not a menu: a navigation landmark holding a list, where an item that opens a panel is a button saying whether its panel is open (`aria-expanded`) and which panel it controls (`aria-controls`). Screen readers read the links as links, and Tab moves through them in order.
- The panel follows its button, so Tab goes from the button into the open panel's links, and past the last one to the next item.
- Escape closes the open panel and puts focus back on its button when focus was inside it.
- Each column's links are a list named by its heading. The featured link is described by the featured title, so "Read the notes" is heard with what it is about.
- The current page's link is marked `aria-current="page"` and sits on the selected surface.

### What you must do

- Give the block a name of its own when a page has more than one navigation landmark, such as "Main" and "Footer".
- Write each link's title and description so they make sense heard alone, and keep the featured link's words short; the title describes it.
- Give a featured picture an empty `alt` when it only decorates, or words when it says something the title does not.
- In markup written by hand, the buttons need script to open and close their panels and to set `aria-expanded`; without it, give each item a link to its section's own page instead.

### How to test

- Tab to an item with a caret and press Enter: the panel opens and the button is announced as expanded. Tab moves through its links; Escape closes it and focus is back on the button.
- Press outside the open panel: it closes.
- With a screen reader, the block is read as navigation by its name, each item as a link or a button with its state, and each column as a list by its heading.
- With the page 320 pixels wide, the items stack and a panel opens under its item; nothing scrolls sideways.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves to the next item, or through the open panel's links; past the last link the panel closes. |
| Enter or Space | Opens the focused item's panel, or closes it when it is open. |
| Escape | Closes the open panel and puts focus back on its button. |

## Composition

It sits in a site's header bar, in place of a plain row of links, with the logo before it and a call to action after it. A panel holds columns of links and at most one featured column; nothing else goes in a panel, and panels do not nest.

## Usage rules

### Do

- Group a section's pages into two or three columns under short headings.
- Keep each description to one line that says what a reader finds there.
- Use `align="end"` when the links sit at the end of the header.

### Don't

- Put actions or form controls in a panel.
- Make a top item both a link and the opener of a panel: give the section's own page a link in its panel instead.
- Turn `openOnHover` on in a row a visitor has to cross to reach the rest of the page.

## Related

- [Header](../header/header.md): a site's header bar, whose own links open a short dropdown.
- [Navigation item](../nav-item/nav-item.md): the items of the row.
- [Dropdown](../dropdown/dropdown.md): a list of actions or choices over the page.
- [Link](../link/link.md): the featured column's link.
