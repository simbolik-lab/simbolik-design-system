---
name: elevation
title: Elevation
summary: Shadows that show how far a surface seems to sit above the page.
type: foundation
tokenGroup: elevation
tiers: semantic
themeAware: true
densityAware: false
viewportAware: false
status: candidate
---

# Elevation

## Purpose

How far a surface appears to sit above the page, expressed as a shadow. Elevation says nothing about what overlaps what — that is stacking order, a separate foundation — and nothing about containment, which borders and surfaces provide. It is a depth cue, and the system uses it sparingly.

## How it is structured

A short run of levels, from a barely-there resting lift through hover and floating emphasis to the clear lift of a surface that genuinely sits above the page, plus inset shadows for surfaces that are pressed into their parent. Each level is a stack of shadow layers, pre-composed, so that a level is used whole.

The shadow colors are not literal. Every layer points at one of the semantic shadow tints from the color foundation, which is what lets a shadow change with the theme — a cool tint over light surfaces, a neutral darkening over dark ones — while looking the same in Figma in both.

## Tiers

Elevation has no primitive tier because a shadow is already the lowest thing in its category; its ingredients are lengths and the shadow tints, which are colors. The levels are semantic and all reach CSS, each as one custom property holding the whole shadow list with its colors still referencing the tints.

Backdrop blur, the depth companion for frosted surfaces, is its own small foundation.

## Context behavior

The theme changes every level, by way of the shadow tints it is built from. The build repeats the elevation declarations inside each theme's scoped block so that a themed region nested inside a page of the other theme gets the right shadow rather than the one inherited from the root.

Density and text size do not touch elevation.

## Usage rules

### Do

- Give a lifted surface the resting level at rest and the next level on hover, so hover reads as lift.
- Give menus, popovers and dialogs the floating level, and reserve the highest level for surfaces that genuinely live above the whole page.
- Use an inset shadow for a well: a pressed toggle track, a code area, a sunken input.
- Pair elevation with a border or a surface change. Elevation must not be the only cue that a surface holds something.

### Don't

- Write a shadow in component CSS. The conformance checker rejects it.
- Stack two levels on one surface. Each level is already a stack; two produce a muddy double shadow.
- Use elevation to fix weak hierarchy or poor contrast. Color and surface come first; elevation is the last lever.
- Draw a focus ring as a shadow. It is an outline, which survives forced-color modes where shadows vanish.
- Lift the page, its sections or a hero banner with a shadow. Large surfaces stay flat and the small things on them lift, such as cards, buttons and pills. A shadow loses its value fast when lifted surfaces are stacked.
- Raise a card's stacking layer to make it look lifted. Elevation and stacking order are chosen separately: a sticky header sits on the sticky layer and may have no shadow, while a card may have a shadow and sit on the base layer.
