---
name: avatar-group
title: Avatar group
type: component
block: smbk-avatar-group
adaptStrategy: css
figmaNodeId: 7580:1856
status: experimental
---

# Avatar group

## Purpose

Shows the people on a project, a task or a thread in little room: a few overlapping avatars and a count of the rest, such as "+3". It says who is involved at a glance; the full list lives elsewhere.

## Anatomy

- The block, a list of people in a row as wide as its content.
- The item part, one person: the avatar component at its extra small size, in a ring of the page's surface color that keeps it apart from the face it overlaps. Each face sits over the one before it.
- The more part (optional), the count of the people not drawn, as a small gray pill in the same ring.

## When to use

- On a card, a row or a header, to show who works on something or who took part.
- Where three to five faces are enough and the names are one step away.

## When not to use

- For one person. Use an [avatar with name](../avatar-with-name/avatar-with-name.md).
- When the reader needs every name. List the people instead.
- As a button. The group takes no action; a page that opens the full list puts a separate button or link beside it.

## Behavior

The group draws the first people it is given, three by default, then the count of the rest. With no one left over, there is no count. A picture that fails to load gives way to that person's initials, as the avatar's does. Nothing moves and nothing takes focus.

## Accessibility

### What it does for you

- The group is a list named by how many people it holds, "8 people" by default, or by a name the page gives, such as "Assigned to 8 people".
- Each avatar is named by the person's name. The count is read as words, "and 3 more", not "+3".
- In high contrast mode the rings take the page's background color and the count an edge in the text color.

### What you must do

- Give the group a name that says who the people are when "8 people" is not enough, such as "Assigned to 8 people".
- Give the words the group says by itself, such as the count of the rest read aloud, in the page's own language. They keep their English unless the page gives its own.
- Put a separate button or link beside the group when a page opens the full list. The group itself takes no action.

### How to test

- With a screen reader, the group is read as a list with its name, each person by name, then the count of the rest as "and 3 more".
- Tab past it: the group takes no focus.
- In a forced-color mode, the rings and the count stay visible.
- With text at 200% and the page 320 pixels wide, the count stays whole beside the avatars.

## Composition

Holds avatar components and the count. Sits in a card's footer, a table cell, a list row or a page header.

## Usage rules

### Do

- Show three to five faces, and count the rest.
- Name the group by what the people do there, with how many they are.

### Don't

- Squeeze in more faces than fit; they stop being faces.
- Rely on the faces alone: give the full list one step away.

## Related

- [Avatar](../avatar/avatar.md): one person's picture or initials.
- [Avatar with name](../avatar-with-name/avatar-with-name.md): one person with their name beside them.
