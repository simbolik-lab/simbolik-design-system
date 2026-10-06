import { defineVariants } from '../variants.js';

/** Avatar. Figma "Avatar" 962:62: Size × Scheme × Type, 42 variants. */
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
    scheme: {
      values: ['neutral', 'brand', 'default'],
      default: 'neutral',
      description: 'Neutral sits on the raised surface; brand on the brand fill; default on the inverse fill. Figma\'s names.',
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
