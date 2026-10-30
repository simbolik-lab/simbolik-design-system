'use client';

import { Fragment, useEffect, useId, useRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { accordion } from './accordion.manifest.js';
import { Icon } from '../icon/icon.js';
import { Divider } from '../divider/divider.js';
import { foldBack, showsOpen, unfold, type Unfolding } from '../unfold.js';
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
 * the open one as another opens, even with no script. `multiple` leaves them
 * unnamed (or with the names given), so each opens on its own.
 *
 * Once it runs, the component moves the items itself, the same in every
 * browser, and marks the block data-motion so the stylesheet's own motion, for
 * markup written by hand, stands aside.
 */
export function Accordion({ look, size, items, multiple = false, className, onClick, ...rest }: AccordionProps) {
  const group = useId();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const block = root.current;
    if (!block) return;
    block.dataset.motion = '';
    return () => {
      delete block.dataset.motion;
    };
  }, []);
  return (
    <div
      ref={root}
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
            <summary className={accordion.part('summary')} aria-disabled={item.disabled ? true : undefined}>
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

/** What the accordion's items fade and reveal as they unfold (unfold.ts). */
const UNFOLDING: Unfolding = {
  content: (item) => item.querySelector<HTMLElement>(`:scope > .${accordion.part('content')}`),
  reveal: '--smbk-accordion-reveal',
};

/**
 * Every press on a summary is taken here and the item moved by the expand purpose, the same in every browser
 * (unfold.ts): an item opens at once and unfolds from its heading row to its own height while its content fades in,
 * and the foot of what shows fades as it moves (--smbk-accordion-reveal); one closing folds back the same way and
 * closes when it has. A press mid-motion turns it round from where it is.
 */
function move(event: MouseEvent<HTMLDivElement>) {
  if (event.defaultPrevented) return;
  const summary = (event.target as Element).closest('summary');
  const item = summary?.parentElement;
  if (!(item instanceof HTMLDetailsElement) || item.parentElement !== event.currentTarget || summary !== item.querySelector(':scope > summary')) return;
  event.preventDefault();
  // A disabled item never opens or closes, whatever presses its summary: the mouse cannot reach it, but a screen
  // reader's press, or Enter on its focused summary, still clicks it.
  if (item.classList.contains(`${accordion.part('item')}--disabled`)) return;
  if (showsOpen(item)) {
    foldBack(item, UNFOLDING);
    return;
  }
  // The open item of the same name folds away beside it. One in markup written by hand is left to the browser, which
  // shuts it as this one opens, and to the stylesheet's own motion.
  const name = item.dataset.name ?? item.getAttribute('name');
  if (name) {
    for (const other of item.ownerDocument.querySelectorAll<HTMLDetailsElement>(`details[name="${CSS.escape(name)}"]`)) {
      if (other !== item && other.open && other.parentElement?.matches('[data-motion]')) foldBack(other, UNFOLDING);
    }
  }
  unfold(item, UNFOLDING);
}
