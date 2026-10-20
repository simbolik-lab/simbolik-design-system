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

Code shown as code: monospace, preserved whitespace, each kind of code in its own color and each line numbered, in a well, with a bar above it for what the code is (a file name, or tabs for alternatives such as package managers) and small actions such as copy.

## Anatomy

- The block, a bordered container.
- The bar part, holding the tabs part or the label part at the start and the actions part at the end. With tabs the bar shows no label: the tabs name the code.
- The label part, the label component's subtle look: a file icon, the icon part, then the file name.
- The action part, a small icon button in a 24 px square inside the actions, filled like a ghost button while hovered or pressed, and faint when it cannot be used.
- The body part, the well.
- The numbers part, the line numbers in a column before the code, quieter than the code.
- The code part, the preformatted text in the code style, the mono face, always left to right.
- A part for each kind of code it colors: keyword, declaration, string, number, function, type, tag, property, comment and punctuation, each in its code color.
- The status part, a status line out of sight, in a block with actions.

## When to use

- Any code or command a reader may copy: installation lines, snippets, configuration.
- The Showroom's own snippets.

## When not to use

- Inline code in a sentence. Use the code element with the mono face.
- Output that arrives line by line as a program runs. Use a [log](../log/log.md).

## Behavior

Given its language, the block colors each kind of code, in the manner of a familiar code editor: words that steer (`import`, `return`, `if`) in purple, words that declare (`const`, `function`, `class`) and tags and selectors in blue, text in quotes in orange, numbers in green, function names in yellow, types and components in teal, properties and keys in light blue, and comments and punctuation in gray. It reads CSS, HTML, JavaScript and TypeScript with or without JSX, JSON and shell commands, by their shape rather than their meaning, so an unusual line may stay one color; code in another language, or with no language given, stays one color. The language also picks the file icon before the label, or the label's file ending does. Each line is numbered unless the numbers are turned off; code of one line shows no number. The numbers are left out when the code is selected.

A page built without React colors its code the same way with the block's highlighter, beside the component, which cuts code into pieces and says each one's kind; markup written by hand puts each piece in a span with its part's class.

Tabs switch which snippet is shown; the page supplies the snippet for each. Actions call back; an action marked disabled takes no press. When the page gives an action another icon, such as a tick once its code is copied, the two icons cross-fade in the action's one place: the old one shrinks and blurs away and the new one comes in a little slower; under reduced motion they only cross-fade. The status line still says what happened. Long lines scroll sideways inside the well rather than wrapping. Code reads left to right on a right-to-left page too, its numbers on the left: markup written by hand gives the body and the code element `dir="ltr"`.

## Accessibility

### What it does for you

- The code is a real preformatted code element, read as code.
- Color is never the only way to tell code apart: the code reads the same without it, and each code color stands out from the well enough to read as text in both themes.
- The line numbers are hidden from screen readers and left out of a selection, so they are never read or copied with the code.
- Each action is a button with an accessible name.
- A block with actions keeps a status line out of sight, in the page from the start. A screen reader reads it whenever its words change, where many do not read a new name on the button that has focus (WCAG 2.2, 4.1.3 Status Messages).
- Tabs are the tabs component at its small size, a tab list with a name. The body is their one panel, named by the tab that shows it, and Tab reaches it, so a long line can be scrolled with the keyboard.
- Without tabs, a body whose code runs past it is a region named by the bar's label, or "Code" when there is none, and Tab reaches it, so it can be scrolled with the keyboard. A body that fits takes no Tab.
- A bare block shows no bar, but a label given to it still names its body.

### What you must do

- Put the result of an action in the status line (`status`, such as "Copied"), then empty it after a moment.
- Say what the tabs choose between (`tabsLabel`), which is "Language" unless told otherwise.
- Give blocks with bars on one page different labels, and give each bare block on a page a label, so a page of several blocks can tell them apart.

### How to test

- Tab through the block: each action takes focus, then the tab list, then a body that scrolls, with the focus ring showing in both themes and in a forced-color mode. Scroll a long line with the arrow keys.
- Press an action with Enter, then Space: each runs it once, and a screen reader says the status, such as "Copied".
- With a screen reader, the code is read as code, line numbers are not read, and tabs are read as a tab list named by `tabsLabel`.
- Select the code and copy it: line numbers are left out.
- With text at 200% and the page 320 pixels wide, the body scrolls sideways instead of cutting the code off.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus through the actions, then the tab list, then the body when the body scrolls or is the tabs' panel. |
| Enter or Space | Presses the focused action. |
| Left Arrow or Right Arrow | On a tab, moves to the previous or next tab and shows its code. On a body that scrolls, scrolls it sideways. |
| Up Arrow or Down Arrow | On a body that scrolls, scrolls it. |
| Home or End | On a tab, moves to the first or last tab. |

## Composition

Contains the bar and the body; the bar's label carries the label component's subtle look. Sits in documentation, articles and the Showroom.

## Usage rules

### Do

- Give a copy action to any snippet meant to be pasted.
- Name the bar label after the file or the language.
- Say the language, so each kind of code takes its color.

### Don't

- Put anything but code in the well. Comments belong in prose above it.

## Related

- [Log](../log/log.md): what a program prints as it runs.
- [Kbd](../kbd/kbd.md): single keys.
- [Tabs](../tabs/tabs.md): the tab strip, at its small size.
- [Label](../label/label.md): the look of the bar's file name.
