/**
 * Typing to move: in a list of choices that has keyboard focus (the select's list, a selectable list, a tree), each
 * letter typed adds to a run, and focus moves to the next choice whose words start with the run. A pause longer than
 * the component's wait starts a new run. One letter, or the same letter again with `cycle`, steps on from the current
 * choice to the next that starts with it, so pressing B three times visits each choice starting with B; more letters
 * look from the current choice on, so typing "ba" stays on "Banana" if it is there. The search wraps round the list.
 *
 * The component keeps its keys and its focus; this keeps the run and finds the choice.
 */

import { useRef } from 'react';

export interface TypeAhead {
  /**
   * Adds a typed key to the run and returns the index of the choice it moves to, or -1 when none matches. `labels`
   * are the choices' words in order, `null` for one that cannot be reached (a disabled option); `from` is the index of
   * the current choice, or -1 when there is none.
   */
  find(key: string, labels: readonly (string | null)[], from: number): number;
  /** Whether a run is going on: a Space typed now is part of the words, not a press. */
  typing(): boolean;
}

/** `wait` is how long, in milliseconds, typed letters keep adding to one run. */
export function useTypeAhead(wait: number, { cycle = false }: { cycle?: boolean } = {}): TypeAhead {
  const run = useRef({ text: '', at: 0 });
  return {
    find(key, labels, from) {
      const now = Date.now();
      const text = (now - run.current.at < wait ? run.current.text : '') + key.toLowerCase();
      run.current = { text, at: now };
      const same = cycle && [...text].every((c) => c === text[0]);
      const sought = same ? text[0]! : text;
      const count = labels.length;
      for (let step = text.length === 1 || same ? 1 : 0; step <= count; step++) {
        const at = (((from + step) % count) + count) % count;
        if (labels[at]?.toLowerCase().startsWith(sought)) return at;
      }
      return -1;
    },
    typing: () => Date.now() - run.current.at < wait && run.current.text !== '',
  };
}
