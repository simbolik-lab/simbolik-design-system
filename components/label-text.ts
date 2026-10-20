/**
 * A label's words as plain text, for a label that turns one weight bolder with its state (the current navigation
 * item, a chosen row). The wrapper writes them into the label's `data-label`, and the stylesheet sets an invisible
 * copy of them at the bolder weight under the label, so the label is always as wide as its bolder self and nothing
 * beside it moves when it turns bold. The copy is generated content, hidden and given empty words for assistive
 * technology, so a screen reader still hears the label once, and the page's own text (copying, searching, a
 * typed-ahead match) is unchanged.
 *
 * Words inside the label for a screen reader only, such as a link's "(opens in a new tab)", sit in an element marked
 * `data-unseen` and are left out: the copy holds the width of the words seen, so hidden words never widen the label.
 */
import { Children, isValidElement, type ReactNode } from 'react';

/** The words of a label given as React children: text and numbers, inside any elements but those marked `data-unseen`. Undefined when there are none. */
export function labelText(node: ReactNode): string | undefined {
  const words = textOf(node);
  return words.trim() === '' ? undefined : words;
}

function textOf(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number' || typeof node === 'bigint') return String(node);
  if (Array.isArray(node)) return Children.toArray(node).map(textOf).join('');
  if (isValidElement<{ children?: ReactNode; 'data-unseen'?: unknown }>(node)) {
    if (node.props['data-unseen'] !== undefined && node.props['data-unseen'] !== false) return '';
    return textOf(node.props.children);
  }
  return '';
}
