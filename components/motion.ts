/**
 * The design tokens as a script reads them where an element sits: the same custom properties the stylesheets use,
 * so a wrapper that times or measures something itself (a glide, a hover delay, a toast leaving, a panel's gap) keeps
 * to the tokens and follows any region that changes them (a density, a theme, a narrow layout). Named for the motion
 * tokens it first read; every token a script reads goes through here.
 */

/** A motion token's value where an element sits, in milliseconds: `motionMs(el, 'enter-duration')`. */
export function motionMs(element: Element, name: string): number {
  const value = getComputedStyle(element).getPropertyValue(`--smbk-motion-${name}`).trim();
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount)) return 0;
  return value.endsWith('ms') ? amount : amount * 1000;
}

/** A motion purpose's easing where an element sits, as written: `motionEasing(el, 'enter')`. */
export function motionEasing(element: Element, purpose: string): string {
  return getComputedStyle(element).getPropertyValue(`--smbk-motion-${purpose}-easing`).trim() || 'linear';
}

/** A length custom property where an element sits, in pixels; undefined when it is not a length: `lengthPx(el, '--smbk-space-stack-xs')`. */
export function lengthPx(element: Element, name: string): number | undefined {
  const amount = Number.parseFloat(getComputedStyle(element).getPropertyValue(name));
  return Number.isFinite(amount) ? amount : undefined;
}

/**
 * Whether the layout switch (`--smbk-layout`, inherited) says narrow where an element sits: the phone form, or a
 * region a page forced narrow with `data-layout="narrow"`. A wrapper reads it only for what a stylesheet cannot do
 * (closing a menu the wide form has no room for, choosing a sheet over a floating panel).
 */
export function isNarrow(element: Element): boolean {
  return getComputedStyle(element).getPropertyValue('--smbk-layout').trim() === 'narrow';
}
