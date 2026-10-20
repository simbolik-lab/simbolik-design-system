---
name: tabs
title: Tabs
type: component
block: smbk-tabs
adaptStrategy: css
figmaNodeId: 4171:15599
status: candidate
---

# Tabs

## Purpose

Lets the reader switch between a few views of the same thing without leaving the page: one panel is shown, the rest are hidden, and the bar says which. It is drawn much like the segmented control on purpose, but a segmented control is a form input that picks a value; tabs change what is on the page.

The same bar also moves between a few pages of one subject, each with an address of its own: given links (`TabsNav` in React), each tab is a link and the bar is a navigation, the link to the page shown marked as the current page. A reader can then open any of them in a new browser tab, and each page brings its own content, so there are no panels.

## Anatomy

- The block, holding the list and the panels.
- The list part, the bar: a canvas well with a hairline border, at a fixed height for each size. By default it hugs its tabs, each as wide as its words; with equal item width it spans the tabs' whole width and its tabs share it equally.
- The indicator part, first in the bar: the selected tab's raised surface as one piece, which slides from tab to tab. Drawn only once the wrapper has placed it.
- The tab part, one button per view, filling the bar's height. The selected one is raised on the raised surface: the indicator's, or its own where there is no indicator.
- The icon part, optional, before the label part.
- The badge part, optional, after the label part: a badge saying the view holds something changed or new.
- The pause part, inside the label part when there is a badge: a comma only a screen reader hears.
- The panel part, one per tab; only the selected one is displayed.
- In the links form, the block is a navigation holding the list, and each tab is a link; the one to the page shown is marked as the current page. There are no panels.
- The more part, in the links form past a number of links: a tab at the row's end, after the rest, opening a menu of the links that did not fit, with the caret part after its words. While the page shown is one of them, it takes that page's name and is drawn as the chosen tab.

The line look draws no well: one subtle line runs under the row, and the chosen tab is marked by a brand underline across its whole width, the indicator, which slides from tab to tab, and its label one weight bolder. Each line tab is a step taller than a boxed one, with a rounded row inside it that shows as a fill when the pointer is over the tab. A vertical bar in the line look draws the line down its start edge and a brand side bar beside the chosen tab.

## When to use

- Two to six views of one subject: overview, details, history.
- The line look where a well would be too heavy, such as a second row under a page's header or tabs inside a card.
- Settings grouped into sections that fit on one page.
- The links form for a few pages of one subject, each with its own address: a project's overview, issues and releases.

## When not to use

- Picking a value in a form. Use a [segmented control](../segmented-control/segmented-control.md) or [radios](../radio/radio.md).
- Moving between a site's main sections. Use the [header](../header/header.md), the [app bar](../app-bar/app-bar.md) or the [sidebar](../sidebar/sidebar.md).
- The tab list (the form with panels) to move between pages: its arrow keys would load each page they pass, and its pages could not be opened in a new browser tab. Use the links form.
- Steps in a sequence. Tabs imply the reader may go in any order.

## Behavior

Clicking a tab shows its panel. Selection can be controlled from outside or left to the component.

When the selection changes, the raised surface slides from the old tab to the new one with the state motion, the words change color with the feedback motion, and the new panel fades in with the enter motion, without moving. Nothing fades as the page loads, and a change of size or orientation, or tabs growing as fonts load, moves the surface at once rather than sliding. Under reduced motion the raised surface lands at once, and the color and the new panel still fade. Vertical tabs stack the bar beside the panels; the switch is a CSS change of layout, nothing else differs. A bar wider than the space it is given, such as several tabs with icons on a phone, scrolls sideways inside itself rather than widening the page.

In the links form a press on a link goes to its page, as any link does. When the page changes in place, without a new page load, the chosen tab's surface or underline slides to the new current page. Past the given number of links, the rest sit behind the more tab at the row's end, which opens a menu of them; the current page in that menu is drawn with the selected surface and its words a weight bolder.

On a touch screen every tab keeps its size and takes an invisible press area out to the comfortable touch target, reaching only halfway to the next tab; a bar that scrolls cuts the area off at its edge.

## Accessibility
### What it does for you

- The bar is a tab list. In the links form it is a navigation of links instead, with no tab roles.
- Left and right arrows (up and down when vertical) move between tabs and select as they go; Home and End jump to the ends. Disabled tabs are skipped.
- Only the selected tab is in the tab order; Tab from it lands on the panel, which is focusable so its content can be reached. When no enabled tab is selected (the value names none, or a disabled one), the first enabled tab is in the tab order instead, so the list can always be reached.
- The focus ring is drawn just inside the tab's edge, because the bar's padding is too thin to hold it outside and a bar that scrolls cuts off anything past its padding.
- Each panel is labeled by its tab.
- A badge in a tab is read as part of the tab's name, after a pause: "Activity, 18".
- In the line look the chosen tab is marked by a shape, the underline or side bar, and a bolder label, not only by its color.
- In the links form the link to the page shown is marked as the current page, so a screen reader says which page this is. Tab moves from link to link and Enter follows one; the arrow keys are left to the page. The more tab is a button saying whether its menu is open; its menu is a named group of links, and Escape closes it and returns focus to the button.
- On a touch screen every tab takes an invisible press area out to the comfortable touch target, reaching only halfway to the next tab.

### What you must do

- Supply an accessible name for the tab list.
- Give a dot badge a name of its own, such as "new", so the tab says what the dot means.
- In the links form, name the navigation, differently from any other navigation on the page, and mark the link to the page shown as current.

### How to test

- Tab to the tabs: focus lands on the selected tab, with the focus ring just inside its edge, in both themes and in a forced-color mode. Press the arrow keys, Home and End: focus and selection move, skipping disabled tabs. Tab again lands on the panel.
- With a screen reader, the bar is read as a tab list by its name, each tab by its name with a badge's words after it, and each panel by its tab.
- With text at 200% and the page 320 pixels wide, a bar wider than its space scrolls sideways inside itself rather than widening the page.
- On a touch screen, a press just outside a tab's edge still chooses it.
- In the links form, Tab moves through the links one by one, the arrow keys move nothing, and a screen reader names the navigation and says which link is the current page. Open the more tab with Enter: its links are read as a group, and Escape returns to the tab.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the selected tab, or to the first enabled tab when none is selected; pressed again, moves to the panel. |
| Right Arrow or Left Arrow | Moves to the next or previous tab and selects it. In vertical tabs, Down Arrow and Up Arrow do this instead. |
| Home or End | Moves to the first or last enabled tab and selects it. |
| Enter | In the links form, follows the focused link, or opens and closes the more tab's menu. |
| Escape | In the links form, closes the more tab's menu and returns focus to the more tab. |

## Composition

Tabs contain any content in their panels. Do not put a second set of tabs inside a panel; split the page instead.

Where one panel elsewhere shows each tab's view in turn, as the code block's body does, the tabs take that panel's id (`controls`) and draw no panels of their own; each tab is then named after the panel (`<controls>-tab-<value>`), so the panel can say which tab shows it. The code block holds the tabs at their small size this way.

Markup written by hand for the links form is a `nav` with the block's classes, the list inside it, and the tabs as links in the list after the indicator, the current one with `aria-current="page"`. The more tab is the dropdown's opener, a button with the tab and more classes, marked `data-current` while its menu holds the current page.

## Usage rules

### Do

- Keep labels to one or two words.
- Put the most used view first and select it by default.
- Use the links form when each tab is a page with an address of its own.

### Don't

- Use tabs for a single view. Show the content.
- Change the number of tabs while the reader is using them.
- Hide the current page behind the more tab when it could be one of the first few: order the links by how often they are used.

## Related

- [Segmented control](../segmented-control/segmented-control.md): the same bar, used to pick a value in a form.
- [Accordion](../accordion/accordion.md): expanding sections in place, for when all content should stay reachable at once.
