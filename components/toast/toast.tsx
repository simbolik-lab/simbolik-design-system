'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { toast } from './toast.manifest.js';
import { alertContent } from '../alert/alert.js';
import { motionMs } from '../motion.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof toast.manifest> {
  /** Phosphor icon. Defaults to the tone's own, as the alert's. */
  icon?: string;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  /** The dismiss cross's name, what a screen reader says for it. "Dismiss" unless given, for a page in another language. */
  dismissLabel?: string;
}

/**
 * Toast: one message, built on the alert: the alert's inside (`alertContent`) with the toast's own classes. On its
 * own it is announced politely (the status role), a danger one at once (the alert role), and stays until the page
 * removes it; inside a toast region the region announces it, times it and closes it.
 */
export function Toast({ tone, icon, title, children, action, onDismiss, dismissLabel, className, ...rest }: ToastProps) {
  const classes = cx(toast({ tone }), className);
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={classes} {...rest}>
      {alertContent((name) => toast.part(name), { tone, icon, title, children, action, onDismiss, dismissLabel }, 'p')}
    </div>
  );
}

/** How long a toast stays when nothing holds it, in milliseconds, unless it says otherwise. */
export const TOAST_DURATION = 6000;

/** One toast to show through a toast region. */
export interface ToastMessage extends VariantProps<typeof toast.manifest> {
  icon?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** One small action, such as Undo. A toast with an action stays until it is closed, unless given a duration. */
  action?: ReactNode;
  /**
   * How long it stays, in milliseconds, while nobody points at the region or has focus in it; null to stay until it
   * is closed. By default six seconds, and no time at all for the danger tone or a toast with an action: those stay.
   */
  duration?: number | null;
  /** Whether it shows the cross. True by default. */
  dismissible?: boolean;
}

export interface Toasts {
  /** Shows a toast, or queues it while the region shows its most; returns its id. */
  show(message: ToastMessage): string;
  /** Closes a toast by its id, or takes it from the queue. */
  dismiss(id: string): void;
}

const Context = createContext<Toasts | null>(null);

/** The toasts of the toast region around this component. */
export function useToasts(): Toasts {
  const toasts = useContext(Context);
  if (!toasts) throw new Error('useToasts() needs a ToastRegion around it.');
  return toasts;
}

export interface ToastRegionProps extends HTMLAttributes<HTMLDivElement> {
  /** The page, or the part of it, that shows toasts. */
  children?: ReactNode;
  /** The region's name for a screen reader. */
  label?: string;
  /** How many toasts show at once; the others wait their turn. */
  max?: number;
  /** The name of each toast's dismiss cross. "Dismiss" unless given, for a page in another language. */
  dismissLabel?: string;
}

interface Entry {
  id: string;
  message: ToastMessage;
  leaving: boolean;
}

/** A shown toast's words, as its announcer says them: at once for the danger tone, politely for the rest. */
interface Announcement {
  id: string;
  words: string;
  urgent: boolean;
}

/** The key that moves focus to the newest toast and back, as in Base UI's and other toast regions. */
const SHORTCUT = 'F6';

/** A toast's title and description as one line to say, from what it drew. */
function wordsOf(element: Element): string {
  const parts = [toast.part('title'), toast.part('description')].map((name) => element.querySelector(`.${name}`)?.textContent?.trim() ?? '');
  const [title, description] = parts;
  if (!title || !description) return title || description || '';
  return /[.!?:]$/.test(title) ? `${title} ${description}` : `${title}. ${description}`;
}

interface Timer {
  remaining: number;
  started: number;
  handle?: ReturnType<typeof setTimeout>;
}

function durationOf(message: ToastMessage): number | null {
  if (message.duration !== undefined) return message.duration;
  return message.tone === 'danger' || message.action ? null : TOAST_DURATION;
}

/**
 * Toast region: where a page's toasts appear, in the corner at the end of the viewport's foot, and the one live region
 * they are announced through. Put it round the page once, as it loads, so the first toast is announced too; call
 * `useToasts().show()` anywhere inside it.
 *
 *   <ToastRegion><App /></ToastRegion>
 *   const toasts = useToasts(); toasts.show({ tone: 'success', title: 'Invite sent' });
 *
 * A toast leaves after its time unless the pointer is on the region or focus is in it, which holds every timer; Escape
 * closes the toast focus is in, and focus moves to the next toast or back where it came from. It never takes focus by
 * itself: F6 moves focus to the newest toast while any shows, and F6 again goes back where it was.
 *
 * The region is a named landmark, not a live region: each toast's words are said by one of two hidden announcers
 * inside it, politely (the status role), or at once for a danger toast (the alert role), so none is said twice.
 */
export function ToastRegion({ children, label = 'Notifications', max = 3, dismissLabel, className, onPointerEnter, onPointerLeave, onFocus, onBlur, onKeyDown, ...rest }: ToastRegionProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [pointer, setPointer] = useState(false);
  const [focus, setFocus] = useState(false);
  const [away, setAway] = useState(false);
  const region = useRef<HTMLDivElement>(null);
  const timers = useRef(new Map<string, Timer>());
  const removals = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const returnTo = useRef<HTMLElement | null>(null);
  const count = useRef(0);
  const [announced, setAnnounced] = useState<Announcement[]>([]);

  const dismiss = useCallback((id: string) => {
    const element = region.current?.querySelector(`[data-toast="${id}"]`);
    // Focus in a toast that is leaving moves on to the next toast, or back where it came from, so it is never lost.
    if (element && element.contains(document.activeElement)) {
      const next = Array.from(region.current!.querySelectorAll<HTMLElement>('[data-toast]:not([hidden])')).find((other) => other !== element);
      const target = next?.querySelector<HTMLElement>('button, a[href], [tabindex]') ?? (returnTo.current?.isConnected ? returnTo.current : null);
      if (target) target.focus();
      else (document.activeElement as HTMLElement | null)?.blur();
    }
    setEntries((list) => (element ? list.map((entry) => (entry.id === id ? { ...entry, leaving: true } : entry)) : list.filter((entry) => entry.id !== id)));
  }, []);

  const show = useCallback((message: ToastMessage) => {
    count.current += 1;
    const id = `${count.current}`;
    setEntries((list) => [...list, { id, message, leaving: false }]);
    return id;
  }, []);

  const toasts = useMemo<Toasts>(() => ({ show, dismiss }), [show, dismiss]);

  // A hidden page holds the timers too, so nothing leaves while nobody can see it.
  useEffect(() => {
    const update = () => setAway(document.visibilityState === 'hidden');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const held = pointer || focus || away;
  const shown = entries.slice(0, max);
  const showing = shown.some((entry) => !entry.leaving);

  // Each toast's words go to its announcer once it is drawn, and leave with it; a toast waiting its turn is said when
  // it shows.
  useLayoutEffect(() => {
    setAnnounced((was) => {
      const kept = was.filter((a) => entries.some((entry) => entry.id === a.id));
      const added = shown.flatMap((entry) => {
        if (entry.leaving || kept.some((a) => a.id === entry.id)) return [];
        const element = region.current?.querySelector(`[data-toast="${entry.id}"]`);
        const words = element ? wordsOf(element) : '';
        return words ? [{ id: entry.id, words, urgent: entry.message.tone === 'danger' }] : [];
      });
      return added.length || kept.length !== was.length ? [...kept, ...added] : was;
    });
  }, [entries, max]);

  // F6 moves focus to the newest toast (its first button or link, or the toast itself) while any shows, and from
  // inside the region back where it came from.
  useEffect(() => {
    if (!showing) return undefined;
    const onKey = (event: globalThis.KeyboardEvent) => {
      const r = region.current;
      if (event.key !== SHORTCUT || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !r) return;
      event.preventDefault();
      if (r.contains(document.activeElement)) {
        if (returnTo.current?.isConnected) returnTo.current.focus();
        else (document.activeElement as HTMLElement | null)?.blur();
        return;
      }
      const newest = Array.from(r.querySelectorAll<HTMLElement>('[data-toast]:not([hidden])')).pop();
      if (!newest) return;
      const target = newest.querySelector<HTMLElement>('button, a[href]') ?? newest;
      if (target === newest) newest.tabIndex = -1;
      const from = document.activeElement;
      if (from instanceof HTMLElement && from !== document.body) returnTo.current = from;
      target.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showing]);

  // Each shown toast with a time runs its timer while nothing holds the region, and keeps what is left while held.
  useEffect(() => {
    const live = new Set<string>();
    for (const entry of shown) {
      const duration = durationOf(entry.message);
      if (entry.leaving || duration === null) continue;
      live.add(entry.id);
      let timer = timers.current.get(entry.id);
      if (!timer) {
        timer = { remaining: duration, started: 0 };
        timers.current.set(entry.id, timer);
      }
      if (held && timer.handle !== undefined) {
        clearTimeout(timer.handle);
        timer.handle = undefined;
        timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.started));
      } else if (!held && timer.handle === undefined) {
        timer.started = Date.now();
        timer.handle = setTimeout(() => dismiss(entry.id), timer.remaining);
      }
    }
    for (const [id, timer] of timers.current) {
      if (live.has(id)) continue;
      if (timer.handle !== undefined) clearTimeout(timer.handle);
      timers.current.delete(id);
    }
  });

  // A toast that is leaving is hidden, which plays its exit, and is taken out of the page once the exit has run.
  useEffect(() => {
    for (const entry of entries) {
      if (!entry.leaving || removals.current.has(entry.id)) continue;
      const wait = region.current ? motionMs(region.current, 'exit-duration') : 0;
      removals.current.set(
        entry.id,
        setTimeout(() => {
          removals.current.delete(entry.id);
          setEntries((list) => list.filter((other) => other.id !== entry.id));
        }, wait),
      );
    }
  }, [entries]);

  useEffect(
    () => () => {
      for (const timer of timers.current.values()) if (timer.handle !== undefined) clearTimeout(timer.handle);
      for (const handle of removals.current.values()) clearTimeout(handle);
    },
    [],
  );

  const enterFocus = (event: FocusEvent<HTMLDivElement>) => {
    const from = event.relatedTarget as HTMLElement | null;
    if (!focus && from && !region.current?.contains(from)) returnTo.current = from;
    setFocus(true);
    onFocus?.(event);
  };
  const leaveFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (!region.current?.contains(event.relatedTarget as Node | null)) setFocus(false);
    onBlur?.(event);
  };
  const escape = (event: KeyboardEvent<HTMLDivElement>) => {
    const host = (event.target as HTMLElement).closest<HTMLElement>('[data-toast]');
    if (event.key === 'Escape' && host?.dataset.toast) {
      event.preventDefault();
      dismiss(host.dataset.toast);
    }
    onKeyDown?.(event);
  };

  return (
    <Context.Provider value={toasts}>
      {children}
      <div
        ref={region}
        role="region"
        aria-label={label}
        aria-keyshortcuts={SHORTCUT}
        className={cx(toast.part('region'), className)}
        onPointerEnter={(event) => {
          setPointer(true);
          onPointerEnter?.(event);
        }}
        onPointerLeave={(event) => {
          setPointer(false);
          onPointerLeave?.(event);
        }}
        onFocus={enterFocus}
        onBlur={leaveFocus}
        onKeyDown={escape}
        {...rest}
      >
        {/* The announcers, hidden from view inside the region, which is fixed to the window and so frames them: placed
            against the window, far down a long page, they would stretch it. */}
        <div role="status" aria-atomic="false" className="smbk-visually-hidden">
          {announced.filter((a) => !a.urgent).map((a) => <p key={a.id}>{a.words}</p>)}
        </div>
        <div role="alert" aria-atomic="false" className="smbk-visually-hidden">
          {announced.filter((a) => a.urgent).map((a) => <p key={a.id}>{a.words}</p>)}
        </div>
        {shown.map(({ id, message, leaving }) => {
          const { description, dismissible = true, duration: _duration, ...look } = message;
          return (
            <Toast key={id} data-toast={id} role={undefined} hidden={leaving} onDismiss={dismissible ? () => dismiss(id) : undefined} dismissLabel={dismissLabel} {...look}>
              {description}
            </Toast>
          );
        })}
      </div>
    </Context.Provider>
  );
}
