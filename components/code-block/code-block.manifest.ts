import { defineVariants } from '../variants.js';

/** Code block. Figma "CodeBlock" 4255:6452 with "CodeBlockAction" 4255:6264. */
export const codeBlock = defineVariants({
  name: 'code-block',
  block: 'smbk-code',
  summary: 'Code in a sunken well with a top bar for a label or language tabs and small icon actions such as copy.',
  adapt: 'css',
  axes: {},
  flags: {
    bare: { description: 'No top bar: just the well.' },
  },
  parts: ['bar', 'label', 'tabs', 'actions', 'action', 'body', 'code', 'status'],
  figmaNodeId: '4255:6452',
});
