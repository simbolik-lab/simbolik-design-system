---
name: sidebar
title: Sidebar
type: component
block: smbk-sidebar
adaptStrategy: css
figmaNodeId: 4732:56128
status: candidate
---

# Sidebar

## Purpose

The panel down the side of an application: where the reader is, what else there is, and who they are signed in as. It starts as a column of icons, so the page has the room, and opens over the page when the reader points at it; the reader can keep it open or keep it a column instead. The drawer is what stands in for it on a narrow screen.

## Anatomy

- The block, the room the sidebar keeps beside the page: as wide as the panel when kept open or closed, and always the column's width in auto, where the open panel lies over the page instead of pushing it.
- The panel part, a raised panel with a hairline edge drawn inside it, as Figma draws it, holding the cells below from top to bottom.
- Every cell (logo, search, user, foot) is as tall as the app bar, a medium control between two medium insets, and in the column each holds a medium control square: the items, the search and collapse buttons (Figma's small ghost button in that square), the avatar.
- The logo part (optional, on by default): the brand part, a link home, with the brand logo part when open and the brand mark part in the column, drawn in the same place; then a divider. The logo is the built-in simbolik logo, or a site's own shapes (`logoShapes`, the logo's `shapes`).
- The search part (optional): the search field part when open, the search button part in the column. No divider follows it, as Figma draws it.
- The nav part: section parts, each an optional group label part (holding the group title part, over a two-line rule) above a list part of items.
- The item part: the item body part (icon part and label part) and, for an item with children, the caret part. A parent's icon sits in a square as big as the row is tall; a child item has no icon and its label starts under its parent's. Kept closed, an item with children is a flyout opener, and its flyout part holds a flyout list part drawn with the dropdown's look.
- The footer part (optional): a divider, then the avatar, and the user part with the user name part and the user detail part.
- A divider, then the foot part (optional, on by default), holding the toggle part: the sidebar icon button that steps the display.

## When to use

- The side of an application with more sections than fit in an app bar.
- A page that wants most of the width most of the time, while the reader dips into the navigation now and then, such as the pages of a documentation site.
- Two side by side in a dashboard: a column kept closed, without its foot button, as the parent navigation between the application's areas, and beside it a sidebar for the current area's pages.

## When not to use

- A website. Use the header.
- A narrow screen. Use a drawer holding the same navigation (the sidebar's navigation on its own).

## Behavior

It has three displays. Auto is where it starts: a column of icons that opens over the page, without moving it, once the mouse has rested on it for the hover open delay, and closes once the mouse has been away for the hover close delay (the motion tokens' hover purpose). Keyboard focus opens it at once and moving focus out of it closes it. A press on its items while it rests opens it and does nothing more, since a touch screen has no hover: opening moves the items, as an open group's children show, so the press must not act on whatever arrives under it. A touch reader taps once to open and again to choose; a press elsewhere closes it again. The logo, the search button and the foot button do not move, so a press on them acts at once, and a key press is never held back. Escape closes it and it stays closed until the pointer or focus has left it. Kept open, it takes its full width beside the page. Kept closed, it stays a column, and an item with children opens its children in a flyout beside the column, drawn with the dropdown's look and headed by the item's name: pointing at the item, focusing it or pressing it opens it (never hover only); the pointer has a moment to cross the gap; moving focus out, pressing elsewhere or Escape closes it, and Escape puts focus back on the item. Only one flyout shows at a time, and a swap from one to the next is instant. The flyout stays inside the window and scrolls when its list is longer.

The button at the foot steps through the displays: auto, kept open, kept closed, and back to auto. Kept open or kept closed, the button stays pressed; in auto it is at rest. Stepping back to auto with a pointer leaves it closed until the pointer has left and come back, so it does not open under the very press that asked for auto.

Opening and closing glide, and are built to be smooth: the width moves with the enter motion both ways; every row keeps its height, so no row jumps; what the column hides (an open group's children and the group labels) grows open from no height with the panel and folds back the same way, so the rows under it move smoothly; the words fade in a moment behind the glide, and closing, they fade out while the rows narrow with the panel, becoming the column's squares once it has landed; the icons do not move at all, since a row's icon sits in the same square the column's item is. The logo turns into the other rather than swapping: opening, the whole logo starts with its mark exactly on the lone mark and glides into place as its letters fade in; closing, the reverse. Kept open from the open auto display, the panel is already open, so the room widens under it with the enter motion instead. The open panel's shadow deepens with the state motion. A change that does not come from the reader, such as a page restoring the display it remembered, lands at once, and under reduced motion every change does.

An item with children opens and closes them in place, using a native disclosure element, and starts open when one of its children is the current page. The children grow open with the enter motion and close a little faster with the exit motion, and the caret turns with the state motion. In auto, the column keeps the open panel's markup, so an item with children is still its disclosure and opening never swaps the element that has focus. The group holding the current page is marked in the column. A group label is a heading and does nothing when pressed. A long item label wraps onto more lines rather than being cut short.

The display can be kept outside (`display` with `onDisplayChange`, so a page can remember it) or left to the component. Without the foot button (`collapsible` off), the reader cannot change it: the sidebar keeps the display it is given, and a column kept closed still opens flyouts for its items with children. The panel takes the height it is given, and its list scrolls if the items overrun.

The navigation also comes on its own, without the panel (`SidebarNav`): its groups, their labels and items, children folding under their item, the current page marked, always open. It is for a drawer on a phone, where a page's navigation has no column to sit in: the drawer gives the header, the close button, the foot, the inset and the scrolling, so the navigation adds no inset of its own and its rows reach the drawer's edges, as its dividers do.

A page that remembers the display should put it back before the first paint, so the sidebar never shows the wrong form for a moment: a small script placed right after the sidebar sets its display modifier class and its collapsed class from the stored value.

## Accessibility

- The panel is a complementary landmark and the items a navigation landmark, both named by the sidebar's label ("Sidebar" by default), so a page with another complementary region, such as a column beside its content, never has two that sound the same.
- In the column, the icons carry their labels as their names, so the column still reads; open, the labels are visible and the icons are hidden from assistive technology.
- The foot button is named for what pressing it does next ("Keep sidebar open", "Keep sidebar closed", "Open sidebar on hover") and carries whether the panel is open. It is not a pressed toggle, because it has three states, not two; its pressed look is visual only.
- The open auto display follows the rule for content shown on hover or focus: it stays while pointed at or focused, and Escape dismisses it without moving focus. A field's own Escape comes first.
- In the column, the group labels and an open group's children are folded away and hidden from assistive technology and the keyboard until the panel opens.
- Kept closed, an item with children is a button that carries its expanded state and names the flyout it controls; the flyout's links follow it in the tab order. The one whose flyout holds the current page is the current item of the column (aria-current), so it is said, not only shown; inside the flyout the page's own link carries the current-page marker.
- The logo is a link home named by the logo.
- The current page carries the current-page marker; a disabled item keeps its text and loses its address, which leaves plain text that a screen reader reads as such, not as an unavailable link.
- Group labels are headings.

## Composition

Takes the logo, a search field, an avatar and navigation data. Sits beside the page content in a layout the consumer builds; beside an app bar whose logo is turned off, since the logo is here.

## Usage rules

### Do

- Give every top-level item an icon; in the column it is all that is left.
- Turn the app bar's logo off beside it, so the page shows one logo.
- Keep to two levels.
- Turn the foot button off on a sidebar that must not change, such as a parent column beside a second sidebar.

### Don't

- Put actions in it. It is for places, not verbs.
- Pass an avatar wider than a medium control. The column shows the same avatar as the open panel, and a wider one hangs over the column's edge.

## Related

- Drawer: the same navigation on a narrow screen.
- App bar: the bar across the top of the same application; its logo axis turns the bar's logo off beside the sidebar.
- Navigation item: the header's link, a sibling of the item here.
