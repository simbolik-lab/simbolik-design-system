import { defineVariants } from '../variants.js';

/**
 * Uptime bar. Figma "Uptime bar" 7580:263 (State: All up, Incident, Outage; Caption). State is Figma's example
 * data, not an axis: each period's status is a modifier of the `bar` part (smbk-uptime-bar__bar--status-incident),
 * set from the data. Caption is a boolean of Figma's, a prop here.
 */
export const uptimeBar = defineVariants({
  name: 'uptime-bar',
  block: 'smbk-uptime-bar',
  summary: 'A strip of days, one bar each, colored by whether a site or service was up, had an incident or was down, with the share up in words.',
  adapt: 'css',
  axes: {},
  flags: {},
  parts: ['bars', 'bar', 'caption', 'start', 'uptime', 'end', 'hidden'],
  figmaNodeId: '7580:263',
});
