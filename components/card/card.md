---
name: card
title: Card
type: component
block: smbk-card
adaptStrategy: css
figmaNodeId: 7363:823
status: experimental
---

# Card

## Purpose

A bounded box about one thing — an article, a product, a person, a queue, a figure — presented as a unit with its own picture, header, body and footer. It stands on one of five surfaces, from a raised slab to a well cut into the page, and takes one of five layouts, from the picture on top to the picture behind the words.

## Anatomy

- The block, the box. Its surface sets its fill, shadow and edge; its layout where the picture goes and how much room the parts get.
- The media part, an optional picture: on top, beside the content, edge to edge at the top, or behind everything. It is a picture element, or a frame holding any element given in its place, such as an image placeholder.
- The content part, the column holding the header, the body and the footer, each optional.
- The header part, in one of five kinds: a title with an optional eyebrow and a quiet meta line; an icon in a sunken well over the title; a person, their avatar beside their name and role; a number before the title; or a window bar, three dots and a title in code type. Each comes in three sizes, lg for marketing pages, md for apps and sm for dense boards. A count, a status badge, a link, an arrow and a menu button can sit after the title or at the end.
- The body part, in one of two kinds: text, or a slot that stacks the system's other components, such as a stat, a list, a description list, a progress bar, a code block, an empty state or a chart.
- The footer part, a hairline rule and one row, in one of nine kinds: buttons at the end, a link with buttons, one button across the card, a link, a person with the reading time, tags, people, a total, or a note beside a button. The rule can be left out.
- In the panel layout, a divider runs edge to edge above the footer in place of its rule.

## When to use

- A grid or list of like items, each summarized: articles, tools, people, projects.
- A single highlighted item: a featured article, a plan, a quote.
- A dashboard panel: a title on a shaded band over a figure, a list or a chart, with its actions underneath.
- An item on a board, compact on the raised surface, that the reader opens or drags to another lane.
- A choice among a few options shown as cards, marked selected.

## When not to use

- As a wrapper for a whole page section. Sections are not cards.
- For a single line of information. Use a [list](../list/list.md) row.
- For a choice a reader makes with the keyboard as a radio or checkbox. Use a [choice card](../choice-card/choice-card.md), which is the control.

## Behavior

None of its own beyond its layout. The side layout stacks the picture above the words when the layout switch is narrow. With the picture behind, the picture fills the card and the content sits at its foot on a dark band, the scrim, in the on-media text color; the card is at least as tall as the small content width, so the picture shows above the band.

A picture keeps its own shape, as wide as the card, unless given a shape (16:9, 4:3 or 1:1). Given the picture's own size, the card holds the picture's place before it loads, so nothing below it moves; cards further down a long page can also wait to fetch their picture until it nears the screen. A picture with its own sources and sizes, or an image placeholder, can be given as an element instead of an address.

Content given to the wrapper goes into one body part, unless every piece of it is a body already: a `CardBody`, or a component of the page's own that draws one and carries the mark `cardPart = 'body'` (as in `ProjectBody.cardPart = 'body'`). The `footer` takes a `CardFooter`, or a component that draws one and carries `cardPart = 'footer'`, as it is, and puts anything else in a footer part. A component that draws a body without the mark ends up inside a second body; in development the console says so.

The selected flag draws a brand edge round the card; the brackets flag draws brand marks at its corners; the warning and danger edges color its rim; the dragged flag lifts the card with a deeper shadow while the page moves it.

Given an address or an open handler, the title becomes the card's one link or button, and its box is stretched over the card, so a press anywhere on the card follows it. The edge turns strong under the pointer, and the focus ring goes round the whole card. On a touch screen the press reaches the comfortable target size above and below a short card. With your own header, give the address or the handler to the header.

## Accessibility

### What it does for you

- The card is an article element, and its title is a heading. The wrapper renders a level-three heading unless given a `headingLevel` from two to six. The level never changes how the title looks.
- The header's arrow is decoration.
- The brackets are decoration and are hidden from assistive technology.
- The person header's avatar is hidden from assistive technology, since the name beside it is the heading.
- A card that opens something has one link or button, its title, so a screen reader hears the card's name once, as the link's or the button's. The rest of the card is not read twice.
- With a picture behind, the scrim keeps the text readable: it is dark enough in both themes that the on-media text passes 4.5:1 on it over the brightest picture.

### What you must do

- Pick the heading level one below the heading the card sits under, so the page's outline never skips a level. In plain markup, write the title as the heading element that fits where the card sits, and keep the title class on it.
- Make a card one of two things, never both: one link with nothing else to press inside it, or a box whose links and buttons are each their own target. Never wrap a link round a button.
- Name a menu button in the header for the card it acts on, such as "More actions for Team activity".
- Say what the selected edge, the warning and danger edges and a status dot mean in words too, in a status badge or the text, or use a choice card when the reader makes the choice. They are colors.
- Give a chart in the slot its own text alternative, as the chart asks.
- Keep everything else in a card that opens something out of the way of the press: no other link or button inside it.
- Give a picture alternative text unless it is decorative.

### How to test

- Tab through the card: focus goes to its one link, or to each link and button inside it, with the focus ring showing in both themes and in a forced-color mode.
- With a screen reader, the card is read as an article with its title as a heading at the level you chose; in a card that opens something, the title is read as a link or a button.
- Press a card that opens something away from its title, near a corner: it follows the link.
- Read the card with the colors taken away: every edge and dot still says what it means in words.
- With text at 200% and the page 320 pixels wide, the card stays whole and its text wraps.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the card's link when it is one link, or to each link and button inside it. |
| Enter | Follows the focused link, or presses the focused button. |
| Space | Presses the focused button. |

## Composition

Contains media, content, header, body and footer parts. Composes the avatar in the person header, the badge for a count, the status dot in window bars, the icon, and the divider in the panel layout. Takes the stat, the list, the description list, the progress bar, the code block, the empty state and the charts in its slot, and buttons, links, tags, badges and an avatar group in its footer. Sits in grids, stacks and board columns.

## Usage rules

### Do

- Keep one main action per card, at the end of its footer.
- Use the eyebrow for a category, not for a date.
- Set the title's heading level from where the card sits, one below the heading above it.
- Say a selection, a warning or a danger in words as well as with the edge.
- Pick one surface for a set of cards; save float for the one that leads.

### Don't

- Nest cards.
- Put a rule or divider in yourself. The footer draws its rule, and the panel layout its divider.
- Make a card both one link and a holder of buttons.

## Related

- [Choice card](../choice-card/choice-card.md): a card that is a radio or checkbox.
- [Skeleton](../skeleton/skeleton.md): the card's loading state.
- [Image placeholder](../image-placeholder/image-placeholder.md): what stands in for a missing picture.
- [Stat](../stat/stat.md): a figure, on its own or in a card's slot.
- [Board](../board/board.md): lanes of cards.
