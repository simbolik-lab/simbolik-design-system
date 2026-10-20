import { useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type FocusEvent, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type Ref, type RefObject } from 'react';
import { mergeProps, useComboBox, useFilter, useFocusable, useObjectRef, usePress, type AriaButtonProps } from 'react-aria';
import { Item, useComboBoxState, type Key } from 'react-stately';
import { combobox } from './combobox.manifest.js';
import { input } from '../input/input.manifest.js';
import { dropdown } from '../dropdown/dropdown.manifest.js';
import { chip } from '../chip/chip.manifest.js';
import { checkbox } from '../checkbox/checkbox.manifest.js';
import { searchField } from '../search-field/search-field.manifest.js';
import { Icon } from '../icon/icon.js';
import { Spinner } from '../spinner/spinner.js';
import { InputWell } from '../input/input-well.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import { useFloating } from '../floating.js';
import { useDismiss } from '../dismiss.js';
import { useGlide } from '../glide.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CommonProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue' | 'children'>, Omit<VariantProps<typeof combobox.manifest>, 'selection'> {
  /** Every option, or, when the page finds them itself (`filter="none"`), the ones that match what is typed. */
  options: ComboboxOption[];
  /** What is typed in the box, when the page controls it: the query, kept apart from the value chosen. */
  inputValue?: string;
  /** What the box holds at first when uncontrolled; a single choice given at first shows its own label instead. */
  defaultInputValue?: string;
  /** Called as the reader types, with the whole of what is in the box. */
  onInputChange?: (text: string) => void;
  /**
   * How options are matched to what is typed: anywhere in the label (the default) or at its start, ignoring case and
   * accents, in the reader's language. "none" leaves matching to the page, which passes the matching options in
   * `options`, as a search on a server does.
   */
  filter?: 'contains' | 'starts-with' | 'none';
  /** What the list shows instead of options while the page fetches them, or when fetching failed. No results is worked out from an empty list. */
  status?: 'loading' | 'error';
  /** The loading row's words. */
  loadingText?: string;
  /** The error row's words: what went wrong and what to do. */
  errorText?: string;
  /** The row shown when nothing matches. */
  noResultsText?: string;
  /** The name of the clear cross, which empties the box and removes the choice. */
  clearLabel?: string;
  /** The name of each chip's remove cross, from the option's label. */
  removeLabel?: (label: string) => string;
  /** Shown in the box while nothing is typed or chosen. */
  placeholder?: string;
  /** Form field name; the value travels in hidden inputs, one per pick. */
  name?: string;
  disabled?: boolean;
  /** The choice can be read and reached with Tab, not changed: the list does not open, and the caret, the clear cross and the chips' crosses are not drawn. */
  readOnly?: boolean;
  /** A choice must be made. Said on the box; the field around it draws the mark. */
  required?: boolean;
  /**
   * Shown open from the start, as in a picture of the page, without moving focus or hiding the rest of the page from
   * a screen reader. Focus in the box makes it the working list; a press elsewhere closes it.
   */
  defaultOpen?: boolean;
  /** The element the open list stays inside, besides the window and any scrolling part around the combobox. */
  boundary?: RefObject<Element | null>;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Help text or an error message for the box, such as the field's line under it. */
  'aria-describedby'?: string;
  /** Reaches the box typed in, e.g. to focus it when a form is sent with no choice made. */
  ref?: Ref<HTMLInputElement>;
}

export interface ComboboxSingleProps extends CommonProps {
  /** One choice (the default) or several. */
  selection?: 'single';
  /** The chosen option's value, when the page controls it; null for none. */
  value?: string | null;
  /** The first choice when uncontrolled. */
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}

export interface ComboboxMultipleProps extends CommonProps {
  selection: 'multiple';
  /** The picked options' values, in the order they were picked, when the page controls them. */
  value?: string[];
  /** The first picks when uncontrolled. */
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

/**
 * The caret, React Aria's combobox button with its press taken apart, so no hook writes a style element into the
 * page: out of the Tab order, it opens and closes the list and keeps focus in the box.
 */
function Caret({ aria, expanded, buttonRef }: { aria: AriaButtonProps; expanded: boolean; buttonRef: RefObject<HTMLButtonElement | null> }) {
  const { isDisabled, onPress, onPressStart, preventFocusOnPress } = aria;
  const { pressProps } = usePress({ onPress, onPressStart, isDisabled, preventFocusOnPress });
  const { focusableProps } = useFocusable(aria, buttonRef);
  const named = { id: aria.id, 'aria-label': aria['aria-label'], 'aria-labelledby': aria['aria-labelledby'], 'aria-haspopup': aria['aria-haspopup'], 'aria-expanded': expanded };
  const props = mergeProps({ disabled: isDisabled }, focusableProps, pressProps, named) as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button ref={buttonRef} type="button" className={combobox.part('caret')} {...props}>
      <Icon name="CaretDown" className={input.part('icon')} />
    </button>
  );
}

/**
 * Combobox: a box to type in that suggests matches from a list, for one choice or several. Closed, it is the input's
 * well with a caret; open, the list under it is the dropdown panel and every option a dropdown item at the combobox's
 * size. With several picks each one is a removable chip before the text, and every option draws a tick box. Its
 * behaviour is React Aria's combobox: typing filters the list and opens it, Down and Up open it and move the active
 * option while focus stays in the box, Enter picks, Escape closes it and puts back what was typed (a second Escape
 * empties a single choice), and Tab leaves, picking nothing. The number of matches is announced as it changes, and
 * the loading and error rows are announced as they appear. Backspace in an empty box removes the last chip. The
 * value travels in hidden inputs for forms.
 *
 * The open list is the dropdown's floating panel (floating.ts): lifted over the page, as wide as the well, never
 * taller than the list height (size/list/max-height) or than the room it has, and placed under the well, or above it
 * when there is more room there. A longer list scrolls inside itself and keeps the active option in view.
 */
export function Combobox(given: ComboboxProps) {
  const props = useFieldControl(given);
  const {
    selection = 'single', size, error, options, value, defaultValue, onChange, inputValue, defaultInputValue, onInputChange,
    filter = 'contains', status, loadingText = 'Loading results…', errorText = 'Could not load results. Try again.',
    noResultsText = 'No results found', clearLabel = 'Clear', removeLabel = (label: string) => `Remove ${label}`, placeholder, name,
    disabled, readOnly, required, defaultOpen = false, boundary, className, id, 'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, ref, ...rest
  } = props;
  const multiple = selection === 'multiple';
  const root = useRef<HTMLSpanElement>(null);
  const well = useRef<HTMLElement>(null);
  const entry = useObjectRef(ref);
  const caret = useRef<HTMLButtonElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const listbox = useRef<HTMLUListElement>(null);
  // How the active option last moved: only the keyboard scrolls the list to it, because scrolling under a resting
  // pointer would move a new option under it.
  const byKeys = useRef(false);
  // Every label seen, so a pick keeps its chip's words when a search on a server no longer returns it.
  const known = useRef(new Map<string, string>());
  for (const o of options) known.current.set(o.value, o.label);
  const at = new Map(options.map((o, i) => [o.value, i]));
  const { contains, startsWith } = useFilter({ sensitivity: 'base' });

  const state = useComboBoxState<ComboboxOption, 'single' | 'multiple'>({
    ...(filter === 'none' ? { items: options } : { defaultItems: options, defaultFilter: filter === 'starts-with' ? startsWith : contains }),
    children: (o: ComboboxOption) => <Item key={o.value} textValue={o.label}>{o.label}</Item>,
    disabledKeys: options.filter((o) => o.disabled).map((o) => o.value),
    selectionMode: selection,
    value: value as Key | null | Key[] | undefined,
    defaultValue: defaultValue as Key | null | Key[] | undefined,
    onChange: onChange as ((value: Key | null | Key[]) => void) | undefined,
    inputValue,
    defaultInputValue,
    onInputChange,
    allowsEmptyCollection: true,
    isDisabled: disabled,
    isReadOnly: readOnly,
    isRequired: required,
    isInvalid: error,
  });

  const { inputProps, listBoxProps, buttonProps } = useComboBox<ComboboxOption, 'single' | 'multiple'>(
    {
      inputRef: entry, listBoxRef: listbox, popoverRef: layer, buttonRef: caret,
      id, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby,
      placeholder, isDisabled: disabled, isReadOnly: readOnly, isRequired: required, isInvalid: error,
      selectionMode: selection, shouldFocusWrap: true,
    },
    state,
  );

  // Shown open from the start until focus or a press elsewhere; React Aria's state stays closed meanwhile.
  const [preview, setPreview] = useState(defaultOpen);
  const open = state.isOpen || preview;
  // The open list is a layer (dismiss.ts): a press outside closes it while it is the top layer, and so does Escape
  // from elsewhere on the page while it is shown open from the start. Escape in the box, and focus leaving it, are
  // React Aria's (the box's own keys, below).
  useDismiss({
    open,
    root,
    onClose: () => {
      setPreview(false);
      if (state.isOpen) state.close();
    },
  });

  const manager = state.selectionManager;
  const shown = [...state.collection].filter((node) => node.type === 'item');
  const enabled = shown.filter((node) => !state.disabledKeys.has(node.key));
  const picked = multiple ? ((state.value as Key[] | null) ?? []).map(String) : [];
  const chosen = !multiple && state.value != null ? String(state.value) : null;
  const listId = listBoxProps.id ?? `${inputProps.id}-list`;
  const optionId = (key: Key) => `${listId}-${at.get(String(key)) ?? String(key).replace(/\s+/g, '-')}`;
  const active = open && manager.focusedKey != null ? manager.focusedKey : null;

  // Opened from the keyboard, the list starts on the chosen option, or the first or last one it can move to. Opened
  // by typing or by a press, no option is active until the arrow keys move.
  const wasOpen = useRef(false);
  useLayoutEffect(() => {
    if (state.isOpen && !wasOpen.current && manager.focusedKey == null && state.focusStrategy) {
      const visible = chosen != null && enabled.some((node) => String(node.key) === chosen) ? chosen : null;
      const edge = state.focusStrategy === 'last' ? enabled[enabled.length - 1] : enabled[0];
      const key = visible ?? edge?.key ?? null;
      if (key != null) {
        byKeys.current = true;
        manager.setFocused(true);
        manager.setFocusedKey(key);
      }
    }
    wasOpen.current = state.isOpen;
  });

  const { side } = useFloating({ target: well, layer, panel, open, boundary: boundary?.current, matchWidth: true });

  // The pointer's fill glides between the options (glide.ts) and the option it lights is the active one, Enter's target.
  useGlide(panel, {
    rows: `.${combobox.part('option')}`,
    fill: dropdown.part('glide'),
    onPick: (row) => {
      const key = row.dataset.key;
      if (key === undefined || state.disabledKeys.has(key)) return;
      byKeys.current = false;
      manager.setFocused(true);
      manager.setFocusedKey(key);
    },
  });

  // Once the list is placed, it opens on the chosen option, in the middle of the list where it can be.
  const placed = side !== null;
  useLayoutEffect(() => {
    const p = panel.current;
    if (!open || !placed || !p || chosen == null) return;
    const on = p.querySelector<HTMLElement>('[aria-selected="true"]');
    if (on) p.scrollTop = on.offsetTop - (p.clientHeight - on.offsetHeight) / 2;
    // Only as it opens: a choice made with the list open leaves it where it is.
  }, [open, placed]);

  // Keep the keyboard's active option in view inside the list, clear of its padding.
  useLayoutEffect(() => {
    const p = panel.current;
    if (!open || !p || active == null || !byKeys.current) return;
    const o = document.getElementById(optionId(active));
    if (!o) return;
    const pad = Number.parseFloat(getComputedStyle(p).paddingTop) || 0;
    if (o.offsetTop - pad < p.scrollTop) p.scrollTop = o.offsetTop - pad;
    else if (o.offsetTop + o.offsetHeight + pad > p.scrollTop + p.clientHeight) p.scrollTop = o.offsetTop + o.offsetHeight + pad - p.clientHeight;
  }, [open, active]);

  const pick = (key: Key) => {
    if (state.disabledKeys.has(key)) return;
    manager.select(key);
    if (!multiple) setPreview(false);
  };

  const remove = (gone: string) => {
    state.setValue(picked.filter((v) => v !== gone));
    entry.current?.focus();
  };

  const clear = () => {
    state.setInputValue('');
    state.setValue(multiple ? [] : null);
    setPreview(false);
    entry.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.key)) byKeys.current = true;
    if (!disabled && !readOnly) {
      // Tab leaves and picks nothing, as the select's does: the list closes and the box shows the choice again.
      if (e.key === 'Tab' && state.isOpen) {
        state.close();
        return;
      }
      // A second Escape, with the list closed, empties the box and a single choice. Picks are only ever removed one by one.
      if (e.key === 'Escape' && !state.isOpen && (state.inputValue !== '' || chosen != null)) {
        e.preventDefault();
        e.stopPropagation();
        state.setInputValue('');
        if (!multiple) state.setValue(null);
        return;
      }
      // Backspace with nothing typed before the text's start removes the last chip.
      const box = e.currentTarget;
      if (e.key === 'Backspace' && multiple && picked.length > 0 && box.selectionStart === 0 && box.selectionEnd === 0) {
        e.preventDefault();
        state.setValue(picked.slice(0, -1));
        return;
      }
    }
    const closing = e.key === 'Escape' && state.isOpen;
    inputProps.onKeyDown?.(e);
    // Escape that closed the list is spent: a dialog around the combobox stays open.
    if (closing) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    inputProps.onFocus?.(e);
    if (preview) {
      setPreview(false);
      state.open(null, 'input');
    }
  };

  // A press on the well's own padding or empty space puts the caret in the box, as on a plain input.
  const onWellMouseDown = (e: MouseEvent<HTMLSpanElement>) => {
    const target = e.target as Element;
    if (disabled || target === entry.current || target.closest('button')) return;
    e.preventDefault();
    entry.current?.focus();
  };

  const busy = status === 'loading' || status === 'error';
  const type = status ?? (shown.length === 0 ? 'no-results' : null);
  const announcement = open && status === 'loading' ? loadingText : open && status === 'error' ? errorText : '';
  const filled = state.inputValue !== '' || chosen != null || picked.length > 0;
  const small = size === 'sm';
  const classes = cx(combobox({ selection, size, error }), className);

  return (
    <span ref={root} className={classes} {...rest}>
      <InputWell
        ref={well}
        className={combobox.part('control')}
        size={size}
        error={error}
        nameCheck="Combobox"
        onMouseDown={onWellMouseDown}
        end={
          <>
            {filled && !disabled && !readOnly && (
              <button type="button" tabIndex={-1} className={`${searchField.part('clear')} ${combobox.part('clear')}`} aria-label={clearLabel} onClick={clear}>
                <Icon name="X" />
              </button>
            )}
            {!readOnly && <Caret aria={buttonProps} expanded={open} buttonRef={caret} />}
          </>
        }
      >
        <span className={combobox.part('values')}>
          {picked.map((v) => {
            const label = known.current.get(v) ?? v;
            return (
              <span key={v} className={`${chip({ tone: 'default', size: 'sm' })} ${combobox.part('chip')}`} aria-disabled={disabled ? true : undefined}>
                <span className={chip.part('label')}>{label}</span>
                {!readOnly && (
                  <button type="button" className={chip.part('remove')} aria-label={removeLabel(label)} disabled={disabled} onClick={() => remove(v)}>
                    <Icon name="XCircle" />
                  </button>
                )}
              </span>
            );
          })}
          <input
            {...inputProps}
            ref={entry}
            className={`${input.part('control')} ${combobox.part('input')}`}
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={active != null ? optionId(active) : undefined}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
          />
        </span>
      </InputWell>
      <div ref={layer} className={dropdown.part('layer')}>
        <div ref={panel} className={`${dropdown({ size: small ? 'small' : 'default' })} ${combobox.part('list')}`} hidden={!open} data-side={side ?? undefined}>
          <ul
            ref={listbox}
            id={listId}
            role="listbox"
            // Named by the field's label as React Aria names it ("Suggestions" and the label); a box named by aria-label alone
            // lends the list its name, as the select's list takes it, rather than React Aria's caret words.
            aria-label={ariaLabelledby || !ariaLabel ? listBoxProps['aria-label'] : ariaLabel}
            aria-labelledby={ariaLabelledby || !ariaLabel ? listBoxProps['aria-labelledby'] : undefined}
            aria-multiselectable={multiple || undefined}
            className={combobox.part('options')}
            data-highlight={byKeys.current ? 'keys' : 'pointer'}
          >
            {!busy &&
              shown.map((node) => {
                const key = node.key;
                const on = manager.isSelected(key);
                const off = state.disabledKeys.has(key);
                return (
                  <li
                    key={String(key)}
                    id={optionId(key)}
                    role="option"
                    data-key={String(key)}
                    aria-selected={on}
                    aria-disabled={off || undefined}
                    className={cx(dropdown.part('item'), combobox.part('option'), key === active ? `${combobox.part('option')}--active` : '')}
                    onMouseEnter={() => {
                      if (off) return;
                      byKeys.current = false;
                      manager.setFocused(true);
                      manager.setFocusedKey(key);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(key)}
                  >
                    {multiple && (
                      <span className={`${checkbox({ size: 'sm' })} ${dropdown.part('checkbox')}`} aria-hidden="true">
                        <span className={cx(checkbox.part('box'), on ? `${checkbox.part('box')}--checked` : '')}>
                          <Icon name="Check" className={checkbox.part('icon')} />
                        </span>
                      </span>
                    )}
                    <span className={`${dropdown.part('text')} ${combobox.part('option-label')}`}>{node.textValue}</span>
                    {!multiple && on && <Icon name="Check" className={`${dropdown.part('icon')} ${combobox.part('check')}`} />}
                  </li>
                );
              })}
          </ul>
          {type === 'loading' && (
            <div className={`${combobox.part('status')} ${combobox.part('status')}--type-loading`}>
              <Spinner size="sm" tone="subtle" label role="none">
                {loadingText}
              </Spinner>
            </div>
          )}
          {type === 'error' && (
            <div className={`${combobox.part('status')} ${combobox.part('status')}--type-error`}>
              <Icon name="Warning" className={combobox.part('status-icon')} />
              <span>{errorText}</span>
            </div>
          )}
          {type === 'no-results' && <div className={`${combobox.part('status')} ${combobox.part('status')}--type-no-results`}>{noResultsText}</div>}
        </div>
        {/* One status region from the start, so a loading or failing list is announced as it appears. The number of
            matches is React Aria's own announcement. */}
        <span className={combobox.part('announcement')} role="status">
          {announcement}
        </span>
      </div>
      {/* A disabled combobox sends nothing with its form, as a disabled native control does. */}
      {name && !multiple && <input type="hidden" name={name} value={chosen ?? ''} disabled={disabled} />}
      {name && multiple && picked.map((v) => <input key={v} type="hidden" name={name} value={v} disabled={disabled} />)}
    </span>
  );
}
readsField(Combobox);
