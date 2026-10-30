'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { fileRow } from './file-row.manifest.js';
import { fileIcon, formatPart, formatSize, splitName } from './file-details.js';
import { Button } from '../button/button.js';
import { Icon } from '../icon/icon.js';
import { Progress } from '../progress/progress.js';
import { spinner } from '../spinner/spinner.manifest.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

export type FileStatus = NonNullable<VariantProps<typeof fileRow.manifest>['status']>;

/** The words each status shows when the page gives none. A refused file should always say why instead. */
export const fileRowMessages: Record<FileStatus, string | undefined> = {
  selected: undefined,
  uploading: 'Uploading…',
  complete: 'Uploaded',
  failed: 'Upload failed',
  rejected: 'Not added',
};

/** The icon each status leads its words with. Uploading shows the spinner's ring instead. */
const STATE_ICONS: Partial<Record<FileStatus, string>> = { complete: 'Check', failed: 'XCircle', rejected: 'Warning' };

export interface FileRowWords {
  /** The name of the button that takes a chosen file away. */
  removeLabel?: (name: string) => string;
  /** The name of the button that stops an upload under way. */
  cancelLabel?: (name: string) => string;
  /** The name of the button that tries a failed upload again. */
  retryLabel?: (name: string) => string;
  /** The name of the button that deletes an uploaded file. */
  deleteLabel?: (name: string) => string;
  /** How much of the file has gone while it uploads, from the two figures as `locale` writes them: "1.1 of 2.4 MB". */
  sizeLabel?: (part: string, whole: string) => string;
  /** The language sizes are written in, such as "de-DE". English when left out, so a page prepared on a server and the browser write them alike. */
  locale?: string;
}

export interface FileRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof fileRow.manifest>, FileRowWords {
  /** The file's name with its extension, such as "quarterly-report.pdf". Shown as text, never as markup. */
  name: string;
  /** The file's size in bytes. Shown while the file is chosen, uploading or uploaded. */
  size?: number;
  /** How many bytes have gone while it uploads. With the size, it writes "1.1 of 2.4 MB" and fills the bar. */
  loaded?: number;
  /** How far the upload has got, from 0 to 100, when the bytes are not known. Without either, the bar shows its unknown state. */
  progress?: number;
  /** The words beside the state, in place of the status's own: what went wrong, or why the file was not added. */
  message?: string;
  /** The file's media type, such as "application/pdf", which picks the icon when the extension does not. */
  type?: string;
  /** A Phosphor icon name in place of the one the file's type picks. */
  icon?: string;
  /** Takes a chosen, failed or refused file away. Without it the row shows no Remove button. */
  onRemove?: () => void;
  /** Stops an upload under way. Without it an uploading row shows no Cancel button. */
  onCancel?: () => void;
  /** Tries a failed upload again. Without it a failed row shows no Try again button. */
  onRetry?: () => void;
  /** Deletes an uploaded file. Without it an uploaded row shows no Delete button. */
  onDelete?: () => void;
}

/**
 * File row: one chosen file, its name, size and state, and the buttons for what can be done with it, each named with
 * the file. Markup and words only: it uploads nothing, and the page sets its status. A row alone announces nothing;
 * in a file upload, its changes of status are announced for it.
 */
export function FileRow({
  status = 'selected',
  name,
  size,
  loaded,
  progress,
  message,
  type,
  icon,
  onRemove,
  onCancel,
  onRetry,
  onDelete,
  removeLabel = (file) => `Remove ${file}`,
  cancelLabel = (file) => `Cancel upload of ${file}`,
  retryLabel = (file) => `Try again to upload ${file}`,
  deleteLabel = (file) => `Delete ${file}`,
  sizeLabel = (part, whole) => `${part} of ${whole}`,
  locale,
  className,
  ...rest
}: FileRowProps) {
  const [stem, extension] = splitName(name);
  const words = message ?? fileRowMessages[status];
  // A failed or refused file shows only its reason; the others show their size, then their state after a dot.
  const sized = size !== undefined && (status === 'selected' || status === 'uploading' || status === 'complete');
  const sizeText = sized ? (status === 'uploading' && loaded !== undefined ? sizeLabel(...formatPart(loaded, size, locale)) : formatSize(size, locale)) : undefined;
  const stateIcon = STATE_ICONS[status];
  const percent = loaded !== undefined && size ? (Math.min(loaded, size) / size) * 100 : progress;

  const action = (key: string, label: string, glyph: string, onPress: () => void) => <Button key={key} tone="ghost" size="sm" icon-only icon={glyph} aria-label={label} onClick={onPress} />;
  // Figma's actions per status: Try again then Remove when it failed, Cancel while uploading, Delete once uploaded, Remove otherwise.
  const actions = [
    status === 'failed' && onRetry && action('retry', retryLabel(name), 'ArrowsClockwise', onRetry),
    status === 'uploading' && onCancel && action('cancel', cancelLabel(name), 'X', onCancel),
    status === 'complete' && onDelete && action('delete', deleteLabel(name), 'Trash', onDelete),
    status !== 'uploading' && status !== 'complete' && onRemove && action('remove', removeLabel(name), 'X', onRemove),
  ].filter(Boolean);

  return (
    <div className={cx(fileRow({ status }), className)} {...rest}>
      <div className={fileRow.part('top')}>
        <Icon name={icon ?? fileIcon(name, type)} className={fileRow.part('icon')} />
        <div className={fileRow.part('text')}>
          <p className={fileRow.part('name')} dir="auto">
            <span className={fileRow.part('stem')}>{stem}</span>
            {extension && <span className={fileRow.part('extension')}>{extension}</span>}
          </p>
          {(sizeText || words) && (
            <p className={fileRow.part('meta')}>
              {sizeText && <span className={fileRow.part('size')}>{sizeText}</span>}
              {sizeText && words && (
                <span className={fileRow.part('separator')} aria-hidden="true">
                  ·
                </span>
              )}
              {words && (
                <span className={fileRow.part('state')}>
                  {status === 'uploading' && (
                    <span className={`${spinner({ size: 'sm', tone: 'subtle' })} ${fileRow.part('state-icon')}`} aria-hidden="true">
                      <span className={spinner.part('ring')} />
                    </span>
                  )}
                  {stateIcon && <Icon name={stateIcon} className={fileRow.part('state-icon')} />}
                  <span className={fileRow.part('message')}>{words}</span>
                </span>
              )}
            </p>
          )}
        </div>
        {actions.length > 0 && <div className={fileRow.part('actions')}>{actions}</div>}
      </div>
      {status === 'uploading' && <Progress size="sm" value={percent} aria-label={name} className={fileRow.part('progress')} />}
    </div>
  );
}
