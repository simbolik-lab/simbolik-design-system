import { useEffect, useId, useLayoutEffect, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { Icon } from '../icon/icon.js';
import { placeIndicator } from '../indicator.js';
import { tableOfContents } from './table-of-contents.manifest.js';

export interface TocItem {
  /** The id of the section element the item scrolls to. */
  id: string;
  title: string;
  children?: TocItem[];
}

export interface TableOfContentsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The heading over the list, and the navigation's name unless `aria-label` gives it another. */
  label?: string;
  items: TocItem[];
  /** The id of the section to mark. When omitted, the one in view is marked as the page scrolls. */
  active?: string;
  /** Content that belongs with the contents, shown under the list inside the same card: a page's key facts. It is not navigation, so the card then holds the navigation and this beside it. In the narrow form it stays shown when the list is closed. */
  extra?: ReactNode;
  /**
   * The narrow form only: whether the list shows under the heading row (Figma's Open). Give it to control the
   * component from outside, with `onOpenChange`; leave it out and the component keeps its own state, starting
   * from `defaultOpen`. In a wide space the list always shows.
   */
  open?: boolean;
  /** Where the narrow form starts when `open` is not given. Closed by default, on purpose (Figma's component default is open, to show the list). */
  defaultOpen?: boolean;
  /** Called when the heading row is pressed, with the state it asks for. */
  onOpenChange?: (open: boolean) => void;
}

function flatten(items: TocItem[]): TocItem[] {
  return items.flatMap((i) => [i, ...(i.children ? flatten(i.children) : [])]);
}

/**
 * Table of contents: a navigation landmark that follows the reader down the page. One list, in two forms
 * the layout switch chooses, by CSS: in a wide space the card, its label over the links; in a
 * narrow one a box whose heading row is a button that opens and closes the links, as Figma's mobile
 * variant draws it. The button and the label carry the same words, and only one of them is ever shown.
 * The line marking the current section is one indicator that slides from item to item; the stylesheet
 * does the motion, the wrapper only measures where the line goes.
 */
export function TableOfContents({ label = 'On this page', items, active, extra, open, defaultOpen = false, onOpenChange, className, 'aria-label': name, ...rest }: TableOfContentsProps) {
  const [seen, setSeen] = useState<string>(items[0]?.id ?? '');
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;
  const toggle = () => {
    if (open === undefined) setInternal(!isOpen);
    onOpenChange?.(!isOpen);
  };
  const bodyId = useId();
  // An item just pressed stays marked until the reader scrolls on their own: the jump may leave its
  // section short of the line (a short last section cannot reach it) or pass other sections on the way.
  const chosen = useRef(false);
  // The ids of the sections, as one value: a page that hands over a new list with the same sections on
  // every render (an inline array) does not set the watching up again each time.
  const keys = flatten(items)
    .map((i) => i.id)
    .join('\u0000');
  useEffect(() => {
    if (active !== undefined) return;
    const els = keys
      .split('\u0000')
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    let frame = 0;
    // The section in view is the last one whose top has passed the upper third of the window; before
    // any has, the first. Read from where the sections are, so a jump marks the right one as well as a scroll.
    const spy = () => {
      frame = 0;
      if (chosen.current) return;
      const line = window.innerHeight * 0.3;
      let current = els[0]!.id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      setSeen(current);
    };
    // Any scroll, of the window or of a part the page scrolls inside; at most once a frame.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(spy);
    };
    const release = () => {
      chosen.current = false;
    };
    const own = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    for (const type of own) window.addEventListener(type, release, { capture: true, passive: true });
    spy();
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true });
      for (const type of own) window.removeEventListener(type, release, { capture: true });
      cancelAnimationFrame(frame);
    };
  }, [keys, active]);
  const current = active ?? seen;
  const item = tableOfContents.part('item');

  /* The line slides only when the current section changes; the first placement lands at once. */
  const bodyRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const shown = useRef<string | undefined>(undefined);
  const currentItem = (body: HTMLElement | null) => body?.querySelector<HTMLElement>(`.${item}[aria-current="true"]`) ?? null;
  useLayoutEffect(() => {
    placeIndicator(bodyRef.current, markRef.current, currentItem(bodyRef.current), shown.current === undefined || shown.current === current);
    shown.current = current;
  }, [current]);

  /* The items change size with fonts loading, the space given and the narrow box opening: follow them at once. */
  useEffect(() => {
    const body = bodyRef.current;
    if (!body || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => placeIndicator(body, markRef.current, currentItem(body), true));
    observer.observe(body);
    for (const link of body.querySelectorAll(`.${item}`)) observer.observe(link);
    return () => observer.disconnect();
  }, [keys]);

  const choose = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (active !== undefined || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    chosen.current = true;
    setSeen(id);
  };
  const render = (list: TocItem[], child: boolean) =>
    list.map((i) => (
      <li key={i.id}>
        <a className={[item, child ? `${item}--child` : ''].filter(Boolean).join(' ')} href={`#${i.id}`} aria-current={i.id === current ? 'true' : undefined} onClick={choose(i.id)}>
          {i.title}
        </a>
        {i.children && i.children.length > 0 && <ul className={tableOfContents.part('list')}>{render(i.children, true)}</ul>}
      </li>
    ));
  const body = (
    <>
      <p className={tableOfContents.part('label')}>
        <span className={tableOfContents.part('label-text')}>{label}</span>
      </p>
      <button type="button" className={tableOfContents.part('toggle')} aria-expanded={isOpen} aria-controls={bodyId} onClick={toggle}>
        <span className={tableOfContents.part('heading')}>
          <Icon name="ListDashes" className={tableOfContents.part('icon')} />
          <span className={tableOfContents.part('heading-text')}>{label}</span>
        </span>
        <Icon name="CaretRight" className={tableOfContents.part('caret')} />
      </button>
      <div ref={bodyRef} id={bodyId} className={tableOfContents.part('body')}>
        <span ref={markRef} className={tableOfContents.part('indicator')} aria-hidden="true" />
        <ul className={tableOfContents.part('list')}>{render(items, false)}</ul>
      </div>
    </>
  );
  const block = [tableOfContents({ open: isOpen }), className].filter(Boolean).join(' ');
  if (extra === undefined || extra === null || extra === false) {
    return (
      <nav className={block} aria-label={name ?? label} {...rest}>
        {body}
      </nav>
    );
  }
  // With extra content the card is a plain box holding the navigation landmark and, under it, the extra part.
  return (
    <div className={block} {...rest}>
      <nav className={tableOfContents.part('nav')} aria-label={name ?? label}>
        {body}
      </nav>
      <div className={tableOfContents.part('extra')}>{extra}</div>
    </div>
  );
}
