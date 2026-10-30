'use client';

import type { HTMLAttributes, RefObject } from 'react';
import { themeSwitch } from './theme-switch.manifest.js';
import { Icon } from '../icon/icon.js';
import { useRadioIndicator } from '../indicator.js';
import { useTip } from '../tooltip/tooltip.js';
import { motionEasing, motionMs } from '../motion.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export type Theme = 'light' | 'dark';

export interface ThemeSwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, VariantProps<typeof themeSwitch.manifest> {
  name?: string;
  value?: Theme;
  defaultValue?: Theme;
  /**
   * Called with the chosen theme and the option pressed for it. Setting the page's theme is the caller's job, since
   * the theme is the reader's choice, kept by the site: `applyTheme(theme, option)`, exported beside the switch, sets
   * it with the theme wipe out of that option.
   */
  onChange?: (theme: Theme, option: HTMLElement) => void;
  /** The group's name, what a screen reader says for the switch. "Theme" unless given, for a page in another language. */
  label?: string;
  /** The dark choice's name, said and shown in its tooltip. "Dark theme" unless given. */
  darkLabel?: string;
  /** The light choice's name, said and shown in its tooltip. "Light theme" unless given. */
  lightLabel?: string;
}

const ITEMS: { value: Theme; icon: string }[] = [
  { value: 'dark', icon: 'MoonStars' },
  { value: 'light', icon: 'Sun' },
];

/**
 * Theme switch: two radios drawn as one bar, the segmented control in its theme look (its classes come from this
 * component's manifest, which carries the segmented control's block). The chosen item's raised surface is one
 * indicator that slides to the other; the stylesheet does the motion, the wrapper only measures where it goes. Each
 * icon names itself in a tooltip under it while pointed at or focused, as an icon-only segment does. The page sets
 * its theme from onChange, with applyTheme() below for the wipe.
 */
export function ThemeSwitch({ size, look, name = 'theme', value, defaultValue = 'light', onChange, label = 'Theme', darkLabel = 'Dark theme', lightLabel = 'Light theme', className, ...rest }: ThemeSwitchProps) {
  const labels: Record<Theme, string> = { dark: darkLabel, light: lightLabel };
  const classes = cx(themeSwitch({ size, look }), className);
  const { groupRef, markRef, place } = useRadioIndicator(themeSwitch.part('item'), value, size, 'dark light');
  return (
    <div ref={groupRef} role="radiogroup" aria-label={label} className={classes} {...rest}>
      <span ref={markRef} className={themeSwitch.part('indicator')} aria-hidden="true" />
      {ITEMS.map((item) => (
        <ThemeItem
          key={item.value}
          item={{ ...item, label: labels[item.value] }}
          name={name}
          checked={value !== undefined ? value === item.value : undefined}
          defaultChecked={value === undefined ? defaultValue === item.value : undefined}
          onChange={(option) => {
            onChange?.(item.value, option);
            if (value === undefined) place(false);
          }}
        />
      ))}
    </div>
  );
}

/** One choice: a label holding its radio, named by the theme, and its icon, the name shown in a tooltip. */
function ThemeItem({ item, name, checked, defaultChecked, onChange }: { item: (typeof ITEMS)[number] & { label: string }; name: string; checked?: boolean; defaultChecked?: boolean; onChange: (option: HTMLElement) => void }) {
  const { targetRef, hoverProps, focusProps, tip } = useTip({ text: item.label, arrow: 'top-center', inverse: true, purpose: 'name' });
  return (
    <label ref={targetRef as RefObject<HTMLLabelElement>} className={themeSwitch.part('item')} {...hoverProps}>
      <input
        type="radio"
        className="smbk-segmented__control"
        name={name}
        value={item.value}
        aria-label={item.label}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(event) => onChange(event.currentTarget.closest('label') ?? event.currentTarget)}
        {...focusProps}
      />
      <Icon name={item.icon} className={themeSwitch.part('icon')} />
      {tip}
    </label>
  );
}

/** The wipe running now: a later one takes over, and only the one running clears the page's marks. */
let wiping: object | null = null;

/** How many steps the circle's growth is drawn in: enough that the straight runs between them never show. */
const WIPE_STEPS = 32;

/**
 * The circle's radius at each step, out of (x, y), starting round the pressed option (`start`) and growing so that
 * the share of the rest of the window it covers grows evenly to all of it: the easing then shapes how much of the
 * page has changed, not how wide the circle is. Grown evenly by radius from nothing, the circle hid under the switch
 * for the first third of the time and had covered the window long before the end, so it seemed to wait and then
 * stop. Measured over a grid of points across the window.
 */
function wipeRadii(x: number, y: number, width: number, height: number, start: number): number[] {
  const columns = 48;
  const rows = Math.max(2, Math.round((columns * height) / width));
  const reach: number[] = [];
  for (let i = 0; i <= columns; i += 1) {
    for (let j = 0; j <= rows; j += 1) {
      const r = Math.hypot((i / columns) * width - x, (j / rows) * height - y);
      if (r > start) reach.push(r);
    }
  }
  reach.sort((a, b) => a - b);
  if (!reach.length) return [start, start];
  return Array.from({ length: WIPE_STEPS + 1 }, (_, step) => (step === 0 ? start : reach[Math.min(reach.length - 1, Math.ceil((step / WIPE_STEPS) * reach.length) - 1)]!));
}

/**
 * Sets the page's theme, `data-theme` on <html>, with the theme wipe: the page in the new theme is drawn over the old
 * in a circle that grows from the option pressed (the second argument the switch's onChange gives) until it covers
 * the window, with the theme wipe's motion, the covered share of the page following its easing. An option out of
 * sight, or none, wipes from the top corner at the line's end, where a header keeps the switch. Under reduced
 * motion, in a hidden tab, or in a browser without view transitions, the theme changes at once. A press during a
 * wipe starts the next one from where the page then is. Returns a promise that settles once the theme is set and
 * the wipe, if any, has finished.
 */
export function applyTheme(theme: Theme, from?: Element | null): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  const root = document.documentElement;
  const set = () => root.setAttribute('data-theme', theme);
  if (root.getAttribute('data-theme') === theme) return Promise.resolve();
  if (typeof document.startViewTransition !== 'function' || document.visibilityState !== 'visible' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    set();
    return Promise.resolve();
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  const box = from?.getBoundingClientRect();
  const seen = box && box.width > 0 && box.bottom > 0 && box.top < height && box.right > 0 && box.left < width;
  const atEnd = getComputedStyle(root).direction === 'rtl' ? 0 : width;
  const x = seen ? box.left + box.width / 2 : atEnd;
  const y = seen ? box.top + box.height / 2 : 0;
  // It starts as wide as the option, so it shows round the switch from the first frame.
  const start = seen ? Math.hypot(box.width, box.height) / 2 : 0;
  const wipe = {};
  wiping = wipe;
  root.style.setProperty('--smbk-theme-switch-wipe-x', `${x}px`);
  root.style.setProperty('--smbk-theme-switch-wipe-y', `${y}px`);
  root.setAttribute('data-theme-wipe', '');
  const clear = () => {
    if (wiping !== wipe) return;
    wiping = null;
    root.removeAttribute('data-theme-wipe');
    for (const name of ['x', 'y']) root.style.removeProperty(`--smbk-theme-switch-wipe-${name}`);
  };
  let transition: ViewTransition;
  try {
    transition = document.startViewTransition(set);
  } catch {
    set();
    clear();
    return Promise.resolve();
  }
  let growth: Animation | undefined;
  transition.ready
    .then(() => {
      const at = `at ${x}px ${y}px`;
      growth = root.animate(
        { clipPath: wipeRadii(x, y, width, height, start).map((r) => `circle(${r}px ${at})`) },
        { duration: motionMs(root, 'theme-wipe-duration'), easing: motionEasing(root, 'theme-wipe'), fill: 'forwards', pseudoElement: '::view-transition-new(root)' },
      );
    })
    // A browser that cannot animate the new page: the transition ends at once with the theme set.
    .catch(() => transition.skipTransition());
  // Held at its end until the transition is over, then removed, so the next wipe's page never starts from it.
  const done = () => {
    growth?.cancel();
    clear();
  };
  return transition.finished.then(done, done);
}

/**
 * The browser's own bar (Chrome's on Android, an installed web app's title bar) takes its color from a
 * theme-color tag, and a tag cannot read a token. This writes the tag from a color token, the page canvas
 * unless another is named, and keeps it in step with the page's theme: `data-theme` on <html>, or the
 * system's light or dark setting while the page sets none. Call it once, where the page sets its theme;
 * it returns a function that stops it.
 */
export function followThemeColor(token = '--smbk-color-surface-canvas'): () => void {
  if (typeof document === 'undefined') return () => {};
  const root = document.documentElement;
  let tag = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = 'theme-color';
    document.head.append(tag);
  }
  const meta = tag;
  const write = () => {
    const color = getComputedStyle(root).getPropertyValue(token).trim();
    if (color && meta.content !== color) meta.content = color;
  };
  write();
  const watch = new MutationObserver(write);
  watch.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  scheme.addEventListener('change', write);
  // A stylesheet still loading has no tokens yet: write again once the page has them.
  window.addEventListener('load', write, { once: true });
  return () => {
    watch.disconnect();
    scheme.removeEventListener('change', write);
    window.removeEventListener('load', write);
  };
}
