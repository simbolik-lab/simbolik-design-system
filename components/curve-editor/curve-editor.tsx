import { useRef, useState, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type Ref } from 'react';
import { curveEditor } from './curve-editor.manifest.js';
import { NumberField } from '../number-field/number-field.js';
import { cx } from '../variants.js';
import { useControllable } from '../controllable.js';

/** A curve's four numbers, as CSS's cubic-bezier() writes them: the first handle's time and movement, then the second's. */
export type Curve = [number, number, number, number];

export interface CurveEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The curve, when the page holds it. Pair it with onChange. */
  value?: Curve;
  /** The first curve, when the editor holds its own. Ease out (0.2, 0, 0, 1) unless given. */
  defaultValue?: Curve;
  /** Called with the new curve as a handle moves or a number is settled. */
  onChange?: (curve: Curve) => void;
  /** The editor's name, such as "Enter easing": it names the group, and each handle and number is named within it. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Leaves out the four number boxes (Figma's Numbers switch). The handles still move with the keys. */
  hideNumbers?: boolean;
  disabled?: boolean;
  /** The editor's words, in the page's language: each in English unless given. */
  words?: Partial<CurveEditorWords>;
  ref?: Ref<HTMLDivElement>;
}

/** The words the curve editor says, in the page's language. */
export interface CurveEditorWords {
  /** The two handles' names. */
  handles: readonly [string, string];
  /** The two directions a handle moves in, in its inputs' names and in what they say: "time" and "movement". */
  time: string;
  movement: string;
  /** The four number boxes' names, in the order of the curve's numbers. */
  numbers: readonly [string, string, string, string];
}

export const CURVE_EDITOR_WORDS: CurveEditorWords = {
  handles: ['First handle', 'Second handle'],
  time: 'time',
  movement: 'movement',
  numbers: ['x1, first handle’s time', 'y1, first handle’s movement', 'x2, second handle’s time', 'y2, second handle’s movement'],
};

/** The drawing's own units, as Figma draws the plot: a 240 square with the unit square 160 wide at 40 across and 56 down. */
const BOX = 240;
const LEFT = 40;
const BOTTOM = 216;
const UNIT = 160;
/** How far the drawing reaches past the unit square: 0.15 below the start and 0.35 above the end, as Figma's plot leaves room. */
export const CURVE_LIMITS = { low: -(BOX - BOTTOM) / UNIT, high: BOTTOM / UNIT } as const;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round = (v: number) => Math.round(v * 100) / 100;
const px = (t: number) => LEFT + t * UNIT;
const py = (m: number) => BOTTOM - m * UNIT;

/** The curve as CSS writes it: "cubic-bezier(0.2, 0, 0, 1)". */
export function curveToCss([x1, y1, x2, y2]: Curve): string {
  return `cubic-bezier(${round(x1)}, ${round(y1)}, ${round(x2)}, ${round(y2)})`;
}

/** The highest and lowest movement the curve reaches, by sampling it. */
function reach([, y1, , y2]: Curve): { top: number; bottom: number } {
  let top = 1;
  let bottom = 0;
  for (let i = 1; i < 100; i++) {
    const t = i / 100;
    const y = 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3;
    top = Math.max(top, y);
    bottom = Math.min(bottom, y);
  }
  return { top, bottom };
}

/**
 * Curve editor: a motion curve, time across and movement up, with its two handles and its four numbers. A handle can be
 * dragged; it also moves with the keys: each handle holds two hidden range inputs, its time and its movement, one Tab stop
 * between them. Left and Right move the time, Up and Down the movement, by 0.01 (0.1 with Shift); Page Up and Page Down move
 * the movement by 0.1, Home and End put the time at 0 and 1. Each input is named by its handle and says both values. The
 * four number boxes give the same numbers to type. Time stays between 0 and 1, as CSS needs; movement may pass the ends,
 * as far as the drawing reaches.
 */
export function CurveEditor({ value, defaultValue = [0.2, 0, 0, 1], onChange, hideNumbers, disabled, words, className, ref, ...rest }: CurveEditorProps) {
  const w = { ...CURVE_EDITOR_WORDS, ...words };
  const [curve, keep] = useControllable({ value, defaultValue, onChange, name: 'CurveEditor value' });
  const [pressed, setPressed] = useState<number | null>(null);
  const [axis, setAxis] = useState<['time' | 'movement', 'time' | 'movement']>(['time', 'time']);
  const plot = useRef<HTMLDivElement>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const set = (next: Curve) => {
    const fixed: Curve = [clamp(round(next[0]), 0, 1), clamp(round(next[1]), CURVE_LIMITS.low, CURVE_LIMITS.high), clamp(round(next[2]), 0, 1), clamp(round(next[3]), CURVE_LIMITS.low, CURVE_LIMITS.high)];
    if (fixed.every((v, i) => v === curve[i])) return;
    keep(fixed);
  };
  const setHandle = (h: number, time: number, movement: number) => {
    const next = [...curve] as Curve;
    next[h * 2] = time;
    next[h * 2 + 1] = movement;
    set(next);
  };

  const fromPointer = (h: number, e: PointerEvent) => {
    const r = plot.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    const ux = ((e.clientX - r.left) / r.width) * BOX;
    const uy = ((e.clientY - r.top) / r.height) * BOX;
    setHandle(h, (ux - LEFT) / UNIT, (BOTTOM - uy) / UNIT);
  };
  const down = (h: number) => (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setPressed(h);
    inputs.current[h * 2 + (axis[h] === 'time' ? 0 : 1)]?.focus({ preventScroll: true });
  };
  const move = (h: number) => (e: PointerEvent<HTMLDivElement>) => {
    if (pressed === h) fromPointer(h, e);
  };
  const up = () => setPressed(null);

  const keys = (h: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const small = e.shiftKey ? 0.1 : 0.01;
    const t = curve[h * 2]!;
    const m = curve[h * 2 + 1]!;
    let next: [number, number] | null = null;
    let along: 'time' | 'movement' = 'time';
    if (e.key === 'ArrowRight') next = [t + small, m];
    else if (e.key === 'ArrowLeft') next = [t - small, m];
    else if (e.key === 'Home') next = [0, m];
    else if (e.key === 'End') next = [1, m];
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') (next = [t, m + (e.key === 'PageUp' ? 0.1 : small)]), (along = 'movement');
    else if (e.key === 'ArrowDown' || e.key === 'PageDown') (next = [t, m - (e.key === 'PageDown' ? 0.1 : small)]), (along = 'movement');
    if (!next) return;
    e.preventDefault();
    setHandle(h, next[0], next[1]);
    if (axis[h] !== along) {
      const both = [...axis] as typeof axis;
      both[h] = along;
      setAxis(both);
      inputs.current[h * 2 + (along === 'time' ? 0 : 1)]?.focus();
    }
  };

  const { top, bottom } = reach(curve);
  const limit = top > 1.005 ? top : bottom < -0.005 ? bottom : null;
  const [x1, y1, x2, y2] = curve;
  const said = (h: number) => `${w.time} ${round(curve[h * 2]!)}, ${w.movement} ${round(curve[h * 2 + 1]!)}`;

  return (
    <div ref={ref} role="group" {...rest} className={cx(curveEditor(), className)}>
      <div ref={plot} className={curveEditor.part('plot')} dir="ltr">
        <svg className={curveEditor.part('drawing')} viewBox={`0 0 ${BOX} ${BOX}`} focusable="false" aria-hidden="true">
          <rect className={curveEditor.part('square')} x={LEFT} y={py(1)} width={UNIT} height={UNIT} />
          <line className={curveEditor.part('line')} x1={px(0)} y1={py(0)} x2={px(1)} y2={py(1)} />
          {limit !== null && <line className={curveEditor.part('limit')} x1={px(0)} y1={py(limit)} x2={px(1)} y2={py(limit)} />}
          <line className={curveEditor.part('arm')} x1={px(0)} y1={py(0)} x2={px(x1)} y2={py(y1)} />
          <line className={curveEditor.part('arm')} x1={px(1)} y1={py(1)} x2={px(x2)} y2={py(y2)} />
          <path className={curveEditor.part('curve')} d={`M ${px(0)} ${py(0)} C ${px(x1)} ${py(y1)} ${px(x2)} ${py(y2)} ${px(1)} ${py(1)}`} />
        </svg>
        {w.handles.map((name, h) => (
          <div
            key={h}
            className={curveEditor.part('handle')}
            style={{ left: `${(px(curve[h * 2]!) / BOX) * 100}%`, top: `${(py(curve[h * 2 + 1]!) / BOX) * 100}%` }}
            data-pressed={pressed === h || undefined}
            onPointerDown={down(h)}
            onPointerMove={move(h)}
            onPointerUp={up}
            onPointerCancel={up}
          >
            {(['time', 'movement'] as const).map((which, along) => (
              <input
                key={which}
                ref={(el) => {
                  inputs.current[h * 2 + along] = el;
                }}
                type="range"
                min={which === 'time' ? 0 : CURVE_LIMITS.low}
                max={which === 'time' ? 1 : CURVE_LIMITS.high}
                step={0.01}
                value={curve[h * 2 + along]}
                disabled={disabled}
                tabIndex={axis[h] === which ? 0 : -1}
                aria-label={`${name}, ${w[which]}`}
                aria-valuetext={said(h)}
                aria-orientation={which === 'time' ? 'horizontal' : 'vertical'}
                onKeyDown={keys(h)}
                onFocus={() => {
                  if (axis[h] !== which) {
                    const both = [...axis] as typeof axis;
                    both[h] = which;
                    setAxis(both);
                  }
                }}
                onChange={(e) => {
                  const v = Number(e.currentTarget.value);
                  setHandle(h, which === 'time' ? v : curve[h * 2]!, which === 'movement' ? v : curve[h * 2 + 1]!);
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {!hideNumbers && (
        <div className={curveEditor.part('numbers')}>
          {curve.map((n, i) => (
            <NumberField
              key={i}
              size="sm"
              hideButtons
              value={n}
              min={i % 2 === 0 ? 0 : CURVE_LIMITS.low}
              max={i % 2 === 0 ? 1 : CURVE_LIMITS.high}
              step={0.01}
              formatOptions={{ maximumFractionDigits: 2 }}
              disabled={disabled}
              aria-label={w.numbers[i]}
              onChange={(v) => {
                if (v === null) return;
                const next = [...curve] as Curve;
                next[i] = v;
                set(next);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
