---
name: breadcrumbs
title: Breadcrumbs
type: component
block: smbk-breadcrumbs
adaptStrategy: css
figmaNodeId: 4136:867
status: candidate
---

# Breadcrumbs

## Purpose

Shows where the current page sits in the site, as a trail of links from the root down to here, so the reader can step back up one level or several. It differs from the tabs component in that it points upward through a hierarchy rather than sideways between siblings.

## Anatomy

- The block, an ordered list inside a navigation landmark.
- The item part, one page in the trail.
- The link part, the page name. Every item but the last is a link; the last is the current page and is marked as such.
- The separator part, the small caret between items.

## When to use

- Any page three or more levels deep in a hierarchy.
- Documentation, catalogs and settings trees.

## When not to use

- Flat sites with one level. There is nothing to trail back through.
- Switching between sibling views. Use tabs.
- A single "back" step. Use a link with a leading caret.

## Behavior

Static. Items wrap onto a second line when the space is narrow. The current page is not a link and has no hover.

## Accessibility

- The list sits in a navigation landmark named "Breadcrumb" by default; pass another name when a page has more than one.
- The last item carries the current-page marker, which screen readers announce.
- Separators are decorative icons and are hidden from assistive technology.

## Composition

Contains plain text links only. Sits at the top of a page's content, under the header.

## Usage rules

### Do

- Put the site root first.
- Keep page names short; they wrap, but a long trail reads badly.

### Don't

- Repeat the page title in the last crumb if the heading is directly beneath. Shorten it instead.

## Related

- Link: the element each crumb is drawn from.
- Tabs: sideways switching between views at the same level.
