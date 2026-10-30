'use client';

import { useMemo, useState, type HTMLAttributes, type KeyboardEvent, type Ref } from 'react';
import { useLocale, useObjectRef } from 'react-aria';
import { parseColor, type Color } from 'react-stately';
import { colorSwatchPicker } from './color-swatch-picker.manifest.js';
import { ColorSwatch } from '../color-swatch/color-swatch.js';
import type { ColorInput } from '../color.js';
import { cx } from '../variants.js';
import { useControllable } from '../controllable.js';
import type { VariantProps } from '../variants.js';

/** One color to pick: the color alone, or with its name and whether it can be picked. */
export type ColorSwatchPickerOption = ColorInput | { color: ColorInput; /** Its name, read in place of the one made from its value. */ name?: string; disabled?: boolean };

export interface ColorSwatchPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'color'>, VariantProps<typeof colorSwatchPicker.manifest> {
  /** The colors, in order. */
  colors: ColorSwatchPickerOption[];
  /** The chosen color, when the page holds it; null for none. Pair it with onChange. */
  value?: ColorInput | null;
  /** The color chosen first, when the picker holds its own. None unless given. */
  defaultValue?: ColorInput | null;
  /** Called with the color picked. */
  onChange?: (color: Color) => void;
  /** Every color is out of reach. */
  disabled?: boolean;
  /** Reaches the list. */
  ref?: Ref<HTMLDivElement>;
}

const read = (c: ColorInput): Color => (typeof c === 'string' ? parseColor(c) : c);
const same = (a: Color | null, b: Color | null) => a !== null && b !== null && a.toString('hexa') === b.toString('hexa');

/**
 * Color swatch picker: a list of colors to choose one from. A listbox: one stop in the Tab order, on the chosen color or
 * else the first; the arrow keys move between colors (Up and Down to the color above or below in the wrapped rows), Home and
 * End to the first and last, and Space or Enter picks the one with focus, as a press does. Each color is an option named in
 * words, such as “vibrant red”, or by the name given; the chosen one is selected.
 */
export function ColorSwatchPicker({ colors, value, defaultValue = null, onChange, disabled, shape, size, className, onKeyDown, ref, ...rest }: ColorSwatchPickerProps) {
  const { locale, direction } = useLocale();
  const options = useMemo(
    () => colors.map((o) => (typeof o === 'object' && 'color' in o ? { color: read(o.color), name: o.name, disabled: o.disabled } : { color: read(o), name: undefined, disabled: false })),
    [colors],
  );
  const [chosen, keep] = useControllable<Color | null>({ value: value === undefined ? undefined : value === null ? null : read(value), defaultValue: () => (defaultValue == null ? null : read(defaultValue)), onChange, name: 'ColorSwatchPicker value' });
  const list = useObjectRef(ref);
  const reachable = (i: number) => !disabled && !options[i]?.disabled;
  const chosenAt = options.findIndex((o) => same(o.color, chosen));
  const firstReachable = options.findIndex((_, i) => reachable(i));
  const [focusAt, setFocusAt] = useState(-1);
  // The one Tab stop: the color last focused, else the chosen one, else the first that can be picked.
  const stop = focusAt >= 0 && reachable(focusAt) ? focusAt : chosenAt >= 0 && reachable(chosenAt) ? chosenAt : firstReachable;

  const pick = (i: number) => {
    if (!reachable(i)) return;
    const c = options[i]!.color;
    keep(c);
  };

  const items = () => Array.from(list.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
  const go = (i: number) => {
    if (i < 0 || i >= options.length) return;
    setFocusAt(i);
    items()[i]?.focus();
  };
  const step = (from: number, by: number) => {
    for (let i = from + by; i >= 0 && i < options.length; i += by) if (reachable(i)) return i;
    return -1;
  };
  // The color in the row above or below whose middle is nearest across.
  const vertical = (from: number, down: boolean) => {
    const els = items();
    const here = els[from]?.getBoundingClientRect();
    if (!here) return -1;
    let best = -1;
    let bestRow = Infinity;
    let bestAcross = Infinity;
    els.forEach((el, i) => {
      if (!reachable(i)) return;
      const r = el.getBoundingClientRect();
      const rowGap = down ? r.top - here.bottom : here.top - r.bottom;
      if (rowGap < -1) return;
      const across = Math.abs(r.left + r.width / 2 - (here.left + here.width / 2));
      if (rowGap < bestRow - 1 || (Math.abs(rowGap - bestRow) <= 1 && across < bestAcross)) {
        best = i;
        bestRow = rowGap;
        bestAcross = across;
      }
    });
    return best;
  };

  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    const at = items().indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    const forward = direction === 'rtl' ? -1 : 1;
    let to = -2;
    if (e.key === 'ArrowRight') to = step(at, forward);
    else if (e.key === 'ArrowLeft') to = step(at, -forward);
    else if (e.key === 'ArrowDown') to = vertical(at, true);
    else if (e.key === 'ArrowUp') to = vertical(at, false);
    else if (e.key === 'Home') to = step(-1, 1);
    else if (e.key === 'End') to = step(options.length, -1);
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      pick(at);
      return;
    }
    if (to === -2) return;
    e.preventDefault();
    go(to);
  };

  const swatchSize = size === 'sm' ? 'xs' : 'md';
  return (
    <div
      ref={list}
      role="listbox"
      aria-orientation="horizontal"
      aria-disabled={disabled || undefined}
      {...rest}
      className={cx(colorSwatchPicker({ shape, size }), className)}
      onKeyDown={keys}
    >
      {options.map((o, i) => (
        <div
          key={`${i}-${o.color.toString('hexa')}`}
          role="option"
          aria-selected={same(o.color, chosen)}
          aria-disabled={!reachable(i) || undefined}
          aria-label={o.name ?? o.color.getColorName(locale)}
          tabIndex={i === stop ? 0 : -1}
          className={colorSwatchPicker.part('item')}
          onFocus={() => setFocusAt(i)}
          onClick={() => pick(i)}
        >
          <ColorSwatch color={o.color} size={swatchSize} shape={shape} decorative />
        </div>
      ))}
    </div>
  );
}
