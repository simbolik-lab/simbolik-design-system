/**
 * Numbers and dates written the same way on a page prepared on a server and in the reader's browser. With no
 * language named, `Intl` takes the runtime's own, and the server's and the browser's can differ: the page then
 * shows one thing before its script runs and another after, and React refuses to take the page over (a hydration
 * mismatch). So every component that writes numbers or dates itself writes them in English unless the page names
 * a language with `locale`. Each formatter is made once per language and options, not on every render.
 */

/** The language numbers and dates are written in when the page names none. */
export const FORMAT_LOCALE = 'en';

const numbers = new Map<string, Intl.NumberFormat>();
const dates = new Map<string, Intl.DateTimeFormat>();

/** A number formatter for `locale` (English unless given), made once and kept. */
export function numberFormat(locale?: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale ?? FORMAT_LOCALE}|${options ? JSON.stringify(options) : ''}`;
  let made = numbers.get(key);
  if (!made) {
    made = new Intl.NumberFormat(locale ?? FORMAT_LOCALE, options);
    numbers.set(key, made);
  }
  return made;
}

/** A date formatter for `locale` (English unless given), made once and kept. */
export function dateFormat(locale?: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale ?? FORMAT_LOCALE}|${options ? JSON.stringify(options) : ''}`;
  let made = dates.get(key);
  if (!made) {
    made = new Intl.DateTimeFormat(locale ?? FORMAT_LOCALE, options);
    dates.set(key, made);
  }
  return made;
}

/** A chart's way of writing a value: the page's own `format` when given, else a number in `locale` (English unless given). */
export function chartFormat(format: ((value: number) => string) | undefined, locale?: string): (value: number) => string {
  return format ?? numberFormat(locale).format;
}
