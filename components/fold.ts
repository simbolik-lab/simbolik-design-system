'use client';

/**
 * Folding a bar's parts away when its row does not fit: the app bar's and the header's links (and the app bar's
 * actions before them) give way to the menu button in a wide space too narrow for them.
 *
 * No stylesheet can know how wide a row of links is, so the wrapper measures. The row "does not fit" when its
 * content is wider than its box (`scrollWidth > clientWidth`), the same test a page can make itself. Each time the
 * bar's size changes, its content changes or the fonts load, this tries the stages in order, from nothing folded to
 * everything folded, and keeps the first one whose row fits; the stages are the modifier classes of the bar's fold
 * axis. Trying them is exact, so the result depends on the room alone and never flickers between two stages. It
 * runs before the browser draws, so no stage that does not fit is ever seen. A bar in the narrow form (the layout
 * switch) folds nothing: that form has its own menu.
 */
import { useLayoutEffect, useState, type RefObject } from 'react';
import { isNarrow } from './motion.js';

/** Whether the row of a bar runs out of room: its content is wider than its box. */
export function overflows(row: HTMLElement): boolean {
  return row.scrollWidth > row.clientWidth;
}

/**
 * Keeps the least folded stage whose row fits, and returns its index into `stages`.
 *
 * `root` is the bar's block; `row` finds the part whose overflow is measured; `stages` are the modifier classes of
 * each stage, the first folding nothing. `on` false keeps the first stage and leaves the classes to the render. `content` changes whenever what the row
 * holds changes, so the room is measured again.
 */
export function useFold(root: RefObject<HTMLElement | null>, row: (root: HTMLElement) => HTMLElement | null, stages: readonly string[], on: boolean, content: unknown): number {
  const [stage, setStage] = useState(0);
  useLayoutEffect(() => {
    const block = root.current;
    // Off, the bar's classes are the render's alone: nothing is measured or written here.
    if (!block || !on) {
      setStage(0);
      return undefined;
    }
    const set = (index: number) => {
      block.classList.remove(...stages);
      block.classList.add(stages[index]!);
    };
    const measure = () => {
      const part = row(block);
      const narrow = isNarrow(block);
      let chosen = 0;
      if (part && !narrow) {
        chosen = stages.length - 1;
        for (let index = 0; index < stages.length; index += 1) {
          set(index);
          if (!overflows(part)) {
            chosen = index;
            break;
          }
        }
      }
      // The classes stay as measured; the state makes the next render write the same ones.
      set(chosen);
      setStage(chosen);
    };
    measure();
    // Only a change of width can change what fits; a change of height (the menu opening) is left alone. The element
    // around the bar is watched too, since a bar that hugs its content keeps its width while the room around it grows.
    const around = block.parentElement;
    const widths = () => `${block.getBoundingClientRect().width} ${around?.getBoundingClientRect().width ?? 0}`;
    let seen = widths();
    const observer = new ResizeObserver(() => {
      const now = widths();
      if (now === seen) return;
      seen = now;
      measure();
    });
    observer.observe(block);
    if (around) observer.observe(around);
    let live = true;
    void document.fonts?.ready.then(() => {
      if (live) measure();
    });
    return () => {
      live = false;
      observer.disconnect();
    };
    // `stages` and `row` are fixed per component; `content` stands for what the row holds.
  }, [root, on, content]);
  return stage;
}
