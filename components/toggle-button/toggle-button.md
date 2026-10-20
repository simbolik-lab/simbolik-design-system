---
name: toggle-button
title: Toggle button
type: component
block: smbk-toggle-button
adaptStrategy: css
figmaNodeId: 7125:4263
status: experimental
---

# Toggle button

## Purpose

A button that stays on or off: bold text in an editor, a layer on a map, a filter that is applied. Pressing it switches a setting rather than running a one-off action, and it shows which way the setting is. It differs from the switch, which sets an option in a form or a settings list, and from the segmented control, which picks one of several choices.

## Anatomy

- The block, `smbk-toggle-button`, on a [button](../button/button.md) with the outline button's look when off, or the ghost button's for a tool among others in a toolbar. The markup has the toggle's block, then the button's own classes, at the chosen tone and size. The button's stylesheet draws it, off and on.
- The label part and the icon part, the button's own: words, an icon before them, or an icon alone.

Being on is the button's pressed state, read from its markup; there is no class for it, so what the reader sees and what a screen reader hears always agree.

## When to use

- A setting that applies at once and stays applied until pressed again: bold, a grid overlay, a map layer, "Show archived".
- A tool in a toolbar that is either on or off.

## When not to use

- An option in a form or a settings list that is saved with the form. Use the [switch](../switch/switch.md), or a [checkbox](../checkbox/checkbox.md).
- One choice out of several. Use the [segmented control](../segmented-control/segmented-control.md) or [radios](../radio/radio.md).
- A one-off action. Use the [button](../button/button.md).

## Behavior

Off, it is the outline button, or the ghost button in the ghost tone, with the same hover and pressed looks. On, it sinks into the page: the sunken fill, a soft shadow along its inner top edge and a light rim for its edge. It keeps the same size on and off, so nothing around it moves. Hovering an on toggle keeps the on look. A disabled toggle takes the shared disabled look, and an on one keeps its rim.

Pressing it switches it. The wrapper holds its own state, or follows the state the page gives it and reports each press. Nothing animates.

## Accessibility
### What it does for you

- It is a real button that says whether it is pressed, so a screen reader reads "pressed" or "not pressed" after its name.
- Space and Enter press it. It is one stop in the tab order.
- On is never told by color alone: the fill, the shadow and the edge all change.

### What you must do

- Keep its name the same on and off: "Bold", not "Make bold" and "Remove bold". The pressed state says which it is.
- Give an icon-only toggle an accessible name. Without one the wrapper warns in development and names it by its icon's words, which say what it shows, not what it turns on.
- In markup written by hand, give it the button's classes and the toggle's mark, set the pressed attribute to true or false, and switch it on each press.

### How to test

- Tab to it: the focus ring shows, in both themes and in a forced-color mode. Press Space, then Enter: each switches it.
- With a screen reader, it is read as a button by its name, with "pressed" or "not pressed", and its name does not change when it is switched.
- Check that on and off differ by the fill, the shadow and the edge, not by color alone.

## Composition

Contains a label, an icon and a label, or an icon alone. Sits in a toolbar, a bar of controls above a map or an editor, or beside other toggles. Must not contain another interactive element.

## Usage rules

### Do

- Name it for the setting it switches, the same in both states.
- Group related toggles together, such as bold, italic and underline.

### Don't

- Change its label when it is pressed. The pressed state says it.
- Use it for a choice saved with a form. Use the switch or a checkbox.

## Related

- [Button](../button/button.md): the one-off action it is built on.
- [Switch](../switch/switch.md): an on and off option in a form or a settings list.
- [Segmented control](../segmented-control/segmented-control.md): one choice out of several.
