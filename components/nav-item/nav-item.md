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
- The count part, optional: a small badge with a number after the label, such as open issues.
- The dot part, optional: a status dot after the label saying something here changed.
- The pause part, before a count or a dot: a comma only a screen reader hears.
- The caret part, optional, pointing down and turning up while the group is open.

## When to use

- Inside the header, app bar, footer, sidebar and drawer.
- Any list of destinations laid out as a navigation region.

## When not to use

- A link inside a sentence. Use the [link](../link/link.md) component.
- An action. Use a [button](../button/button.md).

## Behavior

Static as a link; hovering raises it on the raised surface with a highlight edge and a slight lift. The current page sits pressed into the bar at every size, on the canvas surface with an inset shadow and its text in the default color, its label one weight bolder at the large and middle sizes. Every label keeps the room of its bolder self, so an item that becomes the current page keeps its width and the items beside it do not move; markup written by hand gets this by repeating the label's words in the label's `data-label` attribute. Only the words seen keep that room: words inside the label for a screen reader only, such as a link's "(opens in a new tab)", go in an element marked `data-unseen`, which the React wrapper leaves out of the copy, so they never widen the item; markup written by hand leaves them out of `data-label`. As a group opener it is a button whose expanded state the parent component sets; the caret turns with it, with the state motion, and at once under reduced motion. The block flag stretches it across its row with the caret at the far end, which the stacked menus use. Three sizes, each with the text, icon, side padding and gap of its height: the large one, 40 tall with 16 px text and a 20 px icon, is the default and is what the app bar, the header and their stacked menus use; the middle one, 32 tall with 14 px text and a 16 px icon, is what the footer uses; the small one, 24 tall with 12 px text and a 12 px icon, is for dense lists. In a stacked list (the block form) a long label wraps onto more lines rather than being cut short, and the item grows to hold it; in a bar a label keeps one line, and a bar that runs short of room goes to its narrow form.

On a touch screen every item keeps its size and takes an invisible press area out to the comfortable touch target.

## Accessibility

### What it does for you

- It is a real link, or a real button when it opens a group, so Enter follows a link and Enter or Space presses a button.
- A count and a dot are part of the item's name, after a pause: "Issues, 18", "Inbox, changed". The dot never shows the change by color alone: it is read out.
- A link carries the current-page marker when it is the page the reader is on.
- A disabled item keeps its text, loses its address, and is announced as unavailable.
- In a forced-color mode, the current page is drawn in the system's highlight colors.

### What you must do

- Give the dot words of its own with `dotLabel` when "changed" does not say what it means.
- Make a group opener carry the expanded state and control the group it opens; the parent component does this.
- Mark exactly one item current per list, and keep the item inside a navigation region.

### How to test

- Tab to an item: the focus ring shows, in both themes and in a forced-color mode, where the current page is still told from the other items.
- Press Enter on a link: it is followed. Press Enter, then Space, on a group opener: each opens or closes the group.
- With a screen reader, an item is read as a link, or a button, by its label, then its count or dot words. The current page is read as current, and a disabled item as unavailable.
- With text at 200% and the page 320 pixels wide, a label in a stacked menu wraps and the item grows to hold it.
- On a touch screen, a press just outside the item's edge, within the comfortable touch target, presses it.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the item. |
| Enter | Follows the link, or presses the group opener. |
| Space | Presses a group opener. A link does not take it. |

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

- [Link](../link/link.md): links in running text.
- [Header](../header/header.md), [app bar](../app-bar/app-bar.md), [footer](../footer/footer.md), [sidebar](../sidebar/sidebar.md), [drawer](../drawer/drawer.md): where this lives.
