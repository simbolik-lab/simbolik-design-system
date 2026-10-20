---
name: uptime-bar
title: Uptime bar
type: component
block: smbk-uptime-bar
adaptStrategy: css
figmaNodeId: 7580:263
status: experimental
---

# Uptime bar

## Purpose

Shows how a site or a service did over a stretch of time, a bar for each day or hour: up the whole time, an incident when it was slow or partly down, or an outage when it was down. A caption under it gives the start, the share of time up and the end. It answers "has this been reliable?" at a glance; the words answer it exactly.

## Anatomy

- The block, as wide as the space it is given.
- The bars part, a row of bar parts of equal width, one per period, oldest at the left. Each bar's status is a modifier of the part: up, incident or outage, in the success, warning and danger colors.
- The caption part: the start part at the left, the uptime part, the share up, in the middle, and the end part at the right.
- The hidden part: the summary a screen reader hears instead of the bars.

## When to use

- On a status page or a card for a site or a service, for the last 30 days or 24 hours.
- Several services one under another, each with its own uptime bar over the same days.

## When not to use

- To show how something is now. Use a [badge](../badge/badge.md).
- For a measure that is not up or down, such as response times. Use a [line chart](../line-chart/line-chart.md).

## Behavior

The bars share the width equally, whatever their number. The caption is optional; without it the bars stand alone and a screen reader still hears the summary. Pointing at a bar shows the browser's own tooltip, with its period and how it went (up, incident or outage); hand-written markup puts the same words in a `title` on the bar. Nothing moves and nothing takes focus.

## Accessibility
### What it does for you

- The bars and the caption are hidden from screen readers, which hear one summary instead: the start, the end and the share up, then the periods with an incident and those with an outage, named by their labels.
- The share up is in words under the bars, so the colors are never the only way to tell how it went.
- Nothing about it takes focus.
- In high contrast mode the bars keep their colors; the summary says the same in words.

### What you must do

- Give each period a label a reader understands, such as "Oct 12".
- A page can write its own summary where the default does not fit.
- In markup written by hand, put the summary in the hidden part and hide the bars and the caption.

### How to test

- With a screen reader, the bars and the caption are skipped and one summary is read: the start, the end, the share up, and the periods with an incident or an outage by their labels. Without a caption, the summary is still read.
- Tab through the page: focus never lands on the uptime bar.
- In a forced-color mode, the bars keep their colors and the summary says the same in words.

## Composition

Sits on a card, a status page or a table row, under the name of what it measures. Holds the bars and their caption only.

## Usage rules

### Do

- Say what it measures above it, such as "Website uptime".
- Give the share up with the precision that matters, such as "99.9% up".
- Give the same span to every uptime bar on a page.

### Don't

- Rely on the red and amber bars to say what went wrong. Say it in words where the reader can act on it.
- Show more bars than fit at two pixels each; show hours for a day and days for a month.

## Related

- [Badge](../badge/badge.md): how something is now.
- [Heatmap](../heatmap/heatmap.md): how much happened each day, not whether it worked.
- [Timeline](../timeline/timeline.md): what happened during an incident, one event after another.
