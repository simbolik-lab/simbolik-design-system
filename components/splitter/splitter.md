---
name: splitter
title: Splitter
type: component
block: smbk-splitter
adaptStrategy: css
figmaNodeId: 7117:70
status: experimental
---

# Splitter

## Purpose

The line between two panes that the reader moves to give one pane more room and the other less: a list and the item it opens, a preview and its settings, an editor and its output. The reader drags it, or focuses it and uses the arrow keys. It differs from the divider, which only separates two things and cannot be moved or focused.

## Anatomy

- The block: the hit area, 24 across and as long as the panes, a separator the reader can focus. Vertical is a line between two columns side by side; horizontal is a line between two stacked panes.
- `line`: the line, in two halves, one either side of the grip. Without the grip the two halves meet.
- `grip`: an optional raised pill in the middle of the line, holding `icon`, six dots. On unless turned off.

## When to use

- Two panes whose best share of the space depends on the reader and the task, such as a wide preview with narrow settings, or the reverse.
- A pane the reader often wants larger for a moment: a file list, a log, an inspector.

## When not to use

- Two parts of a page that always keep the same share. Use a fixed layout, with a [divider](../divider/divider.md) between them if they need a line.
- A choice between a few set sizes, such as compact and wide. Use a [segmented control](../segmented-control/segmented-control.md) or a [button](../button/button.md) that toggles the pane.
- A phone, or any narrow space. The panes stack there, and the splitter is not shown.

## Behavior

The page owns the panes. The splitter keeps a value, the size in pixels of the pane it measures, and reports every change; the page sizes the pane from it, and the other pane takes the rest. By default the value measures the pane before the line (the left one in a left-to-right page, the upper one of two stacked panes); it can measure the pane after it instead. The splitter stops at the pane's smallest and largest sizes, whichever way it is moved. It does not remember its value: a page that wants the size kept stores it and passes it back.

Dragging with a mouse, a pen or a finger moves the line with the pointer. While it is dragged the line turns brand and twice as thick, and the grip's dots turn brand. Under the pointer the hit area takes a light fill and the line darkens. On a touch screen the hit area reaches 44 across without widening the gap between the panes.

Where the layout is narrow the splitter is not shown, which also takes it out of the Tab order; the page stacks its two panes there itself, under the same layout switch. A disabled splitter keeps its line, in the disabled color, with the grip's dots and no pill, and cannot be focused or moved.

## Accessibility
### What it does for you

- It is a separator the reader can focus, with its orientation, its value, its smallest and largest values, and the value in words. A screen reader hears "separator", its name and how far the pane is between its smallest and largest size, as a percentage, unless the page gives other words.
- A vertical line moves with Left and Right, which follow the line on the screen in a right-to-left page too; a horizontal line moves with Up and Down. Each press moves it 16 pixels unless the page sets another step. Home gives the pane its smallest size, End its largest.
- Dragging is not the only way to move it: the keys do it too.
- The focus ring is drawn around the whole hit area.
- The hit area is at least 24 across, so a pointer does not need precision to grab it.

### What you must do

- Name it for the pane it sizes, such as "Resize settings panel", and point `aria-controls` at that pane's id.
- A reader who uses a pointer and cannot drag needs another way, so a page where the size matters offers set sizes beside the panes, such as a button that widens a pane.
- In hand-written markup, give it the separator role, a Tab stop, `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a name, and move it with script; without script it is a line that does not move.

### How to test

- Tab to it: the focus ring shows around the whole hit area, in both themes and in a forced-color mode.
- Press the arrow keys that follow the line, then Home and End: the pane grows, shrinks and stops at its smallest and largest sizes.
- With a screen reader, it is read as a separator by its name, with its value as a percentage.
- On a touch screen, the line is grabbed by a hit area 44 across.
- Check that the page offers set sizes, such as a button that widens a pane, for a reader who cannot drag.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the splitter. It is not in the Tab order where the layout is narrow and the splitter is hidden, or when it is disabled. |
| Left Arrow or Right Arrow | On a vertical line, moves it by one step, following the line on the screen in a right-to-left page too. |
| Up Arrow or Down Arrow | On a horizontal line, moves it by one step. |
| Home | Gives the pane its smallest size. |
| End | Gives the pane its largest size. |

## Composition

Sits between two panes in a row (vertical) or a column (horizontal), stretched to their length. The panes can hold anything: a list, a tree view, a table, a preview, a form. Two splitters can share a page, one for each pair of panes.

## Usage rules

### Do

- Give each pane a smallest size at which its content still works, and a largest that leaves the other pane usable.
- Name the splitter for the pane it sizes.
- Store the size where the reader expects it kept, and pass it back the next time.

### Don't

- Use a divider where the reader should be able to move the line; it cannot be focused or dragged.
- Hide the grip on a splitter that is hard to notice, such as one between two panes of the same color.
- Leave a splitter in a narrow layout; stack the panes instead.

## Related

- [Divider](../divider/divider.md): a line that only separates.
- [Tree view](../tree-view/tree-view.md): often the pane a splitter sizes, beside the item it opens.
- [Drawer](../drawer/drawer.md): a panel that slides over the page instead of sharing it.
