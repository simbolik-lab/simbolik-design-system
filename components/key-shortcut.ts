/**
 * A key hint as `aria-keyshortcuts` writes it. A control that shows its key in a key cap (a toolbar tool's tooltip,
 * a segmented control's) also tells a screen reader the key, through `aria-keyshortcuts` on the control, where a
 * screen reader looks for it; the key cap itself is hidden from it. The hint is written as the key cap shows it, keys
 * apart by a space or a plus: "⌘ X" is "Meta+X", "Ctrl+S" is "Control+S", "]" stays "]", "d" is "D".
 *
 * Only a hint: the component shows the key and names it; the page listens for it, since only the page knows when a
 * key is safe to take (a single key, outside text fields).
 *
 *   <button aria-keyshortcuts={keyShortcut('⌘ K')}>…</button>
 */

/** Key names as aria-keyshortcuts writes them, for the symbols and short words a key hint is written with. */
const KEY_NAMES: Record<string, string> = {
  '⌘': 'Meta', cmd: 'Meta', command: 'Meta', meta: 'Meta',
  '⌃': 'Control', ctrl: 'Control', control: 'Control',
  '⌥': 'Alt', opt: 'Alt', option: 'Alt', alt: 'Alt',
  '⇧': 'Shift', shift: 'Shift',
  '⌫': 'Backspace', backspace: 'Backspace', '⌦': 'Delete', del: 'Delete', delete: 'Delete',
  '↵': 'Enter', '⏎': 'Enter', '⌤': 'Enter', return: 'Enter', enter: 'Enter',
  '⎋': 'Escape', esc: 'Escape', escape: 'Escape', '⇥': 'Tab', tab: 'Tab', '␣': 'Space', space: 'Space',
  '↑': 'ArrowUp', '↓': 'ArrowDown', '←': 'ArrowLeft', '→': 'ArrowRight',
  '+': 'Plus',
};

/** A key hint as aria-keyshortcuts: keys apart by a space or a plus, as the key cap shows them. */
export function keyShortcut(hint: string): string {
  const keys = hint
    .trim()
    .split(/\s+/)
    .flatMap((part) => (part.length > 1 && part.includes('+') ? part.split(/\+(?=.)/) : [part]));
  return keys.map((k) => KEY_NAMES[k.toLowerCase()] ?? (k.length === 1 ? k.toUpperCase() : k)).join('+');
}
