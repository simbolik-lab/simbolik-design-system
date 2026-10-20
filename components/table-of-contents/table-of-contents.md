---
name: table-of-contents
title: Table of contents
type: component
block: smbk-toc
adaptStrategy: css
figmaNodeId: 4505:11351
status: candidate
---

# Table of contents

## Purpose

Lists the sections of a long page so the reader can see its shape and jump to a part of it, and marks the section they are in as they scroll. It sits beside the content; the sidebar is for moving between pages, this is for moving within one. In a narrow space, where there is no column beside the content, it becomes a small box that opens and closes, set at the top of the page's body.

## Anatomy

- The block, a bordered box.
- The label part, the heading row: the icon part, a list icon, and the label text part, its words.
- The body part, a rule and under it the list part, holding one item part per section, the items touching. A child item sits indented under its parent, along a thin tree line that runs down the children.
- The item in view carries a brand line and its words one weight bolder: on a parent the line runs down its left edge, on a child it lights that child's stretch of the tree line. The line is the indicator part, one line that moves to whichever item is current. Without the wrapper the current item draws the line itself. Under the pointer an item's words and its line turn brand too.
- An optional extra part under the list, inside the same box and set off by the same rule: content that belongs with the contents, such as a page's key facts. It is not navigation, so with it the box holds the navigation landmark and the extra part beside it.
- In a narrow space: the toggle part takes the label's place, the same heading row as a button (the icon part, the heading text, and the caret part at the far end) that opens and closes the body. The label part is not shown there; the toggle carries the same words.

## When to use

- Documentation and long reading pages with three or more sections.

## When not to use

- Short pages. A list of two entries is noise.
- Moving between pages. Use the [sidebar](../sidebar/sidebar.md).

## Behavior

Each item scrolls to its section. Unless the consumer sets which item is current, the component watches the sections and marks the one in view: the last whose top has passed the upper third of the window, or the first before any has. Pressing an item marks it at once, the line sliding to it with the state motion and the words changing color with the feedback motion, and it stays marked until the reader scrolls on their own, so a short section near the end of the page, which cannot scroll up that far, is still marked when chosen. The line slides the same way as the reader scrolls from section to section, and lands at once when the page first draws or the list changes size; under reduced motion it never slides. How the page itself moves to a section is the page's choice: a page that wants it to glide sets smooth scrolling on its scrolling part, as the Showroom does. A long entry wraps onto more lines rather than being cut short; a short one keeps one line's height.

The form follows the layout switch, so a wrapper can force either. The two forms are drawn alike. In a wide space the box always shows its list. In a narrow one it is a box the width of its column: pressing the heading row opens the list under a rule and presses again close it, the caret turning from pointing at the list to pointing down it. The list grows open with the enter motion and closes a little faster with the exit motion, and the caret turns with the state motion; under reduced motion all of it happens at once. It always starts closed, so the page's words are not pushed down (Figma's component shows it open only to draw the list); a page can start it open, as the open example does. The whole top of the box takes a press, not only the row's own small height.

## Accessibility
### What it does for you

- It is a navigation landmark named by its heading, "On this page" by default.
- The current item carries the current marker, which screen readers announce. It is shown by its line and its bolder words as well as by color.
- Each item jumps to its section. Items are links to the section ids, so they work without script.
- In a narrow space the heading row is a button that says whether the list is open and names the list it opens. A closed list is out of the tab order. Only one of the label and the button is ever shown, so the name is read once.

### What you must do

- Give each of several tables of contents on a page its own name; to keep the heading and change only the name, give the name on its own.
- When the page keeps a bar stuck to the top of the window, give the page's root a top scroll padding of the bar's height so a section jumped to lands below the bar, not under it. The app bar that hides on scroll keeps that padding itself, and the header's page says how to give it to a header the page makes stick.

### How to test

- Tab to an item and press Enter: the page moves to its section, and the item is marked as current by its line and its bolder words.
- With a screen reader, it is found as a navigation region by its name, and the current item is read as current.
- In a narrow space, Tab to the heading row and press Enter or Space: the list opens, and the button says it is open. Closed, the list's items are skipped.
- With text at 200% and the page 320 pixels wide, a long entry wraps onto more lines rather than being cut short.
- In a forced-color mode, the focus ring and the words stay, and the current item is still marked by its bolder words.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus through the items. In a narrow space it moves to the heading button, and to the items only while the list is open. |
| Enter | On an item, scrolls to its section. |
| Enter or Space | On the heading button in a narrow space, opens or closes the list. |

## Composition

Contains links only. Sits in a column beside the content, usually sticky. In a narrow space, where that column is gone, a page places it in the content instead, under the page's title and opening words.

## Usage rules

### Do

- Give every section a stable id.
- Keep titles short; the box is narrow.

### Don't

- Nest more than one level.

## Related

- [Sidebar](../sidebar/sidebar.md): moving between pages.
- [Navigation item](../nav-item/nav-item.md): the link used in menus.
