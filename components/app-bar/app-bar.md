---
name: app-bar
title: App bar
type: component
block: smbk-app-bar
adaptStrategy: css
figmaNodeId: 7353:700
status: candidate
---

# App bar

## Purpose

The bar across the top of an application screen: the brand, the main links, and at the end a search field, a couple of action buttons, the theme switch and the signed-in user. It is for a product someone is working in. The header is its cousin for a marketing or documentation site; the two share their looks and their parts.

## Anatomy

- The block, a raised bar with a hairline edge. With the background off it has no fill, edge or shadow and sits on the page behind it; the open menu keeps its surface.
- Five looks: floating (the default), floating hug (only as wide as its content, centered), flat (square, no edge or shadow, a hairline along its foot that the line setting turns off), split (the start on an island of its own, the links and the end on another) and centred (the links at the start, the brand in the middle).
- The panel part: the bar's surface when the bar has its own room or a frost; otherwise it is no box and the block draws the surface.
- The bar part, the row: the start part (the brand part with the logo part, then an optional badge part), the trail part holding the nav part (navigation items with their icons and any count or dot, the same links drawn as line tabs, or other content in their place) and the end part (the search part, the actions part, the theme switch and the user; a search button, in a narrow space, or in a wide one with no search field; and in a narrow space or once the links have folded the menu button part).
- The logo part is the built-in simbolik logo, or a site's own picture files with their dark versions (`logoPicture`, the logo's `picture`): the whole logo in a wide space and the mark in a narrow one. Anything else goes in the brand's place (`brand`), or in the whole start's place (`start`), such as a back button and a title part.
- The second row part, under the bar: a divider and the second row nav part, a row a control tall for further navigation such as line tabs.
- The menu part, under the bar when expanded: the links as large navigation items each filling its row, and in a narrow space the theme switch at the end.
- The frost parts, three layers behind the bar when frosted.

## When to use

- The top of every screen of an application.

## When not to use

- A website. Use the [header](../header/header.md), which has the same looks.
- Inside a page. It is page chrome, not content.

## Behavior

One markup serves both forms. In a wide space the links sit in the true middle of the bar: the start and the end share what the links leave equally, and where there is too little room each end keeps what it holds and the links move off the middle rather than overlap. Set to the start, the links follow the start and the free room comes after them. Set to the end, the links sit against the end group. An end group holding a search field keeps the same room on either side of the links instead, and there the search field narrows first. In a narrow space the links, the search field and the action buttons are removed and replaced by a search button and a menu button, and the menu button stacks the links under the bar. The form follows the layout switch, so a wrapper can force either. The menu state can be controlled from outside or left to the bar. Escape closes the open menu and puts focus back on the menu button. The menu grows open under the bar with the enter motion and closes a little faster with the exit motion; under reduced motion it opens and closes at once.

In a wide space too narrow for the whole row, the bar folds parts away rather than cutting them off: first the action buttons, then the links, whose place the menu button takes; it opens them under the bar. The bar measures its own row whenever its size or content changes and once the fonts have loaded, and keeps the least folded form that fits, so the links come back as soon as there is room. Only links fold: content passed in their place stays. Before the page's script runs the row clips what it cannot hold, so the page never scrolls sideways. `fold={false}` keeps every part in the row; a stage (`"actions"`, `"links"`) holds the bar there. Markup written by hand sets the fold modifier itself.

The bar can have its own room (`zone`): the medium inset above and below a floating bar and a step in from the sides, a smaller one in a narrow space, and none around a flat bar; past the content width its row stays that wide and centered while the surface runs on. It is off by default, so a page that already leaves room around its bar keeps its own. A frosted bar has a blur behind it, strongest at the top and gone by its foot, so what scrolls under it is never read sharply there; it shows where the bar has no background of its own, or in its room, and is not drawn when the system asks for forced colors.

The links can be drawn as tabs (`nav-type="tabs"`): small line tabs that fill the wide bar's whole height, the current page's brand underline lying on the bar's foot, the bar then 64 tall. They are still links, the current page marked, and the menu lists them as navigation items as before. Over a page with a sidebar under the bar, the start can be as wide as the expanded sidebar (`sidebar-start`), its logo the sidebar's logo size and in line with the sidebar's rows, so links set to the start begin at the sidebar's edge. That lines up when the bar's side inset is the page's gutter, as a flat bar's across a page with the medium inset gutter is. Both change the wide bar only.

The logo can be turned off for the wide bar, for a page whose logo sits elsewhere, such as at the top of a sidebar that runs the page's full height: the links then start the bar, a badge stays, and the end group keeps its place. The narrow bar keeps its logo whatever the setting, because there the page's other logo is usually gone with its sidebar.

A page that scrolls the window can turn on hide on scroll, page by page. In a narrow space the bar then stays at the top of the window while the page scrolls under it, slides up out of sight as the reader scrolls down, and comes back as soon as they scroll up, so the menu and search are never more than a small scroll away. It ignores moves of a few pixels, stays while the page is still within the bar's own height of the top, never hides while one of its menus is open or keyboard focus is inside it, and comes back the moment keyboard focus moves into it. It slides away with the exit motion and back with the enter motion; under reduced motion it hides and shows at once. A flat bar sticks flush with the window's top, and a bar with its background off takes the page's own surface while it sticks, still with no edge or shadow, so nothing shows through it. While such a bar is on the page, the window keeps the bar's room clear at its top whenever it scrolls to bring something into view, a link reached with Tab or a heading jumped to, so nothing lands under the bar. A wide space keeps the bar as it is. A page that is one screen by design, such as a home page, leaves it off.

A page can take the menu over (`onMenu`): the menu button then calls the page instead of opening the bar's own menu, and the bar draws no menu, so the page opens its own, such as a drawer holding the links and more. The button then says it opens a dialog rather than that it is expanded. On a phone, for example, a drawer can hold the site's sections and its whole category tree, with the theme switch in the drawer's foot.

Hide on scroll needs the bar to stick to the top of the window, and a sticking element cannot leave the element around it. Place the bar straight in the page's column, or give a wrapper that holds only the bar `display: contents` in a narrow space.

## Accessibility

### What it does for you

- The bar is a banner landmark. The links in the bar are a navigation landmark named "Main" by default, and the menu links one named "Menu". Drawn as tabs they are the same links in the same navigation, never a tab list.
- A link's count and dot are part of its name, after a pause: "Issues, 18".
- The current page's link carries the current-page marker, and its label is a weight step bolder as well as filled.
- The menu button carries its expanded state and names the menu it controls; the search button is named "Search". Escape closes the open menu and returns focus to the menu button.
- Parts hidden by the layout switch or folded away are removed from the tab order, so nothing is reachable that cannot be seen.
- A badge after the brand is read after it.
- In the centred look the brand is still first in reading and Tab order, before the links that are drawn to its left.
- A bar that has scrolled out of sight comes back the moment keyboard focus moves into it, and stays while focus is inside it, so a keyboard user never works in a bar they cannot see.

### What you must do

- Give the links another name when a page has more than one bar.
- Put something with an accessible name in the user slot, for example an avatar with the person's name.
- Give the words the bar says by itself, such as the menu button's and the search button's names, in the page's own language. They keep their English unless the page gives its own.

### How to test

- Tab through the bar: focus moves in the order it is read, the focus ring shows in both themes and in a forced-color mode, and nothing hidden takes focus.
- Open the menu with Enter or Space, then press Escape: it closes and focus is back on the menu button.
- With a screen reader, the bar is read as a banner with a "Main" navigation, the current page is announced as current, and a link's count is read after its label.
- With text at 200% and the page 320 pixels wide, the bar folds to its menu and every link stays reachable.
- On a page that scrolls, scroll the bar out of sight, then Tab into it: it comes back.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus through the visible links and buttons in reading order. |
| Shift + Tab | Moves focus back through them. |
| Enter | Follows a link, or presses the menu button or the search button. |
| Space | Presses the menu button or the search button. |
| Escape | Closes the open menu and returns focus to the menu button. |

## Composition

Takes a search field, buttons, a theme switch, an avatar or menu, navigation items or the tabs' links form, a badge, and line tabs for the second row (the tabs' links form when they move between pages). Sits at the top of the page; content follows it.

## Usage rules

### Do

- Give the user slot a way to sign out.
- Keep the links to the few that matter most; the same list fills the menu.
- Give every link an icon, or none.
- Turn on the bar's own room only where the page leaves none around it, so the space is never doubled.

### Don't

- Put more than two or three action buttons in it. Move the rest behind a menu.
- Rely on the action buttons in a narrow space or a crowded wide one: they fold away, so anything they do must be reachable elsewhere too.

## Related

- [Header](../header/header.md): the same bar for a website, with the same looks.
- [Search field](../search-field/search-field.md), [button](../button/button.md), [theme switch](../theme-switch/theme-switch.md), [avatar](../avatar/avatar.md), [badge](../badge/badge.md), [tabs](../tabs/tabs.md): the pieces.
