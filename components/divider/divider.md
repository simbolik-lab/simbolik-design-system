---
name: divider
title: Divider
type: component
block: smbk-divider
adaptStrategy: css
figmaNodeId: 1924:9
status: candidate
---

# Divider

## Purpose

A rule that separates content. It is drawn as two hairlines, a shade over a highlight, so it reads as a groove in the surface rather than a drawn line, and it looks right in both themes because each line is its own edge role.

## Anatomy

- The block: a horizontal rule, or a vertical one that stretches to its row.
- Labeled: two line parts with a label part between them, a short uppercase word such as "or".

## When to use

- Between sections of a list, a card or a form.
- Between alternatives: a labeled divider reading "or" between two ways of signing in.
- Between inline controls, vertically.

## When not to use

- Between every item of a list. Spacing separates; a rule everywhere is noise.
- To underline a heading. Headings carry their own rhythm.

## Behavior

None.

## Accessibility

A horizontal divider is a real horizontal-rule element, which assistive technology announces as a separator. A vertical divider carries the separator role explicitly. A labeled divider is not a separator as a whole, because a separator's contents are hidden from screen readers and its word would be lost: its first line carries the separator role, and the word follows as plain text, which is read.

## Composition

Contains nothing, or two lines and a label. May sit in any flow or flex container; a vertical divider stretches to its row.

## Usage rules

### Do

- Let it span its container. Its width is the container's.

### Don't

- Set a color on it. The two edge roles are the whole design.
- Use a labeled divider vertically.

## Related

- Card and dropdown use dividers between their regions.
