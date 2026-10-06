# Naming conventions

The governing principle: **a name is derived, never invented twice.** A CSS custom property name is a mechanical transform of its token path. A CSS modifier class is a mechanical transform of its variant manifest entry. Nothing is named in two places, so nothing can disagree.

---

## Token paths — decided in Figma, not here

**Token names are not chosen in this repository.** The naming convention is set in Figma and arrives with the DTCG export. This file does not prescribe token paths and must not be used to argue one should change.

Token files follow DTCG 2025.10.

Everything below this line *is* decided here, because Figma has no opinion about it: how a token path becomes a CSS custom property, which tiers reach CSS at all, how context changes values, and how component classes are formed.

### When the export contradicts this file

The export wins on **names**. This file wins on **transforms and structure**, because those are code concerns Figma cannot express.

Two collisions are worth watching for in a new export, because both would be structural rather than cosmetic:

- **Separate `-mobile-` or `-dark-` tokens.** An export holding `space.mobile.xl` alongside `space.xl` conflicts with the rule below that context changes a value rather than a name — and it is a real decision to reopen, not a mistake to quietly correct.
- **Typography and shadow composites.** Figma variables cannot express these, so they will not be in a variables export regardless of how complete the Figma file is. Expect to receive them another way.

---

## CSS custom properties

Which tiers reach CSS is decided **per category**, on one test: *does this value change with theme or viewport?*

| Category | Emitted to CSS | Why |
|---|---|---|
| Color | Semantics only | Every value swaps between light and dark. A component referencing a primitive color would be theme-blind, and there is no legitimate reason to want that |
| Typography | Semantics only | Same — the ramp compresses at narrow viewports |
| Spacing | Both tiers | A component's internal padding does not change with theme or viewport. Forcing a named semantic for every one produces a semantic layer with a hundred single-use entries and no meaning |
| Radius, border width, z-index, duration, easing | Both tiers | Same reasoning |

For the categories that emit both, semantics still exist and are still mandatory for anything that **does** vary by context — section rhythm, page gutters, anything that compresses on mobile. Use the primitive for a fixed internal distance; use the semantic the moment the value depends on where it is.

A component that references a primitive color is a bug. A component that references a primitive spacing step for its own internal padding is correct.

*Examples of token paths in this file are illustrative only. Actual names come from the Figma export.*

### The transform

```
semantic token path      color.bg.surface.default
CSS custom property      --smbk-color-bg-surface-default
```

Prefix, then the path segments joined with hyphens. That is the whole rule.

**The build fails if two token paths produce the same CSS name.** Segments may contain hyphens, so collisions are possible in principle; they are caught rather than forbidden.

---

## Themes and viewports

A semantic token does not get a sibling token for each context. It gets a different **value** in that context.

```css
/* Right */
--smbk-space-section-y: 96px;
@media (max-width: 767px) { --smbk-space-section-y: 64px; }

/* Wrong */
--smbk-space-section-y: 96px;
--smbk-space-mobile-section-y: 64px;   /* a second token to remember not to misuse */
```

A `-mobile-` token places the burden on every author to remember where it may be used. Re-pointing the semantic places it nowhere — components reference one name and get the right value automatically.

The same holds for light and dark: one semantic name, two values.

**Prefer container queries to viewport media queries** where a component should respond to the space it occupies rather than the window.

---

## Component classes

Prefixed BEM. The classes are the public interface sites write in their markup, so renaming one is a breaking change.

```
smbk-<block>                        smbk-card
smbk-<block>__<element>             smbk-card__header
smbk-<block>--<axis>-<value>        smbk-card--tone-brand
```

Modifiers carry the **axis as well as the value**. `smbk-btn--size-lg`, not `smbk-btn--lg`.

This is more verbose than the usual convention, and it is deliberate. Modifier classes are generated from the variant manifest, where every axis has a name; including it means two axes can share a value (`size: sm` and `density: sm`) without colliding, and reading a class in a site's markup tells you which axis it belongs to without opening the component.

Block names match the component directory name. Axis and value names match the variant manifest exactly — if they diverge, the manifest is right and the CSS is wrong.

---

## Project Piece classes

A site's own classes carry the site's own prefix, never `smbk-` and never none. The same BEM shape applies, with the axis in every modifier.

```
site-<block>                        site-hero
site-<block>__<element>             site-hero__title
site-<block>--<axis>-<value>        site-hero--size-slim
```

The prefix is declared once, in the project's `package.json` under `simbolik.prefix`, and the conformance checker reads it from there. A class with no recognized prefix is a violation; so is a project class that restyles an `smbk-` class. Adjusting a component in place is done by adding a project class beside it, never by writing a selector against the component's own classes.

---

## TypeScript

Primitives and semantics are exposed under separate namespaces so a name can never be ambiguous:

```ts
primitive.color.blue[500]
semantic.color.bg.surface.default
```

Both are generated. Neither is hand-written.
