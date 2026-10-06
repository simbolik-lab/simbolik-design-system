import { defineVariants } from '../variants.js';

/** Label. Figma "Label" 4255:6252: two tones × two types; required mark and tooltip icon are content. */
export const label = defineVariants({
  name: 'label',
  block: 'smbk-label',
  summary: 'A field label: the text, an optional required mark, and an optional info icon that carries a tooltip.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['strong', 'subtle'],
      default: 'strong',
      description: 'Default text or subtle text. Figma calls this "Variant".',
    },
    type: {
      values: ['default', 'mono'],
      default: 'default',
      description: 'The body preset, or the small label preset in mono capitals, as used over groups in the command palette.',
    },
  },
  flags: {},
  parts: ['text', 'required', 'icon'],
  figmaNodeId: '4255:6252',
});
