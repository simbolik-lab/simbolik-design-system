---
name: opacity
title: Opacity
summary: The fade for a whole element that should read as unavailable, such as a disabled picture.
type: foundation
tokenGroup: opacity
tiers: primitive
themeAware: false
densityAware: false
viewportAware: false
status: candidate
---

# Opacity

## Purpose

The fade applied to a whole element when it should read as unavailable. Opacity is a last resort. When the intent is "less prominent", a subtle text color or a subtle surface almost always reads cleaner; opacity is right only when the *entire* element — glyph, label, chrome — should fade together, and disabled media is the case the system currently names.

## How it is structured

Deliberately small: it holds only the fade for disabled media, and a new fade is added only when something needs it.

## Tiers

Primitive only, and it reaches CSS. It has no semantic tier because it is already named by its use; if a second use arrives, that is the moment to decide whether a semantic layer is warranted.

## Usage rules

### Do

- Fade disabled images and media with this value.
- Pair any disabled fade with the real disabled state — the attribute or the pointer rule — so that what looks unavailable is unavailable. Disabled styling must stay perceivable and understandable, and a fade alone is neither.

### Don't

- Write a literal opacity in component CSS. The conformance checker rejects it.
- Fade text to make it secondary. Use the subtle text roles; faded text over a colored surface produces an off-brand mid-tone that no token names.
- Fade a disabled control. Controls have their own disabled colors in the action and border groups, which keep the label readable.
