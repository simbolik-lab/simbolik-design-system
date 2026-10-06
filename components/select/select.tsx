import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type Ref, type RefObject } from 'react';
import { select } from './select.manifest.js';
import { input } from '../input/input.manifest.js';
import { dropdown } from '../dropdown/dropdown.manifest.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue' | 'children'>, VariantProps<typeof select.manifest> {
  options: SelectOption[];
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Shown in the well until a choice is made. */
  placeholder?: string;
  /** Form field name; the value travels in a hidden input. */
  name?: string;
  disabled?: boolean;
  /** A choice must be made. Said on the well; the field around it draws the mark. */
  required?: boolean;
  /**
   * The element the open list stays inside, such as the part of the page whose
   * end the list should not pass. The window and any scrolling part around the
   * select always bound it as well.
   */
  boundary?: RefObject<Element | null>;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Help text or an error message for the well, such as the field's line under it. */
  'aria-describedby'?: string;
  /** Reaches the well, the button that opens the list, e.g. to focus it when a form is sent with no choice made. */
  ref?: Ref<HTMLButtonElement>;
}

/** How long typed letters keep adding to one search before a new one starts. */
const TYPE_AHEAD_MS = 500;

/** The first scrolling or clipping part around an element, and each one after it, up to the page. */
function clippers(el: Element): Element[] {
  const out: Element[] = [];
  for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
    const { overflowX, overflowY } = getComputedStyle(p);
    if (overflowX !== 'visible' || overflowY !== 'visible') out.push(p);
  }
  return out;
}

/**
 * Select: a button that opens a list of choices. Closed it is the input's well; open, the
 * list is the dropdown panel and every choice a dropdown item, at the select's size.
 * Its label and help text come from the field around it (Field).
 * Arrow keys move the highlight, Enter and Space choose, Escape and Tab close, and a
 * click outside or focus moving away closes. Typing jumps to the choice that starts with what was
 * typed. The value also lives in a hidden input for forms.
 *
 * The open list never runs past the room it has: the window, any scrolling
 * part around the select and the `boundary`, keeping from each the gap it
 * keeps from the well. A longer list scrolls inside itself, and opens above
 * the well when there is more room there (`data-side="above"`, for the
 * stylesheet). It opens scrolled to the chosen option, and the keyboard's
 * highlight is kept in view.
 */
export function Select({ size, error, open: _open, options, value, defaultValue, onChange, placeholder, name, disabled, required, boundary, className, id, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, ref, ...rest }: SelectProps) {
  const reactId = useId();
  const baseId = id ?? `select${reactId}`;
  const listId = `${baseId}-list`;
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const root = useRef<HTMLSpanElement>(null);
  const well = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  // How the highlight last moved: only the keyboard scrolls the list to it,
  // because scrolling under a resting pointer would move a new option under it.
  const byKeys = useRef(false);
  const typed = useRef({ text: '', at: 0 });
  const chosen = options.find((o) => o.value === current);
  // The well is the select's own and the page's: both refs reach the same button.
  const wellRef = useCallback(
    (el: HTMLButtonElement | null) => {
      well.current = el;
      if (typeof ref === 'function') {
        const cleanup = ref(el);
        if (typeof cleanup !== 'function') return undefined;
        return () => {
          well.current = null;
          cleanup();
        };
      }
      if (ref) ref.current = el;
      return undefined;
    },
    [ref],
  );

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);

  // Place the list before it paints: which side of the well, and how tall it may be.
  // The side is chosen once per opening; the height follows the page as it scrolls.
  useLayoutEffect(() => {
    const l = list.current;
    const w = well.current;
    if (!open || !l || !w) return undefined;
    delete l.dataset.side;
    // The gap the stylesheet puts between the well and the list, read from offsets, which the drop-in motion does not move.
    const gap = l.offsetTop - w.offsetTop - w.offsetHeight;
    const room = () => {
      let top = gap;
      let bottom = window.innerHeight - gap;
      const edges = clippers(l).map((c) => c.getBoundingClientRect());
      const b = boundary?.current;
      if (b) edges.push(b.getBoundingClientRect());
      for (const r of edges) {
        top = Math.max(top, r.top + gap);
        bottom = Math.min(bottom, r.bottom - gap);
      }
      const wr = w.getBoundingClientRect();
      return { below: bottom - wr.bottom - gap, above: wr.top - gap - top };
    };
    // The list's own height, whatever it is allowed now: its content and its edge.
    const natural = () => l.scrollHeight + l.offsetHeight - l.clientHeight;
    const first = room();
    const above = natural() > first.below && first.above > first.below;
    if (above) l.dataset.side = 'above';
    const fit = () => {
      const r = room();
      const space = above ? r.above : r.below;
      // Never so short it stops being a list: at least three rows, whatever the room.
      const row = (l.querySelector('[role="option"]') as HTMLElement | null)?.offsetHeight ?? 0;
      const least = Math.min(natural(), row * 3 + l.offsetHeight - l.clientHeight);
      l.style.maxHeight = natural() > space ? `${Math.max(space, least)}px` : '';
    };
    fit();
    // Open on the chosen option, in the middle of the list where it can be.
    const on = l.querySelector('[aria-selected="true"]') as HTMLElement | null;
    if (on) l.scrollTop = on.offsetTop - (l.clientHeight - on.offsetHeight) / 2;
    const onScroll = (e: Event) => {
      if (e.target instanceof Node && l.contains(e.target)) return;
      fit();
    };
    window.addEventListener('resize', fit);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, boundary]);

  // Keep the keyboard's highlight in view inside the list, clear of its padding.
  useLayoutEffect(() => {
    const l = list.current;
    if (!open || !l || !byKeys.current) return;
    const o = l.children[highlight] as HTMLElement | undefined;
    if (!o) return;
    const pad = Number.parseFloat(getComputedStyle(l).paddingTop) || 0;
    if (o.offsetTop - pad < l.scrollTop) l.scrollTop = o.offsetTop - pad;
    else if (o.offsetTop + o.offsetHeight + pad > l.scrollTop + l.clientHeight) l.scrollTop = o.offsetTop + o.offsetHeight + pad - l.clientHeight;
  }, [open, highlight]);

  const choose = (o: SelectOption) => {
    if (o.disabled) return;
    if (value === undefined) setInternal(o.value);
    onChange?.(o.value);
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
  const typeAhead = (key: string) => {
    const now = Date.now();
    const text = (now - typed.current.at < TYPE_AHEAD_MS ? typed.current.text : '') + key.toLowerCase();
    typed.current = { text, at: now };
    const same = [...text].every((c) => c === text[0]);
    const find = same ? text[0]! : text;
    const from = open ? highlight : options.findIndex((o) => o.value === current);
    for (let n = text.length === 1 || same ? 1 : 0; n <= options.length; n++) {
      const i = (Math.max(from, 0) + n) % options.length;
      const o = options[i];
      if (o && !o.disabled && o.label.toLowerCase().startsWith(find)) {
        if (!open) show(i);
        byKeys.current = true;
        setHighlight(i);
        return;
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const typing = Date.now() - typed.current.at < TYPE_AHEAD_MS && typed.current.text !== '';
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key !== ' ' || typing)) {
      e.preventDefault();
      typeAhead(e.key);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) show();
      else move(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) show();
      else if (options[highlight]) choose(options[highlight]!);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Tab' && open) {
      // Tab closes the list and moves on as usual; it chooses nothing.
      setOpen(false);
    } else if ((e.key === 'Home' || e.key === 'End') && open) {
      // The first or the last choice that can be chosen; a disabled one is passed over, as the arrows do.
      e.preventDefault();
      const enabled = options.flatMap((o, i) => (o.disabled ? [] : [i]));
      const to = e.key === 'Home' ? enabled[0] : enabled[enabled.length - 1];
      if (to === undefined) return;
      byKeys.current = true;
      setHighlight(to);
    }
  };

  const classes = [select({ size, error, open }), className].filter(Boolean).join(' ');
  return (
    <span ref={root} className={classes} {...rest}>
      <button
        ref={wellRef}
        type="button"
        id={baseId}
        className={`${input({ size, error })} ${select.part('well')}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        // The list is in the page only while it is open, so the button names it only then: ARIA 1.2 asks for
        // aria-controls while the popup shows, and a name pointing at nothing is ignored at best.
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && highlight >= 0 ? `${listId}-${highlight}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-required={required ? true : undefined}
        aria-describedby={ariaDescribedby}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        // Focus moving anywhere outside closes the list. A blur with nowhere to go is a click, handled above.
        onBlur={(e) => {
          if (open && e.relatedTarget && !root.current?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
      >
        <span className={[select.part('value'), chosen ? '' : `${select.part('value')}--placeholder`].filter(Boolean).join(' ')}>{chosen ? chosen.label : placeholder ?? ''}</span>
        <Icon name="CaretDown" className={select.part('icon')} />
      </button>
      {open && (
        <ul ref={list} id={listId} role="listbox" className={`${dropdown({ size })} ${select.part('list')}`} aria-labelledby={ariaLabelledby ?? (ariaLabel ? undefined : baseId)} aria-label={ariaLabel}>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={o.value === current}
              aria-disabled={o.disabled ? true : undefined}
              className={[dropdown.part('item'), select.part('option'), i === highlight ? `${select.part('option')}--highlighted` : ''].filter(Boolean).join(' ')}
              onMouseEnter={() => {
                byKeys.current = false;
                setHighlight(i);
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(o)}
            >
              <span className={`${dropdown.part('text')} ${select.part('option-label')}`}>{o.label}</span>
              {o.value === current && <Icon name="Check" className={`${dropdown.part('icon')} ${select.part('check')}`} />}
            </li>
          ))}
        </ul>
      )}
      {/* A disabled select sends nothing with its form, as a disabled native control does. */}
      {name && <input type="hidden" name={name} value={current ?? ''} disabled={disabled} />}
    </span>
  );
}
