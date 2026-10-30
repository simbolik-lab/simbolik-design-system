'use client';

import { Fragment, useEffect, useId, type HTMLAttributes, type ReactNode } from 'react';
import { table } from './table.manifest.js';
import { Badge } from '../badge/badge.js';
import { Button } from '../button/button.js';
import { Checkbox } from '../checkbox/checkbox.js';
import { Dropdown } from '../dropdown/dropdown.js';
import { Icon } from '../icon/icon.js';
import { Popover, PopoverBody } from '../popover/popover.js';
import { progress } from '../progress/progress.manifest.js';
import { useControllable } from '../controllable.js';
import { useScrollRegion } from '../scroll-hint.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/** A filter in a column's heading: a funnel button opening a list of choices that tick. */
export interface TableColumnFilter {
  /** The choices: DropdownItem elements, each given `checked` and `onCheckedChange`, so each ticks and the list stays open. */
  items: ReactNode;
  /** How many filters apply now. Above zero, a count shows beside the button and its name says it ("Filter Status, 2 applied"). */
  count?: number;
}

export interface TableColumn {
  key: string;
  header: ReactNode;
  /**
   * The heading in words, for the names of its buttons ("Filter Status", "About Status"), when `header` is not plain
   * text. Defaults to `header` when that is a string, else to the key.
   */
  label?: string;
  /** A sentence explaining the heading: a quiet info button after it opens it in a popover. */
  info?: string;
  /** The heading sorts the rows when pressed. */
  sortable?: boolean;
  /** Where the column lines up its heading and cells: `end` for figures, so they line up on their last digit. */
  align?: 'start' | 'end';
  /** The column holds sentences: its cells wrap, between the prose column's narrowest and widest measure, and the row aligns to the top. */
  prose?: boolean;
  /** A filter button in the heading, after the sort arrow. */
  filter?: TableColumnFilter;
}

export interface TableRow {
  id: string;
  cells: Record<string, ReactNode>;
  /** The row's name in words, for the names of its controls ("Choose Orion Reach", "Details for Orion Reach"). Defaults to "row <id>" for the checkbox and to the id for the caret. */
  label?: string;
  disabled?: boolean;
  /** Kept at the top for the reader: a brand edge at the start and a pin, which says "Pinned" to screen readers. */
  pinned?: boolean;
  /** Tinted to draw the eye, as a linked or matching record. The tint says nothing to a screen reader: say why in words too. */
  highlighted?: boolean;
  /** A strong rule above the row, to separate groups without a heading. */
  ruleAbove?: boolean;
  /** What the row unfolds: a caret button at its start opens a row under it, across every column, holding this. */
  detail?: ReactNode;
  /**
   * In a selectable table, whether this row can be chosen. A row that cannot has no checkbox, its room kept empty so
   * the column lines up, and the heading's checkbox leaves it out. Every row can unless set to false.
   */
  selectable?: boolean;
  /** Attributes of the page's own for the row element, such as `'data-issue': '42'`, for its scripts, checks and links. */
  [attribute: `data-${string}`]: string | number | boolean | undefined;
}

/** A row's own data attributes, for its row element. */
const dataAttributes = (r: TableRow) => Object.fromEntries(Object.entries(r).filter(([key]) => key.startsWith('data-')));

/** A group heading: one cell across the row, a label and an optional count, starting the rows under it. */
export interface TableGroupRow {
  id: string;
  group: ReactNode;
  /** How many rows the group holds, after the label in the subtle color. */
  count?: ReactNode;
  /** A strong rule above the heading. */
  ruleAbove?: boolean;
}

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'>, VariantProps<typeof table.manifest> {
  /** Accessible name of the table, read by screen readers and not shown. */
  caption: string;
  columns: TableColumn[];
  /** The rows, and the group headings among them; each heading starts a group of the rows after it. */
  rows: (TableRow | TableGroupRow)[];
  /** Rows can be chosen with a checkbox in the first column. */
  selectable?: boolean;
  /** Ids of the chosen rows. */
  selected?: string[];
  onSelect?: (id: string, checked: boolean) => void;
  /** The heading's checkbox, pressed: the page then chooses, or lets go of, every row that can be chosen. */
  onSelectAll?: (checked: boolean) => void;
  /** Which column is sorted, and which way. */
  sort?: { key: string; direction: 'asc' | 'desc' };
  onSort?: (key: string) => void;
  /** Ids of the rows whose detail is open. Without it the table keeps the open rows itself, starting from `defaultExpanded`. */
  expanded?: string[];
  /** The rows open at first, when the table keeps them itself. */
  defaultExpanded?: string[];
  /** Called when a row's caret is pressed, with the row and whether it is now open. */
  onExpandedChange?: (id: string, open: boolean) => void;
  /** The foot, usually two paginations: a range on the left, numbers on the right. */
  footer?: ReactNode;
  /**
   * The names the table gives its own controls, each in English unless given, for a page in another language. The
   * heading's checkbox: "Choose every row".
   */
  selectAllLabel?: string;
  /** A row's checkbox, given the row: "Choose " and the row's label, or "row " and its id without one. */
  selectRowLabel?: (row: TableRow) => string;
  /** A row's caret, given the row: "Details for " and the row's label, or its id. */
  detailsLabel?: (row: TableRow) => string;
  /** What a pinned row's pin says to a screen reader: "Pinned". */
  pinnedLabel?: string;
  /** A heading's filter button, given the heading in words and how many filters apply: "Filter Status, 2 applied". */
  filterLabel?: (column: string, count: number) => string;
  /** A heading's info button, given the heading in words: "About Status". */
  infoLabel?: (column: string) => string;
}

const englishSelectRow = (r: TableRow) => `Choose ${r.label ?? `row ${r.id}`}`;
const englishDetails = (r: TableRow) => `Details for ${r.label ?? r.id}`;
const englishFilter = (column: string, count: number) => (count > 0 ? `Filter ${column}, ${count} applied` : `Filter ${column}`);
const englishInfo = (column: string) => `About ${column}`;

/** A cell's value: text with an optional icon before it, a description under it, and a copy control after it. */
export function TableValue({ icon, description, copy, copyLabel = 'Copy', children }: {
  icon?: string;
  description?: ReactNode;
  copy?: string;
  /** The copy control's name, what a screen reader says for it. "Copy" unless given, for a page in another language. */
  copyLabel?: string;
  children: ReactNode;
}) {
  return (
    <span className={table.part('content')}>
      <span className={table.part('value')}>
        {icon && <Icon name={icon} className={table.part('value-icon')} />}
        {description ? (
          <span className={table.part('stack')}>
            <span>{children}</span>
            <span className={table.part('description')}>{description}</span>
          </span>
        ) : (
          children
        )}
      </span>
      {copy !== undefined && (
        <button type="button" className={table.part('copy')} aria-label={copyLabel} onClick={() => navigator.clipboard.writeText(copy)}>
          <Icon name="Copy" />
        </button>
      )}
    </span>
  );
}

/** Anything placed in a cell that is not a plain value: an avatar beside a link, a tag, a badge, a row of actions. */
export function TableContent({ children }: { children: ReactNode }) {
  return <span className={table.part('content')}>{children}</span>;
}

/**
 * A figure with a bar after it, the progress track filled to `value` of `max`. The figure is the value, read as text;
 * the bar repeats it for the eye and is hidden from screen readers.
 */
export function TableBar({ value, max = 100, children }: { value: number; max?: number; children: ReactNode }) {
  const share = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <span className={table.part('content')}>
      <span className={table.part('figure')}>{children}</span>
      <span className={`${progress({ tone: 'default' })} ${table.part('bar')}`} aria-hidden="true">
        <span className={progress.part('track')}>
          <span className={progress.part('fill')} style={{ width: `${share}%` }} />
        </span>
      </span>
    </span>
  );
}

/** What an open row shows under it: a title over a few lines, or anything the page puts in. */
export function TableDetail({ title, children }: { title?: ReactNode; children?: ReactNode }) {
  return (
    <>
      {title && <p className={table.part('detail-title')}>{title}</p>}
      {children}
    </>
  );
}

/** The sort arrow: its direction on the sorted column, both ways on the others. */
const sortIcon = (direction?: 'asc' | 'desc') => (direction === 'asc' ? 'ArrowUp' : direction === 'desc' ? 'ArrowDown' : 'ArrowsDownUp');

const isGroup = (r: TableRow | TableGroupRow): r is TableGroupRow => 'group' in r;

/** A column's heading in words. */
const columnName = (c: TableColumn) => c.label ?? (typeof c.header === 'string' ? c.header : c.key);

/** The rows cut into groups: the rows before the first heading, then each heading with the rows after it. */
function groups(rows: (TableRow | TableGroupRow)[]) {
  const out: { heading?: TableGroupRow; rows: TableRow[] }[] = [];
  for (const r of rows) {
    if (isGroup(r)) out.push({ heading: r, rows: [] });
    else if (out.length === 0) out.push({ rows: [r] });
    else out[out.length - 1]!.rows.push(r);
  }
  return out.length ? out : [{ rows: [] }];
}

/** Table: a real table element inside a bordered frame, with the heading row, the rows and the foot. */
export function Table({ caption, columns, rows, selectable, selected = [], onSelect, onSelectAll, sort, onSort, expanded, defaultExpanded = [], onExpandedChange, footer, selectAllLabel = 'Choose every row', selectRowLabel = englishSelectRow, detailsLabel = englishDetails, pinnedLabel = 'Pinned', filterLabel = englishFilter, infoLabel = englishInfo, className, 'sticky-header': stickyHeader, 'pin-first': pinFirst, ...rest }: TableProps) {
  // A frame that scrolls, up and down or sideways, is a region the keyboard can reach and a screen reader can name.
  const { frame, thumb, region } = useScrollRegion({ label: caption, always: !!stickyHeader, bar: 'both' });
  // The pinned first column lies over the columns that scroll under it. Its width reaches the stylesheet, which on a
  // touch screen keeps what the frame scrolls into view (a focused cell, a button) out from under it.
  useEffect(() => {
    const el = frame.current;
    const first = el?.querySelector<HTMLElement>('thead th');
    if (!pinFirst || !el || !first || !('ResizeObserver' in window)) return undefined;
    const update = () => el.style.setProperty('--smbk-table-pinned-width', `${first.getBoundingClientRect().width}px`);
    update();
    const watch = new ResizeObserver(update);
    watch.observe(first);
    return () => {
      watch.disconnect();
      el.style.removeProperty('--smbk-table-pinned-width');
    };
  }, [frame, pinFirst]);
  const id = useId();
  // onExpandedChange names the row and whether it opened, so the table calls it itself.
  const [open, setOpen] = useControllable({ value: expanded, defaultValue: defaultExpanded, name: 'Table' });
  const toggle = (rowId: string) => {
    const next = !open.includes(rowId);
    setOpen(next ? [...open, rowId] : open.filter((k) => k !== rowId));
    onExpandedChange?.(rowId, next);
  };
  const header = table.part('header');
  const cell = table.part('cell');
  const row = table.part('row');
  const data = rows.filter((r): r is TableRow => !isGroup(r));
  // The heading's checkbox speaks for the rows that can be chosen; with none, it cannot be pressed.
  const choosable = data.filter((r) => r.selectable !== false);
  const allChosen = choosable.length > 0 && choosable.every((r) => selected.includes(r.id));
  const someChosen = !allChosen && choosable.some((r) => selected.includes(r.id));
  // A table with a row that opens or a pinned row gives every first cell the same leading room, so its columns line up.
  const lead = data.some((r) => r.detail !== undefined || r.pinned);

  const heading = (c: TableColumn, i: number) => {
    const active = sort?.key === c.key;
    const end = c.align === 'end';
    const name = columnName(c);
    const label = <span className={table.part('header-label')}>{c.header}</span>;
    const arrow = c.sortable && <Icon name={sortIcon(active ? sort?.direction : undefined)} className={table.part('header-icon')} />;
    const count = c.filter?.count ?? 0;
    return (
      <th
        key={c.key}
        scope="col"
        className={cx(header, active ? `${header}--active` : '', end ? `${header}--align-end` : '')}
        aria-sort={active ? (sort?.direction === 'asc' ? 'ascending' : 'descending') : undefined}
      >
        <span className={table.part('header-cell')}>
          {lead && i === 0 && <span className={table.part('lead')} />}
          {selectable && i === 0 && <Checkbox size="sm" tone="subtle" aria-label={selectAllLabel} checked={allChosen} indeterminate={someChosen} disabled={choosable.length === 0 || undefined} onChange={(e) => onSelectAll?.(e.target.checked)} />}
          {c.sortable ? (
            // In a column lined up at the end the arrow comes first, so the label meets the figures' edge.
            <button type="button" className={table.part('sort')} onClick={() => onSort?.(c.key)}>
              {end && arrow}
              <span className={table.part('header-text')}>{label}</span>
              {!end && arrow}
            </button>
          ) : (
            <span className={table.part('header-text')}>{label}</span>
          )}
          {c.filter && (
            <>
              <Dropdown
                label={filterLabel(name, 0)}
                align={end ? 'end' : 'start'}
                trigger={<Button tone="ghost" size="xs" icon="Funnel" icon-only aria-label={filterLabel(name, count)} className={table.part('filter')} />}
              >
                {c.filter.items}
              </Dropdown>
              {count > 0 && <Badge size="sm" className={table.part('filter-count')} aria-hidden="true">{count}</Badge>}
            </>
          )}
          {c.info && (
            <Popover label={infoLabel(name)} align={end ? 'end' : 'start'} trigger={<Button tone="ghost" size="xs" icon="Info" icon-only aria-label={infoLabel(name)} className={table.part('info')} />}>
              <PopoverBody>{c.info}</PopoverBody>
            </Popover>
          )}
        </span>
      </th>
    );
  };

  const dataRow = (r: TableRow) => {
    const isOpen = r.detail !== undefined && open.includes(r.id);
    const detailId = `${id}-${r.id}-detail`;
    const choosable = selectable && r.selectable !== false;
    const classes = cx(
      row,
      r.disabled ? `${row}--disabled` : '',
      choosable && selected.includes(r.id) ? `${row}--selected` : '',
      r.pinned ? `${row}--pinned` : '',
      r.highlighted ? `${row}--highlighted` : '',
      r.ruleAbove ? `${row}--rule-above` : '',
    );
    const first = (content: ReactNode) => {
      const chosen = selectable ? (
        <span className={table.part('content')}>
          {choosable ? (
            <Checkbox size="sm" tone="subtle" aria-label={selectRowLabel(r)} checked={selected.includes(r.id)} disabled={r.disabled} onChange={(e) => onSelect?.(r.id, e.target.checked)} />
          ) : (
            <span className={table.part('choose-space')} />
          )}
          {content}
        </span>
      ) : (
        content
      );
      if (!lead) return chosen;
      return (
        <span className={table.part('start')}>
          <span className={table.part('lead')}>
            {r.pinned && <Icon name="PushPin" label={pinnedLabel} className={table.part('pin')} />}
            {r.detail !== undefined && (
              <button type="button" className={table.part('expander')} aria-expanded={isOpen} aria-controls={detailId} aria-label={detailsLabel(r)} onClick={() => toggle(r.id)}>
                <Icon name={isOpen ? 'CaretDown' : 'CaretRight'} />
              </button>
            )}
          </span>
          {chosen}
        </span>
      );
    };
    return (
      <Fragment key={r.id}>
        <tr {...dataAttributes(r)} className={classes} aria-disabled={r.disabled ? true : undefined}>
          {columns.map((c, i) => {
            const body = c.prose ? <div className={table.part('prose')}>{r.cells[c.key]}</div> : r.cells[c.key];
            return (
              <td key={c.key} className={cx(cell, c.align === 'end' ? `${cell}--align-end` : '', c.prose ? `${cell}--type-prose` : '')}>
                {i === 0 ? first(body) : body}
              </td>
            );
          })}
        </tr>
        {r.detail !== undefined && (
          <tr id={detailId} className={`${row} ${table.part('detail-row')}`} hidden={!isOpen}>
            <td colSpan={columns.length} className={table.part('detail')}>{r.detail}</td>
          </tr>
        )}
      </Fragment>
    );
  };

  return (
    <div
      ref={frame}
      className={cx(table({ 'sticky-header': stickyHeader, 'pin-first': pinFirst }), className)}
      {...region}
      {...rest}
    >
      <table className={table.part('table')}>
        <caption className={table.part('caption')}>{caption}</caption>
        <thead>
          <tr className={table.part('header-row')}>{columns.map(heading)}</tr>
        </thead>
        {/* Each group heading starts a body of its own, the group its scope names. */}
        {groups(rows).map((g, gi) => (
          <tbody key={g.heading?.id ?? `rows-${gi}`}>
            {g.heading && (
              <tr className={cx(row, `${row}--type-group`, g.heading.ruleAbove ? `${row}--rule-above` : '')}>
                <th scope="rowgroup" colSpan={columns.length} className={table.part('group')}>
                  <span className={table.part('group-label')}>
                    {g.heading.group}
                    {g.heading.count !== undefined && <span className={table.part('group-count')}>{g.heading.count}</span>}
                  </span>
                </th>
              </tr>
            )}
            {g.rows.map(dataRow)}
          </tbody>
        ))}
      </table>
      <div className={table.part('scroll-hint')} aria-hidden="true">
        <div className={table.part('scroll-track')}>
          <span ref={thumb} className={table.part('scroll-thumb')} />
        </div>
      </div>
      {footer && <div className={table.part('footer')}>{footer}</div>}
    </div>
  );
}
