'use client';

import { Children, createContext, isValidElement, useCallback, useContext, useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode, type Ref } from 'react';
import { mergeProps } from 'react-aria';
import { list } from './list.manifest.js';
import { Icon } from '../icon/icon.js';
import { Divider } from '../divider/divider.js';
import { useGlide } from '../glide.js';
import { labelText } from '../label-text.js';
import { cx } from '../variants.js';
import { useControllable } from '../controllable.js';
import { useFormReset } from '../form.js';
import { useNameWarning } from '../name-check.js';
import { useTypeAhead } from '../type-ahead.js';
import type { VariantProps } from '../variants.js';

type ListType = NonNullable<VariantProps<typeof list.manifest>['type']>;

interface Choice {
  multiple: boolean;
  chosen: readonly string[];
  /** The option that is the list's one stop in the tab order. */
  active: string | null;
  choose: (value: string) => void;
  setActive: (value: string) => void;
}

interface ListContext {
  type: ListType;
  dividers: boolean;
  /** A selectable list whose chosen row shows without its tick. */
  tickless: boolean;
  choice: Choice | null;
}

const Context = createContext<ListContext>({ type: 'plain', dividers: false, tickless: false, choice: null });

const ROWS: readonly ListType[] = ['navigation', 'action', 'selectable'];

/** The rows the pointer's fill glides between: a link's or a button's row, and an option's. */
const GLIDE_ROWS = `a.${list.part('row')}, button.${list.part('row')}, .${list.part('item')}[role="option"] > .${list.part('row')}`;

export interface ListProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange' | 'defaultValue'>, VariantProps<typeof list.manifest> {
  /** The list's title, which names it. A list without one needs an aria-label. */
  title?: ReactNode;
  /** Makes the title a heading of this level, where it heads a part of the page. Without it the title is a line of text. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** The words shown, in place of the rows, when there are none. */
  emptyText?: ReactNode;
  /** A selectable list: more than one option can be chosen. */
  multiple?: boolean;
  /** A selectable list: the chosen value, or values when multiple, when the page holds the choice. Pair it with onChange. */
  value?: string | readonly string[];
  /** A selectable list: the value, or values, chosen at first, when the list holds its own choice. */
  defaultValue?: string | readonly string[];
  /** A selectable list: called with the chosen value, or every chosen value when multiple, each time the choice changes. */
  onChange?: (value: string | string[]) => void;
  /** A selectable list: sends the chosen values with a form under this name. */
  name?: string;
  children?: ReactNode;
  /** Reaches the list's outer element: a nav for a navigation list, a div otherwise. */
  ref?: Ref<HTMLElement>;
}

const asList = (v: string | readonly string[] | undefined): string[] => (v === undefined ? [] : typeof v === 'string' ? [v] : [...v]);

/**
 * List: a title over a ul or an ol of ListItems, or the empty words when it has none.
 *
 *   plain, bulleted   a ul; numbered an ol. Text rows.
 *   navigation        a nav named by the title, its rows links (href); one may be current.
 *   action            a ul whose rows are buttons (onClick), or hold one in their end content.
 *   selectable        a listbox named by the title; its rows are options. One stop in the tab order:
 *                     the up and down arrows move, Home and End jump to the ends, typing a title's first
 *                     letters moves to it, and Space or Enter chooses. Single by default; multiple
 *                     chooses and unchooses each option. It holds its own choice unless given `value`.
 *                     `tickless` drops the chosen row's tick, for rows that open as they are chosen.
 */
export function List({ type = 'plain', size, dividers = false, tickless = false, title, headingLevel, emptyText = 'Nothing here yet.', multiple = false, value, defaultValue, onChange, name, className, children, ref, ...rest }: ListProps) {
  const titleId = useId();
  // The choice as a list, the page's or the list's own; onChange hears a single value in single mode, so it is told here.
  const [chosen, keep] = useControllable<string[]>({ value: value !== undefined ? asList(value) : undefined, defaultValue: () => asList(defaultValue), name: 'List value' });
  const [active, setActive] = useState<string | null>(() => chosen[0] ?? null);
  const items = useRef<HTMLUListElement>(null);
  const typeAhead = useTypeAhead(500);
  // The rows' ul or ol, whichever the list draws, for the glide.
  const holdItems = useCallback((el: HTMLElement | null) => {
    items.current = el as HTMLUListElement | null;
  }, []);
  // The pointer's fill glides between the rows (glide.ts) when every row can be pressed: options, links or
  // buttons. A list with rows that cannot be pressed keeps each row's own hover, so nothing lights a row
  // that a press would not reach.
  const pressable =
    type === 'selectable' ||
    ((type === 'navigation' || type === 'action') &&
      Children.toArray(children).every((child) => isValidElement<ListItemProps>(child) && (child.props.href !== undefined || child.props.onClick !== undefined)));
  useGlide(items, { rows: GLIDE_ROWS, fill: list.part('glide'), enabled: pressable && Children.count(children) > 0 });
  // The form's reset puts the starting choice back in a selectable list, and tells a page that holds it.
  useFormReset(items, () => {
    const start = asList(defaultValue);
    keep(start);
    setActive(start[0] ?? null);
    if (value !== undefined && (multiple || start[0] !== undefined)) onChange?.(multiple ? start : start[0]!);
  });

  const choose = useCallback(
    (v: string) => {
      const next = multiple ? (chosen.includes(v) ? chosen.filter((c) => c !== v) : [...chosen, v]) : [v];
      keep(next);
      onChange?.(multiple ? next : v);
    },
    [chosen, multiple, onChange, keep],
  );

  const selectable = type === 'selectable';
  const options = () => [...(items.current?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ?? [])];

  // The list's stop in the tab order: the first chosen option, or else the first that can be chosen.
  useEffect(() => {
    if (!selectable) return;
    const all = options();
    if (active !== null && all.some((o) => o.dataset.value === active)) return;
    const first = all.find((o) => chosen.includes(o.dataset.value ?? '')) ?? all[0];
    if (first?.dataset.value !== undefined) setActive(first.dataset.value);
  });

  const go = (to: HTMLElement | undefined) => {
    if (!to) return;
    to.focus();
    if (to.dataset.value !== undefined) setActive(to.dataset.value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const all = options();
    const at = all.findIndex((o) => o === document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      go(all[at === -1 ? 0 : Math.min(all.length - 1, Math.max(0, at + (e.key === 'ArrowDown' ? 1 : -1)))]);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      go(e.key === 'Home' ? all[0] : all[all.length - 1]);
    } else if (e.key === ' ' || e.key === 'Enter') {
      const v = (document.activeElement as HTMLElement | null)?.dataset.value;
      if (at === -1 || v === undefined) return;
      e.preventDefault();
      choose(v);
    } else if (e.key.length === 1 && e.key !== ' ') {
      // Typing moves to the next option whose title starts with what was typed in the last half second.
      go(all[typeAhead.find(e.key, all.map((o) => (o.querySelector(`.${list.part('item-title')}`)?.textContent ?? o.textContent ?? '').trim()), at)]);
    }
  };

  const count = Children.toArray(children).length;
  const classes = cx(list({ type, size, dividers, tickless }), className);
  const Title = headingLevel ? (`h${headingLevel}` as const) : 'p';
  const named = title !== undefined && title !== null && title !== false;
  const ownName = rest['aria-label'] === undefined && rest['aria-labelledby'] === undefined;
  // Unnamed, it warns in development and draws as it is, never thrown.
  useNameWarning(`A ${selectable ? 'choosable' : type} List`, named || !ownName || !(type === 'navigation' || selectable), 'Give it a title or an aria-label.');

  const Items = type === 'numbered' ? 'ol' : 'ul';
  const naming = named ? { 'aria-labelledby': titleId } : { 'aria-label': rest['aria-label'], 'aria-labelledby': rest['aria-labelledby'] };
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...outer } = rest;
  const choice: Choice | null = selectable ? { multiple, chosen, active, choose, setActive } : null;

  const body =
    count === 0 ? (
      <p className={list.part('empty')}>{emptyText}</p>
    ) : selectable ? (
      <ul ref={items} className={list.part('items')} role="listbox" aria-multiselectable={multiple || undefined} {...naming} onKeyDown={onKeyDown}>
        {children}
      </ul>
    ) : (
      // Without its bullets a list stays a list to every screen reader: the role is said outright.
      <Items ref={holdItems} className={list.part('items')} role="list" {...(type === 'navigation' ? {} : naming)}>
        {children}
      </Items>
    );

  const inner = (
    <Context.Provider value={{ type, dividers, tickless, choice }}>
      {named && (
        <Title id={titleId} className={list.part('title')}>
          {title}
        </Title>
      )}
      {body}
      {selectable && name && chosen.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
    </Context.Provider>
  );

  return type === 'navigation' ? (
    <nav ref={ref} className={classes} {...naming} {...outer}>
      {inner}
    </nav>
  ) : (
    <div ref={ref as Ref<HTMLDivElement>} className={classes} {...(outer as HTMLAttributes<HTMLDivElement>)}>
      {inner}
    </div>
  );
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title' | 'onClick'> {
  /** A row's title. Without it the children are the title; in a text list the children are the row's words. */
  title?: ReactNode;
  /** The quiet line under the title. */
  meta?: ReactNode;
  /** Phosphor icon name shown before the title. */
  leadingIcon?: string;
  /** Phosphor icon name shown after the title. A navigation row shows CaretRight unless given another, or false. */
  trailingIcon?: string | false;
  /** Content before the icon and title, such as an avatar at the row's size. */
  start?: ReactNode;
  /** Content at the far end, such as a badge, a time or, in a row that cannot be pressed itself, a button. */
  end?: ReactNode;
  /** Makes the row a link. */
  href?: string;
  /** Where a link row opens: `_blank` opens it in a new tab, and its name then ends with `newTabText`. */
  target?: string;
  /** How a link row's page relates to this one, such as `noopener` or `external`. */
  rel?: string;
  /** What a row opening a new tab adds to its name: "(opens in a new tab)" unless given, for a page in another language. */
  newTabText?: string;
  /** Makes the row a button, called when it is pressed. */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /** The row is where the reader is: aria-current="page". */
  current?: boolean;
  /** The row cannot be pressed or chosen. */
  disabled?: boolean;
  /** A selectable list's value for this option. Give one whenever the page reads the choice. */
  value?: string;
  children?: ReactNode;
  /** Reaches the li. */
  ref?: Ref<HTMLLIElement>;
}

/** One row of a List. Its look follows the list's type, which it reads from the List around it. */
export function ListItem({ title, meta, leadingIcon, trailingIcon, start, end, href, target, rel, newTabText = '(opens in a new tab)', onClick, current, disabled, value, className, children, ...rest }: ListItemProps) {
  const { type, dividers, tickless, choice } = useContext(Context);
  const ownId = useId();
  const titleId = `${ownId}-title`;
  const metaId = `${ownId}-meta`;
  const divider = dividers ? <Divider className={list.part('divider')} aria-hidden="true" /> : null;
  const itemClass = cx(list.part('item'), className);

  if (!ROWS.includes(type)) {
    const words = title ?? children;
    return (
      <li className={itemClass} {...rest}>
        {type === 'bulleted' && <span className={list.part('marker')} aria-hidden="true">•</span>}
        {type === 'numbered' && <span className={list.part('marker')} />}
        <span className={list.part('text')}>{words}</span>
        {divider}
      </li>
    );
  }

  const trailing = trailingIcon ?? (type === 'navigation' ? 'CaretRight' : false);
  // A link row that opens a new tab says so at the end of its name, in words only a screen reader hears; they are
  // left out of the bolder copy of the title, which holds the room of the words seen.
  const newTab = href !== undefined && !choice && target === '_blank';
  const hasMeta = meta !== undefined && meta !== null && meta !== false;
  const inside = (
    <>
      {start !== undefined && start !== null && <span className={list.part('start')}>{start}</span>}
      {leadingIcon && <Icon name={leadingIcon} className={list.part('leading')} />}
      <span className={list.part('body')}>
        <span id={titleId} className={list.part('item-title')} data-label={labelText(title ?? children)}>
          {title ?? children}
          {newTab && <span className="smbk-visually-hidden" data-unseen> {newTabText}</span>}
        </span>
        {hasMeta && <span id={metaId} className={list.part('meta')}>{meta}</span>}
      </span>
      {trailing && <Icon name={trailing} className={list.part('trailing')} />}
      {choice && !tickless && <Icon name="Check" className={list.part('check')} />}
      {end !== undefined && end !== null && <span className={list.part('end')}>{end}</span>}
    </>
  );
  const naming = { 'aria-labelledby': titleId, 'aria-describedby': hasMeta ? metaId : undefined };
  const rowClass = list.part('row');

  if (choice) {
    const key = value ?? ownId;
    const on = choice.chosen.includes(key);
    const press = () => {
      if (!disabled) choice.choose(key);
    };
    return (
      <li
        className={itemClass}
        role="option"
        aria-selected={on}
        aria-disabled={disabled || undefined}
        tabIndex={!disabled && choice.active === key ? 0 : -1}
        data-value={key}
        {...naming}
        {...mergeProps(rest, {
          onClick: (e: MouseEvent<HTMLElement>) => {
            press();
            onClick?.(e);
          },
          onFocus: () => !disabled && choice.setActive(key),
        })}
      >
        <div className={rowClass}>{inside}</div>
        {divider}
      </li>
    );
  }

  const here = current ? ('page' as const) : undefined;
  const row = href !== undefined ? (
    <a className={rowClass} href={disabled ? undefined : href} target={target} rel={rel} role={disabled ? 'link' : undefined} aria-disabled={disabled || undefined} aria-current={here} {...naming} onClick={onClick}>
      {inside}
    </a>
  ) : onClick ? (
    <button type="button" className={rowClass} disabled={disabled} aria-current={here} {...naming} onClick={onClick}>
      {inside}
    </button>
  ) : (
    <div className={rowClass} aria-disabled={disabled || undefined}>
      {inside}
    </div>
  );
  return (
    <li className={itemClass} {...rest}>
      {row}
      {divider}
    </li>
  );
}
