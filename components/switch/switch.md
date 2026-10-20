---
name: switch
title: Switch
type: component
block: smbk-switch
adaptStrategy: css
figmaNodeId: 4086:11238
status: candidate
---

# Switch

## Purpose

An on-or-off setting that takes effect the moment it is flipped, like a light switch. The thumb's position says the state; the brand fill says it is on, the gray fill that it is off. A checkbox is for a choice saved later; a switch is for a change made now.

## Anatomy

- The block, a label element holding everything.
- The control part, the real checkbox with the switch role, visually hidden.
- The track part, the rounded channel, filled gray when off and red when on.
- The thumb part, the raised light square that sits at one end or the other. It stays light in both themes.
- The on-icon and off-icon parts, optional: a tick on the thumb when on and a cross when off, on the lg and md sizes.
- The label part, the text.

## When to use

- Settings and preferences that apply immediately.
- Turning a feature on or off in a panel.

## When not to use

- Anything submitted with a form. Use a [checkbox](../checkbox/checkbox.md).
- Choosing between two named options. Use the [segmented control](../segmented-control/segmented-control.md), which shows both names.

## Behavior

Flipping slides the thumb to the other end with the state motion, the same in both directions, and swaps the track fill at once, so a theme change never fades it. Under reduced motion the thumb jumps. Under the pointer, an on track darkens its red; an off track stays as it is. With a mouse, pointing at the switch stretches the thumb a little wider, like a pill, and pressing it stretches the thumb further and squashes it, so the switch answers the press before it flips. Off, the thumb grows from its start; on, it grows inward, so its outer edge stays at the end of the track. The switch itself and everything around it never move. A disabled switch and a touch screen do not stretch, and under reduced motion the stretch changes at once. Disabled turns the track a faint gray, the thumb the disabled surface without its edge or lift.

With `icon`, the thumb carries a tick when on and a cross when off. The small thumb has no room for them, so the small size never shows them.

Three sizes: lg, a 24 track; md, 20; sm, 16. At every size the whole row is at least 24 tall.

On a touch screen the row keeps its height and takes an invisible press area out to the comfortable touch target; between switches stacked one under another it reaches only halfway into the gap.

## Accessibility
### What it does for you

- The control carries the switch role, so it is announced as a switch with on and off, and Space flips it.
- The label element names it; the text is required.
- The focus ring draws around the track.
- State is shown by position and fill, not by color alone.
- The tick and the cross are hidden from assistive technology, which hears the state from the control.
- On a touch screen the row keeps its height and takes an invisible press area out to the comfortable touch target.

### What you must do

- Give every switch label text, which names it.

### How to test

- Tab to the switch: the focus ring shows around the track, in both themes and in a forced-color mode. Press Space: it flips.
- With a screen reader, it is read as a switch by its label, on or off.
- On a touch screen, a press just outside the track still flips it.
- With text at 200% and the page 320 pixels wide, the label stays whole beside the track.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the switch. A disabled switch is skipped. |
| Space | Flips the switch. |

## Composition

Contains the control, the track with its thumb, and the label. Sits in a settings list or a toolbar.

## Usage rules

### Do

- Label the setting, not the action: "Notifications", not "Turn on notifications".

### Don't

- Ask for confirmation after a switch. If a change needs confirming, it is not a switch.

## Related

- [Checkbox](../checkbox/checkbox.md): a choice saved with a form.
- [Theme switch](../theme-switch/theme-switch.md): a switch between the two themes, drawn as a segmented control.
