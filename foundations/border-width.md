---
name: border-width
title: Border width
summary: How thick a line is: hairlines that separate, the edges of controls, and thick rules for accents.
type: foundation
tokenGroup: border-width
tiers: both
themeAware: false
densityAware: false
viewportAware: false
status: candidate
---

# Border width

## Purpose

How thick a line is. There are only a few thicknesses, because a border is rarely the right way to call attention: color, elevation and radius almost always say it better, and thickness is the last lever.

## How it is structured

Primitive steps named by their size, and semantic roles that say what each is for: a hairline for separation, the default for control edges and emphasis, and a thick line for accent rules and stripe callouts. The focus ring reads its width from its own token, which aliases one of these steps.

## Tiers

Both tiers reach CSS. Use the semantic role; the primitives exist so the focus ring and any future role can alias them, and for the rare fixed internal line that has no role.

## Usage rules

### Do

- Draw separators and dividers with the hairline.
- Draw control edges — fields, outline buttons, selection boxes — with the default width.
- Reserve the thick line for accent rules and stripe callouts on the left edge of a callout or quote.

### Don't

- Write a pixel border width in component CSS. The conformance checker rejects it.
- Use the thick line as a component outline. A thick outline reads as an error or a selection, and the selection and invalid states have their own colors.
- Compose a focus ring from a border. The ring is an outline built from the focus tokens.
- Rely on the width alone to show a control's edge. The edge must stay visible in both themes and under forced colors, so its color must also reach a contrast of at least 3:1 against the surface it sits on.
