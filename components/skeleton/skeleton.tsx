import type { HTMLAttributes, ReactNode } from 'react';
import { skeleton } from './skeleton.manifest.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

type Shape = NonNullable<VariantProps<typeof skeleton.manifest>['shape']>;
type Size = NonNullable<VariantProps<typeof skeleton.manifest>['size']>;

export interface SkeletonProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof skeleton.manifest> {
  /**
   * For the media shape: the proportion of the media it stands in for, as
   * width over height, e.g. [4, 3]. 16:9 by default. Data from the consumer, not a design value.
   */
  ratio?: [number, number];
  /**
   * For the text, title, label and paragraph shapes: how many lines of that text it stands in for. The
   * lines stand one line height apart, so the skeleton is as tall as the text that replaces it. One by
   * default, three for a paragraph, whose last line is shorter.
   */
  lines?: number;
  /** For the table row shape: how many columns the row has after its selection box. Four by default. */
  columns?: number;
  /**
   * The component that is loading. Given, the skeleton takes its shape (the component shape): the
   * component keeps its size, place and corners and draws the skeleton until `loaded`.
   */
  children?: ReactNode;
  /** The element around a wrapped component: a div, or a span inside a line of text. It draws no box of its own. */
  as?: 'div' | 'span';
}

/** One shape drawn inside a block, at a size: the same markup the Skeleton draws for that shape. */
function Piece({ shape, size, lines = 1, ratio }: { shape: Shape; size: Size; lines?: number; ratio?: [number, number] }) {
  const count = Math.max(1, Math.floor(lines));
  return (
    <span className={skeleton({ shape, size })} style={ratio ? { aspectRatio: `${ratio[0]} / ${ratio[1]}` } : undefined}>
      {count > 1 && Array.from({ length: count }, (_, i) => <span key={i} className={skeleton.part('line')} />)}
    </span>
  );
}

/** A step down the sizes, for the smaller line under a bigger one. */
const smaller: Record<Size, Size> = { sm: 'sm', md: 'sm', lg: 'md' };
/** A card's title line at each card size: a large text line, and a small title on the large card. */
const cardTitle: Record<Size, { shape: Shape; size: Size }> = { sm: { shape: 'text', size: 'md' }, md: { shape: 'text', size: 'lg' }, lg: { shape: 'title', size: 'sm' } };

/**
 * Skeleton: an inert placeholder, hidden from assistive technology; the loading state is announced by
 * the region that shows it. With children it wraps them and takes their shape:
 *
 *   <Skeleton loaded={ready}><Button size="sm">Save</Button></Skeleton>
 *
 * The wrapped component stays in the page, so it keeps its state and nothing moves when it loads; until
 * then it cannot be reached by the keyboard or assistive technology. The list item, card and table row
 * shapes are one hidden block built from the other shapes.
 */
export function Skeleton({ shape, size, loaded, ratio, lines, columns = 4, children, as: Wrap = 'div', className, style, ...rest }: SkeletonProps) {
  if (children !== undefined && children !== null && children !== false) {
    const waiting = !loaded;
    return (
      <Wrap className={cx(skeleton({ shape: shape ?? 'component', loaded }), className)} inert={waiting} aria-hidden={waiting || undefined} style={style} {...rest}>
        {children}
      </Wrap>
    );
  }
  const s: Size = size ?? 'md';
  const classes = cx(skeleton({ shape, size }), className);
  if (shape === 'list-item' || shape === 'card' || shape === 'table-row') {
    return (
      <span aria-hidden="true" className={classes} style={style} {...rest}>
        {shape === 'list-item' && (
          <>
            <Piece shape="avatar" size={s} />
            <span className={skeleton.part('text')}>
              <Piece shape="label" size={s} />
              <Piece shape="text" size={smaller[s]} />
            </span>
          </>
        )}
        {shape === 'card' && (
          <>
            <Piece shape="media" size={s} ratio={ratio} />
            <Piece {...cardTitle[s]} />
            <Piece shape="paragraph" size={smaller[s]} lines={2} />
          </>
        )}
        {shape === 'table-row' && (
          <>
            <Piece shape="icon" size={s} />
            {Array.from({ length: Math.max(1, Math.floor(columns)) }, (_, i) => <Piece key={i} shape="label" size={s} />)}
          </>
        )}
      </span>
    );
  }
  const aspect = ratio ? { aspectRatio: `${ratio[0]} / ${ratio[1]}` } : undefined;
  const text = shape === undefined || shape === 'text' || shape === 'title' || shape === 'label' || shape === 'paragraph';
  const count = text ? Math.max(1, Math.floor(lines ?? (shape === 'paragraph' ? 3 : 1))) : 1;
  return (
    <span aria-hidden="true" className={classes} style={{ ...aspect, ...style }} {...rest}>
      {count > 1 && Array.from({ length: count }, (_, i) => <span key={i} className={skeleton.part('line')} />)}
    </span>
  );
}
