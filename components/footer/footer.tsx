import { Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { footer } from './footer.manifest.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { Icon } from '../icon/icon.js';
import { Link } from '../link/link.js';
import { Logo, type LogoPicture } from '../logo/logo.js';
import { NavItem } from '../nav-item/nav-item.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface FooterLink {
  label: string;
  href: string;
  /** Marks the link as the current page (aria-current="page"), as the header's links do. A column or row link also takes the navigation item's current look; a legal link keeps its look. */
  active?: boolean;
}

/** A page link in a column or the row. A legal link takes no `external`: the legal strip stays in the same tab. */
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

/** The call to action look's card: a headline, a line under it, and the actions the page owns. */
export interface FooterCta {
  headline: ReactNode;
  line?: ReactNode;
  /** Two buttons, or a labelled email field and its button: the page owns what they do. */
  actions?: ReactNode;
}

/** What a link that leaves the site says after its name, and the attributes that open it in a new tab. */
/** What a link that leaves the site adds to its name, unless the page gives its own words (`newTabText`). */
const NEW_TAB = '(opens in a new tab)';
const newTab = (external: boolean | undefined) => (external ? { target: '_blank', rel: 'noopener' } : {});

export interface FooterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, VariantProps<typeof footer.manifest> {
  /** The brand's link. The minimal look shows no brand. */
  homeHref?: string;
  /** Replaces the Simbolik logo. The minimal look shows no brand. */
  brand?: ReactNode;
  /** A site's own logo as picture files, which keep their own colors, in place of the Simbolik logo: the logo's `picture`. The big wordmark uses its wordmark picture when it has one. */
  logoPicture?: LogoPicture;
  /** A line about the site under the logo. */
  blurb?: ReactNode;
  /** The social links: icon buttons under the brand, or at the strip's end in the minimal look. */
  social?: FooterSocial[];
  /**
   * A newsletter sign-up under the brand's social links: the page's own form, holding a visible label and a row
   * (the newsletter row part) of an email field and its button. The page owns the action and its messages.
   */
  newsletter?: ReactNode;
  /** The columns of page links: beside the brand in a wide space, folded into rows that open on a phone. */
  columns?: FooterColumn[];
  /** The centred look's row of page links. */
  links?: FooterColumnLink[];
  /** The call to action look's card, above the rest. */
  cta?: FooterCta;
  /**
   * The copyright line. A name in it that links is an anchor with the legal link part's class, so it reads as
   * the legal links do, underlined since it sits among words.
   */
  copyright: ReactNode;
  /** A short line after the copyright, spaced from it by the notice's gap rather than joined with a separator. */
  tagline?: ReactNode;
  /** Privacy, terms and the like. */
  legalLinks?: FooterLink[];
  /** The legal strip's extras, at its end in this order: a status (a status dot with its words), a language button, a theme switch, then back to top. Each is the page's own component. */
  status?: ReactNode;
  /** A button whose name says what it changes, such as a ghost button with a globe; the page opens what it likes from it. */
  language?: ReactNode;
  /** The theme switch, at its small size. */
  themeSwitch?: ReactNode;
  /** A link back to the page's start: its address (the page provides the target, such as `#top`), or the address and its words. */
  backToTop?: string | { href: string; label: string };
  /** Small print under the legal strip, such as a disclaimer: one paragraph, its links the legal link part. */
  finePrint?: ReactNode;
  /** The big wordmark look: in place of the logo's wordmark set as wide as the footer. Hidden from screen readers, since the brand already names the site. */
  wordmark?: ReactNode;
  /**
   * The minimal look only: other content for the strip's middle, in place of the legal links. Words go in
   * a span or a paragraph, which loses its margins; controls go as they are.
   */
  center?: ReactNode;
  /**
   * The minimal look only: other content for the strip's end, in place of the extras and social links, such as a
   * line of words with a link. Words go in a span or a paragraph, as in `center`.
   */
  end?: ReactNode;
  /** Accessible name of the page links' navigation, "Footer" by default. Give each its own when a page has more than one footer with page links. */
  navLabel?: string;
  /**
   * The level of the footer's headings: each column's title and the call to action's headline. 2 unless given: the
   * footer stands beside the page's main content, under its title.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** The words of the back to top link when `backToTop` gives only its address. "Back to top" unless given, for a page in another language. */
  backToTopLabel?: string;
  /** What a link that leaves the site adds to its name: "(opens in a new tab)" unless given. */
  newTabText?: string;
}

/** Figma's social links are small ghost icon buttons, the extra-small inline step apart. */
function SocialLinks({ social, newTabText }: { social: FooterSocial[]; newTabText: string }) {
  if (social.length === 0) return null;
  return (
    <ul className={footer.part('social')}>
      {social.map((s) => (
        <li key={s.href}>
          <Button tone="ghost" size="sm" icon-only icon={s.icon} href={s.href} aria-label={s.external ? `${s.label} ${newTabText}` : s.label} className={footer.part('social-link')} {...newTab(s.external)} />
        </li>
      ))}
    </ul>
  );
}

/** Figma's legal links are small links standing on their own. */
function LegalLinks({ links }: { links: FooterLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className={footer.part('legal-links')}>
      {links.map((link) => (
        <li key={link.href}>
          <Link size="sm" standalone href={link.href} aria-current={link.active ? 'page' : undefined} className={footer.part('legal-link')}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * A page link: a navigation item at the middle size; in a column it fills the column and its label wraps. The words
 * for a link that leaves the site are marked unseen, so the item is only as wide as its words seen.
 */
function PageLink({ link, block, newTabText }: { link: FooterColumnLink; block?: boolean; newTabText: string }) {
  return (
    <NavItem size="md" href={link.href} block={block} active={link.active} className={block ? footer.part('link') : undefined} {...newTab(link.external)}>
      {link.label}
      {link.external && <span className={footer.part('new-tab')} data-unseen> {newTabText}</span>}
    </NavItem>
  );
}

/**
 * The equal column width's two halves: the first holds the extra column of an odd count. Each half wraps as one, so
 * the columns stand in one row or in two rows as even as the count allows.
 */
function halves<T>(items: T[]): T[][] {
  const first = Math.ceil(items.length / 2);
  return [items.slice(0, first), items.slice(first)].filter((half) => half.length > 0);
}

/** Footer: a content-info landmark. */
export function Footer({
  look,
  divider,
  legal: legalPlace,
  'column-width': columnWidth,
  background,
  zone,
  homeHref = '/',
  brand,
  logoPicture,
  blurb,
  social = [],
  newsletter,
  columns = [],
  links = [],
  cta,
  copyright,
  tagline,
  legalLinks = [],
  status,
  language,
  themeSwitch,
  backToTop,
  finePrint,
  wordmark,
  center,
  end,
  navLabel = 'Footer',
  headingLevel = 2,
  backToTopLabel = 'Back to top',
  newTabText = NEW_TAB,
  className,
  ...rest
}: FooterProps) {
  const Heading = `h${headingLevel}` as const;
  const classes = cx(footer({ look, divider, legal: legalPlace, 'column-width': columnWidth, background, zone }), className);
  const shown = look ?? 'columns';
  const minimal = shown === 'minimal';
  const centred = shown === 'centred';

  const notice = (
    <p className={footer.part('notice')}>
      <span className={footer.part('copyright')}>{copyright}</span>
      {tagline && <span className={footer.part('tagline')}>{tagline}</span>}
    </p>
  );
  const back = typeof backToTop === 'string' ? { href: backToTop, label: backToTopLabel } : backToTop;
  // The extras in Figma's order; the minimal look adds the social links before back to top, as Figma's strip does.
  const extraItems = [status, language, themeSwitch, minimal && social.length > 0 ? <SocialLinks social={social} newTabText={newTabText} /> : null, back ? <Link size="sm" standalone leadingIcon="ArrowUp" href={back.href}>{back.label}</Link> : null].filter(Boolean);
  const extras = extraItems.length > 0 ? <div className={footer.part('extras')}>{extraItems.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div> : null;
  const fine = finePrint ? <p className={footer.part('fine-print')}>{finePrint}</p> : null;

  if (minimal) {
    // The divider, then one strip of three places. The notice keeps the copyright and the tagline together at the
    // start; the center and end places hold the legal links and the extras, or whatever the page puts there instead.
    const middle = center ?? (legalLinks.length > 0 ? <LegalLinks links={legalLinks} /> : null);
    const last = end ?? extras;
    return (
      <footer className={classes} {...rest}>
        <div className={footer.part('content')}>
          <Divider className={footer.part('divider')} />
          <div className={footer.part('legal')}>
            {notice}
            {middle && <div className={footer.part('center')}>{middle}</div>}
            {last && <div className={footer.part('end')}>{last}</div>}
            {fine}
          </div>
        </div>
      </footer>
    );
  }

  // The brand comes before the columns in a wide space and after them in a narrow one. It is drawn once, between the
  // narrow form's folds and the wide form's columns, and the layout switch shows one of those two, so the order Tab
  // follows is the order on screen in each form and anything in the brand (a newsletter form's ids) is on the page
  // once. The centred look keeps the brand above the row in both.
  const brandBlock = (
    <div className={footer.part('brand')}>
      <a className={footer.part('brand-link')} href={homeHref}>
        {brand ?? <Logo form="logo" picture={logoPicture} className={footer.part('logo')} />}
      </a>
      {blurb && <p className={footer.part('blurb')}>{blurb}</p>}
      <SocialLinks social={social} newTabText={newTabText} />
      {newsletter && <div className={footer.part('newsletter')}>{newsletter}</div>}
    </div>
  );

  // Wide: each column a heading over its links. Narrow: each column a row that opens (a native disclosure, so it opens
  // and closes from the keyboard and says whether it is open without script), the first drawn open. Two renderings of
  // the same links; the layout switch shows one.
  // With the equal column width the wide columns stand in two halves, and each heading carries every column's title and
  // every link's words, one per line, which the stylesheet sets as an invisible copy under it: so every column is as
  // wide as the widest, with no script and nothing measured. Only the words seen: a new tab's words are left out.
  const equal = columnWidth === 'equal';
  const sizes = equal ? { 'data-titles': columns.map((column) => column.title).join('\n'), 'data-links': columns.flatMap((column) => column.links.map((link) => link.label)).join('\n') } : {};
  const wideColumn = (column: FooterColumn) => (
    <div key={column.title} className={footer.part('column')}>
      <Heading className={footer.part('heading')} {...sizes}>
        {column.title}
      </Heading>
      <ul className={footer.part('list')}>
        {column.links.map((link) => (
          <li key={link.href}>
            <PageLink link={link} block newTabText={newTabText} />
          </li>
        ))}
      </ul>
    </div>
  );
  const row = links.length > 0 && (
    <nav aria-label={navLabel}>
      <ul className={footer.part('row')}>
        {links.map((link) => (
          <li key={link.href}>
            <PageLink link={link} newTabText={newTabText} />
          </li>
        ))}
      </ul>
    </nav>
  );
  const wideColumns = (
    <nav aria-label={navLabel} className={`${footer.part('columns')} ${footer.part('wide-only')}`}>
      {equal
        ? halves(columns).map((half, i) => (
            <div key={i} className={footer.part('half')}>
              {half.map(wideColumn)}
            </div>
          ))
        : columns.map(wideColumn)}
    </nav>
  );
  const folds = columns.length > 0 && (
    <nav aria-label={navLabel} className={`${footer.part('folds')} ${footer.part('narrow-only')}`}>
      {columns.map((column, i) => (
        <div key={column.title} className={footer.part('fold')}>
          <details open={i === 0}>
            <summary className={footer.part('fold-heading')}>
              <span>{column.title}</span>
              <Icon name="CaretDown" size="sm" className={footer.part('caret')} />
            </summary>
            <ul className={footer.part('list')}>
              {column.links.map((link) => (
                <li key={link.href}>
                  <PageLink link={link} block newTabText={newTabText} />
                </li>
              ))}
            </ul>
          </details>
          <Divider className={footer.part('fold-divider')} />
        </div>
      ))}
    </nav>
  );

  const legal = (
    <div className={footer.part('legal')}>
      <div className={footer.part('legal-start')}>
        {/* Figma's centred strip puts the legal links above the copyright; the others after it. */}
        {centred && <LegalLinks links={legalLinks} />}
        {notice}
        {!centred && <LegalLinks links={legalLinks} />}
      </div>
      {extras}
      {fine}
    </div>
  );

  const wordmarkPicture = logoPicture?.type ? logoPicture : undefined;
  return (
    <footer className={classes} {...rest}>
      <div className={footer.part('content')}>
        {shown === 'call-to-action' && cta && (
          <div className={footer.part('cta')}>
            <div className={footer.part('cta-text')}>
              <Heading className={footer.part('cta-headline')}>{cta.headline}</Heading>
              {cta.line && <p className={footer.part('cta-line')}>{cta.line}</p>}
            </div>
            {cta.actions && <div className={footer.part('cta-actions')}>{cta.actions}</div>}
          </div>
        )}
        {centred ? (
          <>
            {brandBlock}
            {row}
          </>
        ) : (
          <div className={footer.part('main')}>
            {folds}
            {brandBlock}
            {wideColumns}
          </div>
        )}
        <Divider className={footer.part('divider')} />
        {legal}
        {shown === 'big-wordmark' && (
          <div className={footer.part('wordmark')} aria-hidden="true">
            {wordmark ?? <Logo form="logotype" picture={wordmarkPicture} />}
          </div>
        )}
      </div>
    </footer>
  );
}
