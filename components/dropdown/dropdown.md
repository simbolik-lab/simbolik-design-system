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

A short list that opens from a button and goes away once something is chosen, so a row, a card or a bar can offer several things without showing a button for each. It serves two purposes: a menu of actions on one thing, or a group of links to other pages hanging from a navigation item. An item can open a second menu beside it, for a set of related actions such as the folders a file can move to, and a group of items can be a single choice, such as the order a list is sorted in. The same menu can also open where the pointer is, on a right click over a part of the page such as a card, as a shortcut to that part's actions. Choosing a value from a list is the select component.

## Anatomy

- The anchor part, present when the dropdown draws its own opener: it holds the opener and the layer.
- The layer part, around the panel: while the panel shows, the React wrapper lifts it over the whole page so nothing cuts the panel off. Plain markup may leave it out; it has no box of its own until it is lifted.
- The opener, supplied by the consumer: a button or a navigation item. The dropdown tells it whether the panel is open and which panel it controls.
- The area part, present for a right-click menu instead of the anchor: it holds the part of the page the menu opens over, the point part and the layer. The point part is a place with no size, where the pointer was; the panel hangs from it.
- The block, the raised panel. For actions it is a menu; for links it is a named group of links.
- The label part, an optional short heading over a group of items, in small grey words.
- The group part, which holds a label and the items after it, up to the next divider or label, and has the group role, named by the label. The React wrapper adds it; plain markup writes it around the label and its items. It is spaced as the panel is, so it changes nothing on screen.
- The item part, one action or one link, in Figma's order: an optional checkbox part (the checkbox component's small box, ticked or not), an optional icon part, the text part, an optional trailing icon part, and an optional key hint drawn with the kbd component. Icons read in the subtlest text color. A danger item is the destructive action and reads, icons included, in the danger color. In a single choice, the chosen item's trailing icon is a tick.
- The submenu part, which holds an item that opens a second menu and that menu's own layer and panel. Its item ends with a caret pointing to the side the menu opens on, drawn as an icon part.
- The divider part, between groups.

## When to use

- Three or more actions on one thing: edit, duplicate, move, delete.
- Actions that are rarely used and would clutter a row as buttons.
- A handful of related pages under one navigation item, such as the services of a site under its Services link. The header does this for any link given children.

## When not to use

- One or two actions. Show them as [buttons](../button/button.md).
- Choosing a value. Use a [select](../select/select.md).
- A site's whole navigation, or links that people need to see at a glance. Show them in the [header](../header/header.md) or the [sidebar](../sidebar/sidebar.md); a dropdown hides what it holds.
- Opening on hover alone. It must open on a press, so it works with touch and the keyboard.

## Behavior

With an opener, pressing the opener shows the panel under it, lined up with the opener's start or end edge, and pressing it again, choosing an item, pressing Escape, clicking outside or moving focus away closes it. Only what is open on top closes: a dropdown inside a popover or a modal closes before what holds it. The panel comes out of the opener: it drops across the gap, growing from its edge nearest the opener, and fades in with the enter purpose, and goes back the same way, a little faster, with the exit purpose; when the reader's system asks for less motion it fades in and out in place, without traveling or growing. The opener's caret, where it has one, turns as the panel opens.

The panel is at least the dropdown width and grows to fit its longest item on one line, so a menu of short items keeps one width and a longer item never breaks onto two lines. It grows up to the dropdown's greatest width, and never past the window less a small margin each side; an item longer than that wraps onto more lines inside the panel rather than running past its edge. Both widths are size tokens.

An opener can also be set to open on hover: the panel then opens once a mouse has rested on the opener for a short pause, so a pointer passing over does not open it, and closes a moment after the mouse has left both the opener and the panel, so the pointer can cross from one to the other. Pressing the opener still opens it, because touch and the keyboard have no hover and a menu must never open on hover alone; a click on a panel the pointer opened leaves it open. Only one dropdown opened by hover shows at a time: moving to another opener closes the first at once. The pause and the moment come from the motion tokens' hover purpose.

A right-click menu is the same panel opened over an area of the page rather than from a button. A right click there opens it with its corner at the pointer, and the browser's own menu does not show; another right click elsewhere in the area moves it there. On a touch screen a finger held still on the area for the hold delay opens it where the finger is, and the phone's own callout for a held link or picture does not show there. From the keyboard, Shift+F10 or the menu key opens it under the element that has focus in the area, with focus on its first item, and closing it puts focus back on that element. It moves, closes and is used as any dropdown: the items, the keys, a press outside and Escape are the same.

Without an opener, the panel draws the list and nothing else: opening, closing and placing it belong to whoever shows it. It still fades in when it appears.

A list taller than the list height stops there and scrolls inside the panel, with a soft shade along its foot while more items wait below; the shade fades as the list reaches its end. Its scrollbar is the system's: a thin, see-through bar over its items that takes no room and shows while the mouse is over it or it scrolls. Markup written by hand keeps the browser's own thin bar. Moving through the items with the keys keeps the focused one in view.

An item with a caret opens a second menu at its right, its first item level with it, or at its left when there is no room at the right. It opens when the item is pressed, when the right arrow, Enter or Space is pressed on it, or when a mouse rests on it a moment; the left arrow or Escape closes it again, and it closes a moment after the mouse has left the item and its menu for another item, and whenever the menu it came from closes. Only one second menu of a panel shows at a time. While it shows, its item keeps the hover fill, so the way back is plain. The second menu has the same items, labels and dividers as the first, at the same size, and choosing in it closes every menu. It slides out of its item as it opens, and when the reader's system asks for less motion it only fades. Without script, a second menu given as open hangs at the right of its item, or under it in a narrow space, and the panel around it stops cutting off what overflows it.

A single choice is a group of items of which one is chosen, such as a sort order under a "Sort by" heading: the chosen item draws a tick after its label, and pressing another chooses it and closes the dropdown.

Hovering or focusing an item gives it the hover fill. With the React wrapper, the mouse's hover fill is one shape that slides from item to item with the pointer: between items, on a divider or in the panel's padding it lights the nearest item, and a click there presses that item. It fades in where the pointer enters and out as it leaves, lands without sliding when the reader's system asks for less motion, and steps aside while the keys move, so the focused item keeps its own fill and ring. A touch screen shows no hover fill, and plain HTML keeps each item's own. Items are the medium control height, set in the medium body text with medium icons, or, when the dropdown's size is small, the small control height with the small body text and small icons. Items touch one another, and a long label grows the item past its height. A disabled item dims its words, its icons and its key hint together. An item given a checked value ticks: pressing it flips the tick and leaves the dropdown open, so several can be ticked in one go. In a dropdown of links, a link to the page being shown, marked as the current page, is drawn with the selected surface and its words a weight bolder, as the tabs' more menu marks the current page it holds. The dropdown is the same in narrow and wide spaces; only the alignment is chosen, so a panel at the end of a bar stays inside the window.

Any element can be the opener if it renders one button and passes its id, its aria attributes and its click and key handlers through to that button; the system's button and navigation item both do. The dropdown adds the attributes and runs the opener's own handlers first.

Plain HTML pages get the look and the movement from the stylesheet but none of the behavior, which lives in the React wrapper.

The panel is closed with the hidden attribute. A page that opens and closes the panel itself, with no opener or in plain HTML, adds and removes that attribute, and the panel stays drawn until its exit movement finishes.

With an opener, the React wrapper shows the panel over the whole page, so a part around the opener that clips or scrolls never cuts it off and nothing on the page covers it, while the panel keeps the theme, density and text size of the place it opened from. It places the panel beside the opener on the side with room: under it, or above it when there is more room above, rising into place and growing upward from its foot instead of dropping, and sinking back toward the opener as it closes. The panel is never taller than that room, keeps a small gap from the window's edges, and stays beside the opener as the page scrolls. The placing uses React Aria, which a React project installs beside React. Without script, and in plain HTML, the panel hangs under the opener inside the page, where an ancestor that clips its overflow clips it too.

## Accessibility

### What it does for you

- The dropdown follows the menu button pattern of the WAI-ARIA Authoring Practices: the opener says whether the panel is open and which panel it controls, and for actions it says it opens a menu.
- For actions, the panel is a menu and each item a menu item. Opening from the keyboard moves focus to the first item; opening with a press moves it to the menu itself, so no item looks chosen, and the arrows start from there; the down and up arrows move between items and wrap around; Home and End jump to the first and last; Escape closes and returns focus to the opener; Tab closes and moves on. The up arrow on the opener opens on the last item. Items are skipped by Tab, because the arrows move between them. Typing a letter moves focus to the next item whose words start with it; letters typed quickly add up.
- For links, the panel is a group named by its label, the items are ordinary links in the tab order, and the opener keeps focus when pressed. The arrows, Home and End move between the links as well, and Escape closes and returns focus to the opener. Navigation is better served by links and lists than by menu roles, which is why this purpose has no menu roles.
- Choosing an action returns focus to the opener, so a keyboard user is never left on a closed panel.
- A ticking item is a menu item checkbox and says whether it is ticked; its drawn box is hidden from assistive technology.
- An item of a single choice is a menu item radio and says whether it is the chosen one; the tick is drawn for the eye only.
- An item that opens a second menu says it opens a menu and whether it is open, and the second menu is named by its item. The right arrow, Enter or Space opens it with focus on its first item; the left arrow or Escape closes it and puts focus back on its item; the arrows, Home, End and typed letters move inside the menu that has focus only. This follows the menu pattern of the WAI-ARIA Authoring Practices.
- A disabled item is reached by the arrows, so a screen reader says it is there and unavailable, and pressing it does nothing.
- A label and the items after it are one group, named by the label, so a screen reader says which group an item is in.
- The key hint is drawn for the eye and hidden from screen readers, which get the shortcut as the item's `aria-keyshortcuts` instead ("⌘ X" becomes Meta+X), so the item's name is its words alone.
- The panel's movement never delays focus: focus moves at once and the panel moves around it.

### What you must do

- Supply the label, which names the list, and an opener with a visible label or an accessible name.
- For a right-click menu, offer the same actions somewhere people can see them too, such as a menu button on the card: a right-click menu is hidden until someone knows to look for it, and a screen reader does not announce it. Make sure something in the area takes focus, so the keyboard can open it with Shift+F10.
- Wire a key hint's shortcut yourself; the dropdown only shows and announces it.

### How to test

- With the keyboard, press Enter on the opener: the panel opens, with focus on the first item for actions. Move with the arrow keys, Home and End, press Enter on an item, and focus returns to the opener. Press Escape to close it without choosing.
- With a screen reader, the opener says whether the panel is open, an actions panel is read as a menu and its items as menu items, and a group is read by its label.
- A ticking item is read as ticked or not ticked, an item of a single choice as checked or not checked, and a disabled item cannot be chosen.
- On an item with a caret, the right arrow opens its menu on the first item, the left arrow and Escape close it with focus back on the item, and a screen reader says the item opens a menu and whether it is open.
- A key hint is not read as part of the item's name; the shortcut is announced separately.
- On a right-click area, a right click opens the menu at the pointer, a finger held still opens it on a touch screen, and Shift+F10 on a focused element in the area opens it with focus on the first item; Escape puts focus back on that element.
- With text at 200% and the page 320 pixels wide, the panel stays inside the window and a long item wraps.
- In a forced-color mode, the focused item and the panel's edge are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Enter or Space | On the opener, opens and closes the panel. In an actions menu, focus moves to the first item; in a links panel, it stays on the opener. A press with the pointer opens an actions menu with focus on the menu, no item. |
| Down Arrow | On the opener, opens the panel on the first item. |
| Up Arrow | On the opener, opens the panel on the last item. |
| Down Arrow or Up Arrow | In the panel, moves to the next or previous item, wrapping around, a disabled one included. In a second menu, moves inside it only. |
| Right Arrow | On an item with a caret, opens its menu with focus on its first item. |
| Left Arrow | In a second menu, closes it and returns focus to its item. |
| Home or End | In the panel, moves to the first or last item. |
| A letter | In an actions menu, moves to the next item whose words start with it; letters typed quickly add up. |
| Enter or Space | On an item, chooses it. A ticking item flips its tick and leaves the panel open. On an item with a caret, opens its menu with focus on its first item. |
| Shift+F10 or the menu key | On an element in a right-click area, opens the menu under it with focus on the first item. |
| Escape | Closes the panel and returns focus to the opener. In a second menu, closes only that menu and returns focus to its item. |
| Tab | In an actions menu, closes the panel and moves on. In a links panel, moves through the links in the tab order. |

## Composition

Contains labels, items, dividers and items that open a second menu, which holds the same; items are all buttons or all links. The opener is a button or a navigation item. With an opener, the panel sits in the raised layer, above the page and below overlays and dialogs.

## Usage rules

### Do

- Put the destructive action last, after a divider, and mark it danger.
- Keep labels to a verb and an object: "Delete row".
- Use the navigation purpose, with links, for pages; use the actions purpose, with buttons, for commands.
- Align a dropdown at the end of a bar to the end, so it opens inward.
- Put the items of a single choice under a label that names the choice, and mark the current one.
- Use a right-click menu as a shortcut to actions that are also offered where people can see them.
- Keep second menus to one level where you can; each level is one more place to aim the pointer.

### Don't

- Hide an item people use often inside a second menu.
- Make a right-click menu the only way to reach an action.
- Give an item with a caret an action of its own: pressing it only opens its menu.
- Mark more than one item danger.
- Mix links and actions in one dropdown. They follow different keyboard rules.
- Mix sizes in one panel. The size belongs to the dropdown, so every item is the same height.

## Related

- [Select](../select/select.md): choosing a value rather than an action. Its open list is this panel, kept as wide as its field.
- [Kbd](../kbd/kbd.md): the key hint.
- [Button](../button/button.md) and [navigation item](../nav-item/nav-item.md): the openers.
- [Header](../header/header.md): in a wide space it opens a link's children in a dropdown with the navigation purpose; its narrow menu opens them in place.
