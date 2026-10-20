/**
 * Each tone's icon, as Figma draws it: the shape carries the tone as well as the color, so the tone still reads
 * where color does not. The alert, the toast and the banner draw them (the banner swaps the neutral tone's bell for a
 * megaphone).
 */
export const toneIcons = {
  default: 'Bell',
  info: 'Info',
  success: 'Check',
  warning: 'Warning',
  danger: 'XCircle',
} as const;
