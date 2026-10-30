'use client';

/**
 * Own state unless the page holds it: a value a component keeps itself (a select's choice, a popover's open, a
 * toggle's on) until the page passes it in, as React's own inputs do. The component reads one value and calls one
 * setter, whoever holds it:
 *
 *   const [open, setOpen] = useControllable({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
 *
 * - The page holds the value while it passes anything but `undefined` (so `null` is a value the page holds: "nothing
 *   chosen"). Leaving it out, or passing `undefined`, hands it to the component, which starts from `defaultValue`.
 * - The setter tells `onChange` every change asked for and, when the component holds the value, keeps it. A component
 *   that must not report a value that did not change compares before it calls the setter; one whose `onChange` takes
 *   more than the value (an event, a single value for a list of one) leaves `onChange` out and calls it itself.
 * - The setter is one function for the component's life, as useState's is.
 * - In development, a component that switches between the two (a page passing a value, then `undefined`, or the other
 *   way) is warned about in the console, as React warns about an input: the value it shows would jump.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { developing } from './name-check.js';

export interface ControllableOptions<T> {
  /** The page's value. The component holds its own while this is `undefined`. */
  value: T | undefined;
  /** Where the component's own value starts. A function is called once, for a start worked out from other props. */
  defaultValue: T | (() => T);
  /** Told every change the setter is asked for, whoever holds the value. A method, so a handler typed for the
   * values the component actually sets (a string, where the value may start undefined) fits. */
  onChange?(next: T): void;
  /** The component and the prop, for the development warning: `'Select value'`. */
  name?: string;
}

export function useControllable<T>({ value, defaultValue, onChange, name = 'A component' }: ControllableOptions<T>): [T, (next: T) => void] {
  const [own, setOwn] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const was = useRef(controlled);
  useEffect(() => {
    if (was.current === controlled) return;
    if (developing()) {
      console.warn(
        `${name} changed from ${was.current ? 'held by the page' : 'held by the component'} to ${controlled ? 'held by the page' : 'held by the component'}. Pass a value on every render (and onChange to follow it), or never pass one.`,
      );
    }
    was.current = controlled;
  }, [controlled, name]);
  // The setter stays the same function from render to render, as useState's does, and reads the props as they are now.
  const now = useRef({ controlled, onChange });
  now.current = { controlled, onChange };
  const set = useCallback((next: T) => {
    if (!now.current.controlled) setOwn(next);
    now.current.onChange?.(next);
  }, []);
  return [controlled ? (value as T) : own, set];
}
