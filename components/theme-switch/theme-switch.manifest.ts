import { defineVariants } from '../variants.js';

/** Theme switch. Figma "ThemeSwitch" 4209:19857 over "ThemeItem" 4207:19190. */
export const themeSwitch = defineVariants({
  name: 'theme-switch',
  block: 'smbk-theme-switch',
  summary: 'The light-or-dark switch: two icon segments in one bar, the active one raised.',
  adapt: 'css',
  axes: {
    size: { values: ['lg', 'md', 'sm'], default: 'lg' },
  },
  flags: {},
  parts: ['indicator', 'item', 'icon'],
  figmaNodeId: '4209:19857',
});
