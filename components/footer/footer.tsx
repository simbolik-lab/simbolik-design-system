import type { HTMLAttributes, ReactNode } from 'react';
import { footer } from './footer.manifest.js';
import { Divider } from '../divider/divider.js';
import { Icon } from '../icon/icon.js';
import { Logo } from '../logo/logo.js';
import { NavItem } from '../nav-item/nav-item.js';
import type { VariantProps } from '../variants.js';

export interface FooterLink {
  label: string;
  href: string;
  /** Marks the link as the current page (aria-current="page"), as the header's links do. A column link also takes the navigation item's current look; a legal link keeps its look. */
  active?: boolean;
}

/** A column's link. A legal link takes no `external`: the legal strip stays in the same tab. */
export interface FooterColumnLink extends FooterLink {
  /** The link leaves the site: it opens in a new tab, and its accessible name ends with "(opens in a new tab)". */
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterColumnLink[];
}

export interface FooterSocial {
  /** Phosphor icon name, e.g. "XLogo". */
  icon: string;
  href: string;
  /** Accessible name, e.g. "Simbolik on X". */
  label: string;
  /** The link leaves the site: it opens in a new tab, and its accessible name ends with "(opens in a new tab)". */
  external?: boolean;
}

/** What a link that leaves the site says after its name, and the attributes that open it in a new tab. */
const NEW_TAB = '(opens in a new tab)';
const newTab = (external: boolean | undefined) => (external ? { target: '_blank', rel: 'noopener' } : {});

export interface FooterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof footer.manifest> {
  /** The brand's link. The minimal look shows no brand. */
  homeHref?: string;
  /** Replaces the Simbolik logo. The minimal look shows no brand. */
  brand?: ReactNode;
  social?: FooterSocial[];
  /** The columns of page links. The minimal look shows none. */
  columns?: FooterColumn[];
  /**
   * The copyright line. A name in it that links (Figma's minimal footer draws "simbolik." in the
   * default text colour) is an anchor with the legal link part's class, so it reads as the legal links do.
   */
  copyright: ReactNode;
  /** A short line after the copyright, spaced from it by the strip's gap rather than joined with a separator. */
  tagline?: ReactNode;
  /**
   * The minimal look only: other content for the strip's middle, in place of the legal links. Words go in
   * a span or a paragraph, which the footer trims to their cap height; controls go as they are.
   */
  center?: ReactNode;
  /**
   * The minimal look only: other content for the strip's end, in place of the social links, such as a
   * line of words with a link. Words go in a span or a paragraph, as in `center`.
   */
  end?: ReactNode;
  /** Privacy, terms, status and the like. */
  legalLinks?: FooterLink[];
  /** Accessible name of the columns' navigation, "Footer" by default. Give each its own when a page has more than one footer with columns. */
  navLabel?: string;
}

/** Figma draws the social icons at the large icon size in the default look and the medium one in the minimal look. */
function SocialLinks({ social, size }: { social: FooterSocial[]; size: 'md' | 'lg' }) {
  if (social.length === 0) return null;
  return (
    <ul className={footer.part('social')}>
      {social.map((s) => (
        <li key={s.href}>
          <a className={footer.part('social-link')} href={s.href} aria-label={s.external ? `${s.label} ${NEW_TAB}` : s.label} {...newTab(s.external)}>
            <Icon name={s.icon} size={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function LegalLinks({ links }: { links: FooterLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className={footer.part('legal-links')}>
      {links.map((link) => (
        <li key={link.href}>
          <a className={footer.part('legal-link')} href={link.href} aria-current={link.active ? 'page' : undefined}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Footer: a content-info landmark. */
export function Footer({ look, homeHref = '/', brand, social = [], columns = [], copyright, tagline, center, end, legalLinks = [], navLabel = 'Footer', className, ...rest }: FooterProps) {
  const classes = [footer({ look }), className].filter(Boolean).join(' ');
  if (look === 'minimal') {
    // Figma's minimal footer: the divider, then one strip of three places. The notice part keeps the
    // copyright and the tagline together at the start; the center and end parts hold the legal links and
    // the social links, or whatever the page puts there instead.
    const middle = center ?? (legalLinks.length > 0 ? <LegalLinks links={legalLinks} /> : null);
    const last = end ?? (social.length > 0 ? <SocialLinks social={social} size="md" /> : null);
    return (
      <footer className={classes} {...rest}>
        <Divider className={footer.part('divider')} />
        <div className={footer.part('legal')}>
          <p className={footer.part('notice')}>
            <span>{copyright}</span>
            {tagline && <span className={footer.part('tagline')}>{tagline}</span>}
          </p>
          {middle && <div className={footer.part('center')}>{middle}</div>}
          {last && <div className={footer.part('end')}>{last}</div>}
        </div>
      </footer>
    );
  }
  return (
    <footer className={classes} {...rest}>
      <div className={footer.part('main')}>
        <div className={footer.part('brand')}>
          <a className={footer.part('brand-link')} href={homeHref}>
            {brand ?? <Logo form="logo" className={footer.part('logo')} />}
          </a>
          <SocialLinks social={social} size="lg" />
        </div>
        {/* Narrow only: the divider between the columns and the brand below them (Figma's mobile footer). */}
        <Divider className={footer.part('brand-divider')} />
        <nav aria-label={navLabel} className={footer.part('columns')}>
          {columns.map((column) => (
            <div key={column.title} className={footer.part('column')}>
              <h2 className={footer.part('heading')}>{column.title}</h2>
              <ul className={footer.part('list')}>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <NavItem size="md" href={link.href} block active={link.active} className={footer.part('link')} {...newTab(link.external)}>
                      {link.label}
                      {link.external && <span className={footer.part('new-tab')}> {NEW_TAB}</span>}
                    </NavItem>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      {/* Wide only: the divider above the legal strip. */}
      <Divider className={footer.part('divider')} />
      <div className={footer.part('legal')}>
        <span>{copyright}</span>
        {tagline && <span className={footer.part('tagline')}>{tagline}</span>}
        <LegalLinks links={legalLinks} />
      </div>
    </footer>
  );
}
