'use client';

import { Fragment, useEffect, useId, type AriaAttributes, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { table, tableColumnWidths, tableMinWidths } from './table.manifest.js';
import { Badge } from '../badge/badge.js';
import { Button } from '../button/button.js';
import { Checkbox } from '../checkbox/checkbox.js';
import { Dropdown } from '../dropdown/dropdown.js';
import { Icon } from '../icon/icon.js';
import { Popover, PopoverBody } from '../popover/popover.js';
import { progress } from '../progress/progress.manifest.js';
import { useControllable } from '../controllable.js';
import { scrollerOf, useScrollRegion } from '../scroll-hint.js';
import { useWarning } from '../name-check.js';
import { cx } from '../variants.js';

/** A filter in a column's heading: a funnel button opening a list of choices that tick. */
export interface TableColumnFilter {
  /** The choices: DropdownItem elements, each given `checked` and `onCheckedChange`, so each ticks and the list stays open. */
  items: ReactNode;
  /** How many filters apply now. Above zero, a count shows beside the button and its name says it ("Filter Status, 2 applied"). */
  count?: number;
}

/** What a column's `width` takes: `rest`, a share of the table (`share-30`), or a size token by its path. */
export type TableColumnWidth = (typeof tableColumnWidths)[number];

/** What the table's `minWidth` takes: `none`, or a size token by its path. */
export type TableMinWidth = (typeof tableMinWidths)[number];

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
  /**
   * The column's width, which it keeps whatever the rows hold: a share of the table (`share-30`), a size token by its
   * path (`size-96`), or `rest`, the room the other columns leave. Give one column a width and the whole table keeps
   * its columns: what a cell holds wraps inside its column, and a column given none takes `rest`.
   */
  width?: TableColumnWidth;
  /**
   * The column is headed by a block, a few lines and buttons, rather than one line: `header` holds it, and the heading
   * grows to fit, the heading row's line under the tallest. Every other heading keeps its one line. A block cannot sit
   * inside a button, so with `sortable` the arrow alone sorts, after the block: give `label`, which names it.
   */
  tallHeader?: boolean;
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
  /**
   * The current row: the one the page's own button in it acted on, such as the part fitted or the plan in use, in a
   * table with or without checkboxes, or a row that can be pressed while what it opened is open. It takes the chosen
   * row's fill and tells screen readers it is the current one (`aria-current`); say it in words in the row too, since
   * not every screen reader announces it on a row.
   */
  current?: boolean;
  /** A strong rule above the row, to separate groups without a heading. */
  ruleAbove?: boolean;
  /**
   * What the row unfolds: a row under it, across every column, holding this. A caret button at the row's start opens
   * it, or, with the table's `detailTrigger="cell"`, a button of the page's own in one of the row's cells.
   */
  detail?: ReactNode;
  /**
   * In a selectable table, whether this row can be chosen. A row that cannot has no checkbox, its room kept empty so
   * the column lines up, and the heading's checkbox leaves it out. Every row can unless set to false.
   */
  selectable?: boolean;
  /**
   * Where a press anywhere on the row goes: the row holds a real link to this address, so it opens in a new tab as any
   * link does. A control in the row keeps its own press. Give the row a `label`, which names the link.
   */
  href?: string;
  /** The row's link opens here, such as `_blank`. Its name then says so, unless the table's `rowPressLabel` is given. */
  target?: string;
  /** The row's link's relation to where it goes, such as `noopener`. */
  rel?: string;
  /**
   * What a press anywhere on the row does. Without `href` the row holds a real button that does this; with `href`, the
   * link does, for a page that moves between its pages itself. A control in the row keeps its own press. Give the row a
   * `label`, which names it.
   */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /** What a press on the row opens, when that is something over the page, such as `dialog`: screen readers say so. */
  'aria-haspopup'?: AriaAttributes['aria-haspopup'];
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

interface TableBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> {
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
  /** Called when a row's caret is pressed, with the row and whether it is now open. With `detailTrigger="cell"` there is no caret, and the page's own button changes `expanded`. */
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
  /** A row's caret and its detail row, given the row: "Details for " and the row's label, or its id. */
  detailsLabel?: (row: TableRow) => string;
  /**
   * The name of what a press on a row does, given the row: "Open " and the row's label, or its id, and "(opens in a new
   * tab)" for a link with the target `_blank`.
   */
  rowPressLabel?: (row: TableRow) => string;
  /** What a pinned row's pin says to a screen reader: "Pinned". */
  pinnedLabel?: string;
  /** A heading's filter button, given the heading in words and how many filters apply: "Filter Status, 2 applied". */
  filterLabel?: (column: string, count: number) => string;
  /** A heading's info button, given the heading in words: "About Status". */
  infoLabel?: (column: string) => string;
  /** A tall heading's sort button, the arrow alone, given the heading in words: "Sort by Status". */
  sortLabel?: (column: string) => string;
  /**
   * Who opens a row's detail. `caret`, the default: a caret the table draws at the start of each row that has one.
   * `cell`: a button of the page's own in one of the row's cells, such as a count that opens the list it counts. The
   * table then draws no caret, and no room at the rows' start unless a row is pinned. Give the table an `id` and hold
   * `expanded`, which the button changes; the button says whether the detail is open (`aria-expanded`) and points at
   * it (`aria-controls`) by the id `tableDetailId(id, row.id)` gives. Without either it warns in development.
   */
  detailTrigger?: 'caret' | 'cell';
  /**
   * How narrow the table gets before its frame scrolls it sideways, as a size token by its path, or `none` to let it
   * narrow with its frame. A table with a column `width` keeps a least width of its own without this.
   */
  minWidth?: TableMinWidth;
  /**
   * `compact` makes this one table compact in a page that is not: its rows, heading row and foot, and what they hold,
   * step down as they do on a compact page, and nothing outside the table changes. It writes `data-density="compact"`
   * on the frame. Left out, the table takes the page's density, so on a compact page it is compact either way.
   */
  density?: 'compact';
  /**
   * Every cell starts at the top of its row instead of in its middle, and its first line sits level with the first line
   * of the others. For cells of very different heights, such as a first column that wraps over a button. A row of one
   * line looks the same either way.
   */
  'align-top'?: boolean;
}

/** The look, and the forms for big tables, which the framed and filled looks take. */
type TableLook =
  | {
      /**
       * Framed, the default: a bordered, rounded frame, the heading row on its own surface, room at the sides. Filled:
       * the same frame and rows, the heading row and the foot on a neutral fill, group rows sunken and low, no lines
       * between headings, and the arrow of a column not sorted only on hover and keyboard focus.
       */
      look?: 'framed' | 'filled';
      /**
       * A long table in a frame of its own: the heading row stays at the frame's top and the foot at its foot while the
       * rows scroll inside the frame, whose height the page limits.
       */
      'sticky-header'?: boolean;
      /**
       * A long table in the page: the frame keeps no height, and while the page scrolls the heading row stays in view
       * under the room the page keeps clear at its top (its scroll padding), and the foot at the window's foot, until
       * the table ends. Not with `sticky-header`: given both, the table takes this one and warns in development.
       */
      'page-sticky-header'?: boolean;
      /** A wide table: the first column stays in view while the table scrolls sideways. For a table on the page canvas. */
      'pin-first'?: boolean;
    }
  | {
      /**
       * Flat, for a small table inside a card: no frame, no heading surface, a rule over every row, no room at the
       * sides, so its words line up with the card's other lines, and rows one line of text high.
       */
      look: 'flat';
      /** Not in the flat look: a long table takes the framed or filled one. Given anyway, it is left out, with a warning in development. */
      'sticky-header'?: false;
      /** Not in the flat look: a long table takes the framed or filled one. Given anyway, it is left out, with a warning in development. */
      'page-sticky-header'?: false;
      /** Not in the flat look: a wide table takes the framed or filled one. Given anyway, it is left out, with a warning in development. */
      'pin-first'?: false;
    };

export type TableProps = TableBaseProps & TableLook;

/**
 * The id of a row's detail row, in the table with the id `tableId`: for the `aria-controls` of a button of the page's
 * own that opens it (`detailTrigger="cell"`). A row's id with no spaces makes a valid one.
 */
export const tableDetailId = (tableId: string, rowId: string) => `${tableId}-${rowId}-detail`;

/**
 * The id of a row's own link or button, the one a press on the row is, in the table with the id `tableId`: for the
 * `openerId` of a Popover that a press on the row opens. A row's id with no spaces makes a valid one.
 */
export const tableRowPressId = (tableId: string, rowId: string) => `${tableId}-${rowId}-press`;

const englishSelectRow = (r: TableRow) => `Choose ${r.label ?? `row ${r.id}`}`;
const englishDetails = (r: TableRow) => `Details for ${r.label ?? r.id}`;
const englishRowPress = (r: TableRow) => `Open ${r.label ?? r.id}${r.target === '_blank' ? ' (opens in a new tab)' : ''}`;
const englishFilter = (column: string, count: number) => (count > 0 ? `Filter ${column}, ${count} applied` : `Filter ${column}`);
const englishInfo = (column: string) => `About ${column}`;
const englishSort = (column: string) => `Sort by ${column}`;

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

/** Whether a value is one of a list's, for a page in plain JavaScript that the types cannot stop. */
const listed = (list: readonly string[], value: string | undefined) => value === undefined || list.includes(value);

/** Whether a press anywhere on the row does something: a row given a link or an action, unless it is disabled. */
const canBePressed = (r: TableRow) => !r.disabled && (r.href !== undefined || r.onClick !== undefined);

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

/** What moves in a long table in the page: the heading's cells, and at the foot the scroll hint, the foot and the
 *  scrollbar's sideways track. */
const PAGE_HOLD = {
  head: ':scope > .smbk-table__table > thead > tr > th',
  foot: ':scope > :is(.smbk-table__scroll-hint, .smbk-table__footer), :scope > .smbk-scrollbar .smbk-scrollbar__track--x',
  name: 'table',
};

/**
 * Table: a real table element inside a frame, with the heading row, the rows and the foot. The frame is bordered and
 * rounded, or, in the flat look for a table inside a card, unseen; the filled look is the same table with its heading
 * and foot on a neutral fill, all of it drawn by the stylesheet. A flat table takes none of the long and pinned
 * forms: given one, it draws without it and warns in development. A long table holds its heading row in a frame of
 * limited height (`sticky-header`) or in the page (`page-sticky-header`), not both: given both, it takes the page. A
 * row's detail opens from a caret at the row's start, or from a button of the page's own in a cell
 * (`detailTrigger="cell"`), which then needs the table's `id` and `expanded`: without them it warns in development.
 * A column with a `width` makes the table keep every column's width while its rows change, down to its `minWidth`. A
 * column with `tallHeader` holds a block in its heading; a long form keeps what it scrolls into view clear of that
 * heading, and lets it scroll with the rows while it would take more than half of what shows.
 * A row given an `href` or an `onClick` can be pressed as a whole: it holds one real link or button, which the
 * stylesheet lays over it and under the controls in its cells, so a press on a control never reaches the row's.
 * `density="compact"` writes the system's density attribute on the frame, so one table can sit tighter than its page.
 */
export function Table({ caption, columns, rows, selectable, selected = [], onSelect, onSelectAll, sort, onSort, expanded, defaultExpanded = [], onExpandedChange, footer, selectAllLabel = 'Choose every row', selectRowLabel = englishSelectRow, detailsLabel = englishDetails, rowPressLabel = englishRowPress, pinnedLabel = 'Pinned', filterLabel = englishFilter, infoLabel = englishInfo, sortLabel = englishSort, className, look, 'sticky-header': stickyAsked, 'page-sticky-header': pageAsked, 'pin-first': pinAsked, 'align-top': alignTop, detailTrigger = 'caret', minWidth, density, ...rest }: TableProps) {
  // The sticking heading and the held column paint a surface of their own, which a card around a flat table would not match.
  const flat = look === 'flat';
  useWarning(flat && Boolean(stickyAsked || pageAsked || pinAsked), 'A flat Table takes none of sticky-header, page-sticky-header and pin-first, since their sticking cells paint a surface of their own that a card would not match. It is drawn without them: use the framed or filled look for a long or wide table.');
  // The heading row is held in the page or in a frame of limited height, not both: in the page, the frame keeps no height.
  useWarning(!flat && Boolean(stickyAsked && pageAsked), 'A Table takes sticky-header or page-sticky-header, not both: it is drawn with page-sticky-header, the heading row held in the page, so give its frame no height of its own.');
  const pageHeader = !flat && Boolean(pageAsked);
  const stickyHeader = !flat && !pageHeader && Boolean(stickyAsked);
  const pinFirst = !flat && Boolean(pinAsked);
  // A frame that scrolls, up and down or sideways, is a region the keyboard can reach and a screen reader can name.
  // In the page it scrolls only sideways, and its heading and foot follow the page's scroll.
  const { frame, thumb, region } = useScrollRegion({ label: caption, always: stickyHeader, bar: pageHeader ? 'x' : 'both', hold: pageHeader ? PAGE_HOLD : undefined });
  // In a frame of its own the foot sticks to the frame's foot, and the scroll hint sits on it: the stylesheet reads its height.
  const footed = Boolean(footer);
  useEffect(() => {
    const el = frame.current;
    const foot = el?.querySelector<HTMLElement>(':scope > .smbk-table__footer');
    if (!stickyHeader || !el || !foot || !('ResizeObserver' in window)) return undefined;
    const update = () => el.style.setProperty('--smbk-table-foot-height', `${foot.getBoundingClientRect().height}px`);
    update();
    const watch = new ResizeObserver(update);
    watch.observe(foot);
    return () => {
      watch.disconnect();
      el.style.removeProperty('--smbk-table-foot-height');
    };
  }, [frame, stickyHeader, footed]);
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
  // A detail row's id starts with the table's: the page's, so its own button can point at it, or one of the table's own.
  const ownId = useId();
  const tableId = rest.id ?? ownId;
  // With the page's own button, the page holds which rows are open and needs the detail rows' ids.
  const caret = detailTrigger !== 'cell';
  useWarning(!caret && (expanded === undefined || rest.id === undefined), 'A Table whose rows open from a button of the page\'s own (detailTrigger="cell") needs expanded, which that button changes, and an id, from which tableDetailId gives each detail row\'s id for the button\'s aria-controls.');
  // onExpandedChange names the row and whether it opened, so the table calls it itself.
  const [open, setOpen] = useControllable({ value: expanded, defaultValue: defaultExpanded, name: 'Table' });
  const toggle = (rowId: string) => {
    const next = !open.includes(rowId);
    setOpen(next ? [...open, rowId] : open.filter((k) => k !== rowId));
    onExpandedChange?.(rowId, next);
  };
  // A width is a proportion or a token, never a number: anything else is left out, and the column takes the rest.
  useWarning(!columns.every((c) => listed(tableColumnWidths, c.width)), 'A Table column\'s width is a share of the table, a size token or "rest", never a number: see TableColumnWidth. The column takes the rest of the room.');
  useWarning(!listed(tableMinWidths, minWidth), 'A Table\'s minWidth is a size token or "none", never a number: see TableMinWidth. The table keeps the least width it would have without it.');
  // Compact is the one density a table takes for itself: a page's own is set on the page.
  const compact = density === 'compact';
  useWarning(density !== undefined && !compact, 'A Table\'s density is "compact" or left out: the table then takes the density of the page. Anything else is left out.');
  // One column with a width and the table keeps them all: it is laid out from its column elements, never from its rows.
  const fixed = columns.some((c) => c.width !== undefined);
  // A sort button holding no words has only its name, and a block's words cannot give it one.
  useWarning(columns.some((c) => c.tallHeader && c.sortable && c.label === undefined && typeof c.header !== 'string'), 'A Table column with tallHeader and sortable needs a label: its sort button is the arrow alone, named from the label. Without one it is named from the column\'s key.');
  // A heading can stand taller than a line when it is tall, or when a long one wraps in a column with a width. Its
  // height reaches the stylesheet, which keeps what a long form scrolls into view clear of it. Held in view, a heading
  // taller than half of what shows would cover the rows, so the frame is marked and the heading scrolls with them.
  const growing = fixed || columns.some((c) => c.tallHeader);
  useEffect(() => {
    const el = frame.current;
    const head = el?.querySelector<HTMLElement>(':scope > .smbk-table__table > thead');
    if (!growing || !(stickyHeader || pageHeader) || !el || !head || !('ResizeObserver' in window)) return undefined;
    // What shows: the frame, or in the page what scrolls it, the nearest part that does or else the window.
    const view = stickyHeader ? el : scrollerOf(el);
    const update = () => {
      const { height } = head.getBoundingClientRect();
      el.style.setProperty('--smbk-table-head-height', `${height}px`);
      el.toggleAttribute('data-heading-scrolls', height > (view ?? document.documentElement).clientHeight / 2);
    };
    update();
    const watch = new ResizeObserver(update);
    watch.observe(head);
    if (view) watch.observe(view);
    window.addEventListener('resize', update);
    return () => {
      watch.disconnect();
      window.removeEventListener('resize', update);
      el.style.removeProperty('--smbk-table-head-height');
      el.removeAttribute('data-heading-scrolls');
    };
  }, [frame, growing, stickyHeader, pageHeader]);
  const tablePart = table.part('table');
  const column = table.part('column');
  const header = table.part('header');
  const cell = table.part('cell');
  const row = table.part('row');
  const data = rows.filter((r): r is TableRow => !isGroup(r));
  // The heading's checkbox speaks for the rows that can be chosen; with none, it cannot be pressed.
  const choosable = data.filter((r) => r.selectable !== false);
  const allChosen = choosable.length > 0 && choosable.every((r) => selected.includes(r.id));
  const someChosen = !allChosen && choosable.some((r) => selected.includes(r.id));
  // A table with a caret or a pin at a row's start gives every first cell the same leading room, so its columns line up.
  const lead = data.some((r) => (caret && r.detail !== undefined) || r.pinned);
  // A row's link or button lies over the row from the row's first cell. A held first cell cannot reach past itself, so
  // there the second cell holds it, and the held cell a copy that only the pointer finds.
  const heldPress = pinFirst && columns.length > 1;
  useWarning(data.some((r) => canBePressed(r) && r.label === undefined), 'A Table row that can be pressed needs a label: it names what the press does for screen readers ("Open Orion Reach"), and without one they hear the row\'s id.');

  const heading = (c: TableColumn, i: number) => {
    const active = sort?.key === c.key;
    const end = c.align === 'end';
    const name = columnName(c);
    const label = <span className={table.part('header-label')}>{c.header}</span>;
    const arrow = c.sortable && <Icon name={sortIcon(active ? sort?.direction : undefined)} className={table.part('header-icon')} />;
    const count = c.filter?.count ?? 0;
    // A block holds lines and buttons: a div, in a cell that can hold one, and never inside the sort button.
    const Cell = c.tallHeader ? 'div' : 'span';
    const sortAlone = c.sortable && <button type="button" className={table.part('sort')} aria-label={sortLabel(name)} onClick={() => onSort?.(c.key)}>{arrow}</button>;
    return (
      <th
        key={c.key}
        scope="col"
        // A screen reader says a column's heading before each of its cells: the words, not the whole of a block.
        abbr={c.tallHeader ? c.label : undefined}
        className={cx(header, active ? `${header}--active` : '', end ? `${header}--align-end` : '', c.tallHeader ? `${header}--tall` : '')}
        aria-sort={active ? (sort?.direction === 'asc' ? 'ascending' : 'descending') : undefined}
      >
        <Cell className={table.part('header-cell')}>
          {lead && i === 0 && <span className={table.part('lead')} />}
          {selectable && i === 0 && <Checkbox size="sm" tone="subtle" aria-label={selectAllLabel} checked={allChosen} indeterminate={someChosen} disabled={choosable.length === 0 || undefined} onChange={(e) => onSelectAll?.(e.target.checked)} />}
          {c.tallHeader ? (
            <>
              {end && sortAlone}
              <div className={table.part('header-block')}>{c.header}</div>
              {!end && sortAlone}
            </>
          ) : c.sortable ? (
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
        </Cell>
      </th>
    );
  };

  const dataRow = (r: TableRow) => {
    const isOpen = r.detail !== undefined && open.includes(r.id);
    const detailId = tableDetailId(tableId, r.id);
    const choosable = selectable && r.selectable !== false;
    const pressable = canBePressed(r);
    const classes = cx(
      row,
      pressable ? `${row}--pressable` : '',
      r.disabled ? `${row}--disabled` : '',
      choosable && selected.includes(r.id) ? `${row}--selected` : '',
      r.current ? `${row}--current` : '',
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
            {caret && r.detail !== undefined && (
              <button type="button" className={table.part('expander')} aria-expanded={isOpen} aria-controls={detailId} aria-label={detailsLabel(r)} onClick={() => toggle(r.id)}>
                <Icon name={isOpen ? 'CaretDown' : 'CaretRight'} />
              </button>
            )}
          </span>
          {chosen}
        </span>
      );
    };
    // The row's own link or button: no words to show, so nothing a cell holds ends up inside it. A press on the held
    // cell lands on its copy, which hands focus on, since Tab and screen readers leave the copy out, and which names
    // the row's own, so a Popover that hangs on it takes a press on the copy as one on its opener.
    const pressId = tableRowPressId(tableId, r.id);
    const press = (copy?: boolean) => {
      const own = copy
        ? { tabIndex: -1, 'aria-hidden': true, 'data-copy-of': pressId, onFocus: () => document.getElementById(pressId)?.focus({ preventScroll: true }) }
        : { id: pressId, 'aria-label': rowPressLabel(r), 'aria-current': r.current ? ('true' as const) : undefined, 'aria-haspopup': r['aria-haspopup'] };
      return r.href !== undefined
        ? <a className={table.part('row-press')} href={r.href} target={r.target} rel={r.rel} onClick={r.onClick} {...own} />
        : <button type="button" className={table.part('row-press')} onClick={r.onClick} {...own} />;
    };
    return (
      <Fragment key={r.id}>
        <tr {...dataAttributes(r)} className={classes} aria-current={r.current ? 'true' : undefined} aria-disabled={r.disabled ? true : undefined}>
          {columns.map((c, i) => {
            const body = c.prose ? <div className={table.part('prose')}>{r.cells[c.key]}</div> : r.cells[c.key];
            return (
              <td key={c.key} className={cx(cell, c.align === 'end' ? `${cell}--align-end` : '', c.prose ? `${cell}--type-prose` : '')}>
                {pressable && i === 0 && press(heldPress)}
                {pressable && heldPress && i === 1 && press()}
                {i === 0 ? first(body) : body}
              </td>
            );
          })}
        </tr>
        {r.detail !== undefined && (
          <tr id={detailId} className={`${row} ${table.part('detail-row')}`} aria-label={detailsLabel(r)} hidden={!isOpen}>
            <td colSpan={columns.length} className={table.part('detail')}>{r.detail}</td>
          </tr>
        )}
      </Fragment>
    );
  };

  return (
    <div
      ref={frame}
      className={cx(table({ look, 'sticky-header': stickyHeader, 'page-sticky-header': pageHeader, 'pin-first': pinFirst, 'align-top': alignTop }), className)}
      data-density={compact ? 'compact' : undefined}
      {...region}
      {...rest}
    >
      <table className={cx(tablePart, fixed && `${tablePart}--columns-fixed`, minWidth && listed(tableMinWidths, minWidth) && `${tablePart}--min-width-${minWidth}`)}>
        <caption className={table.part('caption')}>{caption}</caption>
        {fixed && (
          <colgroup>
            {columns.map((c) => <col key={c.key} className={cx(column, `${column}--width-${listed(tableColumnWidths, c.width) ? (c.width ?? 'rest') : 'rest'}`)} />)}
          </colgroup>
        )}
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
