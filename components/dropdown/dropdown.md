---
name: dropdown
title: Dropdown
type: component
block: smbk-dropdown
adaptStrategy: css
figmaNodeId: 4800:63682
status: candidate
---

# Dropdown

## Purpose

A short list that opens from a button and goes away once something is chosen, so a row, a card or a bar can offer several things without showing a button for each. It serves two purposes: a menu of actions on one thing, or a group of links to other pages hanging from a navigation item. Choosing a value from a list is the select component.

## Anatomy

- The anchor part, present when the dropdown draws its own opener: it holds the opener and the panel, and the panel hangs from it.
- The opener, supplied by the consumer: a button or a navigation item. The dropdown tells it whether the panel is open and which panel it controls.
- The block, the raised panel. For actions it is a menu; for links it is a named group of links.
- The label part, an optional short heading over a group of items.
- The group part, which holds a label and the items after it, up to the next divider or label, and has the group role, named by the label. The React wrapper adds it; plain markup writes it around the label and its items. It is spaced as the panel is, so it changes nothing on screen.
- The item part, one action or one link, in Figma's order: an optional checkbox part (the checkbox component's small box, ticked or not), an optional icon part, the text part, an optional trailing icon part, and an optional key hint drawn with the kbd component. Icons read in the subtlest text color. A danger item is the destructive action and reads, icons included, in the danger color.
- The divider part, between groups.

## When to use

- Three or more actions on one thing: edit, duplicate, move, delete.
- Actions that are rarely used and would clutter a row as buttons.
- A handful of related pages under one navigation item, such as the services of a site under its Services link. The header does this for any link given children.

## When not to use

- One or two actions. Show them as buttons.
- Choosing a value. Use a select.
- A site's whole navigation, or links that people need to see at a glance. Show them in the header or the sidebar; a dropdown hides what it holds.
- Opening on hover alone. It must open on a press, so it works with touch and the keyboard.

## Behavior

With an opener, pressing the opener shows the panel under it, lined up with the opener's start or end edge, and pressing it again, choosing an item, pressing Escape, clicking outside or moving focus away closes it. The panel drops in from the opener across the gap and fades in with the enter purpose, and goes back the same way, a little faster, with the exit purpose; when the reader's system asks for less motion it simply appears and disappears. The opener's caret, where it has one, turns as the panel opens. A long item label wraps onto more lines inside the panel rather than running past its edge.

An opener can also be set to open on hover: the panel then opens once a mouse has rested on the opener for a short pause, so a pointer passing over does not open it, and closes a moment after the mouse has left both the opener and the panel, so the pointer can cross from one to the other. Pressing the opener still opens it, because touch and the keyboard have no hover and a menu must never open on hover alone; a click on a panel the pointer opened leaves it open. Only one dropdown opened by hover shows at a time: moving to another opener closes the first at once. The pause and the moment come from the motion tokens' hover purpose.

Without an opener, the panel draws the list and nothing else: opening, closing and placing it belong to whoever shows it. It still fades in when it appears.

Hovering or focusing an item sinks it into the sunken surface. Items are the medium control height, or the small one when the dropdown's size is small, with the medium inset at their sides; a long label grows the item past that height. An item given a checked value ticks: pressing it flips the tick and leaves the dropdown open, so several can be ticked in one go. The dropdown is the same in narrow and wide spaces; only the alignment is chosen, so a panel at the end of a bar stays inside the window.

Any element can be the opener if it renders one button and passes its id, its aria attributes and its click and key handlers through to that button; the system's button and navigation item both do. The dropdown adds the attributes and runs the opener's own handlers first.

Plain HTML pages get the look and the movement from the stylesheet but none of the behavior, which lives in the React wrapper.

The panel is closed with the hidden attribute. A page that opens and closes the panel itself, with no opener or in plain HTML, adds and removes that attribute, and the panel stays drawn until its exit movement finishes.

The panel is placed inside its anchor, so it works in every browser, but it does not flip upward when there is no room below it. An ancestor that clips its overflow clips the panel too.

## Accessibility

- The dropdown follows the menu button pattern of the WAI-ARIA Authoring Practices: the opener says whether the panel is open and which panel it controls, and for actions it says it opens a menu.
- For actions, the panel is a menu and each item a menu item. Opening moves focus to the first item; the down and up arrows move between items and wrap around; Home and End jump to the first and last; Escape closes and returns focus to the opener; Tab closes and moves on. The up arrow on the opener opens on the last item. Items are skipped by Tab, because the arrows move between them.
- For links, the panel is a group named by its label, the items are ordinary links in the tab order, and the opener keeps focus when pressed. The arrows, Home and End move between the links as well, and Escape closes and returns focus to the opener. Navigation is better served by links and lists than by menu roles, which is why this purpose has no menu roles.
- Choosing an action returns focus to the opener, so a keyboard user is never left on a closed panel.
- A ticking item is a menu item checkbox and says whether it is ticked; its drawn box is hidden from assistive technology.
- A disabled item is skipped by the arrows and cannot be chosen.
- The consumer supplies the label, which names the list, and an opener with a visible label or an accessible name.
- A label and the items after it are one group, named by the label, so a screen reader says which group an item is in.
- The key hint is drawn for the eye and hidden from screen readers, which get the shortcut as the item's aria-keyshortcuts instead ("⌘ X" becomes Meta+X), so the item's name is its words alone. The shortcut itself must be wired by the consumer.
- The panel's movement never delays focus: focus moves at once and the panel moves around it.

## Composition

Contains labels, items and dividers only; items are all buttons or all links. The opener is a button or a navigation item. With an opener, the panel sits in the raised layer, above the page and below overlays and dialogs.

## Usage rules

### Do

- Put the destructive action last, after a divider, and mark it danger.
- Keep labels to a verb and an object: "Delete row".
- Use the navigation purpose, with links, for pages; use the actions purpose, with buttons, for commands.
- Align a dropdown at the end of a bar to the end, so it opens inward.

### Don't

- Nest a menu inside an item.
- Mark more than one item danger.
- Mix links and actions in one dropdown. They follow different keyboard rules.
- Mix sizes in one panel. The size belongs to the dropdown, so every item is the same height.

## Related

- Select: choosing a value rather than an action. Its open list is this panel.
- Kbd: the key hint.
- Button and navigation item: the openers.
- Header: in a wide space it opens a link's children in a dropdown with the navigation purpose; its narrow menu opens them in place.
