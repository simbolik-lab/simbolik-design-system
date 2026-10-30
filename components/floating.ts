'use client';

/**
 * A panel that floats beside its opener, such as the dropdown's menu, the select's list, the popover's panel and
 * a tooltip.
 *
 * The panel sits in a layer element, the dropdown's `layer` part. While the panel shows, the layer is in the
 * browser's top layer: no clipping or scrolling part around the opener cuts the panel off and nothing on the page
 * draws over it, while the panel keeps the theme, density and text size of the place it opened from, since it
 * stays where it is in the page. The layer covers the window and lets every press through to the page; the panel
 * inside it is placed by React Aria's overlay positioning: on the side of the opener it prefers, or the opposite side
 * when that one lacks room, lined up with the opener's start or end edge or its middle, moved inward at the
 * window's edge, never taller than that room (or than the list height the stylesheet gives a list), and kept
 * beside the opener as anything scrolls or changes size. A tooltip's arrow is moved along its edge to point at
 * the opener's middle. A submenu (`nested`) opens beside a row of a panel like itself: it stands off from that
 * panel's edge rather than the row's, and its first row lines up with the row. A panel may stand off from an
 * element around its opener instead of the opener (`standOff`: a menubar's menus hang below the bar).
 *
 * Without script, or before the page's script has run, the layer has no box of its own and the stylesheet hangs
 * the panel under its opener. A browser without the top layer places the panel the same way, inside the page.
 *
 * The layer's rules, the closed panel and the motion are floating/floating.css; closing on an outside press or
 * Escape is dismiss.ts.
 */
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { useOverlayPosition } from 'react-aria';
import { lengthPx, motionMs } from './motion.js';

/** Which side of its opener the panel opened on. */
export type FloatingSide = 'below' | 'above' | 'left' | 'right';

/** React Aria's name for each side. */
const PLACEMENT = { below: 'bottom', above: 'top', left: 'left', right: 'right' } as const;

export interface FloatingOptions {
  /** What the panel hangs from: the opener, or the element around it. */
  target: RefObject<HTMLElement | null>;
  /** The layer around the panel, the element lifted into the top layer. */
  layer: RefObject<HTMLElement | null>;
  /** The panel. */
  panel: RefObject<HTMLElement | null>;
  open: boolean;
  /** The side of the opener the panel prefers; it takes the opposite side when this one lacks room. Below unless given. */
  side?: FloatingSide;
  /** Which edge of the opener the panel lines up with, or its middle: its start or end edge below and above, its top
   * or bottom edge on the left and the right. */
  align?: 'start' | 'center' | 'end';
  /** An element the panel stays inside, besides the window. Read as the panel opens, never while drawing. */
  boundary?: RefObject<Element | null>;
  /** Makes the panel exactly as wide as its opener, as a select's list is. */
  matchWidth?: boolean;
  /** Keeps the panel no taller than the list height token, as a list's panel is; otherwise only the room limits it. On unless turned off. */
  listHeight?: boolean;
  /** A tooltip's arrow: the panel stands that much further off, and the arrow is moved to point at the opener's middle. */
  arrow?: RefObject<HTMLElement | null>;
  /** A submenu: the panel opens beside a row of a panel like itself, standing off from that panel's edge by the gap,
   * with its own first row level with the row (both read from the panel's own padding and edge). */
  nested?: boolean;
  /** An element around the opener the panel stands off from instead of the opener, on the side it opens on: a
   * menubar, whose menus hang the gap below the bar rather than below their title. Read as the panel opens. */
  standOff?: RefObject<HTMLElement | null>;
}

/** Where the panel opened (or last opened, while it leaves), and where its arrow sits along the edge facing the opener (its middle, in pixels from the panel's start), when it has one. */
export interface FloatingPlace {
  side: FloatingSide | null;
  arrowOffset: number | null;
  /** Places the panel again now: for an opener that moved while the panel was open (a right-click menu opened again elsewhere). */
  update: () => void;
}

/** Whether the browser has the top layer for any element (the popover attribute). */
const topLayer = () => typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;

/**
 * Places a floating panel while `open` is true, and says which side it opened on. The panel's gap from its
 * opener and from the window's edges is the extra-small stack step, and a list's greatest height the list height
 * token, both read where the panel sits so a density region keeps its own. An arrow adds its depth to the gap
 * (less the hairline it reaches into the panel) and is kept the medium inset from the panel's corners.
 */
export function useFloating({ target, layer, panel, open, side: preferred = 'below', align = 'start', boundary, matchWidth = false, listHeight = true, arrow, nested = false, standOff }: FloatingOptions): FloatingPlace {
  const [room, setRoom] = useState<{ gap: number; max: number | undefined; depth: number; size: number; inset: number; edge: Element | null; away: number; along: number } | null>(null);
  const lowering = useRef(0);

  // Before the panel is placed: lift the layer into the top layer and read the tokens where the panel sits, and the
  // boundary as it is now.
  // Declared before the placing below, so it runs first.
  useLayoutEffect(() => {
    const l = layer.current;
    const p = panel.current;
    const t = target.current;
    if (!open || !l || !p || !t) return;
    window.clearTimeout(lowering.current);
    if (topLayer()) {
      if (!l.hasAttribute('popover')) l.setAttribute('popover', 'manual');
      if (!l.matches(':popover-open')) l.showPopover();
    }
    if (matchWidth) p.style.width = `${t.getBoundingClientRect().width}px`;
    const gap = lengthPx(p, '--smbk-space-stack-xs') ?? 0;
    const max = listHeight ? lengthPx(p, '--smbk-size-list-max-height') : undefined;
    // The arrow's box is as deep as its shape, whichever edge it is on, and as long as its base.
    const a = arrow?.current?.getBoundingClientRect();
    const depth = a ? Math.min(a.width, a.height) - (lengthPx(p, '--smbk-border-width-hairline') ?? 0) : 0;
    const size = a ? Math.max(a.width, a.height) : 0;
    const inset = a ? lengthPx(p, '--smbk-space-inset-md') ?? 0 : 0;
    const edge = boundary?.current ?? null;
    // How much further off the panel stands (a submenu from its row's panel edge, a menubar's menu from the bar), and how
    // far back along the opener it starts (a submenu, so its first row is level with the row it opened from).
    let away = 0;
    let along = 0;
    if (nested) {
      const own = getComputedStyle(p);
      away = Number.parseFloat(own.paddingInlineStart) + Number.parseFloat(own.borderInlineStartWidth);
      along = -(Number.parseFloat(own.paddingTop) + Number.parseFloat(own.borderTopWidth));
    }
    const around = standOff?.current?.getBoundingClientRect();
    if (around) {
      const mine = t.getBoundingClientRect();
      away += preferred === 'below' || preferred === 'above' ? Math.max(around.bottom - mine.bottom, mine.top - around.top, 0) : Math.max(around.right - mine.right, mine.left - around.left, 0);
    }
    setRoom((was) => (was && was.gap === gap && was.max === max && was.depth === depth && was.size === size && was.inset === inset && was.edge === edge && was.away === away && was.along === along ? was : { gap, max, depth, size, inset, edge, away, along }));
  }, [open, layer, panel, target, matchWidth, listHeight, arrow, boundary, nested, standOff]);

  const across = preferred === 'below' || preferred === 'above';
  // React Aria names the edge to line up with: start or end below and above, top or bottom on the left and the right.
  const edgeName = across ? align : align === 'start' ? 'top' : 'bottom';
  const placeAt = (align !== 'center' ? `${PLACEMENT[preferred]} ${edgeName}` : PLACEMENT[preferred]) as NonNullable<Parameters<typeof useOverlayPosition>[0]['placement']>;
  const { placement, arrowProps, updatePosition } = useOverlayPosition({
    targetRef: target,
    overlayRef: panel,
    placement: placeAt,
    offset: (room?.gap ?? 0) + (room?.depth ?? 0) + (room?.away ?? 0),
    crossOffset: room?.along ?? 0,
    containerPadding: room?.gap ?? 0,
    maxHeight: room?.max,
    arrowSize: room?.size ?? 0,
    arrowBoundaryOffset: room?.inset ?? 0,
    boundaryElement: room?.edge ?? undefined,
    shouldFlip: true,
    isOpen: open && room !== null,
  });

  // The opener moves when the page or any part around it scrolls; the panel follows. Its own scrolling does not move it.
  useEffect(() => {
    if (!open) return undefined;
    const follow = (e: Event) => {
      if (e.target instanceof Node && panel.current?.contains(e.target)) return;
      updatePosition();
    };
    window.addEventListener('scroll', follow, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', follow, { capture: true });
  }, [open, panel, updatePosition]);

  // Closed: the layer leaves the top layer once the panel has finished leaving (the exit motion). Under reduced
  // motion the panel still fades out, in place, so the layer waits the same. Opening again before then keeps it.
  useEffect(() => {
    const l = layer.current;
    const p = panel.current;
    if (open || !l || !p || !topLayer() || !l.matches(':popover-open')) return undefined;
    lowering.current = window.setTimeout(() => {
      if (l.matches(':popover-open')) l.hidePopover();
    }, motionMs(p, 'exit-duration'));
    return () => window.clearTimeout(lowering.current);
  }, [open, layer, panel]);

  // The side stays named after the panel closes, so it leaves the way it came, back toward its opener, and a tooltip's
  // arrow stays on the edge it was on while the tooltip fades. It is null until the panel is first placed.
  const side: FloatingSide | null = placement === 'top' ? 'above' : placement === 'bottom' ? 'below' : placement === 'left' || placement === 'right' ? placement : null;
  const along = side === 'left' || side === 'right' ? arrowProps.style?.top : arrowProps.style?.left;
  return { side, arrowOffset: arrow && typeof along === 'number' ? along : null, update: updatePosition };
}
