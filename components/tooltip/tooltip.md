---
name: tooltip
title: Tooltip
type: component
block: smbk-tooltip
adaptStrategy: css
figmaNodeId: 4170:13949
status: candidate
---

# Tooltip

## Purpose

A small label that appears beside a control while the reader points at it or moves the keyboard focus to it, to say what it is or add a short explanation, and goes away when they move on. For an icon-only control it is the control's name made visible. It holds a few words, or a sentence or two, and nothing to press; for more, use a popover.

## Anatomy

- The block, holding the bubble and the arrow.
- The bubble part, a small box holding the words. It is as wide as its words up to the tooltip's greatest width, where they wrap onto more lines.
- The arrow part, a small triangle on one edge pointing at the target. The arrow axis names its edge and where along it: a top arrow points up at a target below the bubble's top, so the bubble sits under the target; a bottom arrow sits the bubble over the target; a left arrow sits it to the target's right; a right arrow to its left.
- With a target: the anchor part holds the target and the layer part, and the layer holds the tooltip.

## When to use

- Naming an icon-only control.
- A short hint or a sentence of explanation that would clutter the interface if always shown.

## When not to use

- Content that must be read to use the page. Put it on the page.
- Anything to press or fill in: a tooltip cannot be clicked into. Use a [popover](../popover/popover.md).
- A paragraph, a list or several steps. Use a popover, or put it on the page.
- The only place for the words: a touch screen cannot point, so the same words must be found elsewhere, such as the control's name.

## Behavior

Given its target as `trigger`, the tooltip draws the target and shows itself: a short wait after a mouse comes to rest on the target, and at once when the target takes the keyboard focus. It stays while the pointer moves from the target onto the tooltip and while the focus stays, so it can be read at leisure. It goes when the pointer leaves both, when the focus moves on, when the target is pressed, and when Escape is pressed, which leaves the focus where it is. Once one tooltip has shown, the next one shows at once as the pointer moves along a row of controls. It never shows from a touch.

It is placed beside its target on the side its arrow names, lifted over the page so no scrolling or clipped part around the target cuts it off. Without room on that side it takes the opposite side, and its arrow turns with it. Near the window's edge it moves inward, its arrow still pointing at the target's middle. It stays beside the target as the page scrolls, and closes when the target scrolls out of the window. It can be shown from the start, until the reader moves on.

Without script, a shown tooltip hangs beside its target on the side its arrow names, so markup written by hand can show and hide it with the hidden attribute. Without a target, the component draws the bubble alone, shown, for a page that shows and places it itself.

It fades in quickly when it appears, coming a short way out of its target on the side it was placed, and fades out where it is when it is hidden; under reduced motion it fades in and out without traveling.

## Accessibility
### What it does for you

- The bubble carries the tooltip role and holds text only, never anything focusable.
- When its words are the target's own name, as on an icon button, they are the target's accessible name and the bubble is hidden from assistive technology, so the name is not read twice.
- When its words add to the name, the target is described by the bubble, so its words are read after the name.
- It shows on keyboard focus as well as on pointing, stays while pointed at, and Escape dismisses it, leaving focus where it is.

### What you must do

- Never make a tooltip the only place for its words: a touch screen cannot point and it never shows from a touch, so the same words must be found elsewhere, such as the control's name.
- Put content that must be read to use the page on the page, and anything to press or fill in in a popover.

### How to test

- Tab to the target: the tooltip shows at once, and the target keeps its focus ring. Press Escape: the tooltip goes and focus stays where it was.
- With a screen reader, an icon-only target is read by its name once, and a target whose tooltip adds to its name is read with the tooltip's words after the name.
- Point at the target with a mouse, then move onto the tooltip: it stays, so it can be read at leisure.
- On a touch screen, check that the same words are found elsewhere, since the tooltip does not show from a touch.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the target, which shows the tooltip at once. |
| Escape | Dismisses the tooltip and leaves focus where it is. |

## Composition

Contains text only. With a target, it sits over everything on the page while it shows.

## Usage rules

### Do

- Keep it to a few words, or a sentence or two.
- Use it to name a control that has no visible label.

### Don't

- Repeat the visible label of the control in the tooltip.
- Put a link, a button or a field in it.

## Related

- [Popover](../popover/popover.md): for more than a tooltip holds, or anything to press.
- [Label](../label/label.md): its info icon shows its help in a tooltip.
- [Segmented control](../segmented-control/segmented-control.md) and [theme switch](../theme-switch/theme-switch.md): an icon-only item shows its name in a tooltip.
- [Sidebar](../sidebar/sidebar.md): kept closed, an item shows its name in a tooltip.
