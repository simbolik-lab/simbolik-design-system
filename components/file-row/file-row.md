---
name: file-row
title: File row
type: component
block: smbk-file-row
adaptStrategy: css
figmaNodeId: 7110:252
status: experimental
---

# File row

## Purpose

One chosen file, shown as a card: its type, its name, its size and its state, its progress while it uploads, and the buttons for what can be done with it. A file upload draws one for each file chosen; a list of attachments can use it on its own.

## Anatomy

- The block, a card with a subtle edge: the top part, then, while the file uploads, the progress part.
- The top part, a row: the icon part, the text part, then the actions part at the top end.
- The icon part: the file's type, such as a document, a spreadsheet or a picture, picked from its extension or its media type, at the 2xl icon size.
- The text part: the name part over the meta part.
- The name part: the stem part, the name before its extension, then the extension part. A long name is cut short with an ellipsis in the stem, and the extension stays whole.
- The meta part, one line: the size part, the separator part (a dot), then the state part. The size shows while the file is chosen, uploading or uploaded; while it uploads it says how much has gone ("1.1 of 2.4 MB").
- The state part: the state-icon part (the spinner's subtle ring while uploading, a tick once uploaded, a crossed circle when it failed, a warning sign when it was not added) and the message part, the words. A failed or refused file shows only its icon and reason, which wraps beside its icon.
- The actions part: the button's small ghost icon-only form, named with the file: Remove for a file chosen, failed or not added; Cancel while it uploads; Try again then Remove when it failed; Delete once uploaded.
- The progress part: the progress bar's small size with no label, the row's full width, named with the file.
- The status is a modifier: `--status-selected`, `--status-uploading`, `--status-complete`, `--status-failed`, `--status-rejected`.

## When to use

- Each file chosen in a file upload, which draws them for you.
- A list of files already attached, such as the attachments of a message.

## When not to use

- A file to open or download in a list of documents: use a [list](../list/list.md), whose rows are links.
- A folder of files to browse: use a [table](../table/table.md) or a list.

## Behavior

The row is markup and words only: it uploads nothing, and the page sets its status and its progress. Each button is drawn only when its handler is given, so a row offers only what the page can do. While the file uploads, the bar fills from `loaded` and `size`, or from `progress`; without either it shows its unknown state. The spinner's ring turns while the file uploads, and stands still under reduced motion. Sizes are written in English, or in the language set with `locale`, so a page prepared on a server shows the same sizes once its script runs.

## Accessibility

### What it does for you

- The file's icon is decoration, hidden from assistive technology: the name says the same.
- Each button is named with the file, such as "Remove quarterly-report.pdf".
- The state is an icon and words, never color alone. A failed or refused file says why in words.
- The progress bar is named with the file.
- The name is written as text, never as markup, and follows its own direction, so a name in a right-to-left script reads the right way.
- A row alone announces nothing. In a file upload, its changes of status are read out for it.

### What you must do

- Use `removeLabel`, `cancelLabel`, `retryLabel` and `deleteLabel` to change the buttons' words for another language.
- Say why a file was refused, in its message.
- On a page that uses rows on their own, announce their changes yourself, once each, not every percent.

### How to test

- With a screen reader, each button is read with the file's name, and the progress bar is read by the file.
- Tab through the row: each button takes focus, and Enter or Space presses it.
- With the colors removed, the icon and words still say whether the file is uploading, done, failed or refused.
- With text at 200% and the page 320 pixels wide, a long name is cut short with an ellipsis, its extension stays whole, and the buttons stay in view.
- In a forced-color mode, the icon and the buttons are still visible.

### Keyboard

| Key | What it does |
|---|---|
| Tab | Moves focus to the next button in the row. |
| Enter or Space | Presses the focused button: remove, cancel, try again or delete. |

## Composition

The progress bar for the progress, the button's small ghost icon-only form for the actions, the spinner's ring for the uploading state, and icons. Sits in a file upload's list, or in a list of its own.

## Usage rules

### Do

- Say why a file was not added, in its message: "Not added: it must be a PDF."
- Give only the handlers the page can carry out.

### Don't

- Show a file as uploaded before the server has taken it.
- Read out every percent of an upload.

## Related

- [File upload](../file-upload/file-upload.md): chooses the files and draws a row for each.
- [Progress bar](../progress/progress.md): the bar while the file uploads.
- [List](../list/list.md): for files to open or download.
