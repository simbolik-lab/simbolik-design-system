---
name: collapsible
title: Collapsible
type: component
block: smbk-collapsible
adaptStrategy: css
figmaNodeId: 8196:2813
status: proposed
---

# Collapsible

## Purpose

One row that shows or hides the content under it, so detail most readers can skip stays out of the way until someone asks for it: older releases under the latest one, the advanced settings under the usual ones. It is a single quiet row, with no card around it. Several sections that each open on their own belong in an accordion.

## Anatomy

- The block, a native disclosure element around the row and its panel.
- The trigger part, the row that opens and closes it: the disclosure's summary, the medium control height, padded at its sides.
- The icon part, optional, before the label.
- The label part, the row's words, taking the room the icon and the caret leave.
- The caret part, at the far end, which turns while the block is open.
- The panel part, what shows while open, set in from the sides to line up with the label's row.

## When to use

- Detail most readers can skip, under the content they need: earlier versions, the full list behind a short one, settings only some people change.
- One optional section on a page or in a form, where a card would weigh too much.

## When not to use

- Several sections, each a heading with its content. Use the [accordion](../accordion/accordion.md).
- Content most people need. Show it.
- Moving between views of the same thing. Use [tabs](../tabs/tabs.md).
- Opening a list of actions or choices over the page. Use the [dropdown](../dropdown/dropdown.md).

## Behavior

Pressing the row opens or closes the panel, and the caret turns with it. The panel unfolds with the expand motion and folds back the same way: the height grows from the row while the content fades in from a slight blur, and the foot of what shows fades rather than meeting the edge with a hard cut. A press halfway turns it round from where it is. The React component moves it, the same in every browser, and a page that holds the open state (`expanded`) moves it with the same motion. Markup written by hand is moved by the stylesheet where the browser can animate to a natural height, and opens at once elsewhere. Under reduced motion the height changes at once and the fade still plays.

Hover and keyboard focus lay a soft surface under the row; focus adds its ring. The block fills the width it is given. On a touch screen the row keeps its height and takes an invisible press area out to the comfortable touch target.

A browser's find in page can open it to show a match inside; the React component then reports it open.

## Accessibility

### What it does for you

- It is a native disclosure element, so Enter and Space open and close it and its open state is announced, with no script of yours.
- The row's name is its label. The icon and the caret are hidden from assistive technology.
- A disabled collapsible cannot be opened or closed, by the mouse, the keyboard or a screen reader's press. Its row stays in the tab order and is announced as unavailable.

### What you must do

- Write a label that says what the panel holds or what pressing does, such as "Show older releases".
- Wrap the label in a heading element when the panel is a section of the page with a heading of its own.
- Use the React component for a disabled collapsible, or leave it out. In markup written by hand only the mouse is kept off a disabled row, since a screen reader can still press it.

### How to test

- Tab to the row: the focus ring shows, in both themes and in a forced-color mode.
- Press Enter, then Space: each opens or closes the panel.
- With a screen reader, the row is read as a disclosure by its label, with its open or closed state.
- With text at 200% and the page 320 pixels wide, the label wraps and nothing is cut off.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the row, a disabled one included. |
| Enter or Space | Opens the panel, or closes it when it is open. A disabled row does nothing. |

## Composition

The panel holds any content: paragraphs, a list, a form's further fields. It sits on a page, in a form or inside a card. A collapsible inside another collapsible hides content two presses deep; avoid it.

## Usage rules

### Do

- Keep the label to one line, and say what is inside.
- Start it closed, unless most readers need what it holds; then do not hide it.
- In markup written by hand, give the block `smbk-collapsible`, the summary the trigger part and the content the panel part, and mark the summary `aria-disabled="true"` with the disabled modifier on the block when it cannot be opened.

### Don't

- Hide something a reader must act on, such as an error or a required field.
- Stack several one under another to make a list of sections. That is an accordion.

## Related

- [Accordion](../accordion/accordion.md): several sections that each open to show their content.
- [Tabs](../tabs/tabs.md): switching between views rather than showing more.
- [Dropdown](../dropdown/dropdown.md): a list of actions or choices over the page.
