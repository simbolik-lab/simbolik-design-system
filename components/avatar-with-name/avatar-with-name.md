---
name: avatar-with-name
title: Avatar with name
type: component
block: smbk-avatar-with-name
adaptStrategy: css
figmaNodeId: 7125:4264
status: experimental
---

# Avatar with name

## Purpose

Shows who someone is: their avatar with their name beside it and, if wanted, a second line under the name, such as their role, their team or when they wrote something. It is an article's byline, the author of a quote, or the person a task is assigned to.

## Anatomy

- The block, a row as wide as its content.
- The avatar part, the avatar component at the size of the same name: a picture, or the person's initials.
- The text part, the name and the second line, one under the other, centred against the avatar.
- The name part, in a label style.
- The second line part (optional), in a smaller body style and the subtle text color.

## When to use

- To name a person wherever their face helps: a byline, a comment, an assignee, a quote.
- In a card's header or footer, or a list row about a person.

## When not to use

- For a group of people. Use an [avatar group](../avatar-group/avatar-group.md).
- For the signed-in person in a sidebar or app bar, which draw their own user part.
- When the name alone is enough and a picture would only add noise.

## Behavior

Four sizes, from extra small to large: each takes the avatar of the same size, and the name, the second line and the gap between avatar and text grow with it. A long name or second line wraps under itself; the avatar keeps its size. A picture that fails to load gives way to the initials, as the avatar's does. Nothing moves and nothing takes focus.

## Accessibility

### What it does for you

- The name is written out, so the avatar is decoration: its picture has an empty text alternative and its initials are hidden from screen readers, which read the name, then the second line.

### What you must do

- When the row is a link, as to the person's profile, put the whole row inside one link, so the name is the link's name.

### How to test

- With a screen reader, the row is read as the name, then the second line, with no picture or initials read before it.
- When the row is a link, Tab to it and press Enter: it follows the link, and the screen reader reads the name as the link's name.
- With text at 200% and the page 320 pixels wide, the name and the second line wrap and the picture stays whole.

## Composition

Holds the avatar component and text. Sits in a card, a list row, a table cell or under an article's title.

## Usage rules

### Do

- Write the person's name as they write it.
- Keep the second line short: a role, a team or a date.

### Don't

- Put a button or a link inside the row.
- Use the second line for a sentence; it is a caption, not a paragraph.

## Related

- [Avatar](../avatar/avatar.md): the picture or initials on their own.
- [Avatar group](../avatar-group/avatar-group.md): several people as overlapping avatars.
