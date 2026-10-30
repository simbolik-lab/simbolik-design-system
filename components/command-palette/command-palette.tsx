'use client';

import { isValidElement, useEffect, useId, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { commandPalette } from './command-palette.manifest.js';
import { Icon } from '../icon/icon.js';
import { Kbd } from '../kbd/kbd.js';
import { Label } from '../label/label.js';
import { Chip } from '../chip/chip.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { useGlide } from '../glide.js';
import { useScrollbar } from '../scrollbar.js';
import { useModalDialog } from '../dialog.js';
import { useControllable } from '../controllable.js';
import { cx } from '../variants.js';

export interface Command {
  /** Unique within the palette. */
  id: string;
  label: string;
  /** Phosphor icon name before the label. */
  icon?: string;
  /** A short category after the label, e.g. "Components". Figma: the item's Label toggle. */
  meta?: string;
  /**
   * A second line under the label, such as what the command opens or a snippet of the page it finds.
   * Wrap the words that match a search in `<mark>`: they show one weight bolder, not by color.
   * Figma: the item's Description toggle.
   */
  description?: ReactNode;
  /** The command's own shortcut, drawn as a keycap. Figma: the item's Kbd toggle. */
  shortcut?: string;
  disabled?: boolean;
}

export interface CommandGroup {
  /** The small label over the group. */
  label: string;
  commands: Command[];
  /** Shows the group's "See all" button. Figma: the body's Button toggle. */
  onSeeAll?: () => void;
}

export interface CommandFilter {
  label: string;
  onRemove: () => void;
}

export interface CommandPaletteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'children'> {
  groups: CommandGroup[];
  /** Called when a command is run, by click or by Enter. */
  onSelect?: (command: Command, group: CommandGroup) => void;
  /** Controlled query. */
  query?: string;
  /** Initial query when uncontrolled. */
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Filter the commands by the query here. Turn off when the page filters, e.g. against a server. */
  filter?: boolean;
  /** Filters in force, drawn as removable chips under the search row. Figma: the header's Chips toggle. */
  filters?: CommandFilter[];
  placeholder?: string;
  /** Shown when no command matches. */
  emptyText?: string;
  /** The words screen readers hear as the query changes, given the number of commands shown. Defaults to "12 results". */
  resultsText?: (count: number) => string;
  /** The footer of key hints. */
  hints?: boolean;
  /** Accessible name of the search control. */
  label?: string;
  /**
   * Whether it is open over the page in a modal dialog, with the scrim, when the page holds it. Pair it with
   * onOpenChange. Leave it and defaultOpen out to show the panel in place.
   */
  open?: boolean;
  /**
   * Whether it starts open over the page, when the palette holds its own open state: it then sits in the modal dialog
   * and closes itself. Leave it and open out to show the panel in place.
   */
  defaultOpen?: boolean;
  /**
   * Called with the new state when the palette asks to close (`false`): Escape, and over the page a click on the scrim.
   * Holding its own state, the palette then closes; held by the page, the page closes it.
   */
  onOpenChange?: (open: boolean) => void;
  /** Accessible name of the dialog when open over the page. */
  dialogLabel?: string;
  /** The cross that clears the query: its name, "Clear search" unless given, for a page in another language. */
  clearLabel?: string;
  /** The words on a group's See all button. "See all" unless given. */
  seeAllLabel?: string;
  /** A group's See all button's name, given the group's label: "See all Pages" unless given. */
  seeAllGroupLabel?: (group: string) => string;
  /** A filter chip's remove cross, given the filter's label: "Remove Components" unless given. */
  removeFilterLabel?: (filter: string) => string;
  /** The words of the footer's key hints, each in English unless given: "Navigate", "Select" and "Close". */
  hintLabels?: { navigate?: string; select?: string; close?: string };
}

const englishSeeAll = (group: string) => `See all ${group}`;
const englishRemove = (filter: string) => `Remove ${filter}`;

const countWords = (count: number) => (count === 1 ? '1 result' : `${count} results`);

/** The words of a description given as markup, such as a sentence with a marked word, for the filter. */
const textOf = (node: ReactNode): string => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return '';
};

const matches = (c: Command, q: string) =>
  !q || [c.label, c.meta ?? '', textOf(c.description)].some((text) => text.toLowerCase().includes(q));

/**
 * Command palette. Focus stays in the search control, which is a combo box
 * over one listbox per group; the arrow keys move the highlight across groups,
 * Enter runs the highlighted command and Escape asks to close. Given `open` or
 * `defaultOpen`, it sits over the page in a native modal dialog, which holds
 * focus inside; without either, the panel shows in place. The open state is the
 * page's when given `open`, its own otherwise (controllable.ts); asking to close
 * tells `onOpenChange(false)`.
 */
export function CommandPalette({
  groups,
  onSelect,
  query,
  defaultQuery = '',
  onQueryChange,
  filter = true,
  filters = [],
  placeholder = 'Type a command or search…',
  emptyText = 'No results',
  resultsText = countWords,
  hints = true,
  label = 'Search commands',
  open,
  defaultOpen,
  onOpenChange,
  dialogLabel = 'Command palette',
  clearLabel = 'Clear search',
  seeAllLabel = 'See all',
  seeAllGroupLabel = englishSeeAll,
  removeFilterLabel = englishRemove,
  hintLabels,
  className,
  ...rest
}: CommandPaletteProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Over the page when either says so; shown in place, the open state is never read.
  const overPage = open !== undefined || defaultOpen !== undefined;
  const [opened, setOpened] = useControllable({ value: open, defaultValue: defaultOpen ?? false, onChange: onOpenChange, name: 'CommandPalette open' });
  const close = () => setOpened(false);
  // Over the page, the panel is drawn from the moment the palette opens until it has faded out after closing, so it
  // leaves with the exit motion as the modal does; then it goes, and nothing of it is left in the closed dialog. A click
  // on the scrim around the panel closes it, never one on the panel (dialog.ts).
  const over = useModalDialog(dialog, { open: overPage ? opened : undefined, onClose: close, panel: panelRef });
  const id = useId();
  const [text, keepText] = useControllable({ value: query, defaultValue: defaultQuery, onChange: onQueryChange, name: 'CommandPalette query' });
  const q = text.trim().toLowerCase();
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const bar = useScrollbar(body);

  const visible = useMemo(
    () => groups.map((g) => ({ group: g, commands: filter ? g.commands.filter((c) => matches(c, q)) : g.commands })).filter((g) => g.commands.length > 0),
    [groups, filter, q],
  );
  const flat = useMemo(() => visible.flatMap((g, gi) => g.commands.map((c, ci) => ({ command: c, group: g.group, key: `${gi}-${ci}` }))), [visible]);
  const [highlight, setHighlight] = useState(0);
  // How the highlight last moved: only the keys scroll the body to it, because scrolling under a resting
  // pointer would move another command under it.
  const byKeys = useRef(false);

  useEffect(() => setHighlight(0), [q]);
  // The pointer's fill glides between the commands (glide.ts), and the command it lights is the highlighted one.
  useGlide(body, {
    rows: `.${commandPalette.part('item')}`,
    fill: commandPalette.part('glide'),
    enabled: !overPage || opened,
    onPick: (row) => {
      const i = Number(row.dataset.index);
      if (!Number.isInteger(i)) return;
      byKeys.current = false;
      setHighlight(i);
    },
  });
  // Keep the highlighted command in view by scrolling the body alone; scrolling it into view would move the page too.
  useEffect(() => {
    if (!byKeys.current) return;
    const box = body.current;
    const el = box?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!box || !el) return;
    const b = box.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.top < b.top) box.scrollTop -= b.top - r.top;
    else if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom;
  }, [highlight]);

  const setText = (value: string) => {
    byKeys.current = true;
    keepText(value);
  };

  const run = (i: number) => {
    const hit = flat[i];
    if (hit && !hit.command.disabled) onSelect?.(hit.command, hit.group);
  };

  const move = (step: number) => {
    if (!flat.length) return;
    byKeys.current = true;
    setHighlight((h) => (h + step + flat.length) % flat.length);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      move(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(highlight);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  };

  const listId = (gi: number) => `${id}-list-${gi}`;
  const optionId = (i: number) => `${id}-option-${i}`;
  let index = -1;

  const panel = (
    <div ref={panelRef} className={cx(commandPalette(), className)} {...rest}>
      <div className={commandPalette.part('search')}>
        <Icon name="MagnifyingGlass" className={commandPalette.part('search-icon')} />
        <input
          ref={input}
          type="search"
          className={commandPalette.part('input')}
          placeholder={placeholder}
          aria-label={label}
          role="combobox"
          aria-expanded={flat.length > 0}
          aria-autocomplete="list"
          aria-controls={visible.map((_, gi) => listId(gi)).join(' ') || undefined}
          aria-activedescendant={flat.length ? optionId(highlight) : undefined}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className={commandPalette.part('clear')}
          aria-label={clearLabel}
          onClick={() => {
            setText('');
            input.current?.focus();
          }}
        >
          <Icon name="X" />
        </button>
      </div>
      <Divider />
      {filters.length > 0 && (
        <div className={commandPalette.part('filters')}>
          {filters.map((f) => (
            <Chip key={f.label} tone="outline" size="sm" onRemove={f.onRemove} removeLabel={removeFilterLabel(f.label)}>
              {f.label}
            </Chip>
          ))}
        </div>
      )}
      {/* One live region from the start, so each change of the query is announced: the number of commands
          shown, or the empty text. Nothing is announced before the reader types. */}
      <p className={commandPalette.part('status')} role="status">
        {text ? (flat.length ? resultsText(flat.length) : emptyText) : ''}
      </p>
      <div ref={body} className={commandPalette.part('body')} {...bar}>
        {visible.length === 0 && <p className={commandPalette.part('empty')}>{emptyText}</p>}
        {visible.map(({ group, commands }, gi) => (
          <div key={`${gi}-${group.label}`} className={commandPalette.part('group')}>
            <div className={commandPalette.part('group-header')}>
              <Label as="span" id={`${id}-group-${gi}`} tone="subtle" type="small" className={commandPalette.part('group-label')}>
                {group.label}
              </Label>
              {group.onSeeAll && (
                <Button tone="ghost" size="sm" onClick={group.onSeeAll} aria-label={seeAllGroupLabel(group.label)}>
                  {seeAllLabel}
                </Button>
              )}
            </div>
            <div id={listId(gi)} role="listbox" aria-labelledby={`${id}-group-${gi}`} className={commandPalette.part('list')}>
              {commands.map((c) => {
                index += 1;
                const i = index;
                return (
                  <div
                    key={c.id}
                    id={optionId(i)}
                    role="option"
                    data-index={i}
                    aria-selected={i === highlight}
                    aria-disabled={c.disabled ? true : undefined}
                    className={commandPalette.part('item')}
                    onMouseEnter={() => {
                      byKeys.current = false;
                      setHighlight(i);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => run(i)}
                  >
                    {c.icon && <Icon name={c.icon} className={commandPalette.part('item-icon')} />}
                    {c.description ? (
                      <span className={commandPalette.part('item-text')}>
                        <span className={commandPalette.part('item-label')} data-label={c.label}>{c.label}</span>
                        <span className={commandPalette.part('item-description')}>{c.description}</span>
                      </span>
                    ) : (
                      <span className={commandPalette.part('item-label')} data-label={c.label}>{c.label}</span>
                    )}
                    {c.meta && (
                      <Label as="span" tone="subtle" className={commandPalette.part('item-meta')}>
                        {c.meta}
                      </Label>
                    )}
                    {c.shortcut && (
                      <Kbd size="md" aria-hidden="true">
                        {c.shortcut}
                      </Kbd>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {hints && (
        <div className={commandPalette.part('footer')} aria-hidden="true">
          <Divider />
          <div className={commandPalette.part('hints')}>
            <span className={commandPalette.part('hint')}>
              <Kbd size="md">↑</Kbd>
              <Kbd size="md">↓</Kbd>
              <span className={commandPalette.part('hint-text')}>{hintLabels?.navigate ?? 'Navigate'}</span>
            </span>
            <span className={commandPalette.part('hint')}>
              <Kbd size="md">↵</Kbd>
              <span className={commandPalette.part('hint-text')}>{hintLabels?.select ?? 'Select'}</span>
            </span>
            <span className={commandPalette.part('hint')}>
              <Kbd size="md">esc</Kbd>
              <span className={commandPalette.part('hint-text')}>{hintLabels?.close ?? 'Close'}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (!overPage) return panel;
  return (
    <dialog
      ref={dialog}
      className={commandPalette.part('dialog')}
      aria-label={dialogLabel}
      {...over.props}
    >
      {over.shown && panel}
    </dialog>
  );
}
