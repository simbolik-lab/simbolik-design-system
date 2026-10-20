import { useEffect, useRef, type RefObject } from 'react';

/**
 * The gliding hover the menus, the select's and combobox's lists, the command palette, the sidebar's
 * navigation and the pressable lists share: one fill per list that slides to the row under the
 * pointer, instead of each row lighting up on its own. This places the fill; each component's
 * stylesheet draws it (its colour, corner and motion are the row hover's own, from the tokens).
 *
 * How it behaves:
 * - The fill is one element the hook adds as the list's first child, with the class given as `fill`
 *   (a part of the component, such as `smbk-dropdown__glide`): an `li` in a `ul` or `ol`, a `span`
 *   elsewhere, hidden from screen readers. It is moved by `translate` from the list's padding corner and
 *   sized to the lit row, so it scrolls with the rows. A slide changes its size only when the rows differ.
 * - The rows that join are the pressable ones the `rows` selector finds; a disabled row (`:disabled`,
 *   `aria-disabled="true"` on it or around it) and a row not drawn (a closed group's children) are skipped.
 * - The row the pointer is inside wins; otherwise the row whose centre is nearest, along the list, so
 *   the pointer in a gap, in the padding or past the last row still lights one. Ties keep the first.
 * - Only a mouse lights it, and only where the screen has hover: on a screen without hover nothing is
 *   added and nothing marked, and touch never shows a fill.
 * - A fresh entry, and the first move after the keys hid it, fades the fill in at its row, never
 *   sliding over from where it was last; leaving the list fades it out.
 * - Any key but a modifier hides it until the pointer really moves again, so the keyboard's own
 *   highlight (the focused or active row, with its ring) is never drawn twice.
 * - A press in a gap (between rows, in the padding) presses the lit row: its mouse down keeps focus
 *   where it is, as a row's does, and its click becomes a real `click()` on the lit row. A press on a
 *   row, on another control, on a disabled row or inside a list nested in this one is left alone.
 * - A size change (the list or the lit row reflowing, such as a sidebar folding) moves the fill at once,
 *   never sliding; a rectangle with no size is never used, so the last good place stands.
 *
 * The list is marked `data-glide`: "idle" while the fill is out, "lit" while it shows; the lit row is
 * marked `data-glide-lit`. With the mark, the rows' own `:hover` fill is off, so there is never a
 * second fill; markup written by hand has no mark and keeps each row's own hover. Nothing is added
 * before the wrapper's first effect, so the page as the server sends it is unchanged.
 *
 * `onPick` is told each time a new row lights, for a list whose highlight is also Enter's target
 * (the select, the combobox, the command palette).
 */
export interface GlideOptions {
  /** The rows that join, as a selector inside the list. */
  rows: string;
  /** The fill's class, a part of the component. */
  fill: string;
  /** Off while the list is not in the page (a closed select) or should not glide (a list with rows that cannot be pressed). */
  enabled?: boolean;
  /** Told each time a new row lights. */
  onPick?: (row: HTMLElement) => void;
}

/** What a press inside the list may land on that is not a gap: anything that acts on its own. */
const ACTS = 'a[href], button, summary, input, select, textarea, label, [tabindex], [role="button"], [role="link"], [role="option"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="checkbox"], [role="radio"], [role="switch"], [role="tab"], :disabled, [aria-disabled="true"]';

const MODIFIERS = new Set(['Shift', 'Control', 'Alt', 'AltGraph', 'Meta', 'CapsLock', 'Fn', 'FnLock', 'OS', 'Super', 'Hyper']);

export function useGlide(listRef: RefObject<HTMLElement | null>, { rows, fill, enabled = true, onPick }: GlideOptions) {
  const told = useRef(onPick);
  told.current = onPick;

  useEffect(() => {
    const list = listRef.current;
    if (!list || !enabled || typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return undefined;
    // A screen without hover (a phone) gets no fill and no mark at all; one that gains hover (a tablet given a mouse) starts then.
    const hover = window.matchMedia('(hover: hover)');
    let stop: (() => void) | null = null;
    const follow = () => {
      if (hover.matches && !stop) stop = start(list, hover);
      else if (!hover.matches && stop) {
        stop();
        stop = null;
      }
    };
    follow();
    hover.addEventListener('change', follow);
    return () => {
      hover.removeEventListener('change', follow);
      stop?.();
    };
  }, [listRef, rows, fill, enabled]);

  /** Sets the glide going on the list; returns what stops it. */
  function start(list: HTMLElement, hover: MediaQueryList) {
    const mark = document.createElement(list.tagName === 'UL' || list.tagName === 'OL' ? 'li' : 'span');
    mark.className = fill;
    mark.setAttribute('aria-hidden', 'true');
    list.prepend(mark);
    list.dataset.glide = 'idle';

    let lit: HTMLElement | null = null;
    // Where the pointer is, in the window; where the keys left it, which a move must leave before it shows again.
    let point: { x: number; y: number } | null = null;
    let still: { x: number; y: number } | null = null;
    // Where the fill was put last, in the list's own coordinates.
    let put: { x: number; y: number; w: number; h: number } | null = null;
    let frame = 0;
    let settle = 0;

    const disabled = (row: Element) => {
      if (row.matches(':disabled, [aria-disabled="true"]')) return true;
      const around = row.parentElement?.closest('[aria-disabled="true"]');
      return !!around && list.contains(around);
    };
    const drawn = (row: HTMLElement) => (typeof row.checkVisibility === 'function' ? row.checkVisibility({ visibilityProperty: true }) : row.getClientRects().length > 0);
    // Rows inside a list nested in this one (a flyout in the sidebar) belong to that list.
    const own = (row: Element) => row.closest('[data-glide]') === list;
    const all = () => [...list.querySelectorAll<HTMLElement>(rows)].filter(own);
    const pressable = () => all().filter((row) => !disabled(row) && drawn(row));

    /** The row the pointer is inside, or the one whose centre is nearest along the list. */
    const nearest = (y: number) => {
      let best: HTMLElement | null = null;
      let distance = Infinity;
      for (const row of pressable()) {
        const r = row.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (y >= r.top && y < r.bottom) return row;
        const d = Math.abs(y - (r.top + r.bottom) / 2);
        if (d < distance) {
          best = row;
          distance = d;
        }
      }
      return best;
    };

    /** Where the row is, in the list's own coordinates (its padding corner, with its scroll); null for a row with no size. */
    const measure = (row: HTMLElement) => {
      const box = list.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      if (!r.width || !r.height) return null;
      return { x: r.left - box.left - list.clientLeft + list.scrollLeft, y: r.top - box.top - list.clientTop + list.scrollTop, w: r.width, h: r.height };
    };

    const draw = (at: { x: number; y: number; w: number; h: number }, instant: boolean, show: boolean) => {
      if (instant) mark.dataset.instant = '';
      mark.style.translate = `${at.x}px ${at.y}px`;
      mark.style.width = `${at.w}px`;
      mark.style.height = `${at.h}px`;
      if (show) list.dataset.glide = 'lit';
      put = at;
      if (instant) {
        void mark.offsetWidth;
        delete mark.dataset.instant;
      }
    };

    const watch = new ResizeObserver(() => {
      if (!settle) settle = window.requestAnimationFrame(reflowed);
    });
    watch.observe(list);

    const light = (row: HTMLElement) => {
      if (lit === row) return;
      if (lit) {
        lit.removeAttribute('data-glide-lit');
        watch.unobserve(lit);
      }
      lit = row;
      row.setAttribute('data-glide-lit', '');
      watch.observe(row);
      told.current?.(row);
    };

    const hide = () => {
      list.dataset.glide = 'idle';
      if (lit) {
        lit.removeAttribute('data-glide-lit');
        watch.unobserve(lit);
      }
      lit = null;
    };

    const show = () => {
      frame = 0;
      if (!point) return;
      const row = nearest(point.y);
      const at = row && measure(row);
      if (!row || !at) {
        hide();
        return;
      }
      // A fresh entry fades in where it lands; a move between rows slides.
      const fresh = list.dataset.glide !== 'lit';
      draw(at, fresh, fresh);
      light(row);
    };

    // The list or the lit row changed size or place: the fill follows at once. A list no longer drawn (a closed menu) forgets the pointer.
    function reflowed() {
      settle = 0;
      if (!list!.getClientRects().length) {
        point = null;
        hide();
        return;
      }
      if (!lit) return;
      if (!lit.isConnected || disabled(lit) || !drawn(lit)) {
        if (point) show();
        else hide();
        return;
      }
      const at = measure(lit);
      if (!at || !put) return;
      if (Math.abs(at.x - put.x) < 0.5 && Math.abs(at.y - put.y) < 0.5 && Math.abs(at.w - put.w) < 0.5 && Math.abs(at.h - put.h) < 0.5) return;
      draw(at, true, false);
    }

    const ours = (e: Event) => (e.target as Element | null)?.closest?.('[data-glide]') === list;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !hover.matches) return;
      // Over a list nested in this one, this one steps back.
      if (!ours(e)) {
        point = null;
        hide();
        return;
      }
      if (still && Math.abs(e.clientX - still.x) < 1 && Math.abs(e.clientY - still.y) < 1) return;
      still = null;
      point = { x: e.clientX, y: e.clientY };
      if (!frame) frame = window.requestAnimationFrame(show);
    };

    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      point = null;
      still = null;
      window.cancelAnimationFrame(frame);
      frame = 0;
      hide();
    };

    /** A press in a gap: not on a row, a control, a disabled row or a nested list, while a row is lit. */
    const inGap = (e: MouseEvent) => {
      if (list.dataset.glide !== 'lit' || !lit || !ours(e)) return false;
      const acts = (e.target as Element).closest(ACTS);
      if (acts && acts !== list && list.contains(acts)) return false;
      // A disabled row that lets presses through (pointer-events: none) is still not a gap.
      return !all().some((row) => {
        if (!disabled(row)) return false;
        const r = row.getBoundingClientRect();
        return e.clientX >= r.left && e.clientX < r.right && e.clientY >= r.top && e.clientY < r.bottom;
      });
    };

    const onDown = (e: MouseEvent) => {
      if (e.button === 0 && inGap(e)) e.preventDefault();
    };

    const onClick = (e: MouseEvent) => {
      if (e.detail === 0 || !inGap(e)) return;
      lit!.click();
    };

    // The keys take over: the fill steps back until the pointer moves.
    const onKey = (e: KeyboardEvent) => {
      if (MODIFIERS.has(e.key) || list.dataset.glide !== 'lit') return;
      still = point;
      hide();
    };

    list.addEventListener('pointermove', onMove);
    list.addEventListener('pointerleave', onLeave);
    list.addEventListener('mousedown', onDown);
    list.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(settle);
      watch.disconnect();
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerleave', onLeave);
      list.removeEventListener('mousedown', onDown);
      list.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey, true);
      lit?.removeAttribute('data-glide-lit');
      delete list.dataset.glide;
      mark.remove();
    };
  }
}
