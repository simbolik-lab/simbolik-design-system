'use client';

/**
 * A disclosure (a details element) that unfolds and folds back with the expand purpose, moved by script so it moves the
 * same in every browser: the accordion's items and the sidebar's groups. Opening, the item opens at once and grows from
 * its summary's height to its own while its content fades in from the purpose's slight blur; closing, it folds back the
 * same way and closes only once it has. A press mid-motion turns it round from where it is.
 *
 * While it folds back it is marked `data-closing`, so what shows it open (a caret) turns back at once, and a name it
 * shares with other items is set aside (kept in `data-name`), so an item opening beside it does not shut it before its
 * motion ends. While it moves it is marked `data-moving`, for the stylesheet to clip it. Each motion holds its last
 * frame until the item has closed, so a closing item never shows open for a frame. Under reduced motion the height
 * lands at once and the fade still plays: an item opens and then fades in, and fades out and then shuts.
 *
 *   unfold(item, { content: (item) => item.querySelector(':scope > .smbk-accordion__content') });
 */
import { lengthPx, motionEasing, motionMs } from './motion.js';

export interface Unfolding {
  /** The part that fades in and out as the item opens and closes: what the summary discloses. */
  content: (item: HTMLDetailsElement) => HTMLElement | null;
  /** A custom property, registered as a length, that the stylesheet reads for how much of the content shows from its top: moved with the height. */
  reveal?: string;
}

/** The motions of an item while it moves, so a press mid-motion turns it round from where it is. */
const moving = new WeakMap<HTMLDetailsElement, { motions: Animation[]; done: () => void }>();

/** Opens an item, or turns a closing one round, growing it from where it is to its own height. */
export function unfold(item: HTMLDetailsElement, how: Unfolding): void {
  const from = where(item, how);
  stop(item);
  delete item.dataset.closing;
  restoreName(item);
  item.open = true;
  run(item, how, from, { height: item.getBoundingClientRect().height, opacity: 1, blur: 0 }, () => {});
}

/** Folds an item back from where it is to its summary's height, and closes it once it has. */
export function foldBack(item: HTMLDetailsElement, how: Unfolding): void {
  const from = where(item, how);
  stop(item);
  const name = item.getAttribute('name');
  if (name !== null) {
    item.dataset.name = name;
    item.removeAttribute('name');
  }
  item.dataset.closing = '';
  run(item, how, from, { height: closedHeight(item), opacity: 0, blur: blurOf(item) }, () => {
    item.open = false;
    delete item.dataset.closing;
    restoreName(item);
  });
}

/** Whether an item is open and not folding back: what a press would close. */
export function showsOpen(item: HTMLDetailsElement): boolean {
  return item.open && item.dataset.closing === undefined;
}

/** Ends an item's motion at once where it was going: closed if it was folding back. */
export function settle(item: HTMLDetailsElement): void {
  const running = moving.get(item);
  if (!running) return;
  stop(item);
  running.done();
}

/** How an item looks now: its height, and its content's opacity and blur, read mid-motion as they are at this frame. */
interface Look {
  height: number;
  opacity: number;
  blur: number;
}

const blurOf = (item: Element) => lengthPx(item, '--smbk-motion-expand-blur') ?? 0;

function where(item: HTMLDetailsElement, how: Unfolding): Look {
  if (!item.open) return { height: closedHeight(item), opacity: 0, blur: blurOf(item) };
  const content = how.content(item);
  const style = content ? getComputedStyle(content) : undefined;
  return {
    height: item.getBoundingClientRect().height,
    opacity: style ? Number.parseFloat(style.opacity) : 1,
    blur: Number.parseFloat(style?.filter.match(/blur\(([\d.]+)px\)/)?.[1] ?? '0'),
  };
}

/** The item's height with only its summary showing: the summary and the item's own edge. */
function closedHeight(item: HTMLDetailsElement): number {
  const style = getComputedStyle(item);
  const summary = item.querySelector(':scope > summary');
  return (summary?.getBoundingClientRect().height ?? 0) + Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth);
}

function restoreName(item: HTMLDetailsElement) {
  if (item.dataset.name === undefined) return;
  item.setAttribute('name', item.dataset.name);
  delete item.dataset.name;
}

function stop(item: HTMLDetailsElement) {
  for (const motion of moving.get(item)?.motions ?? []) motion.cancel();
  moving.delete(item);
  delete item.dataset.moving;
}

/**
 * Moves an item from one look to another with the expand purpose. The height, and how much of the content shows (the
 * reveal property, when there is one), move together, marked data-moving; under reduced motion they land at once, at
 * the start as an item opens and at the end as it closes.
 */
function run(item: HTMLDetailsElement, how: Unfolding, from: Look, to: Look, done: () => void) {
  const content = how.content(item);
  const timing: KeyframeAnimationOptions = { duration: motionMs(item, 'expand-duration'), easing: motionEasing(item, 'expand'), fill: 'forwards' };
  const motions: Animation[] = [];
  if (content) motions.push(content.animate([{ opacity: from.opacity, filter: `blur(${from.blur}px)` }, { opacity: to.opacity, filter: `blur(${to.blur}px)` }], timing));
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const closed = closedHeight(item);
    item.dataset.moving = '';
    motions.push(item.animate([{ height: `${from.height}px` }, { height: `${to.height}px` }], timing));
    if (content && how.reveal) motions.push(content.animate([{ [how.reveal]: `${Math.max(0, from.height - closed)}px` }, { [how.reveal]: `${Math.max(0, to.height - closed)}px` }], timing));
  }
  const last = motions[motions.length - 1];
  if (!last) {
    done();
    return;
  }
  moving.set(item, { motions, done });
  last.onfinish = () => {
    done();
    stop(item);
  };
}
