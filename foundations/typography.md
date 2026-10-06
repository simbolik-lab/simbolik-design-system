---
name: typography
title: Typography
summary: The typefaces, text sizes and named text styles that every component sets its words in.
type: foundation
tokenGroup: typography
tiers: both
themeAware: false
densityAware: false
viewportAware: true
status: stable
---

# Typography

## Purpose

The vocabulary of text: which faces exist, which sizes exist, and the named presets that combine face, size, weight, line height, letter spacing and case into a role such as page title, body copy or uppercase label. Components consume presets. They do not compose text from raw values.

## How it is structured

Three groups, stacked.

At the bottom, the **typographic primitives**: the font families — a display face for headings, a body face for reading, and a monospace face for labels and code — plus runs of sizes, weights and letter-spacing steps. These are ingredients and reach nothing directly.

In the middle, the **text sizes**: a semantic run of named sizes for display, heading, body and label roles. This is the only layer that changes with the viewport, and it is the layer the presets read their size from.

On top, the **presets**: display registers, heading levels, a subtitle and a subheading, body sizes and label sizes. Each preset is one composite token. The label presets are uppercase and set in the monospace face; the case is carried out of the composite as a setting the component applies, because the token standard's text recipe has no slot for it.

The shape follows role families — display, heading, body, label — with headings independent of the HTML heading level a page chooses.

Tabular figures, digits of equal width for columns, counters and timers, are a CSS setting on the component that needs them, not a token.

## Tiers

Every text box in Figma is trimmed to its cap height, so a title sits exactly as far from the line above and below as its letters, not its line box. Components apply the same trim to their text parts, which is why a stack of text in the browser measures the same as its Figma frame. The line height still applies between lines.

Font families, sizes, weights and letter-spacing steps are primitives and do not reach CSS as custom properties, for the same reason primitive colors do not: the text ramp compresses at narrow widths, and a component reading a raw size would be blind to that. Semantic text sizes and the presets are what reach CSS. A preset becomes one custom property per part — family, size, weight, line height, letter spacing and text transform — because no single CSS property carries all of them without losing some.

## Context behavior

Text size follows the viewport and involves no choice. Below the switch width the text sizes take their minimum values; at and above it, the display and heading sizes step up, some by more than one step, while body and label sizes stay put. The switch width is itself a token, documented under Breakpoints, so the boundary is a design decision held in the token source rather than a number in a stylesheet.

Line heights are ratios, so they scale with the size on their own. Letter spacing is a fixed length, so it does not; the display and heading presets use no tracking, and only the smaller labels carry a little.

Theme and density do not touch typography.

## Usage rules

### Do

- Consume a preset by referencing all of its parts together. Longhand properties are always safe; the label presets additionally need their text transform applied.
- Match the preset to the role, not the size. A card title is the preset that card titles use; if it needs to be bigger, that is a different preset, not a size override.
- Choose the HTML heading level from document structure and the preset from appearance. They are independent (TYP-001).
- Use the label presets for every uppercase moment. Uppercase outside the label register is not part of the system.
- Let text reflow and grow. Components must survive 200% text scaling and the guideline's text-spacing overrides without clipping (TYP-002, TYP-003).

### Don't

- Write a font family, size, weight, line height or letter spacing in component CSS. The conformance checker rejects it.
- Apply uppercase to a body or display preset.
- Override one part of a preset with another preset's part. Mixing a heading's size with a body face is a new preset, and new presets are decided in Figma.
- Use a viewport media query on text inside a component. The text sizes already follow the viewport; a component that wants a different size at a different width wants a different preset.
- Leave any of the three faces unloaded. The font families carry no fallback fonts, so text set in a face that did not load will not appear as intended.
- Use a display preset more than once on a page, or in a product screen. Display presets are for one moment on a marketing or brand page; product screens stop at the largest heading.
