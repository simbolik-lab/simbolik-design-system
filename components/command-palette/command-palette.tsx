import { useEffect, useId, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { commandPalette } from './command-palette.manifest.js';
import { Icon } from '../icon/icon.js';
import { Kbd } from '../kbd/kbd.js';
import { Label } from '../label/label.js';
import { Chip } from '../chip/chip.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';

export interface Command {
  /** Unique within the palette. */
  id: string;
  label: string;
  /** Phosphor icon name before the label. */
  icon?: string;
  /** A short category after the label, e.g. "Components". Figma: the item's Label toggle. */
  meta?: string;
  /** The command's own shortcut, drawn as a keycap. Figma: the item's Kbd toggle. */
  shortcut?: string;
  disabled?: boolean;
}

export interface CommandGroup {
  /** The mono label over the group. */
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
  /** Called on Escape. The page closes the palette and returns focus. */
  onClose?: () => void;
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
  /** The footer of key hints. */
  hints?: boolean;
  /** Accessible name of the search control. */
  label?: string;
  /** Opens the palette over the page in a modal dialog, with the scrim. Leave out to show the panel in place. */
  open?: boolean;
  /** Accessible name of the dialog when open over the page. */
  dialogLabel?: string;
}

const matches = (c: Command, q: string) => !q || c.label.toLowerCase().includes(q) || (c.meta ?? '').toLowerCase().includes(q);

/**
 * Command palette. Focus stays in the search control, which is a combo box
 * over one listbox per group; the arrow keys move the highlight across groups,
 * Enter runs the highlighted command and Escape asks to close. Given `open`,
 * it sits over the page in a native modal dialog, which holds focus inside;
 * without it, the panel shows in place.
 */
export function CommandPalette({
  groups,
  onSelect,
  onClose,
  query,
  defaultQuery = '',
  onQueryChange,
  filter = true,
  filters = [],
  placeholder = 'Type a command or search…',
  emptyText = 'No results',
  hints = true,
  label = 'Search commands',
  open,
  dialogLabel = 'Command palette',
  className,
  ...rest
}: CommandPaletteProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    if (!el || open === undefined) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);
  const id = useId();
  const [internal, setInternal] = useState(defaultQuery);
  const text = query ?? internal;
  const q = text.trim().toLowerCase();
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => groups.map((g) => ({ group: g, commands: filter ? g.commands.filter((c) => matches(c, q)) : g.commands })).filter((g) => g.commands.length > 0),
    [groups, filter, q],
  );
  const flat = useMemo(() => visible.flatMap((g, gi) => g.commands.map((c, ci) => ({ command: c, group: g.group, key: `${gi}-${ci}` }))), [visible]);
  const [highlight, setHighlight] = useState(0);

  useEffect(() => setHighlight(0), [q]);
  // Keep the highlighted command in view by scrolling the body alone; scrolling it into view would move the page too.
  useEffect(() => {
    const box = body.current;
    const el = box?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!box || !el) return;
    const b = box.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.top < b.top) box.scrollTop -= b.top - r.top;
    else if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom;
  }, [highlight]);

  const setText = (value: string) => {
    if (query === undefined) setInternal(value);
    onQueryChange?.(value);
  };

  const run = (i: number) => {
    const hit = flat[i];
    if (hit && !hit.command.disabled) onSelect?.(hit.command, hit.group);
  };

  const move = (step: number) => {
    if (!flat.length) return;
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
      onClose?.();
    }
  };

  const listId = (gi: number) => `${id}-list-${gi}`;
  const optionId = (i: number) => `${id}-option-${i}`;
  let index = -1;

  const panel = (
    <div className={[commandPalette(), className].filter(Boolean).join(' ')} {...rest}>
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
          aria-label="Clear search"
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
            <Chip key={f.label} tone="outline" size="small" onRemove={f.onRemove} removeLabel={`Remove ${f.label}`}>
              {f.label}
            </Chip>
          ))}
        </div>
      )}
      <div ref={body} className={commandPalette.part('body')}>
        {visible.length === 0 && (
          <p className={commandPalette.part('empty')} role="status">
            {emptyText}
          </p>
        )}
        {visible.map(({ group, commands }, gi) => (
          <div key={`${gi}-${group.label}`} className={commandPalette.part('group')}>
            <div className={commandPalette.part('group-header')}>
              <Label as="span" id={`${id}-group-${gi}`} tone="subtle" type="mono" className={commandPalette.part('group-label')}>
                {group.label}
              </Label>
              {group.onSeeAll && (
                <Button tone="ghost" size="sm" trailingIcon="CaretRight" onClick={group.onSeeAll} aria-label={`See all ${group.label}`}>
                  See all
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
                    aria-selected={i === highlight}
                    aria-disabled={c.disabled ? true : undefined}
                    className={commandPalette.part('item')}
                    onMouseEnter={() => setHighlight(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => run(i)}
                  >
                    {c.icon && <Icon name={c.icon} className={commandPalette.part('item-icon')} />}
                    <span className={commandPalette.part('item-label')}>{c.label}</span>
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
              <span className={commandPalette.part('hint-text')}>Navigate</span>
            </span>
            <span className={commandPalette.part('hint')}>
              <Kbd size="md">↵</Kbd>
              <span className={commandPalette.part('hint-text')}>Select</span>
            </span>
            <span className={commandPalette.part('hint')}>
              <Kbd size="md">esc</Kbd>
              <span className={commandPalette.part('hint-text')}>Close</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (open === undefined) return panel;
  return (
    <dialog
      ref={dialog}
      className={commandPalette.part('dialog')}
      aria-label={dialogLabel}
      onCancel={(e) => {
        e.preventDefault();
        onClose?.();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) onClose?.();
      }}
    >
      {open && panel}
    </dialog>
  );
}
