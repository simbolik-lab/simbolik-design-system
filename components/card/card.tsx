import { Children, createContext, isValidElement, useContext, useEffect } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { card } from './card.manifest.js';
import { Icon } from '../icon/icon.js';
import { Avatar, avatarInitials } from '../avatar/avatar.js';
import { Badge } from '../badge/badge.js';
import { StatusDot } from '../status-dot/status-dot.js';
import { Divider } from '../divider/divider.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { developing, useWarning } from '../name-check.js';

const part = card.part;

type HeadingLevel = 2 | 3 | 4 | 5 | 6;
/** A picture's shape, width to height, when the page wants one rather than the picture's own. */
export type CardRatio = '16:9' | '4:3' | '1:1';
const ratioClass = (ratio?: CardRatio) => ratio && `${part('media')}--ratio-${ratio.replace(':', '-')}`;

interface PictureProps {
  /** Picture address. */
  image?: string;
  imageAlt?: string;
  /**
   * The picture's own size in pixels. Given both, the page holds the
   * picture's place at its shape before it loads, so nothing below it moves.
   */
  imageWidth?: number;
  imageHeight?: number;
  /** `lazy` waits to fetch the picture until it nears the screen: for cards further down a long page. */
  imageLoading?: 'lazy' | 'eager';
  /** The picture as an element instead of an address: an image placeholder, or a picture with its own sources and sizes. */
  picture?: ReactNode;
  /** The picture's shape, when not its own. */
  ratio?: CardRatio;
}

function Picture({ image, imageAlt, imageWidth, imageHeight, imageLoading, picture, ratio }: PictureProps) {
  if (picture) return <div className={cx(part('media'), ratioClass(ratio))}>{picture}</div>;
  if (!image) return null;
  return <img className={cx(part('media'), ratioClass(ratio))} src={image} alt={imageAlt ?? ''} width={imageWidth} height={imageHeight} loading={imageLoading} />;
}

/* ---------------------------------------------------------------- card */

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, VariantProps<typeof card.manifest>, PictureProps {
  /** A small category above the title, in the brand text color. */
  eyebrow?: string;
  title?: ReactNode;
  /** Phosphor icon in a well above the title. */
  icon?: string;
  /** A quiet line under the title. */
  meta?: ReactNode;
  /** The header as a CardHeader, for a kind the title props do not draw. Takes the place of the title props; give it `href` or `onOpen` itself. */
  header?: ReactNode;
  /** Where the card leads. The title becomes a link whose press covers the whole card, so nothing else in the card may be a link or a button. */
  href?: string;
  /** What pressing the card does, when it opens something on the same page, such as a drawer. The title becomes a button that covers the card. */
  onOpen?: () => void;
  /** Body text or elements, or one or more CardBody parts. */
  children?: ReactNode;
  /** A CardFooter, or any footer content: a button, a link, or a byline, which the card puts under its rule. */
  footer?: ReactNode;
  /**
   * The title's heading level, chosen by where the card sits in the page's
   * outline: one below the heading the card sits under. It never changes how
   * the title looks. Defaults to 3.
   */
  headingLevel?: HeadingLevel;
}

/** Which of the card's parts a component draws, said by a mark on it: `CardBody` and `CardFooter` carry one. */
export type CardPart = 'body' | 'footer';
type Marked = { cardPart?: unknown; type?: unknown; render?: unknown };

/**
 * The part an element is, read from the mark on its component: CardBody and CardFooter themselves, either wrapped in
 * memo or forwardRef, or a page's own component that draws one and carries the same mark
 * (`ProjectBody.cardPart = 'body'`). Anything else is loose content.
 */
function partOf(node: ReactNode): CardPart | undefined {
  if (!isValidElement(node)) return undefined;
  let type = node.type as unknown;
  for (let depth = 0; depth < 4 && type; depth++) {
    const mark = (type as Marked).cardPart;
    if (mark === 'body' || mark === 'footer') return mark;
    // memo keeps the component it wraps as `type`, forwardRef as `render`.
    type = typeof type === 'object' ? ((type as Marked).type ?? (type as Marked).render) : undefined;
  }
  return undefined;
}

/** Inside the body the card adds around loose content: a CardBody drawn there is a body nested in a body. */
const AddedBody = createContext(false);
let warnedNested = false;

/**
 * Card: a bounded box about one thing.
 *
 *   <Card surface="raised" image="/cover.jpg" imageAlt="" title="Design foundations" meta="Updated 2 min ago" footer={<CardFooter end={<Button size="sm">Open</Button>} />}>
 *     A shared starting point for better interfaces.
 *   </Card>
 *
 * Given `href` or `onOpen`, the title is the card's one link or button and the whole card takes its press.
 */
export function Card({ surface, layout, selected, brackets, 'warning-edge': warningEdge, 'danger-edge': dangerEdge, dragged, href, onOpen, image, imageAlt, imageWidth, imageHeight, imageLoading, picture, ratio, eyebrow, title, icon, meta, header, className, children, footer, headingLevel = 3, ...rest }: CardProps) {
  const shown = layout ?? card.manifest.axes.layout.default;
  const classes = cx(card({ surface, layout: shown, selected, brackets, 'warning-edge': warningEdge, 'danger-edge': dangerEdge, dragged }), className);
  useWarning(header !== undefined && (href !== undefined || onOpen !== undefined), 'Card: href and onOpen link the title the card draws itself. With your own header, give them to the CardHeader instead.');
  const head = header ?? ((eyebrow || title || icon) && <CardHeader type={icon ? 'icon' : 'title'} icon={icon} eyebrow={eyebrow} title={title} meta={meta} headingLevel={headingLevel} href={href} onOpen={onOpen} />);
  const parts = Children.toArray(children);
  const body =
    parts.length === 0 ? null : parts.every((c) => partOf(c) === 'body') ? parts : (
      <CardBody>
        <AddedBody.Provider value={true}>{children}</AddedBody.Provider>
      </CardBody>
    );
  const foot = footer && (partOf(footer) === 'footer' ? footer : <footer className={part('footer')}>{footer}</footer>);
  return (
    <article className={classes} {...rest}>
      <Picture image={image} imageAlt={imageAlt} imageWidth={imageWidth} imageHeight={imageHeight} imageLoading={imageLoading} picture={picture} ratio={ratio} />
      <div className={part('content')}>
        {head}
        {/* A card inside the added body of another starts afresh: its own bodies are not nested. */}
        <AddedBody.Provider value={false}>{body}</AddedBody.Provider>
        {foot && shown === 'panel' && <Divider className={part('divider')} />}
        {foot}
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------- header */

export type CardHeaderType = 'title' | 'icon' | 'person' | 'number' | 'window';

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Title (the default), icon (an icon well over the title), person (an avatar with a name and role), number (a number before the title) or window (a window bar for a terminal). */
  type?: CardHeaderType;
  /** lg for a marketing page, md (the default) for an app, sm for a dense board. */
  size?: 'lg' | 'md' | 'sm';
  /** The title: the person's name in the person header, the window's title in the window bar. */
  title?: ReactNode;
  /**
   * The title's heading level, chosen by where the card sits in the page's
   * outline: one below the heading the card sits under. It never changes how
   * the title looks. Defaults to 3.
   */
  headingLevel?: HeadingLevel;
  /** A small category above the title, in the brand text color. Title and icon headers only. */
  eyebrow?: ReactNode;
  /** A quiet line under the title: when it changed, or the person's role. */
  meta?: ReactNode;
  /** Phosphor icon in the icon header's well. */
  icon?: string;
  /** The icon's color: the default text color or the brand's. */
  iconColor?: 'default' | 'brand';
  /** The number before the title in the number header, such as an issue's. */
  number?: ReactNode;
  /** The person's picture; without one, their initials. */
  avatarSrc?: string;
  /** The person's initials, when not the first letters of the name. */
  initials?: string;
  /** A count after the title, in a small badge. */
  count?: ReactNode;
  /** A status after the title: a small badge, in words. */
  status?: ReactNode;
  /** A link at the end, such as "Show all". */
  action?: ReactNode;
  /** An arrow at the end, for a card that is one link. Decoration only. */
  arrow?: boolean;
  /** A menu button at the end, named for the card it acts on. */
  menu?: ReactNode;
  /** Where the card leads. The title becomes a link whose press covers the whole card, so nothing else in the card may be a link or a button. */
  href?: string;
  /** What pressing the card does, when it opens something on the same page, such as a drawer. The title becomes a button that covers the card. */
  onOpen?: () => void;
}

const AVATAR_SIZE = { lg: 'md', md: 'sm', sm: 'xs' } as const;

/**
 * The top of a card, in one of five kinds and three sizes.
 *
 *   <Card header={<CardHeader type="person" title="Ana Brooks" meta="Product designer" status={<Badge tone="success" size="sm">Active</Badge>} />}>…</Card>
 */
export function CardHeader({ type = 'title', size = 'md', title, headingLevel = 3, eyebrow, meta, icon, iconColor = 'default', number, avatarSrc, initials, count, status, action, arrow, menu, href, onOpen, className, ...rest }: CardHeaderProps) {
  const Heading = `h${headingLevel}` as const;
  const named =
    href !== undefined ? (
      <a className={part('link')} href={href}>{title}</a>
    ) : onOpen ? (
      <button type="button" className={part('link')} onClick={() => onOpen()}>{title}</button>
    ) : (
      title
    );
  const header = part('header');
  const classes = cx(header, `${header}--type-${type}`, `${header}--size-${size}`, className);
  const trailing = (action || arrow || menu) && (
    <div className={part('trailing')}>
      {action}
      {arrow && <Icon name="ArrowUpRight" className={part('arrow')} />}
      {menu}
    </div>
  );
  if (type === 'window') {
    return (
      <header className={classes} {...rest}>
        <span className={part('lights')} aria-hidden="true">
          <StatusDot tone="danger" aria-hidden />
          <StatusDot tone="warning" aria-hidden />
          <StatusDot tone="success" aria-hidden />
        </span>
        <Heading className={part('window-title')}>{named}</Heading>
        {trailing}
      </header>
    );
  }
  const text = (
    <div className={part('header-text')}>
      {eyebrow && (type === 'title' || type === 'icon') && <p className={part('eyebrow')}>{eyebrow}</p>}
      <div className={part('title-row')}>
        <Heading className={part('title')}>
          {type === 'number' && number && <span className={part('number')}>{number}</span>}
          {named}
        </Heading>
        {count !== undefined && count !== null && count !== false && <Badge size="sm">{count}</Badge>}
        {status}
      </div>
      {meta && <p className={part('meta')}>{meta}</p>}
    </div>
  );
  return (
    <header className={classes} {...rest}>
      {type === 'icon' && (
        <div className={part('top')}>
          <span className={cx(part('icon-tile'), iconColor === 'brand' && `${part('icon-tile')}--color-brand`)}>
            <Icon name={icon ?? 'Stack'} className={part('icon')} />
          </span>
          {trailing}
        </div>
      )}
      {type === 'person' && (
        <Avatar className={part('avatar')} size={AVATAR_SIZE[size]} tone="brand" src={avatarSrc} aria-hidden="true">
          {initials ?? (typeof title === 'string' ? avatarInitials(title) : '')}
        </Avatar>
      )}
      {text}
      {type !== 'icon' && trailing}
    </header>
  );
}

/* ---------------------------------------------------------------- body */

export type CardBodyType = 'text' | 'slot';

export interface CardBodyProps extends HTMLAttributes<HTMLElement> {
  /** Text (the default), set in the body's type with paragraphs apart, or slot, which stacks whatever the page puts in it: a stat, a list, a description list, a progress bar, a code block, an empty state or a chart. */
  type?: CardBodyType;
  children?: ReactNode;
}

/**
 * The middle of a card: text, or a slot for the system's other components.
 *
 *   <Card title="Team activity"><CardBody type="slot"><Stat name="Resources published" figure={128} description="24 new this month" /></CardBody></Card>
 */
export function CardBody({ type = 'text', children, className, ...rest }: CardBodyProps) {
  const body = part('body');
  const nested = useContext(AddedBody);
  useEffect(() => {
    if (!nested || warnedNested || !developing()) return;
    warnedNested = true;
    console.warn('A CardBody is drawn inside the body the card added around its content, so the card has a body inside a body. Give the card the CardBody as its child, or mark the component that draws it: YourBody.cardPart = \'body\'.');
  }, [nested]);
  return (
    <div className={cx(body, `${body}--type-${type}`, className)} {...rest}>
      {children}
    </div>
  );
}

CardBody.cardPart = 'body' as CardPart;

/* ---------------------------------------------------------------- footer */

export type CardFooterType = 'actions' | 'link-and-actions' | 'full-button' | 'link' | 'meta' | 'tags' | 'people' | 'total' | 'note';

export interface CardFooterProps extends HTMLAttributes<HTMLElement> {
  /**
   * What the footer holds: actions (buttons at the end), link and actions, a full-width button, a link,
   * meta (a person's name, the reading time at the end), tags, people, a total, or a note beside a button.
   */
  type?: CardFooterType;
  /** The rule above the footer. On by default; the panel layout draws a divider instead. */
  rule?: boolean;
  /** What sits at the row's start: a link, a person, a note, a total's label. */
  start?: ReactNode;
  /** What sits at the row's end: the buttons, the reading time, a total's figure. */
  end?: ReactNode;
  /** The row's content when it has no start and end, such as a full-width button or tags. */
  children?: ReactNode;
}

/**
 * The bottom of a card: a rule, then one row.
 *
 *   <CardFooter end={<><Button tone="ghost" size="sm">Preview</Button><Button tone="brand" size="sm">Open</Button></>} />
 */
export function CardFooter({ type = 'actions', rule = true, start, end, children, className, ...rest }: CardFooterProps) {
  const footer = part('footer');
  return (
    <footer className={cx(footer, `${footer}--type-${type}`, !rule && `${footer}--rule-off`, className)} {...rest}>
      <div className={part('footer-row')}>
        {start && <div className={part('footer-start')}>{start}</div>}
        {children}
        {end && <div className={part('footer-end')}>{end}</div>}
      </div>
    </footer>
  );
}

CardFooter.cardPart = 'footer' as CardPart;
