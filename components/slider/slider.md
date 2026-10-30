---
name: slider
title: Slider
type: component
block: smbk-slider
adaptStrategy: css
figmaNodeId: 4711:52100
status: candidate
---

# Slider

## Purpose

Chooses a number along a range where a rough position matters more than typing an exact figure: a speed, a share, a level. The range type chooses two, a lowest and a highest, such as a price band. Dragging, clicking anywhere along it and the arrow keys all move it, and an optional number box beside it takes an exact figure typed in. It comes in four looks. Ticks, the default, is its own: a row of fine vertical lines on a sunken band, the lines turning brand red up to a narrow red thumb, or between two. Standard is the familiar one: a thin rounded line, red up to a round thumb. Fill is a thick bar filled red up to a thin light handle, with fine marks under it. Contained is the fill look's bar made as tall as a button, with the label and the value inside it; where the red passes under them, the words turn white.

## Anatomy

- The block, a column: the label row, then the body, or the row when there is a number box. In the contained look the label row is inside the rail instead.
- The header part, the label row: the label part at the start and the value part at the end. The value can be left out; hiding the label hides the whole row. In the contained look it lies over the bar, inside the rail after the track, and a copy of it sits inside the fill.
- The label part is the label component, and names the slider.
- The value part, the current value in words, its unit included; for a range, both values.
- The row part, only with a number box: the body with a number box after it, or for a range one before it and one after it.
- The number part, the number box: the input component at its small size, at a fixed narrow width, centered on the rail. It shows the value as a bare number.
- The body part: the rail, then the bounds.
- The rail part, the row that takes the pointer. In the ticks and standard looks it is the smallest touch size tall at every size; in the fill look it is the bar, and the area that takes the pointer is never less than the smallest touch size tall; in the contained look it is the bar, at least a control's height, and it grows when the label wraps.
- The track part, centered in the rail: in the ticks look the sunken band with the gray lines; in the standard look the thin rounded gray line; in the fill look the thick pale bar; in the contained look the same pale bar, as tall as the rail.
- The fill part, inside the track: the red part from the start, or the lower thumb, to the value, or the upper thumb. In the fill and contained looks it reaches a little past each handle, so even the lowest value shows a short red stub around the handle. In the contained look it holds the copy of the label row, in white, as wide as the bar and moved back by the fill's start, so the words it cuts off line up with the ones on the bar.
- The lines part, inside the fill, in the ticks look only: the same lines in red, as wide as the rail and moved back by the fill's start, so they sit exactly on the gray ones.
- The thumb part, centered on the value: a narrow red bar a little taller than the lines in the ticks look, a red circle in the standard look, a thin light line inside the red bar in the fill and contained looks. A range has two.
- The bubble part, the tooltip component over a thumb, showing that thumb's value while it is pressed or has keyboard focus.
- The control part, a native range input, invisible, right after each thumb: it does the keyboard, form and screen reader work, and a single slider's input also takes the pointer.
- The bounds part, optional: the lowest and highest values under the rail.
- The marks part, in the fill and contained looks only and optional: a fixed number of fine marks between the lowest and highest values. They are a scale to read by eye, not one mark per step.

## When to use

- A value along a continuous range where a rough setting is enough, and seeing where it sits between the ends helps: a speed, a quantity, an opacity.
- A value the reader tries a few times, watching something else change as they move it.
- A value that is set roughly most of the time but sometimes exactly: add the number box.

Which look:

- Ticks, the default, where the slider is part of the system's own look: a tool's settings, a calculator.
- Standard, where a reader expects a familiar slider, or space is short, since its line is thin.
- Fill, for a level or an amount, where the filled bar reads as how much: a volume, an opacity, a share. It suits a slider opened from a toolbar.
- Contained, for a panel of settings stacked one under another, such as an editor's controls: each slider is one bar the height of a button with its words inside, so a stack of them reads as one panel and takes half the height.

## When not to use

- A few named choices. Use a [segmented control](../segmented-control/segmented-control.md), where every choice shows and one press picks it.
- Only an exact figure, or a range too wide to set by dragging. Use the [number field](../number-field/number-field.md); when a rough setting helps too, give the slider its number box.
- A value the reader should only read. A slider looks movable; show the number, or a [progress bar](../progress/progress.md) for an amount done.

## Behavior

A single slider's native input does everything: a drag moves the thumb, a click or tap anywhere on the rail jumps it there, and the arrow keys move it by one step, Page Up and Page Down by larger steps and Home and End to the ends, as the browser does for every range. The value, the red lines and the thumb follow at once.

A range has an input for each thumb, and Tab moves from the lower to the upper. The keys work as for one value, but each thumb stops at the other: the lower can go no higher than the upper and the upper no lower than the lower, so they meet and never cross. The pointer is taken by the rail: a press or tap moves the nearer thumb there and a drag carries it on; when the two sit together, a press above them takes the upper one and a press below takes the lower.

When the pointer rests on it, the thumb lifts and its red darkens; while it is pressed, the thumb lifts further, darkens again and the bubble shows its value above it. The bubble also shows while the thumb has keyboard focus. The lift and the color use the state motion and the bubble fades with the feedback motion; none of it moves, so it stays the same under reduced motion. The fill and contained looks' handle keeps its look on hover and press; its bubble shows as the others do.

The number box shows the value as a bare number and changes as the thumb moves. A number typed into it moves the thumb when the reader presses Enter or leaves the box: it is kept between the lowest and highest values and rounded to the step, and a box left empty goes back to the value. The up and down arrow keys step the box as they step the slider. Numbers are read and written the way the reader's language writes them. In a range, the lower box goes no higher than the upper value and the upper box no lower than the lower value. Scrolling over the box never changes it. When the value comes from the box, the change handler is called with the new value only, without the range input's change event.

Hiding the label hides its whole row, the value at its end included, so no row is left with a number alone. The bubble still shows the value whenever the thumb is pressed or has keyboard focus.

In the contained look the label and the value sit inside the bar. Where the red part passes under them they turn white, cut at the red's edge, and stay dark on the pale part, so they read on both. The handle passes over the words as it moves. A press on the words moves the value there, as a press anywhere on the bar does; the label never takes the press. A label too long for the bar wraps, and the bar grows taller to hold it. Hiding the label leaves the bar with no words in it.

The lines spread across whatever width the slider is given, always the same number of them, from a hairline inside one end to a hairline inside the other. The fill look's marks do the same between the lowest and highest values.

In the narrow layout, and on any touch screen, the area that takes a finger grows to the comfortable touch size above and below the rail. The look does not change; the difference is presentational only.

In plain markup, a range's inputs do not take the pointer, so the page must handle presses and drags on the rail itself and give the thumb being dragged `data-pressed`, which draws it pressed. The React wrapper does this for you.

In plain markup, the page places the parts itself with inline styles: the fill's start and width and each thumb's start as percentages, and the red lines' start set back by the fill's start in the rail's container units (`cqi`), so they line up with the gray lines. It must update them whenever a value changes. The same percentages serve all three looks. The React wrapper does this for you.

In plain markup, a number box is an input carrying the input's small classes and the number part's class, inside the row part; the page keeps it and the range input in step itself. The React wrapper does this for you.

In plain markup, the contained look's label row goes inside the rail, after the track and before the first thumb. Its copy goes inside the fill, after the lines: a span with the header part's class holding the same label, written as a span with the label's classes, and the same value. The page sets the copy's start back by the fill's start in the rail's container units, as it does for the lines, and keeps its words the same as the row's. The React wrapper does this for you.

## Accessibility
### What it does for you

- The input is a real range input, so it is announced as a slider with its name, its value and its ends, and it takes part in forms.
- The label names it. With the label hidden, the same words become its accessible name, so it always has one.
- A range's two thumbs each have their own name: the label followed by "lowest" or "highest", or the words the page gives. Each reports only the values it can reach.
- The value is read out in the same words shown, unit included, not as a bare number.
- A number box is named for the same value as the slider beside it: the label, or for a range the label followed by "lowest" or "highest". A screen reader announces it as a number field, so the two are told apart by what they are.
- A number box comes after its thumb in the Tab order; a range's come first and last, around the two thumbs. On a phone it brings up the keyboard for numbers.
- The shown value, the bubble and the bounds are hidden from assistive technology, because the input already says all of them. So is the contained look's white copy of the words, which is inside the hidden track.
- A click anywhere on the rail moves the thumb, so dragging is never the only way to set it.
- The focus ring draws around the thumb, with the page color between the ring and the thumb so it reads over the lines. In the fill and contained looks it draws around the whole bar instead, a small gap away, since the handle is too thin to ring. In forced colors mode an outline takes its place.
- The value is shown by where the thumbs are and by the words, never by color alone. In the contained look the words keep their contrast on both parts of the bar: white on the red, the usual text color on the pale part.
- Disabled, it cannot be focused or moved, its number box is disabled too, and the lines, thumb and words turn to the disabled colors, not a fade. The block carries `aria-disabled`, so its faint words read as part of a control out of reach.

### What you must do

- Give the slider a label. Hiding it still uses the same words as its accessible name.
- Give the value its unit through the format the wrapper takes, so both the shown and the spoken value carry it.
- In markup written by hand, add `aria-disabled` to the block of a disabled slider.

### How to test

- Tab to the slider: the focus ring shows around the thumb, and in a forced-color mode an outline takes its place. A range takes Tab from the lower thumb to the upper.
- Press the arrow keys, Page Up, Page Down, Home and End: the thumb and the value follow at once. In a range, neither thumb passes the other.
- With a screen reader, it is read as a slider by its name, with its value in words and its ends; a number box is read as a number field.
- Type a number in the number box and press Enter: the thumb moves to it, kept between the ends and rounded to the step.
- On a touch screen, a tap anywhere on the rail moves the thumb.
- In the contained look, move the thumb across the words: they turn white over the red, line up with the dark ones letter for letter, and read on both parts.
- With text at 200% and the page 320 pixels wide, the label and value stay whole; in the contained look a long label wraps and the bar grows to hold it.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the slider's thumb, or from a range's lower thumb to its upper one, and on to the number box. |
| Arrow keys | Move the thumb by one step; each thumb of a range stops at the other. |
| Page Up or Page Down | Moves the thumb by a larger step. |
| Home or End | Moves the thumb to the lowest or the highest value. |
| Enter | In the number box, sets the thumb to the number typed. |
| Up Arrow or Down Arrow | In the number box, steps its value as they step the slider. |

## Composition

Contains a label, a value, the rail, the bounds and, when asked for, its number boxes (the input component), and nothing else. Sits in a form, a settings panel or a tool's controls, at the width its container gives it. Never inside a button or a link.

## Usage rules

### Do

- Give the value its unit, through the format the wrapper takes, so both the shown and the spoken value carry it.
- Choose a step that matches how precisely the value matters.
- Give the slider a width where the lines sit comfortably apart, around the width Figma draws it. With number boxes, add their width beside it.
- Leave the value out of the label row when the number box is on: the box already shows it.
- In the contained look, keep the label and the value short, so they sit apart inside the bar and the handle crosses them only on its way. For a range, word the pair briefly, since both values share the bar with the label.
- Leave half a thumb's width of room beside a slider: at its lowest and highest values a thumb reaches that far past the ends of the band. Never put it inside something that clips its edges.

### Don't

- Use a slider for a handful of named choices.
- Hide the value, or the label row that holds it, when the exact number matters to the reader at a glance.
- Put the slider where its container would squeeze it very narrow; the lines crowd together.

## Related

- [Segmented control](../segmented-control/segmented-control.md): a few named choices, all visible.
- [Number field](../number-field/number-field.md): an exact number, with buttons to step it.
- [Input](../input/input.md): the number box beside the slider.
- [Progress](../progress/progress.md): an amount done that the reader does not set.
- [Switch](../switch/switch.md): on or off.
