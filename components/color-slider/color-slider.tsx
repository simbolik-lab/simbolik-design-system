'use client';

import { useRef, type Ref } from 'react';
import { useColorSlider, useLocale, useObjectRef } from 'react-aria';
import { useColorSliderState, type Color, type ColorSpace } from 'react-stately';
import { colorSlider } from './color-slider.manifest.js';
import type { ColorValue } from '../color.js';
import { Label } from '../label/label.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export type ColorSliderProps = ColorSliderOwnProps & ColorValue;

export interface ColorSliderOwnProps extends VariantProps<typeof colorSlider.manifest> {
  /** Called with the new color as the thumb moves. */
  onChange?: (color: Color) => void;
  /** Called with the new color once the reader lets go of the thumb, or after a key. */
  onChangeEnd?: (color: Color) => void;
  /**
   * The color space the channel is counted in. HSL unless given; the color picker counts hue in HSB, the space of its
   * color area. The color reported is in this space.
   */
  colorSpace?: ColorSpace;
  /** The label in the top row. The channel's own name unless given: “Hue”, “Opacity”, “Saturation” or “Lightness”. */
  label?: string;
  /** Hides the whole top row, as Figma's Label switch does. The label still names the slider for screen readers. */
  hideLabel?: boolean;
  /** Hides the value at the end of the top row. */
  hideValue?: boolean;
  disabled?: boolean;
  /** Sends the channel's value with the form under this name. */
  name?: string;
  form?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  className?: string;
  /** Reaches the hidden range input, the part that takes focus. */
  ref?: Ref<HTMLInputElement>;
}

const NAMES = { hue: 'Hue', alpha: 'Opacity', saturation: 'Saturation', lightness: 'Lightness' } as const;

/**
 * Color slider: one channel of a color along a strip. Its behaviour is React Aria's color slider: a hidden range input in the
 * thumb takes the keys (Left and Right, or Up and Down, step it; Page Up and Page Down take larger steps; Home and End go to
 * the ends) and tells a screen reader the label, the value and the color in words, such as “Hue, 225°, blue”; a press on
 * the strip moves the thumb there and dragging moves it on.
 */
export function ColorSlider({
  channel = 'hue', size, value, defaultValue, onChange, onChangeEnd, colorSpace, label, hideLabel, hideValue, disabled, name, form, id,
  className, ref, ...aria
}: ColorSliderProps) {
  const { locale } = useLocale();
  const space = colorSpace ?? (channel === 'alpha' ? undefined : 'hsl');
  const state = useColorSliderState({ channel, colorSpace: space, value, defaultValue, onChange, onChangeEnd, isDisabled: disabled, locale });
  const rail = useRef<HTMLDivElement>(null);
  const input = useObjectRef(ref);
  const text = label ?? NAMES[channel];
  const named = aria['aria-label'] ?? aria['aria-labelledby'];
  const { trackProps, thumbProps, inputProps, labelProps, outputProps } = useColorSlider(
    {
      channel, colorSpace: space, isDisabled: disabled, name, form, id, trackRef: rail, inputRef: input,
      label: hideLabel || named ? undefined : text,
      'aria-label': aria['aria-label'] ?? (hideLabel && !aria['aria-labelledby'] ? text : undefined),
      'aria-labelledby': aria['aria-labelledby'],
      'aria-describedby': aria['aria-describedby'],
    },
    state,
  );
  const { style: trackStyle, ...track } = trackProps;
  const { background, ...trackRest } = trackStyle ?? {};
  // Figma draws the opacity thumb in the color at full strength; the others show the color the channel points at.
  const shown = channel === 'alpha' ? state.value.withChannelValue('alpha', 1) : state.getDisplayColor();
  // The value as the label row shows it: hue, saturation and lightness in whole steps, opacity as a whole percentage.
  const raw = state.value.getChannelValue(channel);
  const shownValue = state.value.withChannelValue(channel, channel === 'alpha' ? Math.round(raw * 100) / 100 : Math.round(raw)).formatChannelValue(channel, locale);
  const classes = cx(colorSlider({ channel, size }), className);
  return (
    <div className={classes}>
      {!hideLabel && (
        <div className={colorSlider.part('header')}>
          {!named && (
            <Label tone="strong" {...labelProps} className={colorSlider.part('label')}>
              {text}
            </Label>
          )}
          {!hideValue && (
            <output {...outputProps} className={colorSlider.part('value')}>
              {shownValue}
            </output>
          )}
        </div>
      )}
      <div {...track} style={trackRest} className={colorSlider.part('track')}>
        {channel === 'alpha' && !disabled && <span className="smbk-color-checker" />}
        <span className={colorSlider.part('gradient')} style={disabled ? undefined : { background }} />
        <div ref={rail} className={colorSlider.part('rail')}>
          <div
            {...thumbProps}
            className={`smbk-color-thumb smbk-color-thumb--size-${size === 'sm' ? 'sm' : 'md'} ${colorSlider.part('thumb')}`}
            style={{ ...thumbProps.style, backgroundColor: disabled ? undefined : shown.toString('css') }}
            data-pressed={state.isThumbDragging(0) || undefined}
            data-disabled={disabled || undefined}
          >
            <input ref={input} {...inputProps} />
          </div>
        </div>
      </div>
    </div>
  );
}
