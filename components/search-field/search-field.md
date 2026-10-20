---
name: search-field
title: Search field
type: component
block: smbk-search
adaptStrategy: css
figmaNodeId: 4212:26902
status: candidate
---

# Search field

## Purpose

A text field whose value filters or searches something. It looks like the input and adds the two things a search needs: a magnifier that says what the field is for, and a clear control that empties it in one press. It can also show the key that jumps to it.

## Anatomy

- The block, always on the input's well: its markup carries the input's classes as well as its own.
- The magnifier, the input's icon part, always present.
- The control part, a native search control, which is also the input's control part.
- In error, the input's error icon, a warning sign after the query.
- The clear part, a cross button at the field's icon size inside a box the size of the least target a press needs, shown when there is something to clear.
- The kbd part, an optional small Kbd at the far end naming the key that jumps to the field, shown while the field is empty.

## When to use

- Filtering a list, a table or a sidebar on the page.
- A site search box.

## When not to use

- For any value that is not a query. Use the [input](../input/input.md).
- To pick a value from a list by typing part of it. Use a [combobox](../combobox/combobox.md), which suggests matches as the reader types.

## Behavior

Typing filters or searches, as the page decides. The clear control shows only while the field holds text, and the key hint only while it is empty, so the end of the field holds one of them at a time; pressing the clear control empties the field, calls back, and puts focus back in the field. Escape empties a field holding text in every browser, Safari too, and the page hears it as a change; in an empty field Escape is left to the page. The padding, the icon sizes, hover, focus, error, read-only, disabled and the md and sm sizes are the input's own, because the field is built on the input; a change to the input changes the search field too. The large size is the search field's own: 48 tall, with larger text and wider side padding, for a search that leads a page; its icons, clear control and key hint stay the medium field's. A read-only field shows neither the clear control nor the key hint, and Escape leaves it as it is. A disabled field fades its key hint with the media disabled opacity.

The key hint shows whatever the shortcut is, with a space between keys, e.g. "⌘ K". It is only a picture of the keys: the page that shows it must also wire the shortcut, or the hint is a promise the field does not keep.

The clear control is offered only when the field is given `onClear`. A field whose value the page does not control is emptied by the component when cleared; a field whose value the page controls must be emptied by the page in `onClear`. `onChange` passes the browser's own event, as the native field does.

## Accessibility

### What it does for you

- In development, a search field with no name logs a warning in the console.
- The clear control is a real button with an accessible name, "Clear search", and a box of 24 by 24 px, the least a press needs. Pressing it empties the field and puts focus back in the field.
- The browser's own clear control is hidden so there is one, styled, in the same place in every browser.
- The key hint is hidden from assistive technology.
- Escape empties a field holding text in every browser, Safari too, and the page hears it as a change.

### What you must do

- Give it a label like any input; a search landmark around it helps when it is the page's search.
- Change the clear control's name with `clearLabel` for a page in another language.
- When the page wires the shortcut, name it on the control with `aria-keyshortcuts`, which is where a screen reader looks for it. The hint alone is only a picture of the keys.

### How to test

- Type in the field: the clear control appears at its end. Tab to it and press Enter or Space: the field empties and focus is back in it.
- Press Escape in a field holding text: it empties. In an empty field, Escape is left to the page.
- With a screen reader, the field is read with its label as a search field, and the clear control as the button "Clear search". The key hint is not read.
- With text at 200% and the page 320 pixels wide, the text and the clear control stay inside the field.
- In a forced-color mode, the focus border and the text stay visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the field, then to the clear control when it shows. |
| Escape | Empties a field holding text. In an empty or read-only field, it is left to the page. |
| Enter or Space | On the clear control, empties the field and puts focus back in it. |

## Composition

The input's well, with the magnifier, the control, the clear control and, optionally, a small Kbd. Sits in toolbars, headers, the app bar, the sidebar, and above lists.

## Usage rules

### Do

- Show results or filter as the person types when the set is small; wait for Enter when a search is expensive.
- Show the key hint only on the one search field the shortcut reaches.

### Don't

- Put a search field inside a form that submits on Enter unless that is what searching does.

## Related

- [Input](../input/input.md): the plain text field.
- [Combobox](../combobox/combobox.md): a box that suggests matches from a list as the reader types.
