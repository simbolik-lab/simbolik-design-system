---
name: header
title: Header
type: component
block: smbk-header
adaptStrategy: css
figmaNodeId: 7392:2169
status: candidate
---

# Header

## Purpose

The bar across the top of a website: the brand, the main page links, a call to action and the theme switch. It is for a site someone reads. The app bar is its cousin for an application someone works in, where the end holds search and the user; the two share their looks and their parts.

## Anatomy

- The block, a raised bar with a hairline edge. With the background off it has no fill, edge or shadow and sits on the page behind it; the open menu keeps its surface.
- Five looks, the app bar's: floating (the default), floating hug (only as wide as its content, centered), flat (square, no edge or shadow, a hairline along its foot that the line setting turns off), split (the start on an island of its own, the links and the end on another) and centred (the links at the start, the brand in the middle).
- The panel part: the bar's surface when the bar has its own room or a frost; otherwise it is no box and the block draws the surface.
- The bar part, the row, at least a large control tall: the start part with the brand part and the logo part, then the trail part holding the nav part with the links part (the middle navigation items, or the large ones at the large size) and the end part (the call to action, the theme switch, and in a narrow space or once the links have folded the menu button part; in a narrow space the theme part is the theme switch's medium copy). In a wide space the bar is three columns: the start and the end share the room the links leave equally, so the links sit in the exact middle of the bar however long the brand or the end is. A link with children is a dropdown's opener, and its children are the dropdown's links. A link can carry a count or a dot after its label, as a navigation item does; a link inside the wide bar's dropdown carries neither.
- The logo part is the built-in simbolik logo, or a site's own picture files with their dark versions (`logoPicture`, the logo's `picture`): the whole logo, large in a wide space and small in a narrow one. Anything else goes in the brand's place (`brand`).
- The second row part, under the bar: a divider and the second row nav part, a row a control tall for further navigation such as line tabs.
- The menu part, under the bar when expanded: a divider, then the menu list part and, in a narrow space, the menu call-to-action part as its last row, every row a medium control tall and a small step apart. A group part opened under a link keeps the same rhythm, its links' words set further in than their link's, so they read as under it.
- The frost parts, three layers behind the bar when frosted.

## When to use

- The top of every page of a website.

## When not to use

- An application. Use the [app bar](../app-bar/app-bar.md), which has the same looks.
- A page with no navigation. A logo alone is not a header.

## Behavior

One markup serves both forms. In a wide space the links sit in the middle of the bar and the call to action at the end; when the bar is too short for the two ends to be equal, each keeps the room its content needs and the links move off the exact middle rather than overlap; in a narrow space both move into a menu that the menu button opens under the bar. A link with children shows a caret and opens its children instead of going to its own address, in both forms. In a wide space it opens them in the dropdown, hanging under it over the page, which grows to keep each child on one line; pressing it again, pressing Escape, choosing a link, clicking elsewhere or moving focus away closes it. A header can also be set to open these dropdowns on hover: a group then opens once a mouse rests on its link and closes a moment after the mouse leaves it and its panel, while a press still opens it for touch and the keyboard. In the narrow menu it opens them beneath it in place, and a group holding the current page starts open. A group can also be set to start open. The menu grows open under the bar with the enter motion and closes a little faster with the exit motion, and a group grows open under its item the same way; the wide dropdown drops in from its item. Under reduced motion all of them open and close at once. A page may switch the background while the header is on screen, as a site does when it keeps the bar clear at the top of the page and gives it its surface once content scrolls under it; the surface, edge and shadow then fade in and out with the state motion, under reduced motion too. The form follows the layout switch, so a wrapper can force either.

In a wide space too narrow for the links, the header folds them away rather than cutting anything off: the menu button takes their place and opens them under the bar, while the call to action and the theme switch stay in the row. The header measures its own row whenever its size or links change and once the fonts have loaded, and keeps the links whenever they fit, so they come back as soon as there is room. Before the page's script runs the row clips what it cannot hold, so the page never scrolls sideways. `fold={false}` keeps the links in the row; `fold="links"` holds them folded. Markup written by hand sets the fold modifier itself.

The header can have its own room (`zone`): the medium inset above and below a floating bar and a step in from the sides, a smaller one in a narrow space, and none around a flat bar; past the content width its row stays that wide and centered while the surface runs on. It is off by default, so a page that already leaves room around its header keeps its own. A frosted header has a blur behind it, strongest at the top and gone by its foot, so what scrolls under it is never read sharply there; it shows where the bar has no background of its own, or in its room, and is not drawn when the system asks for forced colors. In the centred look in a narrow space the theme switch steps aside so the brand can sit in the middle; the menu button stays.

The header does not hide while the reader scrolls down. A page that wants it to hide moves the header itself.

## Accessibility

### What it does for you

- A link's count and dot are part of its name, after a pause: "Issues, 18".
- The bar is a banner landmark; the links are a navigation landmark named "Main" by default and the menu one named "Menu".
- The menu button and each group opener carry their expanded state and control what they open. Escape closes the open menu and returns focus to the menu button, as the app bar's does.
- A group in the wide bar follows the disclosure navigation pattern of the WAI-ARIA Authoring Practices, which suits site navigation better than a menu: ordinary site navigation stays links and lists, not menus. The opener is a button; its children are ordinary links in a group named after it, and stay in the tab order. The down arrow on the opener opens the group on its first link; the arrows, Home and End move between the links; Escape closes and returns focus to the opener; Tab past the last link closes it and moves on.
- The current page carries the current-page marker in both forms, among the top-level links and among a group's children. The wide dropdown draws no mark for it, because its item has no such state.
- Parts hidden by the layout switch or folded away are removed from the tab order.
- In the centred look the brand is still first in reading and Tab order, before the links that are drawn to its left.

### What you must do

- Give the links another name when a page has more than one header.
- Give every word it says by itself, such as the menu button's name, in the page's language; each keeps its English unless the page gives its own.

### How to test

- With the keyboard only, Tab through the header: the brand comes first, every link, button and group opener shows its focus ring, and nothing hidden takes focus.
- Open a group in the wide bar with Enter or Down Arrow, move with the arrow keys, Home and End, then press Escape: it closes and focus returns to the opener.
- In the narrow form, open the menu with its button and close it with Escape: focus returns to the menu button.
- With a screen reader, the header is found as a banner landmark, its links as a navigation landmark by name, a count is read after the link's name, and the current page is read as current.
- With text at 200% and the page 320 pixels wide, the narrow form shows and every label stays whole.
- In a forced-color mode, the links, the current-page mark and the focus rings are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab or Shift + Tab | Moves focus to the next or previous link, button or group opener. Tab past the last link of an open group closes it. |
| Enter | Follows the focused link or presses the focused button. |
| Enter or Space | On the menu button or a group opener, opens or closes what it controls. |
| Down Arrow | On a group opener, opens the group on its first link. |
| Down Arrow or Up Arrow | In an open group, moves between its links. |
| Home or End | In an open group, moves to its first or last link. |
| Escape | Closes the open group or menu and returns focus to its opener. |

## Composition

Takes navigation items, a button, a theme switch, and line tabs for the second row. Sits at the top of the page; content follows it.

## Usage rules

### Do

- Keep to five or six top-level links.
- Make the call to action the one thing the site most wants the reader to do.
- When the page keeps the header stuck to the top of the window as it scrolls, give the page's root a top scroll padding of the header height (`--smbk-size-header-height`) and the gap above the bar, so a link reached with Tab or a heading jumped to never lands under the bar.
- Turn on the header's own room only where the page leaves none around it, so the space is never doubled.

### Don't

- Nest groups more than one level.
- Put a search field in it. That is the app bar.
- Rely on a group's own address. A link with children only opens them, so give the section's overview page a link of its own among the children.
- Pass a second theme switch or call to action for the narrow form. Pass each once: in the narrow form the header shows a medium copy of the theme switch, and the call to action at the medium size across the menu.

## Related

- [App bar](../app-bar/app-bar.md): the same bar for an application, with the same looks.
- [Navigation item](../nav-item/nav-item.md), [button](../button/button.md), [theme switch](../theme-switch/theme-switch.md), [logo](../logo/logo.md), [tabs](../tabs/tabs.md): the pieces.
- [Dropdown](../dropdown/dropdown.md): what a link's children open in a wide space.
