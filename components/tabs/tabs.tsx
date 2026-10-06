import { useEffect, useId, useLayoutEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { tabs } from './tabs.manifest.js';
import { Icon } from '../icon/icon.js';
import { placeIndicator } from '../indicator.js';
import type { VariantProps } from '../variants.js';

export interface TabItem {
  value: string;
  label: string;
  /** Phosphor icon name shown before the label. */
  icon?: string;
  disabled?: boolean;
  /** A mark after the label, such as a badge's dot or count saying the view holds something new or changed. Its words join the tab's name. */
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
export function Tabs({ size, orientation, 'item-width': itemWidth, label, items, value, defaultValue, onChange, controls, className, ...rest }: TabsProps) {
  const id = useId();
  const tabId = (value: string) => (controls ? `${controls}-tab-${value}` : `${id}-tab-${value}`);
  const firstEnabled = items.find((t) => !t.disabled)?.value;
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? internal;
  // The one tab Tab lands on: the selected one, or the first enabled tab when the value names none or a disabled one,
  // so the list can always be reached.
  const tabStop = items.some((t) => t.value === selected && !t.disabled) ? selected : firstEnabled;
  const vertical = orientation === 'vertical';
  const listRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const shown = useRef<string | undefined>(undefined);
  const keys = items.map((t) => t.value).join('\u0000');

  const chosenTab = (list: HTMLElement | null) => list?.querySelector<HTMLElement>(':scope > [role="tab"][aria-selected="true"]') ?? null;

  /* Slide only when the selection changes; a new size or orientation lands at once. */
  useLayoutEffect(() => {
    placeIndicator(listRef.current, markRef.current, chosenTab(listRef.current), shown.current === undefined || shown.current === selected);
    shown.current = selected;
  }, [selected, size, orientation, itemWidth]);

  /* The tabs change size with fonts loading, density and the space given: follow them at once. */
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => placeIndicator(list, markRef.current, chosenTab(list), true));
    observer.observe(list);
    for (const tab of list.querySelectorAll(':scope > [role="tab"]')) observer.observe(tab);
    return () => observer.disconnect();
  }, [keys]);

  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forward = vertical ? 'ArrowDown' : 'ArrowRight';
    const back = vertical ? 'ArrowUp' : 'ArrowLeft';
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
    <div className={[tabs({ size, orientation, 'item-width': itemWidth }), className].filter(Boolean).join(' ')} {...rest}>
      <div ref={listRef} role="tablist" aria-label={label} aria-orientation={vertical ? 'vertical' : undefined} className={tabs.part('list')}>
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
              <span className={tabs.part('label')}>{t.label}</span>
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
