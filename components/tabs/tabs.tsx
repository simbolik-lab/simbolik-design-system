'use client';

import { useEffect, useId, useLayoutEffect, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { tabs } from './tabs.manifest.js';
import { Icon } from '../icon/icon.js';
import { Dropdown, DropdownItem } from '../dropdown/dropdown.js';
import { placeIndicator } from '../indicator.js';
import { useScrollbar } from '../scrollbar.js';
import { useControllable } from '../controllable.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface TabItem {
  value: string;
  label: string;
  /** Phosphor icon name shown before the label. */
  icon?: string;
  disabled?: boolean;
  /** A mark after the label, such as a badge's dot or count saying the view holds something new or changed. Its words join the tab's name after a pause: "Activity, 18". */
  badge?: ReactNode;
  /** The panel content shown while this tab is selected. */
  content?: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, VariantProps<typeof tabs.manifest> {
  /** Accessible name of the tab list, e.g. "Settings sections". */
  label: string;
  items: TabItem[];
  /** Controlled selected value. */
  value?: string;
  /** Initial selection when uncontrolled. Defaults to the first enabled tab. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /**
   * The id of one panel elsewhere that shows the chosen tab's view, as the
   * code block's body does. The tabs then draw no panels of their own: each
   * tab controls that panel, and is named `<controls>-tab-<value>`, so the
   * panel can name the tab that shows it (`aria-labelledby`).
   */
  controls?: string;
}

/**
 * Tabs: a tab list with arrow-key movement and one panel per tab, or one
 * panel elsewhere for all of them (`controls`). Selection
 * follows focus, as the pattern recommends when panels are cheap to show.
 * The raised surface under the selected tab is one indicator that slides to
 * the next tab, and a newly shown panel fades in; the stylesheet does the
 * motion, the wrapper only measures where the indicator goes.
 */
export function Tabs({ look, size, orientation, 'item-width': itemWidth, label, items, value, defaultValue, onChange, controls, className, ...rest }: TabsProps) {
  const id = useId();
  const tabId = (value: string) => (controls ? `${controls}-tab-${value}` : `${id}-tab-${value}`);
  const firstEnabled = items.find((t) => !t.disabled)?.value;
  const [selected, select] = useControllable({ value, defaultValue: defaultValue ?? firstEnabled, onChange, name: 'Tabs value' });
  // The one tab Tab lands on: the selected one, or the first enabled tab when the value names none or a disabled one,
  // so the list can always be reached.
  const tabStop = items.some((t) => t.value === selected && !t.disabled) ? selected : firstEnabled;
  const vertical = orientation === 'vertical';
  const listRef = useRef<HTMLDivElement>(null);
  const bar = useScrollbar(listRef, { axis: 'x' });
  const markRef = useRef<HTMLSpanElement>(null);
  const shown = useRef<string | undefined>(undefined);
  const keys = items.map((t) => t.value).join('\u0000');

  const chosenTab = (list: HTMLElement | null) => list?.querySelector<HTMLElement>(':scope > [role="tab"][aria-selected="true"]') ?? null;

  /* Slide only when the selection changes; a new size or orientation lands at once. */
  useLayoutEffect(() => {
    placeIndicator(listRef.current, markRef.current, chosenTab(listRef.current), shown.current === undefined || shown.current === selected);
    shown.current = selected;
  }, [selected, look, size, orientation, itemWidth]);

  /* The tabs change size with fonts loading, density and the space given: follow them at once. */
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => placeIndicator(list, markRef.current, chosenTab(list), true));
    observer.observe(list);
    for (const tab of list.querySelectorAll(':scope > [role="tab"]')) observer.observe(tab);
    return () => observer.disconnect();
  }, [keys]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    // Across, the arrows follow the reading direction: in a right-to-left bar the left arrow moves forward.
    const rtl = !vertical && getComputedStyle(event.currentTarget).direction === 'rtl';
    const forward = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    const enabled = items.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
    if (!enabled.length) return;
    const position = enabled.indexOf(index);
    let next: number | undefined;
    if (event.key === forward) next = enabled[(position + 1) % enabled.length];
    else if (event.key === back) next = enabled[(position - 1 + enabled.length) % enabled.length];
    else if (event.key === 'Home') next = enabled[0];
    else if (event.key === 'End') next = enabled[enabled.length - 1];
    if (next === undefined) return;
    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.value);
    const list = event.currentTarget.parentElement;
    list?.querySelectorAll<HTMLElement>(':scope > [role="tab"]')[next]?.focus();
  };

  return (
    <div className={cx(tabs({ look, size, orientation, 'item-width': itemWidth }), className)} {...rest}>
      <div ref={listRef} role="tablist" aria-label={label} aria-orientation={vertical ? 'vertical' : undefined} className={tabs.part('list')} {...bar}>
        <span ref={markRef} className={tabs.part('indicator')} aria-hidden="true" />
        {items.map((t, i) => {
          const isSelected = t.value === selected;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              id={tabId(t.value)}
              aria-selected={isSelected}
              aria-controls={controls ?? `${id}-panel-${t.value}`}
              tabIndex={t.value === tabStop ? 0 : -1}
              disabled={t.disabled}
              className={tabs.part('tab')}
              onClick={() => select(t.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {t.icon && <Icon name={t.icon} className={tabs.part('icon')} />}
              <span className={tabs.part('label')} data-label={t.label}>
                {t.label}
                {t.badge && <span className={tabs.part('pause')}>, </span>}
              </span>
              {t.badge && <span className={tabs.part('badge')}>{t.badge}</span>}
            </button>
          );
        })}
      </div>
      {!controls &&
        items.map((t) => (
          <div
            key={t.value}
            role="tabpanel"
            id={`${id}-panel-${t.value}`}
            aria-labelledby={tabId(t.value)}
            hidden={t.value !== selected}
            tabIndex={0}
            className={tabs.part('panel')}
          >
            {t.content}
          </div>
        ))}
    </div>
  );
}

export interface TabLink {
  href: string;
  label: string;
  /** Phosphor icon name shown before the label. */
  icon?: string;
  /** This link is to the page being shown: drawn as the chosen tab, and marked as the current page for screen readers. */
  current?: boolean;
  /** A mark after the label, such as a badge's count saying the page holds something new. Its words join the link's name after a pause: "Activity, 18". */
  badge?: ReactNode;
}

export interface TabsNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof tabs.manifest> {
  /** The navigation's name, e.g. "Project". Each navigation on a page needs a name of its own. */
  label: string;
  items: TabLink[];
  /** How many links show as tabs. The rest sit behind More, a tab at the row's end that opens a menu of them. Every link shows unless given. */
  max?: number;
  /** The More tab's words and the name of its menu. "More" unless given, for a page in another language. */
  moreLabel?: string;
}

/**
 * Tabs that move between pages: a navigation of links drawn as the tabs, each page with an address of its own, so a
 * reader can open one in a new browser tab. The link to the page shown is the chosen tab, marked as the current page.
 * Tab moves from link to link and Enter follows one, as with any links: no arrow keys and no panels, since each page
 * brings its own content. Past `max`, the rest sit behind a More tab at the row's end; while the page shown is one of
 * them, the More tab takes its name and draws as chosen. The chosen tab's surface or underline slides to the next one
 * when the page changes in place; the stylesheet does the motion, the wrapper only measures where it goes.
 */
export function TabsNav({ look, size, orientation, 'item-width': itemWidth, label, items, max, moreLabel = 'More', className, ...rest }: TabsNavProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const bar = useScrollbar(listRef, { axis: 'x' });
  const markRef = useRef<HTMLSpanElement>(null);
  const placed = useRef<string | undefined>(undefined);
  const shown = max === undefined || max >= items.length ? items : items.slice(0, Math.max(0, max));
  const folded = items.slice(shown.length);
  const foldedCurrent = folded.find((item) => item.current);
  const current = items.find((item) => item.current)?.href;
  const keys = `${shown.map((item) => item.href).join('\u0000')}\u0000${folded.length}`;
  const tab = tabs.part('tab');
  const pause = tabs.part('pause');

  const chosenTab = (list: HTMLElement | null) => list?.querySelector<HTMLElement>(`.${tab}:is([aria-current="page"], [data-current])`) ?? null;

  /* Slide only when the page shown changes in place; a new size or orientation lands at once. */
  useLayoutEffect(() => {
    placeIndicator(listRef.current, markRef.current, chosenTab(listRef.current), placed.current === undefined || placed.current === current);
    placed.current = current;
  }, [current, look, size, orientation, itemWidth, keys]);

  /* The tabs change size with fonts loading, density and the space given: follow them at once. */
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => placeIndicator(list, markRef.current, chosenTab(list), true));
    observer.observe(list);
    for (const link of list.querySelectorAll(`.${tab}`)) observer.observe(link);
    return () => observer.disconnect();
  }, [keys]);

  const words = (item: TabLink) => (
    <>
      {item.label}
      {item.badge && <span className={pause}>, </span>}
    </>
  );

  return (
    <nav aria-label={label} className={cx(tabs({ look, size, orientation, 'item-width': itemWidth }), className)} {...rest}>
      <div ref={listRef} className={tabs.part('list')} {...bar}>
        <span ref={markRef} className={tabs.part('indicator')} aria-hidden="true" />
        {shown.map((item) => (
          <a key={item.href} href={item.href} aria-current={item.current ? 'page' : undefined} className={tab}>
            {item.icon && <Icon name={item.icon} className={tabs.part('icon')} />}
            <span className={tabs.part('label')} data-label={item.label}>
              {words(item)}
            </span>
            {item.badge && <span className={tabs.part('badge')}>{item.badge}</span>}
          </a>
        ))}
        {folded.length > 0 && (
          <Dropdown
            label={moreLabel}
            purpose="navigation"
            align="end"
            size={size === 'sm' ? 'sm' : 'md'}
            trigger={
              <button type="button" className={cx(tab, tabs.part('more'))} data-current={foldedCurrent ? '' : undefined}>
                <span className={tabs.part('label')} data-label={foldedCurrent?.label ?? moreLabel}>
                  {foldedCurrent ? (
                    <>
                      {foldedCurrent.label}
                      <span className={pause}>, {moreLabel}</span>
                    </>
                  ) : (
                    moreLabel
                  )}
                </span>
                <Icon name="CaretDown" className={tabs.part('caret')} />
              </button>
            }
          >
            {folded.map((item) => (
              <DropdownItem key={item.href} href={item.href} icon={item.icon} aria-current={item.current ? 'page' : undefined}>
                {words(item)}
                {item.badge}
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </div>
    </nav>
  );
}
