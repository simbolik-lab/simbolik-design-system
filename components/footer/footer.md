---
name: footer
title: Footer
type: component
block: smbk-footer
adaptStrategy: css
figmaNodeId: 7444:2151
status: candidate
---

# Footer

## Purpose

The foot of every page of a website: the brand with a line about the site and its social links, the page links for the reader who scrolled all the way down, and the legal strip. It is the site map in small. Six looks share those parts: columns, minimal (the strip alone, for a site whose pages are reached another way), centred, floating, call to action and big wordmark.

## Anatomy

- The block, on the canvas color, and inside it the content part, which holds everything else one part under another.
- The main part: the brand part beside the columns part. The brand part holds the brand link with the logo part, an optional blurb part (a line about the site), the social part (small ghost icon buttons, each with the social link part) and an optional newsletter part. Each column part is a heading part over a list part of navigation items at the middle size, the heading's words lined up with the links' words; each navigation item also carries the link part, which lets its label wrap. A page link that leaves the site holds the new-tab part after its label, words for a screen reader only. With the equal column width, the columns stand in two half parts inside the columns part.
- The narrow form's own parts: the folds part, a navigation landmark like the columns, with one fold part per column: a disclosure whose summary is the fold heading part (the column's title and the caret part), its list of links under it, and a fold divider part closing the row. The brand part comes after the folds.
- The page links come twice, the folds with the narrow-only part and the columns with the wide-only part, and the brand part once, between them: the folds, then the brand, then the columns. The layout switch shows one of the two renderings of the links, so the brand comes after the folds on a phone and before the columns in a wide space.
- The logo part is the built-in simbolik logo, or a site's own picture files with their dark versions (`logoPicture`, the logo's `picture`). Anything else goes in the brand's place (`brand`).
- A divider part above the legal part, in both forms.
- The legal part: the legal start part (the notice part, holding the copyright part and an optional tagline part, then the legal links part of small links), the extras part at the end (a status, a language button, a theme switch and a link back to the top, each when given), and an optional fine print part under them.
- The centred look: one brand part, centered, then the row part (one row of page links in a navigation landmark), then the divider and the legal part, centered, its legal links above the copyright.
- The floating look: the content part on a raised card.
- The call to action look: the call to action part first, a raised card holding the call to action text part (its headline part and line part) and the call to action actions part.
- The big wordmark look: the wordmark part last, the name set as wide as the content, hidden from screen readers.
- The minimal look: a divider over the legal part, which holds three places in three columns: the notice part at the start, the center part in the middle and the end part at the end. The center part holds the legal links part and the end part the extras part, with the social links before back to top; a site can put its own content in either place instead, such as a control or a line of words. The fine print takes a row under the three. No brand and no page links.

## When to use

- The bottom of every page of a website.
- The call to action look when the site asks every reader for one thing, such as a call or a sign-up.
- The big wordmark look when the name itself is the last thing a page should show.

## When not to use

- An application screen. Applications end with their content.
- The columns look on a landing page with one call to action, or on a site whose every page is reached from a sidebar or the header. Use the minimal look there.

## Behavior

In a wide space the brand sits at the start and the columns at the end of the row, each column as wide as its longest link. In a narrow space each column folds into a row that opens: its title and a caret, a divider under it. The first row starts open. Pressing a row's title, or Enter or Space on it, opens or closes it; it needs no script. The brand follows the folded rows, at the start, and the legal strip stacks under a divider: the copyright, the legal links, then the extras. The form follows the layout switch, so a wrapper can force either.

The legal strip in a wide space keeps the copyright and the legal links at the start and the extras at the end, and wraps when room runs short. With `legal="end"` the legal links move to the end of the strip, just before the extras when there are some, and the copyright and its tagline keep the start; Tab still reaches the copyright's links, then the legal links, then the extras, the order they are drawn in. On a phone the strip stacks the same way whichever is chosen: the copyright, the legal links, then the extras. The centred and minimal looks place their legal links themselves, so the choice changes the other four. The fine print takes a line of its own under the strip.

By default each column of links is as wide as its longest link. With `column-width="equal"` every column is as wide as the widest, with the same gap between them: in one row at the end of the brand's row where they all fit, and otherwise in two rows as even as the count allows, four as two and two, still at the row's end, so no column is ever left alone under the rest. An odd count puts the extra column in the first row. Given too little room for even two columns side by side, they stand one under another rather than run past the footer's edge. It needs no script: each column's heading holds an invisible copy of every column's title and every link's words, which only gives it its width. The folded columns on a phone are the same either way.

The centred look stays centered in both forms: the brand, the row of page links (which wraps onto further lines), and the strip, its legal links above the copyright.

The call to action card sets its words at the start and its actions at the end in a wide space; in a narrow space the actions stack under the words, each as wide as the card.

The minimal look keeps its three places in one row in a wide space, the legal links in the exact middle, each column at least a small control tall with its content centered in it. The middle column is as wide as its links and the two ends share the rest equally; where the copyright line and tagline need more than their share, the tagline moves under the copyright rather than overlap. Several things put in one place stand apart and wrap when there is no room. In a narrow space what the middle and end places hold stands in the stack directly, so content a page hides there in a narrow space leaves no empty place behind; several things meant to stay together on a phone go inside one element of the page's own. In a narrow space they stack in the same order, each centered.

Within either form the footer fits whatever width it is given, and never makes the page scroll sideways. Nothing in it is set by a width. In a wide space a column that no longer fits beside the others moves to a further row, or, with the equal column width, half of them do. If the wide form is given too little room for even one column beside the brand, the columns move below the brand, and a column whose links are longer than the whole row narrows. Link labels wrap onto further lines rather than being cut short, and a single word longer than its column breaks.

Two switches change the frame. With `divider="off"` the divider above the legal strip goes. With the background flag the footer stands on a band of the default surface with a hairline along its top. A dark band is the footer inside a part of the page set to the dark theme; it is not a look of its own.

The zone flag gives the footer its own room: its content held to the content width in the middle, with space above, below and at the sides, and a small margin around the floating card. Without it the footer keeps its own padding and the page places it.

Markup written by hand must put the link part on each column link's navigation item; without it, long labels are cut short instead of wrapping. For the equal column width it wraps the columns in two half parts, the first holding the extra column of an odd count, and gives each heading the `data-titles` attribute (every column's title) and the `data-links` attribute (every link's words seen, without the new-tab words), each one per line; without the halves the columns wrap one at a time, and without the attributes each column keeps its own width. Each page link's `data-label` holds only its words seen, never the new-tab words. It holds the folds with the narrow-only part, then the brand part, then the columns with the wide-only part, so the brand is on the page once and a form inside it (a newsletter sign-up) has each id once. A footer whose markup puts the brand before the folds still shows it in the same places, but on a phone Tab then reaches the brand before the links above it; one with no folds shows its columns open on a phone. Markup that holds the brand twice, once with the wide-only part before the columns and once with the narrow-only part after the folds, still shows one at a time, but anything with an id inside the brand is then on the page twice, and a label points at the copy that comes first, hidden on a phone.

In the minimal look, content a page puts in the center or end place goes in as it is. Put words in a span or a paragraph: the footer takes away a paragraph's margins and leaves controls and other elements as they are.

The extras, the newsletter and the call to action's actions are the page's own components: the footer places them and the page decides what they do. The language button opens whatever the page chooses; the newsletter's field and button send the page's own form.

## Accessibility

### What it does for you

- The block is a content-info landmark; the page links are a navigation landmark named "Footer" by default.
- Column headings are headings, so the columns can be jumped between: second-level, as is the call to action's headline, unless `headingLevel` gives another. On a phone each folded row's title is a disclosure: a screen reader hears its name and whether it is open, and Enter or Space opens and closes it.
- A link given `active` is the current page: it says so to a screen reader (`aria-current="page"`), as the header's links do. A page link also takes the navigation item's current look; a legal link keeps its look, since the legal strip has no current state of its own.
- A page link or a social link given `external` leaves the site: it opens in a new tab, and a screen reader hears "(opens in a new tab)" after its name, so the change of tab is never a surprise (WCAG 2.2 success criterion 3.2.5 Change on Request). On a page link the words are in the new-tab part, out of sight; on a social link they end its name. Nothing changes in how either looks. The legal links take no such flag: the terms, the privacy policy and the rest of the strip open in the same tab.
- Given `external`, a link also gets `target="_blank"` and `rel="noopener"`.
- A link among words (in the copyright, the fine print, a line at the end) is underlined, so it never differs from the words around it by color alone.
- The brand and the page links are read and reached with Tab in the order they are seen in each form: the brand first in a wide space, the page links first on a phone.
- A status says its state in words beside its dot, never by color alone. The language button's name says what it changes, such as "Language: English". Back to top is a link with words, to the page's start.
- The big wordmark is hidden from screen readers: the brand already names the site.
- No link label is ever cut short, so what a reader sees is the whole of what a screen reader announces. Navigation labels wrap rather than truncate, and the text still fits at twice its size (WCAG 2.2 success criterion 1.4.4 Resize Text) and at the narrowest reflow width without sideways scrolling (1.4.10 Reflow).

### What you must do

- Give the page links another name when a page shows more than one footer with page links.
- Give each social link a name; the prop requires one.
- Mark a link that leaves the site with `external`. In markup written by hand, give a link that leaves the site both attributes, end a page link's label with the new-tab part holding a space and "(opens in a new tab)", and end a social link's `aria-label` with the same words.
- Provide the page's start that Back to top links to.
- Give the newsletter's email field a visible label. The call to action's field names itself when the headline above it is its only label. Messages about what to fix are the page's form's own.
- Give every word it says by itself, such as back to top and the new-tab words, in the page's language; each keeps its English unless the page gives its own.

### How to test

- With the keyboard only, Tab through the footer: the order follows what is seen, and every link and button shows its focus ring. On a phone, open and close a folded row with Enter and with Space.
- With a screen reader, the footer is found as a content-info landmark and its links as a navigation landmark by name; each column heading is read as a heading; a link that opens a new tab says so; the current page is read as the current page.
- With text at 200% and the page 320 pixels wide, every link label wraps whole and nothing scrolls sideways.
- In a forced-color mode, the links, the underlines and the focus rings are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the next link or button, in the order they are seen. |
| Enter | Follows the focused link or presses the focused button. |
| Enter or Space | On a folded row's title on a phone, opens or closes the row. |

## Composition

Takes navigation items, links, icon buttons, the logo and dividers; places a status dot, buttons, a theme switch, and a field and button the page gives it. Sits after the page content; nothing follows it.

## Usage rules

### Do

- Keep to four columns of five or six links.
- Keep labels short. A long label wraps and stays readable, but a column of two- and three-line labels is slow to scan.
- Put the legal links in the strip, not in a column.
- Give the newsletter field a visible label and a button that says what it does.

### Don't

- Put more than one call to action in the card.
- Measure the footer to switch it to its narrow form when the wide one looks crowded. The wide form never overflows, so there is nothing to detect; force a form with the layout switch only as a design choice.

## Related

- [Header](../header/header.md): the top of the same page.
- [Navigation item](../nav-item/nav-item.md): each page link.
- [Status dot](../status-dot/status-dot.md), [theme switch](../theme-switch/theme-switch.md), [button](../button/button.md) and [input](../input/input.md): the extras and the newsletter.
