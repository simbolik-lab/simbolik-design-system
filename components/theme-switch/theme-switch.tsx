import type { HTMLAttributes } from 'react';
import { themeSwitch } from './theme-switch.manifest.js';
import { Icon } from '../icon/icon.js';
import { useRadioIndicator } from '../indicator.js';
import type { VariantProps } from '../variants.js';

export type Theme = 'light' | 'dark';

export interface ThemeSwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, VariantProps<typeof themeSwitch.manifest> {
  name?: string;
  value?: Theme;
  defaultValue?: Theme;
  /** Called with the chosen theme. Setting the page's theme attribute is the caller's job: the theme is the reader's choice, kept by the site. */
  onChange?: (theme: Theme) => void;
}

const ITEMS: { value: Theme; icon: string; label: string }[] = [
  { value: 'dark', icon: 'MoonStars', label: 'Dark theme' },
  { value: 'light', icon: 'Sun', label: 'Light theme' },
];

/**
 * Theme switch: two radios drawn as one bar. The chosen item's raised surface
 * is one indicator that slides to the other; the stylesheet does the motion,
 * the wrapper only measures where it goes.
 */
export function ThemeSwitch({ size, name = 'theme', value, defaultValue = 'light', onChange, className, ...rest }: ThemeSwitchProps) {
  const classes = [themeSwitch({ size }), className].filter(Boolean).join(' ');
  const { groupRef, markRef, place } = useRadioIndicator(themeSwitch.part('item'), value, size, 'dark light');
  return (
    <div ref={groupRef} role="radiogroup" aria-label="Theme" className={classes} {...rest}>
      <span ref={markRef} className={themeSwitch.part('indicator')} aria-hidden="true" />
      {ITEMS.map((item) => (
        <label key={item.value} className={themeSwitch.part('item')}>
          <input
            type="radio"
            className="smbk-theme-switch__control"
            name={name}
            value={item.value}
            aria-label={item.label}
            checked={value !== undefined ? value === item.value : undefined}
            defaultChecked={value === undefined ? defaultValue === item.value : undefined}
            onChange={() => {
              onChange?.(item.value);
              if (value === undefined) place(false);
            }}
          />
          <Icon name={item.icon} className={themeSwitch.part('icon')} />
        </label>
      ))}
    </div>
  );
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
