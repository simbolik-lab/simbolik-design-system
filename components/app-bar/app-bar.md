---
name: app-bar
title: App bar
type: component
block: smbk-app-bar
adaptStrategy: css
figmaNodeId: 4239:28857
status: candidate
---

# App bar

## Purpose

The bar across the top of an application screen: the brand, the main links, and at the end a search field, a couple of action buttons, the theme switch and the signed-in user. It is for a product someone is working in. The header is its cousin for a marketing or documentation site.

## Anatomy

- The block, a raised bar with a hairline edge. With the background off it has no fill, edge or shadow and sits on the page behind it; the open narrow menu keeps its surface.
- The bar part: the brand part with the logo part, the nav part holding large navigation items with their icons, and the end part holding the search part, the actions part, the theme switch, a vertical divider and the user, and in a narrow space a search button and a menu button.
- The menu part, under the bar in a narrow space when expanded: a divider, the links as large navigation items each filling its row, and the theme switch at the end.

## When to use

- The top of every screen of an application.

## When not to use

- A website. Use the header.
- Inside a page. It is page chrome, not content.

## Behavior

One markup serves both forms. In a wide space the links follow the brand, with the same room on either side of them, or, set to the end, sit against the end group; the search field leads the end group, before the action buttons, the theme switch and the user. The divider stands before the user and shows only when there is one. In a narrow space the links, the search field and the action buttons are removed and replaced by a search button and a menu button, and the menu button stacks the links under the bar. When the bar runs short of room, the search field narrows first. The form follows the layout switch, so a wrapper can force either. The menu state can be controlled from outside or left to the bar. Escape closes the open menu and puts focus back on the menu button. The narrow menu grows open under the bar with the enter motion and closes a little faster with the exit motion; under reduced motion it opens and closes at once.

The logo can be turned off for the wide bar, for a page whose logo sits elsewhere, such as at the top of a sidebar that runs the page's full height: the links then start the bar and the end group keeps its place. The narrow bar keeps its logo whatever the setting, because there the page's other logo is usually gone with its sidebar; Figma's Logo boolean is bound in the desktop variants only.

A page that scrolls the window can turn on hide on scroll, page by page. In a narrow space the bar then stays at the top of the window while the page scrolls under it, slides up out of sight as the reader scrolls down, and comes back as soon as they scroll up, so the menu and search are never more than a small scroll away. It ignores moves of a few pixels, stays while the page is still within the bar's own height of the top, never hides while one of its menus is open or keyboard focus is inside it, and comes back the moment keyboard focus moves into it. It slides away with the exit motion and back with the enter motion; under reduced motion it hides and shows at once. A wide space keeps the bar as it is. A page that is one screen by design, such as a home page, leaves it off.

A page can take the narrow menu over (`onMenu`): the menu button then calls the page instead of opening the bar's own menu, and the bar draws no menu, so the page opens its own, such as a drawer holding the links and more. The button then says it opens a dialog rather than that it is expanded. On a phone, for example, a drawer can hold the site's sections and its whole category tree, with the theme switch in the drawer's foot.

Hide on scroll needs the bar to stick to the top of the window, and a sticking element cannot leave the element around it. Place the bar straight in the page's column, or give a wrapper that holds only the bar `display: contents` in a narrow space.

## Accessibility

- The bar is a banner landmark; the links in the bar are a navigation landmark named "Main" by default, and the menu links one named "Menu". Only one of the two is ever shown. Give the links another name when a page has more than one bar.
- The current page's link carries the current-page marker.
- The menu button carries its expanded state; the search button is named "Search". Escape closes the open menu and returns focus to the menu button.
- Parts hidden by the layout switch are removed from the tab order, so nothing is reachable that cannot be seen.
- A bar that has scrolled out of sight comes back the moment keyboard focus moves into it, and stays while focus is inside it, so a keyboard user never works in a bar they cannot see.
- The user slot must contain something with an accessible name, e.g. an avatar with the person's name.

## Composition

Takes a search field, buttons, a theme switch, an avatar or menu, and navigation items. Sits at the top of the page; content follows it.

## Usage rules

### Do

- Give the user slot a way to sign out.
- Keep the links to the few that matter most; the same list fills the narrow-space menu.
- Give every link an icon, or none.

### Don't

- Put more than two or three action buttons in it. Move the rest behind a menu.

## Related

- Header: the same bar for a website, with links in the middle.
- Search field, button, theme switch, avatar: the pieces.
