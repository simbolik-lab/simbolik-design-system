/**
 * Reading a typed date or time the reader's own way, and writing one back: the date picker's words, apart from its
 * markup so they can be tried on their own. Dates are counted in the Gregorian calendar.
 */
import { CalendarDate, GregorianCalendar, getLocalTimeZone, today } from '@internationalized/date';

type Part = 'day' | 'month' | 'year';

/** A time of day, to the minute. */
export interface Time {
  hour: number;
  minute: number;
}

/** A date as the 2-digit-day, 2-digit-month, 4-digit-year form of a language, read in UTC so the day never shifts. */
export const DATE_FORMAT = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' } as const;
/** The example a format hint shows: a day past 12, so the order of day and month is plain. */
export const EXAMPLE_DATE = new CalendarDate(2026, 3, 27);
export const EXAMPLE_TIME: Time = { hour: 14, minute: 30 };

const pad = (n: number) => String(n).padStart(2, '0');
export const isoTime = (t: Time) => `${pad(t.hour)}:${pad(t.minute)}`;
export const asUtc = (d: CalendarDate, t: Time = { hour: 0, minute: 0 }) => new Date(Date.UTC(d.year, d.month - 1, d.day, t.hour, t.minute));
export const timeFormat = (hourCycle?: 12 | 24): Intl.DateTimeFormatOptions => ({
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
  ...(hourCycle === 12 ? { hour12: true } : hourCycle === 24 ? { hourCycle: 'h23' as const } : {}),
});

/** An ISO time from a prop ("14:30", "14:30:00"), or null. */
export function readIsoTime(iso: string | null | undefined): Time | null {
  const m = iso?.match(/(\d{2}):(\d{2})/);
  return m ? { hour: Number(m[1]), minute: Number(m[2]) } : null;
}

/** How a language writes its own digits, mapped to 0 to 9, so a date typed in Arabic or Devanagari digits reads too. */
function digitsOf(locale: string): Map<string, string> {
  const map = new Map<string, string>();
  const nf = new Intl.NumberFormat(locale, { useGrouping: false });
  for (let i = 0; i < 10; i++) map.set(nf.format(i), String(i));
  return map;
}

const toAscii = (text: string, digits: Map<string, string>) => [...text].map((c) => digits.get(c) ?? c).join('');

/** The order a language writes day, month and year in. */
function orderOf(locale: string): Part[] {
  return new Intl.DateTimeFormat(locale, DATE_FORMAT)
    .formatToParts(asUtc(EXAMPLE_DATE))
    .map((p) => p.type)
    .filter((t): t is Part => t === 'day' || t === 'month' || t === 'year');
}

/** How a language says before and after noon, lower case and without dots or spaces, with the English short forms. */
function periodsOf(locale: string): { am: string[]; pm: string[] } {
  const f = new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true, timeZone: 'UTC' });
  const said = (hour: number) => (f.formatToParts(new Date(Date.UTC(2026, 2, 27, hour))).find((p) => p.type === 'dayPeriod')?.value ?? '').toLowerCase().replace(/[.\s]/g, '');
  return { am: [said(1), 'am', 'a'].filter(Boolean), pm: [said(13), 'pm', 'p'].filter(Boolean) };
}

/**
 * Reads a typed date: three groups of digits in the language's order, whatever stands between them; or one group of
 * eight or six digits; or a four-digit year first, as an ISO date is written. A two-digit year is the one nearest to
 * now, no more than 20 years ahead. Null when empty; 'invalid' when it is not a real date.
 */
export function readTypedDate(text: string, locale: string): CalendarDate | null | 'invalid' {
  const typed = toAscii(text, digitsOf(locale)).trim();
  if (typed === '') return null;
  const order = orderOf(locale);
  let groups: string[] = typed.match(/\d+/g) ?? [];
  const whole = groups.length === 1 ? (groups[0] ?? '') : '';
  if (whole.length === 8 || whole.length === 6) {
    const run = whole;
    const yearLength = run.length === 8 ? 4 : 2;
    let at = 0;
    groups = order.map((part) => {
      const length = part === 'year' ? yearLength : 2;
      const piece = run.slice(at, at + length);
      at += length;
      return piece;
    });
  }
  if (groups.length !== 3) return 'invalid';
  const parts: Partial<Record<Part, string>> = {};
  const read: Part[] = groups[0]?.length === 4 && order[0] !== 'year' ? ['year', 'month', 'day'] : order;
  read.forEach((part, i) => (parts[part] = groups[i]));
  const yearText = parts.year ?? '';
  if (yearText.length !== 4 && yearText.length > 2) return 'invalid';
  let year = Number(yearText);
  if (yearText.length <= 2) {
    const now = today(getLocalTimeZone()).year;
    year += Math.floor(now / 100) * 100;
    if (year > now + 20) year -= 100;
  }
  const month = Number(parts.month);
  const day = Number(parts.day);
  if (year < 1 || month < 1 || month > 12 || day < 1) return 'invalid';
  const first = new CalendarDate(year, month, 1);
  if (day > new GregorianCalendar().getDaysInMonth(first)) return 'invalid';
  return new CalendarDate(year, month, day);
}

/**
 * Reads a typed time: hours and minutes with anything between them ("14:30", "2.30 pm", "14 h 30"), or one run of
 * digits ("1430", "930", "9"), with the language's words for before and after noon. Null when empty; 'invalid' when
 * it is not a time of day.
 */
export function readTypedTime(text: string, locale: string): Time | null | 'invalid' {
  const typed = toAscii(text, digitsOf(locale)).trim().toLowerCase();
  if (typed === '') return null;
  const words = typed.replace(/[\d\s.:,]/g, '');
  const { am, pm } = periodsOf(locale);
  const afternoon = words !== '' && pm.some((w) => words.includes(w) || w.startsWith(words));
  const morning = !afternoon && words !== '' && am.some((w) => words.includes(w) || w.startsWith(words));
  const groups: string[] = typed.match(/\d+/g) ?? [];
  let hour: number;
  let minute = 0;
  if (groups.length === 1) {
    const run = groups[0] ?? '';
    if (run.length <= 2) hour = Number(run);
    else if (run.length <= 4) {
      hour = Number(run.slice(0, run.length - 2));
      minute = Number(run.slice(-2));
    } else return 'invalid';
  } else if (groups.length === 2 || groups.length === 3) {
    hour = Number(groups[0]);
    minute = Number(groups[1]);
    if (groups[1]?.length !== 2) return 'invalid';
  } else return 'invalid';
  if (afternoon && hour >= 1 && hour < 12) hour += 12;
  if (morning && hour === 12) hour = 0;
  if ((afternoon || morning) && (hour > 23 || (hour > 12 && !afternoon))) return 'invalid';
  if (hour > 23 || minute > 59) return 'invalid';
  return { hour, minute };
}
