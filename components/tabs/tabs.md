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

## Anatomy

- The block, holding the list and the panels.
- The list part, the bar: a canvas well with a hairline border, at a fixed height for each size. By default it hugs its tabs, each as wide as its words; with equal item width it spans the tabs' whole width and its tabs share it equally.
- The indicator part, first in the bar: the selected tab's raised surface as one piece, which slides from tab to tab. Drawn only once the wrapper has placed it.
- The tab part, one button per view, filling the bar's height. The selected one is raised on the raised surface: the indicator's, or its own where there is no indicator.
- The icon part, optional, before the label part.
- The badge part, optional, after the label part: a badge saying the view holds something changed or new.
- The panel part, one per tab; only the selected one is displayed.

## When to use

- Two to six views of one subject: overview, details, history.
- Settings grouped into sections that fit on one page.

## When not to use

- Picking a value in a form. Use a segmented control or radios.
- Moving between pages. Use links, the header or the sidebar.
- Steps in a sequence. Tabs imply the reader may go in any order.

## Behavior

Clicking a tab shows its panel. Selection can be controlled from outside or left to the component.

When the selection changes, the raised surface slides from the old tab to the new one with the state motion, the words change color with the feedback motion, and the new panel fades in with the enter motion, without moving. Nothing fades as the page loads, and a change of size or orientation, or tabs growing as fonts load, moves the surface at once rather than sliding. Under reduced motion everything changes at once. Vertical tabs stack the bar beside the panels; the switch is a CSS change of layout, nothing else differs. A bar wider than the space it is given, such as several tabs with icons on a phone, scrolls sideways inside itself rather than widening the page.

## Accessibility

- The bar is a tab list with an accessible name the consumer must supply.
- Left and right arrows (up and down when vertical) move between tabs and select as they go; Home and End jump to the ends. Disabled tabs are skipped.
- Only the selected tab is in the tab order; Tab from it lands on the panel, which is focusable so its content can be reached. When no enabled tab is selected (the value names none, or a disabled one), the first enabled tab is in the tab order instead, so the list can always be reached.
- The focus ring is drawn just inside the tab's edge, because the bar's padding is too thin to hold it outside and a bar that scrolls cuts off anything past its padding.
- Each panel is labeled by its tab.
- A badge in a tab is read as part of the tab's name. Give a dot badge a name of its own, such as "new", so the tab says what the dot means.

## Composition

Tabs contain any content in their panels. Do not put a second set of tabs inside a panel; split the page instead.

Where one panel elsewhere shows each tab's view in turn, as the code block's body does, the tabs take that panel's id (`controls`) and draw no panels of their own; each tab is then named after the panel (`<controls>-tab-<value>`), so the panel can say which tab shows it. The code block holds the tabs at their small size this way.

## Usage rules

### Do

- Keep labels to one or two words.
- Put the most used view first and select it by default.

### Don't

- Use tabs for a single view. Show the content.
- Change the number of tabs while the reader is using them.

## Related

- Segmented control: the same bar, used to pick a value in a form.
- Accordion: expanding sections in place, for when all content should stay reachable at once.
