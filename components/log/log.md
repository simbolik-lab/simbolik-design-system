---
name: log
title: Log
type: component
block: smbk-log
adaptStrategy: css
figmaNodeId: 7118:1670
status: experimental
---

# Log

## Purpose

Shows what a program prints as it runs, such as a build, an upload or a job, and keeps it after the program finishes. The newest line stays in view while it prints, unless the reader scrolls up to read.

## Anatomy

- The block: the header, then the well.
- The header part: the title part in a medium label style, then the status part, a small soft badge that says Waiting, Running or Finished.
- The well part, the sunken surface inside a subtle hairline with the small container corners, no taller than a long list.
- The scroll part, the area inside the well that scrolls.
- The note part, an optional line in a small body style and the subtle text color, such as "40 earlier lines left out", with the divider part under it.
- The lines part, the output in the code style, left to right, wrapping at the well's width. Before anything is printed it says "Waiting for output…" in the subtle text color.
- The jump part, a small ghost "Jump to latest" button at the well's foot, there only while the reader is scrolled up.
- The announcement part, a status line a screen reader hears, in the page but not drawn.

## When to use

- For the output of a build, an upload, a test run or a script, while it runs and after.
- For any text that arrives line by line and is read as it comes.

## When not to use

- For code a reader copies or studies. Use a [code block](../code-block/code-block.md).
- For messages a reader must act on. Use an [alert](../alert/alert.md) or a [toast](../toast/toast.md).
- For a list of past events with times and people. Use a [timeline](../timeline/timeline.md).

## Behavior

Set `state` to running while the program prints and to finished once it stops; the badge follows, in the info color while running and the success color when finished. With no lines yet it says Waiting.

While running, the well keeps the newest line in view as lines arrive and as the lines rewrap. When the reader scrolls up, the log stops following, so the lines they are reading stay still, and "Jump to latest" appears at the well's foot. Pressing it goes to the newest line at once, follows again and puts the keyboard back in the well; scrolling back to the end does the same. A page can also hold the following itself with `following` and `onFollowingChange`.

Lines wrap at any point, so nothing scrolls sideways, on a phone too. Keep the lines you pass to a few hundred; for more, drop the oldest and say so in the note.

## Accessibility

### What it does for you

- The well is one stop for the Tab key and a region named by the title (or by `aria-label` when the log has no title), so the arrow keys scroll it. It shows the focus ring inside its edge, drawn in the system's highlight color in a forced-color mode.
- The lines are never read out one by one: hundreds of lines would drown everything else. A screen reader hears when the log starts printing ("Build output: Running") and when it finishes ("Build output: Finished").
- `status` adds the page's own short status, such as "120 lines printed", heard when it changes.
- Every word it says by itself, such as the state on its badge and the jump button, keeps its English unless the page gives its own.

### What you must do

- Name the log for what printed it, with a title or an `aria-label`. Without a name the wrapper warns in development.
- Change `status` seldom: every few seconds at most.
- Don't say an error by the color of a line alone; say it in words in the output, or in an alert beside the log.
- Give the state's words and the jump button's label in the page's own language when the page is not in English.

### How to test

- With the keyboard, Tab reaches the log's well once, with the focus ring inside its edge. The arrow keys scroll it, and Home and End jump to the first and last lines.
- Scroll up while it runs: the log stops following, and "Jump to latest" appears at the well's foot. Press it with Enter or Space: the newest line shows and the keyboard is back in the well.
- With a screen reader, the log is read as a region by its title, and it announces "Running" and "Finished" but not each line.
- With text at 200% and the page 320 pixels wide, the lines wrap and nothing scrolls sideways.
- In a forced-color mode, the focus ring around the well is visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the well, which is one stop. |
| Down Arrow or Up Arrow | Scrolls the lines. |
| Home or End | Scrolls to the first or last line. |
| Enter or Space | On "Jump to latest", goes to the newest line, follows again and puts the keyboard back in the well. |

## Composition

Holds a title, a status badge, an optional note with a divider, the lines and the jump button. The badge, the divider and the button are those components. Sits in a page or a panel, under the control that starts the program.

## Usage rules

### Do

- Name the log for what printed it.
- Say in the note what was left out when you drop old lines.
- Set `state` to finished when the program stops.

### Don't

- Announce each line.
- Color lines to mean errors with no words.
- Use a log for code to copy.

## Related

- [Code block](../code-block/code-block.md): code to read and copy.
- [Progress bar](../progress/progress.md): how far along a task is.
- [Toast](../toast/toast.md): a short message when something finishes.
