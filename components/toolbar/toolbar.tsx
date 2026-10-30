'use client';

/**
 * Toolbar: a labelled bar of related tools for a view, a selection or an editor.
 *
 *   <Toolbar label="Projects" details={<ToolbarDetails filters={applied} onRemove={…} onClearAll={…} count="12 results" />}>
 *     <ToolbarContext>
 *       <ToolbarTitle>Projects</ToolbarTitle>
 *       <Badge size="sm">24</Badge>
 *     </ToolbarContext>
 *     <ToolbarTools label="Commands">
 *       <ToolbarTool icon="ArrowsClockwise" label="Refresh" onClick={refresh} />
 *       <ToolbarTool icon="TextB" label="Bold" pressed={bold} onPressedChange={setBold} />
 *     </ToolbarTools>
 *     <ToolbarActions>
 *       <ToolbarOverflow>…dropdown items…</ToolbarOverflow>
 *       <Button tone="brand" size="sm" leadingIcon="Plus">New project</Button>
 *     </ToolbarActions>
 *   </Toolbar>
 *
 * Toolbar props:
 *   label      Names the toolbar ("Projects", "Text formatting"); every toolbar on a page needs its own.
 *   placement  "floating" (default) or "docked".
 *   details    A row under the zones: a ToolbarDetails, with the filters applied and the result count.
 *
 * The zones (ToolbarContext, ToolbarTools, ToolbarActions) take any of the system's controls at their small size.
 * A tools or actions zone starts with a divider unless given divider={false}; `label` makes a zone a named group;
 * show="wide" or "narrow" keeps a zone to one layout. ToolbarTool is an icon-only tool named in its tooltip, a
 * toggle when given `pressed` or `defaultPressed`. ToolbarTitle, ToolbarText, ToolbarStatus, ToolbarSelection,
 * ToolbarValue and ToolbarOverflow are the pieces with words or behaviour of their own.
 *
 * Keyboard (the WAI-ARIA toolbar pattern): the toolbar's buttons, toggles, links, chips and choices are one stop in
 * the tab order. Left and Right move between them, Home and End go to the first and the last, and coming back with
 * Tab returns to the one last used. A field inside it (a search field, a select, a slider, a number field) keeps its
 * own tab stop and its own arrow keys, so typing and choosing work as they do anywhere else. A menu or a panel a tool
 * opens keeps its own keys too. The arrows follow the reading direction.
 *
 * The wrapper holds no styling: the stylesheet draws everything.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { mergeProps, mergeRefs } from 'react-aria';
import { toolbar } from './toolbar.manifest.js';
import { Button } from '../button/button.js';
import { Divider } from '../divider/divider.js';
import { Dropdown } from '../dropdown/dropdown.js';
import { FilterBarApplied, FilterBarCount, type AppliedFilter } from '../filter-bar/filter-bar.js';
import { Icon } from '../icon/icon.js';
import { input } from '../input/input.manifest.js';
import { keyShortcut } from '../key-shortcut.js';
import { link } from '../link/link.manifest.js';
import { Popover, PopoverBody } from '../popover/popover.js';
import { spinner } from '../spinner/spinner.manifest.js';
import { StatusDot } from '../status-dot/status-dot.js';
import { ToggleButton } from '../toggle-button/toggle-button.js';
import { useTip } from '../tooltip/tooltip.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/** What can take focus inside a toolbar. */
const FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex], [contenteditable=""], [contenteditable="true"]';
/** Controls that use the arrow keys themselves: anything typed into, a list to pick from, a slider, a number. */
const FIELD =
  'textarea, select, [contenteditable=""], [contenteditable="true"], [role="slider"], [role="spinbutton"], [role="combobox"], [role="textbox"], input:not([type="button"], [type="checkbox"], [type="radio"], [type="submit"], [type="reset"], [type="image"], [type="file"], [type="color"])';
/** A menu, list or panel a tool opens: its keys are its own. */
const POPUP = '[role="menu"], [role="listbox"], [role="dialog"], [role="tooltip"], [role="grid"], [role="tree"]';

/** Whether an element is drawn: not inside anything hidden. */
function shown(el: HTMLElement): boolean {
  const check = (el as HTMLElement & { checkVisibility?: (o?: object) => boolean }).checkVisibility;
  return check ? check.call(el, { visibilityProperty: true }) : el.getClientRects().length > 0;
}

/**
 * A stop that is a radio not chosen, in a group with a chosen one, gives way to the chosen one: the browser's Tab
 * skips the radios of a group that are not chosen, so the toolbar would have no stop.
 */
function chosenRadio(list: HTMLElement[], at: HTMLElement): HTMLElement {
  if (!(at instanceof HTMLInputElement) || at.type !== 'radio' || at.checked || !at.name) return at;
  return list.find((t) => t instanceof HTMLInputElement && t.type === 'radio' && t.name === at.name && t.checked) ?? at;
}

/**
 * The roving tab stop. The tools are the toolbar's focusable controls that are drawn and can be used, leaving out a
 * field (and anything inside a field's well, such as a search field's clear button) and anything inside a menu or a
 * panel a tool opens. Exactly one tool is in the tab order: the one last focused, or the first. The arrow keys move
 * focus between tools; a field is left alone.
 */
function useRovingFocus(root: RefObject<HTMLDivElement | null>) {
  const current = useRef<HTMLElement | null>(null);
  /** The elements this toolbar took out of the tab order, so one a page took out itself is never put back in. */
  const managed = useRef(new WeakSet<HTMLElement>());

  const tools = useCallback((): HTMLElement[] => {
    const el = root.current;
    if (!el) return [];
    return [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((t) => {
      if ((t as HTMLButtonElement).disabled || (t as HTMLInputElement).type === 'hidden') return false;
      if (t.getAttribute('tabindex') === '-1' && !managed.current.has(t)) return false;
      if (t.matches(FIELD) || t.closest(`.${input.manifest.block}`)) return false;
      const popup = t.closest(POPUP);
      if (popup && el.contains(popup)) return false;
      return shown(t);
    });
  }, [root]);

  /** Puts exactly one tool in the tab order: the current one, or the chosen radio of a group, or the first. */
  const sync = useCallback(() => {
    const list = tools();
    if (list.length === 0) return;
    let at = current.current && list.includes(current.current) ? current.current : list[0]!;
    if (!list.includes(current.current as HTMLElement)) at = chosenRadio(list, at);
    current.current = at;
    for (const t of list) {
      const index = t === at ? '0' : '-1';
      if (t.getAttribute('tabindex') !== index) t.setAttribute('tabindex', index);
      managed.current.add(t);
    }
  }, [tools]);

  useLayoutEffect(sync);

  // Tools come and go without the toolbar drawing again (a chip removed, a zone shown at another width): look again
  // whenever what is inside changes or the bar is resized, which the layout switch does.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let queued = false;
    const later = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        sync();
      });
    };
    const mutations = new MutationObserver(later);
    mutations.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'hidden', 'class', 'style', 'aria-disabled'] });
    const sizes = new ResizeObserver(later);
    sizes.observe(el);
    return () => {
      mutations.disconnect();
      sizes.disconnect();
    };
  }, [root, sync]);

  const onFocus = (e: { target: EventTarget }) => {
    const t = e.target as HTMLElement;
    if (tools().includes(t) && current.current !== t) {
      current.current = t;
      sync();
    }
  };

  // Leaving on a radio that is not chosen: the browser's Tab skips such a radio when its group has a chosen one,
  // so the stop moves to the chosen radio, or the toolbar would have none.
  const onBlur = (e: { relatedTarget: EventTarget | null }) => {
    const next = e.relatedTarget as Node | null;
    if (next && root.current?.contains(next)) return;
    const at = current.current;
    if (!at) return;
    const chosen = chosenRadio(tools(), at);
    if (chosen !== at) {
      current.current = chosen;
      sync();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const list = tools();
    const at = list.indexOf(e.target as HTMLElement);
    if (at < 0) return;
    const rtl = root.current ? getComputedStyle(root.current).direction === 'rtl' : false;
    let to = -1;
    if (e.key === 'ArrowRight') to = rtl ? at - 1 : at + 1;
    else if (e.key === 'ArrowLeft') to = rtl ? at + 1 : at - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = list.length - 1;
    else return;
    e.preventDefault();
    const next = list[Math.max(0, Math.min(list.length - 1, to))];
    if (next && next !== e.target) {
      current.current = next;
      sync();
      next.focus();
    }
  };

  /** Focus to the tool in the tab order, for when what had focus has gone. */
  const focusCurrent = useCallback(() => {
    sync();
    return current.current;
  }, [sync]);

  return { onFocus, onBlur, onKeyDown, focusCurrent };
}

/** What the pieces inside a toolbar need from it. */
interface ToolbarContextValue {
  /** The tool in the tab order, to give focus to when what had it has gone. */
  focusCurrent: () => HTMLElement | null;
}

const Context = createContext<ToolbarContextValue | null>(null);

export interface ToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof toolbar.manifest> {
  /** Names the toolbar, such as "Projects" or "Text formatting". Each toolbar on a page needs its own. */
  label: string;
  /** The zones: ToolbarContext, ToolbarTools (one or two), ToolbarActions. */
  children: ReactNode;
  /** A row under the zones, such as a ToolbarDetails. */
  details?: ReactNode;
}

/** The toolbar: the bar, its zones, its row of details, and the roving tab stop. See above. */
export function Toolbar({ label, placement, details, className, children, onKeyDown, onFocus, onBlur, ...rest }: ToolbarProps) {
  const root = useRef<HTMLDivElement>(null);
  const roving = useRovingFocus(root);
  return (
    <div
      ref={root}
      role="toolbar"
      aria-label={label}
      aria-orientation="horizontal"
      className={cx(toolbar({ placement }), className)}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        roving.onKeyDown(e);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        roving.onFocus(e);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        roving.onBlur(e);
      }}
      {...rest}
    >
      <Context.Provider value={{ focusCurrent: roving.focusCurrent }}>
        <div className={toolbar.part('row')}>{children}</div>
        {details && <div className={toolbar.part('details')}>{details}</div>}
      </Context.Provider>
    </div>
  );
}

interface ZoneProps extends HTMLAttributes<HTMLDivElement> {
  /** Names the zone as a group, such as "Formatting" or "View". */
  label?: string;
  /** Keeps the zone to one layout: "wide" leaves it out of a narrow space, "narrow" shows it only there. */
  show?: 'wide' | 'narrow';
  children: ReactNode;
}

function zone(part: 'context' | 'tools' | 'actions', divider: boolean, { label, show, className, children, ...rest }: ZoneProps) {
  const classes = cx(toolbar.part(part), show && toolbar.part(show === 'wide' ? 'wide-only' : 'narrow-only'), className);
  return (
    <div role={label ? 'group' : undefined} aria-label={label} className={classes} {...rest}>
      {divider && <Divider orientation="vertical" className={toolbar.part('divider')} />}
      {children}
    </div>
  );
}

/** The first zone: what the bar acts on (a title, a breadcrumb, a selection, a status, a person, a list to pick from). */
export function ToolbarContext(props: ZoneProps) {
  return zone('context', false, props);
}

export interface ToolbarToolsProps extends ZoneProps {
  /** The vertical divider before the group. On by default, as Figma draws it. */
  divider?: boolean;
}

/** One group of tools, after a divider. */
export function ToolbarTools({ divider = true, ...props }: ToolbarToolsProps) {
  return zone('tools', divider, props);
}

/** The last zone: the overflow menu and the main action, after a divider. Docked, it sits at the bar's end. */
export function ToolbarActions({ divider = true, ...props }: ToolbarToolsProps) {
  return zone('actions', divider, props);
}

export interface ToolbarToolProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label' | 'aria-pressed' | 'aria-keyshortcuts'> {
  /** The Phosphor icon. */
  icon: string;
  /** The tool's name: what a screen reader says, and what its tooltip shows. The same whether on or off. */
  label: string;
  /**
   * The tool's key, keys apart by a space ("]", "⌘ B"): shown after the name in its tooltip as a key cap, and told to
   * screen readers as the tool's aria-keyshortcuts. Only shown: the page listens for the key and presses the tool.
   */
  shortcut?: string;
  /** Given, true or false, the tool is a toggle that stays on or off, as the page holds it. */
  pressed?: boolean;
  /** Given, the tool is a toggle that holds its own state, starting on or off. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Reaches the button, e.g. to give focus back to it. */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * An icon-only tool: the small ghost icon button, or the ghost toggle button when given `pressed` or
 * `defaultPressed`, named by `label`. The name shows in a tooltip under it while it is pointed at or has keyboard
 * focus, as the arrow keys give it, and the tooltip is hidden from screen readers, which hear the name once.
 * Given a `shortcut`, the tooltip shows the key after the name as a key cap ("Zoom in ]") and the tool carries it as
 * aria-keyshortcuts; the page listens for the key.
 */
export function ToolbarTool({ icon, label, shortcut, pressed, defaultPressed, onPressedChange, ref, ...rest }: ToolbarToolProps) {
  const { targetRef, hoverProps, focusProps, tip } = useTip({ text: label, shortcut, purpose: 'name' });
  const own = mergeRefs(targetRef as RefObject<HTMLButtonElement | null>, ref);
  const props = { ...mergeProps(rest, hoverProps, focusProps), ref: own, 'aria-label': label, 'aria-keyshortcuts': shortcut ? keyShortcut(shortcut) : undefined };
  const toggle = pressed !== undefined || defaultPressed !== undefined;
  return (
    <>
      {toggle ? (
        <ToggleButton tone="ghost" size="sm" icon-only icon={icon} pressed={pressed} defaultPressed={defaultPressed} onPressedChange={onPressedChange} {...props} />
      ) : (
        <Button tone="ghost" size="sm" icon-only icon={icon} {...props} />
      )}
      {tip}
    </>
  );
}

export interface ToolbarTitleProps extends HTMLAttributes<HTMLSpanElement> {
  /** Phosphor icon before the words. */
  icon?: string;
  children: ReactNode;
}

/** What the bar acts on, in Label MD, with an optional icon before it. */
export function ToolbarTitle({ icon, className, children, ...rest }: ToolbarTitleProps) {
  return (
    <>
      {icon && <Icon name={icon} className={toolbar.part('icon')} />}
      <span className={cx(toolbar.part('title'), className)} {...rest}>
        {children}
      </span>
    </>
  );
}

export interface ToolbarTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** The quieter note after a line, such as when it last changed. */
  quiet?: boolean;
  children: ReactNode;
}

/** A line of words in Body SM: a summary, a setting's name, a note beside an action. */
export function ToolbarText({ quiet = false, className, children, ...rest }: ToolbarTextProps) {
  return (
    <span className={cx(toolbar.part(quiet ? 'meta' : 'text'), className)} {...rest}>
      {children}
    </span>
  );
}

export interface ToolbarStatusProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The status dot's tone, or "busy" for the spinner's ring while something is being worked on. */
  tone?: 'success' | 'info' | 'warning' | 'danger' | 'default' | 'busy';
  /** The status in words: "All changes saved", "Live". */
  children: ReactNode;
  /** A quieter note after it, such as "Updated 2 min ago". */
  meta?: ReactNode;
}

/**
 * A status in words with its status dot, or the spinner's ring while busy, and a quieter note. A status message: a screen
 * reader reads each change ("Saving", then "All changes saved") without focus moving. The dot and the ring are
 * hidden from screen readers, so the words must say it all.
 */
export function ToolbarStatus({ tone = 'success', meta, className, children, ...rest }: ToolbarStatusProps) {
  return (
    <span role="status" className={cx(toolbar.part('status'), className)} {...rest}>
      {tone === 'busy' ? (
        <span className={spinner({ size: 'sm' })} aria-hidden="true">
          <span className={spinner.part('ring')} />
        </span>
      ) : (
        <StatusDot tone={tone} aria-hidden="true" />
      )}
      <span className={toolbar.part('text')}>{children}</span>
      {meta && <span className={toolbar.part('meta')}>{meta}</span>}
    </span>
  );
}

export interface ToolbarSelectionProps {
  /** How many are selected, in words: "3 selected". Read out each time it changes. */
  children: ReactNode;
  /** Clears the selection: the cross before the count. */
  onClear?: () => void;
  /** The cross's name. */
  clearLabel?: string;
  /** The words of a button after the count that selects everything, such as "Select all 24". */
  selectAll?: string;
  onSelectAll?: () => void;
}

/**
 * The selection a bar's actions apply to: a cross that clears it, the count in words, and a button that selects
 * every item. The count is a status message, read out as it changes, and it says the scope in words, so the actions
 * after it never act on an unstated selection.
 */
export function ToolbarSelection({ children, onClear, clearLabel = 'Clear selection', selectAll, onSelectAll }: ToolbarSelectionProps) {
  return (
    <>
      {onClear && <ToolbarTool icon="X" label={clearLabel} onClick={onClear} />}
      <span role="status" className={toolbar.part('title')}>
        {children}
      </span>
      {selectAll && onSelectAll && (
        <button type="button" className={link({ size: 'sm' })} onClick={onSelectAll}>
          <span className={link.part('label')}>{selectAll}</span>
        </button>
      )}
    </>
  );
}

export interface ToolbarValueProps {
  /** The setting's name, shown before its value: "Intensity". */
  label: string;
  /** Its value now, on the button: "50". */
  value: ReactNode;
  /** What the button opens, such as a fill slider for the same setting. */
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A setting and its value: the name, then a small secondary button showing the value with a caret, which opens a
 * popover holding the control that changes it, such as a fill slider. The button is named by both ("Intensity 50").
 */
export function ToolbarValue({ label, value, children, open, defaultOpen, onOpenChange }: ToolbarValueProps) {
  const id = useId();
  const nameId = `${id}-name`;
  const buttonId = `${id}-button`;
  return (
    <>
      <span id={nameId} className={toolbar.part('text')}>
        {label}
      </span>
      <Popover
        label={label}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        trigger={
          <Button tone="secondary" size="sm" trailingIcon="CaretDown" id={buttonId} aria-labelledby={`${nameId} ${buttonId}`}>
            {value}
          </Button>
        }
      >
        <PopoverBody>{children}</PopoverBody>
      </Popover>
    </>
  );
}

export interface ToolbarOverflowProps {
  /** The menu's name, and the button's: "More actions". */
  label?: string;
  /** The menu's items: dropdown items, which keep their names, ticks and disabled state. */
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * The overflow menu: the small ghost button with three dots, named in its tooltip, opening a dropdown of the tools
 * that do not fit or are used less, lined up with its end edge. Wrap an item in an element with the narrow-only part to keep it to a
 * narrow space, where the tools it repeats have gone.
 */
export function ToolbarOverflow({ label = 'More actions', children, defaultOpen }: ToolbarOverflowProps) {
  const { targetRef, hoverProps, focusProps, tip } = useTip({ text: label, purpose: 'name' });
  return (
    <>
      <Dropdown
        label={label}
        align="end"
        size="sm"
        defaultOpen={defaultOpen}
        trigger={<Button tone="ghost" size="sm" icon-only icon="DotsThree" aria-label={label} ref={targetRef as RefObject<HTMLButtonElement | null>} {...mergeProps(hoverProps, focusProps)} />}
      >
        {children}
      </Dropdown>
      {tip}
    </>
  );
}

export interface ToolbarDetailsProps {
  /** The filters applied, drawn as removable chips with Clear all after them. */
  filters?: AppliedFilter[];
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  clearLabel?: string;
  /** How many results the filters leave, in words, at the row's end. Read out each time it changes. */
  count?: ReactNode;
  loading?: boolean;
  loadingText?: string;
}

/**
 * The row of details under a toolbar's zones: the filter bar's applied row and its count. When the last chip goes,
 * focus goes back to the toolbar's tool in the tab order.
 */
export function ToolbarDetails({ filters = [], onRemove, onClearAll, clearLabel, count, loading, loadingText }: ToolbarDetailsProps) {
  const bar = useContext(Context);
  const back = useCallback(() => bar?.focusCurrent() ?? null, [bar]);
  return (
    <>
      <FilterBarApplied filters={filters} onRemove={onRemove} onClearAll={onClearAll} clearLabel={clearLabel} returnFocus={back} />
      {(count !== undefined || loading !== undefined) && (
        <FilterBarCount loading={loading} loadingText={loadingText}>
          {count}
        </FilterBarCount>
      )}
    </>
  );
}
