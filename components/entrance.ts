/**
 * The charts' entrance: a chart draws itself once, the first time it comes into view (the bars grow, a line is
 * uncovered, a ring sweeps round). The wrapper writes `data-entrance="load"` on the chart's root in its markup and
 * its stylesheet does the moving, with the chart entrance motion tokens:
 *
 *   load      as the page draws: the entrance runs from the first frame, so a chart in view as the page opens is
 *             never shown finished and then emptied when the page's script starts (a prerendered page)
 *   waiting   the chart is out of view: drawn at the entrance's start, so it is empty when it scrolls in
 *   playing   the chart has come into view: the entrance runs, once
 *
 * This hook decides what happens next: a chart in view keeps the entrance it is playing; one out of view waits,
 * empty, and plays when 30% of it is seen. The mark goes when the entrance has finished, so a change of data after
 * it lands at once. Without the mark, as in markup written by hand, the chart is its finished drawing; under
 * reduced motion its stylesheet moves nothing and the mark is dropped. A page without script plays every chart's
 * entrance as it loads. This is the one place something moves as a page loads, on purpose: the charts' entrance.
 */

import { useEffect, type Ref, type RefObject } from 'react';
import { useObjectRef } from 'react-aria';

/** How much of a chart, as a share of it, must be in view before its entrance plays. */
const SEEN = 0.3;

/**
 * Plays the entrance of the chart the returned ref reaches, once, when it first comes into view. Pass the
 * caller's own ref, which it reaches too.
 */
export function useEntrance<T extends Element>(ref?: Ref<T>): RefObject<T | null> {
  const node = useObjectRef(ref);
  useEffect(() => {
    const el = node.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      el.removeAttribute('data-entrance');
      return undefined;
    }
    let gone = false;
    let first = true;
    // Lets the entrance that is running finish, then takes the mark away.
    const settle = () => {
      const running = typeof el.getAnimations === 'function' ? el.getAnimations({ subtree: true }) : [];
      void Promise.allSettled(running.map((a) => a.finished)).then(() => {
        if (!gone) el.removeAttribute('data-entrance');
      });
    };
    const play = () => {
      watch.disconnect();
      // A chart still playing the entrance it began as the page drew keeps it; restarting would empty it.
      if (el.getAttribute('data-entrance') !== 'load') el.setAttribute('data-entrance', 'playing');
      settle();
    };
    const watch = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        const seen = entry.intersectionRatio >= SEEN || (entry.rootBounds !== null && entry.intersectionRect.height >= entry.rootBounds.height * SEEN);
        // On the first report, any part in view plays, so nothing the reader already sees is emptied.
        if (first ? entry.isIntersecting : seen) play();
        else if (first) el.setAttribute('data-entrance', 'waiting');
        first = false;
      },
      { threshold: [0, SEEN] },
    );
    watch.observe(el);
    return () => {
      gone = true;
      watch.disconnect();
      if (el.getAttribute('data-entrance') === 'waiting') el.removeAttribute('data-entrance');
    };
  }, []);
  return node;
}
