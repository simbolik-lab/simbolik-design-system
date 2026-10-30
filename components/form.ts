'use client';

/**
 * What the system's own form controls do in a form, as the browser's own controls do.
 *
 * The reset: a control that holds its own value goes back to its starting value when the
 * form around it is reset, as the browser's own controls do. A control the page holds is asked to change back,
 * through its `onChange`, as the browser would change it; the page decides.
 *
 *   useFormReset(well, () => keepValue(defaultValue ?? null));
 *
 * `ref` is any element of the control inside the form (or tied to one by its `form` attribute). React Aria's own
 * hooks (the combobox's, the number field's, the date field's, the colour field's and area's) already do this for
 * the value they hold; a wrapper uses this one for the value it holds itself.
 *
 * The first wrong control: when a form is sent, the browser tells every control that fails its check (an `invalid`
 * event) and then focuses the first. A control that draws its own error instead of the browser's message focuses
 * itself only when `isFirstInvalid` says it is that first one.
 */
import { useEffect, useRef, type RefObject } from 'react';

export function useFormReset(ref: RefObject<Element | null>, onReset: () => void): void {
  const latest = useRef(onReset);
  latest.current = onReset;
  useEffect(() => {
    const element = ref.current;
    const form = (element as HTMLInputElement | null)?.form ?? element?.closest('form');
    if (!form) return undefined;
    const reset = () => latest.current();
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [ref]);
}

/** Whether `element` is the first control of its form that fails its check, in the form's order (a fieldset, which
 * also matches `:invalid` around a wrong control, is not a control). */
export function isFirstInvalid(element: Element & { form?: HTMLFormElement | null }): boolean {
  const form = element.form;
  if (!form) return true;
  return Array.from(form.elements).find((el) => !(el instanceof HTMLFieldSetElement) && el.matches(':invalid')) === element;
}
