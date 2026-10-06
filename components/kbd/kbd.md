---
name: kbd
title: Kbd
type: component
block: smbk-kbd
adaptStrategy: css
figmaNodeId: 888:8
status: candidate
---

# Kbd

## Purpose

A keyboard key, drawn as a small raised keycap, for showing shortcuts in menus, tooltips, search fields and help text. It is the one place a single character is set in the label face at a fixed height.

## Anatomy

One element, the keycap, holding the key's symbol or name. Its height is fixed by the size; its width is the text plus the side padding, so it is near square for one character and grows to fit a word or a shortcut.

## When to use

- A shortcut beside a menu item or in a tooltip.
- A sequence of keys in help text, one keycap per key.

## When not to use

- For a badge or a tag that happens to be small. Those have their own components.
- For a button. A keycap is not pressed.

## Behavior

None.

## Accessibility

It is a real keyboard element, which assistive technology announces as keyboard input. Symbols such as the command glyph should be given a readable name through a title or surrounding text, because a symbol alone may be read as nothing.

## Composition

Contains text only. Sits inline in text or in a row of keycaps.

## Usage rules

### Do

- In help text, use one keycap per key and write the joining plus sign outside them.
- Where one keycap stands for a whole shortcut, as in the search field's key hint, put a space between the keys: "⌘ K".

### Don't

- Put an icon in a keycap. The Phosphor set has no key glyphs, and the label face is the design.

## Related

- Tooltip and dropdown show shortcuts with it.
