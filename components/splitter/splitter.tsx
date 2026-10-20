import { useRef, useState, type HTMLAttributes, type KeyboardEvent, type Ref } from 'react';
import { useMove, useObjectRef, mergeProps, type MoveMoveEvent } from 'react-aria';
import { splitter } from './splitter.manifest.js';
import { cx } from '../variants.js';
import { useControllable } from '../controllable.js';
import type { VariantProps } from '../variants.js';
import { Icon } from '../icon/icon.js';

export interface SplitterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'>,
    VariantProps<typeof splitter.manifest> {
  /** The size of the pane the splitter measures, in pixels. A controlled value; leave it out and pass defaultValue for the splitter to keep its own. */
  value?: number;
  /** The size it starts at when the splitter keeps its own value. The smallest size unless given. */
  defaultValue?: number;
  /** The pane's smallest size, in pixels. The splitter stops there. */
  min: number;
  /** The pane's largest size, in pixels. The splitter stops there. */
  max: number;
  /** How far one press of an arrow key moves the line, in pixels. 16 unless given. */
  step?: number;
  /** Called with the pane's new size as the reader drags the line or presses a key. The page sizes its panes from it, and stores it if it wants to remember it. */
  onChange?: (value: number) => void;
  /** Which pane the value measures: the one before the line, the default (the left one in a left-to-right page, the upper one of two stacked panes), or the one after it. */
  pane?: 'before' | 'after';
  /** The words a screen reader hears for the value. By default how far the pane is between its smallest and largest size, as a percentage. */
  formatValue?: (value: number, min: number, max: number) => string;
  /** Shown but not moved; the line and the grip take the disabled colors and the splitter leaves the Tab order. */
  disabled?: boolean;
  /** The raised pill with six dots in the middle of the line. On unless turned off. */
  grip?: boolean;
  /** Reaches the separator element. */
  ref?: Ref<HTMLDivElement>;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const percent = (value: number, min: number, max: number) =>
  `${max > min ? Math.round(((value - min) / (max - min)) * 100) : 0}%`;

/**
 * Splitter: a focusable separator between two panes. React Aria's useMove gives the dragging, by mouse, pen or touch,
 * and the arrow keys; Home and End go to the smallest and largest size. A pointer's movement is in pixels on the
 * screen, so the wrapper turns it into the pane's size by the line's direction, the page's writing direction and which
 * pane the value measures. The page names it (aria-label, or aria-labelledby on the pane it sizes) and points
 * aria-controls at that pane.
 */
export function Splitter({
  orientation = 'vertical', value, defaultValue, min, max, step = 16, onChange, pane = 'before',
  formatValue = percent, disabled = false, grip = true, className, ref, ...rest
}: SplitterProps) {
  const element = useObjectRef(ref);
  const [size, keep] = useControllable({ value, defaultValue: () => clamp(defaultValue ?? min, min, max), onChange, name: 'Splitter value' });
  const current = clamp(size, min, max);
  const [dragging, setDragging] = useState(false);
  const latest = useRef(current);
  latest.current = current;
  const start = useRef({ value: current, moved: 0 });
  const vertical = orientation === 'vertical';

  const set = (next: number) => {
    const settled = clamp(Math.round(next), min, max);
    if (settled === latest.current) return;
    latest.current = settled;
    keep(settled);
  };

  /** +1 when moving the line right (or down) grows the pane the value measures, -1 when it shrinks it. */
  const sign = () => {
    const rtl = vertical && element.current !== null && getComputedStyle(element.current).direction === 'rtl';
    return (pane === 'before' ? 1 : -1) * (rtl ? -1 : 1);
  };

  const { moveProps } = useMove({
    onMoveStart(e) {
      start.current = { value: latest.current, moved: 0 };
      if (e.pointerType !== 'keyboard') setDragging(true);
    },
    onMove(e: MoveMoveEvent) {
      const delta = vertical ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      start.current.moved += delta * (e.pointerType === 'keyboard' ? step : 1) * sign();
      set(start.current.value + start.current.moved);
    },
    onMoveEnd() {
      setDragging(false);
    },
  });

  const keys = {
    onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
      if (e.key === 'Home') {
        e.preventDefault();
        set(min);
      } else if (e.key === 'End') {
        e.preventDefault();
        set(max);
      }
    },
  };

  return (
    <div
      data-dragging={dragging && !disabled ? '' : undefined}
      {...(disabled ? rest : mergeProps(rest, moveProps, keys))}
      ref={element}
      role="separator"
      tabIndex={disabled ? undefined : 0}
      aria-orientation={orientation}
      aria-valuenow={current}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={formatValue(current, min, max)}
      aria-disabled={disabled || undefined}
      className={cx(splitter({ orientation }), className)}
    >
      <span className={splitter.part('line')} />
      {grip && (
        <span className={splitter.part('grip')} aria-hidden="true">
          <Icon name={vertical ? 'DotsSix' : 'DotsSixVertical'} className={splitter.part('icon')} />
        </span>
      )}
      <span className={splitter.part('line')} />
    </div>
  );
}
