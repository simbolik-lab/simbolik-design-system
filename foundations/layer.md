---
name: layer
title: Stacking order
summary: Named layers that decide what sits on top when things overlap, such as a dialog above a menu.
type: foundation
tokenGroup: layer
tiers: semantic
themeAware: false
densityAware: false
viewportAware: false
status: candidate
---

# Stacking order

## Purpose

Which named layer a component occupies when things overlap. Every sticky element, floating surface and overlay reads a layer instead of writing a number, so that a dropdown can never accidentally sit above a modal and a modal can never sit below a scrim. Stacking order says nothing about how a thing looks; elevation does that.

## How it is structured

Layers named by purpose: the base of ordinary document flow, raised surfaces such as menus and popovers, sticky chrome that stays put while the page scrolls, the overlay that darkens the page, the modal surface above it, and a critical layer for system-level blocking or emergency interfaces. The values step up with wide gaps, leaving room for a component to sub-stack inside its own layer without crossing into the next.

Figma has no place for stacking order, so this group is authored in the token source.

## Tiers

Semantic only, and all reach CSS. There is no primitive tier because the values are flat and mean nothing outside their layer name.

## Usage rules

### Do

- Read a layer for any element that needs an explicit stacking context: sticky headers, dropdowns, tooltips, scrims, dialogs.
- Sub-stack inside a layer with a small addition to the layer's value — a dropdown's caret one above the dropdown — and no more.
- Prefer the browser's own top layer for modal dialogs and popovers opened through the native APIs, where the platform manages stacking for you.

### Don't

- Write a literal z-index in component CSS. The conformance checker rejects it.
- Cross layers by arithmetic. Adding to one layer to reach the next is a smell; reach for the next layer's name.
- Set a z-index to lift a card visually. That is elevation's job.
- Give page layout a stacking layer "just in case". Most layout does not overlap, and an element that sets a layer starts a stacking context, a box its children cannot rise out of. When a child's large value fails to rise above something, fix the ancestor rather than reaching for a bigger number.
- Use the sticky layer without scroll padding. A sticky region must never hide focused content. Pair it with scroll padding, the space the page keeps clear when it scrolls a focused element into view, so a keyboard user's focus never ends up under the header.
