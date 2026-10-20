---
name: shadow-editor
title: Shadow editor
type: component
block: smbk-shadow-editor
adaptStrategy: css
figmaNodeId: 7417:172
status: experimental
---

# Shadow editor

## Purpose

Edits one shadow, such as a design system's shadow level: a preview card drawn with it, its layers from top to bottom, each with its offsets, blur, spread, color and opacity, and a button to add a layer. It is for tools that edit a design system's elevation. To show a shadow without editing it, draw it on a card.

## Anatomy

- The block: a column of the preview, the layers and Add layer, each part of which can be left out but the layers.
- The preview part: a well of the canvas color holding a card (the card part) on the default surface, raised by the shadow being edited.
- The layers part: a list of the layer part, top layer first. Each layer is a card on the default surface inside a subtle edge:
  - the head part: the move handle (the handle part, shown when there are two layers or more) and the layer's name, such as "Layer 1" (the name part), then the Remove button (the remove part), which can be left out;
  - the fields part: four small number boxes, X, Y, Blur and Spread, each under its label (the field and label parts);
  - the paint part: the color picker's field and the opacity box, in percent.
- The add part: a ghost button, "Add layer".

## When to use

- To set the layers of a shadow, and see it as it is set.

## When not to use

- To choose among a system's shadow levels by name. Offer them by name.
- For a shadow of one hard layer, which reads as a line: soft shadows are two or three layers.

## Behavior

Each change is drawn on the preview at once and reported to the page with every layer. `shadowToCss` writes the layers as a CSS `box-shadow`. A layer's color keeps its code; its opacity is the layer's own, so the color's own opacity is replaced. Blur never goes below 0. A layer marked as inset stays inset, though the editor offers no switch for it.

Remove takes a layer out; Add layer adds one at the foot. A layer's handle moves it up and down the list, dragged or with the arrow keys; the first layer is drawn on top.

On a touch screen the move handle keeps its size and takes an invisible press area round it, out to the comfortable touch target.

## Accessibility

### What it does for you

- The layers are a list. Each box is named with its layer and its label, such as "Layer 1 Blur in pixels".
- The move handle is a button named "Move Layer 1"; the up and down arrow keys move its layer, and focus stays on it. Dragging is never the only way.
- Remove is named with its layer, "Remove Layer 2". After it, focus moves to the layer that takes its place, or to Add layer when none is left. Add layer moves focus to the new layer's first box.
- Each change to the list is said politely: "Layer 3 added", "Layer 2 removed", "Layer 1 moved to place 2 of 3".
- The preview is hidden from screen readers; the numbers are the content.
- Every word it says by itself, such as the layers' names, the labels and what it says as layers change, keeps its English unless the page gives its own.
- On a touch screen the move handle keeps its size and takes an invisible press area round it, out to the comfortable touch target.
- In a forced-color mode, the edges of the preview and the layers are drawn in the reader's text color.

### What you must do

- Give the layers' names, the labels and the announcements in the page's own language when the page is not in English.

### How to test

- Tab to a layer's boxes and type a number: the preview changes at once. Tab to a move handle and press Up Arrow or Down Arrow: the layer moves, focus stays on the handle, and the move is announced.
- Press Enter on Remove: the layer goes and focus moves to the layer that took its place, or to Add layer when none is left. Press Enter on Add layer: focus moves to the new layer's first box.
- With a screen reader, the layers are read as a list, each box by its layer and its label, and each change is announced politely.
- With text at 200% and the page 320 pixels wide, the layers' boxes stay whole and reachable.
- In a forced-color mode, the edges of the layers and the preview stay visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus through the controls of each layer in turn, then to Add layer. |
| Up Arrow or Down Arrow | On a move handle, moves its layer up or down the list. Focus stays on the handle. |
| Enter or Space | On Remove or Add layer, presses it. |

## Composition

The boxes are the system's number field, small, without its buttons; the color is the color picker's small field; Remove is a ghost icon button and Add layer a ghost button. The editor fills the width it is given.

## Usage rules

### Do

- Keep a shadow to two or three soft layers.

### Don't

- Hide Remove and Add layer where the reader is meant to change how many layers there are.

## Related

- [Color picker](../color-picker/color-picker.md): the color of a layer.
- [Number field](../number-field/number-field.md): one number to type.
- [Card](../card/card.md): where a shadow is drawn.
