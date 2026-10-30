'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type DragEvent, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { useObjectRef } from 'react-aria';
import { fileUpload } from './file-upload.manifest.js';
import { FileRow, fileRowMessages, type FileRowWords, type FileStatus } from '../file-row/file-row.js';
import { accepts } from '../file-row/file-details.js';
import { button } from '../button/button.manifest.js';
import { FieldMessage } from '../field-message/field-message.js';
import { Icon } from '../icon/icon.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/** One chosen file, as the page keeps it: the upload draws a file row for each. */
export interface FileUploadFile {
  /** Stays the same while the file is in the list, whatever its status. */
  id: string;
  /** The file's name with its extension. */
  name: string;
  /** The file's size in bytes. */
  size?: number;
  /** The file's media type, which picks the icon when the extension does not. */
  type?: string;
  status: FileStatus;
  /** How many bytes have gone while it uploads. */
  loaded?: number;
  /** How far the upload has got, from 0 to 100, when the bytes are not known. */
  progress?: number;
  /** The words beside the state in place of the status's own: what went wrong, or why the file was not added. Read out with the file's name when the status changes. */
  message?: string;
}

/** A file the upload did not add, and why: not a type the accept list names, or a second file dropped at once on an upload that takes one. */
export interface FileUploadRefusal {
  file: File;
  reason: 'type' | 'count';
}

export interface FileUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children' | 'size' | 'onChange' | 'value' | 'defaultValue' | 'title'>,
    VariantProps<typeof fileUpload.manifest>,
    FileRowWords {
  /** The drop zone's title. "Choose files or drag them here", or "Choose a file or drag it here" for one file. */
  title?: ReactNode;
  /** The title while files are held over the zone. "Drop to add". */
  dropTitle?: ReactNode;
  /** The button's words. "Browse files" in a drop zone; "Choose files", or "Choose a file", in the button-only form. */
  buttonLabel?: ReactNode;
  /** What is accepted, said before anyone chooses: the types, the largest size, how many. Read with the input as its description. */
  constraints?: ReactNode;
  /** What is wrong, shown as a field message in the zone, under the button (under the line in the button-only form). Sets the error look too. */
  errorMessage?: ReactNode;
  /** The chosen files, each drawn as a file row under the zone. */
  files?: FileUploadFile[];
  /** Files chosen in the picker or dropped on the zone: those the upload takes, and those it refused, with why. The page adds them to `files`. */
  onAdd?: (files: File[], refused: FileUploadRefusal[]) => void;
  /** A Remove button was pressed. */
  onRemove?: (id: string) => void;
  /** A Cancel button was pressed, on a file uploading. */
  onCancel?: (id: string) => void;
  /** A Try again button was pressed, on a file that failed. */
  onRetry?: (id: string) => void;
  /** A Delete button was pressed, on a file uploaded. */
  onDelete?: (id: string) => void;
  /** What is read out when a file arrives chosen and waiting: "quarterly-report.pdf added". */
  addedLabel?: (name: string) => string;
  /** What is read out when a file leaves the list: "quarterly-report.pdf removed". */
  removedLabel?: (name: string) => string;
  /** Takes no files: the button and the drop zone are drawn and behave as disabled, and the rows show without their buttons. A field passes it on. */
  readOnly?: boolean;
  /** Extra classes on the block, such as a site's own class for its place. */
  className?: string;
  /** Reaches the native file input, e.g. to focus it. */
  ref?: Ref<HTMLInputElement>;
}

/**
 * File upload: a native file input inside a label drawn as the secondary button, so the browser's own picker opens
 * from a press, or Enter or Space on the focused input, with or without script. The drop zone also takes files
 * dropped on it. The page keeps the files: the upload hands over what was chosen (`onAdd`), draws a file row for
 * each of `files`, and passes on each row's buttons. It uploads nothing. A change of status, an arrival and a
 * removal are read out in one polite status region, not every percent; when the button that had focus goes, focus
 * moves to the next row's first button, else to the input. Read-only (`readOnly`, which a field passes on), it takes no
 * files, as disabled, since a browser has no read-only file input, and its rows show without their buttons.
 */
export function FileUpload(props: FileUploadProps) {
  const {
    type = 'drop-zone',
    error,
    dragging,
    title,
    dropTitle = 'Drop to add',
    buttonLabel,
    constraints,
    errorMessage,
    files = [],
    onAdd,
    onRemove,
    onCancel,
    onRetry,
    onDelete,
    addedLabel = (name: string) => `${name} added`,
    removedLabel = (name: string) => `${name} removed`,
    removeLabel,
    cancelLabel,
    retryLabel,
    deleteLabel,
    sizeLabel,
    locale,
    className,
    multiple,
    accept,
    required,
    disabled,
    readOnly,
    ref,
    ...input
  } = useFieldControl(props);
  // A browser has no read-only file input, so read-only takes no files, as disabled does, and the rows lose their buttons.
  const closed = Boolean(disabled || readOnly);
  const reactId = useId();
  const own = useObjectRef(ref);
  const list = useRef<HTMLUListElement>(null);
  const zone = type === 'drop-zone';
  const constraintsId = constraints ? `upload${reactId}-constraints` : undefined;
  const messageId = errorMessage ? `upload${reactId}-message` : undefined;
  const invalid = Boolean(error || errorMessage);
  const describedBy = [input['aria-describedby'], constraintsId, messageId].filter(Boolean).join(' ') || undefined;
  // The name holds the button's words after the label's, so a reader who says "Browse files" to their voice control
  // reaches it. The input names itself first when it has an aria-label of its own.
  const inputId = input.id ?? `upload${reactId}-input`;
  const buttonId = `upload${reactId}-button`;
  const labelledBy = [input['aria-labelledby'] ?? (input['aria-label'] ? inputId : undefined), buttonId].filter(Boolean).join(' ');

  // ---- dropping: a count of the zone's parts the drag is over, as each part fires its own enter and leave ----
  const depth = useRef(0);
  const [over, setOver] = useState(false);
  useEffect(() => {
    if (!over) return;
    const end = () => {
      depth.current = 0;
      setOver(false);
    };
    window.addEventListener('dragend', end);
    window.addEventListener('drop', end);
    return () => {
      window.removeEventListener('dragend', end);
      window.removeEventListener('drop', end);
    };
  }, [over]);

  const add = (chosen: File[]) => {
    if (chosen.length === 0) return;
    const taken: File[] = [];
    const refused: FileUploadRefusal[] = [];
    for (const file of chosen) {
      if (!accepts(accept, file)) refused.push({ file, reason: 'type' });
      else if (!multiple && taken.length > 0) refused.push({ file, reason: 'count' });
      else taken.push(file);
    }
    onAdd?.(taken, refused);
  };

  const holdsFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes('Files');
  const drops = zone
    ? {
        onDragEnter: (e: DragEvent<HTMLDivElement>) => {
          if (!holdsFiles(e)) return;
          e.preventDefault();
          depth.current += 1;
          if (!closed) setOver(true);
        },
        onDragOver: (e: DragEvent<HTMLDivElement>) => {
          if (!holdsFiles(e)) return;
          // Taken even when disabled or read-only, so a file dropped by mistake is not opened by the browser in the page's place.
          e.preventDefault();
          e.dataTransfer.dropEffect = closed ? 'none' : 'copy';
        },
        onDragLeave: (e: DragEvent<HTMLDivElement>) => {
          if (!holdsFiles(e)) return;
          depth.current = Math.max(0, depth.current - 1);
          if (depth.current === 0) setOver(false);
        },
        onDrop: (e: DragEvent<HTMLDivElement>) => {
          if (!holdsFiles(e)) return;
          e.preventDefault();
          depth.current = 0;
          setOver(false);
          if (!closed) add(Array.from(e.dataTransfer.files));
        },
      }
    : {};

  // Enter opens the picker too, as Space does; not every browser opens it on Enter by itself.
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    input.onKeyDown?.(e);
    if (e.key === 'Enter' && !e.defaultPrevented) {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  // ---- read out what changed: a file's status, an arrival, a removal; never each percent ----
  const before = useRef<Map<string, FileUploadFile> | null>(null);
  const [said, setSaid] = useState('');
  const flip = useRef(false);
  useEffect(() => {
    const now = new Map(files.map((f) => [f.id, f]));
    const was = before.current;
    before.current = now;
    if (!was) return;
    const state = (f: FileUploadFile) => `${f.name}: ${f.message ?? fileRowMessages[f.status] ?? ''}`.replace(/: $/, '');
    const lines: string[] = [];
    for (const f of files) {
      const old = was.get(f.id);
      if (!old) lines.push(f.status === 'selected' && !f.message ? addedLabel(f.name) : state(f));
      else if (old.status !== f.status || old.message !== f.message) lines.push(f.status === 'selected' && !f.message ? addedLabel(f.name) : state(f));
    }
    for (const [id, old] of was) if (!now.has(id)) lines.push(removedLabel(old.name));
    if (lines.length === 0) return;
    // The same words twice are still read twice: a no-break space comes and goes at the end.
    flip.current = !flip.current;
    setSaid(lines.map((line) => (/[.!?…]$/.test(line) ? line : `${line}.`)).join(' ') + (flip.current ? '\u00a0' : ''));
  }, [files, addedLabel, removedLabel]);

  // ---- keep focus when the button that had it goes: the row's first button, the next row's, the last row's, or the input ----
  const pressed = useRef<{ id: string; index: number; target: HTMLElement } | null>(null);
  const press = (id: string, handler?: (id: string) => void) =>
    handler &&
    (() => {
      const target = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (target) pressed.current = { id, index: files.findIndex((f) => f.id === id), target };
      handler(id);
    });
  useLayoutEffect(() => {
    const last = pressed.current;
    if (!last) return;
    if (last.target.isConnected && document.activeElement === last.target) return;
    pressed.current = null;
    const active = document.activeElement;
    if (active && active !== document.body && active.isConnected) return;
    const rows = Array.from(list.current?.children ?? []) as HTMLElement[];
    const index = files.findIndex((f) => f.id === last.id);
    const next = index >= 0 ? rows[index] : (rows[last.index] ?? rows[rows.length - 1]);
    const target = next?.querySelector<HTMLElement>('button') ?? own.current;
    target?.focus();
  }, [files]);


  const many = multiple === true;
  const constraintsLine = constraints && (
    <p id={constraintsId} className={fileUpload.part('constraints')}>
      {constraints}
    </p>
  );
  // The error is a field message of the error type, as a field's is, drawn in the zone.
  const message = errorMessage && (
    <FieldMessage id={messageId} type="error" className={fileUpload.part('message')}>
      {errorMessage}
    </FieldMessage>
  );
  const picker = (
    <label className={`${button({ tone: 'secondary', size: 'md' })} ${fileUpload.part('button')}`}>
      <input
        {...input}
        id={inputId}
        ref={own}
        type="file"
        className={fileUpload.part('input')}
        accept={accept}
        multiple={multiple}
        disabled={closed}
        // Required only while no file is chosen: the files live with the page, and the input is emptied after each choice.
        required={(required && files.filter((f) => f.status !== 'rejected').length === 0) || undefined}
        aria-invalid={invalid || undefined}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          add(Array.from(e.currentTarget.files ?? []));
          // Emptied, so the same file can be chosen again after it is removed.
          e.currentTarget.value = '';
        }}
      />
      {/* Read once, in the input's name, not again as text beside it. */}
      <span id={buttonId} className={button.part('label')} aria-hidden="true">
        {buttonLabel ?? (zone ? 'Browse files' : many ? 'Choose files' : 'Choose a file')}
      </span>
    </label>
  );

  return (
    <div className={cx(fileUpload({ type, error: invalid, dragging: zone && (dragging ?? over) }), className)}>
      {/* Disabled or read-only, the zone says so too, so its title and its line read as part of a control out of reach, not as faint text. */}
      <div className={fileUpload.part('zone')} aria-disabled={closed || undefined} {...drops}>
        <div className={fileUpload.part('body')}>
          {zone ? (
            <>
              <Icon name="UploadSimple" className={fileUpload.part('icon')} />
              <div className={fileUpload.part('text')}>
                <p className={fileUpload.part('title')}>{title ?? (many ? 'Choose files or drag them here' : 'Choose a file or drag it here')}</p>
                {constraintsLine}
              </div>
              {picker}
              {message}
            </>
          ) : (
            <>
              {picker}
              {constraintsLine}
              {message}
            </>
          )}
        </div>
        {zone && (
          <div className={fileUpload.part('drop')} aria-hidden="true">
            <Icon name="UploadSimple" className={fileUpload.part('icon')} />
            <div className={fileUpload.part('text')}>
              <p className={fileUpload.part('title')}>{dropTitle}</p>
              {constraints && <p className={fileUpload.part('constraints')}>{constraints}</p>}
            </div>
          </div>
        )}
      </div>
      {files.length > 0 && (
        <ul ref={list} className={fileUpload.part('files')}>
          {files.map((f) => (
            <li key={f.id} className={fileUpload.part('file')}>
              <FileRow
                status={f.status}
                name={f.name}
                size={f.size}
                type={f.type}
                loaded={f.loaded}
                progress={f.progress}
                message={f.message}
                onRemove={readOnly ? undefined : press(f.id, onRemove)}
                onCancel={readOnly ? undefined : press(f.id, onCancel)}
                onRetry={readOnly ? undefined : press(f.id, onRetry)}
                onDelete={readOnly ? undefined : press(f.id, onDelete)}
                removeLabel={removeLabel}
                cancelLabel={cancelLabel}
                retryLabel={retryLabel}
                deleteLabel={deleteLabel}
                sizeLabel={sizeLabel}
                locale={locale}
              />
            </li>
          ))}
        </ul>
      )}
      <div role="status" className={fileUpload.part('announcement')}>
        {said}
      </div>
    </div>
  );
}
readsField(FileUpload);
