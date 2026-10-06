---
name: radius
title: Radius
summary: How corners are rounded, so controls, containers and capsules each keep their own shape.
type: foundation
tokenGroup: radius
tiers: both
themeAware: false
densityAware: false
viewportAware: false
status: stable
---

# Radius

## Purpose

How corners are rounded. Radius is the quietest signal of what tier a thing belongs to: controls are tight, containers are softer, and a capsule is the shape of a chip or a pill. A consistent radius within a tier matters more than any single value.

## How it is structured

The primitives are a short run of steps named by their size, ending in one deliberately enormous value that always produces a capsule regardless of the element's height.

The semantic roles name what is being rounded:

- **Control** — buttons, fields, selects, in sizes that follow the control's own size.
- **Container** — cards, panels, framed sections, in a few sizes.
- **Inset** — the small rounding of something drawn inside a control, such as a checkbox mark or a progress track.
- **Full** — the capsule.

A small semantic radius set, with no radius values of a single component's own, keeps corners consistent; these roles are that set.

## Tiers

Both tiers reach CSS. A component uses the semantic role that names its kind of corner. A primitive step is acceptable for a fixed internal rounding that has no role, though the inset role covers most of those.

## Usage rules

### Do

- Round controls with the control roles and containers with the container roles. A card is a container; a button is a control; a chip is full.
- Match a control's radius size to its control size, so that a small button is not rounded like a large one.
- Use the full radius for anything capsule-shaped, however tall it is.

### Don't

- Write a pixel radius in component CSS. The conformance checker rejects it.
- Round a container with a control radius to make it "tighter". Change the container size instead.
- Use the largest fixed step as a capsule. It is not one; only the full radius clips reliably at every height.
- Give a focus ring a radius of its own. The ring is an outline, which follows the element's rounded corners by itself.
