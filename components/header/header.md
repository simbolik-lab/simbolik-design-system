---
name: header
title: Header
type: component
block: smbk-header
adaptStrategy: css
figmaNodeId: 4209:22809
status: candidate
---

# Header

## Purpose

The bar across the top of a website: the brand, the main page links, a call to action and the theme switch. It is for a site someone reads. The app bar is its cousin for an application someone works in, where the middle holds search rather than links.

## Anatomy

- The block, a raised bar with a hairline edge. With the background off it has no fill, edge or shadow and sits on the page behind it; the open narrow menu keeps its surface.
- The bar part: the brand part with the logo part, the links part in the middle (at the medium or the large size), and the end part holding the call to action, the theme switch, and in a narrow space the menu button. In a wide space the bar is three columns: the brand and the end part share the room the links leave equally, so the links sit in the exact middle of the bar however long the brand or the end part is. A link with children is a dropdown's opener, and its children are the dropdown's links.
- The menu part, under the bar in a narrow space when expanded: the menu list part, with each link or group part separated by a divider, and the menu call-to-action part as the last row.

## When to use

- The top of every page of a website.

## When not to use

- An application. Use the app bar.
- A page with no navigation. A logo alone is not a header.

## Behavior

One markup serves both forms. In a wide space the links sit in the middle of the bar and the call to action at the end; when the bar is too short for the two ends to be equal, each keeps the room its content needs and the links move off the exact middle rather than overlap; in a narrow space both move into a menu that the menu button opens under the bar. A link with children shows a caret and opens its children instead of going to its own address, in both forms. In a wide space it opens them in the dropdown, hanging under it over the page; pressing it again, pressing Escape, choosing a link, clicking elsewhere or moving focus away closes it. A header can also be set to open these dropdowns on hover: a group then opens once a mouse rests on its link and closes a moment after the mouse leaves it and its panel, while a press still opens it for touch and the keyboard. In the narrow menu it opens them beneath it in place, and a group holding the current page starts open. A group can also be set to start open. In a narrow space the menu grows open under the bar with the enter motion and closes a little faster with the exit motion, and a group grows open under its item the same way; the wide dropdown drops in from its item. Under reduced motion all of them open and close at once. A page may switch the background while the header is on screen, as a site does when it keeps the bar clear at the top of the page and gives it its surface once content scrolls under it; the surface, edge and shadow then fade in and out with the state motion, and change at once under reduced motion. The form follows the layout switch, so a wrapper can force either.

The header does not hide while the reader scrolls down. A page that wants it to hide moves the header itself.

## Accessibility

- The bar is a banner landmark; the links are a navigation landmark named "Main" by default and the menu one named "Menu". Give the links another name when a page has more than one header.
- The menu button and each group opener carry their expanded state and control what they open. Escape closes the open narrow menu and returns focus to the menu button, as the app bar's does.
- A group in the wide bar follows the disclosure navigation pattern of the WAI-ARIA Authoring Practices, which suits site navigation better than a menu: ordinary site navigation stays links and lists, not menus. The opener is a button; its children are ordinary links in a group named after it, and stay in the tab order. The down arrow on the opener opens the group on its first link; the arrows, Home and End move between the links; Escape closes and returns focus to the opener; Tab past the last link closes it and moves on.
- The current page among a group's children carries the current-page marker in both forms. The wide dropdown draws no mark for it, because Figma's dropdown item has no such state.
- The current page carries the current-page marker in both forms.
- Parts hidden by the layout switch are removed from the tab order.

## Composition

Takes navigation items, a button and a theme switch. Sits at the top of the page; content follows it.

## Usage rules

### Do

- Keep to five or six top-level links.
- Make the call to action the one thing the site most wants the reader to do.

### Don't

- Nest groups more than one level.
- Put a search field in it. That is the app bar.
- Rely on a group's own address. A link with children only opens them, so give the section's overview page a link of its own among the children.
- Pass a second theme switch or call to action for the narrow form. Pass each once, at the large size: in the narrow form the header shows a medium copy of the theme switch, and the call to action at the large size across the menu.

## Related

- App bar: the same bar for an application.
- Navigation item, button, theme switch, logo: the pieces.
- Dropdown: what a link's children open in a wide space.
