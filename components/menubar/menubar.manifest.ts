import { defineVariants } from '../variants.js';

/**
 * Menubar. Figma "Menubar" 8222:3544 (State: Closed, Open), on its own page. A bar of menu titles as at the top of a
 * desktop app: each title is the ghost button at its small size, and each menu the dropdown's panel and items (the
 * dropdown's own classes, never copied), so submenus, single choice and key hints come with them. Figma's State is
 * whether a menu is open, which the wrapper holds, not an axis. The item part marks a title; the open one keeps the
 * ghost button's pressed fill, as Figma's Open draws File.
 */
export const menubar = defineVariants({
  name: 'menubar',
  block: 'smbk-menubar',
  summary: 'A row of menu titles, as at the top of a desktop app (File, Edit, View), each opening a dropdown menu; the arrow keys move along the bar and from one open menu to the next.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['item'],
  figmaNodeId: '8222:3544',
});
