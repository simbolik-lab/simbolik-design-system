import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * The sliding indicator the tabs, the segmented control and the theme switch
 * share: the chosen item's raised surface drawn as one piece, which each
 * component's stylesheet slides from item to item. This only measures where it goes.
 *
 * It is measured from the bar's padding edge and scroll, so it scrolls with the
 * items. An instant placement (the first, and any after the items change size)
 * skips the slide. Once placed, the bar is marked `data-indicator`, so the
 * chosen item stops drawing its own surface and the indicator draws it instead;
 * with nothing chosen the mark is removed and the indicator is not drawn.
 */
export function placeIndicator(bar: HTMLElement | null, mark: HTMLElement | null, chosen: HTMLElement | null, instant: boolean) {
  if (!bar || !mark) return;
  if (!chosen) {
    delete bar.dataset.indicator;
    return;
  }
  const box = bar.getBoundingClientRect();
  const own = chosen.getBoundingClientRect();
  if (instant) mark.dataset.instant = '';
  mark.style.translate = `${own.left - box.left - bar.clientLeft + bar.scrollLeft}px ${own.top - box.top - bar.clientTop + bar.scrollTop}px`;
  mark.style.width = `${own.width}px`;
  mark.style.height = `${own.height}px`;
  bar.dataset.indicator = '';
  if (instant) {
    void mark.offsetWidth;
    delete mark.dataset.instant;
  }
}

/**
 * For a radio group drawn as one bar (the segmented control, the theme switch): keeps the
 * indicator on the item holding the checked radio. The choice is read from the radios, since an
 * uncontrolled group keeps it in the page. It slides when the choice changes; the first placement,
 * a new size and anything changing size land at once; a form reset puts the first choice back.
 * The group calls the returned `place(false)` after an uncontrolled change.
 */
export function useRadioIndicator(itemClass: string, value: string | undefined, size: unknown, keys: string) {
  const groupRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const shown = useRef<string | undefined>(undefined);

  const place = (instant: boolean) => {
    const input = groupRef.current?.querySelector<HTMLInputElement>(`:scope > .${itemClass} > input:checked`);
    const item = input?.parentElement ?? null;
    const now = input?.value;
    placeIndicator(groupRef.current, markRef.current, item, instant || shown.current === undefined || shown.current === now);
    shown.current = now;
  };

  useLayoutEffect(() => place(false), [value]);
  useLayoutEffect(() => place(true), [size]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => place(true));
    observer?.observe(group);
    for (const item of group.querySelectorAll(`:scope > .${itemClass}`)) observer?.observe(item);
    const form = group.closest('form');
    const onReset = () => requestAnimationFrame(() => place(false));
    form?.addEventListener('reset', onReset);
    return () => {
      observer?.disconnect();
      form?.removeEventListener('reset', onReset);
    };
  }, [keys]);

  return { groupRef, markRef, place };
}
