'use client';

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
 * is never a second bar; the system's own scrollbar drawn over the part (scrollbar.ts) takes no room, so the hint
 * shows beside it, and the stylesheet fades the hint while that bar shows. The thumb is the element `thumb` reaches,
 * inside a track whose width is the bar's length; the bar is drawn with the table's track and thumb classes. A part
 * with no thumb gets no hint.
 *
 * The part also gets the system's scrollbar (scrollbar.ts), along `bar` (the axis, unless the part scrolls more ways
 * than it is named for, as a table with a sticky heading row does): `region` carries its mark, so spread it always.
 *
 * With `hold`, for a part that scrolls only sideways and runs taller than what shows of the page around it (a long
 * table in the page), its heading and its foot stay in view while the page scrolls: the heading's cells move down to
 * stay just under the room the page keeps clear at the top of what scrolls it (that element's scroll padding, unless
 * the part's stylesheet frees it in `--smbk-<name>-room-top`), the foot up to the foot of what shows, each never past
 * the other's own place. How far they may move, the distance from the heading row's foot to the end of what holds it,
 * is written on the part as `--smbk-<name>-travel`, in whole pixels, so nothing ever runs past the part's foot and
 * gives it a scroll of its own downwards. Where the browser links an animation to a scroll, the part's stylesheet
 * moves them with it, at the speed of the scroll itself; elsewhere this moves them as the page scrolls. They are the
 * real cells, so sideways they scroll with their columns. A heading or a foot moved by part of a pixel draws its edge
 * across two rows of pixels, with what passes behind it showing there, so the part's stylesheet starts the heading's
 * move later or sooner by `--smbk-<name>-top-snap`, the part of a pixel that makes the move a whole one, and moves the
 * end of what holds the rows by `--smbk-<name>-foot-snap`, the part of a pixel that lands the part's foot on one.
 */

import { useEffect, useRef, useState, type RefObject } from 'react';
import { lengthPx } from './motion.js';
import { useScrollbar } from './scrollbar.js';

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
  /** Which way the scrollbar runs, when not the axis. */
  bar?: 'x' | 'y' | 'both';
  /**
   * Keeps the part's heading and foot in view while the page around it scrolls: `head` selects the heading's cells,
   * one row of them, inside a child of the part that holds the rows; `foot` what comes after it at the part's foot;
   * `name` the component, whose properties carry the distance (`--smbk-<name>-travel`), the room kept clear
   * (`--smbk-<name>-room-top`), the part of a pixel that makes its heading's move a whole one
   * (`--smbk-<name>-top-snap`) and the part that lands its foot on a whole one (`--smbk-<name>-foot-snap`).
   */
  hold?: { head: string; foot: string; name: string };
}

export interface ScrollRegion<T extends HTMLElement> {
  /** The part that scrolls. */
  frame: RefObject<T | null>;
  /** The hint's thumb, for a part that draws the hint. */
  thumb: RefObject<HTMLSpanElement | null>;
  /** Whether the part runs past its size now. */
  overflows: boolean;
  /** Spread on the part: the scrollbar's mark; a Tab stop, and with a name a region, while it scrolls (or `always`). */
  region: { role?: 'region'; 'aria-label'?: string; 'aria-labelledby'?: string; tabIndex?: 0; 'data-scrollbar'?: '' };
}

/** How long after the last scroll a held heading still follows the room kept clear: longer than a bar takes to answer it. Part of the behavior, not a design value. */
const SETTLE_MS = 400;

/** How near a whole pixel counts as on it: finer than any browser's own step, so a landed foot stays where it landed. Part of the behavior, not a design value. */
const ON_THE_PIXEL = 0.01;

/** Whether the browser moves an element by a scroll itself (a scroll-driven animation), so no script follows the scroll. */
const scrollLinked = () => typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

const px = (value: string) => Number.parseFloat(value) || 0;

/** What scrolls a part downwards: the nearest element around it whose overflow is not visible, or else the window (null). */
export function scrollerOf(el: HTMLElement): HTMLElement | null {
  for (let at = el.parentElement; at && at !== document.body && at !== document.documentElement; at = at.parentElement) {
    const y = getComputedStyle(at).overflowY;
    if (y !== 'visible' && y !== 'clip') return at;
  }
  return null;
}

/** A scroll padding in pixels: a share of what shows, or a length. */
const padding = (value: string, view: number) => (value.endsWith('%') ? (px(value) * view) / 100 : px(value));

/** Keeps the part's heading and foot in view while what scrolls it scrolls (the `hold` option). */
function useHold<T extends HTMLElement>(frame: RefObject<T | null>, hold: ScrollRegionOptions<T>['hold']) {
  const { head, foot, name } = hold ?? {};
  useEffect(() => {
    const el = frame.current;
    if (!el || !head || !foot || !name || !('ResizeObserver' in window)) return undefined;
    const travelName = `--smbk-${name}-travel`;
    const roomName = `--smbk-${name}-room-top`;
    const topSnapName = `--smbk-${name}-top-snap`;
    const footSnapName = `--smbk-${name}-foot-snap`;
    // Where the browser follows the scroll itself, the stylesheet moves them; this only measures.
    const scripted = !scrollLinked();
    let travel = 0;
    let footSnap = 0;
    let snapId = 0;
    let topId = 0;
    let frameId = 0;
    let until = 0;
    const move = (selector: string, by: number) => {
      for (const part of el.querySelectorAll<HTMLElement>(selector)) part.style.translate = by ? `0 ${by}px` : '';
    };
    /** How far the part's top has passed the top of what shows, past the room kept clear, and how far its foot runs past that foot. */
    const overrun = () => {
      const scroller = scrollerOf(el);
      const root = document.documentElement;
      const style = getComputedStyle(scroller ?? root);
      const box = scroller?.getBoundingClientRect();
      const viewTop = box && scroller ? box.top + scroller.clientTop : 0;
      const viewHeight = scroller ? scroller.clientHeight : root.clientHeight;
      const top = viewTop + (lengthPx(el, roomName) ?? padding(style.scrollPaddingBlockStart, viewHeight));
      const bottom = viewTop + viewHeight - padding(style.scrollPaddingBlockEnd, viewHeight);
      const part = el.getBoundingClientRect();
      const edges = getComputedStyle(el);
      return { above: top - part.top - px(edges.borderTopWidth), below: part.bottom - px(edges.borderBottomWidth) - bottom };
    };
    /** Moves the heading down to the top of what shows, past the room kept clear, and the foot up to its foot. */
    const place = () => {
      const { above, below } = overrun();
      move(head, Math.round(Math.min(travel, Math.max(0, above))));
      move(foot, -Math.round(Math.min(travel, Math.max(0, below))));
    };
    /** Lands the part's foot on a whole device pixel of what shows, to the nearest, so at rest it draws where it did. */
    const snapFoot = () => {
      snapId = 0;
      const scale = window.devicePixelRatio || 1;
      const below = overrun().below * scale;
      if (Math.abs(Math.round(below) - below) < ON_THE_PIXEL) return;
      const unmoved = below - footSnap * scale;
      footSnap = (Math.round(unmoved) - unmoved) / scale;
      el.style.setProperty(footSnapName, `${footSnap}px`);
    };
    /** Makes the heading's move a whole number of device pixels: the part it carries is the same wherever the page has scrolled to. */
    const snapTop = () => {
      topId = 0;
      const scale = window.devicePixelRatio || 1;
      const top = -overrun().above * scale;
      el.style.setProperty(topSnapName, `${(Math.round(top) - top) / scale}px`);
    };
    const snapEdges = () => {
      snapFoot();
      snapTop();
    };
    /** How far they may move: from the heading row's foot to the foot of what holds the rows, in whole pixels. */
    const measure = () => {
      const row = el.querySelector(head)?.parentElement;
      const rows = row ? Array.from(el.children).find((child) => child.contains(row)) : undefined;
      travel = row && rows ? Math.max(0, Math.floor(rows.getBoundingClientRect().bottom - row.getBoundingClientRect().bottom)) : 0;
      el.style.setProperty(travelName, `${travel}px`);
      if (scripted) place();
      // A frame later: this changes the part's height, and a change made inside its own resize callback is reported as an error.
      if (!snapId) snapId = requestAnimationFrame(snapFoot);
      // A frame after that: Chromium does not take up a new start of the move that comes in the same frame as a new distance.
      if (!topId) topId = requestAnimationFrame(() => { topId = requestAnimationFrame(snapTop); });
    };
    // Every frame while the page scrolls and a little after: the room kept clear can change with the scroll a frame or
    // more late (a bar that slides away as the reader scrolls down).
    const settle = () => {
      place();
      frameId = performance.now() < until ? requestAnimationFrame(settle) : 0;
    };
    // Any scroll around the part, the window's included, but not its own sideways one.
    const onScroll = (event: Event) => {
      const target = event.target;
      if (target === el || (target instanceof Node && target !== document && !target.contains(el))) return;
      place();
      until = performance.now() + SETTLE_MS;
      if (!frameId) frameId = requestAnimationFrame(settle);
    };
    measure();
    const watch = new ResizeObserver(measure);
    watch.observe(el);
    for (const child of Array.from(el.children)) watch.observe(child);
    // What stands above the part can move it by part of a pixel with no change to its size.
    window.addEventListener('scrollend', snapEdges, { capture: true, passive: true });
    if (scripted) {
      window.addEventListener('scroll', onScroll, { capture: true, passive: true });
      window.addEventListener('resize', place);
    }
    return () => {
      watch.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
      if (snapId) cancelAnimationFrame(snapId);
      if (topId) cancelAnimationFrame(topId);
      window.removeEventListener('scrollend', snapEdges, { capture: true });
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', place);
      el.style.removeProperty(travelName);
      el.style.removeProperty(topSnapName);
      el.style.removeProperty(footSnapName);
      move(head, 0);
      move(foot, 0);
    };
  }, [frame, head, foot, name]);
}

export function useScrollRegion<T extends HTMLElement = HTMLDivElement>({ axis = 'x', label, labelledBy, always = false, frame: given, bar: along = axis, hold }: ScrollRegionOptions<T> = {}): ScrollRegion<T> {
  const made = useRef<T>(null);
  const frame = given ?? made;
  const scrollbar = useScrollbar(frame, { axis: along });
  useHold(frame, hold);
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
  return { frame, thumb, overflows, region: always || overflows ? { ...scrollbar, ...name, tabIndex: 0 } : scrollbar };
}
