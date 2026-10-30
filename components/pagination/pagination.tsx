'use client';

import type { HTMLAttributes } from 'react';
import { pagination } from './pagination.manifest.js';
import { Button } from '../button/button.js';
import { button } from '../button/button.manifest.js';
import { Icon } from '../icon/icon.js';
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
  /** Called with the page chosen, when the pages are buttons. With `href`, only the select's choice calls it. */
  onChange?: (page: number) => void;
  /**
   * Each page's address, given its number. With it, every page and Previous and Next are links to their pages, which
   * need no script: for pages built ahead of time, and pages a search engine should follow. The select types' select
   * goes to the chosen page's address.
   */
  href?: (page: number) => string;
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

/**
 * Previous or Next with no page to go to, in the links form: a link with no address, dimmed as a disabled button is,
 * so a press, a search engine and the Tab key all pass it by.
 */
function NoPage({ icon, label, iconOnly = false, after = false, className }: { icon: string; label: string; iconOnly?: boolean; after?: boolean; className: string }) {
  const glyph = <Icon name={icon} className={button.part('icon')} />;
  return (
    <a role="link" aria-disabled="true" aria-label={iconOnly ? label : undefined} className={cx(button({ tone: 'ghost', size: 'sm', 'icon-only': iconOnly }), className)}>
      {iconOnly ? (
        glyph
      ) : (
        <>
          {!after && glyph}
          <span className={button.part('label')}>{label}</span>
          {after && glyph}
        </>
      )}
    </a>
  );
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
 *
 * Given `href`, every page and Previous and Next are links instead, which work with no script; Previous on the first
 * page and Next on the last are links with no address, out of the Tab order, since a press loads another page anyway.
 */
export function Pagination({ type, borderless, page, count, onChange, href, label = 'Pagination', siblings, pageSize = 20, total = 0, unit = 'results', selectSize = 'md', previousLabel, nextLabel, pageLabel = englishPage, selectLabel, countText = englishCount, showingText = 'Showing', totalText = englishTotal, className, ...rest }: PaginationProps) {
  const classes = cx(pagination({ type, borderless }), className);
  const pages = count ?? Math.max(1, Math.ceil(total / pageSize));
  const go = (next: number) => {
    if (next < 1 || next > pages || next === page) return;
    onChange?.(next);
    if (href) window.location.assign(href(next));
  };
  // Previous or Next: a button, a link to its page, or, with addresses and no page there, a link to nowhere.
  const step = (to: number, edge: boolean, words: { label: string; icon: string; iconOnly?: boolean; after?: boolean; className: string }) => {
    const { label: name, icon, iconOnly, after, className: part } = words;
    if (href && edge) return <NoPage icon={icon} label={name} iconOnly={iconOnly} after={after} className={part} />;
    const look = iconOnly ? { icon, 'icon-only': true as const, 'aria-label': name } : after ? { trailingIcon: icon } : { leadingIcon: icon };
    const children = iconOnly ? undefined : name;
    if (href) return <Button tone="ghost" size="sm" {...look} href={href(to)} rel={to < page ? 'prev' : 'next'} className={part}>{children}</Button>;
    return <Button tone="ghost" size="sm" {...look} className={part} aria-disabled={edge || undefined} onClick={() => go(to)}>{children}</Button>;
  };
  const first = page <= 1;
  const last = page >= pages;

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
        {step(page - 1, first, { label: previousLabel ?? 'Previous', icon: 'CaretLeft', className: `${pagination.part('previous')} ${pagination.part('wide-only')}` })}
        {step(page - 1, first, { label: previousLabel ?? 'Previous page', icon: 'CaretLeft', iconOnly: true, className: `${pagination.part('previous')} ${pagination.part('narrow-only')}` })}
        <OutsideField><Select size={selectSize} aria-label={selectLabel ?? 'Page'} className={pagination.part('select')} value={String(page)} onChange={(v) => go(Number(v))} options={Array.from({ length: pages }, (_, i) => ({ value: String(i + 1), label: countText(i + 1, pages) }))} /></OutsideField>
        {step(page + 1, last, { label: nextLabel ?? 'Next', icon: 'CaretRight', after: true, className: `${pagination.part('next')} ${pagination.part('wide-only')}` })}
        {step(page + 1, last, { label: nextLabel ?? 'Next page', icon: 'CaretRight', iconOnly: true, className: `${pagination.part('next')} ${pagination.part('narrow-only')}` })}
      </nav>
    );
  }

  return (
    <nav aria-label={label} className={classes} {...rest}>
      <ul className={pagination.part('list')}>
        <li className={pagination.part('item')}>
          {step(page - 1, first, { label: previousLabel ?? 'Previous page', icon: 'CaretLeft', iconOnly: true, className: pagination.part('previous') })}
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
              {href ? (
                <Button tone="ghost" size="sm" href={href(n)} className={pagination.part('page')} aria-current={n === page ? 'page' : undefined} aria-label={pageLabel(n)}>
                  {n}
                </Button>
              ) : (
                <Button tone="ghost" size="sm" className={pagination.part('page')} aria-current={n === page ? 'page' : undefined} aria-label={pageLabel(n)} onClick={() => go(n)}>
                  {n}
                </Button>
              )}
            </li>
          ),
        )}
        <li className={pagination.part('item')}>
          {step(page + 1, last, { label: nextLabel ?? 'Next page', icon: 'CaretRight', iconOnly: true, className: pagination.part('next') })}
        </li>
      </ul>
    </nav>
  );
}
