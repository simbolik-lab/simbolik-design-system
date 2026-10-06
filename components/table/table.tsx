import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { table } from './table.manifest.js';
import { Checkbox } from '../checkbox/checkbox.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

export interface TableColumn {
  key: string;
  header: ReactNode;
  /** Help text for the heading, shown as an info icon. */
  info?: string;
  /** The heading sorts the rows when pressed. */
  sortable?: boolean;
}

export interface TableRow {
  id: string;
  cells: Record<string, ReactNode>;
  disabled?: boolean;
}

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'>, VariantProps<typeof table.manifest> {
  /** Accessible name of the table, read by screen readers and not shown. */
  caption: string;
  columns: TableColumn[];
  rows: TableRow[];
  /** Rows can be chosen with a checkbox in the first column. */
  selectable?: boolean;
  /** Ids of the chosen rows. */
  selected?: string[];
  onSelect?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  /** Rows carry a drag handle in the first column. Reordering itself is the consumer's. */
  draggable?: boolean;
  /** Which column is sorted, and which way. */
  sort?: { key: string; direction: 'asc' | 'desc' };
  onSort?: (key: string) => void;
  /** The foot, usually two paginations: a range on the left, numbers on the right. */
  footer?: ReactNode;
}

/** A cell's value: text with an optional icon before it, a description under it, and a copy control after it. */
export function TableValue({ icon, description, copy, children }: { icon?: string; description?: ReactNode; copy?: string; children: ReactNode }) {
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
        <button type="button" className={table.part('copy')} aria-label="Copy" onClick={() => navigator.clipboard.writeText(copy)}>
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

/** Table: a real table element inside a bordered frame, with the heading row, the rows and the foot. */
/**
 * The scroll hint: where the table is wider
 * than its frame and the browser's own scrollbar takes no room, so it hides until the frame scrolls (a phone,
 * a trackpad), the frame is marked and a thin bar along its foot shows that the table runs on sideways and how
 * much of it is in view, following the scroll. Where the browser's scrollbar takes room it always shows, and
 * the hint stays away, so there is never a second bar.
 *
 * It also says whether the table runs past its frame sideways at all, so the frame can become a region
 * the keyboard reaches and a screen reader names only while there is something to scroll to.
 */
function useScrollHint() {
  const frame = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = frame.current;
    const bar = thumb.current;
    if (!el || !bar || !('ResizeObserver' in window)) return undefined;
    const update = () => {
      const style = getComputedStyle(el);
      const scrollbarRoom = el.offsetHeight - el.clientHeight - Number.parseFloat(style.borderTopWidth) - Number.parseFloat(style.borderBottomWidth);
      const over = el.scrollWidth > el.clientWidth + 1;
      setOverflows(over);
      const hint = over && scrollbarRoom < 1;
      if (!hint) {
        delete el.dataset.scrollHint;
        return;
      }
      el.dataset.scrollHint = '';
      const track = bar.parentElement?.clientWidth ?? 0;
      // The thumb is the share of the table in view, never so small it cannot be seen.
      const size = Math.max(track * (el.clientWidth / el.scrollWidth), track / 10);
      const travel = el.scrollWidth - el.clientWidth;
      bar.style.width = `${size}px`;
      bar.style.transform = `translateX(${travel > 0 ? ((track - size) * el.scrollLeft) / travel : 0}px)`;
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const watch = new ResizeObserver(update);
    watch.observe(el);
    const inner = el.querySelector('table');
    if (inner) watch.observe(inner);
    return () => {
      el.removeEventListener('scroll', update);
      watch.disconnect();
    };
  }, []);
  return { frame, thumb, overflows };
}

export function Table({ caption, columns, rows, selectable, selected = [], onSelect, onSelectAll, draggable, sort, onSort, footer, className, 'sticky-header': stickyHeader, 'pin-first': pinFirst, ...rest }: TableProps) {
  const { frame, thumb, overflows } = useScrollHint();
  const header = table.part('header');
  const cell = table.part('cell');
  const row = table.part('row');
  const allChosen = rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const someChosen = !allChosen && rows.some((r) => selected.includes(r.id));
  return (
    <div
      ref={frame}
      className={[table({ 'sticky-header': stickyHeader, 'pin-first': pinFirst }), className].filter(Boolean).join(' ')}
      // A frame that scrolls, up and down or sideways, is a region the keyboard can reach and a screen reader can name.
      {...(stickyHeader || overflows ? { role: 'region', 'aria-label': caption, tabIndex: 0 } : {})}
      {...rest}
    >
      <table className={table.part('table')}>
        <caption className={table.part('caption')}>{caption}</caption>
        <thead>
          <tr className={table.part('header-row')}>
            {/* The handles' column is named in words a screen reader reads as the header, out of sight; a name given
                only as aria-label is not read as a column's header everywhere (axe: empty-table-header). */}
            {draggable && (
              <th scope="col" className={`${header} ${header}--control`}>
                <span className={table.part('header-name')}>Reorder</span>
              </th>
            )}
            {columns.map((c, i) => {
              const active = sort?.key === c.key;
              const text = (
                <span className={table.part('header-text')}>
                  <span className={table.part('header-label')}>{c.header}</span>
                  {c.info && <Icon name="Info" className={table.part('header-icon')} label={c.info} />}
                </span>
              );
              return (
                <th key={c.key} scope="col" className={[header, active ? `${header}--active` : ''].filter(Boolean).join(' ')} aria-sort={active ? (sort?.direction === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <span className={table.part('header-cell')}>
                    {selectable && i === 0 && <Checkbox size="small" aria-label="Choose every row" checked={allChosen} ref={(el: HTMLInputElement | null) => { if (el) el.indeterminate = someChosen; }} onChange={(e) => onSelectAll?.(e.target.checked)}>{''}</Checkbox>}
                    {c.sortable ? (
                      <button type="button" className={table.part('sort')} onClick={() => onSort?.(c.key)}>
                        {text}
                        <Icon name="ArrowsDownUp" className={table.part('header-icon')} />
                      </button>
                    ) : (
                      text
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={[row, r.disabled ? `${row}--disabled` : ''].filter(Boolean).join(' ')} aria-disabled={r.disabled ? true : undefined}>
              {draggable && (
                <td className={`${cell} ${cell}--control`}>
                  <span className={table.part('handle')} aria-hidden="true"><Icon name="DotsSix" /></span>
                </td>
              )}
              {columns.map((c, i) => (
                <td key={c.key} className={cell}>
                  {selectable && i === 0 ? (
                    <span className={table.part('content')}>
                      <Checkbox size="small" variant="subtle" aria-label={`Choose row ${r.id}`} checked={selected.includes(r.id)} disabled={r.disabled} onChange={(e) => onSelect?.(r.id, e.target.checked)}>{''}</Checkbox>
                      {r.cells[c.key]}
                    </span>
                  ) : (
                    r.cells[c.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
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
