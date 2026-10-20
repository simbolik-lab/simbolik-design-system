import type { HTMLAttributes } from 'react';
import { pagination } from './pagination.manifest.js';
import { Button } from '../button/button.js';
import { Select } from '../select/select.js';
import { OutsideField } from '../field/field-context.js';
import { Label } from '../label/label.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'>, VariantProps<typeof pagination.manifest> {
  /** The current page, counted from 1. */
  page: number;
  /** How many pages there are. Derived from total and pageSize for the range type. */
  count?: number;
  onChange?: (page: number) => void;
  /** Accessible name of the navigation region. */
  label?: string;
  /** How many numbered pages to show either side of the current one before collapsing to a gap. */
  siblings?: number;
  /** Range type: how many rows a page holds. */
  pageSize?: number;
  /** Range type: how many rows there are in all. */
  total?: number;
  /** Range type: what the rows are called, e.g. "results". */
  unit?: string;
  /** The select's size, for the range and select types: `sm` in a table's foot, where every control is 32 tall. */
  selectSize?: 'md' | 'sm';
  /**
   * The Previous button's name. Unless given, "Previous page" where the button shows its arrow alone and "Previous"
   * where it shows words; given, it says this in both. The words below change for a page in another language.
   */
  previousLabel?: string;
  /** The Next button's name: "Next page" with the arrow alone and "Next" with words, unless given. */
  nextLabel?: string;
  /** A numbered page's name, given its number. "Page 3" unless given. */
  pageLabel?: (page: number) => string;
  /** The select's name. "Page" for the select type and "Rows showing" for the range type, unless given. */
  selectLabel?: string;
  /** Where the reader is, in the narrow numbers bar and the select type's choices: "6 of 11" unless given. */
  countText?: (page: number, count: number) => string;
  /** Range type: the word before the select. "Showing" unless given. */
  showingText?: string;
  /** Range type: the words after the select, given the total and the unit: "of 120 results" unless given. */
  totalText?: (total: number, unit: string) => string;
}

const englishPage = (page: number) => `Page ${page}`;
const englishCount = (page: number, count: number) => `${page} of ${count}`;
const englishTotal = (total: number, unit: string) => `of ${total} ${unit}`;

/** The page numbers to show, with null where a gap goes: the current page with its neighbours, the first page, and the last two, as the Figma frame lays them out. */
export function pageWindow(page: number, count: number, siblings = 1): (number | null)[] {
  if (count <= 5 + siblings * 2) return Array.from({ length: count }, (_, i) => i + 1);
  const keep = new Set<number>([1, count - 1, count]);
  let start = Math.max(1, page - siblings);
  let end = Math.min(count, page + siblings);
  while (end - start < siblings * 2 && (start > 1 || end < count)) {
    if (start > 1) start--;
    else end++;
  }
  for (let i = start; i <= end; i++) keep.add(i);
  const pages = [...keep].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  for (const n of pages) {
    const last = out[out.length - 1];
    if (typeof last === 'number' && n - last > 1) out.push(null);
    out.push(n);
  }
  return out;
}

/**
 * Pagination: a navigation landmark with the page controls inside. Previous and Next at the ends are
 * aria-disabled rather than disabled, so the one just pressed keeps focus instead of dropping it to the page.
 * The numbers and select types hold both of their forms, and the layout switch shows one, by CSS: in a
 * narrow space the numbers give way to the status part ("6 of 11"), and the select type's Previous and Next
 * to their icon-only forms, each named as the numbers bar's are.
 */
export function Pagination({ type, borderless, page, count, onChange, label = 'Pagination', siblings, pageSize = 20, total = 0, unit = 'results', selectSize = 'md', previousLabel, nextLabel, pageLabel = englishPage, selectLabel, countText = englishCount, showingText = 'Showing', totalText = englishTotal, className, ...rest }: PaginationProps) {
  const classes = cx(pagination({ type, borderless }), className);
  const pages = count ?? Math.max(1, Math.ceil(total / pageSize));
  const go = (next: number) => {
    if (next < 1 || next > pages || next === page) return;
    onChange?.(next);
  };

  if (type === 'range') {
    const ranges = Array.from({ length: pages }, (_, i) => {
      const from = i * pageSize + 1;
      const to = Math.min((i + 1) * pageSize, total);
      return { value: String(i + 1), label: `${from}-${to}` };
    });
    return (
      <nav aria-label={label} className={classes} {...rest}>
        <Label tone="subtle" className={pagination.part('label')}>{showingText}</Label>
        <OutsideField><Select size={selectSize} aria-label={selectLabel ?? 'Rows showing'} className={pagination.part('select')} value={String(page)} onChange={(v) => go(Number(v))} options={ranges} /></OutsideField>
        <Label tone="subtle" className={pagination.part('label')}>{totalText(total, unit)}</Label>
      </nav>
    );
  }

  if (type === 'select') {
    return (
      <nav aria-label={label} className={classes} {...rest}>
        <Button tone="ghost" size="sm" leadingIcon="CaretLeft" className={`${pagination.part('previous')} ${pagination.part('wide-only')}`} aria-disabled={page <= 1 || undefined} onClick={() => go(page - 1)}>
          {previousLabel ?? 'Previous'}
        </Button>
        <Button tone="ghost" size="sm" icon="CaretLeft" icon-only aria-label={previousLabel ?? 'Previous page'} className={`${pagination.part('previous')} ${pagination.part('narrow-only')}`} aria-disabled={page <= 1 || undefined} onClick={() => go(page - 1)} />
        <OutsideField><Select size={selectSize} aria-label={selectLabel ?? 'Page'} className={pagination.part('select')} value={String(page)} onChange={(v) => go(Number(v))} options={Array.from({ length: pages }, (_, i) => ({ value: String(i + 1), label: countText(i + 1, pages) }))} /></OutsideField>
        <Button tone="ghost" size="sm" trailingIcon="CaretRight" className={`${pagination.part('next')} ${pagination.part('wide-only')}`} aria-disabled={page >= pages || undefined} onClick={() => go(page + 1)}>
          {nextLabel ?? 'Next'}
        </Button>
        <Button tone="ghost" size="sm" icon="CaretRight" icon-only aria-label={nextLabel ?? 'Next page'} className={`${pagination.part('next')} ${pagination.part('narrow-only')}`} aria-disabled={page >= pages || undefined} onClick={() => go(page + 1)} />
      </nav>
    );
  }

  return (
    <nav aria-label={label} className={classes} {...rest}>
      <ul className={pagination.part('list')}>
        <li className={pagination.part('item')}>
          <Button tone="ghost" size="sm" icon="CaretLeft" icon-only aria-label={previousLabel ?? 'Previous page'} className={pagination.part('previous')} aria-disabled={page <= 1 || undefined} onClick={() => go(page - 1)} />
        </li>
        <li className={`${pagination.part('item')} ${pagination.part('status')}`}>
          {countText(page, pages)}
        </li>
        {pageWindow(page, pages, siblings).map((n, i) =>
          n === null ? (
            <li key={`gap-${i}`} className={pagination.part('item')}>
              <span className={pagination.part('gap')} aria-hidden="true">
                …
              </span>
            </li>
          ) : (
            <li key={n} className={pagination.part('item')}>
              <Button tone="ghost" size="sm" className={pagination.part('page')} aria-current={n === page ? 'page' : undefined} aria-label={pageLabel(n)} onClick={() => go(n)}>
                {n}
              </Button>
            </li>
          ),
        )}
        <li className={pagination.part('item')}>
          <Button tone="ghost" size="sm" icon="CaretRight" icon-only aria-label={nextLabel ?? 'Next page'} className={pagination.part('next')} aria-disabled={page >= pages || undefined} onClick={() => go(page + 1)} />
        </li>
      </ul>
    </nav>
  );
}
