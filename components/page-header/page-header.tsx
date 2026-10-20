import { isValidElement, useEffect, useRef, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { pageHeader } from './page-header.manifest.js';
import { Breadcrumbs, type Crumb } from '../breadcrumbs/breadcrumbs.js';
import { Button } from '../button/button.js';
import { Dropdown, DropdownItem } from '../dropdown/dropdown.js';
import { Icon } from '../icon/icon.js';
import { Skeleton } from '../skeleton/skeleton.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface PageHeaderAction {
  /** The words on the button or the menu item. */
  label: string;
  /** What pressing it does. */
  onClick?: () => void;
  /** Where it goes, for an action that opens another page. */
  href?: string;
  /** A Phosphor icon name before the words. */
  icon?: string;
  /** Drawn faint and takes no press. */
  disabled?: boolean;
  /** A destructive action, in a menu only: never the main action of a page. */
  danger?: boolean;
}

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, Omit<VariantProps<typeof pageHeader.manifest>, 'composition'> {
  /** The page's name: its one main heading. */
  title: ReactNode;
  /** The heading's level: 1, the page's one main heading, unless the page header sits inside something with its own. */
  headingLevel?: 1 | 2 | 3;
  /**
   * The way back up: a list of links, each a label and an address (the last, the page itself, has none), drawn as the
   * small breadcrumbs; or a node of the page's own, such as a link to the page above. A list of elements is a node of
   * the page's own, drawn as it is.
   */
  breadcrumbs?: Crumb[] | ReactNode;
  /** The name of the breadcrumbs' navigation landmark, when the page has more than one trail. */
  breadcrumbsLabel?: string;
  /** A short introduction under the title: what the page is for. */
  description?: ReactNode;
  /** The status of the thing the page is about, beside the title: a badge, such as <Badge tone="success">Live</Badge>. */
  status?: ReactNode;
  /** A quiet line of facts under the introduction, such as "Updated 8 October · Owner: Ana Silva". */
  meta?: ReactNode;
  /**
   * The actions for the whole page, the main one first: a brand button, then the others as outline buttons. The first
   * three show as buttons and any after them go behind "More actions", after `moreActions`; in a narrow layout the main
   * one fills the row and the others move behind "More actions".
   */
  actions?: PageHeaderAction[];
  /** Actions that always sit behind "More actions", a menu at the row's end. */
  moreActions?: PageHeaderAction[];
  /** The name of the "More actions" button and its menu. */
  moreLabel?: string;
  /** Tabs that switch the page's views: a Tabs given `controls`, the id of the one panel under the header that shows them. */
  tabs?: ReactNode;
  /** The words a screen reader hears as the heading while the page loads. */
  loadingLabel?: string;
  /** Reaches the outer div. */
  ref?: Ref<HTMLDivElement>;
}

const given = (node: ReactNode) => node !== undefined && node !== null && node !== false && node !== '';

/** Whether the breadcrumbs are a list of links (each a label and perhaps an address) rather than the page's own elements. */
const isCrumbs = (value: unknown): value is Crumb[] =>
  Array.isArray(value) && value.length > 0 && value.every((item) => item !== null && typeof item === 'object' && !isValidElement(item) && typeof (item as Crumb).label === 'string');

/** How many actions show as buttons; the rest go behind "More actions". */
const SHOWN_ACTIONS = 3;

/**
 * Page header: the top of one page. It is not the site's header or the app bar, and holds no actions for the whole
 * site. Reading and Tab order: the breadcrumbs, the title, the introduction, the actions, then the tabs. It has no
 * keys of its own; the actions are buttons, "More actions" a menu button.
 *
 *   <PageHeader title="Projects" description="Every project the studio runs."
 *     breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
 *     actions={[{ label: 'New project', onClick: create }, { label: 'Export', onClick: exportAll }]} />
 *
 * Loading, the words are skeleton lines of their own height, the actions are disabled, and the tabs are skeletons;
 * the heading says `loadingLabel` to a screen reader.
 */
export function PageHeader({ title, headingLevel = 1, breadcrumbs, breadcrumbsLabel, description, status, meta, actions = [], moreActions = [], moreLabel = 'More actions', tabs, loading, loadingLabel = 'Loading', className, ...rest }: PageHeaderProps) {
  const part = pageHeader.part;
  const composition = given(tabs) ? 'tabbed' : given(status) || given(meta) ? 'object' : 'simple';
  const Heading = `h${headingLevel}` as const;
  const [primary, ...secondary] = actions.slice(0, SHOWN_ACTIONS);
  // Actions past the third are never dropped: they join the menu, after the ones always kept there.
  const menuActions = [...moreActions, ...actions.slice(SHOWN_ACTIONS)];
  const tabsRef = useRef<HTMLDivElement>(null);

  /* While more tabs lie past the end of their row, a cue shows at its end. */
  useEffect(() => {
    const holder = tabsRef.current;
    const list = holder?.querySelector<HTMLElement>('[role="tablist"]');
    if (!holder || !list) return undefined;
    const update = () => {
      const more = Math.abs(list.scrollLeft) + list.clientWidth < list.scrollWidth - 1;
      holder.toggleAttribute('data-more', more);
    };
    update();
    list.addEventListener('scroll', update, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    observer?.observe(list);
    return () => {
      list.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, [tabs, loading]);

  const button = (action: PageHeaderAction, kind: 'primary' | 'secondary') => {
    const classes = `${part('action')} ${part('action')}--${kind}`;
    const tone = kind === 'primary' ? 'brand' : 'outline';
    if (action.href && !loading && !action.disabled) {
      return (
        <Button key={action.label} href={action.href} tone={tone} size="md" leadingIcon={action.icon} className={classes} onClick={action.onClick}>
          {action.label}
        </Button>
      );
    }
    return (
      <Button key={action.label} tone={tone} size="md" leadingIcon={action.icon} className={classes} onClick={action.onClick} disabled={loading || action.disabled}>
        {action.label}
      </Button>
    );
  };

  // Two openers, each shown in one layout: the narrow one also holds the actions the narrow row hides.
  const menu = (items: PageHeaderAction[], layout: 'wide' | 'narrow') =>
    items.length > 0 && (
      <span className={`${part('more')} ${part('more')}--${layout}`}>
        <Dropdown label={moreLabel} align="end" trigger={<Button tone="ghost" size="md" icon="DotsThree" icon-only aria-label={moreLabel} disabled={loading} />}>
          {items.map((item) =>
            item.href ? (
              <DropdownItem key={item.label} href={item.href} icon={item.icon} danger={item.danger} onClick={item.onClick}>
                {item.label}
              </DropdownItem>
            ) : (
              <DropdownItem key={item.label} icon={item.icon} danger={item.danger} disabled={item.disabled} onClick={item.onClick}>
                {item.label}
              </DropdownItem>
            ),
          )}
        </Dropdown>
      </span>
    );

  const crumbs = isCrumbs(breadcrumbs) ? (
    <Breadcrumbs size="sm" items={breadcrumbs} label={breadcrumbsLabel} className={part('breadcrumbs')} />
  ) : given(breadcrumbs as ReactNode) && !(Array.isArray(breadcrumbs) && breadcrumbs.length === 0) ? (
    <div className={part('breadcrumbs')}>{breadcrumbs as ReactNode}</div>
  ) : null;
  const hasActions = actions.length > 0 || moreActions.length > 0;

  return (
    <div className={cx(pageHeader({ composition, loading }), className)} aria-busy={loading || undefined} {...rest}>
      {crumbs}
      <div className={part('main')}>
        <div className={part('body')}>
          <div className={part('title-row')}>
            <Heading className={part('title')}>
              {loading ? (
                <>
                  <Skeleton shape="title" size="lg" />
                  <span className={part('hidden')}>{loadingLabel}</span>
                </>
              ) : (
                title
              )}
            </Heading>
            {!loading && given(status) && <span className={part('status')}>{status}</span>}
          </div>
          {given(description) && (
            <p className={part('description')} aria-hidden={loading || undefined}>
              {loading ? <Skeleton shape="text" size="lg" lines={2} /> : description}
            </p>
          )}
          {given(meta) && (
            <p className={part('meta')} aria-hidden={loading || undefined}>
              {loading ? <Skeleton shape="label" size="lg" /> : meta}
            </p>
          )}
        </div>
        {hasActions && (
          <div className={part('actions')}>
            {primary && button(primary, 'primary')}
            {secondary.map((action) => button(action, 'secondary'))}
            {menu(menuActions, 'wide')}
            {menu([...secondary, ...menuActions], 'narrow')}
          </div>
        )}
      </div>
      {given(tabs) &&
        (loading ? (
          <div className={part('tabs-skeleton')} aria-hidden="true">
            <Skeleton shape="text" />
            <Skeleton shape="text" />
            <Skeleton shape="text" />
            <Skeleton shape="text" />
          </div>
        ) : (
          <div ref={tabsRef} className={part('tabs')}>
            {tabs}
            <span className={part('tabs-cue')} aria-hidden="true">
              <Icon name="CaretRight" />
            </span>
          </div>
        ))}
    </div>
  );
}
