import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { areaPath, placePoints, smoothPath } from '../chart.js';
import { useEntrance } from '../entrance.js';
import { sparkline } from './sparkline.manifest.js';
import { cx } from '../variants.js';

/**
 * The drawing box, in the SVG's own units: as wide as 100 and as tall as the sparkline's 32. The line keeps to
 * the band Figma draws it in, from 6 to 24 down, leaving room for the end dot and the area's foot.
 */
const BOX = { width: 100, height: 32, top: 6, bottom: 24 };

export interface SparklineProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The values, oldest first. The line runs through them from left to right and ends in a dot on the last. */
  values: readonly number[];
  /** The soft fill under the line. On unless turned off. */
  area?: boolean;
  /**
   * What the line shows, in words, such as "Visits rising over 30 days". Without it the sparkline is hidden from
   * screen readers, because the figure beside it carries the meaning.
   */
  summary?: string;
  /** The lowest and highest values of the scale, so sparklines side by side can share one. The values' own unless given. */
  min?: number;
  max?: number;
  /** Reaches the sparkline. */
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Sparkline: a small line beside a figure, drawn from its values. It takes no focus. The first time it comes into
 * view it is uncovered from left to right (`entrance.ts`).
 */
export function Sparkline({ values, area = true, summary, min, max, className, ref, ...rest }: SparklineProps) {
  const part = sparkline.part;
  const points = placePoints(values, BOX, { min, max });
  const last = points[points.length - 1];
  const dot: CSSProperties | undefined = last && { left: `${last.x}%`, top: `${(last.y / BOX.height) * 100}%` };
  const entrance = useEntrance(ref);
  const named = summary ? { role: 'img', 'aria-label': summary } : { 'aria-hidden': true as const };
  return (
    <span ref={entrance} data-entrance="load" className={cx(sparkline({ area }), className)} {...named} {...rest}>
      <svg className={part('svg')} viewBox={`0 0 ${BOX.width} ${BOX.height}`} preserveAspectRatio="none" focusable="false" aria-hidden="true">
        {area && points.length > 1 && <path className={part('area')} d={areaPath(points, BOX.height)} />}
        <path className={part('line')} d={smoothPath(points)} />
      </svg>
      {dot && <span className={part('dot')} style={dot} />}
    </span>
  );
}
