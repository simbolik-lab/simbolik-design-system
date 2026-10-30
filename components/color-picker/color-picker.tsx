'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type Ref } from 'react';
import { useLocale } from 'react-aria';
import { parseColor, useColorPickerState, type Color, type ColorPickerState } from 'react-stately';
import { colorPicker } from './color-picker.manifest.js';
import { input } from '../input/input.manifest.js';
import { select } from '../select/select.manifest.js';
import { Popover } from '../popover/popover.js';
import { useControllable } from '../controllable.js';
import { useFormReset } from '../form.js';
import { ColorSwatch } from '../color-swatch/color-swatch.js';
import { ColorArea } from '../color-area/color-area.js';
import { ColorSlider } from '../color-slider/color-slider.js';
import { ColorField } from '../color-field/color-field.js';
import { ColorSwatchPicker, type ColorSwatchPickerOption } from '../color-swatch-picker/color-swatch-picker.js';
import { Select } from '../select/select.js';
import { OutsideField } from '../field/field-context.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { Icon } from '../icon/icon.js';
import type { ColorValue } from '../color.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/** What the panel holds: Figma's four switches, and its name. */
export interface ColorPickerPanelOptions {
  /** The opacity slider. On unless turned off; off, every color chosen is fully opaque only if the page's colors are. */
  showOpacity?: boolean;
  /** The format menu before the code. On unless turned off; the code is written in hex. */
  showFormat?: boolean;
  /** The eyedropper button, which picks a color from anywhere on the screen. On unless turned off; shown only in a browser that has an eyedropper. */
  showEyedropper?: boolean;
  /** Colors to pick from at the foot of the panel, such as saved colors. None unless given. */
  swatches?: ColorSwatchPickerOption[];
  /** The panel's name. “Color picker” unless given. */
  panelLabel?: string;
  /**
   * The names the panel gives its parts, each in English unless given, for a page in another language. The hue
   * slider: “Hue”.
   */
  hueLabel?: string;
  /** The opacity slider: “Opacity”. */
  opacityLabel?: string;
  /** The format menu: “Color format”. */
  formatLabel?: string;
  /** The code field: “Color code”. */
  codeLabel?: string;
  /** The eyedropper button: “Pick a color from the screen”. */
  eyedropperLabel?: string;
  /** The swatches at the foot: “Saved colors”. */
  swatchesLabel?: string;
}

export type ColorPickerProps = ColorPickerOwnProps & ColorValue;

export interface ColorPickerOwnProps extends VariantProps<typeof colorPicker.manifest>, ColorPickerPanelOptions {
  /** Called with the new color as it changes in the panel. */
  onChange?: (color: Color) => void;
  /** The panel shows. Pair it with onOpenChange to hold it; otherwise the picker holds its own. */
  open?: boolean;
  /** Shown at first, when the picker holds its own open state. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** The color can be read, not changed: the panel does not open. */
  readOnly?: boolean;
  /** Sends the color with the form under this name, as a hex code with its opacity. */
  name?: string;
  form?: string;
  id?: string;
  /** The trigger's name before the color, such as “Brand color”. “Color” unless given or named by a label. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  required?: boolean;
  className?: string;
  /** Reaches the trigger, the button that opens the panel. */
  ref?: Ref<HTMLButtonElement>;
}

interface EyeDropperResult { sRGBHex: string }
interface EyeDropperLike { open(): Promise<EyeDropperResult> }
type EyeDropperWindow = Window & { EyeDropper?: new () => EyeDropperLike };

const FORMATS = [{ value: 'hex', label: 'Hex' }];

/**
 * Color picker: a trigger that shows the color, and the panel it opens. The color is held by React Aria's color picker state
 * and shared by every part of the panel: the color area (saturation and brightness), the hue slider, the opacity slider, the
 * color field and the swatches, so a change in one shows in all. The trigger is one button, named by its label and the color,
 * the code and its name in words, such as “Brand color, #3E63DD, vibrant blue”. Enter, Space or the down arrow open the panel
 * (a dialog named “Color picker”), and focus stays on the trigger: Tab goes into the panel next, through the area, the
 * sliders, the format, the code, the eyedropper and the swatches. Escape, a press outside or focus moving away close it, and
 * Escape puts focus back on the trigger. The panel is the popover's, placed under the trigger or above it when there is more
 * room there.
 */
export function ColorPicker({
  type = 'field', size, error, open: openProp, defaultOpen = false, onOpenChange, value, defaultValue, onChange, showOpacity = true, showFormat = true,
  showEyedropper = true, swatches, panelLabel = 'Color picker', hueLabel, opacityLabel, formatLabel, codeLabel, eyedropperLabel, swatchesLabel, disabled,
  readOnly, required, name, form, id, className, ref, ...aria
}: ColorPickerProps) {
  const { locale } = useLocale();
  const state = useColorPickerState({ value, defaultValue, onChange });
  const color = state.color;
  // The form's reset puts the starting colour back in what the form sends and what the well shows.
  const sent = useRef<HTMLInputElement>(null);
  const start = useRef(color);
  useFormReset(sent, () => state.setColor(start.current));
  // The picker holds open (or the page does) and hands it to the popover, which only draws it.
  const [openState, keepOpen] = useControllable({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange, name: 'ColorPicker open' });
  const open = openState && !disabled && !readOnly;
  const setOpen = (next: boolean) => {
    if (next && (disabled || readOnly)) return;
    keepOpen(next);
  };
  const valueId = `${useId()}-value`;
  const hex = color.toString('hex');
  const words = color.getChannelValue('alpha') < 1 ? `${color.getColorName(locale)}, ${color.formatChannelValue('alpha', locale)}` : color.getColorName(locale);
  const labelledBy = aria['aria-labelledby'];
  const naming = labelledBy ? { 'aria-labelledby': `${labelledBy} ${valueId}` } : { 'aria-label': `${aria['aria-label'] ?? 'Color'}, ${hex}, ${words}` };
  const small = size === 'sm';
  const swatchType = type === 'swatch';

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' && !open) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const trigger = (
    <button
      ref={ref}
      type="button"
      id={id}
      className={`${input({ size, error })} ${select.part('well')} ${colorPicker.part('trigger')}`}
      disabled={disabled}
      aria-readonly={readOnly || undefined}
      aria-required={required || undefined}
      aria-invalid={error || undefined}
      aria-describedby={aria['aria-describedby']}
      {...naming}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (readOnly) e.preventDefault();
      }}
    >
      <span className={input.part('leading-content')}>
        <ColorSwatch color={color} size={swatchType ? (small ? 'xs' : 'md') : small ? 'xs' : 'sm'} decorative className={colorPicker.part('swatch')} />
      </span>
      {!swatchType && (
        <span className={`${select.part('value')} ${colorPicker.part('value')}`} aria-hidden="true">
          {hex}
        </span>
      )}
      <span id={valueId} className={colorPicker.part('name')}>{`${hex}, ${words}`}</span>
      {!swatchType && !readOnly && <Icon name={open ? 'CaretUp' : 'CaretDown'} className={`${input.part('icon')} ${select.part('icon')} ${colorPicker.part('caret')}`} />}
    </button>
  );

  const classes = cx(colorPicker({ type, size, error, open }), className);
  return (
    <span className={classes}>
      <Popover trigger={trigger} open={open} onOpenChange={setOpen} label={panelLabel} className={colorPicker.part('panel')}>
        <PanelContent
          state={state} showOpacity={showOpacity} showFormat={showFormat} showEyedropper={showEyedropper} swatches={swatches}
          hueLabel={hueLabel} opacityLabel={opacityLabel} formatLabel={formatLabel} codeLabel={codeLabel} eyedropperLabel={eyedropperLabel} swatchesLabel={swatchesLabel}
        />
      </Popover>
      {name && <input ref={sent} type="hidden" name={name} form={form} value={color.toString('hexa')} disabled={disabled} />}
    </span>
  );
}

/** The parts of the panel, sharing one color. */
function PanelContent({
  state, showOpacity = true, showFormat = true, showEyedropper = true, swatches, hueLabel = 'Hue', opacityLabel = 'Opacity', formatLabel = 'Color format',
  codeLabel = 'Color code', eyedropperLabel = 'Pick a color from the screen', swatchesLabel = 'Saved colors',
}: ColorPickerPanelOptions & { state: ColorPickerState }) {
  const color = state.color;
  // The eyedropper is offered only where the browser has one, known once the page runs.
  const [canPick, setCanPick] = useState(false);
  useEffect(() => setCanPick(typeof (window as EyeDropperWindow).EyeDropper === 'function'), []);
  const pickFromScreen = async () => {
    const Dropper = (window as EyeDropperWindow).EyeDropper;
    if (!Dropper) return;
    try {
      const { sRGBHex } = await new Dropper().open();
      state.setColor(parseColor(sRGBHex).withChannelValue('alpha', color.getChannelValue('alpha')));
    } catch {
      // The reader pressed Escape: nothing changes.
    }
  };

  return (
    // The format menu and the code field are the panel's own, never the control of a field around the picker.
    <OutsideField>
      <ColorArea value={color} onChange={state.setColor} className={colorPicker.part('area')} />
      <ColorSlider channel="hue" colorSpace="hsb" value={color} onChange={state.setColor} label={hueLabel} hideLabel className={colorPicker.part('slider')} />
      {showOpacity && <ColorSlider channel="alpha" value={color} onChange={state.setColor} label={opacityLabel} hideLabel className={colorPicker.part('slider')} />}
      <div className={colorPicker.part('code')}>
        {showFormat && <Select size="sm" options={FORMATS} defaultValue="hex" aria-label={formatLabel} className={colorPicker.part('format')} />}
        <ColorField size="sm" value={color} onChange={(c) => c && state.setColor(c.withChannelValue('alpha', color.getChannelValue('alpha')))} aria-label={codeLabel} className={colorPicker.part('field')} />
        {showEyedropper && canPick && (
          <Button tone="secondary" size="sm" icon-only icon="Eyedropper" aria-label={eyedropperLabel} className={colorPicker.part('eyedropper')} onClick={pickFromScreen} />
        )}
      </div>
      {swatches && swatches.length > 0 && (
        <div className={colorPicker.part('swatches')}>
          <Divider className={colorPicker.part('divider')} />
          <ColorSwatchPicker size="sm" colors={swatches} value={color} onChange={state.setColor} aria-label={swatchesLabel} />
        </div>
      )}
    </OutsideField>
  );
}

export type ColorPickerPanelProps = ColorPickerPanelOptions & ColorValue & {
  /** Called with the new color as it changes. */
  onChange?: (color: Color) => void;
  className?: string;
};

/**
 * The panel alone, shown, for a page that shows and places it itself, such as a side panel of settings: the same parts as
 * the panel the color picker opens, holding their own color. It is a dialog named “Color picker”, or by panelLabel.
 */
export function ColorPickerPanel({ value, defaultValue, onChange, panelLabel = 'Color picker', className, ...options }: ColorPickerPanelProps) {
  const state = useColorPickerState({ value, defaultValue, onChange } as Parameters<typeof useColorPickerState>[0]);
  return (
    <Popover label={panelLabel} className={cx(colorPicker.part('panel'), className)}>
      <PanelContent state={state} {...options} />
    </Popover>
  );
}
