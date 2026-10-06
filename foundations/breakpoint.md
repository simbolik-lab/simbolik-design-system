---
name: breakpoint
title: Breakpoints
summary: The screen widths at which text grows, components take their wide form and a page makes room for its side columns.
type: foundation
tokenGroup: breakpoint
tiers: semantic
themeAware: false
densityAware: false
viewportAware: true
status: experimental
---

# Breakpoints

## Purpose

The viewport widths at which a page changes how it behaves: where the text sizes step up, where components take their wide form, and where a documentation page makes room for a column on each side of its content. They are design decisions rather than layout facts. Each is a token so that the switch point lives in the token source, next to what it switches, rather than as a number typed into a stylesheet.

## How it is structured

Semantic tokens, each aliasing one of the viewport steps in the size foundation and named for what it switches:

- **Text size** — the width at and above which the text sizes take their maximum values.
- **Layout** — the width at and above which a page counts as wide, so components that reflow for narrow spaces take their wide form.
- **Side columns** — the width at and above which a documentation page has room for a column on each side of its content: the sidebar on one side, the table of contents on the other. Between the layout switch and this width the page keeps one side column: the table of contents moves into the page and the sidebar starts as its column of icons.

They introduce no new measurement, and the text-size and layout switches alias the same step, so the two change together. The structural breakpoints themselves — the widths at which a page layout may change shape — are the viewport steps and are documented under Size; they are primitives, because a breakpoint belongs where the content stops fitting rather than at a named device, and a primitive width carries no claim about intent.

## Tiers

Semantic only. Each reaches CSS as a custom property, and the build also writes the text-size switch's resolved value into the media query that switches the text sizes, because a custom property cannot be used inside a media query's condition.

## Context behavior

The text-size token is what *causes* the text-size context. Below it, min; at and above it, max. The layout token sets the layout switch the same way: below it a page counts as narrow, at and above it wide, and any element can force either with the layout attribute. The side-columns token sets no context of its own: it is for a page's layout, which keeps one side column below it and makes room for both at and above it. None of them changes with any context itself.

The layout switch is a custom property every element inherits, not a media query. A component reads it with a style container query, so a wrapper that forces narrow or wide reaches everything inside it.

## Usage rules

### Do

- Read the switch width from the build's TypeScript or JSON output when a script or a page-level stylesheet needs the number at build time.
- Let the text sizes follow the text-size token, and let components read the layout switch rather than any width. A component responds to its own space, and the switch can be forced on any wrapper.

### Don't

- Repeat the value as a literal in a media query. If a stylesheet must switch at the same width, it should be generated from the token, as the token build's own stylesheet is.
- Use a breakpoint to switch spacing or density. Density is chosen, not measured.
