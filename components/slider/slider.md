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

Chooses a number along a range where a rough position matters more than typing an exact figure: a speed, a share, a level. The range type chooses two, a lowest and a highest, such as a price band. Dragging, clicking anywhere along it and the arrow keys all move it. Its look is its own: a row of fine vertical lines on a sunken band, the lines turning brand red up to a narrow red thumb, or between two.

## Anatomy

- The block, a column: the label row, then the body.
- The header part, the label row: the label part at the start and the value part at the end. Either can be left out; with both out, the row goes.
- The label part is the label component, and names the slider.
- The value part, the current value in words, its unit included; for a range, both values.
- The body part: the rail, then the bounds.
- The rail part, the row that takes the pointer, as tall as the smallest touch size at every size.
- The track part, the sunken band with the gray lines, centered in the rail.
- The fill part, inside the track: the window from the start, or the lower thumb, to the value, or the upper thumb.
- The lines part, inside the fill: the same lines in red, as wide as the rail and moved back by the window's start, so they sit exactly on the gray ones.
- The thumb part, a narrow red bar a little taller than the lines, centered on the value. A range has two.
- The bubble part, the tooltip component over a thumb, showing that thumb's value while it is pressed.
- The control part, a native range input, invisible, right after each thumb: it does the keyboard, form and screen reader work, and a single slider's input also takes the pointer.
- The bounds part, optional: the lowest and highest values under the lines.

## When to use

- A value along a continuous range where a rough setting is enough, and seeing where it sits between the ends helps: a speed, a quantity, an opacity.
- A value the reader tries a few times, watching something else change as they move it.

## When not to use

- A few named choices. Use a segmented control, where every choice shows and one press picks it.
- An exact figure, or a range too wide to set by dragging. Use an input for the number; a slider with an input beside it is a composition a page may build.
- A value the reader should only read. A slider looks movable; show the number, or a progress bar for an amount done.

## Behavior

A single slider's native input does everything: a drag moves the thumb, a click or tap anywhere on the rail jumps it there, and the arrow keys move it by one step, Page Up and Page Down by larger steps and Home and End to the ends, as the browser does for every range. The value, the red lines and the thumb follow at once.

A range has an input for each thumb, and Tab moves from the lower to the upper. The keys work as for one value, but each thumb stops at the other: the lower can go no higher than the upper and the upper no lower than the lower, so they meet and never cross. The pointer is taken by the rail: a press or tap moves the nearer thumb there and a drag carries it on; when the two sit together, a press above them takes the upper one and a press below takes the lower.

When the pointer rests on it, the thumb lifts; while it is pressed, the thumb lifts further and the bubble shows its value above it. The lift uses the state motion and the bubble fades with the feedback motion; under reduced motion both change at once.

The lines spread across whatever width the slider is given, always the same number of them, from a hairline inside one end to a hairline inside the other.

In the narrow layout, the area that takes a finger grows to the comfortable touch size above and below the rail. The look does not change; the difference is presentational only.

In plain markup, a range's inputs do not take the pointer, so the page must handle presses and drags on the rail itself and give the thumb being dragged `data-pressed`, which draws it pressed. The React wrapper does this for you.

In plain markup, the page places the parts itself with inline styles: the fill's start and width and each thumb's start as percentages, and the red lines' start set back by the fill's start in the rail's container units (`cqi`), so they line up with the gray lines. It must update them whenever a value changes. The React wrapper does this for you.

## Accessibility

- The input is a real range input, so it is announced as a slider with its name, its value and its ends, and it takes part in forms.
- The label names it. With the label hidden, the same words become its accessible name, so it always has one.
- A range's two thumbs each have their own name: the label followed by "lowest" or "highest", or the words the page gives. Each reports only the values it can reach.
- The value is read out in the same words shown, unit included, not as a bare number.
- The shown value, the bubble and the bounds are hidden from assistive technology, because the input already says all of them.
- A click anywhere on the rail moves the thumb, so dragging is never the only way to set it.
- The focus ring draws around the thumb, with the page color between the ring and the thumb so it reads over the lines. In forced colors mode an outline takes its place.
- The value is shown by where the thumbs are and by the words, never by color alone.
- Disabled, it cannot be focused or moved, and the lines, thumb and words turn to the disabled colors, not a fade.

## Composition

Contains a label, a value, the rail and the bounds, and nothing else. Sits in a form, a settings panel or a tool's controls, at the width its container gives it. Never inside a button or a link.

## Usage rules

### Do

- Give the value its unit, through the format the wrapper takes, so both the shown and the spoken value carry it.
- Choose a step that matches how precisely the value matters.
- Give the slider a width where the lines sit comfortably apart, around the width Figma draws it.
- Leave half a thumb's width of room beside a slider: at its lowest and highest values a thumb reaches that far past the ends of the band. Never put it inside something that clips its edges.

### Don't

- Use a slider for a handful of named choices.
- Hide the value when the exact number matters to the reader.
- Put the slider where its container would squeeze it very narrow; the lines crowd together.

## Related

- Segmented control: a few named choices, all visible.
- Input: an exact number.
- Progress: an amount done that the reader does not set.
- Switch: on or off.
