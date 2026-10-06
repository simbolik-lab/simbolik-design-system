---
name: button
title: Button
type: component
block: smbk-btn
adaptStrategy: css
figmaNodeId: 4136:5058
status: candidate
---

# Button

## Purpose

The control a person presses to make something happen: submit, confirm, open, delete. It is the only component that carries an action's full color family — fill, border and label, with hover, pressed and disabled states — which is what separates it from a link, which is text that goes somewhere, and from a chip, which is a small selectable token.

## Anatomy

- The block, an inline row that centers its content and fixes its own height by size.
- The label part, the text. Required unless the button is icon-only.
- The icon part, a Phosphor glyph before the label, after it, or both. Optional. An icon-only button has exactly one icon and no label, and is square.

Leading and trailing icons are content, not options: they are placed by the markup, and the size axis sets their size.

## When to use

- A primary action on a page or in a form: one brand button, so the eye finds it.
- Secondary and outline for actions beside a primary one, ghost for actions in dense chrome where a filled button would shout.
- Danger for an action that destroys or cannot be undone, always with a confirming step somewhere.

## When not to use

- For navigation. Use a link; if it must look like a button, the wrapper renders a link with button classes when given an address, and it stays a link to assistive technology.
- For a small selectable token in a list or a filter row. Use a chip.
- For grouping several related actions. Use the button group, which handles the shared edges.

## Behavior

Hover and pressed change the fill and border; the brand tone also gains an inset shadow when hovered or pressed, which reads as the button sinking. Disabled buttons keep their footprint and drop pointer events. Nothing animates: state changes are immediate.

Desktop and mobile are the same implementation; the button does not change shape with the viewport, only with density through its control-size tokens.

A ref given to the wrapper reaches the native button, or the link when the button has an address.

## Accessibility

- The element is a real button, or a real link when it has an address. Enter and Space activate a button; Enter activates a link.
- The label is the accessible name. An icon-only button has no label, so it must be given an accessible name; the wrapper refuses to render one without it.
- Icons beside a label are decorative and hidden from assistive technology.
- Disabled buttons use the native disabled attribute by default. When a disabled control should remain focusable and explain itself, use the aria-disabled attribute instead; the stylesheet treats both the same, and the component makes an aria-disabled button do nothing when clicked or pressed with Enter or Space.
- The focus ring is the system rule: an outline in the focus color, offset from the edge, which survives forced-color modes.
- The small size is below the comfortable touch target. Avoid it as the only control on a touch-first surface.

## Composition

Contains a label and up to two icons. May sit inside a button group, a card footer, a form, an app bar, a dialog's action row. Must not contain another interactive element.

## Usage rules

### Do

- Use one brand button per view. Everything else is secondary, outline or ghost.
- Give an icon-only button an accessible name that says what it does, as a verb phrase.
- Keep the label short and start it with a verb.

### Don't

- Nest a button inside a link or a link inside a button.
- Change a button's colors with extra classes. The tones are the whole palette; a new tone is a Figma decision.
- Set a width on an icon-only button. It is square by its size.

## Related

- Link: text that navigates.
- Chip: a small selectable token with the same tone families.
- Button group: several buttons sharing edges.
