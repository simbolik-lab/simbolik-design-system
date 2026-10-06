---
name: nav-item
title: Navigation item
type: component
block: smbk-nav-item
adaptStrategy: css
figmaNodeId: 4209:20209
status: candidate
---

# Navigation item

## Purpose

One entry in a list of places to go: a header link, a footer column link, a row in the narrow-screen menu. It is quieter than the link component, which is for links inside running text, and it can carry a caret when it opens a group of further links rather than going somewhere itself.

## Anatomy

- The block: a link when it has an address, a button when it opens a group.
- The icon part, optional, before the label.
- The label part.
- The caret part, optional, pointing down and turning up while the group is open.

## When to use

- Inside the header, app bar, footer, sidebar and drawer.
- Any list of destinations laid out as a navigation region.

## When not to use

- A link inside a sentence. Use the link component.
- An action. Use a button.

## Behavior

Static as a link; hovering raises it on the raised surface with a highlight edge and a slight lift. The current page sits pressed into the bar at every size, on the canvas surface with an inset shadow and its text in the default color. As a group opener it is a button whose expanded state the parent component sets; the caret turns with it, with the state motion, and at once under reduced motion. The block flag stretches it across its row with the caret at the far end, which the stacked menus use. Three sizes: the large one is the default and is what the app bar, the header and their stacked menus use; the middle one is what the footer uses; the small one is for dense lists. In a stacked list (the block form) a long label wraps onto more lines rather than being cut short, and the item grows to hold it; in a bar a label keeps one line, and a bar that runs short of room goes to its narrow form.

## Accessibility

- A link with the current-page marker when it is the page the reader is on.
- A group opener must carry the expanded state and control the group it opens; the parent component does this.
- A disabled item keeps its text, loses its address, and is announced as unavailable.

## Composition

Contains an optional icon, text and an optional caret. Lives inside a navigation list; several make a list.

## Usage rules

### Do

- Keep labels to one or two words.
- Give every item in one list an icon, or none of them.
- Mark exactly one item current per list.

### Don't

- Use it outside a navigation region.
- Give a group opener an address as well; it is one or the other.

## Related

- Link: links in running text.
- Header, app bar, footer, sidebar, drawer: where this lives.
