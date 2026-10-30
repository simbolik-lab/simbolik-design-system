'use client';

/**
 * Whether a picture failed to load, so a component can draw something else in its place instead of the browser's
 * broken-picture mark: the avatar its initials or its icon, the picture tile its placeholder.
 *
 *   const picture = usePictureFallback(src);
 *   return picture.failed ? <Initials /> : <img src={src} alt="" {...picture.props} />;
 *
 * A picture that failed before the page's script ran (a prerendered page) is caught as the script arrives, since its
 * error event was missed. A new address is tried afresh.
 */

import { useCallback, useState } from 'react';

export interface PictureFallback {
  /** The picture at this address failed to load. */
  failed: boolean;
  /** For the `img`: notices the failure. */
  props: { onError: () => void; ref: (img: HTMLImageElement | null) => void };
}

export function usePictureFallback(src: string | undefined): PictureFallback {
  const [failedSrc, setFailedSrc] = useState<string>();
  const onError = useCallback(() => setFailedSrc(src), [src]);
  // A picture already finished when the script arrives: decoding one that failed rejects, one that loaded does not.
  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img || !src || !img.complete || typeof img.decode !== 'function') return;
      img.decode().catch(() => {
        if (img.complete && img.naturalWidth === 0) setFailedSrc(src);
      });
    },
    [src],
  );
  return { failed: src !== undefined && failedSrc === src, props: { onError, ref } };
}
