---
name: stepper
title: Stepper
type: component
block: smbk-stepper
adaptStrategy: css
figmaNodeId: 7117:303
status: experimental
---

# Stepper

## Purpose

Shows where the reader is in a form or task of three or more steps taken in a set order, such as a checkout or a sign-up: which steps are done, which one is current, and what comes next. It sits beside the form's own Back and Next buttons and does not replace them. It differs from the progress bar, which shows how far a single piece of work has got, and from tabs, which switch between views in any order.

## Anatomy

- The block, a div around everything.
- The list part, an ordered list of the steps, named by the stepper's label.
- The item part, a list item for each step. Its status is a modifier of the part: not started, current, unavailable, complete or error.
- The step part, inside each item: a link or a button for a step the reader can go back to, a plain box for any other.
- The marker row part: the marker part, a 24 circle holding the step's number part or its icon part (a check for a finished step, a warning sign for one with an error), and the connector part, the line on to the next step.
- The text part: the label part, the step's name, and the status part, an optional line under it.
- The hidden part: the step's status in words for screen readers.
- The summary part: the count part ("Step 2 of 4") and the step name part, in the summary text part, over the track part, the progress bar's slim track.

## When to use

- A form split into three or more pages or sections that are filled in order.
- A task with a fixed number of stages, such as setting up an account or importing a file.
- To let the reader go back to a step they have finished.

## When not to use

- One page, or two steps. A heading that says what the page is for is enough.
- Steps that can be done in any order, or whose number changes with the answers given. Use a [list](../list/list.md) of tasks with their status.
- Showing that something is loading or being worked on. Use the [progress bar](../progress/progress.md) or the [spinner](../spinner/spinner.md).
- Switching between views of the same thing. Use [tabs](../tabs/tabs.md).

## Behavior

Horizontal lists the steps in a row, sharing its width; each line runs from a step's marker to the next step, and turns the brand's color after a finished step. Vertical lists them one under another, each name beside its marker and the line running down. Summary gives "Step 2 of 4", the current step's name and a slim track filled to that step. A horizontal stepper gives its summary instead of its row where the layout is narrow; nothing else changes. Long names wrap under their marker.

A step that is finished, or has an error, can be a link or a button back to it: it takes a fill under the pointer and the focus ring around the whole step. Steps not started, the current step and unavailable steps are never links. The summary names the current step; if no step is current, it names the first with an error, then the first not finished.

The stepper shows the steps; the page keeps them true. When the reader moves to another step, the page changes each step's status and moves focus to the new step's heading.

## Accessibility
### What it does for you

- The steps are an ordered list, named by the stepper's label, such as "Checkout steps".
- The current step's item carries `aria-current="step"`, on one step only.
- Each step's status is said in words after its name, such as "Your details, completed", in words only a screen reader hears. Where the visible status line already says the same words, they are left out.
- The marker, its number and its icon are hidden from screen readers: the list gives the order and the words give the status.
- A step that can be gone back to is a link or a button, a Tab stop, and Enter follows it. Other steps take no focus. There are no arrow keys: the stepper is not tabs.
- A step that can be gone back to takes a fill under the pointer and the focus ring around the whole step.
- The summary is named by the same label; its track repeats the count and is hidden from screen readers.
- An unavailable step is marked with `aria-disabled="true"`: it cannot be reached yet, and its name takes the disabled text color. Its line says why, such as "After payment", in the subtle text color, readable at full contrast.

### What you must do

- Give the stepper a label that names the steps, such as "Checkout steps".
- Keep the steps true: when the reader moves to another step, change each step's status and move focus to the new step's heading.
- In markup written by hand, add the status words in the hidden part.

### How to test

- Tab through the stepper: only finished steps and steps with an error that can be gone back to take focus, each with a focus ring round the whole step, and Enter goes back to it. The current step and steps not started are skipped.
- With a screen reader, the steps are read as an ordered list by the label, each with its name and status words, and the current step as current.
- With text at 200% and the page 320 pixels wide, long names wrap under their marker, and a horizontal stepper gives its summary instead of its row.
- In a forced-color mode, the focus ring stays.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the next step that can be gone back to. Other steps are skipped. |
| Enter | Follows a step that is a link, or presses one that is a button. |
| Space | Presses a step that is a button. |

## Composition

Holds steps only. Sits above a form, at the top of a page or a modal, or, vertical, in a side column beside the form.

## Usage rules

### Do

- Name each step for what the reader does there, in a word or two.
- Keep the steps to a fixed number, three or more.
- Make a finished step a link only when going back to it really works.
- Say what is wrong in an error step's status line.

### Don't

- Use it as the only way to move between steps.
- Number the steps without naming them.
- Show the stepper for a process whose steps change with the answers.

## Related

- [Progress](../progress/progress.md): how far a single piece of work has got.
- [Tabs](../tabs/tabs.md): views of the same thing, in any order.
- [List](../list/list.md): a list of tasks done in any order, each with its status.
