import { defineVariants } from '../variants.js';

/** Code block. Figma "CodeBlock" 4255:6452 with "CodeBlockAction" 4255:6264. */
export const codeBlock = defineVariants({
  name: 'code-block',
  block: 'smbk-code',
  summary: 'Code in a well, colored by kind and numbered by line, with a top bar for a file name or language tabs and small icon actions such as copy.',
  adapt: 'css',
  axes: {},
  flags: {
    bare: { description: 'No top bar: just the well.' },
  },
  parts: ['bar', 'label', 'icon', 'tabs', 'actions', 'action', 'body', 'numbers', 'code', 'status', 'keyword', 'declaration', 'string', 'number', 'function', 'type', 'tag', 'property', 'comment', 'punctuation'],
  figmaNodeId: '4255:6452',
});
