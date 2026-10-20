---
name: color
title: Color
summary: Colors named by the job they do, each with a light and a dark value, so one stylesheet serves both themes.
type: foundation
tokenGroup: color
tiers: both
themeAware: true
densityAware: false
viewportAware: false
status: experimental
---

# Color

## Purpose

The color vocabulary every component and every site built on the system draws from. Each semantic color answers a role question — what a page sits on, what body text is, what a control's edge is, what a brand button looks like when pressed — and resolves to a different raw shade in the light and dark themes. Components never know which shade they end up painting; they only know the role, which is what lets one stylesheet serve both themes without a line of theme-specific code.

## How it is structured

Two layers, and only the top one is ever consumed.

Underneath sit the ramps: one grey, and a family for each hue the roles need, each a run of steps from lightest to darkest, plus see-through ramps of black, white, the brand red and the greys for tints and shades that must work over anything. Every family shares one contrast ladder: a step number means the same contrast against white in every family, so a role that needs more contrast moves one step in any family and no in-between shade is invented. The steps were worked out in OKLCH, so a family keeps its hue as it gets lighter or darker, and are stored as hex, the value that ships and is measured.

On top sit the roles, grouped by what they are for:

- **Surfaces** — the things content sits on: the canvas of the page, the default surface, a raised surface above it, a sunken one below it, the brand fill, the inverse fill for dark-on-light moments, and see-through overlays.
- **Text and icons** — a hierarchy from default through subtle to subtlest, plus disabled, brand, accent, the inverse and on-brand variants, and a family of link states with their underlines.
- **Borders** — subtle and strong separation, control edges with hover, disabled and selected states, focus edges for controls and for fields, the brand and inverse edges, and the edge pairs that draw the highlight and shade lines of a divider.
- **Actions** — one group per button kind, each carrying its own background, foreground and border with hover, pressed and disabled states. This is where interactive color lives, and a component that is a button reads from here rather than from surfaces and text.
- **Feedback** — success, information, warning and danger, each with a solid surface, a subtle surface, text for each, and a border for each.
- **Shadows and the scrim** — the tints that elevation shadows are built from, and the darkening layer behind modal surfaces.
- **Data** — the colors charts draw their data in, grouped by the job they do: a series color for a chart with one series, with a stronger step under the pointer; categorical colors for series that are different things, in a fixed order; a sequential scale of one hue from less to more; a diverging scale of two hues out from a gray middle; and a reference line for a target or a limit. The sequential scale runs the other way in the dark theme, so more always stands out most.

The colors are grouped by role: surface, text and icon, border, action and feedback roles, with primitives beneath. A role belongs to the group that describes *what the color is doing*, not what it looks like. Shadow tints are colors because elevation is composed from them and they must follow the theme.

## Tiers

The ramps are primitive. The roles are semantic. Only semantic colors reach CSS at all; the build does not emit a primitive color as a custom property, so a component cannot reference one even by accident. This is deliberate: a component painted with a ramp step looks right in one theme and wrong in the other, and nothing catches it until someone switches.

A new semantic color is warranted when a role appears in more than one component and no existing role describes it. It aliases a ramp step; it never carries its own literal. A new ramp step changes the ladder every family shares, so it is added in Figma to the whole ladder or not at all.

## Context behavior

Every semantic color has one name and two values. The theme is chosen by the person reading the page — through an attribute on the page element, or by their system preference when the page has not chosen — and each role re-points to a different ramp step. Most roles flip in some way; a few, such as text on the brand fill, are the same shade in both themes because the surface they sit on does not change.

Density and text size do not touch color.

## Usage rules

### Do

- Reference a semantic color for every color expression in component CSS: backgrounds, text, borders, shadows, scrims.
- Pair a foreground with the surface it was designed for. Body text goes on the surface roles; the on-brand text goes on the brand fill; a button's foreground goes on that same button's background. The feedback text roles say in their name which feedback surface they belong on.
- Use the subtle feedback surface with its own text role for low-noise status: chips, inline notes, callouts. The solid feedback surfaces are strong fills.
- Use a see-through overlay or the scrim when something must darken or frost whatever is behind it, because those roles are tints and work over any content.
- Treat the feedback roles as real state — this succeeded, this is dangerous — not as a taxonomy for categories.
- Draw a chart's data in the data colors only, and give its series the categorical colors in their order: the first series the first color, the second the second.
- Gather the series past the last categorical color into one, such as "Others", in the gray of a muted legend swatch.
- Tell series apart by more than color: a label on the chart, a marker on a line, a legend, and a table of the values. Leave a thin gap in the background color between marks that touch.

### Don't

- Reference a ramp step from a component. There is no custom property for it, so this cannot compile; the conformance checker also rejects it in any site built on the system.
- Write a hex, rgb or hsl value anywhere outside the token source. The conformance checker rejects it.
- Reach for a surface role to paint a button, or a text role to paint a button's label. The action group exists so that buttons can be retuned without moving every surface.
- Put text on a solid feedback surface without checking that pairing in both themes.
- Use a shadow tint as a border or a text color. They are calibrated as shadow ingredients.
- Check the theme attribute in a stylesheet to choose between two colors. Use a semantic role, which already carries both values.
- Choose a surface role by importance, or give a component a higher surface than the one it visibly sits on. The surface roles go by height: canvas is the page, default sits on it, raised sits on that, and sunken is a well cut into a surface. A card on the page is raised; a code block inside a card is sunken. The elevation shadows are tuned to these steps.
- Color a link in running text with the accent text role. Links use the link roles, which carry their own pressed and disabled states and a separate underline color. The accent text is for emphasis that is not a link.
- Cover the whole page with any role but the scrim. It is the only one meant to sit over the whole page.
- Cycle the categorical colors, or make up a color for a fifth series. A repeated color says two series are one.
- Draw a chart's series in the feedback colors, or a status in the data colors. Feedback means success, warning and danger; data colors mean only which series.
- Put a value or a label on a mark in the mark's color. Text takes the text roles, on the chart's background.
