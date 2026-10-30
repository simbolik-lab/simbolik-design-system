import { defineVariants } from '../variants.js';

/**
 * Alert dialog. Drawn by the modal's stylesheet (drawnBy): `alertDialog(…)` gives its own block, smbk-alert-dialog,
 * then the modal's block with the size and inline classes it offers. Figma "Alert dialog" 8224:3557: a small Modal
 * with the danger icon, no close cross, Cancel and the danger action.
 */
export const alertDialog = defineVariants({
  name: 'alert-dialog',
  block: 'smbk-alert-dialog',
  drawnBy: 'smbk-modal',
  summary: 'A modal that asks before something that cannot be undone: a title, what will happen, and a cancel and a confirm action. It closes only on them and Escape.',
  adapt: 'css',
  axes: {
    size: {
      values: ['sm', 'md'],
      default: 'sm',
      description: 'The greatest width the panel takes: the modal’s two narrower widths, since the question is short.',
    },
  },
  flags: {
    inline: { description: 'Shown in place with no scrim, for previews and documentation.' },
  },
  parts: ['header', 'icon', 'title', 'body', 'footer'],
  figmaNodeId: '8224:3557',
});
