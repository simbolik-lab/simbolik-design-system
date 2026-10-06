---
name: footer
title: Footer
type: component
block: smbk-footer
adaptStrategy: css
figmaNodeId: 4255:9405
status: candidate
---

# Footer

## Purpose

The foot of every page of a website: the brand with its social links, a few columns of page links for the reader who scrolled all the way down, and the legal strip. It is the site map in small. The minimal look keeps only the strip, for a site whose pages are reached another way.

## Anatomy

- The block, on the canvas color.
- The main part: the brand part (the brand link with the logo part, and the social part of social links) beside the columns part, each column part a heading part over a list part of navigation items. Each navigation item also carries the link part, which lets its label wrap. A column link that leaves the site holds the new-tab part after its label, words for a screen reader only.
- A divider above the legal part in a wide space; in a narrow space the divider stands between the columns and the brand below them instead.
- The legal part: the copyright line, an optional tagline part (a short line such as a slogan, spaced from the copyright by the strip's gap rather than joined with a separator), and the legal links part.
- The minimal look: a divider over the legal part, which then holds three places in three columns: the notice part (the copyright line and the optional tagline) at the start, the center part in the middle and the end part at the end. The center part holds the legal links part and the end part the social part, its icons a step smaller than the default look's; a site can put its own content in either place instead, such as a control or a line of words. A name in the copyright line that links reads as the legal links do. No brand and no columns.

## When to use

- The bottom of every page of a website.

## When not to use

- An application screen. Applications end with their content.
- The default look on a landing page with one call to action, or on a site whose every page is reached from a sidebar or the header. Use the minimal look there.

## Behavior

Static. In a wide space the brand sits left and the columns fill the rest; in a narrow space the columns come first, two to a row, each as wide as its longest link plus an equal share of the room left over (so short columns sit in halves, and a column of long links takes what it needs), the brand moves below them and centers under a divider, and the legal strip stacks with no divider above it. Put the columns with short links and the columns with long links in the same places of each row, so the two columns stay balanced. The form follows the layout switch, so a wrapper can force either.

The minimal look keeps its three places in one row in a wide space, the legal links in the exact middle, each column at least a small control tall with its content centered in it. The middle column is as wide as its links and the two ends share the rest equally; where the copyright line and tagline need more than their share, the tagline moves under the copyright rather than overlap. Several things put in one place stand apart by the legal links' gap and wrap when there is no room. In a narrow space what the middle and end places hold stands in the stack directly, so content a page hides there in a narrow space leaves no empty place behind; several things meant to stay together on a phone go inside one element of the page's own. In a narrow space they stack in the same order, each centered, the copyright line over the legal links over the social links.

Within either form the footer fits whatever width it is given, and never makes the page scroll sideways. Nothing in it is set by a width. The columns share their row equally and narrow down as far as their longest word, and a column that no longer fits moves to a further row; a column alone on the last row takes the whole row. If the wide form is given too little room for even one column beside the brand, the columns move below the brand. Link labels wrap onto further lines rather than being cut short, and a single word longer than its column breaks. The legal strip wraps too, centered.

Markup written by hand must put the link part on each column link's navigation item; without it, long labels are cut short instead of wrapping.

In the minimal look, content a page puts in the center or end place goes in as it is. Put words in a span or a paragraph: the footer trims the space above and below those to the height of the capital letters, as it does for all its text, and leaves controls and other elements untouched, since trimming a block that holds a control or an icon would shift it.

The legal links and the social links each keep their own place when another place is left empty, so a strip with no legal links still has its social links at the end.

## Accessibility

- The block is a content-info landmark; the columns are a navigation landmark named "Footer" by default. Give them another name when a page shows more than one footer with columns.
- Column headings are headings, so the columns can be jumped between.
- A link given `active` is the current page: it says so to a screen reader (`aria-current="page"`), as the header's links do. A column link also takes the navigation item's current look, sunk into the page; a legal link keeps its look, since the legal strip has no current state of its own.
- Social links are icon-only and must be given names; the prop requires one.
- A column link or a social link given `external` leaves the site: it opens in a new tab, and a screen reader hears "(opens in a new tab)" after its name, so the change of tab is never a surprise (WCAG 2.2 success criterion 3.2.5 Change on Request). On a column link the words are in the new-tab part, out of sight; on a social link they end its name. Nothing changes in how either looks. The legal links take no such flag: the terms, the privacy policy and the rest of the strip open in the same tab.
- In the minimal look the notice is a paragraph and the legal and social links are lists, read in the order they are seen: copyright, legal links, social links.
- No link label is ever cut short, so what a reader sees is the whole of what a screen reader announces. Navigation labels wrap rather than truncate, and the text still fits at twice its size (WCAG 2.2 success criterion 1.4.4 Resize Text) and at the narrowest reflow width without sideways scrolling (1.4.10 Reflow).
- Given `external`, a link also gets `target="_blank"` and `rel="noopener"`. Markup written by hand gives a link that leaves the site both attributes, ends a column link's label with the new-tab part holding a space and "(opens in a new tab)", and ends a social link's `aria-label` with the same words.

## Composition

Takes navigation items and links only. Sits after the page content; nothing follows it.

## Usage rules

### Do

- Keep to four columns of five or six links.
- Keep labels short. A long label wraps and stays readable, but a column of two- and three-line labels is slow to scan.
- Put the legal links in the strip, not in a column.

### Don't

- Put a newsletter form or a call to action in it without a design for one.
- Measure the footer to switch it to its narrow form when the wide one looks crowded. The wide form never overflows, so there is nothing to detect; force a form with the layout switch only as a design choice.

## Related

- Header: the top of the same page.
- Navigation item: each link in a column.
