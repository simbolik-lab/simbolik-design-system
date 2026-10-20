import { useId, type HTMLAttributes, type RefObject } from 'react';
import { segmentedControl } from './segmented-control.manifest.js';
import { Icon } from '../icon/icon.js';
import { useRadioIndicator } from '../indicator.js';
import { useTip } from '../tooltip/tooltip.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface SegmentOption {
  value: string;
  /** The choice's name: its words, or with the icon alone, what the tooltip shows and assistive technology reads. */
  label: string;
  icon?: string;
  /** A short word shown in place of the icon in a bar of icons alone, for a choice that has no icon ("2x"); the label is shown when there is neither. */
  short?: string;
  /** A short line under the label, in a bar showing descriptions. Read after the choice's name. */
  description?: string;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'content'>, VariantProps<typeof segmentedControl.manifest> {
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
 * the motion, the wrapper only measures where it goes. In a bar of icons alone,
 * each item names itself in a tooltip under it while pointed at or focused, its
 * label staying its radio's name.
 */
export function SegmentedControl({ size, 'item-width': itemWidth, content, look, name, label, options, value, defaultValue, onChange, className, ...rest }: SegmentedControlProps) {
  const classes = cx(segmentedControl({ size, 'item-width': itemWidth, content, look }), className);
  const { groupRef, markRef, place } = useRadioIndicator(segmentedControl.part('item'), value, size, options.map((o) => o.value).join('\u0000'));

  return (
    <div ref={groupRef} role="radiogroup" aria-label={label} className={classes} {...rest}>
      <span ref={markRef} className={segmentedControl.part('indicator')} aria-hidden="true" />
      {options.map((o) => (
        <Segment
          key={o.value}
          option={o}
          name={name}
          content={content ?? 'label'}
          checked={value !== undefined ? value === o.value : undefined}
          defaultChecked={value === undefined ? defaultValue === o.value : undefined}
          onChange={() => {
            onChange?.(o.value);
            if (value === undefined) place(false);
          }}
        />
      ))}
    </div>
  );
}

interface SegmentProps {
  option: SegmentOption;
  name: string;
  content: 'label' | 'icon' | 'description';
  checked?: boolean;
  defaultChecked?: boolean;
  onChange: () => void;
}

/** One item: a label holding its radio, its icon or short word, its label and its description. */
function Segment({ option: o, name, content, checked, defaultChecked, onChange }: SegmentProps) {
  const alone = content === 'icon';
  const { targetRef, hoverProps, focusProps, tip } = useTip({ text: o.label, arrow: 'top-center', inverse: true, purpose: 'name', disabled: !alone });
  const descriptionId = `${useId()}-description`;
  const described = content === 'description' && !!o.description;
  return (
    <label ref={alone ? (targetRef as RefObject<HTMLLabelElement>) : undefined} className={segmentedControl.part('item')} {...(alone ? hoverProps : {})}>
      <input
        type="radio"
        className="smbk-segmented__control"
        name={name}
        value={o.value}
        disabled={o.disabled}
        checked={checked}
        defaultChecked={defaultChecked}
        aria-describedby={described ? descriptionId : undefined}
        onChange={onChange}
        {...(alone ? focusProps : {})}
      />
      {o.icon && <Icon name={o.icon} className={segmentedControl.part('icon')} />}
      {alone && !o.icon && (
        <span className={segmentedControl.part('short')} aria-hidden="true">
          {o.short ?? o.label}
        </span>
      )}
      <span className={segmentedControl.part('label')}>{o.label}</span>
      {described && (
        // Read as the radio's description, not as part of its name, which the label element would make it.
        <span id={descriptionId} className={segmentedControl.part('description')} aria-hidden="true">
          {o.description}
        </span>
      )}
      {alone && tip}
    </label>
  );
}
