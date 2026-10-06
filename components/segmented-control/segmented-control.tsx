import type { HTMLAttributes } from 'react';
import { segmentedControl } from './segmented-control.manifest.js';
import { Icon } from '../icon/icon.js';
import { useRadioIndicator } from '../indicator.js';
import type { VariantProps } from '../variants.js';

export interface SegmentOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, VariantProps<typeof segmentedControl.manifest> {
  /** Shared name of the radios inside. */
  name: string;
  /** Accessible name of the whole control. */
  label: string;
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * Segmented control: a radio group drawn as one bar. The chosen item's raised
 * surface is one indicator that slides to the next choice; the stylesheet does
 * the motion, the wrapper only measures where it goes.
 */
export function SegmentedControl({ size, 'item-width': itemWidth, name, label, options, value, defaultValue, onChange, className, ...rest }: SegmentedControlProps) {
  const classes = [segmentedControl({ size, 'item-width': itemWidth }), className].filter(Boolean).join(' ');
  const { groupRef, markRef, place } = useRadioIndicator(segmentedControl.part('item'), value, size, options.map((o) => o.value).join('\u0000'));

  return (
    <div ref={groupRef} role="radiogroup" aria-label={label} className={classes} {...rest}>
      <span ref={markRef} className={segmentedControl.part('indicator')} aria-hidden="true" />
      {options.map((o) => (
        <label key={o.value} className={segmentedControl.part('item')}>
          <input
            type="radio"
            className="smbk-segmented__control"
            name={name}
            value={o.value}
            disabled={o.disabled}
            checked={value !== undefined ? value === o.value : undefined}
            defaultChecked={value === undefined ? defaultValue === o.value : undefined}
            onChange={() => {
              onChange?.(o.value);
              if (value === undefined) place(false);
            }}
          />
          {o.icon && <Icon name={o.icon} className={segmentedControl.part('icon')} />}
          <span className={segmentedControl.part('label')}>{o.label}</span>
        </label>
      ))}
    </div>
  );
}
