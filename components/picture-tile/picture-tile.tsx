import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';
import { Icon } from '../icon/icon.js';
import { ImagePlaceholder } from '../image-placeholder/image-placeholder.js';
import { usePictureFallback } from '../picture-fallback.js';
import { pictureTile } from './picture-tile.manifest.js';

export interface PictureTileProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>, VariantProps<typeof pictureTile.manifest> {
  /** The tile's words, under the picture: its name, and the button's. */
  label: string;
  /** The picture's address. Without it, and without `picture`, an image placeholder stands in, as it does when the picture fails to load. */
  src?: string;
  /** What the picture shows, when that is more than the label says. Empty by default: the label names the tile. */
  alt?: string;
  /** Anything to show in the picture's place instead of `src`, such as a skeleton while the picture loads. */
  picture?: ReactNode;
  /**
   * Whether the tile is the chosen one, for a gallery where one is chosen: drawn with the rim and the tick,
   * and pressed for assistive technology. Leave it out for a tile that only does something when pressed.
   */
  selected?: boolean;
  /** Reaches the button. */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Picture tile: one button with a picture and its label.
 *
 *   <PictureTile label="Halftone" src={preview} selected={look === 'halftone'} onClick={() => setLook('halftone')} />
 *
 * Lay tiles out in a grid that wraps; each fills its cell. With `selected` set, true or false, the tile is a
 * toggle (`aria-pressed`).
 */
export function PictureTile({ ratio, selected, label, src, alt, picture, className, type = 'button', ...rest }: PictureTileProps) {
  const part = pictureTile.part;
  const toggle = typeof selected === 'boolean';
  const fallback = usePictureFallback(src);
  // A picture that fails to load gives way to the placeholder, named as the picture was: never the broken-picture mark.
  const shown = picture ?? (!src ? <ImagePlaceholder /> : fallback.failed ? <ImagePlaceholder label={alt || undefined} /> : <img src={src} alt={alt ?? ''} {...fallback.props} />);
  return (
    <button type={type} className={cx(pictureTile({ ratio, selected }), className)} aria-pressed={toggle ? selected : undefined} {...rest}>
      <span className={part('picture')}>{shown}</span>
      <span className={part('label')}>{label}</span>
      {selected && (
        <span className={part('tick')} aria-hidden="true">
          <Icon name="Check" />
        </span>
      )}
    </button>
  );
}
