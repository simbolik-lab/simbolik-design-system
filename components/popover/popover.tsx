/**
 * Popover: a small raised panel beside the button that opened it, holding a title,
 * a few lines or a field, and actions. It does not block the page.
 *
 * OPENER API — how to open it from a button
 * -----------------------------------------
 * Give the popover its opener as `trigger`, as the dropdown takes one. It then draws
 * the opener, hangs the panel under it, and does the keyboard and focus work. Without
 * `trigger` it draws the panel only, open, for a consumer that shows and places it itself.
 *
 *   <Popover trigger={<Button tone="outline" size="md" trailingIcon="CaretDown">Share</Button>}>
 *     <PopoverHeader title="Share this page" />
 *     <PopoverBody>Anyone with the link can read it.</PopoverBody>
 *     <PopoverFooter><Button tone="outline" size="sm" trailingIcon="Copy">Copy link</Button></PopoverFooter>
 *   </Popover>
 *
 * Popover props:
 *   trigger       The opener: any element that renders one button and passes id, aria-*, onClick and
 *                 onKeyDown through to it (Button, a plain <button>). The popover adds id (unless it has
 *                 one), aria-haspopup="dialog", aria-expanded and aria-controls. Its own onClick runs first;
 *                 calling preventDefault in it stops the popover's.
 *   label         Accessible name of the panel. Needed only without a PopoverHeader, whose title names it.
 *   align         "start" (default) or "end": which edge of the opener the panel lines up with.
 *   open          Controlled open state. Pair it with onOpenChange.
 *   defaultOpen   The first state when uncontrolled.
 *   onOpenChange  Called with the new state whenever the popover opens or closes itself.
 *   Other props (className, data-*) go to the panel.
 *
 * Focus: pressing the opener shows the panel and leaves focus on the
 * opener; the panel follows the opener in the page, so Tab goes into it next. Escape, from the opener or
 * anywhere in the panel, closes it and returns focus to the opener, as does the header's close button.
 * Escape with focus elsewhere on the page also closes it, and leaves focus where it is.
 * A click or tap outside closes it, and so does focus moving anywhere outside. A closed panel is hidden,
 * not removed, so what was typed into a field inside it is kept.
 *
 * Movement belongs to the stylesheet: the panel drops in from the opener and fades, and does not move
 * under reduced motion. The wrapper holds no styling: the stylesheet draws everything.
 */
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { popover } from './popover.manifest.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { Icon } from '../icon/icon.js';
import type { VariantProps } from '../variants.js';

/** What the header needs from the popover around it. */
interface PopoverContext {
  /** The id the header's title takes, which names the panel. */
  titleId: string;
  /** Closes the popover, returning focus to the opener when there is one. */
  close: () => void;
}

const Context = createContext<PopoverContext | null>(null);

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof popover.manifest> {
  /** Accessible name of the panel, when it has no header title to name it. */
  label?: string;
  children: ReactNode;
  /** The opener. When given, the popover draws it and opens the panel under it. */
  trigger?: ReactElement;
  /** Controlled open state. */
  open?: boolean;
  /** The first state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new state whenever the popover opens or closes itself. */
  onOpenChange?: (open: boolean) => void;
}

/** Popover: the panel alone, or the panel with its opener when `trigger` is given. See the opener API above. */
export function Popover(props: PopoverProps) {
  return props.trigger ? <PopoverWithOpener {...props} trigger={props.trigger} /> : <PopoverPanel {...props} />;
}

/** The panel alone, shown. Its close button asks whoever shows it to close it. */
function PopoverPanel({ label, align, trigger: _trigger, open: _open, defaultOpen: _defaultOpen, onOpenChange, className, children, ...rest }: PopoverProps) {
  const titleId = `${useId()}-title`;
  return (
    <div role="dialog" aria-label={label} aria-labelledby={label ? undefined : titleId} className={[popover({ align }), className].filter(Boolean).join(' ')} {...rest}>
      <Context.Provider value={{ titleId, close: () => onOpenChange?.(false) }}>{children}</Context.Provider>
    </div>
  );
}

/** The opener and the panel hanging under it, with the popover's keyboard and focus behaviour. */
function PopoverWithOpener({ label, align, trigger, open: controlled, defaultOpen = false, onOpenChange, className, children, ...rest }: PopoverProps & { trigger: ReactElement }) {
  const id = useId();
  const openerProps = trigger.props as { id?: string; onClick?: (e: MouseEvent<HTMLElement>) => void };
  const openerId = openerProps.id ?? `${id}-opener`;
  const panelId = `${id}-panel`;
  const titleId = `${id}-title`;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const anchor = useRef<HTMLSpanElement>(null);

  const setOpen = (next: boolean, focusOpener = false) => {
    if (focusOpener) document.getElementById(openerId)?.focus();
    if (next === open) return;
    if (controlled === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  // A click or tap anywhere outside closes it.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (anchor.current && !anchor.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  });

  // Escape closes it wherever focus is: a click that did not focus the opener (Safari) leaves focus outside it.
  // The anchor handles Escape first and stops it; this takes what reaches the page, and returns focus to the
  // opener only if focus was inside.
  useEffect(() => {
    if (!open) return;
    const escape = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      setOpen(false, anchor.current?.contains(document.activeElement) ?? false);
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  });

  const onOpenerClick = (e: MouseEvent<HTMLElement>) => {
    openerProps.onClick?.(e);
    if (e.defaultPrevented) return;
    setOpen(!open);
  };

  // Escape from the opener or anywhere in the panel closes it and puts focus back on the opener.
  const onKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key !== 'Escape' || !open || e.defaultPrevented) return;
    e.preventDefault();
    e.stopPropagation();
    setOpen(false, true);
  };

  // Focus moving to anything outside closes it. A blur with nowhere to go is a click, handled above.
  const onBlur = (e: FocusEvent<HTMLSpanElement>) => {
    const next = e.relatedTarget as Node | null;
    if (open && next && anchor.current && !anchor.current.contains(next)) setOpen(false);
  };

  const opener = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    id: openerId,
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': panelId,
    onClick: onOpenerClick,
  });

  return (
    <span ref={anchor} className={popover.part('anchor')} onKeyDown={onKeyDown} onBlur={onBlur}>
      {opener}
      <div
        id={panelId}
        role="dialog"
        aria-label={label}
        aria-labelledby={label ? undefined : titleId}
        className={[popover({ align }), className].filter(Boolean).join(' ')}
        hidden={!open}
        {...rest}
      >
        <Context.Provider value={{ titleId, close: () => setOpen(false, true) }}>{children}</Context.Provider>
      </div>
    </span>
  );
}

export interface PopoverHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** The title, which names the panel. */
  title: ReactNode;
  /** A line or two under the title. */
  description?: ReactNode;
  /** Phosphor icon name before the title. */
  icon?: string;
  /** A close button in the panel's corner. Figma: Discard. */
  closeButton?: boolean;
  /** A line under the header. */
  divider?: boolean;
}

/** The top of the panel: an optional icon, the title and description, an optional close button and divider. */
export function PopoverHeader({ title, description, icon, closeButton, divider, className, ...rest }: PopoverHeaderProps) {
  const context = useContext(Context);
  return (
    <div className={[popover.part('header'), className].filter(Boolean).join(' ')} {...rest}>
      <div className={popover.part('heading')}>
        {icon && <Icon name={icon} className={popover.part('icon')} />}
        <div className={popover.part('titles')}>
          <p id={context?.titleId} className={popover.part('title')}>
            {title}
          </p>
          {description && <p className={popover.part('description')}>{description}</p>}
        </div>
        {closeButton && <Button tone="ghost" size="sm" icon="X" icon-only aria-label="Close" className={popover.part('close')} onClick={context?.close} />}
      </div>
      {divider && <Divider className={popover.part('divider')} />}
    </div>
  );
}

export interface PopoverBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** The middle of the panel. Plain text is set in the description's look; anything else, such as a field, as it is. */
export function PopoverBody({ className, children, ...rest }: PopoverBodyProps) {
  return (
    <div className={[popover.part('body'), className].filter(Boolean).join(' ')} {...rest}>
      {Children.map(children, (child) => (typeof child === 'string' || typeof child === 'number' ? <p className={popover.part('description')}>{child}</p> : child))}
    </div>
  );
}

export interface PopoverFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** A line over the footer. On unless turned off, as Figma draws it. */
  divider?: boolean;
  /** A short line of help in place of, or under, the actions. Figma: Helper Text. */
  helper?: ReactNode;
  /** The actions, lined up at the end: one button, or a button group for several. */
  children?: ReactNode;
}

/** The foot of the panel: a divider, then the actions at the end or a line of helper text. */
export function PopoverFooter({ divider = true, helper, className, children, ...rest }: PopoverFooterProps) {
  return (
    <div className={[popover.part('footer'), className].filter(Boolean).join(' ')} {...rest}>
      {divider && <Divider className={popover.part('divider')} />}
      {children}
      {helper && <p className={popover.part('helper')}>{helper}</p>}
    </div>
  );
}
