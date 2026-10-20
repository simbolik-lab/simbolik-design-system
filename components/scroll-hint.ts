/**
 * The scroll region, shared by the parts that scroll inside themselves (the board's frame and its columns, the code
 * block's body, the table's frame): it says whether a part runs past its size, so the part becomes a region the
 * keyboard reaches and a screen reader names only while there is something to scroll to, as WAI-ARIA asks of a
 * scrolling area. It follows the part and what it holds as they change size.
 *
 * Sideways, it also draws the scroll hint: where what a frame holds is wider than the frame and the browser's own
 * scrollbar takes no room, so it hides until the frame scrolls (a phone, a trackpad), the frame is marked
 * `data-scroll-hint` and a thin bar along its foot shows that there is more sideways and how much of it is in view,
 * following the scroll. Where the browser's scrollbar takes room it always shows, and the hint stays away, so there
 * is never a second bar. The thumb is the element `thumb` reaches, inside a track whose width is the bar's length;
 * the bar is drawn with the table's track and thumb classes. A part with no thumb gets no hint.
 */

import { useEffect, useRef, useState, type RefObject } from 'react';

export interface ScrollRegionOptions<T extends HTMLElement> {
  /** Which way the part scrolls: sideways (the default, with the hint), down, or both. */
  axis?: 'x' | 'y' | 'both';
  /** The region's name while it scrolls, in words. */
  label?: string;
  /** The id of what names the region while it scrolls, in place of `label`. Leave both out for a part already named (a section with a heading). */
  labelledBy?: string;
  /** A region and a Tab stop whether or not it scrolls now (a table whose heading row sticks scrolls downwards in the page's own scroll). */
  always?: boolean;
  /** The part, when the component holds its ref already (one the page's ref reaches too); otherwise `frame` is made here. */
  frame?: RefObject<T | null>;
}

export interface ScrollRegion<T extends HTMLElement> {
  /** The part that scrolls. */
  frame: RefObject<T | null>;
  /** The hint's thumb, for a part that draws the hint. */
  thumb: RefObject<HTMLSpanElement | null>;
  /** Whether the part runs past its size now. */
  overflows: boolean;
  /** Spread on the part: a Tab stop, and with a name a region, while it scrolls (or `always`); nothing otherwise. */
  region: { role?: 'region'; 'aria-label'?: string; 'aria-labelledby'?: string; tabIndex?: 0 };
}

export function useScrollRegion<T extends HTMLElement = HTMLDivElement>({ axis = 'x', label, labelledBy, always = false, frame: given }: ScrollRegionOptions<T> = {}): ScrollRegion<T> {
  const made = useRef<T>(null);
  const frame = given ?? made;
  const thumb = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = frame.current;
    if (!el || !('ResizeObserver' in window)) return undefined;
    const bar = thumb.current;
    const update = () => {
      const wide = el.scrollWidth > el.clientWidth + 1;
      const tall = el.scrollHeight > el.clientHeight + 1;
      setOverflows(axis === 'x' ? wide : axis === 'y' ? tall : wide || tall);
      if (!bar) return;
      const style = getComputedStyle(el);
      const scrollbarRoom = el.offsetHeight - el.clientHeight - Number.parseFloat(style.borderTopWidth) - Number.parseFloat(style.borderBottomWidth);
      if (!wide || scrollbarRoom >= 1) {
        delete el.dataset.scrollHint;
        return;
      }
      el.dataset.scrollHint = '';
      const track = bar.parentElement?.clientWidth ?? 0;
      // The thumb is the share of the content in view, never so small it cannot be seen.
      const size = Math.max(track * (el.clientWidth / el.scrollWidth), track / 10);
      const travel = el.scrollWidth - el.clientWidth;
      bar.style.width = `${size}px`;
      bar.style.transform = `translateX(${travel > 0 ? ((track - size) * el.scrollLeft) / travel : 0}px)`;
    };
    update();
    if (bar) el.addEventListener('scroll', update, { passive: true });
    const watch = new ResizeObserver(update);
    watch.observe(el);
    for (const child of Array.from(el.children)) watch.observe(child);
    return () => {
      el.removeEventListener('scroll', update);
      watch.disconnect();
    };
  }, [axis]);
  const name = labelledBy !== undefined ? { role: 'region' as const, 'aria-labelledby': labelledBy } : label !== undefined ? { role: 'region' as const, 'aria-label': label } : {};
  return { frame, thumb, overflows, region: always || overflows ? { ...name, tabIndex: 0 } : {} };
}
