import { useCallback, useEffect, useId, useLayoutEffect, useRef, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { Badge } from '../badge/badge.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { useNameWarning } from '../name-check.js';
import { useControllable } from '../controllable.js';
import { log } from './log.manifest.js';

export interface LogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'>, VariantProps<typeof log.manifest> {
  /** The lines printed so far, oldest first. Each wraps to the well's width. */
  lines: readonly string[];
  /** What printed them, such as "Build output", above the well with the badge. It names the well. */
  title?: string;
  /** The name of the well when the log has no title. */
  'aria-label'?: string;
  /** A line above the output, such as "40 earlier lines left out", with a divider under it. */
  note?: ReactNode;
  /** The page's own short status, such as "120 lines printed", said to a screen reader when it changes. Change it seldom. */
  status?: string;
  /** The words in the well before anything is printed. "Waiting for output…" while running, "No output." once finished. */
  emptyText?: string;
  /** Whether the well keeps the newest line in view. Leave it out and the log keeps it itself: it follows until the reader scrolls up, and again once they jump back down or scroll to the end. */
  following?: boolean;
  /** Called when the reader stops or restarts the following. */
  onFollowingChange?: (following: boolean) => void;
  /**
   * The words of each state, on the badge and said with the title: "Running", "Waiting" (running with nothing printed
   * yet) and "Finished", each in English unless given, for a page in another language.
   */
  stateLabels?: { running?: string; waiting?: string; finished?: string };
  /** The button that jumps back to the newest line: "Jump to latest" unless given. */
  jumpLabel?: string;
  /** Reaches the outer element. */
  ref?: Ref<HTMLDivElement>;
}

/** How close to the end, in pixels, still counts as at the end: a rounded scroll position never lands exactly. */
const END = 2;

/**
 * Log: what a program prints as it runs, in a well that keeps the newest line in view.
 *
 *   <Log title="Build output" lines={lines} state={done ? 'finished' : 'running'} />
 *
 * The lines are never read out one by one. A screen reader hears when the log starts printing and when it
 * finishes, and the page's own `status` when it changes. Scrolling up stops the following; "Jump to
 * latest", or scrolling back to the end, starts it again.
 */
export function Log({ lines, state, title, note, status, emptyText, following: asked, onFollowingChange, stateLabels, jumpLabel = 'Jump to latest', className, 'aria-label': ariaLabel, ...rest }: LogProps) {
  const part = log.part;
  const id = useId();
  const scroll = useRef<HTMLDivElement>(null);
  const output = useRef<HTMLElement>(null);
  const [following, keepFollowing] = useControllable({ value: asked, defaultValue: true, onChange: onFollowingChange, name: 'Log following' });
  const followingRef = useRef(following);
  followingRef.current = following;
  const finished = (state ?? log.manifest.axes.state.default) === 'finished';
  const empty = lines.length === 0;

  useNameWarning('Log', Boolean(title || ariaLabel || rest['aria-labelledby']), 'Give it a title, or an aria-label that says what printed it.');

  const setFollowing = useCallback(
    (next: boolean) => {
      if (next === followingRef.current) return;
      followingRef.current = next;
      keepFollowing(next);
    },
    [keepFollowing],
  );

  const toEnd = () => {
    const el = scroll.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // While following, every new line, and every change of width that rewraps the lines, keeps the end in view.
  useLayoutEffect(() => {
    if (followingRef.current) toEnd();
  }, [lines, following]);
  useEffect(() => {
    const el = output.current;
    if (!el || !('ResizeObserver' in window)) return undefined;
    const watch = new ResizeObserver(() => {
      if (followingRef.current) toEnd();
    });
    watch.observe(el);
    return () => watch.disconnect();
  }, [empty]);

  // The reader's own scroll: leaving the end stops the following, coming back to it starts it again.
  const onScroll = () => {
    const el = scroll.current;
    if (!el) return;
    setFollowing(el.scrollHeight - el.scrollTop - el.clientHeight <= END);
  };

  const jump = () => {
    setFollowing(true);
    toEnd();
    // The button goes once the log follows again, so the keyboard goes back to the well it was in.
    scroll.current?.focus();
  };

  const word = finished ? (stateLabels?.finished ?? 'Finished') : empty ? (stateLabels?.waiting ?? 'Waiting') : (stateLabels?.running ?? 'Running');
  const name = title ?? ariaLabel ?? 'Log';
  const said = `${name}: ${word}${status ? `. ${status}` : ''}`;
  const classes = cx(log({ state }), className);

  return (
    <div className={classes} data-following={following ? 'true' : 'false'} {...rest}>
      {title && (
        <div className={part('header')}>
          <span className={part('title')} id={`${id}-title`}>{title}</span>
          <Badge look="soft" size="sm" tone={finished ? 'success' : 'info'} className={part('status')}>
            {word}
          </Badge>
        </div>
      )}
      <div className={part('well')}>
        <div
          ref={scroll}
          className={part('scroll')}
          role="region"
          tabIndex={0}
          {...(title ? { 'aria-labelledby': `${id}-title` } : { 'aria-label': ariaLabel })}
          onScroll={onScroll}
        >
          {note !== undefined && note !== null && note !== false && note !== '' && (
            <>
              <p className={part('note')}>{note}</p>
              <Divider className={part('divider')} />
            </>
          )}
          {empty ? (
            <p ref={output as Ref<HTMLParagraphElement>} className={`${part('lines')} ${part('lines')}--empty`}>
              {emptyText ?? (finished ? 'No output.' : 'Waiting for output…')}
            </p>
          ) : (
            <pre ref={output as Ref<HTMLPreElement>} className={part('lines')}>
              {lines.join('\n')}
            </pre>
          )}
        </div>
        {!following && !empty && (
          <div className={part('jump')}>
            <Button tone="ghost" size="sm" onClick={jump}>
              {jumpLabel}
            </Button>
          </div>
        )}
      </div>
      <span role="status" className={part('announcement')}>
        {said}
      </span>
    </div>
  );
}
