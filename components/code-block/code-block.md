---
name: code-block
title: Code block
type: component
block: smbk-code
adaptStrategy: css
figmaNodeId: 4255:6452
status: candidate
---

# Code block

## Purpose

Code shown as code: monospace, preserved whitespace, in a sunken well, with a bar above it for what the code is (a file name, or tabs for alternatives such as package managers) and small actions such as copy.

## Anatomy

- The block, a bordered container.
- The bar part, holding the tabs part at the start, the label part after it, and the actions part at the end. Either the tabs or the label may be left out; with both, the label sits between the tabs and the actions, as Figma draws it.
- The action part, a small square icon button inside the actions.
- The body part, the sunken well.
- The code part, the preformatted text.
- The status part, a status line out of sight, in a block with actions.

## When to use

- Any code or command a reader may copy: installation lines, snippets, configuration.
- The Showroom's own snippets.

## When not to use

- Inline code in a sentence. Use the code element with the mono face.
- A terminal or log that scrolls live. That is a different component.

## Behavior

Tabs switch which snippet is shown; the page supplies the snippet for each, and may keep one file name in the bar across them. Actions call back. Long lines scroll sideways inside the well rather than wrapping.

## Accessibility

- The code is a real preformatted code element, read as code.
- Each action is a button with an accessible name.
- What an action did is said aloud: a block with actions keeps a status line out of sight, in the page from the start, and the page puts the result in it (`status`, such as "Copied"), then empties it after a moment. A screen reader reads a status line whenever its words change, where many do not read a new name on the button that has focus (WCAG 2.2, 4.1.3 Status Messages).
- Tabs are the tabs component at its small size, a tab list with a name: say what the tabs choose between (`tabsLabel`), which is "Language" unless told otherwise. The body is their one panel, named by the tab that shows it, and Tab reaches it, so a long line can be scrolled with the keyboard.
- Without tabs, a body whose code runs past it is a region named by the bar's label, or "Code" when there is none, and Tab reaches it, so it can be scrolled with the keyboard. A body that fits takes no Tab. A bare block shows no bar, but a label given to it still names its body, so a page of several bare blocks can tell them apart; blocks with bars on one page take different labels for the same reason.

## Composition

Contains the bar and the body. Sits in documentation, articles and the Showroom.

## Usage rules

### Do

- Give a copy action to any snippet meant to be pasted.
- Name the bar label after the file or the language.

### Don't

- Put anything but code in the well. Comments belong in prose above it.

## Related

- Kbd: single keys.
- Tabs: the tab strip, at its small size.
