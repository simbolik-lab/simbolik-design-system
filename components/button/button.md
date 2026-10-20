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
- The spinner part, the spinner's turning ring, drawn in the middle of a busy button over its hidden label and icons. Present only while the loading flag is on.

Leading and trailing icons are content, not options: they are placed by the markup, and the size axis sets their size. An icon-only button uses the same icon size as a labeled button of its size.

## Sizes

Three heights, each with its own padding, label and icon: small is 32 tall, medium 40, large 48, and in the compact density 28, 32 and 40. Medium is the default. Which one a page places depends on what the page is:

- An app or a dashboard uses the compact density: 40 for the page's one main action and for forms, 32 for toolbars and filters (the size used most), 28 for actions inside table rows and cards.
- A marketing page may place the large button for its main call to action.
- On a touch screen every size keeps these heights; one shorter than the comfortable touch target takes an invisible press area out to it.

A fourth, extra-small size is for one thing only: a ghost icon-only button beside text, such as a help button in a table heading or the "more" crumb in a breadcrumb trail. It is a 24 pixel square with a small icon. On any other tone or with a label the wrapper draws the small size instead and warns in development. On a touch screen it keeps its square and takes an invisible press area round it, out to the comfortable touch target, as every size does.

## When to use

- A primary action on a page or in a form: one brand button, so the eye finds it.
- Secondary and outline for actions beside a primary one, ghost for actions in dense chrome where a filled button would shout.
- Danger for an action that destroys or cannot be undone, always with a confirming step somewhere.

## When not to use

- For navigation. Use a [link](../link/link.md); if it must look like a button, the wrapper renders a link with button classes when given an address, and it stays a link to assistive technology.
- For a small selectable token in a list or a filter row. Use a [chip](../chip/chip.md).
- For grouping several related actions. Use the [button group](../button-group/button-group.md), which handles the shared edges.

## Behavior

Hover and pressed change the fill and border; the brand tone also gains an inset shadow when hovered or pressed, which reads as the button sinking. While pressed, the fill and its edge also draw in by a hairline on every side, so the button reads as pushed in at any width; its size, its place and its focus ring stay as they are. Buttons fused into a segmented bar or a split button, and a toggle button that is on, keep their pressed look without drawing in. The [toggle button](../toggle-button/toggle-button.md) is this button with its pressed attribute and the toggle's mark, and the button's stylesheet draws it on as well: sunken into the page, the same size as off. A disabled button of any tone takes the same faint fill, edge and label, always fainter than an enabled one; it keeps its footprint and drops pointer events. Nothing animates: state changes are immediate.

While its action runs, a button can be marked as loading. The spinner's ring turns in its middle, in the button's own label color, while the label and icons stay in place but unseen, so the button keeps its width and the row around it does not jump. It keeps its resting look, with no hover or pressed look, and shows a waiting pointer. A busy button stays focusable, and a click, Enter or Space does nothing: no handler runs, no form is sent, and a link goes nowhere. When the action ends, the page clears the flag and says how it went.

Desktop and mobile are the same implementation; the button does not change shape with the viewport, only with density through its control-size tokens.

A ref given to the wrapper reaches the native button, or the link when the button has an address.

## Accessibility

### What it does for you

- It is a real button, or a real link when it has an address, so Enter and Space press a button and Enter follows a link, with no script of yours.
- Its label is its name. Icons beside the label are hidden from assistive technology.
- Its focus ring is the system's: an outline in the focus color, set off from its edge, which survives forced-color modes.
- While loading, it keeps its label as its name, tells assistive technology it is busy, keeps focus and ignores presses. The turning ring is hidden from assistive technology.
- Disabled, it uses the native disabled attribute. Marked with the aria-disabled attribute instead, it stays in the tab order and does nothing when clicked or pressed with Enter or Space. The stylesheet draws both the same.
- On a touch screen every size takes a press out to the comfortable touch target through an invisible area round it, halfway to the next button where buttons stand closer. The button and its focus ring keep their own edge.

### What you must do

- Give an icon-only button an accessible name that says what it does, as a verb phrase. Without one the wrapper warns in development and names it by its icon's words, such as "Magnifying glass", which say what it shows, not what it does.
- When a loading button's action ends, say once how it went, from the page. The button does not announce it.
- Use aria-disabled rather than disabled when a disabled button should stay focusable and explain itself.
- In markup written by hand, add the busy attribute and block presses yourself while it loads.

### How to test

- Tab to it: the focus ring shows, in both themes and in a forced-color mode.
- Press Enter, then Space: each runs the action once. While it loads, neither does anything and focus stays on it.
- With a screen reader, it is read as a button, or a link, by its label; an icon-only button by what it does; a loading one as busy.
- With text at 200% and the page 320 pixels wide, its label stays whole.
- Automated checks find a missing name. A check by hand, with a keyboard and a screen reader, finds what they cannot.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the button. A disabled button is skipped; one marked aria-disabled is not. |
| Enter | Presses the button, or follows its address when it is a link. |
| Space | Presses the button. A button with an address is a link, which Space does not follow. |

## Composition

Contains a label and up to two icons. May sit inside a button group, a card footer, a form, an app bar, a dialog's action row. Must not contain another interactive element. A label drawn with the button's classes round a native input, as the file upload's button is, is the exception: it holds that one input beside its label part, and takes the input's focus ring and disabled look.

## Usage rules

### Do

- Use one brand button per view. Everything else is secondary, outline or ghost.
- Give an icon-only button an accessible name that says what it does, as a verb phrase.
- Mark a button as loading while its action runs, rather than disabling it, so the reader keeps the label and the focus.
- Keep the label short and start it with a verb.

### Don't

- Nest a button inside a link or a link inside a button.
- Change a button's colors with extra classes. The tones are the whole palette; a new tone is a Figma decision.
- Set a width on an icon-only button. It is square by its size.
- Use the extra-small size for anything but a ghost icon-only button beside text.

## Related

- [Link](../link/link.md): text that navigates.
- [Chip](../chip/chip.md): a small selectable token with the same tone families.
- [Button group](../button-group/button-group.md): several buttons sharing edges.
- [Toggle button](../toggle-button/toggle-button.md): a button that stays on or off.
- [Split button](../split-button/split-button.md): a main action with a menu of related ones.
- [Button note](../button-note/button-note.md): a button with a short line that says what it does or why it cannot be pressed.
- [Spinner](../spinner/spinner.md): the ring a loading button draws, on its own.
