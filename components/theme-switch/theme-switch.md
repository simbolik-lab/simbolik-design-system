---
name: theme-switch
title: Theme switch
type: component
block: smbk-theme-switch
adaptStrategy: css
figmaNodeId: 4209:19857
status: candidate
---

# Theme switch

## Purpose

The control a reader uses to choose the light or the dark theme. It is the [segmented control](../segmented-control/segmented-control.md) in its theme look, with two icon-only items, a moon and a sun, drawn small enough to live in a header.

## Anatomy

- The block, the bar: `smbk-theme-switch`, on the segmented control's block with its theme look modifier, drawn as the tabs' bar is, a canvas well with a hairline border at the large, medium or small control height, its items the smallest inset in from its edge and apart.
- The indicator part, first in the bar: the active item's raised surface as one piece, which slides between the two. Drawn only once the wrapper has placed it.
- Two item parts, dark first, each a hidden radio (the segmented control's control class) and an icon part, as tall as the bar inside its inset and edge and about as wide as tall. The icon is a step larger than the standard segmented control's at the same size. The active item is raised on the raised surface with a highlight edge: by the indicator, or by its own surface where there is no indicator.

## When to use

- Once per site, in the header or the footer, wherever the reader expects to find it.

## When not to use

- For any other two-way choice. Use the [segmented control](../segmented-control/segmented-control.md) with labels.

## Behavior

Hover colors an icon with the brand text, as Figma's theme item draws it. Pointing at an icon or moving the keyboard focus to it shows its name in a tooltip under it, which stays while pointed at and goes on Escape. Choosing calls back with the theme, and the raised surface slides to the chosen item with the state motion while the icons change color with the feedback motion; a change of size lands at once, and under reduced motion the raised surface lands at once while the color still fades. Setting the theme attribute on the page element, and remembering the choice, belong to the page: the theme is a reader's decision recorded on the page, not the control's state.

The browser's own bar on a phone (Chrome's on Android, an installed web app's title bar) takes its color from a theme-color tag, which cannot read a token. `followThemeColor()`, exported beside the switch, writes that tag from the page canvas token (or another color token it is given) and keeps it in step with the theme. The page calls it once, where it sets its theme.

The slide needs the React wrapper, which places the raised surface after each change. In markup written by hand, the chosen item draws its own raised surface and nothing slides.

On a touch screen the switch keeps its size, and each item takes an invisible press area out to the comfortable touch target above and below it and halfway to the other item.

## Accessibility
### What it does for you

- It is a radio group named "Theme"; each item has an accessible name saying which theme it sets, since the icons carry no text.
- The tooltip shows that name and is hidden from assistive technology, so it is not read twice.
- Arrow keys move between the two; the choice takes effect at once.
- On a touch screen each item takes an invisible press area out to the comfortable touch target.

### What you must do

- Give the page's own words for everything it says by itself, such as the group's name and each theme's, which keep their English until you do; a page in another language can change them.

### How to test

- Tab to the switch: focus lands on the chosen item with its focus ring, in both themes and in a forced-color mode. Press an arrow key: the other theme is chosen at once.
- Point at an icon or move the keyboard focus to it: its name shows in a tooltip, and Escape dismisses it.
- With a screen reader, it is read as a radio group named "Theme", each item by the theme it sets, read once.
- On a touch screen, a press just above or below an icon still chooses it.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the chosen item, and on from the group. |
| Arrow keys | Move to the other item and choose its theme at once. |
| Escape | Dismisses the tooltip showing an item's name. |

## Composition

Contains two items. Sits in the header, the footer, or the Showroom's own chrome.

## Usage rules

### Do

- Reflect the current theme in it on load, including a system preference the page has resolved.
- Call `followThemeColor()` once where the page sets its theme, so the phone's bar matches the page.

### Don't

- Offer it more than once on a page.
- Write a theme-color tag by hand: its color would be typed in, and it would not follow the theme.

## Related

- [Segmented control](../segmented-control/segmented-control.md): the general form, whose theme look this is.
