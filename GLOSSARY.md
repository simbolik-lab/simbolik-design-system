# Glossary

The words the Simbolik design system uses, each with the words it avoids for the same thing.

## Tokens

**Primitive Token**:
A raw, context-free design value such as `blue-500` or `space-4`. Never consumed directly by components or by projects.
_Avoid_: base token, global token, core token

**Semantic Token**:
A named design decision that aliases a Primitive Token and describes a role, grouped into role families such as background, text, and border. The only tier components and projects are allowed to consume.
_Avoid_: alias token, applied token, decision token

**Theme**:
The context that decides a Semantic Token's color, chosen by the person reading the page. This system has two: light and dark.
_Avoid_: mode, scheme, color scheme

**Density**:
The context that decides a Semantic Token's spacing and control size, chosen once by the person building a project and never exposed to a reader. This system has two: compact and comfortable.
_Avoid_: mode, spacing mode, compactness

**Text Size**:
The context that decides a Semantic Token's type size, following the width of the viewport with no choice involved. This system has two: min and max.
_Avoid_: type scale, ramp size, breakpoint

**Side Columns**:
The two columns on either side of a documentation page's content: the sidebar on one side, the table of contents on the other. A page has room for both at and above the side-columns breakpoint and keeps one, the sidebar, below it.
_Avoid_: rails, gutters, panels

**Elevation**:
How far a surface appears to sit above the page, expressed as a shadow. Says nothing about what overlaps what.
_Avoid_: depth, shadow level, z

**Stacking Order**:
Which named layer a component occupies when things overlap. Says nothing about how it looks.
_Avoid_: z-index, depth, elevation

**Typography Primitive**:
A single typographic value: a size, a weight, a width, a line height, or a font family. The Primitive Token tier for type.
_Avoid_: font token, type primitive

**Typography Token**:
A named combination of Typography Primitives that describes a role, such as `text-display`. The Semantic Token tier for type, and the only type tier components consume.
_Avoid_: text style, type style, typography style

## Components

**Component Variant**:
A named axis of a component's appearance or composition, declared once and used to drive the component's rendering, the Showroom's controls, and generated snippets alike.
_Avoid_: option, modifier, setting

**Optional Part**:
A part of a component that can be shown or left out, such as a button's leading icon, an alert's close button or the sidebar's foot button: what Figma draws as a boolean. In code it is a prop of the wrapper, not a class; the Showroom's preview offers each as a switch under Show.
_Avoid_: option (that word is kept away from Component Variants), toggle

**Status**:
Where a component or foundation stands in its life, written in its documentation and shown on its Showroom page: Proposed (a need, nothing built), Experimental (built, big changes expected), Candidate (believed complete, may still change), Stable (supported; changing it is a breaking change), Deprecated (on its way out), Retired (removed). Each moves on its own, independently of the design system's version number.
_Avoid_: version, maturity, beta, draft (now Experimental), release candidate (now Candidate)

**Template**:
A ready-made arrangement of components: either a whole page, such as a dashboard or a website page, or one section of a page, such as a hero or an FAQ.
_Avoid_: composition, pattern, organism, block, layout

## Artifacts

**Showroom**:
The generated site that showcases the design system (foundations, tokens and components) with live previews, interactive variant controls, documentation, and copyable snippets. It owns no design values; it only renders what the tokens and components already define.
_Avoid_: living style sheet, style guide, docs site, storybook

**Build Output**:
Any artifact generated from the token source or component source: CSS custom properties, TypeScript, JSON. Never hand-edited.
_Avoid_: dist, generated files, compiled tokens

**Release notes**:
What one Release holds, what changed and what breaks since the last, and its known gaps, written for someone who has never seen the design system, one file per version in `release-notes/`. They are the design system's changelog: `CHANGELOG.md` gathers them newest first, and the Showroom's Releases section shows them, a page per release.
_Avoid_: release log, what's new

## Sites built on it

**Project Piece**:
Something a site built on the design system draws for itself that the system does not provide, such as a section of its own pages, named with the site's own prefix. Built only from Semantic Tokens and system components.
_Avoid_: custom component, local component, one-off, snowflake

**Conformance**:
Whether a project uses the design system correctly, referencing Semantic Tokens and system components rather than raw values or bespoke reimplementations.
_Avoid_: compliance, correctness, adherence
