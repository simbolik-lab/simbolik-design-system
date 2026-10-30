'use client';

/**
 * Filter bar: search, filters, sort and Clear all together above a list or a table, a search landmark.
 *
 *   <FilterBar
 *     label="Filter projects"
 *     search={<SearchField aria-label="Search projects" value={query} onChange={…} onClear={…} />}
 *     filters={<Dropdown label="Filters" trigger={<FilterBarOpener count={applied.length} />}>…ticking items…</Dropdown>}
 *     sort={<Select aria-label="Sort by" options={…} />}
 *     applied={[{ id: 'open', label: 'Status: Open' }]}
 *     onRemove={(id) => …}
 *     onClearAll={() => …}
 *     count="12 results"
 *   />
 *
 * FilterBar props:
 *   label          Names the search landmark, such as "Filter projects"; each filter bar on a page needs its own.
 *   search         The search field, at the medium size.
 *   filters        The filters opener: a FilterBarOpener, alone or as a dropdown's or a drawer's trigger.
 *   narrowFilters  Shown in place of `filters` in a narrow space, such as an opener for a drawer that also holds
 *                  the sort list. Without it, `filters` stays.
 *   sort           The sort list (a select), named for what it does ("Sort by"). Hidden in a narrow space.
 *   view           A view switch (a segmented control). Hidden in a narrow space.
 *   applied        The filters applied, each `{ id, label }`, drawn as removable chips with Clear all after them.
 *   onRemove       Called with a chip's id when its cross is pressed.
 *   onClearAll     Called when Clear all is pressed. Without it there is no Clear all.
 *   count          How many results the filters leave, in words: "12 results". Read out each time it changes.
 *   loading        The results are being worked out: the count gives way to the spinner and `loadingText`.
 *
 * FilterBarApplied and FilterBarCount are the applied row and the count alone, for a toolbar's row of details.
 * The wrapper holds no styling: the stylesheet draws everything.
 */
import { useLayoutEffect, useRef, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { filterBar } from './filter-bar.manifest.js';
import { Button } from '../button/button.js';
import { Badge } from '../badge/badge.js';
import { Chip } from '../chip/chip.js';
import { Spinner } from '../spinner/spinner.js';
import { link } from '../link/link.manifest.js';
import { cx } from '../variants.js';

/** One filter applied: its words on the chip, and the name of its cross ("Remove Status: Open" when left out). */
export interface AppliedFilter {
  id: string;
  label: string;
  removeLabel?: string;
}

export interface FilterBarAppliedProps {
  filters: AppliedFilter[];
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  /** The words of the button that removes every filter. */
  clearLabel?: string;
  /** Names the row for a screen reader. */
  label?: string;
  /**
   * Where focus goes when the last chip goes, by its cross or Clear all, and the row with it: the filters opener,
   * as a rule. Without it focus stays on the page's body.
   */
  returnFocus?: () => HTMLElement | null | undefined;
  className?: string;
}

/**
 * The filters applied, as small removable chips, then Clear all. Removing a chip with its cross moves focus to the
 * chip that takes its place (the next one, or the one before when it was the last); when none are left, to
 * `returnFocus`. The page may take the filter away at once or once its results come back. Nothing is drawn while no
 * filter is applied.
 */
export function FilterBarApplied({ filters, onRemove, onClearAll, clearLabel = 'Clear all', label = 'Applied filters', returnFocus, className }: FilterBarAppliedProps) {
  const row = useRef<HTMLDivElement>(null);
  /** The place of the chip whose cross was pressed, or -1 for Clear all; null when nothing is waiting. */
  const pending = useRef<number | null>(null);
  const shown = filters.length;
  /** How many chips the row held when it was last drawn. */
  const before = useRef(shown);

  // Focus moves on once the page has taken the filter away, which it may do only when the results come back: a draw
  // in between, such as the count loading, leaves focus where it is. A filter added meanwhile ends the wait, so focus
  // never jumps out of the menu that added it.
  useLayoutEffect(() => {
    const was = before.current;
    before.current = shown;
    const at = pending.current;
    if (at === null || shown === was) return;
    pending.current = null;
    if (shown > was) return;
    const crosses = row.current ? [...row.current.querySelectorAll<HTMLElement>('button[aria-label]')] : [];
    if (at >= 0 && crosses.length > 0) crosses[Math.min(at, crosses.length - 1)]?.focus();
    else returnFocus?.()?.focus();
  }, [shown, returnFocus]);

  if (shown === 0) return null;
  // Once the chip has gone, focus moves on to the one in its place.
  const remove = (id: string, at: number) => () => {
    pending.current = at;
    onRemove?.(id);
  };
  const clear = () => {
    pending.current = -1;
    onClearAll?.();
  };
  return (
    <div ref={row} role="group" aria-label={label} className={cx(filterBar.part('applied'), className)}>
      {filters.map((f, i) => (
        <Chip key={f.id} tone="default" size="sm" onRemove={remove(f.id, i)} removeLabel={f.removeLabel ?? `Remove ${f.label}`}>
          {f.label}
        </Chip>
      ))}
      {onClearAll && (
        <button type="button" className={`${link({ size: 'sm' })} ${filterBar.part('clear')}`} onClick={clear}>
          <span className={link.part('label')}>{clearLabel}</span>
        </button>
      )}
    </div>
  );
}

export interface FilterBarCountProps {
  /** How many results the filters leave, in words: "12 results", "No results". */
  children?: ReactNode;
  /** The results are being worked out: the spinner's ring and `loadingText` in place of the count. */
  loading?: boolean;
  loadingText?: string;
  className?: string;
}

/**
 * The result count: a status message, so a screen reader reads each new count, and "Updating results" while they
 * load, without focus moving. It is in the page from the start, so the first count is not read out on arrival.
 */
export function FilterBarCount({ children, loading = false, loadingText = 'Updating results', className }: FilterBarCountProps) {
  return (
    <div role="status" className={cx(filterBar.part('count'), className)}>
      {loading ? (
        <Spinner size="sm" label role="presentation">
          {loadingText}
        </Spinner>
      ) : (
        children
      )}
    </div>
  );
}

export interface FilterBarOpenerProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** How many filters are applied. Shown in the badge beside the button and said with its name. */
  count?: number;
  /** The button's words. */
  label?: string;
  /** How the count is said after the button's words: ", 2 applied". */
  countWords?: (count: number) => string;
  size?: 'md' | 'sm';
  /** Phosphor icon before the words. */
  icon?: string;
  disabled?: boolean;
  /** Reaches the button, e.g. to give focus back to it. */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * The filters opener: the outline button with a funnel, and beside it the number of filters applied in the small
 * badge. The button's name starts with its words and says the number after them ("Filters, 2 applied"), so a voice
 * command for the words still finds it; the badge is hidden from screen readers.
 * Give it to a dropdown or a drawer as its trigger: the id, aria-* and handlers they add reach the button.
 */
export function FilterBarOpener({ count = 0, label = 'Filters', countWords = (n) => `${n} applied`, size = 'md', icon = 'Funnel', className, ref, ...rest }: FilterBarOpenerProps) {
  return (
    <span className={cx(filterBar.part('opener'), className)}>
      <Button tone="outline" size={size} leadingIcon={icon} ref={ref} aria-label={count > 0 ? `${label}, ${countWords(count)}` : undefined} {...rest}>
        {label}
      </Button>
      {count > 0 && (
        <Badge size="sm" aria-hidden="true" className={filterBar.part('opener-count')}>
          {count}
        </Badge>
      )}
    </span>
  );
}

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Names the search landmark, such as "Filter projects". */
  label: string;
  search?: ReactNode;
  filters?: ReactNode;
  narrowFilters?: ReactNode;
  sort?: ReactNode;
  view?: ReactNode;
  applied?: AppliedFilter[];
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  clearLabel?: string;
  count?: ReactNode;
  loading?: boolean;
  loadingText?: string;
}

/** The filter bar: a labelled search landmark holding the controls, the applied row and the count. See above. */
export function FilterBar({ label, search, filters, narrowFilters, sort, view, applied = [], onRemove, onClearAll, clearLabel, count, loading, loadingText, className, ...rest }: FilterBarProps) {
  const bar = useRef<HTMLDivElement>(null);
  // When the last applied filter goes, focus goes back to the filters opener that is showing.
  const opener = () =>
    [...(bar.current?.querySelectorAll<HTMLElement>(`.${filterBar.part('filters')} button, .${filterBar.part('narrow-filters')} button`) ?? [])].find((b) => b.getClientRects().length > 0) ??
    bar.current?.querySelector<HTMLElement>('input');
  return (
    <div ref={bar} role="search" aria-label={label} className={cx(filterBar(), className)} {...rest}>
      <div className={filterBar.part('controls')}>
        {search && <div className={filterBar.part('search')}>{search}</div>}
        {filters && <div className={filterBar.part('filters')}>{filters}</div>}
        {narrowFilters && <div className={filterBar.part('narrow-filters')}>{narrowFilters}</div>}
        {sort && <div className={filterBar.part('sort')}>{sort}</div>}
        {view && <div className={filterBar.part('view')}>{view}</div>}
      </div>
      <FilterBarApplied filters={applied} onRemove={onRemove} onClearAll={onClearAll} clearLabel={clearLabel} returnFocus={opener} />
      {/* In the page from the first render whenever the page shows a count, so every change is read out. */}
      {(count !== undefined || loading !== undefined) && (
        <FilterBarCount loading={loading} loadingText={loadingText}>
          {count}
        </FilterBarCount>
      )}
    </div>
  );
}
