---
name: card
title: Card
type: component
block: smbk-card
adaptStrategy: css
figmaNodeId: 4255:7087
status: experimental
---

# Card

## Purpose

A raised container that presents one thing — an article, a product, a person, a setting — as a unit with its own picture, heading, text and action. It sits on the page's surface with the first elevation level and a highlight edge, and everything inside it is laid out on the container inset.

## Anatomy

- The block, the raised container.
- The media part, an optional picture: above the content, beside it, or behind it.
- The content part, the column holding everything else.
- The header part with an optional icon, an eyebrow (small uppercase label) and a title.
- The body part, the text.
- The footer part, separated by the divider's two lines, holding a button, a link or a byline.

## When to use

- A grid or list of like items, each summarized.
- A single highlighted item: a featured article, a plan.

## When not to use

- As a wrapper for a whole page section. Sections are not cards.
- For a single line of information. Use a list row.
- For an interactive tile with one action. Make the whole card a link only when there is one target and nothing else inside is interactive.

## Behavior

None of its own. With a picture behind, the content sits at the bottom over a frosted overlay in the on-media text color.

A picture on top keeps its own shape, as wide as the card. Given the picture's own size, the card holds the picture's place before it loads, so nothing below it moves; cards further down a long page can also wait to fetch their picture until it nears the screen.

## Accessibility

- The card is an article element; its title is a heading, and the page decides the level. The wrapper renders a level-three heading unless given a `headingLevel` from two to six. Pick one level below the heading the card sits under, so the page's outline never skips a level: a card straight under the page's title is level two, a card in a titled section is level three. The level never changes how the title looks.
- A picture needs alternative text unless it is decorative.
- With a picture behind, the overlay is what keeps the text readable; the WCAG contrast rules apply to the composited result, which depends on the picture.
- In plain markup, write the title as the heading element that fits where the card sits, and keep the title class on it.

## Composition

Contains media, header, body and footer parts. The footer may hold a button, a link, or an avatar with a name and a caption. Sits in grids and stacks.

## Usage rules

### Do

- Keep one action per card, in the footer.
- Use the eyebrow for a category, not for a date.
- Set the title's heading level from where the card sits, one below the heading above it.

### Don't

- Nest cards. Figma has a nested "card" body type; it is for a specific composition and is not built.
- Put the divider in yourself. The footer draws it.

## Related

- Skeleton: the card's loading state.
- Image placeholder: what stands in for a missing picture.
