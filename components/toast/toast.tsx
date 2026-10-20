import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
 * own it is announced politely (the status role) and stays until the page removes it; inside a toast region the
 * region announces it, times it and closes it.
 */
export function Toast({ tone, icon, title, children, action, onDismiss, dismissLabel, className, ...rest }: ToastProps) {
  const classes = cx(toast({ tone }), className);
  return (
    <div role="status" className={classes} {...rest}>
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
 * closes the toast focus is in, and focus moves to the next toast or back where it came from. It never takes focus.
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
        role="status"
        aria-live="polite"
        aria-atomic="false"
        aria-label={label}
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
