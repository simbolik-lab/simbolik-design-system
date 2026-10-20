import { useId, useState, type ChangeEvent, type InputHTMLAttributes, type PointerEvent as ReactPointerEvent } from 'react';
import { useLocale, useNumberField, useObjectRef } from 'react-aria';
import { useNumberFieldState } from 'react-stately';
import { slider } from './slider.manifest.js';
import { cx } from '../variants.js';
import { useControllable } from '../controllable.js';
import type { VariantProps } from '../variants.js';
import { Input } from '../input/input.js';
import { OutsideField } from '../field/field-context.js';
import { Label } from '../label/label.js';
import { Tooltip } from '../tooltip/tooltip.js';

interface SliderBaseProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'children'> {
  /** Ticks, the default: fine lines on a band; standard: a thin line with a round thumb; fill: a thick filled bar with a thin handle. */
  look?: VariantProps<typeof slider.manifest>['look'];
  size?: VariantProps<typeof slider.manifest>['size'];
  /** The words above the slider, which are also its accessible name. */
  label: string;
  /** Hide the label row, the value in it included (Figma's Label off). The words stay the accessible name, and the bubble shows the value on keyboard focus. */
  hideLabel?: boolean;
  /** The current value at the end of the label row (Figma's Value). On unless turned off; hidden with the row. */
  showValue?: boolean;
  /** The lowest and highest values under the lines (Figma's Min and Max). On unless turned off. */
  showBounds?: boolean;
  /** The fill look's fine marks between the lowest and highest values (Figma's Marks). On unless turned off; shown with the bounds. */
  showMarks?: boolean;
  /** A small number box beside the slider, one at each end for a range, to type an exact value (Figma's Number box). Off unless turned on. */
  numberBox?: boolean;
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
  /** Called with the new value; the event is the range input's, and is left out when the value was typed in the number box. */
  onChange?: (value: number, event?: ChangeEvent<HTMLInputElement>) => void;
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

interface NumberBoxProps {
  value: number;
  min: number;
  max: number;
  step: number;
  name: string;
  disabled?: boolean;
  describedBy?: string;
  onCommit: (value: number) => void;
}

/**
 * The number box: the input's small well around React Aria's number field, as the number field component uses it,
 * without its buttons. It shows the slider's value as a bare number, reads a typed one the way the reader's language
 * writes numbers, and settles it on Enter or on leaving the box: kept between its limits and rounded to the step, or
 * put back when it is not a number. The up and down arrow keys step it, as they step the slider.
 */
function NumberBox({ value, min, max, step, name, disabled, describedBy, onCommit }: NumberBoxProps) {
  const reader = useLocale().locale;
  const options = {
    value, minValue: min, maxValue: max, step, isDisabled: disabled, isWheelDisabled: true,
    'aria-label': name, 'aria-describedby': describedBy,
    onChange: (next: number) => {
      if (!Number.isNaN(next)) onCommit(next);
    },
  };
  const state = useNumberFieldState({ ...options, locale: reader });
  const control = useObjectRef<HTMLInputElement>(null);
  const { inputProps } = useNumberField(options, state, control);
  // The box is the slider's own, never the control of a field around the slider.
  return (
    <OutsideField>
      <Input ref={control} {...inputProps} size="sm" className={slider.part('number')} />
    </OutsideField>
  );
}

/**
 * Slider: each thumb has a native range input, invisible, right after it; the
 * input does the keyboard, form and screen reader work. A single slider's
 * input also takes the pointer. A range's two inputs cannot share it, so the
 * rail takes it here: a press moves the nearer thumb there and a drag carries
 * it, and the two stop when they meet. The wrapper keeps the value and sets
 * the red window, the red lines' offset and each thumb's place as percentages.
 * With numberBox, a number box beside the rail (one at each end for a range)
 * shows the same value and takes a typed one.
 */
export function Slider(props: SliderProps) {
  const {
    look, size, label, hideLabel = false, showValue = true, showBounds = true, showMarks = true, numberBox = false,
    min = 0, max = 100, step = 1, format = String, className, id, disabled,
  } = props;
  const range = props.type === 'range';
  const auto = useId();
  const inputId = id ?? `${auto}-slider`;
  const span = max - min;
  const pct = (v: number) => (span > 0 ? Math.round(((v - min) / span) * 1e6) / 1e4 : 0);

  // One value or a pair, each the page's or the slider's own; the one the type does not use stays at its start.
  const [single, keepSingle] = useControllable<number>({ value: range ? undefined : (props as SingleSliderProps).value, defaultValue: () => (props.type !== 'range' ? props.defaultValue ?? min : min), name: 'Slider value' });
  const [pairNow, keepPair] = useControllable<[number, number]>({ value: range ? (props as RangeSliderProps).value : undefined, defaultValue: () => (props.type === 'range' ? props.defaultValue ?? [min, max] : [min, max]), onChange: range ? (props as RangeSliderProps).onChange : undefined, name: 'Slider value' });
  const [pressed, setPressed] = useState<number | null>(null);

  const values: number[] = range
    ? (() => {
        const [a, b] = pairNow;
        const lo = clamp(Math.min(a, b), min, max);
        return [lo, clamp(Math.max(a, b), lo, max)];
      })()
    : [clamp(single, min, max)];

  const setPair = (index: number, next: number) => {
    const pair: [number, number] = [values[0]!, values[1]!];
    pair[index] = index === 0 ? Math.min(next, pair[1]) : Math.max(next, pair[0]);
    keepPair(pair);
  };

  const decimals = (String(step).split('.')[1] ?? '').length;
  const snap = (v: number) => clamp(Number((Math.round((v - min) / step) * step + min).toFixed(decimals)), min, max);
  const valueAt = (rail: HTMLElement, clientX: number) => {
    const box = rail.getBoundingClientRect();
    const share = (clientX - box.left) / box.width;
    return snap(min + clamp(getComputedStyle(rail).direction === 'rtl' ? 1 - share : share, 0, 1) * span);
  };

  const rest = { ...props } as Record<string, unknown>;
  for (const key of ['look', 'size', 'type', 'label', 'hideLabel', 'showValue', 'showBounds', 'showMarks', 'numberBox', 'min', 'max', 'step', 'format', 'formatRange', 'thumbNames', 'value', 'defaultValue', 'onChange', 'className', 'id']) delete rest[key];

  const words = values.map(format);
  const shown = range
    ? ((props as RangeSliderProps).formatRange ?? ((lo: number, hi: number) => `${format(lo)} – ${format(hi)}`))(values[0]!, values[1]!)
    : words[0]!;
  const names = (props as RangeSliderProps).thumbNames ?? ['lowest', 'highest'];

  const low = range ? pct(values[0]!) : 0;
  const high = pct(values[values.length - 1]!);

  /** A new value for one thumb, from its input or its number box. */
  const setValue = (index: number, next: number, event?: ChangeEvent<HTMLInputElement>) => {
    if (range) {
      setPair(index, next);
      return;
    }
    keepSingle(next);
    (props as SingleSliderProps).onChange?.(next, event);
  };
  const box = (index: number) => (
    <NumberBox
      key={`number-${index}`}
      value={values[index]!}
      min={range && index === 1 ? values[0]! : min}
      max={range && index === 0 ? values[1]! : max}
      step={step}
      name={range ? `${label}, ${names[index]}` : label}
      disabled={disabled}
      describedBy={rest['aria-describedby'] as string | undefined}
      onCommit={(next) => setValue(index, next)}
    />
  );

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

  const body = (
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
            onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(index, Number(event.target.value), event)}
          />,
        ])}
      </div>
      {showBounds && (
        <div className={slider.part('bounds')} aria-hidden="true">
          <span>{format(min)}</span>
          {look === 'fill' && showMarks && <span className={slider.part('marks')} />}
          <span>{format(max)}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className={cx(slider({ look, size, type: range ? 'range' : 'single' }), className)} aria-disabled={disabled || undefined}>
      {!hideLabel && (
        <div className={slider.part('header')}>
          <Label htmlFor={inputId} className={slider.part('label')}>
            {label}
          </Label>
          {showValue && (
            <span className={slider.part('value')} aria-hidden="true">
              {shown}
            </span>
          )}
        </div>
      )}
      {numberBox ? (
        <div className={slider.part('row')}>
          {range && box(0)}
          {body}
          {box(range ? 1 : 0)}
        </div>
      ) : body}
    </div>
  );
}
