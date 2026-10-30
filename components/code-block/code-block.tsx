'use client';

import { useId, useState, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { codeBlock } from './code-block.manifest.js';
import { codeLanguage, highlight, type CodeLanguage } from './highlight.js';
import { Icon } from '../icon/icon.js';
import { label as labelLook } from '../label/label.manifest.js';
import { Tabs, type TabItem } from '../tabs/tabs.js';
import { useScrollRegion } from '../scroll-hint.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export interface CodeBlockAction {
  icon: string;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** An action that cannot be used now: drawn faint, and it takes no press. */
  disabled?: boolean;
}

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof codeBlock.manifest> {
  /**
   * Text in the bar, e.g. a file name, after a file icon. With tabs the bar shows the tabs instead: they name the
   * code, and the label is not shown. It also names a body that scrolls; a bare block shows no bar, so there it
   * only names the body.
   */
  label?: string;
  /** The icon before the label, a Phosphor name such as "FileCss". By default the file icon of the language, or of the label's file ending, or a plain code file. */
  icon?: string;
  /**
   * The language of the code, such as "css", "tsx", "html", "json" or "shell": each kind of code in it takes its
   * code color. Code in a language the block does not read, or with none given, stays one color.
   */
  language?: string;
  /** Numbers each line in a column before the code. On by default; code of one line shows no number. */
  lineNumbers?: boolean;
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
  /** The code, as text. Only text is colored and numbered. */
  children: ReactNode;
}

/** The file icon each language's files show. */
const FILE_ICONS: Record<CodeLanguage, string> = {
  css: 'FileCss',
  html: 'FileHtml',
  js: 'FileJs',
  jsx: 'FileJsx',
  ts: 'FileTs',
  tsx: 'FileTsx',
  json: 'FileCode',
  shell: 'Terminal',
};

function fileIcon(language: string | undefined, label: string | undefined): string {
  const lang = codeLanguage(language) ?? codeLanguage(/\.([\w]+)$/.exec(label ?? '')?.[1]);
  return lang ? FILE_ICONS[lang] : 'FileCode';
}

/**
 * An action's icon. When the page gives the action another icon (Copy, then Check once copied), the icon it had stays
 * in the same cell and the two cross-fade: the leaving one with the feedback purpose, the arriving one, slower, with the
 * enter purpose (the stylesheet). The icon an action starts with simply shows, so nothing moves as the page loads.
 */
function ActionIcon({ name }: { name: string }) {
  const [shown, setShown] = useState<{ current: string; previous?: string; swapped: boolean }>({ current: name, swapped: false });
  if (shown.current !== name) setShown({ current: name, previous: shown.current, swapped: true });
  // In an order that does not change as the two trade places, so neither is moved in the page and each glides from where it was.
  const icons = shown.previous !== undefined ? [shown.previous, shown.current].sort() : [shown.current];
  return (
    <>
      {icons.map((icon) => (
        <Icon key={icon} name={icon} data-swap={!shown.swapped ? undefined : icon === shown.current ? 'in' : 'out'} />
      ))}
    </>
  );
}

export function CodeBlock({ bare, label, icon, language, lineNumbers = true, tabs, tabsLabel = 'Language', tab, onTabChange, actions, status, className, children, ...rest }: CodeBlockProps) {
  // The body is the tabs' one panel, and names the tab that shows it.
  const bodyId = useId();
  const labelId = `${bodyId}-label`;
  const [shown, setShown] = useState(tab ?? tabs?.[0]?.value);
  const classes = cx(codeBlock({ bare }), className);
  const tabbed = !bare && tabs !== undefined && tabs.length > 0;
  // Without tabs, a body whose code runs past it is a region the keyboard can reach and scroll, named by
  // the bar's label (a file name, a language), a bare block's label, or, with none, simply "Code". One that
  // fits takes no Tab.
  const named = !bare && !!label;
  const { frame: body, region } = useScrollRegion({ axis: 'both', ...(named ? { labelledBy: labelId } : { label: label ?? 'Code' }) });
  const text = typeof children === 'string' ? children : undefined;
  // A last line break ends the last line; it starts no new one.
  const lines = text === undefined ? 0 : text.replace(/\n$/, '').split('\n').length;
  const code = text !== undefined && codeLanguage(language)
    ? highlight(text, language).map((piece, i) => (piece.kind ? <span key={i} className={codeBlock.part(piece.kind)}>{piece.text}</span> : piece.text))
    : children;
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
          {!tabbed && (
            <span className={cx(labelLook({ tone: 'subtle' }), codeBlock.part('label'))} id={label ? labelId : undefined}>
              {label && <Icon name={icon ?? fileIcon(language, label)} className={codeBlock.part('icon')} />}
              {label && <span className={labelLook.part('text')}>{label}</span>}
            </span>
          )}
          {actions && actions.length > 0 && (
            <div className={codeBlock.part('actions')}>
              {/* Keyed by place, not label: an action that says it is done by changing its label keeps its focus. */}
              {actions.map((a, i) => (
                <button key={i} type="button" className={codeBlock.part('action')} aria-label={a.label} onClick={a.onClick} disabled={a.disabled}>
                  <ActionIcon name={a.icon} />
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
        {...(tabbed ? { 'data-scrollbar': region['data-scrollbar'], role: 'tabpanel', 'aria-labelledby': shown !== undefined ? `${bodyId}-tab-${shown}` : undefined, tabIndex: 0 } : region)}
        dir="ltr"
      >
        {/* Code reads left to right whatever the page's direction, its numbers on the left. */}
        {lineNumbers && lines > 1 && (
          <span className={codeBlock.part('numbers')} aria-hidden="true">
            {Array.from({ length: lines }, (_, i) => i + 1).join('\n')}
          </span>
        )}
        <pre className={codeBlock.part('code')} dir="ltr">
          <code>{code}</code>
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
