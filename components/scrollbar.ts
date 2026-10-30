'use client';

/**
 * The scrollbar every part that scrolls inside itself draws (a menu's list, a modal's body, the sidebar's navigation,
 * a code block, a table): a thin bar over the content at the part's edge, taking no room, in place of the browser's
 * own. Where a computer shows scrollbars all the time (a mouse on a Mac, Windows), the browser's bar takes room inside
 * the part, so a list sized to its longest row grows wider by it and a code block grows taller; this one never does.
 *
 * How it behaves:
 * - It shows while a mouse is over the part and while the part scrolls, staying the scrollbar hide delay after the
 *   last scroll; then it fades. A part that does not run past its size shows none.
 * - Its thumb is thin and see-through, so the words under it still read; on the bar it widens and darkens, darker
 *   still while dragged. Dragging it scrolls the part; a press on its track jumps the thumb there and drags on.
 * - Only where the main pointer is a mouse or a trackpad. On a touch screen the browser's own bar stays (it already
 *   sits over the content there), and nothing is added.
 * - It is drawn by an element the hook adds as the part's first child (`smbk-scrollbar`, an `li` in a list, a `span`
 *   elsewhere, hidden from screen readers),
 *   held at the part's top corner as it scrolls, with no size of its own; it cancels the gap a flex part puts after it.
 *   In a grid, where any child takes a cell, it is laid over the part instead, so a grid part must be positioned.
 *   A text area cannot hold it, so with `over` it is added to the control's parent, over the control.
 * - The part is marked `data-scrollbar` from the first render (spread what the hook returns on it), so the browser's
 *   own bar is gone from the page as the server sends it and nothing moves when the script starts. Markup written by
 *   hand has no mark and keeps the browser's thin bar.
 *
 * The stylesheet, `scrollbar/scrollbar.css`, draws it; this places it and follows the part's size and scroll.
 *
 *   const bar = useScrollbar(body);
 *   <div ref={body} className={modal.part('body')} {...bar}>…</div>
 */

import { useEffect, type RefObject } from 'react';
import { motionMs } from './motion.js';

export interface ScrollbarOptions {
  /** Which way the part scrolls: down (the default), sideways, or both. */
  axis?: 'y' | 'x' | 'both';
  /** For a control that cannot hold the bar (a text area): it is drawn in the control's parent, which it fills, over the control. */
  over?: boolean;
  /** Off while the part should keep the browser's own bar. */
  enabled?: boolean;
}

/** Where the bar is drawn: a screen with hover, whose main pointer is a mouse or a trackpad. */
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export function useScrollbar<T extends HTMLElement>(frame: RefObject<T | null>, { axis = 'y', over = false, enabled = true }: ScrollbarOptions = {}): { 'data-scrollbar'?: '' } {
  useEffect(() => {
    const el = frame.current;
    if (!el || !enabled || !('ResizeObserver' in window)) return undefined;
    const fine = window.matchMedia(FINE_POINTER);
    let stop: (() => void) | undefined;
    const follow = () => {
      stop?.();
      stop = fine.matches ? draw(el, axis, over) : undefined;
    };
    follow();
    fine.addEventListener('change', follow);
    return () => {
      fine.removeEventListener('change', follow);
      stop?.();
    };
  }, [axis, over, enabled]);
  return enabled ? { 'data-scrollbar': '' } : {};
}

interface Bar {
  axis: 'y' | 'x';
  track: HTMLSpanElement;
  thumb: HTMLSpanElement;
  /** The thumb's length, and how far it travels along its track. */
  size: number;
  room: number;
  /** How far the part scrolls along this axis: 0 when it does not run past its size. */
  travel: number;
  /** Where the thumb's travel starts inside its track. */
  inset: number;
}

function part(className: string, parent: HTMLElement): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = className;
  parent.append(span);
  return span;
}

const px = (value: string) => Number.parseFloat(value) || 0;

/** Adds the bar to a part and follows it; returns what takes it away again. */
function draw(el: HTMLElement, axis: 'y' | 'x' | 'both', over: boolean): () => void {
  // In a list it is a list item, as only those may sit there.
  const host: HTMLElement = document.createElement(!over && el.matches('ul, ol') ? 'li' : 'span');
  host.className = over ? 'smbk-scrollbar smbk-scrollbar--over' : 'smbk-scrollbar';
  host.setAttribute('aria-hidden', 'true');
  const area = part('smbk-scrollbar__area', host);
  const bars: Bar[] = (axis === 'both' ? (['y', 'x'] as const) : [axis]).map((a) => {
    const track = part(`smbk-scrollbar__track smbk-scrollbar__track--${a}`, area);
    return { axis: a, track, thumb: part('smbk-scrollbar__thumb', track), size: 0, room: 0, travel: 0, inset: 0 };
  });
  const place = () => (over ? el.parentElement?.append(host) : el.prepend(host));
  place();
  // The part the pointer is over: the part itself, or for a control that cannot hold the bar, its parent.
  const zone = over ? (el.parentElement ?? el) : el;
  let rtl = false;

  const measure = () => {
    const style = getComputedStyle(el);
    rtl = style.direction === 'rtl';
    if (!over) {
      const grid = style.display.includes('grid');
      host.classList.toggle('smbk-scrollbar--spread', grid);
      if (grid) {
        // In a grid any child takes a cell, so the element is laid over the part instead, as large as all it
        // scrolls through (measured without it), and the area is held in view inside it, at the padding's edge.
        host.style.width = host.style.height = '0px';
        host.style.width = `${el.scrollWidth}px`;
        host.style.height = `${el.scrollHeight}px`;
        host.style.marginBlockEnd = host.style.marginInlineEnd = '';
        area.style.left = area.style.top = '';
        area.style.insetBlockStart = `${-px(style.paddingTop)}px`;
        area.style.insetInlineStart = `${-px(rtl ? style.paddingRight : style.paddingLeft)}px`;
      } else {
        // A flex part puts its gap after the bar's element too: give it back.
        const flex = style.display.includes('flex');
        const column = style.flexDirection.startsWith('column');
        host.style.width = host.style.height = '';
        host.style.marginBlockEnd = flex && column ? `${-px(style.rowGap)}px` : '';
        host.style.marginInlineEnd = flex && !column ? `${-px(style.columnGap)}px` : '';
        // The element is held at the part's top corner, inside its padding: the area covers what shows of the part.
        const box = el.getBoundingClientRect();
        const at = host.getBoundingClientRect();
        area.style.insetBlockStart = area.style.insetInlineStart = '';
        area.style.left = `${box.left + el.clientLeft - at.left}px`;
        area.style.top = `${box.top + el.clientTop - at.top}px`;
      }
      area.style.width = `${el.clientWidth}px`;
      area.style.height = `${el.clientHeight}px`;
    }
    for (const bar of bars) {
      const down = bar.axis === 'y';
      const view = down ? el.clientHeight : el.clientWidth;
      const full = down ? el.scrollHeight : el.scrollWidth;
      bar.travel = full > view + 1 ? full - view : 0;
      bar.track.toggleAttribute('data-overflows', bar.travel > 0);
    }
    host.toggleAttribute('data-both', bars.every((bar) => bar.travel > 0));
    for (const bar of bars) {
      if (!bar.travel) continue;
      const down = bar.axis === 'y';
      const thumb = getComputedStyle(bar.thumb);
      bar.inset = px(down ? thumb.top : thumb.insetInlineStart);
      const length = (down ? bar.track.clientHeight : bar.track.clientWidth) - 2 * bar.inset;
      const view = down ? el.clientHeight : el.clientWidth;
      const least = px(down ? thumb.minHeight : thumb.minWidth);
      bar.size = Math.min(length, Math.max(least, (length * view) / (view + bar.travel)));
      bar.room = Math.max(0, length - bar.size);
      bar.thumb.style[down ? 'height' : 'width'] = `${bar.size}px`;
    }
    follow();
    show();
  };

  /** The thumbs where the part's scroll is now. */
  const follow = () => {
    for (const bar of bars) {
      if (!bar.travel) continue;
      const down = bar.axis === 'y';
      const at = Math.min(1, Math.max(0, (down ? el.scrollTop : Math.abs(el.scrollLeft)) / bar.travel)) * bar.room;
      bar.thumb.style.translate = down ? `0 ${at}px` : `${rtl ? -at : at}px 0`;
    }
  };

  let hovering = false;
  let scrolling = false;
  let dragging = false;
  let linger = 0;
  const show = () => host.toggleAttribute('data-shown', (hovering || scrolling || dragging) && bars.some((bar) => bar.travel > 0));

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    hovering = true;
    measure();
  };
  const onLeave = () => {
    hovering = false;
    show();
  };
  const onScroll = () => {
    if (!scrolling) measure();
    follow();
    scrolling = true;
    show();
    window.clearTimeout(linger);
    linger = window.setTimeout(() => {
      scrolling = false;
      show();
    }, motionMs(el, 'scrollbar-hide-delay'));
  };

  /** A press on a bar: on its thumb it drags from where it was taken; on its track the thumb jumps under the pointer first. */
  const press = (bar: Bar) => (e: PointerEvent) => {
    if (e.button !== 0 || !bar.travel) return;
    e.preventDefault();
    const down = bar.axis === 'y';
    const track = bar.track.getBoundingClientRect();
    const thumb = bar.thumb.getBoundingClientRect();
    // Distances along the bar, from its start: the top, or the reading start sideways.
    const along = (point: PointerEvent) => (down ? point.clientY - track.top : rtl ? track.right - point.clientX : point.clientX - track.left) - bar.inset;
    const onThumb = bar.thumb.contains(e.target as Node);
    const grab = onThumb ? (down ? e.clientY - thumb.top : rtl ? thumb.right - e.clientX : e.clientX - thumb.left) : bar.size / 2;
    const to = (point: PointerEvent) => {
      const share = bar.room ? Math.min(1, Math.max(0, (along(point) - grab) / bar.room)) : 0;
      const at = share * bar.travel;
      el.scrollTo(down ? { top: at, behavior: 'instant' } : { left: rtl ? -at : at, behavior: 'instant' });
    };
    bar.track.setPointerCapture(e.pointerId);
    dragging = true;
    bar.track.dataset.dragging = '';
    show();
    if (!onThumb) to(e);
    const move = (point: PointerEvent) => to(point);
    const end = () => {
      bar.track.removeEventListener('pointermove', move);
      bar.track.removeEventListener('pointerup', end);
      bar.track.removeEventListener('pointercancel', end);
      dragging = false;
      delete bar.track.dataset.dragging;
      hovering = zone.matches(':hover');
      show();
    };
    bar.track.addEventListener('pointermove', move);
    bar.track.addEventListener('pointerup', end);
    bar.track.addEventListener('pointercancel', end);
  };
  const presses = bars.map((bar) => [bar, press(bar)] as const);
  for (const [bar, handler] of presses) bar.track.addEventListener('pointerdown', handler);
  // A press on the bar keeps focus and the selection where they are.
  const keep = (e: Event) => e.preventDefault();
  host.addEventListener('mousedown', keep);
  // Over a control that cannot hold it, the bar is outside what scrolls: the wheel on it scrolls the control.
  const wheel = (e: WheelEvent) => {
    e.preventDefault();
    el.scrollBy({ left: e.deltaX, top: e.deltaY, behavior: 'instant' });
  };
  if (over) host.addEventListener('wheel', wheel, { passive: false });

  zone.addEventListener('pointerenter', onEnter);
  zone.addEventListener('pointerleave', onLeave);
  el.addEventListener('scroll', onScroll, { passive: true });
  const sizes = new ResizeObserver(() => measure());
  const watch = () => {
    sizes.disconnect();
    sizes.observe(el);
    for (const child of Array.from(el.children)) if (child !== host) sizes.observe(child);
  };
  watch();
  // What the part holds changes: follow the new rows, and put the bar back if a render took it out.
  const rows = new MutationObserver(() => {
    if (!host.isConnected) place();
    watch();
  });
  rows.observe(over ? (el.parentElement ?? el) : el, { childList: true });
  measure();

  return () => {
    window.clearTimeout(linger);
    rows.disconnect();
    sizes.disconnect();
    zone.removeEventListener('pointerenter', onEnter);
    zone.removeEventListener('pointerleave', onLeave);
    el.removeEventListener('scroll', onScroll);
    for (const [bar, handler] of presses) bar.track.removeEventListener('pointerdown', handler);
    host.removeEventListener('mousedown', keep);
    host.removeEventListener('wheel', wheel);
    host.remove();
  };
}
