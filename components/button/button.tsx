import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref, SyntheticEvent } from 'react';
import { button } from './button.manifest.js';
import { Icon } from '../icon/icon.js';
import { spinner } from '../spinner/spinner.manifest.js';
import { iconWords, useNameWarning, useWarning } from '../name-check.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

type Variants = VariantProps<typeof button.manifest>;

interface CommonProps extends Variants {
  /** Phosphor icon name shown before the label. */
  leadingIcon?: string;
  /** Phosphor icon name shown after the label. */
  trailingIcon?: string;
  /** The icon of an icon-only button. */
  icon?: string;
  /** Extra classes for adjusting the button in place, such as a site's own class for its position. Never a fork. */
  className?: string;
  children?: ReactNode;
}

export type ButtonProps = CommonProps &
  (
    | ({ href?: undefined; /** Reaches the native button, e.g. to focus it. */ ref?: Ref<HTMLButtonElement> } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)
    | ({ href: string; /** Reaches the native link. */ ref?: Ref<HTMLAnchorElement> } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>)
  );

/**
 * Button: props onto smbk-btn classes, plus what markup cannot express on its
 * own — an icon-only button must carry an accessible name, a link styled as a
 * button is still a link, the extra-small size is a ghost icon button only, and
 * a busy button says so and ignores presses.
 *
 * A prop it cannot draw as asked never throws, which would take the page down: in development it warns, and it draws
 * the nearest thing that works. An icon-only button with no name is named by its icon's words ("Magnifying glass"),
 * which a page should replace with what pressing it does; the extra-small size on any but a ghost icon-only button
 * draws at the small size.
 */
export function Button(props: ButtonProps) {
  const { tone, size, loading, leadingIcon, trailingIcon, icon, className, children, ...rest } = props;
  const iconOnly = props['icon-only'] === true;
  const busy = loading === true;
  const { 'icon-only': _omit, ...attrs } = rest as Record<string, unknown>;
  // aria-disabled keeps the button in the tab order, so it can be found and explained, but it does nothing:
  // a click, Enter or Space runs no handler, submits no form, and a link goes nowhere. A busy button is the same,
  // so its action cannot run twice, and it says it is busy; it is never disabled, so focus stays on it.
  if (busy || attrs['aria-disabled'] === true || attrs['aria-disabled'] === 'true') attrs.onClick = (e: SyntheticEvent) => e.preventDefault();
  if (busy) attrs['aria-busy'] = true;

  const nameless = iconOnly && !('aria-label' in attrs) && !('aria-labelledby' in attrs);
  useNameWarning('An icon-only Button', !nameless, 'Give it an aria-label that says what pressing it does; until then it is named by its icon.');
  if (nameless) attrs['aria-label'] = iconWords(icon ?? leadingIcon ?? '');
  const wrongXs = size === 'xs' && (!iconOnly || (tone ?? button.manifest.axes.tone.default) !== 'ghost');
  useWarning(wrongXs, 'The xs Button is a ghost icon-only button: give it tone="ghost" and icon-only, or use the sm size. It is drawn at the sm size.');
  const drawn = wrongXs ? 'sm' : size;

  const classes = cx(button({ tone, size: drawn, 'icon-only': iconOnly, loading: busy }), className);
  const iconPart = button.part('icon');

  const content = iconOnly ? (
    <Icon name={icon ?? leadingIcon ?? ''} className={iconPart} />
  ) : (
    <>
      {leadingIcon && <Icon name={leadingIcon} className={iconPart} />}
      <span className={button.part('label')}>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} className={iconPart} />}
    </>
  );
  // The spinner's ring, over the hidden label, at the button's own icon size.
  const ring = busy && (
    <span className={`${spinner({ size: drawn === 'sm' || drawn === 'xs' ? 'sm' : 'md' })} ${button.part('spinner')}`} aria-hidden="true">
      <span className={spinner.part('ring')} />
    </span>
  );

  if ('href' in props && props.href !== undefined) {
    return (
      <a className={classes} {...(attrs as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
        {ring}
      </a>
    );
  }
  const buttonAttrs = attrs as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonAttrs.type ?? 'button'} className={classes} {...buttonAttrs}>
      {content}
      {ring}
    </button>
  );
}
