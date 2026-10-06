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
- The clear part, a small cross button, shown when there is something to clear.
- The kbd part, an optional small Kbd at the far end naming the key that jumps to the field.

## When to use

- Filtering a list, a table or a sidebar on the page.
- A site search box.

## When not to use

- For any value that is not a query. Use the input.

## Behavior

Typing filters or searches, as the page decides. The clear control shows only while the field holds text; pressing it empties the field, calls back, and puts focus back in the field. Escape empties a field holding text in every browser, Safari too, and the page hears it as a change; in an empty field Escape is left to the page. Hover, focus, error, disabled and the small size are the input's own, because the field is built on the input; a change to the input changes the search field too. A disabled field fades its key hint with the media disabled opacity.

The key hint shows whatever the shortcut is, with a space between keys, e.g. "⌘ K". It is only a picture of the keys: the page that shows it must also wire the shortcut, or the hint is a promise the field does not keep.

The clear control is offered only when the field is given `onClear`. A field whose value the page does not control is emptied by the component when cleared; a field whose value the page controls must be emptied by the page in `onClear`.

## Accessibility

- Needs a label like any input; a search landmark around it helps when it is the page's search.
- The clear control is a real button with an accessible name.
- The browser's own clear control is hidden so there is one, styled, in the same place in every browser.
- The key hint is hidden from assistive technology. When the page wires the shortcut, it names it on the control with `aria-keyshortcuts`, which is where a screen reader looks for it.

## Composition

The input's well, with the magnifier, the control, the clear control and, optionally, a small Kbd. Sits in toolbars, headers, the app bar, the sidebar, and above lists.

## Usage rules

### Do

- Show results or filter as the person types when the set is small; wait for Enter when a search is expensive.
- Show the key hint only on the one search field the shortcut reaches.

### Don't

- Put a search field inside a form that submits on Enter unless that is what searching does.

## Related

- Input: the plain text field.
