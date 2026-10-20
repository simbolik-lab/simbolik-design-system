import { defineVariants } from '../variants.js';

/**
 * File row. Figma "File row" 7110:252: Status (Selected, Uploading, Complete, Failed, Rejected), 5 variants. Each is a
 * card stacking a top row (the file's icon, its name and extension over a line with its size and state, the actions
 * as small ghost icon buttons) over, while uploading, the Progress Bar at sm with its label off. Figma's description
 * names the code `smbk-file-upload__file`; the row is its own block, as a list of attachments reuses it outside an
 * upload, and the upload's `file` part is the list item that holds one.
 */
export const fileRow = defineVariants({
  name: 'file-row',
  block: 'smbk-file-row',
  summary: 'One chosen file: its name, size and state, its progress while it uploads, and what can be done with it.',
  adapt: 'css',
  axes: {
    status: {
      values: ['selected', 'uploading', 'complete', 'failed', 'rejected'],
      default: 'selected',
      description: 'Selected is chosen and waiting; uploading shows the spinner and the progress bar; complete has gone through; failed did not, and can be tried again; rejected was not added, and says why.',
    },
  },
  flags: {},
  parts: ['top', 'icon', 'text', 'name', 'stem', 'extension', 'meta', 'size', 'separator', 'state', 'state-icon', 'message', 'actions', 'progress'],
  figmaNodeId: '7110:252',
});
