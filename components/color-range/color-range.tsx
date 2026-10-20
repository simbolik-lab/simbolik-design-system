import { useId, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent, type Ref } from 'react';
import { useLocale } from 'react-aria';
import { colorRange } from './color-range.manifest.js';
import { ColorSwatch } from '../color-swatch/color-swatch.js';
import { contrastRatio, readColor, type ColorInput } from '../color.js';
import { cx } from '../variants.js';
import { useControllable } from '../controllable.js';
import type { VariantProps } from '../variants.js';

/** One step of a range: its name, such as "600", and its color. */
export interface ColorRangeStepData {
  name: string;
  color: ColorInput;
}

export interface ColorRangeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'title'>, VariantProps<typeof colorRange.manifest> {
  /** The range's name, such as "Brand". It names the strip for screen readers too. */
  name: string;
  /** The steps, lightest first as a range is usually written. */
  steps: ColorRangeStepData[];
  /** The step in use, by its name, when the page holds it. */
  value?: string | null;
  /** The step in use first, when the range holds its own. */
  defaultValue?: string | null;
  /**
   * Called with the step's name when the reader picks one. Given it, the strip is a list to pick from: one stop in the Tab
   * order, the arrow keys move between steps, Space or Enter picks. Without it, the strip only shows the range.
   */
  onChange?: (step: string) => void;
  /** The color the ratios are counted against. White unless given. */
  against?: ColorInput;
  /** The line beside the name. "11 steps · 600 in use" unless given. */
  meta?: string;
  /** Leaves out the name row (Figma's Name switch). The name still names the strip. */
  hideName?: boolean;
  /** Leaves out the ratio under each step (Figma's Ratio switch). */
  hideRatios?: boolean;
  /** What a screen reader hears for a step's ratio, given it with one decimal: "contrast 4.5 to 1" unless given, for a page in another language. */
  contrastLabel?: (ratio: string) => string;
  ref?: Ref<HTMLDivElement>;
}

const englishContrast = (ratio: string) => `contrast ${ratio} to 1`;

/** A ratio written as Figma writes the range's: one decimal, never rounded up past what it is. */
const oneDecimal = (r: number) => (Math.floor(r * 10) / 10).toFixed(1);

/**
 * Color range: a strip of a range's steps, each with its swatch, its name and its contrast against white (or the color
 * given). The step in use is ringed. Given onChange, the reader can pick a step: a listbox with one Tab stop, the arrow keys
 * and Home and End move, Space or Enter picks, as a press does. Each step is told in words: its name, its color and its
 * contrast.
 */
export function ColorRange({ name, steps, value, defaultValue = null, onChange, against = '#ffffff', meta, hideName, hideRatios, contrastLabel = englishContrast, className, ref, ...rest }: ColorRangeProps) {
  const { locale, direction } = useLocale();
  const titleId = useId();
  const [chosen, keep] = useControllable<string | null>({ value, defaultValue, onChange, name: 'ColorRange value' });
  const pickable = Boolean(onChange);
  const read = useMemo(
    () => steps.map((s) => {
      const color = readColor(s.color);
      const ratio = contrastRatio(color, against);
      return { ...s, colorObj: color, ratio: oneDecimal(ratio) };
    }),
    [steps, against],
  );
  const chosenAt = read.findIndex((s) => s.name === chosen);
  const [focusAt, setFocusAt] = useState(-1);
  const stop = focusAt >= 0 ? focusAt : Math.max(chosenAt, 0);
  const list = useRef<HTMLDivElement | null>(null);

  const pick = (i: number) => {
    const s = read[i];
    if (!s) return;
    keep(s.name);
  };
  const go = (i: number) => {
    if (i < 0 || i >= read.length) return;
    setFocusAt(i);
    list.current?.querySelectorAll<HTMLElement>('[role="option"]')[i]?.focus();
  };
  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    const at = Array.from(list.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []).indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    const forward = direction === 'rtl' ? -1 : 1;
    let to = -2;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = at + (e.key === 'ArrowDown' ? 1 : forward);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = at - (e.key === 'ArrowUp' ? 1 : forward);
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = read.length - 1;
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      pick(at);
      return;
    }
    if (to === -2) return;
    e.preventDefault();
    go(Math.min(read.length - 1, Math.max(0, to)));
  };

  const line = meta ?? `${steps.length} steps${chosen ? ` · ${chosen} in use` : ''}`;
  const said = (s: (typeof read)[number]) => contrastLabel(s.ratio);
  const named = hideName ? { 'aria-label': name } : { 'aria-labelledby': titleId };
  const setRef = (el: HTMLDivElement | null) => {
    list.current = el;
  };

  const items = read.map((s, i) => {
    const inUse = s.name === chosen;
    const inner = (
      <>
        <ColorSwatch color={s.colorObj} decorative className={colorRange.part('swatch')} />
        <span className={colorRange.part('name')}>{s.name}</span>
        {!hideRatios && <span className={colorRange.part('ratio')} aria-hidden={pickable || undefined}>{s.ratio}:1</span>}
      </>
    );
    if (pickable) {
      return (
        <div
          key={`${i}-${s.name}`}
          role="option"
          aria-selected={inUse}
          aria-label={`${s.name}, ${s.colorObj.getColorName(locale)}${hideRatios ? '' : `, ${said(s)}`}`}
          tabIndex={i === stop ? 0 : -1}
          className={colorRange.part('step')}
          onFocus={() => setFocusAt(i)}
          onClick={() => pick(i)}
        >
          {inner}
        </div>
      );
    }
    return (
      <li key={`${i}-${s.name}`} className={colorRange.part('step')} aria-current={inUse || undefined}>
        <span className={colorRange.part('hidden')}>{s.colorObj.getColorName(locale)}, </span>
        <ColorSwatch color={s.colorObj} decorative className={colorRange.part('swatch')} />
        <span className={colorRange.part('name')}>{s.name}</span>
        {!hideRatios && (
          <span className={colorRange.part('ratio')}>
            <span aria-hidden="true">{s.ratio}:1</span>
            <span className={colorRange.part('hidden')}>, {said(s)}</span>
          </span>
        )}
      </li>
    );
  });

  return (
    <div ref={ref} {...rest} className={cx(colorRange(), className)}>
      {!hideName && (
        <div className={colorRange.part('head')}>
          <span id={titleId} className={colorRange.part('title')}>{name}</span>
          <span className={colorRange.part('meta')}>{line}</span>
        </div>
      )}
      {pickable ? (
        <div ref={setRef} role="listbox" aria-orientation="horizontal" {...named} className={colorRange.part('steps')} onKeyDown={keys}>
          {items}
        </div>
      ) : (
        <ol className={colorRange.part('steps')} {...named}>
          {items}
        </ol>
      )}
    </div>
  );
}
