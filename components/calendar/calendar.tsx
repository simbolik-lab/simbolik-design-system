import { useRef, type ButtonHTMLAttributes, type HTMLAttributes, type KeyboardEvent, type Ref } from 'react';
import { I18nProvider, mergeProps, useCalendar, useCalendarCell, useCalendarGrid, useFocusable, useFocusRing, useLocale, useObjectRef, usePress, useRangeCalendar, type AriaButtonProps } from 'react-aria';
import { useCalendarState, useRangeCalendarState, type CalendarState, type RangeCalendarState } from 'react-stately';
import { GregorianCalendar, endOfWeek, isSameDay, isToday, parseDate, startOfWeek, type CalendarDate } from '@internationalized/date';
import { calendar } from './calendar.manifest.js';
import { Button } from '../button/button.js';
import { cx } from '../variants.js';

/** A day that can start the week. */
export type Weekday = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

/** Says whether a day, as an ISO date (YYYY-MM-DD), cannot be chosen: false, true, or the reason in words. */
export type DateUnavailable = (date: string) => boolean | string;

/** A range of days as ISO dates (YYYY-MM-DD): the first and the last, both included, the first never after the last. */
export interface DateRange {
  start: string;
  end: string;
}

/** What a calendar takes whichever way it chooses. */
interface CalendarCommonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The day that has the keyboard focus first when no date is chosen, and so the month shown. Today unless given. */
  defaultFocusedValue?: string;
  /** The earliest date that can be chosen, as an ISO date. Days before it are unavailable, and the previous button stops at its month. */
  min?: string;
  /** The latest date that can be chosen, as an ISO date. */
  max?: string;
  /** Marks days that cannot be chosen, such as a closed day. Return a reason in words, and a screen reader says it with the day. A range never runs across such a day. */
  isDateUnavailable?: DateUnavailable;
  /** The language the month, the weekday names and the days are written in, such as "de-DE". The reader's own unless given. */
  locale?: string;
  /** The day the week starts on. The language's own unless given. */
  firstDayOfWeek?: Weekday;
  disabled?: boolean;
  /** The days can be moved through and read, not chosen. */
  readOnly?: boolean;
  /** Puts the keyboard focus on the chosen day, or the first focused day, as the calendar appears. */
  autoFocus?: boolean;
  /** The previous button's name, in place of the language's own "Previous". */
  previousLabel?: string;
  /** The next button's name, in place of the language's own "Next". */
  nextLabel?: string;
  /** What the dates are for, such as "Delivery date". The month is added to it. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Reaches the calendar's outer element. */
  ref?: Ref<HTMLDivElement>;
}

/** A calendar that chooses one day: the default. */
export interface CalendarSingleProps extends CalendarCommonProps {
  /** One day is chosen. */
  selection?: 'single';
  /** The chosen date as an ISO date (YYYY-MM-DD), when the page holds it; null for none. Pair it with onChange. */
  value?: string | null;
  /** The date chosen at first, when the calendar holds its own. */
  defaultValue?: string | null;
  /** Called with the chosen date, as an ISO date, when a day is picked. */
  onChange?: (value: string) => void;
}

/** A calendar that chooses a range of days: the first press sets one end, the second the other. */
export interface CalendarRangeProps extends CalendarCommonProps {
  /** A range of days is chosen, from a first day to a last. */
  selection: 'range';
  /** The chosen range as ISO dates, when the page holds it; null for none. Pair it with onChange. */
  value?: DateRange | null;
  /** The range chosen at first, when the calendar holds its own. */
  defaultValue?: DateRange | null;
  /** Called with the chosen range, as ISO dates, when its second end is picked. */
  onChange?: (range: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/** The locale with the Gregorian calendar asked for, so every language counts days, months and years the same way. */
export function gregorianLocale(locale: string): string {
  try {
    return new Intl.Locale(locale, { calendar: 'gregory' }).toString();
  } catch {
    return locale;
  }
}

/** The calendar every date here is counted in. */
export const createGregorian = () => new GregorianCalendar();

/** An ISO date given as a prop, read as a date: undefined stays undefined (not given) and null stays null (none). */
export function readIsoDate(iso: string | null | undefined): CalendarDate | null | undefined {
  if (iso === undefined || iso === null) return iso;
  return parseDate(iso.slice(0, 10));
}

/** A range given as a prop, read as dates: undefined stays undefined (not given) and null stays null (none). */
function readIsoRange(range: DateRange | null | undefined): { start: CalendarDate; end: CalendarDate } | null | undefined {
  if (range === undefined || range === null) return range;
  return { start: parseDate(range.start.slice(0, 10)), end: parseDate(range.end.slice(0, 10)) };
}

/**
 * The previous or next button: React Aria's press handling on the system's small ghost icon button. It is React
 * Aria's useButton taken apart, so usePress gets no ref: given one, it writes a style element into the page, which a
 * Site's security policy refuses.
 */
function MonthButton({ aria, icon, part, label }: { aria: AriaButtonProps; icon: string; part: string; label?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { isDisabled, onPress, onPressStart, onPressEnd, onPressChange, onPressUp, preventFocusOnPress } = aria;
  const { pressProps } = usePress({ onPress, onPressStart, onPressEnd, onPressChange, onPressUp, isDisabled, preventFocusOnPress });
  const { focusableProps } = useFocusable(aria, ref);
  const named = { id: aria.id, 'aria-label': label ?? aria['aria-label'] };
  const props = mergeProps({ type: 'button', disabled: isDisabled }, focusableProps, pressProps, named);
  return <Button ref={ref} tone="ghost" size="sm" icon-only icon={icon} className={part} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}

type AnyCalendarState = CalendarState | RangeCalendarState;

/**
 * One day of the month: React Aria's calendar cell, drawn as Figma's Calendar day. Days of other months are empty. In a
 * range, the first and last days are chosen days and say which end they are; the days between are marked as such,
 * and the cell under each draws the band that joins them (the stylesheet reads the neighbouring cells).
 */
function Day({ state, date, unavailable }: { state: AnyCalendarState; date: CalendarDate; unavailable?: DateUnavailable }) {
  const ref = useRef<HTMLDivElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, isUnavailable, isOutsideVisibleRange, formattedDate } = useCalendarCell({ date }, state, ref);
  // Whether the keyboard brought focus here: a day focused by a press or by the pointer resting on it draws no ring.
  const { focusProps, isFocusVisible } = useFocusRing();
  if (isOutsideVisibleRange) return <td {...cellProps} className={calendar.part('cell')} />;
  const why = isUnavailable && unavailable ? unavailable(date.toString()) : undefined;
  const label = typeof why === 'string' && why !== '' ? `${buttonProps['aria-label']}, ${why}` : buttonProps['aria-label'];
  const day = calendar.part('day');
  // A day out of reach is struck through, unless the whole calendar is disabled.
  const struck = (isDisabled || isUnavailable) && !state.isDisabled;
  const today = isToday(date, state.timeZone);
  // The range chosen, or the one being chosen: from the first press to the day under the pointer or the keyboard focus.
  const range = 'highlightedRange' in state ? state.highlightedRange : null;
  const first = range ? isSameDay(date, range.start) : false;
  const last = range ? isSameDay(date, range.end) : false;
  const between = range ? !first && !last && date.compare(range.start) > 0 && date.compare(range.end) < 0 : false;
  const chosen = range ? first || last : isSelected;
  const classes = [
    day,
    chosen && `${day}--selected`,
    first && `${day}--range-start`,
    between && `${day}--range-middle`,
    last && `${day}--range-end`,
    today && `${day}--today`,
    struck && `${day}--unavailable`,
  ]
    .filter(Boolean)
    .join(' ');
  // Today is marked as the current date as well as said in its name, as Figma's guidance asks.
  return (
    <td {...cellProps} className={calendar.part('cell')}>
      <div {...mergeProps(buttonProps, focusProps)} aria-label={label} aria-current={today ? 'date' : undefined} data-focus-visible={isFocusVisible ? undefined : 'false'} ref={ref} className={classes}>
        {formattedDate}
      </div>
    </td>
  );
}

const WEEKS = [0, 1, 2, 3, 4, 5];

type CalendarAria = ReturnType<typeof useCalendar>;

/** The props every month takes, whichever way it chooses: the shared ones, without the language (the provider holds it). */
type MonthProps = Omit<CalendarCommonProps, 'locale'>;

/** The month as drawn: the header, the weekday row and six weeks, over the state and the props React Aria gives. */
function MonthView({
  state, aria, selection, firstDayOfWeek, isDateUnavailable, previousLabel, nextLabel, className, rootRef, rest,
}: {
  state: AnyCalendarState;
  aria: CalendarAria;
  selection: 'single' | 'range';
  firstDayOfWeek?: Weekday;
  isDateUnavailable?: DateUnavailable;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
  rootRef: Ref<HTMLDivElement> | undefined;
  rest: HTMLAttributes<HTMLDivElement>;
}) {
  const { locale, direction } = useLocale();
  const { calendarProps, prevButtonProps, nextButtonProps, title } = aria;
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid({ weekdayStyle: 'short', firstDayOfWeek }, state);
  const rtl = direction === 'rtl';
  // Home and End go to the ends of the week, as the APG's date picker does; React Aria's own go to the ends of the month.
  const onGridKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    if ((e.key === 'Home' || e.key === 'End') && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      const at = state.focusedDate;
      state.setFocusedDate(e.key === 'Home' ? startOfWeek(at, locale, firstDayOfWeek) : endOfWeek(at, locale, firstDayOfWeek));
      return;
    }
    gridProps.onKeyDown?.(e);
  };
  return (
    <div ref={rootRef} {...mergeProps(rest, calendarProps)} className={cx(calendar({ selection }), className)}>
      <div className={calendar.part('header')}>
        <MonthButton aria={prevButtonProps} icon={rtl ? 'CaretRight' : 'CaretLeft'} part={calendar.part('prev')} label={previousLabel} />
        <p className={calendar.part('title')}>{title}</p>
        <MonthButton aria={nextButtonProps} icon={rtl ? 'CaretLeft' : 'CaretRight'} part={calendar.part('next')} label={nextLabel} />
      </div>
      <table {...gridProps} onKeyDown={onGridKeyDown} className={calendar.part('grid')}>
        <thead {...headerProps}>
          <tr className={calendar.part('weekdays')}>
            {weekDays.map((name, i) => (
              <th key={i} className={calendar.part('weekday')}>
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {/* Always six weeks, so the calendar keeps its height from month to month; a week the month does not reach is empty and unseen by a screen reader. */}
          {WEEKS.map((week) =>
            week < weeksInMonth ? (
              <tr key={week} role="row" className={calendar.part('week')}>
                {state.getDatesInWeek(week).map((date, i) =>
                  date ? <Day key={i} state={state} date={date} unavailable={isDateUnavailable} /> : <td key={i} role="gridcell" className={calendar.part('cell')} />,
                )}
              </tr>
            ) : (
              <tr key={week} aria-hidden="true" className={calendar.part('week')}>
                {WEEKS.concat(6).map((i) => (
                  <td key={i} className={calendar.part('cell')} />
                ))}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

/** A month that chooses one day: React Aria's calendar. */
function SingleMonth({
  value, defaultValue, onChange, defaultFocusedValue, min, max, isDateUnavailable, firstDayOfWeek, disabled, readOnly, autoFocus,
  previousLabel, nextLabel, id, className, ref, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, ...rest
}: MonthProps & Omit<CalendarSingleProps, 'locale' | 'selection'>) {
  const { locale } = useLocale();
  const state = useCalendarState<CalendarDate>({
    value: readIsoDate(value),
    defaultValue: readIsoDate(defaultValue),
    onChange: (date) => onChange?.(date.toString()),
    defaultFocusedValue: readIsoDate(defaultFocusedValue),
    minValue: readIsoDate(min),
    maxValue: readIsoDate(max),
    isDateUnavailable: isDateUnavailable ? (date) => Boolean(isDateUnavailable(date.toString())) : undefined,
    isDisabled: disabled,
    isReadOnly: readOnly,
    autoFocus,
    firstDayOfWeek,
    locale,
    createCalendar: createGregorian,
  });
  const aria = useCalendar(
    { id, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, isDisabled: disabled },
    state,
  );
  return (
    <MonthView
      state={state} aria={aria} selection="single" firstDayOfWeek={firstDayOfWeek} isDateUnavailable={isDateUnavailable}
      previousLabel={previousLabel} nextLabel={nextLabel} className={className} rootRef={ref} rest={rest}
    />
  );
}

/**
 * A month that chooses a range: React Aria's range calendar. The first press (or Enter) sets one end; until the second,
 * the band follows the pointer or the keyboard focus to the other; the second sets it, whichever comes first in time.
 * Leaving the calendar halfway keeps the range up to the day last reached, as React Aria does.
 */
function RangeMonth({
  value, defaultValue, onChange, defaultFocusedValue, min, max, isDateUnavailable, firstDayOfWeek, disabled, readOnly, autoFocus,
  previousLabel, nextLabel, id, className, ref, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, ...rest
}: MonthProps & Omit<CalendarRangeProps, 'locale' | 'selection'>) {
  const { locale } = useLocale();
  // React Aria's range calendar reads its own element, to tell a press or a blur outside it; the page's ref reaches it too.
  const own = useObjectRef(ref);
  const state = useRangeCalendarState<CalendarDate>({
    value: readIsoRange(value),
    defaultValue: readIsoRange(defaultValue),
    onChange: (range) => onChange?.({ start: range.start.toString(), end: range.end.toString() }),
    defaultFocusedValue: readIsoDate(defaultFocusedValue),
    minValue: readIsoDate(min),
    maxValue: readIsoDate(max),
    isDateUnavailable: isDateUnavailable ? (date) => Boolean(isDateUnavailable(date.toString())) : undefined,
    isDisabled: disabled,
    isReadOnly: readOnly,
    autoFocus,
    firstDayOfWeek,
    locale,
    createCalendar: createGregorian,
  });
  const aria = useRangeCalendar(
    { id, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, isDisabled: disabled },
    state,
    own,
  );
  return (
    <MonthView
      state={state} aria={aria} selection="range" firstDayOfWeek={firstDayOfWeek} isDateUnavailable={isDateUnavailable}
      previousLabel={previousLabel} nextLabel={nextLabel} className={className} rootRef={own} rest={rest}
    />
  );
}

/**
 * Calendar: a month of days to choose a date from, or with `selection="range"` a range of dates, with the previous and
 * next buttons around the month's name, the weekday names, and six weeks of days. Its behaviour is React Aria's calendar: one day is in the Tab order; the arrow
 * keys move by day and by week, Page Up and Page Down by month (with Shift, by year), Home and End to the ends of the
 * week; Enter or Space chooses the day (in a range, the first press sets one end and the second the other). Each day is read with its weekday, month and year, and says when it is today
 * or chosen; the month is announced as it changes. The month, the weekday names, the first day of the week and the
 * order of the keys follow the reader's language, or `locale`, in the Gregorian calendar. Dates go in and come out as
 * ISO dates (YYYY-MM-DD). It fills the width it is given, never narrower than seven days.
 */
export function Calendar(props: CalendarProps) {
  const reader = useLocale().locale;
  const month = props.selection === 'range' ? <RangeMonth {...withoutChoice(props)} /> : <SingleMonth {...withoutChoice(props)} />;
  return <I18nProvider locale={gregorianLocale(props.locale ?? reader)}>{month}</I18nProvider>;
}

/** The props a month takes: the language and the way of choosing are the calendar's own. */
function withoutChoice<P extends CalendarProps>({ locale: _locale, selection: _selection, ...rest }: P): Omit<P, 'locale' | 'selection'> {
  return rest;
}
