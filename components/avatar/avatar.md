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
- One of three fills: the initials part, the icon part, or the image part. Initials are set in the label styles in the small sizes and grow to the body and heading styles in the large ones.

## When to use

- Beside a name in a list, a comment, a card.
- Inside a chip that stands for a person.
- As the main image of a profile.

## When not to use

- For a logo. Logos are not circles.
- For decoration without a subject.

## Behavior

It is inert; wrap it in a link or a button when it should do something.

A picture that fails to load gives way to the initials, or to the icon when there are none, named by the same alternative text, so the circle never shows the browser's broken-picture mark. A picture that failed before the page's script ran is caught when it runs; without script the browser's own mark shows. A new address is tried afresh.

## Accessibility

### What it does for you

- Initials are always hidden from assistive technology, because they read as letters, not as a name. Given an alternative text, the avatar becomes one image named by it, so the name is read instead.
- An icon avatar is decorative unless labeled.

### What you must do

- Give an image avatar an alternative text describing the subject, or empty text when the name is written right beside it.
- Label an icon avatar when it means something, since it is decorative otherwise.

### How to test

- With a screen reader, an image avatar is read as its alternative text, an initials avatar with no alternative text is skipped, and one with an alternative text is read as one image by that name.
- When the name is written beside the avatar, the avatar adds nothing to what is read.
- Tab past it: the avatar takes no focus.

## Composition

Contains one fill. Sits in chips, lists, headers, and stacked groups.

## Usage rules

### Do

- Write the name beside a small avatar and leave its alternative text empty, so the name is read once.
- Use the default tone for people and the brand tone for the product itself.

### Don't

- Put more than two or three letters in the initials.
- Stretch it. It is square by its size.

## Related

- [Chip](../chip/chip.md) carries a small avatar.
