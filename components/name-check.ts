'use client';

/**
 * The name check: in development, a warning in the console when a part that needs a name is drawn
 * without one. For the fields, when an input, a search field, a select or a text area is on the page
 * with no name, so a screen reader would announce a bare "edit text" or "button". A field has a name
 * when a label points at it or wraps it, or when it carries aria-label or aria-labelledby; a
 * placeholder is not a name, since it goes as typing starts. The field component always gives its
 * control one. For the badge's dot, which shows no words, when it has no words to say and is not
 * hidden. In production, and on a page built without a bundler, the check does nothing.
 *
 * It also holds `useWarning`, for props a component cannot draw as asked: the component draws the nearest thing that
 * works and warns, rather than throwing during render.
 */

import { useEffect, type RefObject } from 'react';

/** Whether this is a development build: the bundler writes NODE_ENV in, and without one there is no process to read. */
export function developing(): boolean {
  try {
    return process.env.NODE_ENV !== 'production';
  } catch {
    return false;
  }
}

/** Each control is warned about once, however often it renders. */
const warned = new WeakSet<Element>();

function named(el: Element): boolean {
  if ((el.getAttribute('aria-label') ?? '').trim() !== '') return true;
  if ((el.getAttribute('aria-labelledby') ?? '').trim() !== '') return true;
  const labels = (el as HTMLInputElement).labels;
  return Boolean(labels && labels.length > 0);
}

/**
 * Checks, once the component is on the page, that its control has a name. `around` is an element the
 * component draws, and `control` picks the control inside it (or it is the control itself). With no
 * component named, nothing is checked, for a part drawn more than once with one check, such as the
 * input's well (input/input-well.tsx), which every field built on the input draws.
 */
export function useNameCheck(component: string | undefined, around: RefObject<Element | null>, control: string) {
  useEffect(() => {
    if (!developing() || !component) return;
    const root = around.current;
    const el = root?.matches(control) ? root : root?.querySelector(control);
    if (!el || warned.has(el) || named(el)) return;
    warned.add(el);
    console.warn(`${component} has no name, so a screen reader cannot say what it is for. Put it in a Field, point a Label at it, or give it an aria-label.`, el);
  }, [component, around, control]);
}

/** An icon's name in words, "MagnifyingGlass" as "Magnifying glass": a nameless icon-only button's last resort. */
export const iconWords = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/ [A-Z]/g, (m) => m.toLowerCase());

/**
 * Warns, in development, when a component is given props it cannot draw as asked, and says what it drew instead. A
 * component never throws for a prop a page got wrong, since that would take the whole page down; it draws the nearest
 * thing that works and says so here. In production it does nothing.
 */
export function useWarning(wrong: boolean, message: string) {
  useEffect(() => {
    if (!developing() || !wrong) return;
    console.warn(message);
  }, [wrong, message]);
}

/**
 * Warns, in development, when a component decides from its own props that it has no name. `named` is
 * true when it has one, or when it is hidden from assistive technology and needs none.
 */
export function useNameWarning(component: string, named: boolean, advice: string) {
  useEffect(() => {
    if (!developing() || named) return;
    console.warn(`${component} has no name, so a screen reader cannot say what it is for. ${advice}`);
  }, [component, named, advice]);
}
