import { defineVariants } from '../variants.js';

/**
 * Avatar group. Figma "Avatar group" 7580:1856 (Count: 3, 4, 5; More text; Show more), once called
 * "Avatar stack". Figma's Count is how many avatars are drawn: content, not an
 * axis; the wrapper takes the people and how many to show. Built on the avatar: each face is the avatar
 * component at its extra small size.
 */
export const avatarGroup = defineVariants({
  name: 'avatar-group',
  block: 'smbk-avatar-group',
  summary: 'Overlapping avatars for the people on a project or a thread, and a count of the rest.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['item', 'more', 'hidden'],
  figmaNodeId: '7580:1856',
});
