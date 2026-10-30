'use client';

import { useEffect, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref, type SyntheticEvent } from 'react';
import { useObjectRef } from 'react-aria';
import { collapsible } from './collapsible.manifest.js';
import { Icon } from '../icon/icon.js';
import { useControllable } from '../controllable.js';
import { foldBack, settle, showsOpen, unfold, type Unfolding } from '../unfold.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'onToggle'>, VariantProps<typeof collapsible.manifest> {
  /** The words on the row that opens and closes it: what the panel holds, or what pressing does ("Show older releases"). */
  label: ReactNode;
  /** Phosphor icon name shown before the label. Figma: the Leading icon switch and its Icon. */
  icon?: string;
  /** Whether it is open, held by the page. Leave it out and pass `defaultExpanded` for the component to keep its own. */
  expanded?: boolean;
  /** Whether it starts open, when the component keeps its own state. */
  defaultExpanded?: boolean;
  /** Told the new state each time a press opens or closes it. */
  onExpandedChange?: (expanded: boolean) => void;
  /** What shows when open. */
  children: ReactNode;
  /** Reaches the details element. */
  ref?: Ref<HTMLDetailsElement>;
}

/** What the collapsible fades and reveals as it unfolds (unfold.ts): its panel. */
const UNFOLDING: Unfolding = {
  content: (block) => block.querySelector<HTMLElement>(`:scope > .${collapsible.part('panel')}`),
  reveal: '--smbk-collapsible-reveal',
};

/**
 * Collapsible: one native disclosure. Its row is the summary, so it opens and closes with Enter and Space and says
 * whether it is open with no script. Once it runs, the component takes every press on the row and moves the block
 * itself, the same in every browser (unfold.ts), as the accordion's items move, and marks it data-motion so the
 * stylesheet's own motion, for markup written by hand, stands aside.
 *
 * The open attribute is written once, as it starts; after that the component opens and closes the element itself,
 * so a page's `expanded` moves it with the same motion as a press. A disabled collapsible never opens or closes.
 */
export function Collapsible({
  label,
  icon,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  disabled,
  className,
  children,
  onClick,
  ref,
  ...rest
}: CollapsibleProps) {
  const own = useObjectRef(ref);
  const [expanded, setExpanded] = useControllable({ value: expandedProp, defaultValue: defaultExpanded, onChange: onExpandedChange, name: 'Collapsible expanded' });
  // The state it starts in, written into the markup once; React never writes the attribute again.
  const [startsOpen] = useState(expanded);
  const last = useRef(expanded);

  useEffect(() => {
    const block = own.current;
    if (!block) return undefined;
    block.dataset.motion = '';
    return () => {
      delete block.dataset.motion;
      settle(block);
    };
  }, [own]);

  // The page's value, or the component's own after a press, moves the element when it differs from what it shows.
  useEffect(() => {
    const block = own.current;
    if (!block || last.current === expanded) return;
    last.current = expanded;
    if (showsOpen(block) === expanded) return;
    if (expanded) unfold(block, UNFOLDING);
    else foldBack(block, UNFOLDING);
  }, [expanded, own]);

  const press = (event: MouseEvent<HTMLDetailsElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const block = event.currentTarget;
    const summary = (event.target as Element).closest('summary');
    if (!summary || summary !== block.querySelector(':scope > summary')) return;
    // The browser's own toggle never runs: the component opens and closes the element with its motion. A screen
    // reader's press, or Enter on a disabled row, is a click too, and does nothing.
    event.preventDefault();
    if (disabled) return;
    const next = !showsOpen(block);
    // Held by the component, it moves in the press itself; held by the page, it moves when the page passes the change.
    if (expandedProp === undefined) {
      last.current = next;
      if (next) unfold(block, UNFOLDING);
      else foldBack(block, UNFOLDING);
    }
    setExpanded(next);
  };

  // Something other than a press opened or closed it (the browser's find in page opens it to show a match): the
  // state follows what the element shows.
  const toggled = (event: SyntheticEvent<HTMLDetailsElement>) => {
    const block = event.currentTarget;
    if (block.dataset.moving !== undefined || block.dataset.closing !== undefined) return;
    if (block.open !== last.current) {
      last.current = block.open;
      setExpanded(block.open);
    }
  };

  return (
    <details ref={own} className={cx(collapsible({ disabled }), className)} open={startsOpen} onClick={press} onToggle={toggled} {...rest}>
      <summary className={collapsible.part('trigger')} aria-disabled={disabled ? true : undefined}>
        {icon && <Icon name={icon} className={collapsible.part('icon')} />}
        <span className={collapsible.part('label')}>{label}</span>
        <Icon name="CaretDown" className={collapsible.part('caret')} />
      </summary>
      <div className={collapsible.part('panel')}>{children}</div>
    </details>
  );
}
