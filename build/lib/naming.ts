/**
 * How a token path becomes a name (docs/naming.md, "The transform").
 * Prefix, then the path segments joined with hyphens. That is the whole rule.
 */
import { PREFIX } from '../config.js';

export function cssName(segments: string[]): string {
  return `--${PREFIX}-${segments.join('-')}`;
}

/** The composite parts a typography token exposes in CSS, and the property each maps to. */
export const TYPOGRAPHY_PARTS: Record<string, string> = {
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  textTransform: 'text-transform',
};

export function cssPartName(segments: string[], part: string): string {
  const suffix = TYPOGRAPHY_PARTS[part];
  if (!suffix) throw new Error(`No CSS part name for typography field "${part}".`);
  return cssName([...segments, suffix]);
}
