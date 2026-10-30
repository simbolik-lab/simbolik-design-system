'use client';

/**
 * The choice: what the checkbox's, the radio's, the switch's and the choice card's wrappers share, written once beside
 * the rules they share in choice/choice.css. A wrapper draws its own row and its own mark; `useChoice` works out what
 * the hidden native control takes, and `ChoiceLabel` draws the label, alone or over a line under it.
 *
 *   const choice = useChoice({ type: 'radio', ids: 'radio', error, description, ref, props: rest });
 *   <label className={cx(radio({ size, error: choice.invalid }), choice.optionClass, className)}>
 *     <input type="radio" className={radio.part('control')} {...choice.input} />
 *     <span className={radio.part('circle')} aria-hidden="true">…</span>
 *     <ChoiceLabel choice={choice} part={radio.part}>{children}</ChoiceLabel>
 *   </label>
 *
 * - Inside a field group the control takes the group's error (unless the page gives its own), and its option class.
 *   A radio takes the group's name, one the group makes when the page gave none, so the arrow keys move between the
 *   radios, and its required state; a checkbox takes the name only when the page gave one, so a checkbox group never
 *   sends a made-up name with a form. When the group holds the chosen value (its `value` or `defaultValue`), a radio is
 *   checked when its own value is the group's, and choosing it tells the group; the group's `onChange` hears every
 *   choice either way.
 * - With a line under the label (`description`), or always for the card (`stacked`), the control is named by the label
 *   alone (`aria-labelledby`) and described by the line (`aria-describedby`), because a wrapping label would otherwise
 *   read the line as part of the name. Without one the markup is the plain label.
 * - `indeterminate`, the mixed state, is the control's property, never an attribute, so it is set after every render;
 *   left out, whatever a script set stays. The first setting is how the control starts, so the mark lands at once, as
 *   on a page drawn without script: nothing moves as a page loads.
 * - The page's own props for the control go on last, so a page can still name it or point its description elsewhere;
 *   its `aria-describedby` is kept beside the line's.
 */

import { useId, useLayoutEffect, useRef, type ChangeEvent, type InputHTMLAttributes, type ReactNode, type Ref, type RefObject } from 'react';
import { useObjectRef } from 'react-aria';
import { useFieldGroup } from './field-group/field-group-context.js';

export interface ChoiceOptions {
  /** The control's type: a checkbox (the switch is one too) or a radio. It decides what a field group gives it. */
  type: 'checkbox' | 'radio';
  /** The start of the label's and the line's ids (`checkbox`, `radio`, `choice`). */
  ids: string;
  /** Whether a field group around it is read; the switch reads none. */
  grouped?: boolean;
  /** The page's error flag. Left out, the field group's. */
  error?: boolean;
  /** A line under the label that says more about the choice. */
  description?: ReactNode;
  /** The label is its own named part even without a line under it (the choice card's title). */
  stacked?: boolean;
  /** The mixed state. Left out, the control's own, which only a script sets. */
  indeterminate?: boolean;
  /** The page's ref, which reaches the control. */
  ref?: Ref<HTMLInputElement>;
  /** The page's own props for the control. */
  props: InputHTMLAttributes<HTMLInputElement>;
}

export interface Choice {
  /** The error look and `aria-invalid`: the page's flag, or the group's. */
  invalid: boolean;
  /** The field group's option class, which gives a radio or a checkbox the group's row. */
  optionClass: string | undefined;
  /** Everything the native control takes but its type and class, its ref included. */
  input: InputHTMLAttributes<HTMLInputElement> & { ref: RefObject<HTMLInputElement | null> };
  /** Whether the label is drawn over its line, as its own named part. */
  stacked: boolean;
  labelId: string;
  descriptionId: string;
  description: ReactNode;
}

export function useChoice({ type, ids, grouped = true, error, description, stacked = false, indeterminate, ref, props }: ChoiceOptions): Choice {
  const found = useFieldGroup();
  const group = grouped ? found : null;
  const id = useId();
  const control = useObjectRef(ref);
  const started = useRef(false);
  useLayoutEffect(() => {
    const element = control.current;
    if (!element) return;
    const first = !started.current;
    started.current = true;
    if (indeterminate === undefined || element.indeterminate === indeterminate) return;
    element.indeterminate = indeterminate;
    // Asking for the mark's motions brings its style up to date, so the ones this setting started can end at once.
    if (first) for (const motion of element.nextElementSibling?.getAnimations({ subtree: true }) ?? []) motion.finish();
  });

  const invalid = Boolean(error ?? group?.error);
  const hasDescription = description != null && description !== false;
  const named = stacked || hasDescription;
  const labelId = `${ids}${id}-label`;
  const descriptionId = `${ids}${id}-description`;
  const described = [props['aria-describedby'], hasDescription ? descriptionId : undefined].filter(Boolean).join(' ') || undefined;
  const isRadio = type === 'radio';

  // A radio in a group that holds the chosen value is checked by the group, and tells it when it is chosen.
  const own = props.value == null ? undefined : String(props.value);
  const held = isRadio && group?.value !== undefined;
  const tells = isRadio && group?.choose !== undefined;
  const { onChange, ...rest } = props;
  // The group's value wins over a radio's own start, which React would refuse beside `checked`.
  if (held) delete rest.defaultChecked;
  const change = tells
    ? (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        if (event.currentTarget.checked && own !== undefined) group!.choose!(own);
      }
    : onChange;

  return {
    invalid,
    optionClass: group?.optionClass,
    input: {
      // What a control outside the chassis's group rules (the switch) never had stays off, so its markup is as before.
      ...(grouped ? { name: isRadio ? group?.name : group?.givenName } : {}),
      ...(grouped && isRadio ? { required: group?.required || undefined } : {}),
      ...(grouped ? { 'aria-invalid': invalid ? true : undefined } : {}),
      ...(named ? { 'aria-labelledby': labelId } : {}),
      ...rest,
      ...(held ? { checked: own !== undefined && group!.value === own } : {}),
      onChange: change,
      'aria-describedby': described,
      ref: control,
    },
    stacked: named,
    labelId,
    descriptionId,
    description: hasDescription ? description : undefined,
  };
}

export interface ChoiceLabelProps {
  choice: Choice;
  /** The component's part classes (its manifest's `part`). */
  part: (name: 'label' | 'text' | 'description') => string;
  /** The label: the choice's name. */
  children?: ReactNode;
}

/** The label beside the mark: alone, or with its line under it, the two stacked in the text part and named by id. */
export function ChoiceLabel({ choice, part, children }: ChoiceLabelProps) {
  if (!choice.stacked) return <span className={part('label')}>{children}</span>;
  return (
    <span className={part('text')}>
      <span id={choice.labelId} className={part('label')}>{children}</span>
      {choice.description !== undefined && <span id={choice.descriptionId} className={part('description')}>{choice.description}</span>}
    </span>
  );
}
