import { useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type Ref } from 'react';
import { parseColor } from 'react-stately';
import { shadowEditor } from './shadow-editor.manifest.js';
import { Button } from '../button/button.js';
import { ColorPicker } from '../color-picker/color-picker.js';
import { Icon } from '../icon/icon.js';
import { NumberField } from '../number-field/number-field.js';
import { cx } from '../variants.js';
import { useControllable } from '../controllable.js';

/** One layer of a shadow: its offsets, blur and spread in pixels, its color and its opacity from 0 to 1. */
export interface ShadowLayerData {
  x: number;
  y: number;
  blur: number;
  spread: number;
  /** A CSS color, such as "#000000". Its own opacity is replaced by the layer's. */
  color: string;
  opacity: number;
  /** Drawn inside the box rather than under it. Kept as given; the editor offers no switch for it. */
  inset?: boolean;
}

export interface ShadowEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The layers, top first, when the page holds them. Pair it with onChange. */
  value?: ShadowLayerData[];
  /** The first layers, when the editor holds its own. */
  defaultValue?: ShadowLayerData[];
  /** Called with the layers after every change. */
  onChange?: (layers: ShadowLayerData[]) => void;
  /** The layer Add layer adds. A soft one-pixel shadow unless given. */
  newLayer?: ShadowLayerData;
  /** Leaves out the preview (Figma's Preview switch). */
  hidePreview?: boolean;
  /** Leaves out Add layer (Figma's Add layer switch). */
  hideAdd?: boolean;
  /** Leaves out each layer's Remove button (the layer's Remove switch). */
  hideRemove?: boolean;
  /** The editor's words, in the page's language: each in English unless given. */
  words?: Partial<ShadowEditorWords>;
  ref?: Ref<HTMLDivElement>;
}

/** The words the shadow editor shows and says, in the page's language. */
export interface ShadowEditorWords {
  /** A layer's name, given its place from 1: "Layer 1". */
  layer: (place: number) => string;
  /** The words of the button that adds a layer. */
  add: string;
  /** A move handle's name, given the layer's name: "Move Layer 1". */
  move: (layer: string) => string;
  /** A Remove button's name, given the layer's name: "Remove Layer 1". */
  remove: (layer: string) => string;
  /** What a move handle tells a screen reader it does. */
  moveHint: string;
  /** The labels of the number boxes and the color. */
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
  opacity: string;
  /** Said after X and Y, unseen: " offset in pixels". */
  offsetUnit: string;
  /** Said after Blur and Spread, unseen: " in pixels". */
  sizeUnit: string;
  /** Said when a layer has been added, removed or moved, given the places. */
  added: (place: number) => string;
  removed: (place: number) => string;
  moved: (from: number, to: number, count: number) => string;
  /** Said when a dragged layer is let go, given its new place and the count. */
  dropped: (to: number, count: number) => string;
}

export const SHADOW_EDITOR_WORDS: ShadowEditorWords = {
  layer: (place) => `Layer ${place}`,
  add: 'Add layer',
  move: (layer) => `Move ${layer}`,
  remove: (layer) => `Remove ${layer}`,
  moveHint: 'Up and down arrow keys move the layer.',
  x: 'X',
  y: 'Y',
  blur: 'Blur',
  spread: 'Spread',
  color: 'Color',
  opacity: 'Opacity',
  offsetUnit: ' offset in pixels',
  sizeUnit: ' in pixels',
  added: (place) => `Layer ${place} added`,
  removed: (place) => `Layer ${place} removed`,
  moved: (from, to, count) => `Layer ${from} moved to place ${to} of ${count}`,
  dropped: (to, count) => `Layer moved to place ${to} of ${count}`,
};

/** The layers as CSS's box-shadow writes them, top first. "none" for no layers. */
export function shadowToCss(layers: ShadowLayerData[]): string {
  if (!layers.length) return 'none';
  return layers
    .map((l) => {
      let paint = 'transparent';
      try {
        paint = parseColor(l.color).withChannelValue('alpha', Math.min(1, Math.max(0, l.opacity))).toString('css');
      } catch {
        /* a color that cannot be read draws nothing */
      }
      return `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${Math.max(0, l.blur)}px ${l.spread}px ${paint}`;
    })
    .join(', ');
}

const SOFT: ShadowLayerData = { x: 0, y: 1, blur: 2, spread: 0, color: '#000000', opacity: 0.08 };
let seed = 0;
const freshId = () => `layer-${++seed}`;

/**
 * Shadow editor: a preview card drawn with the shadow, its layers from top to bottom, and Add layer. Each layer is a list
 * item named "Layer 1", "Layer 2" by its place, with number boxes for its offsets, blur (never below 0) and spread, the
 * color picker's field and an opacity box in percent, each named with its layer. With two layers or more, each has a move
 * handle: a button that moves its layer up and down with the arrow keys, or by dragging. Remove takes a layer out and moves
 * focus to the layer that takes its place, or to Add layer; Add layer adds one at the foot and moves focus to its first
 * box. Each change of the list is said politely. The preview is hidden from screen readers: the numbers are the content.
 */
export function ShadowEditor({ value, defaultValue = [], onChange, newLayer = SOFT, hidePreview, hideAdd, hideRemove, words, className, style, ref, ...rest }: ShadowEditorProps) {
  const w = { ...SHADOW_EDITOR_WORDS, ...words };
  const [layers, keep] = useControllable({ value, defaultValue, name: 'ShadowEditor value' });
  const [ids, setIds] = useState<string[]>(() => layers.map((_, i) => `layer-start-${i}`));
  const [said, setSaid] = useState('');
  const [dragging, setDragging] = useState<number | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const focusNext = useRef<{ index: number; what: 'first' | 'remove' | 'handle' } | 'add' | null>(null);
  const base = useId();
  // The page may change the number of layers itself: the ids follow it.
  const keys = ids.length === layers.length ? ids : layers.map((_, i) => ids[i] ?? `layer-page-${i}`);

  const commit = (next: ShadowLayerData[], nextIds: string[], words?: string) => {
    keep(next);
    setIds(nextIds);
    if (words) setSaid(words);
    onChange?.(next);
  };
  const change = (i: number, patch: Partial<ShadowLayerData>) => commit(layers.map((l, j) => (j === i ? { ...l, ...patch } : l)), keys);
  const moveTo = (from: number, to: number, words: boolean) => {
    if (to < 0 || to >= layers.length || to === from) return;
    const next = [...layers];
    const nextIds = [...keys];
    next.splice(to, 0, next.splice(from, 1)[0]!);
    nextIds.splice(to, 0, nextIds.splice(from, 1)[0]!);
    commit(next, nextIds, words ? w.moved(from + 1, to + 1, layers.length) : undefined);
    focusNext.current = { index: to, what: 'handle' };
  };
  const remove = (i: number) => {
    commit(layers.filter((_, j) => j !== i), keys.filter((_, j) => j !== i), w.removed(i + 1));
    focusNext.current = layers.length > 1 ? { index: Math.min(i, layers.length - 2), what: 'remove' } : 'add';
  };
  const add = () => {
    commit([...layers, { ...newLayer }], [...keys, freshId()], w.added(layers.length + 1));
    focusNext.current = { index: layers.length, what: 'first' };
  };

  // Focus lands after the list has drawn the change.
  useEffect(() => {
    const want = focusNext.current;
    if (!want) return;
    focusNext.current = null;
    if (want === 'add') {
      addRef.current?.focus();
      return;
    }
    const item = list.current?.children[want.index] as HTMLElement | undefined;
    const selector = want.what === 'first' ? 'input' : want.what === 'remove' ? `.${shadowEditor.part('remove')}` : `.${shadowEditor.part('handle')}`;
    (item?.querySelector<HTMLElement>(selector) ?? item?.querySelector<HTMLElement>('button, input'))?.focus();
  });

  const handleKeys = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowUp') moveTo(i, i - 1, true);
    else if (e.key === 'ArrowDown') moveTo(i, i + 1, true);
    else return;
    e.preventDefault();
  };
  const handleDown = (i: number) => (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(i);
  };
  const handleMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (dragging === null || !list.current) return;
    const items = Array.from(list.current.children) as HTMLElement[];
    let to = dragging;
    items.forEach((el, j) => {
      const r = el.getBoundingClientRect();
      const middle = r.top + r.height / 2;
      if (j < dragging && e.clientY < middle) to = Math.min(to, j);
      if (j > dragging && e.clientY > middle) to = Math.max(to, j);
    });
    if (to !== dragging) {
      moveTo(dragging, to, false);
      setDragging(to);
    }
  };
  const handleUp = () => {
    if (dragging !== null) setSaid(w.dropped(dragging + 1, layers.length));
    setDragging(null);
  };

  const shadow = { '--smbk-shadow-editor-shadow': shadowToCss(layers) } as CSSProperties;
  const movable = layers.length > 1;
  const hintId = `${base}-hint`;
  const NUMBERS = [
    { key: 'x', label: w.x, unit: w.offsetUnit },
    { key: 'y', label: w.y, unit: w.offsetUnit },
    { key: 'blur', label: w.blur, unit: w.sizeUnit },
    { key: 'spread', label: w.spread, unit: w.sizeUnit },
  ] as const;

  return (
    <div ref={ref} {...rest} style={{ ...style, ...shadow }} className={cx(shadowEditor(), className)}>
      {!hidePreview && (
        <div className={shadowEditor.part('preview')} aria-hidden="true">
          <div className={shadowEditor.part('card')} />
        </div>
      )}
      {movable && <span id={hintId} className={shadowEditor.part('hidden')}>{w.moveHint}</span>}
      <ol ref={list} className={shadowEditor.part('layers')}>
        {layers.map((l, i) => {
          const id = `${base}-${i}`;
          const name = w.layer(i + 1);
          const opacityAlone = (() => {
            try {
              return parseColor(l.color).withChannelValue('alpha', 1).toString('hex');
            } catch {
              return '#000000';
            }
          })();
          return (
            <li key={keys[i]} className={shadowEditor.part('layer')} aria-labelledby={`${id}-name`} data-dragging={dragging === i || undefined}>
              <div className={shadowEditor.part('head')}>
                <span className={shadowEditor.part('title')}>
                  {movable && (
                    <button
                      type="button"
                      className={shadowEditor.part('handle')}
                      aria-label={w.move(name)}
                      aria-describedby={hintId}
                      onKeyDown={handleKeys(i)}
                      onPointerDown={handleDown(i)}
                      onPointerMove={handleMove}
                      onPointerUp={handleUp}
                      onPointerCancel={handleUp}
                    >
                      <Icon name="DotsSixVertical" />
                    </button>
                  )}
                  <span id={`${id}-name`} className={shadowEditor.part('name')}>{name}</span>
                </span>
                {!hideRemove && (
                  <Button tone="ghost" size="xs" icon-only icon="Trash" aria-label={w.remove(name)} className={shadowEditor.part('remove')} onClick={() => remove(i)} />
                )}
              </div>
              <div className={shadowEditor.part('fields')}>
                {NUMBERS.map((n) => (
                  <span key={n.key} className={shadowEditor.part('field')}>
                    <span id={`${id}-${n.key}`} className={shadowEditor.part('label')}>
                      {n.label}
                      <span className={shadowEditor.part('hidden')}>{n.unit}</span>
                    </span>
                    <NumberField
                      size="sm"
                      hideButtons
                      value={l[n.key]}
                      min={n.key === 'blur' ? 0 : undefined}
                      aria-labelledby={`${id}-name ${id}-${n.key}`}
                      onChange={(v) => v !== null && change(i, { [n.key]: v })}
                    />
                  </span>
                ))}
              </div>
              <div className={shadowEditor.part('paint')}>
                <span className={shadowEditor.part('field')}>
                  <span id={`${id}-color`} className={shadowEditor.part('label')}>{w.color}</span>
                  <ColorPicker
                    type="field"
                    size="sm"
                    value={opacityAlone}
                    showOpacity={false}
                    aria-labelledby={`${id}-name ${id}-color`}
                    onChange={(c) => change(i, { color: c.toString('hex') })}
                  />
                </span>
                <span className={shadowEditor.part('field')}>
                  <span id={`${id}-opacity`} className={shadowEditor.part('label')}>{w.opacity}</span>
                  <NumberField
                    size="sm"
                    hideButtons
                    value={l.opacity}
                    min={0}
                    max={1}
                    step={0.01}
                    formatOptions={{ style: 'percent' }}
                    aria-labelledby={`${id}-name ${id}-opacity`}
                    onChange={(v) => v !== null && change(i, { opacity: v })}
                  />
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      {!hideAdd && (
        <Button ref={addRef} tone="ghost" size="sm" leadingIcon="Plus" className={shadowEditor.part('add')} onClick={add}>
          {w.add}
        </Button>
      )}
      <span role="status" className={shadowEditor.part('hidden')}>{said}</span>
    </div>
  );
}
