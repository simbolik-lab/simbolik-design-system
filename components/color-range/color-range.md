---
name: color-range
title: Color range
type: component
block: smbk-color-range
adaptStrategy: css
figmaNodeId: 7416:21
status: experimental
---

# Color range

## Purpose

Shows every step of one color range in a strip, lightest to darkest, each with its swatch, its name and its contrast against white, so a step's number means the same thing in every range. It is for tools that build or explain a color system, such as a token editor or a theme builder. To show a few unrelated colors, use color swatches; to choose any color, use the color picker.

## Anatomy

- The block: a column with the name row over the steps.
- The head part, the name row: the range's name (the title part, in Label MD) and a line of facts (the meta part, in Body XS), such as how many steps there are and which is in use. It can be left out; the name still names the strip.
- The steps part: the steps side by side, sharing the width equally. In a narrow space they wrap onto rows of six.
- The step part, one per step: a color swatch stretched to the step's width and 40 px tall (the swatch part), the step's name in Label SM (the name part) and its ratio in Body XS (the ratio part), which can be left out. The words sit on the page under the color, never on it.
- The step in use rings its swatch inside its edge. In a range the reader can pick from, hover draws the swatch's edge stronger, and keyboard focus draws the ring in the focus color.

## When to use

- To show a color range as a whole: a brand range, a neutral range, a data range.
- To let a reader choose which step of a range a role uses.

## When not to use

- For a handful of colors that are not one range. Use [color swatches](../color-swatch/color-swatch.md), or the [color swatch picker](../color-swatch-picker/color-swatch-picker.md) to choose one.
- To check one text color against one background. Use the [contrast pair](../contrast-pair/contrast-pair.md).

## Behavior

The ratio under each step is worked out from its color against white, or against the color given, and written with one decimal, never rounded up past what it is. The range holds the step in use from a first value, or follows the one the page gives it.

Given a change handler, the strip becomes a list to pick from: a press on a step picks it, and the page hears the step's name. Without one, the strip only shows the range, with the step in use ringed.

## Accessibility

### What it does for you

- The strip is a list named by the range's name. Each step is told in words: its color, such as "vibrant red", its name and its contrast ("contrast 4.8 to 1"). The step in use is marked as the current one.
- A range to pick from is a listbox, one stop in the Tab order: Tab reaches the step in use, the arrow keys move between steps, Home and End go to the first and last, and Space or Enter picks the step with focus.
- The step in use is shown by a ring, a shape, as well as by the line of facts, never by color alone.
- In forced colors mode the rings take the reader's own colors.

### What you must do

- Give the words the range says by itself, such as the ratio read aloud, in the page's own language. They keep their English unless the page gives its own.

### How to test

- Tab to a range you can pick from: one stop takes focus, on the step in use, with the ring showing in both themes and in a forced-color mode. Move with the arrow keys, then press Space or Enter to pick.
- With a screen reader, the range is read by its name, each step by its color, name and contrast, and the step in use as current.
- Read the range with the colors taken away: the ring and the line of facts still show the step in use.
- With text at 200% and the page 320 pixels wide, the steps and their facts stay readable.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the step in use. The range is one stop. |
| Right Arrow or Down Arrow | Moves focus to the next step. In a right-to-left language, Right Arrow moves to the previous step. |
| Left Arrow or Up Arrow | Moves focus to the previous step. In a right-to-left language, Left Arrow moves to the next step. |
| Home or End | Moves focus to the first or last step. |
| Space or Enter | Picks the step with focus. |

## Composition

Each step holds a color swatch, hidden from screen readers since the step says its color in words. A color range sits on a page or a panel; it is not placed inside a control.

## Usage rules

### Do

- Show every step of the range, in order.
- Name each step the way the system names it, such as "600".

### Don't

- Show only some steps, which hides how the range moves from light to dark.
- Put words on the colors: the ratio is under the step, where its color cannot hide it.

## Related

- [Color swatch](../color-swatch/color-swatch.md): one color, shown.
- [Color swatch picker](../color-swatch-picker/color-swatch-picker.md): a few colors to pick one from.
- [Contrast pair](../contrast-pair/contrast-pair.md): two colors with the mark their contrast earns.
