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
- The panel part, holding the cells below from top to bottom. Floating, the default look, it is a raised panel with rounded corners and a hairline edge drawn inside it, as Figma draws it. Flat, it is square and on the page's own surface, with no shadow and a hairline along its end edge only. Open, it takes the medium width, the default, or the narrower small width (`width="sm"`, the `smbk-sidebar--width-sm` class); the column keeps its own width at either.
- Every cell (logo, search, user, foot) is as tall as the app bar, a medium control between two medium insets, and in the column each holds a medium control square: the items, the search and collapse buttons (Figma's small ghost button in that square), the avatar.
- The logo part (optional, on by default): the brand part, a link home, with the brand logo part when open and the brand mark part in the column, drawn in the same place; then a divider. The logo is the built-in simbolik logo, a site's own shapes (`logoShapes`, the logo's `shapes`), or a site's own picture files with their dark versions (`logoPicture`, the logo's `picture`), the whole logo when open and the mark in the column.
- The search part (optional): the search field part when open, the search button part in the column. No divider follows it, as Figma draws it.
- The nav part: section parts, each an optional group label part (holding the group title part, over a two-line rule) above a list part of items.
- The item part: the item body part (icon part and label part) and, for an item with children, the caret part. At the medium size, the default, a parent is a medium control tall with 16 px text and a 20 px icon; a child item is a small control tall with 14 px text, or with the medium children (`child="md"`, the `smbk-sidebar--child-md` class) a medium control tall with 16 px text, as tall as its parent; it has no icon, and its label starts under its parent's at either size; children touch, and a tree line runs down them from under the parent's icon, turning toward each child's label and ending at the last. Any item or child can end with the item marks part: a count (the item count part, a small badge) and a dot (the item dot part, a status dot), with the item said part, their words for a screen reader. In the column the count gives way and the dot sits on the icon's corner. At the small size every row is a small control tall with 14 px text and a 16 px icon. Kept closed, an item with children is a flyout opener, and its flyout part holds a flyout list part drawn with the dropdown's look, at the small size a small one.
- The footer part (optional): a divider, then the avatar, and the user part with the user name part and the user detail part.
- A divider, then the foot part (optional, on by default), holding the toggle part: the sidebar icon button that steps the display.

## When to use

- The side of an application with more sections than fit in an app bar.
- A page that wants most of the width most of the time, while the reader dips into the navigation now and then, such as the pages of a documentation site.
- Two side by side in a dashboard: a column kept closed, without its foot button, as the parent navigation between the application's areas, and beside it a sidebar for the current area's pages.

## When not to use

- A website. Use the [header](../header/header.md).
- A narrow screen. Use a [drawer](../drawer/drawer.md) holding the same navigation (the sidebar's navigation on its own).

## Behavior

It has three displays. Auto is where it starts: a column of icons that opens over the page, without moving it, once the mouse has rested on it for the hover open delay, and closes once the mouse has been away for the hover close delay (the motion tokens' hover purpose). Keyboard focus opens it at once and moving focus out of it closes it. A press on its items while it rests opens it and does nothing more, since a touch screen has no hover: opening moves the items, as an open group's children show, so the press must not act on whatever arrives under it. A touch reader taps once to open and again to choose; a press elsewhere closes it again. The logo, the search button and the foot button do not move, so a press on them acts at once, and a key press is never held back. Escape closes it and it stays closed until the pointer or focus has left it. Kept open, it takes its full width beside the page. Kept closed, it stays a column: pointing at an item without children, or moving the keyboard focus to it, shows its name in a tooltip beside the column, which stays while pointed at and goes on Escape; and an item with children opens its children in a flyout beside the column, drawn with the dropdown's look and headed by the item's name: pointing at the item, focusing it or pressing it opens it (never hover only); the pointer has a moment to cross the gap; moving focus out, pressing elsewhere or Escape closes it, and Escape puts focus back on the item. Only one flyout shows at a time, and a swap from one to the next is instant. The flyout stays inside the window and scrolls when its list is longer.

The button at the foot steps through the displays: auto, kept open, kept closed, and back to auto. Kept open or kept closed, the button stays pressed; in auto it is at rest. Stepping back to auto with a pointer leaves it closed until the pointer has left and come back, so it does not open under the very press that asked for auto.

Opening and closing glide, and are built to be smooth: the width moves with the fold motion both ways, slow to leave and slow to land, and a press or the pointer leaving on the way turns it round from where it is; every row keeps its height, so no row jumps; what the column hides (an open group's children and the group labels) grows open from no height with the panel and folds back the same way, in every browser, so the rows under it move smoothly. Closing, the words, the carets and the user's name fade into a slight blur in the first part of the fold, before the rows narrow under them, and the rows become the column's squares once it has landed; opening, the words come back out of the blur in the last part, once the rows are nearly wide again. The icons do not move at all, since a row's icon sits in the same square the column's item is. The logo turns into the other rather than swapping: opening, the whole logo starts with its mark exactly on the lone mark and glides into place as its letters fade in; closing, the reverse. Kept open from the open auto display, the panel is already open, so the room widens under it with the fold motion instead. The open panel's shadow deepens with the state motion. A change that does not come from the reader, such as a page restoring the display it remembered, lands at once. Under reduced motion the width and what the column hides land at once, and the words that come back as the panel opens still fade in.

The current page's item, an open group's item, and the item of a group holding the current page, open or closed, take a see-through gray fill, which shows on whatever surface the panel sits on, and a label one weight bolder, so the mark is not color alone.
Every label keeps the room of its bolder self, so nothing beside it moves as it turns bold (markup written by hand repeats the label's words in its `data-label` attribute). Pointing at any item, a child too, raises it with an edge and a slight shadow, and its words take the link hover color. With the React wrapper, that raised shape is one piece that slides from item to item with the mouse, children and their parent alike, and raises the nearest item when the pointer is between items, between groups or in the padding, where a click presses that item; it fades in where the pointer enters and out as it leaves, follows the panel at once as it folds, and lands without sliding when the reader's system asks for less motion. A column's flyout slides as the dropdown does. A touch screen shows no hover, and plain HTML keeps each item's own.

An item with children opens and closes them in place, using a native disclosure element, and starts open when one of its children is the current page. The children unfold as an accordion's item does, with the expand motion: they grow open as they fade in from a slight blur, and fold back the same way, and the caret turns with them. With the React wrapper they move the same in every browser, and a press on the way turns them round from where they are; in plain HTML, browsers that cannot animate to a natural height open and close them at once. Under reduced motion they open at once and fade in, and fade out before they close. A disabled item with children never opens. In auto, the column keeps the open panel's markup, so an item with children is still its disclosure and opening never swaps the element that has focus. The group holding the current page is marked in the column. A group label is a heading and does nothing when pressed. A long item label wraps onto more lines rather than being cut short.

The display can be kept outside (`display` with `onDisplayChange`, so a page can remember it) or left to the component. Without the foot button (`collapsible` off), the reader cannot change it: the sidebar keeps the display it is given, and a column kept closed still opens flyouts for its items with children. The panel takes the height it is given, and its list scrolls if the items overrun.

The navigation also comes on its own, without the panel (`SidebarNav`): its groups, their labels and items, children folding under their item, the current page marked, always open. It is for a drawer on a phone, where a page's navigation has no column to sit in: the drawer gives the header, the close button, the foot, the inset and the scrolling, so the navigation adds no inset of its own and its rows reach the drawer's edges, as its dividers do. It takes the medium children as the sidebar does (`child="md"`), carrying their class on the navigation itself, so a drawer on a phone shows them as the sidebar beside the page does.

A page that remembers the display should put it back before the first paint, so the sidebar never shows the wrong form for a moment: a small script placed right after the sidebar sets its display modifier class and its collapsed class from the stored value.

## Accessibility
### What it does for you

- The panel is a complementary landmark and the items a navigation landmark, both named by the sidebar's label ("Sidebar" by default), so a page with another complementary region, such as a column beside its content, never has two that sound the same.
- An item's count and dot are part of its name, after a pause: "Issues, 18, changed". In the column of icons they join the icon's name.
- In the column, the icons carry their labels as their names, so the column still reads; open, the labels are visible and the icons are hidden from assistive technology.
- The foot button is named for what pressing it does next ("Keep sidebar open", "Keep sidebar closed", "Open sidebar on hover") and carries whether the panel is open. It is not a pressed toggle, because it has three states, not two; its pressed look is visual only.
- The open auto display follows the rule for content shown on hover or focus: it stays while pointed at or focused, and Escape dismisses it without moving focus. A field's own Escape comes first.
- In the column, the group labels and an open group's children are folded away and hidden from assistive technology and the keyboard until the panel opens.
- Kept closed, an item's name stays its icon's accessible name; the tooltip that shows it is hidden from assistive technology, so it is not read twice.
- Kept closed, an item with children is a button that carries its expanded state and names the flyout it controls; the flyout's links follow it in the tab order. The one whose flyout holds the current page is the current item of the column (aria-current), so it is said, not only shown; inside the flyout the page's own link carries the current-page marker.
- The logo is a link home named by the logo.
- The current page carries the current-page marker. An item with children whose group holds the current page is the current item of its list (aria-current), so a closed group still says where the reader is.
- A disabled item keeps its text and loses its address, which leaves plain text that a screen reader reads as such, not as an unavailable link.
- Group labels are third-level headings unless `headingLevel` gives another, one below the heading the sidebar sits under.

### What you must do

- Give the dot words of its own with `dotLabel` when "changed" does not say what it means.
- Set `headingLevel` when the group labels should sit one level below the heading the sidebar sits under and that is not the third level.
- Give the page's own words for everything the sidebar says by itself, such as the search button's name and the foot button's three names, which keep their English until you do; a page in another language must change them.
- In markup written by hand, add aria-current to the summary of an item with children whose group holds the current page.

### How to test

- Tab through the sidebar: focus opens the panel at once, every item shows a focus ring, and moving focus out closes it. Escape closes it again without moving focus.
- Kept closed, Tab to an item with children and press Enter or Space: its flyout opens, its links come next in the tab order, and Escape closes it and puts focus back on the item.
- With a screen reader, the panel is found as a complementary region and the items as a navigation region, each by its name; the current page is read as current; an item's count and dot are read after its name.
- On a touch screen, one tap on an item of the resting column opens it, and a second tap chooses.
- With text at 200%, a long item label wraps onto more lines rather than being cut short.
- In a forced-color mode, the focus ring and the labels stay, and the current page's label is still one weight bolder.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus through the logo, search, items, user and foot button. Focus entering the auto display opens the panel at once, and focus leaving closes it. |
| Enter | Follows an item's link or the logo's link. |
| Enter or Space | Opens or closes an item's group, opens the flyout of an item with children in a kept-closed column, and presses the search and foot buttons. |
| Escape | Closes the open auto panel and the kept-closed column's flyout, leaving focus where it was; from a flyout, focus returns to its item. A field's own Escape comes first. |

## Composition

Takes the logo, a search field, an avatar and navigation data. Sits beside the page content in a layout the consumer builds; beside an app bar whose logo is turned off, since the logo is here.

## Usage rules

### Do

- Give every top-level item an icon; in the column it is all that is left.
- Turn the app bar's logo off beside it, so the page shows one logo.
- Keep to two levels.
- Turn the foot button off on a sidebar that must not change, such as a parent column beside a second sidebar.
- Use the flat look for a sidebar that runs flush to the window's top, bottom and start edges, and the floating one where the page keeps a gap around it.
- Use the small size where many items must fit, as in a tool with a long list of places; the medium one everywhere else.
- Use the small width, with the small size, for a dense application's list of pages beside its work, where the work needs the room; the medium width everywhere else.
- Use the medium children where the children are the places the reader goes most, such as the views under each section of a feed; keep them a step smaller, the default, where the parents are the main places and the children a step below them.

### Don't

- Put actions in it. It is for places, not verbs.
- Pass an avatar wider than a medium control. The column shows the same avatar as the open panel, and a wider one hangs over the column's edge.

## Related

- [Drawer](../drawer/drawer.md): the same navigation on a narrow screen.
- [App bar](../app-bar/app-bar.md): the bar across the top of the same application; its logo axis turns the bar's logo off beside the sidebar.
- [Navigation item](../nav-item/nav-item.md): the header's link, a sibling of the item here.
