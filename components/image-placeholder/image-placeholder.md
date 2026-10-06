---
name: image-placeholder
title: Image placeholder
type: component
block: smbk-image-placeholder
adaptStrategy: css
figmaNodeId: 1988:5921
status: candidate
---

# Image placeholder

## Purpose

A flat, rounded block that holds the place of a picture that is missing or not yet chosen: an empty avatar slot, a card without a cover, a mockup. It is a static state, which is what separates it from the skeleton, which stands in while something loads.

## Anatomy

One element. No parts.

## When to use

- A picture slot with nothing in it yet.
- Mockups and templates.

## When not to use

- While a picture is loading. Use the skeleton's media shape.

## Behavior

None.

## Accessibility

Decorative unless given a label, in which case it is announced as an image with that name.

## Composition

Contains nothing. Sits wherever an image would.

## Usage rules

### Do

- Give it the ratio of the picture it replaces, so nothing moves when the picture arrives.
- Size it through its container. It fills the container's width and takes its height from its ratio.

## Related

- Skeleton: the loading state.
- Card: often holds one.
