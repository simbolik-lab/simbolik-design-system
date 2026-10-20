import { defineVariants } from '../variants.js';

/**
 * Toggle button. Figma "Toggle button" 7125:4263: On (No, Yes) × State × Size, 24 variants, built from the Outline Button.
 * It is the button with aria-pressed, drawn by the button's stylesheet (drawnBy): `toggleButton(…)` gives its own block,
 * smbk-toggle-button, then the button's block with the tone, size and icon-only classes it offers. On is the button's
 * aria-pressed, read by the button's stylesheet with the toggle's block, not a class; states are pseudo-classes. The ghost tone is the toolbar's
 * tool (Figma's ToolbarTools 7341:1454 draws its tools as ghost icon buttons).
 */
export const toggleButton = defineVariants({
  name: 'toggle-button',
  block: 'smbk-toggle-button',
  drawnBy: 'smbk-btn',
  summary: 'A button that stays on or off, such as bold text, a map layer or a filter: the outline or ghost button when off, sunken into the page when on.',
  adapt: 'css',
  axes: {
    tone: {
      values: ['outline', 'ghost'],
      default: 'outline',
      description: 'How it looks when off: the outline button, or the ghost button with no fill or edge, for a tool among others in a toolbar. On looks the same in both. Figma draws the outline toggle; the ghost one is the toolbar’s tool.',
    },
    size: {
      values: ['lg', 'md', 'sm'],
      default: 'md',
      description: 'The button’s own heights, padding, label and icon, one recipe per height. md fits apps and forms.',
    },
  },
  flags: {
    'icon-only': { description: 'A square toggle holding one icon and no label, for a toolbar. Needs an accessible name.' },
  },
  parts: ['icon', 'label'],
  figmaNodeId: '7125:4263',
});
