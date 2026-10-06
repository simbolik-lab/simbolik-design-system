---
name: size
title: Size
summary: How big things are: control heights, icon boxes, touch targets and the widths content may grow to.
type: foundation
tokenGroup: size
tiers: both
themeAware: false
densityAware: true
viewportAware: false
status: candidate
---

# Size

## Purpose

The vocabulary of widths and heights that are not distances between things: how tall a control is, how big an icon is, the smallest box a finger can hit, how wide a column of content may grow, and the widths at which a layout may change shape. Spacing says how far apart; size says how big.

## How it is structured

Primitives come in three runs. A run of small steps for controls, icons and boxes; a run of content widths for columns of reading and page content; and a run of viewport widths that name the structural breakpoints. They share a group because they are all sizes, but they are read by different roles and are not interchangeable.

The semantic roles say what is being sized:

- **Control** — the height of interactive things: buttons, fields, selects.
- **Icon** — the box an icon glyph is drawn into, from the smallest inline marker to the large decorative size.
- **Target** — the tap-area floors: the minimum the accessibility guidelines allow, and a more comfortable target for primary touch actions.
- **Selection** — the box of a checkbox or radio.
- **Display** — the size of a visual mark such as an avatar or a status dot.
- **Content** — the widths a column of content may grow to, from a narrow prose measure to the full page line.
- **Sidebar** — the width of the expanded sidebar, authored here because Figma has no place for it.

## Tiers

Both tiers reach CSS. Use a semantic role wherever the thing being sized has a name in the list above, because that is what lets a density change move every control together. A primitive step is for a fixed internal measurement with no role — the width of a caret, the thickness of a progress bar.

The viewport steps are primitives with no semantic layer, on purpose: a breakpoint is a structural fact about a layout, not a design intent, and a breakpoint belongs where the content needs a structural change rather than at a named device. The semantics that do sit on viewport steps are the breakpoints, documented under Breakpoints.

## Context behavior

Density changes the control heights and nothing else in this group. Compact controls are one step shorter, except the smallest, which does not shrink because it is already at the minimum target floor. Icons, targets, selection boxes and content widths are the same under both densities, and target floors in particular must never compress.

Theme and text size do not touch size.

## Usage rules

### Do

- Size a control by its role, never by a primitive, so that density reaches it.
- Give every interactive element at least the minimum target, and primary touch actions the comfortable target, even when the visible control is smaller. Padding or a pseudo-element can carry the difference.
- Size icons by the icon roles, and let them inherit their color from the text they sit beside.
- Cap reading text at a content width. Readability depends on line length, and the content roles are the sanctioned measures.

### Don't

- Write a pixel width or height in component CSS. The conformance checker rejects it.
- Use a control height as a spacing value, or a spacing step as a height. The two groups look similar in value and mean different things.
- Reference a viewport step inside a component to change its own layout. A component responds to the space it is given with a container query; viewport steps are for page-level structure.
- Shrink a target below the minimum floor for any density.
- Put a viewport step's custom property in a media query. CSS cannot read a custom property in a media query's condition, so take the number from the build's TypeScript or JSON output at build time instead.
- Size a checkbox or radio box with an icon size, or an icon with a selection size. Some match in value today by coincidence, and either can change without the other.
