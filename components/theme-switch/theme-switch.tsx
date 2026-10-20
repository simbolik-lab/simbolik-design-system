import type { HTMLAttributes, RefObject } from 'react';
import { themeSwitch } from './theme-switch.manifest.js';
import { Icon } from '../icon/icon.js';
import { useRadioIndicator } from '../indicator.js';
import { useTip } from '../tooltip/tooltip.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export type Theme = 'light' | 'dark';

export interface ThemeSwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, VariantProps<typeof themeSwitch.manifest> {
  name?: string;
  value?: Theme;
  defaultValue?: Theme;
  /** Called with the chosen theme. Setting the page's theme attribute is the caller's job: the theme is the reader's choice, kept by the site. */
  onChange?: (theme: Theme) => void;
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
 * icon names itself in a tooltip under it while pointed at or focused, as an icon-only segment does.
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
          onChange={() => {
            onChange?.(item.value);
            if (value === undefined) place(false);
          }}
        />
      ))}
    </div>
  );
}

/** One choice: a label holding its radio, named by the theme, and its icon, the name shown in a tooltip. */
function ThemeItem({ item, name, checked, defaultChecked, onChange }: { item: (typeof ITEMS)[number] & { label: string }; name: string; checked?: boolean; defaultChecked?: boolean; onChange: () => void }) {
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
        onChange={onChange}
        {...focusProps}
      />
      <Icon name={item.icon} className={themeSwitch.part('icon')} />
      {tip}
    </label>
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
