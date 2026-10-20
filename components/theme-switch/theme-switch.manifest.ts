import { defineVariants } from '../variants.js';

/**
 * Theme switch. Figma "ThemeSwitch" 4209:19857 over "ThemeItem" 4207:19190. It is the segmented control in its theme
 * look, drawn by the segmented control's stylesheet (drawnBy): `themeSwitch({ size })` gives its own block,
 * smbk-theme-switch, then the segmented control's block, its size and that look.
 */
export const themeSwitch = defineVariants({
  name: 'theme-switch',
  block: 'smbk-theme-switch',
  drawnBy: 'smbk-segmented',
  summary: 'The light-or-dark switch: two icon segments in one bar, the active one raised.',
  adapt: 'css',
  axes: {
    size: { values: ['lg', 'md', 'sm'], default: 'lg' },
    look: {
      values: ['theme'],
      default: 'theme',
      description: "The segmented control's theme look: square items, each icon a step larger than the standard bar's at its size, an icon hovered in the brand text color.",
    },
  },
  flags: {},
  parts: ['indicator', 'item', 'icon'],
  figmaNodeId: '4209:19857',
});
