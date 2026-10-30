---
name: segmented-control
title: Segmented control
type: component
block: smbk-segmented
adaptStrategy: css
figmaNodeId: 4209:19853
status: candidate
---

# Segmented control

## Purpose

Two to five named choices side by side in one bar, exactly one of them chosen, taking effect at once: a view switch, a period picker, a unit toggle. It is a radio group that looks like a control rather than a list.

## Anatomy

- The block, the bar: drawn as the tabs' bar is, a canvas well with a hairline border at the large, medium or small control height, its items the smallest inset in from its edge and apart and as tall as the bar inside it. Its items are equal by default, each as wide as the widest, sharing any width the bar is given; or each hugs its words.
- The indicator part, first in the bar: the chosen item's raised surface as one piece, which slides from choice to choice. Drawn only once the wrapper has placed it.
- The item part, one per choice, holding a hidden radio, an optional icon and a label. The chosen item sits on the raised surface with a highlight edge: the indicator's, or its own where there is no indicator.
- The icon part and the label part inside each item.
- What each item shows is set for the whole bar by the content axis. Label: the words, with the icon before them. Icon: the icon alone, or the short part, a short word, for a choice without an icon; the label stays in the item, hidden from view, as the radio's name. Description: the label with the description part, a short line of small text, under it; the bar grows to hold it.
- The look axis sets how the bar is drawn. Standard is the bar above. Theme is the [theme switch](../theme-switch/theme-switch.md)'s look, for a bar of icons alone: items about as wide as they are tall, each icon a step larger than the standard bar's at its size, and an icon hovered in the brand text color. The items take the type of the page around them, since they hold no words.

## When to use

- Switching between views of the same content: day, week, month.
- A setting with a few named values that all fit in a row.

## When not to use

- More than five choices, or long labels. Use the [select](../select/select.md).
- Choices that are not exclusive. Use [checkboxes](../checkbox/checkbox.md) or [chips](../chip/chip.md).
- Navigation between pages. Use [tabs](../tabs/tabs.md).

## Behavior

Choosing raises the chosen item and lowers the previous one: the raised surface slides from the old choice to the new one with the state motion, and the words change color with the feedback motion. Hover colors a label and its icon with the link hover text, or an icon with the brand text in the theme look. In a bar of icons alone, pointing at an item or moving the keyboard focus to it shows its label in a tooltip under it, which stays while pointed at and goes on Escape; a touch shows none, so the bar's own name and the chosen icon must make the choices clear. A key for the whole control (`shortcut`), such as one that steps to the next choice, shows after the control's name in a tooltip under the bar while it is pointed at or holds the keyboard focus; in a bar of icons alone it shows in each item's tooltip, after the item's name. An item shown as an icon alone can take a key of its own, shown in its tooltip in place of the control's. The control only shows the key: the page listens for it. Arrow keys move the choice; the change takes effect at once, whatever the motion. A change of size, or items growing as fonts load, moves the surface at once rather than sliding. Under reduced motion the raised surface lands at once and the color still fades.

On a touch screen the bar keeps its size, and each item takes an invisible press area out to the comfortable touch target above and below it and halfway to the next item.

## Accessibility

### What it does for you

- The bar carries the radio-group role. Each item is a real radio in a label, so the group behaves as radios do for keyboard and assistive technology.
- An item showing its icon alone keeps its label as its radio's name; the tooltip shows the same words and is hidden from assistive technology. A short word in place of an icon is hidden from it too.
- A description is read after the choice's name, as its description.
- The chosen state is shown by fill, edge and elevation as well as color.
- In a forced-color mode, the chosen item is drawn in the system's highlight colors.
- In a bar of icons alone, moving the keyboard focus to an item shows its label in a tooltip, which goes on Escape.
- A key is told to screen readers as `aria-keyshortcuts`: the whole control's on the group, an item's own on its radio. The tooltip showing it stays hidden from them.
- On a touch screen each item takes an invisible press area out to the comfortable touch target above and below it and halfway to the next item.

### What you must do

- Give the bar an accessible name; the wrapper requires one.
- For a bar of icons alone, make the bar's own name and the chosen icon clear the choices, since a touch shows no tooltip.
- Listen for a key you give the control or an item, and choose as it says: the control only shows and names the key. Take a single key only outside text fields.

### How to test

- Tab to the bar: focus lands on the chosen item. The arrow keys move the choice, which takes effect at once.
- In a bar of icons alone, an item's label shows in a tooltip when focus reaches it, and Escape hides it.
- With a screen reader, the bar is read as a group by its name, and each item as a radio by its label, with whether it is chosen and its place in the group.
- With text at 200% and the page 320 pixels wide, the items stay whole and reachable.
- In a forced-color mode, the chosen item is still told from the others.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus into the bar, to the chosen item, and out of it. |
| Down Arrow or Right Arrow | Moves the choice to the next item. |
| Up Arrow or Left Arrow | Moves the choice to the previous item. |
| Escape | Hides the tooltip: an item's label in a bar of icons alone, or the bar's own name and key. |

## Composition

Contains items only. Sits in toolbars, card headers and settings rows.

## Usage rules

### Do

- Give every item roughly the same label length so the bar reads as one control.

### Don't

- Leave nothing chosen. A segmented control always has a current value.

## Related

- [Radio](../radio/radio.md): exclusive choices as a list.
- [Tabs](../tabs/tabs.md): navigation between panels.
- [Theme switch](../theme-switch/theme-switch.md): this control in its theme look, choosing the light or the dark theme.
