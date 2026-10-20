/**
 * What the file row and the file upload work out from a file: the name split at its extension, the icon for its
 * type, its size written in English or the language the page names, and whether it is a type the upload accepts.
 */

import { numberFormat } from '../format.js';

/** The name before its extension and the extension with its dot: "quarterly-report" and ".pdf". A name with no dot, or only a leading one, has no extension. */
export function splitName(name: string): [stem: string, extension: string] {
  const dot = name.lastIndexOf('.');
  return dot > 0 && dot < name.length - 1 ? [name.slice(0, dot), name.slice(dot)] : [name, ''];
}

const BY_EXTENSION: Record<string, string> = {
  pdf: 'FilePdf',
  doc: 'FileDoc', docx: 'FileDoc', odt: 'FileDoc', rtf: 'FileDoc', pages: 'FileDoc',
  xls: 'FileXls', xlsx: 'FileXls', ods: 'FileXls', numbers: 'FileXls',
  ppt: 'FilePpt', pptx: 'FilePpt', odp: 'FilePpt', key: 'FilePpt',
  csv: 'FileCsv', tsv: 'FileCsv',
  png: 'FileImage', jpg: 'FileImage', jpeg: 'FileImage', gif: 'FileImage', webp: 'FileImage', avif: 'FileImage', svg: 'FileImage', heic: 'FileImage', bmp: 'FileImage', tif: 'FileImage', tiff: 'FileImage',
  mp4: 'FileVideo', mov: 'FileVideo', webm: 'FileVideo', mkv: 'FileVideo', avi: 'FileVideo', m4v: 'FileVideo',
  mp3: 'FileAudio', wav: 'FileAudio', ogg: 'FileAudio', m4a: 'FileAudio', flac: 'FileAudio', aac: 'FileAudio',
  zip: 'FileZip', gz: 'FileZip', tgz: 'FileZip', rar: 'FileZip', '7z': 'FileZip', tar: 'FileZip',
  txt: 'FileText', md: 'FileText', log: 'FileText', json: 'FileText', xml: 'FileText',
};

const BY_MEDIA: Record<string, string> = { image: 'FileImage', video: 'FileVideo', audio: 'FileAudio', text: 'FileText' };

/** The icon for a file's type, from its extension, else from its media type, else the plain file. */
export function fileIcon(name: string, type?: string): string {
  const extension = splitName(name)[1].slice(1).toLowerCase();
  return BY_EXTENSION[extension] ?? (type ? BY_MEDIA[type.split('/')[0]!.toLowerCase()] : undefined) ?? 'File';
}

const STEPS = [
  ['byte', 1],
  ['kilobyte', 1e3],
  ['megabyte', 1e6],
  ['gigabyte', 1e9],
] as const;

function stepFor(bytes: number) {
  let chosen: (typeof STEPS)[number] = STEPS[0];
  for (const step of STEPS) if (bytes >= step[1]) chosen = step;
  return chosen;
}

/** A size in bytes written in English, or in `locale`, in the unit that suits it: "2.4 MB", "830 kB", "512 bytes". */
export function formatSize(bytes: number, locale?: string): string {
  const [unit, step] = stepFor(bytes);
  return numberFormat(locale, { style: 'unit', unit, unitDisplay: unit === 'byte' ? 'long' : 'short', maximumFractionDigits: unit === 'byte' ? 0 : 1 }).format(bytes / step);
}

/** How much of a file has gone, in the unit of its whole size: the figure alone ("1.1") and the whole with its unit ("2.4 MB"). */
export function formatPart(loaded: number, total: number, locale?: string): [part: string, whole: string] {
  const [unit, step] = stepFor(total);
  const part = numberFormat(locale, { maximumFractionDigits: unit === 'byte' ? 0 : 1 }).format(Math.min(loaded, total) / step);
  return [part, formatSize(total, locale)];
}

/**
 * Whether a file is a type an input's accept list names: an extension (".pdf"), a media type ("application/pdf")
 * or a family ("image/*"). Like the attribute itself it is a hint for the reader, never a check the server can trust.
 */
export function accepts(accept: string | undefined, file: { name: string; type?: string }): boolean {
  const wanted = (accept ?? '').split(',').map((part) => part.trim().toLowerCase()).filter(Boolean);
  if (wanted.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = (file.type ?? '').toLowerCase();
  return wanted.some((part) => (part.startsWith('.') ? name.endsWith(part) : part.endsWith('/*') ? type.startsWith(part.slice(0, -1)) : type === part));
}
