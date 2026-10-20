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

The brand marks, drawn as shapes in the page so they take the system's colors: the mark in the brand red, the same in both themes, the wordmark in the default text color. That is what lets one logo work on both themes without a second image.

A site with a logo of its own gives the logo its shapes (`shapes`), in the same form as the built-in logo: a name, the whole logo's frame, the view boxes of the mark and of the wordmark, and their paths. They are drawn and colored the same way.

A logo with colors of its own, a gradient or several fills cannot be drawn with two color roles. A site gives it as picture files instead (`picture`, the picture source): the whole logo, and the mark and the wordmark alone where it has those forms, each with an optional dark version. Each is drawn as an image, so it keeps its own colors and nothing inside it runs.

## Anatomy

- The block, an inline graphic at the display height.
- The mark part, the symbol.
- The type part, the wordmark.
- With the picture source, the block holds the picture part, the file for its form, and the picture dark part, its dark version, if given, in place of the mark and the type.

## When to use

- The header and the footer.
- Anywhere the product signs its name.

- Shapes for a logo that should follow the theme and the reader's high contrast colors; a picture for a logo with colors of its own.

## When not to use

- As an icon inside a control. Use the mark alone at most, and only where the brand itself is the subject.

## Behavior

Shapes take the theme's colors as it changes. A picture keeps its colors; under the dark theme its dark version, when given, shows in place of the light one, read from the same theme setting the colors follow, so a light area inside a dark page shows the light picture.

## Accessibility

### What it does for you

- The graphic carries an image role and the brand name as its accessible name, or the name a site's own shapes carry.
- A picture logo's images carry the logo's name as their text alternative.
- It takes no focus and no keys.

### What you must do

- When the logo is a link home, make the link's name the brand name. The graphic then needs no name of its own.
- Draw a logo that must stay readable in high contrast mode as shapes. A picture cannot follow high contrast mode: it keeps its own colors on the reader's background.

### How to test

- With a screen reader, the logo is read as an image named for the brand. Inside a link home, the link is read by the brand name.
- With text at 200% and the page 320 pixels wide, the logo keeps its height and its width follows.
- In a forced-color mode, a logo drawn as shapes shows its wordmark in the system's text color. A picture logo keeps its own colors on the reader's background, so check that it still reads there.

## Composition

Contains the shapes. Sits in the header, the footer, and on brand surfaces.

## Usage rules

### Do

- Keep the height; the width follows.
- Give a picture logo a dark version unless it reads on both the light and the dark surfaces.
- Use a picture only where the logo's own colors matter; shapes follow the theme for free.

### Don't

- Recolor it. The two roles are the whole brand rule; on a brand surface use the mark in the on-brand text color by placing it in a container that sets the color.
- Ship the simbolik logo on your own product. It stays simbolik's and no license here covers it; replace it with your own logo.
- Rely on the order stylesheets load in to size a logo. Its own height is only a starting point that any class overrides, so set its height with a class of your own where you place it.

## Related

- [Header](../header/header.md) and [footer](../footer/footer.md) place it.
