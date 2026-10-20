import { defineVariants } from '../variants.js';

/**
 * Avatar with name. Figma "Avatar with name" 7125:4264 (Size, 4 variants; Name; Second line). It is built
 * on the avatar: the avatar part carries the avatar's own classes, at the size of the same name.
 */
export const avatarWithName = defineVariants({
  name: 'avatar-with-name',
  block: 'smbk-avatar-with-name',
  summary: 'A person\'s avatar with their name beside it and an optional second line, such as their role.',
  adapt: 'css',
  axes: {
    size: {
      values: ['xs', 'sm', 'md', 'lg'],
      default: 'xs',
      description: 'The avatar\'s size of the same name; the gap, the name and the second line grow with it.',
    },
  },
  flags: {},
  parts: ['avatar', 'text', 'name', 'second-line'],
  figmaNodeId: '7125:4264',
});
