import { useEffect, useId, useRef, useState, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { codeBlock } from './code-block.manifest.js';
import { Icon } from '../icon/icon.js';
import { Tabs, type TabItem } from '../tabs/tabs.js';
import type { VariantProps } from '../variants.js';

export interface CodeBlockAction {
  icon: string;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof codeBlock.manifest> {
  /**
   * Text in the bar, e.g. a file name. With tabs it sits between the tabs and the actions, as Figma draws it.
   * It also names a body that scrolls; a bare block shows no bar, so there it only names the body.
   */
  label?: string;
  /** Language or variant tabs at the start of the bar: the tabs component at its small size, the body their one panel. */
  tabs?: Pick<TabItem, 'value' | 'label' | 'icon' | 'disabled'>[];
  /** Accessible name of the tabs: what they choose between. Default "Language". */
  tabsLabel?: string;
  /** The tab shown first. The page supplies the code for whichever tab is chosen. */
  tab?: string;
  onTabChange?: (value: string) => void;
  /** Small icon actions at the bar's end. A copy action is the usual one. */
  actions?: CodeBlockAction[];
  /**
   * What the last action did, said aloud ("Copied"). A block with actions keeps a status line out of sight, in the
   * page from the start, and a screen reader reads whatever is put in it, where a changed button name often goes
   * unsaid. Empty it after a moment, so the same result is said again the next time.
   */
  status?: string;
  /** The code, as text. */
  children: ReactNode;
}

/** Whether the body's code runs past it, so there is something to scroll to. It follows the body and the code as they change size. */
function useOverflow() {
  const body = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = body.current;
    if (!el || !('ResizeObserver' in window)) return undefined;
    const update = () => setOverflows(el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, []);
  return { body, overflows };
}

export function CodeBlock({ bare, label, tabs, tabsLabel = 'Language', tab, onTabChange, actions, status, className, children, ...rest }: CodeBlockProps) {
  // The body is the tabs' one panel, and names the tab that shows it.
  const bodyId = useId();
  const labelId = `${bodyId}-label`;
  const [shown, setShown] = useState(tab ?? tabs?.[0]?.value);
  const classes = [codeBlock({ bare }), className].filter(Boolean).join(' ');
  const tabbed = !bare && tabs !== undefined && tabs.length > 0;
  // Without tabs, a body whose code runs past it is a region the keyboard can reach and scroll, named by
  // the bar's label (a file name, a language), a bare block's label, or, with none, simply "Code". One that
  // fits takes no Tab.
  const { body, overflows } = useOverflow();
  const named = !bare && !!label;
  const scrolls = !tabbed && overflows;
  return (
    <div className={classes} {...rest}>
      {!bare && (
        <div className={codeBlock.part('bar')}>
          {tabbed && (
            <Tabs
              size="sm"
              label={tabsLabel}
              items={tabs}
              value={shown}
              onChange={(next) => {
                setShown(next);
                onTabChange?.(next);
              }}
              controls={bodyId}
              className={codeBlock.part('tabs')}
            />
          )}
          {(label || !tabbed) && (
            <span className={codeBlock.part('label')} id={label ? labelId : undefined}>
              {label}
            </span>
          )}
          {actions && actions.length > 0 && (
            <div className={codeBlock.part('actions')}>
              {/* Keyed by place, not label: an action that says it is done by changing its label keeps its focus. */}
              {actions.map((a, i) => (
                <button key={i} type="button" className={codeBlock.part('action')} aria-label={a.label} onClick={a.onClick}>
                  <Icon name={a.icon} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div
        ref={body}
        className={codeBlock.part('body')}
        id={bodyId}
        role={tabbed ? 'tabpanel' : scrolls ? 'region' : undefined}
        aria-labelledby={tabbed && shown !== undefined ? `${bodyId}-tab-${shown}` : scrolls && named ? labelId : undefined}
        aria-label={scrolls && !named ? (label ?? 'Code') : undefined}
        tabIndex={tabbed || scrolls ? 0 : undefined}
      >
        <pre className={codeBlock.part('code')}>
          <code>{children}</code>
        </pre>
      </div>
      {((actions && actions.length > 0) || status !== undefined) && (
        <span role="status" className={codeBlock.part('status')}>
          {status}
        </span>
      )}
    </div>
  );
}
