import type { HTMLAttributes, ReactNode } from 'react';
import { skeleton } from './skeleton.manifest.js';
import type { VariantProps } from '../variants.js';

export interface SkeletonProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof skeleton.manifest> {
  /**
   * For the media shape: the proportion of the media it stands in for, as
   * width over height, e.g. [16, 9]. Data from the consumer, not a design value.
   */
  ratio?: [number, number];
  /**
   * For the text, title and label shapes: how many lines of that text it stands in for. The lines
   * stand one line height apart, so the skeleton is as tall as the text that replaces it. One by default.
   */
  lines?: number;
  /**
   * The component that is loading. Given, the skeleton takes its shape (the component shape): the
   * component keeps its size, place and corners and draws the skeleton until `loaded`.
   */
  children?: ReactNode;
  /** The element around a wrapped component: a div, or a span inside a line of text. It draws no box of its own. */
  as?: 'div' | 'span';
}

/**
 * Skeleton: an inert placeholder, hidden from assistive technology; the loading state is announced by
 * the region that shows it. With children it wraps them and takes their shape:
 *
 *   <Skeleton loaded={ready}><Button size="sm">Save</Button></Skeleton>
 *
 * The wrapped component stays in the page, so it keeps its state and nothing moves when it loads; until
 * then it cannot be reached by the keyboard or assistive technology.
 */
export function Skeleton({ shape, loaded, ratio, lines = 1, children, as: Wrap = 'div', className, style, ...rest }: SkeletonProps) {
  if (children !== undefined && children !== null && children !== false) {
    const waiting = !loaded;
    return (
      <Wrap className={[skeleton({ shape: shape ?? 'component', loaded }), className].filter(Boolean).join(' ')} inert={waiting} aria-hidden={waiting || undefined} style={style} {...rest}>
        {children}
      </Wrap>
    );
  }
  const aspect = ratio ? { aspectRatio: `${ratio[0]} / ${ratio[1]}` } : undefined;
  const text = shape === undefined || shape === 'text' || shape === 'title' || shape === 'label';
  const count = text ? Math.max(1, Math.floor(lines)) : 1;
  return (
    <span aria-hidden="true" className={[skeleton({ shape }), className].filter(Boolean).join(' ')} style={{ ...aspect, ...style }} {...rest}>
      {count > 1 && Array.from({ length: count }, (_, i) => <span key={i} className={skeleton.part('line')} />)}
    </span>
  );
}
