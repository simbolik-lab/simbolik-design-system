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

- The block, a bordered card.
- The label part, a small heading with a rule under it; its words are the label text part.
- The list part, holding one item part per section. A child item sits indented under its parent.
- The item in view carries a line on its left: the indicator part, one line that moves to whichever item is current. Without the wrapper the current item draws the line itself.
- An optional extra part under the list, inside the same card and set off by the label's rule: content that belongs with the contents, such as a page's key facts. It is not navigation, so with it the card holds the navigation landmark and the extra part beside it.
- In a narrow space: the toggle part, a heading row that is a button (the icon part, the heading text, and the caret part at the far end), and under it the body part, a rule and the list. The label part is not shown there; the toggle carries the same words.

## When to use

- Documentation and long reading pages with three or more sections.

## When not to use

- Short pages. A list of two entries is noise.
- Moving between pages. Use the sidebar.

## Behavior

Each item scrolls to its section. Unless the consumer sets which item is current, the component watches the sections and marks the one in view: the last whose top has passed the upper third of the window, or the first before any has. Pressing an item marks it at once, the line sliding to it with the state motion and the words changing color with the feedback motion, and it stays marked until the reader scrolls on their own, so a short section near the end of the page, which cannot scroll up that far, is still marked when chosen. The line slides the same way as the reader scrolls from section to section, and lands at once when the page first draws or the list changes size; under reduced motion it never slides. How the page itself moves to a section is the page's choice: a page that wants it to glide sets smooth scrolling on its scrolling part, as the Showroom does. A long entry wraps onto more lines rather than being cut short; a short one keeps one line's height.

The form follows the layout switch, so a wrapper can force either. In a wide space the card always shows its list. In a narrow one it is a box the width of its column: pressing the heading row opens the list under a rule and presses again close it, the caret turning from pointing at the list to pointing down it. The list grows open with the enter motion and closes a little faster with the exit motion, and the caret turns with the state motion; under reduced motion all of it happens at once. It always starts closed, so the page's words are not pushed down (Figma's component shows it open only to draw the list); a page can start it open, as the open example does. The whole top of the box takes a press, not only the row's own small height.

## Accessibility

- A navigation landmark named by its heading, "On this page" by default. A page with more than one gives each its own name; to keep the heading and change only the name, give the name on its own.
- The current item carries the current marker, which screen readers announce.
- Items are links to the section ids, so they work without script.
- In a narrow space the heading row is a button that says whether the list is open and names the list it opens. A closed list is out of the tab order. Only one of the label and the button is ever shown, so the name is read once.

## Composition

Contains links only. Sits in a column beside the content, usually sticky. In a narrow space, where that column is gone, a page places it in the content instead, under the page's title and opening words.

## Usage rules

### Do

- Give every section a stable id.
- Keep titles short; the card is narrow.

### Don't

- Nest more than one level.

## Related

- Sidebar: moving between pages.
- Navigation item: the link used in menus.
