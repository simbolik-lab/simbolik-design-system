import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref, SyntheticEvent } from 'react';
import { button } from './button.manifest.js';
import { Icon } from '../icon/icon.js';
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
 * Button: props onto smbk-btn classes, plus the two things markup cannot
 * express on its own — an icon-only button must carry an accessible name,
 * and a link styled as a button is still a link.
 */
export function Button(props: ButtonProps) {
  const { tone, size, leadingIcon, trailingIcon, icon, className, children, ...rest } = props;
  const iconOnly = props['icon-only'] === true;
  const { 'icon-only': _omit, ...attrs } = rest as Record<string, unknown>;
  // aria-disabled keeps the button in the tab order, so it can be found and explained, but it does nothing:
  // a click, Enter or Space runs no handler, submits no form, and a link goes nowhere.
  if (attrs['aria-disabled'] === true || attrs['aria-disabled'] === 'true') attrs.onClick = (e: SyntheticEvent) => e.preventDefault();

  const classes = [button({ tone, size, 'icon-only': iconOnly }), className].filter(Boolean).join(' ');
  const iconPart = button.part('icon');

  if (iconOnly && !('aria-label' in attrs) && !('aria-labelledby' in attrs)) {
    throw new Error('An icon-only Button needs an aria-label so it has an accessible name.');
  }

  const content = iconOnly ? (
    <Icon name={icon ?? leadingIcon ?? ''} className={iconPart} />
  ) : (
    <>
      {leadingIcon && <Icon name={leadingIcon} className={iconPart} />}
      <span className={button.part('label')}>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} className={iconPart} />}
    </>
  );

  if ('href' in props && props.href !== undefined) {
    return (
      <a className={classes} {...(attrs as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  const buttonAttrs = attrs as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonAttrs.type ?? 'button'} className={classes} {...buttonAttrs}>
      {content}
    </button>
  );
}
