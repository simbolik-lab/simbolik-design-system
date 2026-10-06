import { useId, useState, type ChangeEvent, type InputHTMLAttributes, type PointerEvent as ReactPointerEvent } from 'react';
import { slider } from './slider.manifest.js';
import type { VariantProps } from '../variants.js';
import { Label } from '../label/label.js';
import { Tooltip } from '../tooltip/tooltip.js';

interface SliderBaseProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'children'> {
  size?: VariantProps<typeof slider.manifest>['size'];
  /** The words above the slider, which are also its accessible name. */
  label: string;
  /** Hide the label (Figma's Label off). The words stay the accessible name. */
  hideLabel?: boolean;
  /** The current value at the end of the label row (Figma's Value). On unless turned off. */
  showValue?: boolean;
  /** The lowest and highest values under the lines (Figma's Min and Max). On unless turned off. */
  showBounds?: boolean;
  min?: number;
  max?: number;
  step?: number;
  /** Words for a value, unit included, such as (v) => `${v} m/s`. Used wherever a value is shown or read out. */
  format?: (value: number) => string;
  /** Goes on the block; every other prop goes on the input, or on both inputs of a range. */
  className?: string;
}

export interface SingleSliderProps extends SliderBaseProps {
  type?: 'single';
  /** A controlled value. Leave it out and pass defaultValue for the slider to keep its own. */
  value?: number;
  defaultValue?: number;
  onChange?: (value: number, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface RangeSliderProps extends SliderBaseProps {
  type: 'range';
  /** A controlled lowest and highest value. */
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  /** Words for the pair in the label row; by default both values, joined by a dash. */
  formatRange?: (low: number, high: number) => string;
  /** How each thumb is named after the label; by default "lowest" and "highest". */
  thumbNames?: [string, string];
}

export type SliderProps = SingleSliderProps | RangeSliderProps;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Slider: each thumb has a native range input, invisible, right after it; the
 * input does the keyboard, form and screen reader work. A single slider's
 * input also takes the pointer. A range's two inputs cannot share it, so the
 * rail takes it here: a press moves the nearer thumb there and a drag carries
 * it, and the two stop when they meet. The wrapper keeps the value and sets
 * the red window, the red lines' offset and each thumb's place as percentages.
 */
export function Slider(props: SliderProps) {
  const {
    size, label, hideLabel = false, showValue = true, showBounds = true,
    min = 0, max = 100, step = 1, format = String, className, id, disabled,
  } = props;
  const range = props.type === 'range';
  const auto = useId();
  const inputId = id ?? `${auto}-slider`;
  const span = max - min;
  const pct = (v: number) => (span > 0 ? Math.round(((v - min) / span) * 1e6) / 1e4 : 0);

  const [ownSingle, setOwnSingle] = useState(() => (props.type !== 'range' ? props.defaultValue ?? min : min));
  const [ownPair, setOwnPair] = useState<[number, number]>(() => (props.type === 'range' ? props.defaultValue ?? [min, max] : [min, max]));
  const [pressed, setPressed] = useState<number | null>(null);

  const values: number[] = range
    ? (() => {
        const [a, b] = (props as RangeSliderProps).value ?? ownPair;
        const lo = clamp(Math.min(a, b), min, max);
        return [lo, clamp(Math.max(a, b), lo, max)];
      })()
    : [clamp((props as SingleSliderProps).value ?? ownSingle, min, max)];

  const setPair = (index: number, next: number) => {
    const p = props as RangeSliderProps;
    const pair: [number, number] = [values[0]!, values[1]!];
    pair[index] = index === 0 ? Math.min(next, pair[1]) : Math.max(next, pair[0]);
    if (p.value === undefined) setOwnPair(pair);
    p.onChange?.(pair);
  };

  const decimals = (String(step).split('.')[1] ?? '').length;
  const snap = (v: number) => clamp(Number((Math.round((v - min) / step) * step + min).toFixed(decimals)), min, max);
  const valueAt = (rail: HTMLElement, clientX: number) => {
    const box = rail.getBoundingClientRect();
    const share = (clientX - box.left) / box.width;
    return snap(min + clamp(getComputedStyle(rail).direction === 'rtl' ? 1 - share : share, 0, 1) * span);
  };

  const rest = { ...props } as Record<string, unknown>;
  for (const key of ['size', 'type', 'label', 'hideLabel', 'showValue', 'showBounds', 'min', 'max', 'step', 'format', 'formatRange', 'thumbNames', 'value', 'defaultValue', 'onChange', 'className', 'id']) delete rest[key];

  const words = values.map(format);
  const shown = range
    ? ((props as RangeSliderProps).formatRange ?? ((lo: number, hi: number) => `${format(lo)} – ${format(hi)}`))(values[0]!, values[1]!)
    : words[0]!;
  const names = (props as RangeSliderProps).thumbNames ?? ['lowest', 'highest'];

  const low = range ? pct(values[0]!) : 0;
  const high = pct(values[values.length - 1]!);

  const railEvents = range && !disabled
    ? {
        onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => {
          if (event.button !== 0) return;
          event.preventDefault();
          const v = valueAt(event.currentTarget, event.clientX);
          const [a, b] = [values[0]!, values[1]!];
          const index = Math.abs(v - a) < Math.abs(v - b) ? 0 : Math.abs(v - a) > Math.abs(v - b) ? 1 : v > b ? 1 : 0;
          event.currentTarget.setPointerCapture(event.pointerId);
          setPressed(index);
          setPair(index, v);
          const input = event.currentTarget.querySelectorAll<HTMLInputElement>('input')[index];
          input?.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
        },
        onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => {
          if (pressed !== null) setPair(pressed, valueAt(event.currentTarget, event.clientX));
        },
        onPointerUp: () => setPressed(null),
        onPointerCancel: () => setPressed(null),
      }
    : {};

  return (
    <div className={[slider({ size, type: range ? 'range' : 'single' }), className].filter(Boolean).join(' ')}>
      {(!hideLabel || showValue) && (
        <div className={slider.part('header')}>
          {!hideLabel && (
            <Label htmlFor={inputId} className={slider.part('label')}>
              {label}
            </Label>
          )}
          {showValue && (
            <span className={slider.part('value')} aria-hidden="true">
              {shown}
            </span>
          )}
        </div>
      )}
      <div className={slider.part('body')}>
        <div className={slider.part('rail')} {...railEvents}>
          <span className={slider.part('track')} aria-hidden="true">
            <span className={slider.part('fill')} style={{ insetInlineStart: `${low}%`, width: `${high - low}%` }}>
              <span className={slider.part('lines')} style={{ insetInlineStart: `${-low}cqi` }} />
            </span>
          </span>
          {values.map((v, index) => [
            <span
              key={`thumb-${index}`}
              className={slider.part('thumb')}
              style={{ insetInlineStart: `${pct(v)}%` }}
              data-pressed={pressed === index ? '' : undefined}
              aria-hidden="true"
            >
              <Tooltip arrow="bottom-center" className={slider.part('bubble')} aria-hidden="true">
                {words[index]}
              </Tooltip>
            </span>,
            <input
              key={`input-${index}`}
              {...rest}
              type="range"
              id={index === 0 ? inputId : `${inputId}-high`}
              className={slider.part('control')}
              min={range && index === 1 ? values[0] : min}
              max={range && index === 0 ? values[1] : max}
              step={step}
              value={v}
              aria-valuetext={words[index]}
              aria-label={range ? `${label}, ${names[index]}` : hideLabel ? label : undefined}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const next = Number(event.target.value);
                if (range) {
                  setPair(index, next);
                  return;
                }
                const p = props as SingleSliderProps;
                if (p.value === undefined) setOwnSingle(next);
                p.onChange?.(next, event);
              }}
            />,
          ])}
        </div>
        {showBounds && (
          <div className={slider.part('bounds')} aria-hidden="true">
            <span>{format(min)}</span>
            <span>{format(max)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
