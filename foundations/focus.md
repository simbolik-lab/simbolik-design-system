---
name: focus
title: Focus
summary: How thick the keyboard focus ring is and how far it sits from the control it marks.
type: foundation
tokenGroup: focus
tiers: semantic
themeAware: false
densityAware: false
viewportAware: false
status: candidate
---

# Focus

## Purpose

The measurements of the keyboard focus indicator: how thick the ring is and how far it sits from the element's edge. The ring's color lives in the color foundation, in a role for controls that sit on a surface and another for fields, and the indicator itself is a CSS rule that composes them.

## How it is structured

The ring width and the ring offset are both aliases: the width points at a border width step and the offset at a spacing step. Figma expresses the focus indicator as a stack of shadows; here it is written as a real outline instead. An outline follows the element's rounded corners without being told the radius, and it survives Windows high-contrast mode, which strips shadows and keeps outlines.

## Tiers

Semantic only. The measurements are design decisions and are tokens; the indicator is a construction and is a rule. Both reach CSS, the measurements as custom properties and the rule as the same two declarations in every interactive component.

## Usage rules

### Do

- Write every interactive component's focus-visible state as the same two declarations: an outline of the ring width, solid, in the focus color; and an outline offset of the ring offset. Fields use the field focus color; everything else uses the control focus color.
- Keep the indicator visible when the focused element is inside a sticky region or under an overlay. WCAG 2.2's success criterion 2.4.11, Focus Not Obscured, asks that focus not be hidden by the page's own chrome.

### Don't

- Draw a focus ring as a shadow, a border, or a background change. A component that writes its own focus treatment is a bug.
- Suppress the outline. Removing it without an equivalent is the single most common accessibility failure in shipped stylesheets.
- Change the ring's thickness or distance per component. Both are system decisions; changing a token reaches everything at once.
- Put a control on a surface its focus ring does not stand out from. The focus color must reach a contrast of at least 3:1 against the surface the control sits on, in both themes.
