---
name: blur
title: Blur
summary: The frosted blur behind see-through surfaces, so a panel can show what lies behind it.
type: foundation
tokenGroup: blur
tiers: primitive
themeAware: false
densityAware: false
viewportAware: false
status: experimental
---

# Blur

## Purpose

The backdrop blur behind frosted surfaces: a caption over an image, a glass panel, sticky chrome over scrolling content. It is the depth companion to elevation, used where a surface should reveal what is behind it rather than sit opaquely on top.

## How it is structured

Steps named by their size, for a light frost, a glass panel, and the heavier blur that keeps sticky chrome readable over anything scrolling beneath it.

## Tiers

Primitive only, and it reaches CSS. There is no semantic role yet because no two components have needed the same blur under different names. That is worth being suspicious of; if a glass treatment becomes a shared role across components, it should gain a name here rather than being picked by step in each stylesheet.

## Usage rules

### Do

- Pair a blur with a see-through overlay surface from the color foundation. Blur on its own does nothing visible; the frost is the tint plus the blur.
- Keep glass an accent. One frosted region on a page is a treatment; three is noise.

### Don't

- Write a blur length in component CSS. The conformance checker rejects it.
- Use blur on a surface that has text directly behind it, unless the overlay tint is strong enough that the text behind cannot be read. Half-legible text behind a panel is worse than none.
- Animate the blur amount, or blur more than you need. Backdrop blur is costly to draw, and a large blurred region that scrolls slows the page on low-end devices. Use the smallest step that reads.
