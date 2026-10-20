---
name: icon
title: Icon
type: component
block: smbk-icon
adaptStrategy: css
figmaNodeId:
status: candidate
---

# Icon

## Purpose

A single glyph from the Phosphor set, drawn into one of the system's icon sizes and colored like the text beside it. It exists so that every component places icons the same way, and so that an icon's size is a token rather than a number.

To find a glyph, search [Phosphor's site](https://phosphoricons.com), which shows every icon with its name. The web font the design system ships is [on GitHub](https://github.com/phosphor-icons/web).

## Anatomy

One element, the glyph itself. It has no parts. The Phosphor font class selects which glyph is drawn; the block class sets the size box and the color behavior.

## When to use

Anywhere a component or a page needs a glyph: beside a label in a button, as the leading mark of a tag, as the only content of an icon-only control.

## When not to use

- For a [logo](../logo/logo.md) or an illustration. Those are images with their own components.
- For a status color on its own. An icon inherits color; it does not carry meaning by color, and color must never be the only cue (WCAG 1.4.1 Use of Color).

## Behavior

None. It is inert. Size follows the size axis or, more often, the component that places it, which overrides the size to match its own.

## Accessibility

### What it does for you

- An icon with no label is decorative and hidden from assistive technology.
- An icon given a label is turned by the React wrapper into an image role with that accessible name.

### What you must do

- Give a label to an icon that carries meaning on its own, such as an icon-only button or a status mark with no text.
- Load the Phosphor font for the glyph to render. A missing font shows nothing, so a meaningful icon should always have text or a label beside it.

### How to test

- With a screen reader, a decorative icon is skipped and a labeled one is read as an image by its label.
- Block the font from loading: a meaningful icon still has text or a label beside it that says what it meant.

## Composition

Placed inside any component that declares an icon part. Never contains anything.

## Usage rules

### Do

- Name the glyph as Figma names it or as Phosphor does; both spellings work and derive the same class.
- Let the containing component set the size. Set the size axis only for a free-standing icon.
- Link the Phosphor stylesheet in the page yourself. Nothing in the icon's stylesheet loads the font.

### Don't

- Set a color on an icon. It inherits; if the color is wrong, the text role beside it is wrong.
- Write a pixel size for an icon. The conformance checker rejects it; the icon size tokens are the only sizes.
- Draw an icon with a weight other than regular until the system decides otherwise. Only the regular weight of the font is loaded.

## Related

- [Button](../button/button.md), [Tag](../tag/tag.md), [Chip](../chip/chip.md), [Link](../link/link.md) and [Label](../label/label.md) place icons through their icon parts and set the size themselves.
