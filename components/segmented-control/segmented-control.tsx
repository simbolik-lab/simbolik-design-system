'use client';

import { useId, type FocusEvent, type HTMLAttributes, type RefObject } from 'react';
import { mergeProps, mergeRefs } from 'react-aria';
import { segmentedControl } from './segmented-control.manifest.js';
import { Icon } from '../icon/icon.js';
import { useRadioIndicator } from '../indicator.js';
import { keyShortcut } from '../key-shortcut.js';
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
  /**
   * The choice's own key, in a bar of icons alone: shown after its name in its tooltip as a key cap, and told to screen
   * readers as its radio's aria-keyshortcuts. Only shown: the page listens for the key and chooses it.
   */
  shortcut?: string;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'content' | 'aria-keyshortcuts'>, VariantProps<typeof segmentedControl.manifest> {
  /** Shared name of the radios inside. */
  name: string;
  /** Accessible name of the whole control. */
  label: string;
  /**
   * The whole control's key, such as one that steps to the next choice ("D" for light or dark), told to screen
   * readers as the group's aria-keyshortcuts. In a bar of words it shows in a tooltip under the bar, the control's
   * label then the key, while the bar is pointed at or holds keyboard focus; in a bar of icons alone, each item's
   * tooltip shows it after the item's name, unless the item has a key of its own. Only shown: the page listens for it.
   */
  shortcut?: string;
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
 *
 * A key (`shortcut`, the whole control's, or an icon item's own) shows after the name in the tooltip as a key cap
 * and is told to screen readers as aria-keyshortcuts; the tooltip stays hidden from them. The page listens for it.
 */
export function SegmentedControl({ size, 'item-width': itemWidth, content, look, name, label, shortcut, options, value, defaultValue, onChange, className, ...rest }: SegmentedControlProps) {
  const classes = cx(segmentedControl({ size, 'item-width': itemWidth, content, look }), className);
  const { groupRef, markRef, place } = useRadioIndicator(segmentedControl.part('item'), value, size, options.map((o) => o.value).join('\u0000'));
  const alone = (content ?? 'label') === 'icon';
  // A bar of words names its key in a tooltip of its own, under the whole bar; a bar of icons alone, in each item's.
  const whole = useTip({ text: label, shortcut, arrow: 'top-center', inverse: true, purpose: 'name', disabled: !shortcut || alone });
  const ref = mergeRefs(groupRef, whole.targetRef as RefObject<HTMLDivElement | null>);
  // Focus lands on a radio inside the bar, so the bar's tooltip follows focus into and out of the bar, from the
  // keyboard only, as a target's own tooltip does.
  const focusIn = (e: FocusEvent<HTMLDivElement>) => {
    if (shortcut && !alone && e.target.matches(':focus-visible')) whole.show();
  };
  const focusOut = (e: FocusEvent<HTMLDivElement>) => {
    if (shortcut && !alone && !e.currentTarget.contains(e.relatedTarget as Node | null)) whole.hide();
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      aria-keyshortcuts={shortcut ? keyShortcut(shortcut) : undefined}
      className={classes}
      {...mergeProps(rest, shortcut && !alone ? whole.hoverProps : {}, { onFocus: focusIn, onBlur: focusOut })}
    >
      <span ref={markRef} className={segmentedControl.part('indicator')} aria-hidden="true" />
      {options.map((o) => (
        <Segment
          key={o.value}
          option={o}
          shortcut={o.shortcut ?? shortcut}
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
      {shortcut && !alone && whole.tip}
    </div>
  );
}

interface SegmentProps {
  option: SegmentOption;
  /** The key its tooltip shows: its own, or the whole control's. */
  shortcut?: string;
  name: string;
  content: 'label' | 'icon' | 'description';
  checked?: boolean;
  defaultChecked?: boolean;
  onChange: () => void;
}

/** One item: a label holding its radio, its icon or short word, its label and its description. */
function Segment({ option: o, shortcut, name, content, checked, defaultChecked, onChange }: SegmentProps) {
  const alone = content === 'icon';
  const { targetRef, hoverProps, focusProps, tip } = useTip({ text: o.label, shortcut: alone ? shortcut : undefined, arrow: 'top-center', inverse: true, purpose: 'name', disabled: !alone });
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
        aria-keyshortcuts={o.shortcut ? keyShortcut(o.shortcut) : undefined}
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
