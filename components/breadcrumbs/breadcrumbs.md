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
- The label part, the page's name inside the link. On hover the line runs under it alone, never under the icon or the gap beside it.
- The icon part, optional, a small decorative icon before a page name, in the subtle text color. Give every crumb one or none.
- The separator part, the small caret between items, which follows the size as the icons do.
- The more part, when folded: the ghost extra-small icon button standing for the crumbs between the first and the parent.

## When to use

- Any page three or more levels deep in a hierarchy.
- Documentation, catalogs and settings trees.

## When not to use

- Flat sites with one level. There is nothing to trail back through.
- Switching between sibling views. Use [tabs](../tabs/tabs.md).
- A single "back" step. Use a [link](../link/link.md) with a leading caret.

## Behavior

Static. Items wrap onto a second line when the space is narrow. The current page is not a link and has no hover.

Folded, a trail of more than three crumbs shows the first, the parent and the current page, with the "more" button between the first and the parent. Pressing it opens the crumbs in between as a list of links under it, in order; Escape or a press outside closes it and returns focus to the button. A trail of three or fewer shows whole.

On a touch screen each crumb keeps its look and takes an invisible press area round it, out to the comfortable touch target; up and down it reaches only halfway into the trail's gap, so the rows of a trail that wraps never meet.

## Accessibility

### What it does for you

- The list sits in a navigation landmark named "Breadcrumb" by default.
- The last item carries the current-page marker, which screen readers announce.
- The "more" button is named "More pages" by default (`moreLabel`) and says whether its list is open. Its list is a named group of links, not a menu.
- Separators and the icons before page names are decorative and hidden from assistive technology; the page names carry the meaning.

### What you must do

- Pass another landmark name when a page has more than one breadcrumb trail.
- Pass `moreLabel` in the page's own language when the page is not in English. The "more" button's name keeps its English unless the page gives its own.

### How to test

- Tab through the trail: each crumb is a link and the "more" button takes focus in turn, with the focus ring showing in both themes and in a forced-color mode.
- Open the "more" button with Enter or Space, then press Escape: the list closes and focus is back on the button.
- With a screen reader, the trail is found as a navigation named "Breadcrumb", the last crumb is announced as the current page, and separators and icons are not read.
- With text at 200% and the page 320 pixels wide, the trail wraps or folds and every crumb stays reachable.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the next crumb, then to the "more" button when the trail is folded. |
| Shift + Tab | Moves focus back. |
| Enter | Follows the focused link. On the "more" button, opens its list or closes it. |
| Space | On the "more" button, opens its list or closes it. |
| Escape | Closes the open list and returns focus to the "more" button. |

## Composition

Contains plain text links only. Sits at the top of a page's content, under the header.

## Usage rules

### Do

- Put the site root first.
- Keep page names short; they wrap, but a long trail reads badly.
- Give icons to every crumb or to none, so the trail reads as one line of the same things.

### Don't

- Repeat the page title in the last crumb if the heading is directly beneath. Shorten it instead.

## Related

- [Link](../link/link.md): the element each crumb is drawn from.
- [Tabs](../tabs/tabs.md): sideways switching between views at the same level.
