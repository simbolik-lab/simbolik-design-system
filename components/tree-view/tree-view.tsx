import {
  Children, createContext, useCallback, useContext, useId, useLayoutEffect, useState,
  type CSSProperties, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode, type Ref,
} from 'react';
import { useObjectRef } from 'react-aria';
import { treeView } from './tree-view.manifest.js';
import { Icon } from '../icon/icon.js';
import { labelText } from '../label-text.js';
import { useControllable } from '../controllable.js';
import { useTypeAhead } from '../type-ahead.js';
import { cx } from '../variants.js';

interface TreeState {
  selectable: boolean;
  selectedKey: string | null;
  tabStop: string | null;
  isExpanded: (key: string) => boolean;
  activate: (key: string, folder: boolean) => void;
  focused: (key: string) => void;
}

const TreeContext = createContext<TreeState | null>(null);
/** The aria-level of the rows being drawn: 1 at the top. */
const LevelContext = createContext(1);

const ITEM = '[role="treeitem"]';

/** The rows a reader can see, in reading order: every item not inside a closed folder's group. */
function visibleItems(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(ITEM)).filter(
    (item) => !item.parentElement?.closest('[role="group"][hidden]'),
  );
}

export interface TreeViewProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  /** The tree's name, such as "Files". A tree needs one: this, or aria-labelledby. */
  'aria-label'?: string;
  /** TreeItems. */
  children?: ReactNode;
  /** Whether the reader can choose a row, the default, or only open and close folders. */
  selectionMode?: 'single' | 'none';
  /** The chosen row's id, controlled. Leave it out and pass defaultSelectedKey for the tree to keep its own. */
  selectedKey?: string | null;
  defaultSelectedKey?: string | null;
  /** Called with a row's id when the reader chooses it, by a click, Enter or Space. */
  onSelectionChange?: (key: string) => void;
  /** The open folders' ids, controlled. Leave it out and pass defaultExpandedKeys for the tree to keep its own. */
  expandedKeys?: Iterable<string>;
  defaultExpandedKeys?: Iterable<string>;
  /** Called with every open folder's id when one opens or closes. */
  onExpandedChange?: (keys: Set<string>) => void;
  /** Called with a row's id when the reader acts on it, by a click or Enter: open the file, go to the page. */
  onAction?: (key: string) => void;
  /** Reaches the list. */
  ref?: Ref<HTMLUListElement>;
}

/**
 * Tree view: the WAI-ARIA tree pattern on a list. React Aria's tree is a grid of rows (role treegrid) built from its
 * collections, so this one is written here: one Tab stop on the focused row (the chosen one, or the first, until the
 * reader moves), Up and Down through the rows the reader can see, Right to open a folder or step into it, Left to
 * close it or step out to its folder (the two swap in a right-to-left page), Home and End, Enter to act on a row and
 * open or close a folder, Space to choose it, * to open every folder beside it, and typing a row's first letters to
 * go to it.
 */
export function TreeView({
  children, selectionMode = 'single', selectedKey, defaultSelectedKey = null, onSelectionChange,
  expandedKeys, defaultExpandedKeys, onExpandedChange, onAction, className, onKeyDown, ref, ...rest
}: TreeViewProps) {
  const root = useObjectRef(ref);
  const [selected, setSelected] = useControllable<string | null>({ value: selectedKey, defaultValue: defaultSelectedKey, onChange: onSelectionChange, name: 'TreeView selectedKey' });
  const [expanded, setExpanded] = useControllable({ value: expandedKeys === undefined ? undefined : new Set(expandedKeys), defaultValue: () => new Set(defaultExpandedKeys ?? []), onChange: onExpandedChange, name: 'TreeView expandedKeys' });
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [tabStop, setTabStop] = useState<string | null>(selected);
  const typeAhead = useTypeAhead(600);

  // The Tab stop is the row last focused, else the chosen one, else the first; never a row inside a closed folder.
  useLayoutEffect(() => {
    if (!root.current) return;
    const items = visibleItems(root.current);
    const wanted = [focusedKey, selected].find((k) => k !== null && items.some((i) => i.dataset.key === k));
    const stop = wanted ?? items[0]?.dataset.key ?? null;
    if (stop !== tabStop) setTabStop(stop);
  });

  const expand = (key: string, open: boolean) => {
    if (expanded.has(key) === open) return;
    const next = new Set(expanded);
    if (open) next.add(key);
    else next.delete(key);
    setExpanded(next);
  };
  const choose = (key: string) => {
    if (selectionMode === 'none') return;
    if (key !== selected) setSelected(key);
  };

  const focused = useCallback((key: string) => setFocusedKey(key), []);
  const state: TreeState = {
    selectable: selectionMode !== 'none',
    selectedKey: selected,
    tabStop,
    isExpanded: (key) => expanded.has(key),
    activate: (key, folder) => {
      choose(key);
      if (folder) expand(key, !expanded.has(key));
      onAction?.(key);
    },
    focused,
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !root.current || e.altKey || e.ctrlKey || e.metaKey) return;
    const item = (e.target as HTMLElement).closest<HTMLElement>(ITEM);
    if (!item || !root.current.contains(item)) return;
    const key = item.dataset.key ?? '';
    const items = visibleItems(root.current);
    const at = items.indexOf(item);
    const folder = item.hasAttribute('aria-expanded');
    const open = item.getAttribute('aria-expanded') === 'true';
    const rtl = getComputedStyle(root.current).direction === 'rtl';
    const inward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const outward = rtl ? 'ArrowRight' : 'ArrowLeft';
    const go = (to: HTMLElement | null | undefined) => to?.focus();
    let handled = true;
    switch (e.key) {
      case 'ArrowDown': go(items[at + 1]); break;
      case 'ArrowUp': go(items[at - 1]); break;
      case 'Home': go(items[0]); break;
      case 'End': go(items[items.length - 1]); break;
      case inward:
        if (folder && !open) expand(key, true);
        else if (folder) go(items[at + 1]?.parentElement?.closest(ITEM) === item ? items[at + 1] : null);
        break;
      case outward:
        if (folder && open) expand(key, false);
        else go(item.parentElement?.closest<HTMLElement>(ITEM));
        break;
      case 'Enter': state.activate(key, folder); break;
      case ' ': choose(key); break;
      case '*': {
        const next = new Set(expanded);
        for (const sibling of Array.from(item.parentElement?.children ?? [])) {
          const id = (sibling as HTMLElement).dataset.key;
          if (id && sibling.hasAttribute('aria-expanded')) next.add(id);
        }
        setExpanded(next);
        break;
      }
      default:
        handled = false;
        if (e.key.length === 1 && e.key.trim() !== '') {
          const label = (i: HTMLElement) => (i.querySelector(`.${treeView.part('label')}`)?.textContent ?? '').trim();
          go(items[typeAhead.find(e.key, items.map(label), at)]);
          handled = true;
        }
    }
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <TreeContext.Provider value={state}>
      <LevelContext.Provider value={1}>
        <ul
          {...rest}
          ref={root}
          role="tree"
          className={cx(treeView(), className)}
          onKeyDown={handleKeyDown}
        >
          {children}
        </ul>
      </LevelContext.Provider>
    </TreeContext.Provider>
  );
}

export interface TreeItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  /** The row's id, unique in the tree: what selection, the open folders and onAction name it by. */
  id: string;
  /** The row's words: a file's or folder's name. */
  label: ReactNode;
  /** A Phosphor icon name. A folder's is FolderSimple and a file's Note unless given. */
  icon?: string;
  /** A count or a short note at the row's end, such as the number of files inside. Read out after the label. */
  meta?: ReactNode;
  /** The dot for a changed item, at the row's end. */
  changed?: boolean;
  /** The words a screen reader hears for the dot, after the label, in the page's language. "changed" unless given. */
  changedWords?: string;
  /** Draw the row as a folder even with nothing inside it yet. A row with TreeItems inside is a folder anyway. */
  folder?: boolean;
  /** The TreeItems inside a folder. */
  children?: ReactNode;
  /** Reaches the list item. */
  ref?: Ref<HTMLLIElement>;
}

/** One row of a TreeView: a file, or a folder with the TreeItems inside it in a group, shown while it is open. */
export function TreeItem({
  id, label, icon, meta, changed = false, changedWords = 'changed', folder, children, className, style, onFocus, ...rest
}: TreeItemProps) {
  const tree = useContext(TreeContext);
  if (!tree) throw new Error('TreeItem must be inside a TreeView.');
  const level = useContext(LevelContext);
  const part = treeView.part;
  const isFolder = folder === true || Children.count(children) > 0;
  const open = isFolder && tree.isExpanded(id);
  const auto = useId();
  const names = [`${auto}-label`];
  if (meta !== undefined && meta !== null && meta !== false && meta !== '') names.push(`${auto}-meta`);
  if (changed) names.push(`${auto}-changed`);

  const onClick = (e: MouseEvent<HTMLSpanElement>) => {
    const item = e.currentTarget.parentElement;
    item?.focus();
    tree.activate(id, isFolder);
  };

  return (
    <li
      {...rest}
      role="treeitem"
      data-key={id}
      aria-level={level}
      aria-expanded={isFolder ? open : undefined}
      aria-selected={tree.selectable ? tree.selectedKey === id : undefined}
      aria-labelledby={names.join(' ')}
      tabIndex={tree.tabStop === id ? 0 : -1}
      className={cx(part('item'), className)}
      style={{ ...style, '--smbk-tree-level': level - 1 } as CSSProperties}
      onFocus={(e) => {
        onFocus?.(e);
        if (e.target === e.currentTarget) tree.focused(id);
      }}
    >
      <span className={part('row')} onClick={onClick}>
        <span className={part('toggle')} aria-hidden="true">
          {isFolder && <Icon name="CaretRight" className={part('caret')} />}
        </span>
        <Icon name={icon ?? (isFolder ? 'FolderSimple' : 'Note')} className={part('icon')} />
        <span id={`${auto}-label`} className={part('label')} data-label={labelText(label)}>{label}</span>
        {names.includes(`${auto}-meta`) && <span id={`${auto}-meta`} className={part('meta')}>{meta}</span>}
        {changed && (
          <span className={part('changed')}>
            <span id={`${auto}-changed`} className={part('hidden')}>{changedWords}</span>
          </span>
        )}
      </span>
      {isFolder && (
        <ul role="group" className={part('group')} hidden={!open}>
          <LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider>
        </ul>
      )}
    </li>
  );
}
