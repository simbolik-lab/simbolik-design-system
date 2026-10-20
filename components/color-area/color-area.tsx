import { useRef, type Ref } from 'react';
import { useColorArea, useObjectRef } from 'react-aria';
import { useColorAreaState, type Color, type ColorChannel, type ColorSpace } from 'react-stately';
import { colorArea } from './color-area.manifest.js';
import type { ColorValue } from '../color.js';
import { cx } from '../variants.js';

export type ColorAreaProps = ColorAreaOwnProps & ColorValue;

export interface ColorAreaOwnProps {
  /** Called with the new color as the thumb moves. */
  onChange?: (color: Color) => void;
  /** Called with the new color once the reader lets go of the thumb, or after a key. */
  onChangeEnd?: (color: Color) => void;
  /** The color space the two channels are counted in. HSB unless given. */
  colorSpace?: ColorSpace;
  /** The channel across. Saturation unless given. */
  xChannel?: ColorChannel;
  /** The channel up. Brightness unless given. */
  yChannel?: ColorChannel;
  disabled?: boolean;
  /** Sends the channel across with the form under this name. */
  xName?: string;
  /** Sends the channel up with the form under this name. */
  yName?: string;
  form?: string;
  /** The area's name, read with each channel, such as “Brand color”. Without it, each input is named “Color picker”. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  className?: string;
  /** Reaches the area's square. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Color area: a square for two channels of a color. Its behaviour is React Aria's color area: two hidden range inputs in the
 * thumb, one per channel, take the keys (Left and Right step the channel across, Up and Down the channel up; Page Up and
 * Page Down take larger steps) and tell a screen reader each channel's value and the color in words; a press anywhere on the
 * square moves the thumb there and dragging moves it on. The area is one stop in the Tab order.
 */
export function ColorArea({
  value, defaultValue, onChange, onChangeEnd, colorSpace = 'hsb', xChannel = 'saturation', yChannel = 'brightness', disabled, xName, yName, form,
  className, ref, ...aria
}: ColorAreaProps) {
  const state = useColorAreaState({ value, defaultValue, onChange, onChangeEnd, colorSpace, xChannel, yChannel, isDisabled: disabled });
  const container = useObjectRef(ref);
  const inputX = useRef<HTMLInputElement>(null);
  const inputY = useRef<HTMLInputElement>(null);
  const { colorAreaProps, thumbProps, xInputProps, yInputProps } = useColorArea(
    { ...aria, xChannel, yChannel, colorSpace, isDisabled: disabled, xName, yName, form, containerRef: container, inputXRef: inputX, inputYRef: inputY },
    state,
  );
  const { style: areaStyle, ...area } = colorAreaProps;
  const { background, backgroundBlendMode, ...areaRest } = areaStyle ?? {};
  return (
    <div
      ref={container}
      {...area}
      style={disabled ? areaRest : { ...areaRest, background, backgroundBlendMode }}
      className={cx(colorArea(), className)}
    >
      <div
        {...thumbProps}
        className={`smbk-color-thumb ${colorArea.part('thumb')}`}
        style={{ ...thumbProps.style, backgroundColor: disabled ? undefined : state.getDisplayColor().toString('css') }}
        data-pressed={state.isDragging || undefined}
        data-disabled={disabled || undefined}
      >
        <input ref={inputX} {...xInputProps} />
        <input ref={inputY} {...yInputProps} />
      </div>
    </div>
  );
}
