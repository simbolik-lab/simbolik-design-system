import { Fragment, useId, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { accordion } from './accordion.manifest.js';
import { Icon } from '../icon/icon.js';
import { Divider } from '../divider/divider.js';
import { motionEasing, motionMs } from '../motion.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  open?: boolean;
  disabled?: boolean;
  /** Items sharing a name close each other. An accordion names its own items; give a name to link items across accordions. */
  name?: string;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof accordion.manifest> {
  items: AccordionItemProps[];
  /** Let several items stay open at once. By default opening one closes the one that was open. */
  multiple?: boolean;
}

/**
 * Accordion: native disclosures. The flat look ends each item with the divider
 * component, as Figma's flat item does; it sits after the disclosure rather
 * than inside it, where a closed item would hide it with its content.
 *
 * One item stays open at a time: the items share a name, so the browser closes
 * the open one as another opens, with no script. `multiple` leaves them unnamed
 * (or with the names given), so each opens on its own.
 */
export function Accordion({ look, size, items, multiple = false, className, onClick, ...rest }: AccordionProps) {
  const group = useId();
  return (
    <div
      className={cx(accordion({ look, size }), className)}
      onClick={(event) => {
        onClick?.(event);
        move(event);
      }}
      {...rest}
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          <details
            className={cx(accordion.part('item'), item.disabled ? `${accordion.part('item')}--disabled` : '')}
            open={item.open}
            name={item.name ?? (multiple ? undefined : group)}
          >
            <summary className={accordion.part('summary')} aria-disabled={item.disabled ? true : undefined} tabIndex={item.disabled ? -1 : undefined}>
              <span className={accordion.part('title')}>{item.title}</span>
              <Icon name="CaretDown" className={accordion.part('caret')} />
            </summary>
            <div className={accordion.part('content')}>{item.children}</div>
          </details>
          {look === 'flat' && <Divider className={accordion.part('divider')} aria-hidden="true" />}
        </Fragment>
      ))}
    </div>
  );
}

/** Each item's height motion while it runs, so a press mid-motion turns it round from where it is. */
const moving = new WeakMap<HTMLDetailsElement, Animation>();

/**
 * The stylesheet grows an item's content to its natural height only where the browser can animate to one
 * (interpolate-size). Elsewhere a press on a summary is taken here and the item's height moved instead, with the
 * same enter and exit motion: an item opens at once and grows; one closing shrinks, and closes when it has. While
 * it shrinks it is marked data-closing, so its caret turns back at once, and its name is set aside, so the item
 * opening beside it does not shut it before its motion ends. Under reduced motion the browser opens and closes it.
 */
function move(event: MouseEvent<HTMLDivElement>) {
  if (event.defaultPrevented) return;
  const summary = (event.target as Element).closest('summary');
  const item = summary?.parentElement;
  if (!(item instanceof HTMLDetailsElement) || item.parentElement !== event.currentTarget || summary !== item.querySelector(':scope > summary')) return;
  // A disabled item never opens or closes, whatever presses its summary: the mouse cannot reach it, but a screen
  // reader's press, or Enter on a summary a script focused, still clicks it.
  if (item.classList.contains(`${accordion.part('item')}--disabled`)) {
    event.preventDefault();
    return;
  }
  if (CSS.supports('interpolate-size', 'allow-keywords') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  event.preventDefault();
  if (item.open && item.dataset.closing === undefined) {
    close(item);
    return;
  }
  const name = item.dataset.name ?? item.getAttribute('name');
  if (name) {
    for (const other of item.ownerDocument.querySelectorAll<HTMLDetailsElement>(`details[name="${CSS.escape(name)}"]`)) {
      if (other !== item && other.open) close(other);
    }
  }
  const from = item.open ? item.getBoundingClientRect().height : closedHeight(item);
  moving.get(item)?.cancel();
  delete item.dataset.closing;
  restoreName(item);
  item.open = true;
  run(item, from, item.getBoundingClientRect().height, 'enter', () => {});
}

function close(item: HTMLDetailsElement) {
  const from = item.getBoundingClientRect().height;
  moving.get(item)?.cancel();
  const name = item.getAttribute('name');
  if (name !== null) {
    item.dataset.name = name;
    item.removeAttribute('name');
  }
  item.dataset.closing = '';
  run(item, from, closedHeight(item), 'exit', () => {
    item.open = false;
    delete item.dataset.closing;
    restoreName(item);
  });
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

function run(item: HTMLDetailsElement, from: number, to: number, purpose: 'enter' | 'exit', done: () => void) {
  item.style.overflow = 'clip';
  const motion = item.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: motionMs(item, `${purpose}-duration`), easing: motionEasing(item, purpose) });
  moving.set(item, motion);
  motion.onfinish = () => {
    moving.delete(item);
    item.style.overflow = '';
    done();
  };
}
