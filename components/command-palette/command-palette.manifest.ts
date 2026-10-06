import { defineVariants } from '../variants.js';

/**
 * Command palette. Figma "Command Palette" 4336:22996, assembled from CommandHeader 4333:22019
 * (Chips toggle), CommandBody 4336:22171 (Button toggle), CommandItem 4333:21975 (State: Default,
 * Hover; Label and Kbd toggles) and CommandFooter 4336:22098. One form; the toggles are content.
 */
export const commandPalette = defineVariants({
  name: 'command-palette',
  block: 'smbk-command-palette',
  summary: 'A search-first panel of commands: type to filter, arrow keys to move, Enter to run, with groups under mono labels and key hints at the foot.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['search', 'search-icon', 'input', 'clear', 'filters', 'body', 'group', 'group-header', 'group-label', 'list', 'item', 'item-icon', 'item-label', 'item-meta', 'empty', 'footer', 'hints', 'hint', 'hint-text', 'dialog'],
  figmaNodeId: '4336:22996',
});
