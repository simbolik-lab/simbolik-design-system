---
name: picture-tile
title: Picture tile
type: component
block: smbk-picture-tile
adaptStrategy: css
figmaNodeId: 7119:143
status: experimental
---

# Picture tile

## Purpose

Lets someone choose among things best told apart by a picture: a look, a preset, a template, a theme. Each tile is one button with a picture on top and a short label under it, laid out in a grid that wraps. Pointing at a tile can preview it; pressing it chooses it.

## Anatomy

- The block, one button: a frame on the default surface with a thin edge and a small rounded corner, as wide as the cell it is given.
- The picture part, at a 4:3 or square proportion on the sunken surface. It holds the picture, an image placeholder while there is none, or a skeleton while it loads.
- The label part, one line of small body text under the picture, cut short with an ellipsis when it is too long.
- The tick part, shown on the chosen tile only: a check on a brand-colored disc at the picture's top corner.

## When to use

- A gallery of options that look different, where the picture says more than the name: filters, styles, layouts, templates.
- With one tile chosen, as a set of toggles where one is on.

## When not to use

- For an article or a product with a title, a description and actions. Use a [card](../card/card.md).
- For options that differ only by name. Use [radios](../radio/radio.md), a [segmented control](../segmented-control/segmented-control.md) or a [select](../select/select.md).
- For a picture that opens a larger view and nothing else. Use a link around the picture.

## Behavior

The tile fills the cell it is given and is never narrower than a small minimum, so a grid of tiles wraps on a narrow screen. Pointing at a tile strengthens its edge; pressing sinks it onto the sunken surface; keyboard focus draws the focus ring around it. The chosen tile shows a stronger edge at double width, a slight lift and the tick; pointing at it changes nothing more. A disabled tile dims its picture and label and cannot be pressed. A picture that fails to load gives way to the image placeholder, named by the picture's alternative text when it has one, so the tile never shows the browser's broken-picture mark.

## Accessibility

### What it does for you

- The whole tile is one native button and one Tab stop, named by its label.
- With `selected` set, true or false, the tile is a toggle and a screen reader says whether it is pressed.
- The picture is decoration with an empty text alternative, since the label names the tile.
- The tick, not only the edge's color, shows which tile is chosen. In high contrast mode the chosen edge and the tick take the highlight color.
- The label is cut short with an ellipsis when long, but the button's name is the whole label.
- A picture that fails to load gives way to the image placeholder, named by the picture's alternative text when it has one.

### What you must do

- Leave `selected` out for a tile that does something once when pressed.
- Give the picture a text alternative when it shows something the label does not say.
- Preview anything a tile previews on pointing also on keyboard focus: nothing may be shown by pointing alone.
- Keep labels short so everyone sees all of them.

### How to test

- Tab to a tile: the focus ring shows around it, in both themes and in a forced-color mode.
- Press Enter, then Space: each presses the tile. A disabled tile cannot be pressed.
- With a screen reader, a tile is read as a button by its whole label. A selecting tile is read as pressed or not pressed.
- With text at 200% and the page 320 pixels wide, the tiles wrap into fewer columns and each keeps its label.
- In a forced-color mode, the chosen tile's edge and tick are drawn in the highlight color.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the tile. A disabled tile is skipped. |
| Enter or Space | Presses the tile. |

## Composition

Holds a picture, an image placeholder or a skeleton, and its label. Never put a link or another button inside a tile. Tiles sit in a grid the page lays out, each filling its cell.

## Usage rules

### Do

- Keep labels to a word or two.
- Show the same subject in every tile, so only the option changes.
- Give each tile the same proportion in one gallery.

### Don't

- Put a button or a link inside a tile.
- Mix tiles that choose with tiles that run an action in one gallery.

## Related

- [Card](../card/card.md): an article or an item with several actions.
- [Choice card](../choice-card/choice-card.md): one of several options described in words.
- [Image placeholder](../image-placeholder/image-placeholder.md) and [skeleton](../skeleton/skeleton.md): what a tile shows before its picture arrives.
