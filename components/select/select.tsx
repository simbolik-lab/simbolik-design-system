'use client';

import { useId, useLayoutEffect, useRef, useState, type FocusEvent, type FocusEventHandler, type HTMLAttributes, type KeyboardEvent, type Ref, type RefObject } from 'react';
import { useObjectRef } from 'react-aria';
import { select } from './select.manifest.js';
import { input } from '../input/input.manifest.js';
import { dropdown } from '../dropdown/dropdown.manifest.js';
import { Divider } from '../divider/divider.js';
import { Icon } from '../icon/icon.js';
import { Avatar, avatarInitials } from '../avatar/avatar.js';
import { InputWell } from '../input/input-well.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import { useFloating } from '../floating.js';
import { useDismiss } from '../dismiss.js';
import { useControllable } from '../controllable.js';
import { useTypeAhead } from '../type-ahead.js';
import { isFirstInvalid, useFormReset } from '../form.js';
import { useGlide } from '../glide.js';
import { useScrollbar } from '../scrollbar.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** A second line of detail under the label, such as a person's role. With it, or with an avatar, the option is the rich row. */
  description?: string;
  /** A picture before the label, such as a person's photo: its address, drawn in a small avatar. An empty address, or a
   * picture that fails to load, draws the label's initials instead. The label names the option, so the picture is not
   * read out. */
  avatar?: string;
  /** A Phosphor icon before the label, in the item's icon size and color. */
  icon?: string;
}

/** Options under a heading. The heading names the group for screen readers; a line divides one group from the next. */
export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

const isGroup = (o: SelectOption | SelectGroup): o is SelectGroup => 'options' in o;

export interface SelectProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue' | 'children'>, VariantProps<typeof select.manifest> {
  /** The choices, in order: options, groups of options under a heading, or both. */
  options: (SelectOption | SelectGroup)[];
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Shown in the well until a choice is made. */
  placeholder?: string;
  /** Form field name; the value travels in a hidden native select. */
  name?: string;
  disabled?: boolean;
  /** The choice can be read and reached with Tab, not changed: the list does not open, and the caret is not drawn. The value still travels with the form. */
  readOnly?: boolean;
  /** A choice must be made. Said on the well; the field around it draws the mark. A form sent with no choice stops,
   * and the select takes focus and its error look until a choice is made. */
  required?: boolean;
  /** What the value is, for the browser's autofill, e.g. "country-name" or "honorific-prefix". Given to the hidden native select, which the browser fills. */
  autoComplete?: string;
  /**
   * The element the open list stays inside, such as the part of the page whose
   * end the list should not pass. The window and any scrolling part around the
   * select always bound it as well.
   */
  boundary?: RefObject<Element | null>;
  /** Holds the list open or closed from outside, as in a test or a picture of the page. Pair it with onOpenChange; leave it out and the select opens and closes itself. */
  open?: boolean;
  /** Called when the select asks to open or close its list: a press, a key, a choice, a click outside or focus leaving. */
  onOpenChange?: (open: boolean) => void;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Help text or an error message for the well, such as the field's line under it. */
  'aria-describedby'?: string;
  /** Reaches the well, the button that opens the list, e.g. to focus it when a form is sent with no choice made. */
  ref?: Ref<HTMLButtonElement>;
}

/** How long typed letters keep adding to one search before a new one starts. */
const TYPE_AHEAD_MS = 500;

/** Where an option's top sits in the list's scrolled content. Measured, not read from offsetTop, which counts from a group when the option is in one. */
const topIn = (list: HTMLElement, el: HTMLElement) => el.getBoundingClientRect().top - list.getBoundingClientRect().top - list.clientTop + list.scrollTop;

const nativeOption = (o: SelectOption) => (
  <option key={o.value} value={o.value} disabled={o.disabled}>
    {o.label}
  </option>
);

/**
 * Select: a button that opens a list of choices. Closed it is the input's well; open, the
 * list is the dropdown panel and every choice a dropdown item, at the select's size. A read-only
 * select stays in the tab order and never opens.
 * Its label and help text come from the field around it (Field).
 * Arrow keys move the highlight, Home and End go to the first and last choice (opening the
 * list when it is closed), Enter and Space choose, Escape and Tab close, and a
 * click outside or focus moving away closes. Typing jumps to the choice that starts with what was
 * typed. The value also lives in a hidden native select for forms: it is what the form sends, what `required`
 * checks and what autofill fills, and the form's reset puts the starting choice back.
 *
 * The open list is the dropdown's floating panel (floating.ts): lifted over the
 * page, so no clipping or scrolling part around the select cuts it off, as wide as
 * the well, never taller than the list height (size/list/max-height) or than the
 * room it has in the window and the `boundary`, and placed under the well, or above
 * it when there is more room there (`data-side="above"`). A longer list scrolls
 * inside itself. It opens scrolled to the chosen option, and the keyboard's
 * highlight is kept in view.
 */
export function Select(props: SelectProps) {
  const { size, error, open: openProp, onOpenChange, options: entries, value, defaultValue, onChange, placeholder, name, disabled, readOnly, required, autoComplete, boundary, className, id, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, ref, ...rest } = useFieldControl(props);
  const reactId = useId();
  const baseId = id ?? `select${reactId}`;
  const listId = `${baseId}-list`;
  // Every option in one row, groups opened out: the keys, the type-ahead and the highlight count through them all.
  const options = entries.flatMap((e) => (isGroup(e) ? e.options : [e]));
  const [current, keepValue] = useControllable({ value, defaultValue, onChange, name: 'Select value' });
  // Open is the page's to hold when it gives `open`, the select's own otherwise; a disabled or read-only select never opens.
  const [openState, keepOpen] = useControllable({ value: openProp, defaultValue: false, onChange: onOpenChange, name: 'Select open' });
  const open = openState && !disabled && !readOnly;
  const setOpen = (next: boolean) => {
    if (next === open) return;
    keepOpen(next);
  };
  const [highlight, setHighlight] = useState(-1);
  const root = useRef<HTMLSpanElement>(null);
  // The well is the select's own and the page's: both refs reach the same button.
  const well = useObjectRef(ref);
  const list = useRef<HTMLUListElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  // How the highlight last moved: only the keyboard scrolls the list to it,
  // because scrolling under a resting pointer would move a new option under it.
  const byKeys = useRef(false);
  const typeAhead = useTypeAhead(TYPE_AHEAD_MS, { cycle: true });
  const chosen = options.find((o) => o.value === current);
  // A form sent while a required select has no choice marks it in error until a choice is made.
  const [missing, setMissing] = useState(false);
  const shown = Boolean(error) || (missing && !chosen);
  useFormReset(well, () => {
    setMissing(false);
    keepValue(defaultValue ?? '');
  });

  // A press outside, Escape and focus moving anywhere outside close the list while it is the top layer (dismiss.ts).
  // Focus is on the well whenever it is inside, so it stays there.
  const dismiss = useDismiss({ open, root, onClose: () => setOpen(false), blur: true });

  const { side } = useFloating({ target: well, layer, panel: list, open, boundary, matchWidth: true });

  // Once the list is placed, it opens on the chosen option, in the middle of the list where it can be.
  const placed = side !== null;
  useLayoutEffect(() => {
    const l = list.current;
    if (!open || !l || !placed) return;
    const on = l.querySelector('[aria-selected="true"]') as HTMLElement | null;
    if (on) l.scrollTop = topIn(l, on) - (l.clientHeight - on.offsetHeight) / 2;
  }, [open, placed]);

  const bar = useScrollbar(list, { enabled: open });

  // The pointer's fill glides between the choices (glide.ts) and the choice it lights is Enter's target.
  useGlide(list, {
    rows: `.${select.part('option')}`,
    fill: dropdown.part('glide'),
    enabled: open,
    onPick: (row) => {
      const i = Number(row.dataset.index);
      if (!Number.isInteger(i)) return;
      byKeys.current = false;
      setHighlight(i);
    },
  });

  // Keep the keyboard's highlight in view inside the list, clear of its padding.
  useLayoutEffect(() => {
    const l = list.current;
    if (!open || !l || !byKeys.current) return;
    const o = document.getElementById(`${listId}-${highlight}`);
    if (!o) return;
    const pad = Number.parseFloat(getComputedStyle(l).paddingTop) || 0;
    const top = topIn(l, o);
    if (top - pad < l.scrollTop) l.scrollTop = top - pad;
    else if (top + o.offsetHeight + pad > l.scrollTop + l.clientHeight) l.scrollTop = top + o.offsetHeight + pad - l.clientHeight;
  }, [open, highlight]);

  const choose = (o: SelectOption) => {
    if (o.disabled) return;
    keepValue(o.value);
    setOpen(false);
  };

  const show = (at?: number) => {
    // The list opens on the chosen option; the keyboard's first move goes from there.
    byKeys.current = false;
    setOpen(true);
    setHighlight(at ?? Math.max(0, options.findIndex((o) => o.value === current)));
  };

  const move = (step: number) => {
    let i = highlight;
    for (let n = 0; n < options.length; n++) {
      i = (i + step + options.length) % options.length;
      if (!options[i]?.disabled) break;
    }
    byKeys.current = true;
    setHighlight(i);
  };

  // Typing jumps to the next choice that starts with the letters typed so far.
  // The same letter again steps through the choices that start with it.
  const typeTo = (key: string) => {
    const from = open ? highlight : options.findIndex((o) => o.value === current);
    const i = typeAhead.find(key, options.map((o) => (o.disabled ? null : o.label)), Math.max(from, 0));
    if (i < 0) return;
    if (!open) show(i);
    byKeys.current = true;
    setHighlight(i);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || readOnly) return;
    const typing = typeAhead.typing();
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key !== ' ' || typing)) {
      e.preventDefault();
      typeTo(e.key);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) show();
      else move(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) show();
      else if (options[highlight]) choose(options[highlight]!);
    } else if (e.key === 'Escape') {
      dismiss.onKeyDown(e);
    } else if (e.key === 'Tab' && open) {
      // Tab closes the list and moves on as usual; it chooses nothing.
      setOpen(false);
    } else if (e.key === 'Home' || e.key === 'End') {
      // The first or the last choice that can be chosen; a disabled one is passed over, as the arrows do. On a closed
      // select they open the list there.
      e.preventDefault();
      const enabled = options.flatMap((o, i) => (o.disabled ? [] : [i]));
      const to = e.key === 'Home' ? enabled[0] : enabled[enabled.length - 1];
      if (to === undefined) return;
      if (!open) show(to);
      byKeys.current = true;
      setHighlight(to);
    }
  };

  // One choice: the dropdown's item, with a lead and a second line when it has them (Figma's RichOption).
  const optionRow = (o: SelectOption) => {
    const i = options.indexOf(o);
    const rich = o.description !== undefined || o.avatar !== undefined;
    return (
      <li
        key={o.value}
        id={`${listId}-${i}`}
        role="option"
        data-index={i}
        aria-selected={o.value === current}
        aria-disabled={o.disabled ? true : undefined}
        className={cx(dropdown.part('item'), select.part('option'), rich && `${select.part('option')}--rich`, i === highlight && `${select.part('option')}--highlighted`)}
        onMouseEnter={() => {
          byKeys.current = false;
          setHighlight(i);
        }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => choose(o)}
      >
        {o.avatar !== undefined ? (
          <Avatar size="sm" src={o.avatar || undefined} className={select.part('option-lead')}>
            {avatarInitials(o.label)}
          </Avatar>
        ) : (
          o.icon && <Icon name={o.icon} className={`${dropdown.part('icon')} ${select.part('option-lead')}`} />
        )}
        {o.description !== undefined ? (
          <span className={`${dropdown.part('text')} ${select.part('option-text')}`}>
            <span className={select.part('option-label')}>{o.label}</span>
            <span className={select.part('option-description')}>{o.description}</span>
          </span>
        ) : (
          <span className={`${dropdown.part('text')} ${select.part('option-label')}`}>{o.label}</span>
        )}
        {o.value === current && <Icon name="Check" className={`${dropdown.part('icon')} ${select.part('check')}`} />}
      </li>
    );
  };

  const classes = cx(select({ size, error: shown, open }), className);
  // Focus lands on the well, so the page's focus handlers go there, as its name and description do: a tooltip given
  // the select as its target listens for focus on the element itself, and on the outer span it never heard it.
  const { onFocus, onBlur, ...outer } = rest;
  const focusWell = onFocus as FocusEventHandler<HTMLElement> | undefined;
  const blurWell = onBlur as FocusEventHandler<HTMLElement> | undefined;
  // The list is the dropdown panel at the select's size; the dropdown names its sizes default and small.
  const small = size === 'sm';
  return (
    <span ref={root} className={classes} {...outer}>
      <InputWell
        as="button"
        ref={well}
        type="button"
        id={baseId}
        className={select.part('well')}
        size={size}
        error={shown}
        nameCheck="Select"
        end={!readOnly && <Icon name="CaretDown" className={`${input.part('icon')} ${select.part('icon')}`} />}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        // The list is in the page only while it is open, so the button names it only then: ARIA 1.2 asks for
        // aria-controls while the popup shows, and a name pointing at nothing is ignored at best.
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && highlight >= 0 ? `${listId}-${highlight}` : undefined}
        aria-invalid={shown ? true : undefined}
        aria-required={required ? true : undefined}
        aria-readonly={readOnly ? true : undefined}
        aria-describedby={ariaDescribedby}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        disabled={disabled}
        onClick={() => {
          if (readOnly) return;
          if (open) setOpen(false);
          else show();
        }}
        onKeyDown={onKeyDown}
        onFocus={focusWell}
        onBlur={(e: FocusEvent<HTMLElement>) => {
          dismiss.onBlur?.(e);
          blurWell?.(e);
        }}
      >
        <span className={cx(select.part('value'), chosen ? '' : `${select.part('value')}--placeholder`)}>{chosen ? chosen.label : placeholder ?? ''}</span>
      </InputWell>
      {open && (
        <div ref={layer} className={dropdown.part('layer')}>
        <ul ref={list} id={listId} role="listbox" className={`${dropdown({ size: small ? 'sm' : 'md' })} ${select.part('list')}`} data-side={side ?? undefined} data-highlight={byKeys.current ? 'keys' : 'pointer'} {...bar} aria-labelledby={ariaLabelledby ?? (ariaLabel ? undefined : baseId)} aria-label={ariaLabel}>
          {entries.map((e, gi) => {
            if (!isGroup(e)) return optionRow(e);
            const headingId = `${listId}-group-${gi}`;
            // A group: its heading, then its options in an element with the group role named by it, as a listbox
            // section is written; a line before it when something comes before.
            return (
              <li key={headingId} role="presentation" className={select.part('group')}>
                {gi > 0 && <Divider aria-hidden="true" className={dropdown.part('divider')} />}
                <span id={headingId} role="presentation" className={dropdown.part('label')}>
                  {e.label}
                </span>
                <ul role="group" aria-labelledby={headingId} className={dropdown.part('group')}>
                  {e.options.map(optionRow)}
                </ul>
              </li>
            );
          })}
        </ul>
        </div>
      )}
      {/* The value as a native select, hidden from view and from screen readers: the form sends it (nothing while
          disabled), checks `required` on it and lets autofill fill it. When the browser finds it empty on sending,
          the well takes focus and the error look instead of the browser's own message. */}
      {(name || required || autoComplete) && (
        <select
          className="smbk-visually-hidden"
          aria-hidden="true"
          tabIndex={-1}
          name={name}
          value={current ?? ''}
          required={required && !readOnly}
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={(e) => {
            if (!readOnly) keepValue(e.currentTarget.value);
          }}
          onFocus={() => well.current?.focus()}
          onInvalid={(e) => {
            e.preventDefault();
            setMissing(true);
            if (isFirstInvalid(e.currentTarget)) well.current?.focus();
          }}
        >
          <option value="" />
          {entries.map((e, gi) =>
            isGroup(e) ? (
              <optgroup key={`group-${gi}`} label={e.label}>
                {e.options.map(nativeOption)}
              </optgroup>
            ) : (
              nativeOption(e)
            ),
          )}
        </select>
      )}
    </span>
  );
}
readsField(Select);
