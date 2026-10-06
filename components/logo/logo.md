---
name: logo
title: Logo
type: component
block: smbk-logo
adaptStrategy: css
figmaNodeId: 363:14503
status: experimental
---

# Logo

## Purpose

The brand marks, drawn as shapes in the page so they take the system's colors: the mark in the brand text color, the wordmark in the default text color. That is what lets one logo work on both themes without a second image.

A site with a logo of its own gives the logo its shapes (`shapes`), in the same form as the built-in logo: a name, the whole logo's frame, the view boxes of the mark and of the wordmark, and their paths. They are drawn and colored the same way.

## Anatomy

- The block, an inline graphic at the display height.
- The mark part, the symbol.
- The type part, the wordmark.

## When to use

- The header and the footer.
- Anywhere the product signs its name.

## When not to use

- As an icon inside a control. Use the mark alone at most, and only where the brand itself is the subject.

## Behavior

None.

## Accessibility

The graphic carries an image role and the brand name as its accessible name, or the name a site's own shapes carry. When it is a link home, the link's name is the brand name and the graphic needs no name of its own.

## Composition

Contains the shapes. Sits in the header, the footer, and on brand surfaces.

## Usage rules

### Do

- Keep the height; the width follows.

### Don't

- Recolor it. The two roles are the whole brand rule; on a brand surface use the mark in the on-brand text color by placing it in a container that sets the color.
- Ship the simbolik logo on your own product. It stays simbolik's and no license here covers it; replace it with your own logo.
- Rely on the order stylesheets load in to size a logo. Its own height is only a starting point that any class overrides, so set its height with a class of your own where you place it.

## Related

- Header and footer place it.
