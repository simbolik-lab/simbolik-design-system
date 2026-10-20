import { useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type Ref } from 'react';
import { ruler } from './ruler.manifest.js';
import { Button } from '../button/button.js';
import { ToggleButton } from '../toggle-button/toggle-button.js';
import { cx } from '../variants.js';
import { useControllable } from '../controllable.js';

/** A layout state along the ruler: its name and the width it starts at, such as { name: 'Wide', from: 768 }. */
export interface RulerZone {
  name: string;
  from: number;
}

export interface RulerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The width now, in pixels, when the page holds it. Pair it with onChange. */
  value?: number;
  /** The first width, when the ruler holds its own. */
  defaultValue?: number;
  /** Called with the new width as the handle moves or a width is pressed. */
  onChange?: (width: number) => void;
  /**
   * The layout states in order, each from the width it starts at: the first from 0. Their starts after the first are the
   * breakpoints, drawn as full lines; pass the system's own (the layout and side-columns breakpoints) to show its states.
   */
  zones: RulerZone[];
  /** The screen widths to mark with a tick and their number, such as 320, 640, 1024 and 1440. */
  widths: number[];
  /** The width at the ruler's far end. */
  max: number;
  /** The narrowest width the handle goes to. The first screen width unless given. */
  min?: number;
  /** Leaves out the numbers under the band (Figma's Widths switch). */
  hideWidths?: boolean;
  /** Whether the preview fills the space, when the page offers that: shows the Fit toggle. */
  fit?: boolean;
  /** Called when Fit is pressed. Given it, the ruler shows the Fit toggle. */
  onFitChange?: (fit: boolean) => void;
  /** Called when Hide is pressed. Given it, the ruler shows the Hide button. */
  onHide?: () => void;
  /** The handle's name. "Preview width" unless given. */
  label?: string;
  /**
   * A width in words, given the number: "768 pixels" unless given, for a page in another language. It names the width
   * buttons and starts what the handle says, before the layout state.
   */
  widthLabel?: (width: number) => string;
  /** The Fit toggle's name. "Fit the space" unless given. */
  fitLabel?: string;
  /** The Hide button's name. "Hide the ruler" unless given. (Not `hideLabel`, which elsewhere hides a label.) */
  hideButtonLabel?: string;
  ref?: Ref<HTMLDivElement>;
}

const englishWidth = (width: number) => `${width} pixels`;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Ruler: the widths of a preview along one band, shaded by layout state, with the breakpoints, the screen widths and a
 * handle for the width now. The handle is a slider named "Preview width" whose value is said in pixels with its layout
 * state ("768 pixels, wide"): Left and Right move it 10 pixels (1 with Shift), Page Up and Page Down 100, Home and End to
 * its ends; it can be dragged, and a press on the band moves it there. The numbers under the band are buttons that set
 * the width, the one at the width now pressed. Fit is a toggle and Hide a button, each named in words.
 */
export function Ruler({
  value, defaultValue, onChange, zones, widths, max, min, hideWidths, fit, onFitChange, onHide, label = 'Preview width',
  widthLabel = englishWidth, fitLabel = 'Fit the space', hideButtonLabel = 'Hide the ruler', className, ref, ...rest
}: RulerProps) {
  const lowest = min ?? Math.min(...widths, max);
  const [width, keep] = useControllable({ value, defaultValue: () => clamp(defaultValue ?? lowest, lowest, max), onChange, name: 'Ruler value' });
  const now = clamp(width, lowest, max);
  const [dragging, setDragging] = useState(false);
  const band = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);

  const set = (w: number) => {
    const next = clamp(Math.round(w), lowest, max);
    if (next === now) return;
    keep(next);
  };
  const at = (w: number) => `${(clamp(w, 0, max) / max) * 100}%`;
  const place = (w: number): CSSProperties => ({ insetInlineStart: at(w) });
  const zoneOf = (w: number) => [...zones].reverse().find((z) => w >= z.from) ?? zones[0];
  const rtl = () => (band.current ? getComputedStyle(band.current).direction === 'rtl' : false);

  const fromPointer = (e: PointerEvent) => {
    const r = band.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    const share = (e.clientX - r.left) / r.width;
    set((rtl() ? 1 - share : share) * max);
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    fromPointer(e);
    handle.current?.focus({ preventScroll: true });
  };
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    const fine = e.shiftKey ? 1 : 10;
    const forward = rtl() ? -1 : 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = now + fine * forward;
    else if (e.key === 'ArrowLeft') next = now - fine * forward;
    else if (e.key === 'ArrowUp') next = now + fine;
    else if (e.key === 'ArrowDown') next = now - fine;
    else if (e.key === 'PageUp') next = now + 100;
    else if (e.key === 'PageDown') next = now - 100;
    else if (e.key === 'Home') next = lowest;
    else if (e.key === 'End') next = max;
    if (next === null) return;
    e.preventDefault();
    set(next);
  };

  const breaks = zones.slice(1).map((z) => z.from);
  const numbers = [...new Set([...widths, ...breaks])].sort((a, b) => a - b);
  const state = zoneOf(now)?.name;
  const pickable = Boolean(onChange) || value === undefined;

  return (
    <div ref={ref} {...rest} className={cx(ruler(), className)}>
      <div className={ruler.part('scale')}>
        <div
          ref={band}
          className={ruler.part('band')}
          onPointerDown={down}
          onPointerMove={(e) => dragging && fromPointer(e)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          {zones.map((z, i) => {
            const end = zones[i + 1]?.from ?? max;
            return (
              <span key={z.name} className={ruler.part('zone')} style={{ insetInlineStart: at(z.from), width: `${((clamp(end, 0, max) - clamp(z.from, 0, max)) / max) * 100}%` }} aria-hidden="true">
                {z.name}
              </span>
            );
          })}
          {breaks.map((b) => <span key={`b${b}`} className={ruler.part('break')} style={place(b)} aria-hidden="true" />)}
          {widths.filter((w) => !breaks.includes(w)).map((w) => <span key={`t${w}`} className={ruler.part('tick')} style={place(w)} aria-hidden="true" />)}
          <div
            ref={handle}
            role="slider"
            tabIndex={0}
            aria-label={label}
            aria-valuemin={lowest}
            aria-valuemax={max}
            aria-valuenow={now}
            aria-valuetext={`${widthLabel(now)}${state ? `, ${state.toLowerCase()}` : ''}`}
            aria-orientation="horizontal"
            className={ruler.part('handle')}
            style={place(now)}
            onKeyDown={keys}
          />
        </div>
        {!hideWidths && (
          <div className={ruler.part('widths')}>
            {numbers.map((w) => {
              const isBreak = breaks.includes(w) && !widths.includes(w);
              const common = { className: ruler.part('width'), style: place(w), 'data-breakpoint': isBreak || undefined };
              return pickable ? (
                <button key={w} {...common} type="button" aria-pressed={w === now} aria-label={widthLabel(w)} onClick={() => set(w)}>
                  {w}
                </button>
              ) : (
                <span key={w} {...common} aria-hidden="true">{w}</span>
              );
            })}
          </div>
        )}
      </div>
      <span className={ruler.part('now')} aria-hidden="true">{now} px</span>
      {(onFitChange || onHide) && (
        <span className={ruler.part('controls')}>
          {onFitChange && (
            <ToggleButton tone="ghost" size="sm" icon-only icon="ArrowsOutLineHorizontal" aria-label={fitLabel} pressed={fit} onPressedChange={onFitChange} className={ruler.part('fit')} />
          )}
          {onHide && <Button tone="ghost" size="sm" icon-only icon="EyeSlash" aria-label={hideButtonLabel} onClick={onHide} className={ruler.part('hide')} />}
        </span>
      )}
    </div>
  );
}
