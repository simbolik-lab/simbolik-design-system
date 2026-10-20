import { defineVariants } from '../variants.js';

/**
 * File upload. Figma "File upload" 7110:345: Type (Drop zone, Button only) × State (Default, Drag-over, Focus,
 * Disabled, Error), 10 variants. Focus is the native file input's own, drawn on the zone (or on the button alone);
 * disabled is the input's attribute; error is a flag; Drag-over is the dragging flag, which the wrapper sets while
 * files are held over the zone. The chosen files are File rows in a list under it.
 */
export const fileUpload = defineVariants({
  name: 'file-upload',
  block: 'smbk-file-upload',
  summary: 'A place to choose files or drop them, with what is accepted said first, and each chosen file in a row below with its progress and result.',
  adapt: 'css',
  axes: {
    type: {
      values: ['drop-zone', 'button-only'],
      default: 'drop-zone',
      description: 'A drop zone is a dashed area with a title, what is accepted and a button, that also takes files dropped on it; button only is the button over what is accepted, for narrow places. Figma calls them "Drop zone" and "Button only".',
    },
  },
  flags: {
    error: { description: 'Something is wrong, such as no file chosen when one is required. The zone takes the danger edge; say what is wrong in the message.' },
    dragging: { description: 'Files are held over the zone: the brand edge, the sunken surface and "Drop to add", at the same height. The wrapper sets it while dragging; Figma calls it "Drag-over".' },
  },
  parts: ['zone', 'body', 'icon', 'text', 'title', 'constraints', 'button', 'input', 'message', 'drop', 'files', 'file', 'announcement'],
  figmaNodeId: '7110:345',
});
