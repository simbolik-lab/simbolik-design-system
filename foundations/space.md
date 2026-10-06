---
name: space
title: Spacing
summary: The distances inside and between things, from a control's padding to the rhythm between sections of a page.
type: foundation
tokenGroup: space
tiers: both
themeAware: false
densityAware: true
viewportAware: false
status: candidate
---

# Spacing

## Purpose

The vocabulary of distances: padding inside things, gaps between things, and the rhythm between sections of a page. It is dense at the small end, where a few pixels change how a control feels, and coarser at the large end, where the eye reads rhythm rather than measurement.

## How it is structured

The primitive scale is a run of steps named by their size. The steps sit close together at the small end and grow further apart toward the large end. Nothing about a step says what it is for; it is a length and nothing else.

The semantic layer names the *kind* of distance, which is the thing that changes with density:

- **Inset** — padding inside a thing: a button, a card, a field.
- **Stack** — the gap between things arranged vertically.
- **Inline** — the gap between things arranged horizontally.
- **Section** — the vertical rhythm between sections of a page.
- **Gutter** — the breathing room at a section's inline edges.

Each kind has its own run of sizes, and the runs are not the same length. Inline distances stop earlier than stack distances because things side by side never need the breathing room that stacked sections do. Component spacing is named by role, so that a density change can move a coherent set of decisions rather than every number at once.

The gutter is a section's own breathing room at its sides, not a page gutter. How close a page's content sits to the screen's edge is not part of the system: each site chooses its own page gutter.

## Tiers

Both tiers reach CSS. A component's *fixed* internal distance — the gap between an icon and its label inside a button, the padding of a chip — may use a primitive step directly, because that distance does not change with theme, density or viewport, and forcing a named role onto every one of them would make a semantic layer of single-use entries with no meaning.

The semantic roles are mandatory for any distance that *does* change with context. If a distance ought to be tighter under compact density, it must be a semantic role, because a primitive has one value and nothing can re-point it.

## Context behavior

Density changes the semantic roles and nothing else. Under compact density each role steps down one or more primitive steps. The smallest inset does not shrink, because it cannot become smaller and still be an inset; the largest section rhythm shrinks the most.

Density is chosen once by the person building a project and set as an attribute on the page element. It is never a reader-facing control and never follows the viewport. A phone does not get tighter sections by itself; a project that wants tighter sections chooses compact.

Theme and text size do not touch spacing.

## Usage rules

### Do

- Use a spacing token for every padding, margin, gap and structural offset. The conformance checker rejects a bare length in those properties.
- Use the semantic role that names the kind of distance — inset for padding, stack for vertical gaps, inline for horizontal gaps, section for page rhythm — whenever the distance should follow density.
- Use a primitive step for a fixed internal distance that should look the same under both densities.
- Compose with `calc()` from existing steps when a distance genuinely falls between them, rather than writing the result as a number.

### Don't

- Write a pixel or rem length in component CSS or in a site built on the system. The conformance checker rejects it.
- Create a mobile-suffixed or dark-suffixed spacing token. Context changes a value, never a name.
- Use a section rhythm inside a component. Section distances are the page's; a component that needs that much space is probably a section.
- Use a viewport media query to change a spacing value. If a distance should change with available width, use a container query, and reach for it only when the semantic roles cannot express the need.
