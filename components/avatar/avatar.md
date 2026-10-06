---
name: avatar
title: Avatar
type: component
block: smbk-avatar
adaptStrategy: css
figmaNodeId: 962:62
status: candidate
---

# Avatar

## Purpose

A circle that stands for a person, a team or a thing: their picture when there is one, their initials when there is not, or an icon when it is not a person. Six sizes cover a chip's corner up to a profile header.

## Anatomy

- The block, a circle with a faint highlight edge, clipping its content.
- One of three fills: the initials part, the icon part, or the image part.

## When to use

- Beside a name in a list, a comment, a card.
- Inside a chip that stands for a person.
- As the main image of a profile.

## When not to use

- For a logo. Logos are not circles.
- For decoration without a subject.

## Behavior

None. It is inert; wrap it in a link or a button when it should do something.

## Accessibility

- An image avatar takes an alternative text describing the subject, or empty text when the name is written right beside it.
- Initials are always hidden from assistive technology, because they read as letters, not as a name. Given an alternative text, the avatar becomes one image named by it, so the name is read instead.
- An icon avatar is decorative unless labeled.

## Composition

Contains one fill. Sits in chips, lists, headers, and stacked groups.

## Usage rules

### Do

- Write the name beside a small avatar and leave its alternative text empty, so the name is read once.
- Use the neutral scheme for people and the brand scheme for the product itself.

### Don't

- Put more than two or three letters in the initials.
- Stretch it. It is square by its size.

## Related

- Chip carries a small avatar.
