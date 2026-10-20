---
name: file-upload
title: File upload
type: component
block: smbk-file-upload
adaptStrategy: css
figmaNodeId: 7110:345
status: experimental
---

# File upload

## Purpose

Lets the reader add files to a form or a library: by pressing a button that opens the browser's own file picker, or by dropping files on a zone. It says what is accepted before anyone chooses, and shows each chosen file in a row under it with its progress, then whether it went through. A plain file input shows none of that.

## Anatomy

- The block, a column: the zone, then the list of files, then the announcement part.
- The zone part. In a drop zone it is a dashed area at the medium container corners; in the button-only form it draws nothing of its own. It holds the body part and, in a drop zone, the drop part, in one place, so the zone is as tall as its body whichever shows.
- The body part. In a drop zone: the icon part (an upload arrow), the text part with the title part over the constraints part, the button part, and in error the message part. In the button-only form: the button, the constraints and the message, stacked from the start edge.
- The button part, a label round the input carrying the button's secondary classes at the medium size, so its looks are the button's.
- The input part, the native file input inside the button: in the page and the tab order, unseen.
- The constraints part: what is accepted, said before anyone chooses: the types, the largest size, how many.
- The message part, a field message of the error type: what is wrong and what to do.
- The drop part, shown in the body's place while files are held over the zone: the icon, "Drop to add" and the constraints, centred. It is hidden from assistive technology.
- The files part, a list of the chosen files; each file part holds one file row.
- The announcement part, a status region that is in the page but not drawn.
- The type is a modifier: `--type-drop-zone`, `--type-button-only`. The `--error` and `--dragging` flags are modifiers too.
- The label is not the upload's: put it in a field.

## When to use

- A form that takes documents, such as a claim with its receipts or an application with its papers.
- A library or a workspace where files are added and uploaded one by one.
- A single file, such as a picture for a profile or a signed contract: set it to take one.

## When not to use

- A choice among files already on the server, such as a picture from a library: that is a picker of its own.
- Text that could be typed or pasted into a [text area](../text-area/text-area.md).
- A narrow place such as a phone, for the drop zone: nothing is dragged there. Use the button-only form.

## Behavior

The button opens the browser's own file picker, with or without script. Pressing it, or Enter or Space when the input has focus, opens the picker. A drop zone also takes files dropped anywhere on it. While files are held over it, its edge turns the brand color at the emphasis width, its surface turns sunken and its words turn to "Drop to add", and it keeps its height. A file dropped on a disabled upload is ignored, and is not opened in the page's place. The button-only form takes no drop.

The React wrapper uploads nothing. It hands what was chosen or dropped to `onAdd`, and draws a file row for each file in `files`, which the page keeps and updates as each upload goes. It passes each row's buttons on as `onRemove`, `onCancel`, `onRetry` and `onDelete`, with the file's id. With `accept`, a file of another type is not added: it is passed to `onAdd` in the refused list with the reason `type`, so the page can show it as not added and say why. Without `multiple`, the upload takes one file, and a second one dropped at the same time is refused with the reason `count`. The input is emptied after each choice, so the same file can be chosen again after it is removed. It is required only while no file is chosen, so a form with a required upload is not sent empty.

In error the zone draws the danger edge at the emphasis width; `errorMessage` shows the message in the zone, under the button, or under the constraints in the button-only form. Give the message to the upload, not to the field around it: the field would draw it a second time under the zone. The upload's `error` turns on the error look without a message. Disabled, the icon and the words take the disabled colors and the button its own disabled look. Read-only (`readOnly`, which a field passes on), the upload shows its files and takes no more: a browser has no read-only file input, so the button and the zone are drawn and behave as disabled, and the rows show without their buttons. A ref given to the React wrapper reaches the native input.

## Accessibility

### What it does for you

- The input is named by the field's label, then the button's words ("Attachments Browse files"), so a reader using voice control can say either. The constraints and the error message are its description, read before anyone chooses.
- Tab reaches the input, which the focus ring round the zone shows (round the button alone in the button-only form), then each row's buttons. Enter or Space opens the picker.
- Dropping is an extra: the button always works.
- Each row's buttons are named with the file: "Remove quarterly-report.pdf", "Cancel upload of quarterly-report.pdf", "Try again to upload quarterly-report.pdf", "Delete quarterly-report.pdf".
- A file's change of status, a file added and a file removed are read out once each, with the file's name, in one polite status region: "quarterly-report.pdf: Uploaded". The progress in between is not read out.
- When the button that had focus goes, as when a file is removed, focus moves to the next row's first button, else to the last row's, else to the input.
- Disabled or read-only, the zone carries `aria-disabled` beside the input's `disabled`, so its faint title and line are read as part of a control out of reach.

### What you must do

- Put the upload in a field, so the input has a name, or give it an `aria-label`.
- Say what is accepted in the constraints. `accept` and the constraints are hints for the reader; the server decides what it takes.
- Change the words for another language: `title`, `dropTitle`, `buttonLabel`, `addedLabel`, `removedLabel`, the row's button names and `sizeLabel`, and `locale` for the sizes.
- In markup written by hand, add `aria-disabled` and `disabled` together when it is disabled or read-only, and leave out the rows' buttons when read-only.

### How to test

- With the keyboard only, Tab to the upload: the focus ring shows round the zone (or the button). Press Enter, then Space: each opens the picker.
- Add a file, then Tab to its row's buttons and remove it: focus moves to the next row's first button, else the last row's, else the input.
- With a screen reader, the input is read by the field's label and the button's words, with the constraints; each row's buttons are read with the file's name.
- Add, finish and remove a file: each change is read out once, and the progress in between is not.
- With text at 200% and the page 320 pixels wide, use the button-only form: the button and the rows stay whole.
- In a forced-color mode, the zone's edge, the focus ring and the buttons are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the input, then to each row's buttons. |
| Enter or Space | On the input, opens the picker. On a row's button, presses it. |

## Composition

The button's secondary classes for the button, the field message for the error, and a file row for each file. Sits in a field for its label.

## Usage rules

### Do

- Say what is accepted in the constraints: the types, the largest size, how many.
- Put it in a field, so the input is named.
- Say why a file was not added, in its row: "Not added: it must be a PDF."
- Use the button-only form in narrow places.

### Don't

- Make dropping the only way to add a file.
- Trust the file's extension or type: the server checks what it takes.
- Read out every percent of an upload.

## Related

- [File row](../file-row/file-row.md): one file, on its own, as in a list of attachments.
- [Progress bar](../progress/progress.md): the bar in a row while its file uploads.
- [Field](../field/field.md): the label around it.
- [Button](../button/button.md): the look of its button.
