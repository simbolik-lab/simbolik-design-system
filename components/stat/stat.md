---
name: stat
title: Stat
type: component
block: smbk-stat
adaptStrategy: css
figmaNodeId: 7118:401
status: experimental
---

# Stat

## Purpose

Shows one figure that matters, with its name above it and a line under it that says what the figure means: the open pull requests waiting for a review, the uptime of the last thirty days. A stat can link to where its figure comes from.

## Anatomy

- The block, a description list of its own, on the default surface with square corners.
- The name part, the term: what the figure counts, in a small label style and the subtle text color.
- The dot part, an optional status dot before the name, for a figure that needs attention.
- The figure part, the value in a heading style with digits of equal width, so figures line up and do not jump as they change.
- The link part, the figure as a link, in the link colors and underlined, when the stat has an address.
- The trend part, an optional mark of the change after the figure, such as a small badge.
- The description part, an optional line under the figure in a small body style and the subtle text color.
- The chart part, an optional small chart under the line, such as a sparkline or a meter, as wide as the stat.

## When to use

- At the top of a dashboard or an overview, for the few figures a reader comes to check.
- For a figure that leads somewhere: the list of what it counts, the report behind it.

## When not to use

- For a value over time. Use a chart or a [sparkline](../sparkline/sparkline.md).
- For a long row of equally weighted figures with no question or action behind them. Pick the few that matter.
- For a pair of a term and its value inside a page of details. Use a [description list](../description-list/description-list.md).

## Behavior

A stat is as wide as its content in running text; a grid or a row it sits in stretches it, so a row of stats can share its width equally. The description wraps, and the trend moves under the figure when there is no room beside it.

In a card's slot the stat is one of the card's parts: it drops its own padding and surface, so its name starts on the card's inset and lines up with the card's header.

A linked stat is one link. Its figure shows the link, and the whole tile follows it: pressing anywhere on the tile goes to the address. On hover and press the figure takes the link's hover and pressed colors; with the keyboard, the focus ring goes round the whole tile. The trend and the chart sit under the link's target, so a chart in a linked stat takes no pointer of its own.

## Accessibility
### What it does for you

- Each stat is a description list: the name is the term, the figure and the description are its details. A screen reader says the name with the figure.
- A linked stat is one Tab stop, named by the name and the figure together, such as "Waiting on you 4".
- The dot's label is read as part of the name.
- The tile is the link's target, so it is far larger than the smallest size a finger can press.

### What you must do

- Say the dot's meaning in words: give it a label such as "Needs you". Never let the dot's color be the only sign.
- Write the trend in words and signs, such as "+12%" or "3 fewer", not as a color or an arrow alone.
- Give a chart its summary in words, as the sparkline asks.

### How to test

- Tab through a linked stat: it is one stop, with the focus ring round the whole tile, and Enter follows its address.
- With a screen reader, a stat is read as the name with the figure and its trend, then the description and the chart's summary; a linked one as a link by the name and the figure together; a dot's label is read as part of the name.
- On a touch screen, a press anywhere on the tile goes to the address.
- With text at 200% and the page 320 pixels wide, the description wraps and the figure stays whole.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to a linked stat, which is one stop. A stat with no address takes no keys. |
| Enter | Follows the linked stat's address. |

## Composition

Holds a name, a figure, an optional dot, an optional trend such as a [badge](../badge/badge.md), an optional description and an optional small chart such as a [sparkline](../sparkline/sparkline.md) or a [meter](../meter/meter.md). Sits in a card's slot, a grid or a framed row of stats; the frame, its corners and the lines between stats belong to what holds them.

## Usage rules

### Do

- Say what the figure means, and whether it is good or bad, in the description.
- Link the figure to the list or report it comes from, when there is one.
- Keep the name short: two or three words.

### Don't

- Put a chart with axes, or a long sentence, in a stat. The chart part is for a small line or bar.
- Use the dot without its words.
- Line up more figures than a reader can take in at a glance.

## Related

- [Description list](../description-list/description-list.md): terms and their values in a page of details.
- [Status dot](../status-dot/status-dot.md): the dot before the name.
- [Sparkline](../sparkline/sparkline.md): a figure's trend in a small line, under the stat's line.
- [Badge](../badge/badge.md): the change after the figure.
- [Card](../card/card.md): holds a stat in its slot, on the card's own inset.
