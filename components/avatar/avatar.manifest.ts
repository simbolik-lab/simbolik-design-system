import { defineVariants } from '../variants.js';

/**
 * Avatar. Figma "Avatar" 962:62: Size × Scheme × Type, 42 variants. Figma's Scheme is the tone axis, with Figma's
 * Neutral as default and Figma's Default as inverse.
 */
export const avatar = defineVariants({
  name: 'avatar',
  block: 'smbk-avatar',
  summary: 'A person or thing as a circle: initials, an icon, or a picture, in six sizes.',
  adapt: 'css',
  axes: {
    size: {
      values: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'],
      default: 'xl',
    },
    tone: {
      values: ['default', 'brand', 'inverse'],
      default: 'default',
      description: 'Default sits on the raised surface; brand on the brand fill; inverse on the inverse fill.',
    },
    type: {
      values: ['initials', 'icon', 'image'],
      default: 'initials',
      description: 'What fills the circle. Figma calls the image type "Avatar".',
    },
  },
  flags: {},
  parts: ['initials', 'icon', 'image'],
  figmaNodeId: '962:62',
});
