/**
 * Tooltip: the bubble and its arrow, on its own or beside a target it shows itself for.
 *
 * TARGET API — how to give a control a tooltip
 * --------------------------------------------
 * Give the tooltip its target as `trigger`, as the popover takes its opener. It then draws the target, shows the
 * tooltip while the pointer rests on the target or the target has keyboard focus, and places it beside the target.
 * Without `trigger` it draws the bubble only, shown, for a page that shows and places it itself.
 *
 *   <Tooltip inverse purpose="name" trigger={<Button tone="ghost" icon="Link" icon-only aria-label="Insert a link" />}>
 *     Insert a link
 *   </Tooltip>
 *
 * Tooltip props, with a target:
 *   trigger   The target: any element that renders one element and passes aria-describedby and the pointer, focus
 *             and key handlers through to it (Button, Link, a plain <button> or <a>). Its own handlers run too.
 *   arrow     The arrow the tooltip prefers, which says where it sits: top-center (the default) below the target,
 *             bottom-center above it, left to its right, right to its left; start and end line its edge up with
 *             the target's. Without room on that side it takes the opposite one, and the arrow turns with it.
 *   purpose   "name" when the words are the target's own name, as an icon button's label is: the bubble is then
 *             hidden from assistive technology, which already reads the name. "description" when the words add to
 *             the name: the target is described by the bubble. Name when the trigger's aria-label is the same
 *             words, otherwise description.
 *   defaultOpen  Shown from the start, as in a picture of the page, until the reader points away, moves focus or
 *             presses Escape.
 *   Other props (inverse, className, data-*) go to the tooltip.
 *
 * Without script, or before the page's script has run, a shown tooltip hangs beside its target on the side its
 * arrow names (the stylesheet), so markup written by hand can show it the same way.
 *
 * Behaviour (React Aria's tooltip hooks): it shows after the hover open delay while a mouse rests on the target,
 * and at once when the target takes keyboard focus; never on a touch screen, so its words must be found elsewhere
 * too. It stays while the pointer moves onto it, and while focus stays. It closes when the pointer leaves both
 * (after the hover close delay), when focus leaves, when the target is pressed, and on Escape, which leaves focus
 * where it is. Once one tooltip has shown, the next shows at once as the pointer moves along a row of targets.
 * Placing: the tooltip is lifted over the page and placed beside its target (floating.ts), moved inward at the
 * window's edge, its arrow kept pointing at the target's middle. It closes when its target scrolls out of the window.
 *
 * Movement belongs to the stylesheet: the tooltip fades in and out, and does not move under reduced motion. The
 * wrapper holds no styling: the stylesheet draws everything.
 */
import { cloneElement, useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode, type RefObject } from 'react';
import { mergeProps, useTooltip, useTooltipTrigger } from 'react-aria';
import { useTooltipTriggerState } from 'react-stately';
import { tooltip } from './tooltip.manifest.js';
import { useFloating, type FloatingSide } from '../floating.js';
import { motionMs } from '../motion.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/** One of the arrow axis's values. */
export type TooltipArrow = NonNullable<VariantProps<typeof tooltip.manifest>['arrow']>;

/** The side of its target a tooltip sits on, from its arrow: a top arrow points up at a target above the bubble. */
const SIDE: Record<TooltipArrow, FloatingSide> = {
  'top-start': 'below', 'top-center': 'below', 'top-end': 'below',
  'bottom-start': 'above', 'bottom-center': 'above', 'bottom-end': 'above',
  left: 'right', right: 'left',
};

/** Which edge of the target the bubble lines up with, from its arrow. */
const ALIGN: Record<TooltipArrow, 'start' | 'center' | 'end'> = {
  'top-start': 'start', 'top-center': 'center', 'top-end': 'end',
  'bottom-start': 'start', 'bottom-center': 'center', 'bottom-end': 'end',
  left: 'center', right: 'center',
};

/** The arrow of a tooltip that sits on this side of its target, lined up this way. */
function arrowFor(side: FloatingSide, align: 'start' | 'center' | 'end'): TooltipArrow {
  if (side === 'below') return `top-${align}`;
  if (side === 'above') return `bottom-${align}`;
  return side === 'right' ? 'left' : 'right';
}

/** What a component gives `useTip` to show a tooltip beside one of its parts. */
export interface TipOptions {
  /** The words. */
  text: ReactNode;
  /** The arrow it prefers, which says where it sits (see the target API). Top-center unless given. */
  arrow?: TooltipArrow;
  /** The dark bubble. */
  inverse?: boolean;
  /** Name: the words repeat the target's own name, for sighted readers. Description: they add to it. */
  purpose?: 'name' | 'description';
  /** Shows nothing while true. */
  disabled?: boolean;
  /** Shown from the start, until the reader points away, moves focus or presses Escape. */
  defaultOpen?: boolean;
  /** Classes for the tooltip itself. */
  className?: string;
  /** Anything else for the tooltip element (data-*, an id). */
  tooltipProps?: HTMLAttributes<HTMLSpanElement>;
}

/** What `useTip` hands back: where each part goes. */
export interface Tip {
  /** The element the tooltip is placed beside. */
  targetRef: RefObject<HTMLElement | null>;
  /** For the element the pointer rests on: the target, or the part around a control that is hidden from view. */
  hoverProps: HTMLAttributes<HTMLElement>;
  /** For the element that takes keyboard focus: the target itself, or the control inside it. */
  focusProps: HTMLAttributes<HTMLElement>;
  /** Shows it at once, or hides it: for a part whose focus is somewhere else, as a label's help is its control's. */
  show: () => void;
  hide: () => void;
  /** The layer holding the tooltip: render it inside the target or just after it. */
  tip: ReactNode;
}

/**
 * Shows a tooltip beside a target, for a component that gives one of its own parts a tooltip (the sidebar's closed
 * items, an icon-only segment, the theme switch, a label's help). The hover delays are the motion tokens' hover
 * open and close delays, read where the target sits.
 */
export function useTip({ text, arrow = 'top-center', inverse, purpose = 'description', disabled = false, defaultOpen = false, className, tooltipProps: extra }: TipOptions): Tip {
  const targetRef = useRef<HTMLElement | null>(null);
  const layer = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const [delay, setDelay] = useState({ open: 0, close: 0 });

  useLayoutEffect(() => {
    const t = targetRef.current;
    if (t) setDelay({ open: motionMs(t, 'hover-open-delay'), close: motionMs(t, 'hover-close-delay') });
  }, []);

  const state = useTooltipTriggerState({ delay: delay.open, closeDelay: delay.close, defaultOpen });
  const { triggerProps, tooltipProps } = useTooltipTrigger({ isDisabled: disabled }, state, targetRef);
  const { tooltipProps: bubbleProps } = useTooltip({}, state);
  const open = state.isOpen && !disabled;

  // A target scrolled out of the window takes its tooltip with it, rather than leave it stuck at the window's edge.
  const close = useRef(state.close);
  close.current = state.close;
  useEffect(() => {
    if (!open) return undefined;
    const gone = () => {
      const r = targetRef.current?.getBoundingClientRect();
      if (r && (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth)) close.current(true);
    };
    window.addEventListener('scroll', gone, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', gone, { capture: true });
  }, [open]);

  const { side, arrowOffset } = useFloating({ target: targetRef, layer, panel, open, side: SIDE[arrow], align: ALIGN[arrow], listHeight: false, arrow: arrowRef });
  const placed = side ? arrowFor(side, ALIGN[arrow]) : arrow;

  // The arrow's middle where the target's middle is, along the edge it sits on, once placed.
  useLayoutEffect(() => {
    const a = arrowRef.current;
    if (!a) return;
    const across = placed === 'left' || placed === 'right';
    a.style.left = arrowOffset !== null && !across ? `${arrowOffset}px` : '';
    a.style.top = arrowOffset !== null && across ? `${arrowOffset}px` : '';
  }, [arrowOffset, placed]);

  // React Aria's trigger props, split between the part the pointer rests on and the part that takes focus. The
  // target is described by the bubble whether it shows or not, so the description is there before it shows.
  const { onPointerEnter, onPointerLeave, onPointerDown, onMouseEnter, onMouseLeave, onTouchStart, tabIndex: _tabIndex, 'aria-describedby': _described, ...focus } = triggerProps;
  const hoverProps = { onPointerEnter, onPointerLeave, onPointerDown, onMouseEnter, onMouseLeave, onTouchStart };
  const focusProps = purpose === 'description' ? { ...focus, 'aria-describedby': tooltipProps.id } : focus;

  const tip = (
    <span ref={layer} className={tooltip.part('layer')}>
      <span
        ref={panel}
        {...mergeProps(bubbleProps, tooltipProps, extra ?? {})}
        role="tooltip"
        aria-hidden={purpose === 'name' ? true : undefined}
        className={cx(tooltip({ arrow: placed, inverse }), className)}
        hidden={!open}
        data-placed={arrowOffset !== null ? '' : undefined}
        data-instant={state.shouldSkipAnimation ? '' : undefined}
        // A press on the tooltip goes nowhere: inside a label or a link it would choose or follow it.
        onClick={(e) => e.preventDefault()}
      >
        <span className={tooltip.part('bubble')}>{text}</span>
        <span ref={arrowRef} className={tooltip.part('arrow')} aria-hidden="true" />
      </span>
    </span>
  );

  return { targetRef, hoverProps, focusProps, show: () => state.open(true), hide: () => state.close(true), tip };
}

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tooltip.manifest> {
  children: ReactNode;
  /** The target. When given, the tooltip draws it, shows itself beside it and places itself. */
  trigger?: ReactElement;
  /** With a target: whether the words are its name or add to it (see the target API). */
  purpose?: 'name' | 'description';
  /** With a target: shown from the start, until the reader points away, moves focus or presses Escape. */
  defaultOpen?: boolean;
}

/** Tooltip: the bubble alone, or the bubble beside its target when `trigger` is given. See the target API above. */
export function Tooltip(props: TooltipProps) {
  return props.trigger ? <TooltipWithTarget {...props} trigger={props.trigger} /> : <TooltipBubble {...props} />;
}

/** The bubble alone, shown. Give it an id and point the target's aria-describedby at it; the page shows and places it. */
function TooltipBubble({ arrow, inverse, trigger: _trigger, purpose: _purpose, defaultOpen: _defaultOpen, className, children, ...rest }: TooltipProps) {
  return (
    <span role="tooltip" className={cx(tooltip({ arrow, inverse }), className)} {...rest}>
      <span className={tooltip.part('bubble')}>{children}</span>
      <span className={tooltip.part('arrow')} aria-hidden="true" />
    </span>
  );
}

/** The target and the tooltip that shows beside it. */
function TooltipWithTarget({ arrow, inverse, trigger, purpose, defaultOpen, className, children, ...rest }: TooltipProps & { trigger: ReactElement }) {
  const targetProps = trigger.props as Record<string, unknown>;
  const named = typeof children === 'string' && targetProps['aria-label'] === children;
  const { targetRef, hoverProps, focusProps, tip } = useTip({ text: children, arrow, inverse, purpose: purpose ?? (named ? 'name' : 'description'), defaultOpen, className, tooltipProps: rest });
  return (
    <span ref={targetRef as RefObject<HTMLSpanElement>} className={tooltip.part('anchor')}>
      {cloneElement(trigger as ReactElement<Record<string, unknown>>, mergeProps(targetProps, hoverProps, focusProps))}
      {tip}
    </span>
  );
}
