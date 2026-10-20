---
name: page-header
title: Page header
type: component
block: smbk-page-header
adaptStrategy: css
figmaNodeId: 7115:869
status: experimental
---

# Page header

## Purpose

The top of one page or one thing: where the reader is, the page's one main heading, a short introduction, the status of the thing the page is about, and the few actions that act on the whole page. It is not the site's header or the app bar, which stay the same on every page; the page header changes with each page.

## Anatomy

- The block, a column that draws no surface.
- The breadcrumbs part, optional: the small breadcrumbs, drawn from a list of links (each a label and an address, the page itself last with none), or the page's own link to the page above.
- The main part, a row: the body at its start and the actions at its end.
- The body part, holding the title row, the description and the meta line.
- The title-row part, holding the title and the status side by side.
- The title part, the page's one main heading, in the largest heading style, a step smaller in a narrow layout.
- The status part, optional: a badge beside the title, for the state of the thing the page is about.
- The description part, optional: a short introduction in a large body style and the subtle text color.
- The meta part, optional: a quiet line of facts in a small body style, such as when it changed and who owns it.
- The actions part, optional: the action parts, the main one a brand button and the others outline buttons, then the more part, a "More actions" button opening a menu.
- The tabs part, optional: tabs that switch the page's views, last; the tabs-cue part shows at their end while more tabs lie past it.
- While loading, the tabs-skeleton part takes the tabs' place, and the hidden part holds what a screen reader hears as the heading.

The composition follows from what the header is given: simple, object with a status or a meta line, tabbed with tabs.

## When to use

- At the top of every page of an application or a site's inner pages: a list, a record, a settings page, a report.
- At the top of the page of one thing, with its status and the facts about it.

## When not to use

- For the site's own [header](../header/header.md) or the [app bar](../app-bar/app-bar.md), which hold the actions for the whole site.
- For the heading of a section inside the page. Use the [section heading](../section-heading/section-heading.md).
- For a marketing page's opening, with a large picture and a call to action. Build that as the page's own hero.

## Behavior

In a wide layout the actions sit at the row's end, centred on the title's first line. In a narrow layout they move under the words: the main action fills the row, and the other actions move behind "More actions" with the actions that are always there. Up to three actions show as buttons; give the rest as `moreActions`. An action given past the third is never dropped: it goes behind "More actions", after the ones always kept there.

Tabs come last and are as wide as they need, up to the row; when there are more than fit, the row scrolls sideways inside itself and a cue at its end shows there are more. Give the tabs the id of the one panel under the header that shows each view, so the view follows straight under them. The header ends with the space a heading block leaves before what follows, except when it ends with tabs.

Loading, the words are skeleton lines in their own type, so nothing moves when the page arrives; the actions are disabled, and the tabs are skeletons that cannot be pressed.

## Accessibility

### What it does for you

- The title is the page's one main heading, level 1 by default. There is no second main heading and no second banner landmark: the header is a plain block, not a banner.
- Reading and Tab order: the breadcrumbs, the title, the description, the actions, then the tabs. It has no keys of its own.
- "More actions" is a button named "More actions" that opens a menu; the menu's keys are the dropdown's.
- Loading, the page says it is busy, and the heading reads "Loading" (`loadingLabel`) until the title arrives. No tab can be pressed.
- A status badge says its state in words; its color only backs them up.

### What you must do

- Set `headingLevel` only when the header sits inside something that has its own main heading.
- Give a header that sticks to the top of the window a top scroll padding on the page as tall as the sticking header, so it never covers the control that has focus.

### How to test

- Tab from the top of the page: focus goes through the breadcrumbs, the actions, then the tabs, in that order, and the focus ring shows on each.
- Check that the page has one level 1 heading, and that the header adds no banner landmark.
- With a screen reader, the title is read as the page's heading, and "More actions" as a button that opens a menu. While loading, the heading reads "Loading" and the page is busy.
- With text at 200% and the page 320 pixels wide, the actions move under the words and the tabs row scrolls sideways inside itself.
- In a forced-color mode, the focus rings on the actions and tabs stay visible.

## Composition

Holds breadcrumbs, a heading, a status badge, a description, a line of facts, actions and tabs. Sits at the top of a page's main content, under the site's header or the app bar, once per page.

## Usage rules

### Do

- Keep one main action, the one most people come to the page for.
- Keep the introduction to a sentence or two.
- Put a destructive action behind "More actions".

### Don't

- Put the actions for the whole site in it.
- Make a destructive action the main one.
- Use more than one page header on a page.

## Related

- [Section heading](../section-heading/section-heading.md): the heading of a section inside the page.
- [Breadcrumbs](../breadcrumbs/breadcrumbs.md): the way back up, at the header's top.
- [Tabs](../tabs/tabs.md): the page's views, at the header's end.
- [Header](../header/header.md) and [app bar](../app-bar/app-bar.md): the site's own top, the same on every page.
