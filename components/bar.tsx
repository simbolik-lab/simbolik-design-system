/**
 * What the app bar and the header do the same way (the header is built from the app bar's parts, so what they share
 * is written once, here, beside the stylesheet they share, bar/bar.css). Each wrapper still owns its block, its parts
 * and its props; these take the part classes as they are given, as `DismissButton` does.
 *
 * - `BarFrost`: the three layers of blur behind a frosted bar.
 * - `BarSecondRow`: the row under the bar, a divider (not in the split look) and then a row of further navigation.
 * - `useMenuEscape`: Escape closes the open menu and hands focus back to the menu button.
 * - `useCloseOnUnfold`: a bar that unfolds while its menu is open in a wide space closes the menu.
 *
 * Folding itself (`fold.ts`) and the open state (`controllable.ts`) were already shared; the hide-on-scroll movement
 * is the app bar's alone, since the header does not stick by itself.
 */
import { useEffect, type ReactNode, type RefObject } from 'react';
import { Divider } from './divider/divider.js';
import { isNarrow } from './motion.js';

/** The frost behind a frosted bar: three layers side by side, since a blur nested in another only blurs its parent. */
export function BarFrost({ className }: { className: string }) {
  return (
    <>
      <span className={className} aria-hidden="true" />
      <span className={className} aria-hidden="true" />
      <span className={className} aria-hidden="true" />
    </>
  );
}

export interface BarSecondRowProps {
  /** The bar's second-row part class. */
  className: string;
  /** The second row's navigation part class. */
  navClassName: string;
  /** The split look draws no divider: its islands are lined up by their own surfaces. */
  split: boolean;
  children: ReactNode;
}

/** The second row under the bar: a divider, then the further navigation. */
export function BarSecondRow({ className, navClassName, split, children }: BarSecondRowProps) {
  return (
    <div className={className}>
      {!split && <Divider />}
      <div className={navClassName}>{children}</div>
    </div>
  );
}

/**
 * Escape closes the open menu and hands focus back to the menu button, as a disclosure should. `menuButton` is the
 * menu button's part class. With `skipHandled`, an Escape something inside the bar already handled (a dropdown
 * closing) leaves the menu alone.
 */
export function useMenuEscape(root: RefObject<HTMLElement | null>, open: boolean, setOpen: (open: boolean) => void, menuButton: string, skipHandled = false): void {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || (skipHandled && e.defaultPrevented)) return;
      setOpen(false);
      root.current?.querySelector<HTMLButtonElement>(`button.${menuButton}[aria-expanded]`)?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [root, open, setOpen, menuButton, skipHandled]);
}

/**
 * A bar whose links have unfolded while its menu is open in a wide space closes the menu, so it is not found open
 * later. Only where the bar holds its own state: a page that passes `expanded` decides itself.
 */
export function useCloseOnUnfold(root: RefObject<HTMLElement | null>, { unfolded, expanded, open, setOpen }: { unfolded: boolean; expanded: boolean | undefined; open: boolean; setOpen: (open: boolean) => void }): void {
  useEffect(() => {
    if (unfolded && expanded === undefined && open && root.current && !isNarrow(root.current)) setOpen(false);
  }, [root, unfolded, expanded, open, setOpen]);
}
