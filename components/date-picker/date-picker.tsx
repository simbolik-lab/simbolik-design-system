'use client';

import { useEffect, useId, useMemo, useRef, useState, type FocusEvent, type HTMLAttributes, type KeyboardEvent, type Ref } from 'react';
import { flushSync } from 'react-dom';
import { I18nProvider, mergeProps, useDateFormatter, useLocale, useObjectRef } from 'react-aria';
import type { CalendarDate } from '@internationalized/date';
import { datePicker } from './date-picker.manifest.js';
import { input } from '../input/input.manifest.js';
import { popover } from '../popover/popover.manifest.js';
import { Button } from '../button/button.js';
import { Icon } from '../icon/icon.js';
import { Calendar, gregorianLocale, readIsoDate, type DateRange, type DateUnavailable, type Weekday } from '../calendar/calendar.js';
import { DATE_FORMAT, EXAMPLE_DATE, EXAMPLE_TIME, asUtc, isoTime, readIsoTime, readTypedDate, readTypedTime, timeFormat, type Time } from './date-reading.js';
import { Modal } from '../modal/modal.js';
import { useFloating } from '../floating.js';
import { useDismiss } from '../dismiss.js';
import { isNarrow } from '../motion.js';
import { useControllable } from '../controllable.js';
import { isFirstInvalid, useFormReset } from '../form.js';
import { InputWell } from '../input/input-well.js';
import { readsField, useFieldControl } from '../field/field-context.js';
import { cx } from '../variants.js';
import type { VariantProps } from '../variants.js';

/**
 * Why a typed value is not one the picker can give: words that are not a date or not a time, a date and time (or a
 * range's first and last day) with one of them missing, a date before `min` or after `max` (a time, for the time
 * type), a day marked unavailable, or a range whose last day comes before its first.
 */
export type DatePickerProblem = 'not-a-date' | 'not-a-time' | 'incomplete' | 'too-early' | 'too-late' | 'unavailable' | 'end-before-start';

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'>, VariantProps<typeof datePicker.manifest> {
  /**
   * The value, when the page holds it, in one form whatever the reader's language: an ISO date for a date
   * (YYYY-MM-DD), a 24-hour time for a time (HH:MM, such as "14:30"), both joined by T for a date and time (YYYY-MM-DDTHH:MM),
   * and for a date range the first and last day joined by a slash, as ISO writes a period (YYYY-MM-DD/YYYY-MM-DD).
   * Null for none. Pair it with onChange.
   */
  value?: string | null;
  /** The value it starts with, when the picker holds its own. */
  defaultValue?: string | null;
  /**
   * Called when the value is settled: a day is picked, or the reader leaves a field they typed in or presses Enter.
   * The value is null when the fields are empty or what is typed is not a date or a time; `problem` then says why,
   * so the page can word its error. A date outside `min` and `max`, or marked unavailable, comes with its problem.
   */
  onChange?: (value: string | null, problem?: DatePickerProblem) => void;
  /** The earliest date that can be picked, as an ISO date; for the time type, the earliest time ("09:00"). */
  min?: string;
  /** The latest date that can be picked, as an ISO date; for the time type, the latest time ("17:30"). */
  max?: string;
  /** Marks days that cannot be picked, such as a closed day. Return a reason in words, and a screen reader says it with the day. */
  isDateUnavailable?: DateUnavailable;
  /** The language dates and times are read and written in, such as "de-DE". The reader's own unless given. */
  locale?: string;
  /** The day the calendar's week starts on. The language's own unless given. */
  firstDayOfWeek?: Weekday;
  /** 12 or 24 hours, for the time. The language's own unless given. */
  hourCycle?: 12 | 24;
  /** The calendar button's name, and the open calendar's. */
  chooseLabel?: string;
  /** The date field's own name in a date and time picker, after the picker's name. */
  dateLabel?: string;
  /** The time field's own name in a date and time picker, after the picker's name. */
  timeLabel?: string;
  /** The first day's field's own name in a date range, after the picker's name. */
  startLabel?: string;
  /** The last day's field's own name in a date range, after the picker's name. */
  endLabel?: string;
  /** Shown in the first field while it is empty. The format belongs in the field's help text, which stays in view. */
  placeholder?: string;
  /** The browser's autofill hint for the first field, such as "bday" for the reader's own birth date. */
  autoComplete?: string;
  /** Form field name; the value travels in a hidden input in its one form. A date range sends two values under the
   * name, its first day and then its last, each an ISO date. */
  name?: string;
  form?: string;
  disabled?: boolean;
  /** The value can be read, copied and reached with Tab, not changed: there is no calendar button. */
  readOnly?: boolean;
  /** A value must be given. Said on the fields; the field around the picker draws the mark. */
  required?: boolean;
  /** Shown open from the start, as in a picture of the page, without moving focus. A press elsewhere closes it. */
  defaultOpen?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Reaches the first field typed in, e.g. to focus it when a form is sent without a date. */
  ref?: Ref<HTMLInputElement>;
}

/** The ISO form of the format example in the reader's language, or `locale`: a date ("27/03/2026", "03/27/2026") or a time ("14:30", "2:30 PM"). */
export function useDateFormatExample(type: 'date' | 'time' = 'date', { locale, hourCycle }: { locale?: string; hourCycle?: 12 | 24 } = {}): string {
  const reader = useLocale().locale;
  const tongue = gregorianLocale(locale ?? reader);
  const dates = useMemo(() => new Intl.DateTimeFormat(tongue, DATE_FORMAT), [tongue]);
  const times = useMemo(() => new Intl.DateTimeFormat(tongue, timeFormat(hourCycle)), [tongue, hourCycle]);
  return type === 'time' ? times.format(asUtc(EXAMPLE_DATE, EXAMPLE_TIME)) : dates.format(asUtc(EXAMPLE_DATE));
}

/**
 * The format a date picker reads, as an example written the reader's way (or `locale`'s), for the field's help
 * text: "For example, <DateFormatExample />" reads "For example, 03/27/2026" to a reader in the United States and
 * "For example, 27/03/2026" in Britain.
 */
export function DateFormatExample({ type = 'date', locale, hourCycle }: { type?: 'date' | 'time'; locale?: string; hourCycle?: 12 | 24 }) {
  return <>{useDateFormatExample(type, { locale, hourCycle })}</>;
}

/** What the fields read, worked out: the date and time each part holds, the value they make, and what keeps them from one. */
interface Reading {
  date: CalendarDate | null | 'invalid';
  time: Time | null | 'invalid';
  /** A range's last day. */
  end?: CalendarDate | null | 'invalid';
  value: string | null;
  problem?: DatePickerProblem;
}

function PickerFields(props: DatePickerProps) {
  const {
    type = 'date', error, value, defaultValue, onChange, min, max, isDateUnavailable, firstDayOfWeek, hourCycle, chooseLabel = 'Choose date',
    dateLabel = 'Date', timeLabel = 'Time', startLabel = 'Start date', endLabel = 'End date', placeholder, autoComplete, name, form, disabled, readOnly, required, defaultOpen = false,
    id, className, ref, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, locale: _locale, ...rest
  } = props;
  const { locale } = useLocale();
  const range = type === 'date-range';
  const hasDate = type !== 'time';
  const hasTime = type === 'time' || type === 'date-time';
  // Two fields in one group, each named after the picker: a date and a time, or a range's first and last day.
  const both = type === 'date-time' || range;

  const root = useRef<HTMLDivElement>(null);
  const first = useObjectRef(ref);
  const second = useRef<HTMLInputElement>(null);
  const dateWell = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  // The fields and the calendar take their ids from the picker's id, which the field around it gives.
  const reactId = useId();
  const base = id ?? `date-picker${reactId}`;
  const dateId = hasDate ? base : `${base}-date`;
  const timeId = hasDate ? `${base}-time` : base;
  const endId = `${base}-end`;
  const popupId = `${base}-calendar`;

  const dates = useDateFormatter(DATE_FORMAT);
  const times = useDateFormatter(timeFormat(hourCycle));
  const showDate = (d: CalendarDate | null) => (d ? dates.format(asUtc(d)) : '');
  const showTime = (t: Time | null) => (t ? times.format(asUtc(EXAMPLE_DATE, t)) : '');
  const datePartOf = (v: string | null | undefined) => (hasDate && v ? (readIsoDate(v.split('/')[0]) ?? null) : null);
  const timePartOf = (v: string | null | undefined) => (hasTime && v ? readIsoTime(type === 'time' ? v : v.split('T')[1]) : null);
  const endPartOf = (v: string | null | undefined) => (range && v ? (readIsoDate(v.split('/')[1]) ?? null) : null);

  // onChange hears the problem with the value too, so it is told in settle.
  const [current, keep] = useControllable<string | null>({ value, defaultValue: defaultValue ?? null, name: 'DatePicker value' });
  const [dateText, setDateText] = useState(() => showDate(datePartOf(current)));
  const [timeText, setTimeText] = useState(() => showTime(timePartOf(current)));
  const [endText, setEndText] = useState(() => showDate(endPartOf(current)));
  // What the second field holds: the time, or a range's last day.
  const secondText = range ? endText : timeText;

  // The fields show the value in the reader's language: written again when the value changes from outside or the
  // language changes, as it does once the page's script has started, but never over what the reader typed and left.
  const shownKey = `${current}|${locale}|${hourCycle}`;
  const [shown, setShown] = useState(shownKey);
  if (shown !== shownKey) {
    setShown(shownKey);
    setDateText(showDate(datePartOf(current)));
    setTimeText(showTime(timePartOf(current)));
    setEndText(showDate(endPartOf(current)));
  }
  const lastProblem = useRef<DatePickerProblem | undefined>(undefined);
  // A form sent while a required picker holds no value marks it in error until it holds one, as the select does.
  const [missing, setMissing] = useState(false);
  const flagged = Boolean(error) || (missing && !current);

  /** Whether a day falls outside `min` and `max` or is marked unavailable. */
  const dayProblem = (day: CalendarDate): DatePickerProblem | undefined => {
    const lo = readIsoDate(min);
    const hi = readIsoDate(max);
    if (lo && day.compare(lo) < 0) return 'too-early';
    if (hi && day.compare(hi) > 0) return 'too-late';
    if (isDateUnavailable?.(day.toString())) return 'unavailable';
    return undefined;
  };

  /** A range's two fields: both days read, the first not after the last, each inside the limits. */
  const readRange = (sText: string, eText: string): Reading => {
    const date = readTypedDate(sText, locale);
    const end = readTypedDate(eText, locale);
    const result: Reading = { date, time: null, end, value: null };
    if (date === 'invalid' || end === 'invalid') result.problem = 'not-a-date';
    else if (date && end) {
      result.value = `${date.toString()}/${end.toString()}`;
      result.problem = end.compare(date) < 0 ? 'end-before-start' : (dayProblem(date) ?? dayProblem(end));
    } else if (date || end) result.problem = 'incomplete';
    return result;
  };

  const readFields = (dText: string, tText: string): Reading => {
    if (range) return readRange(dText, tText);
    const date = hasDate ? readTypedDate(dText, locale) : null;
    const time = hasTime ? readTypedTime(tText, locale) : null;
    let result: Reading = { date, time, value: null };
    if (date === 'invalid') result.problem = 'not-a-date';
    else if (time === 'invalid') result.problem = 'not-a-time';
    else if (!both) result.value = date ? date.toString() : time ? isoTime(time) : null;
    else if (date && time) result.value = `${date.toString()}T${isoTime(time)}`;
    else if (date || time) result.problem = 'incomplete';
    if (result.value && date && date !== 'invalid') {
      const problem = dayProblem(date);
      if (problem) result = { ...result, problem };
    } else if (result.value && type === 'time' && time && time !== 'invalid') {
      const at = isoTime(time);
      const lo = readIsoTime(min);
      const hi = readIsoTime(max);
      if (lo && at < isoTime(lo)) result = { ...result, problem: 'too-early' };
      else if (hi && at > isoTime(hi)) result = { ...result, problem: 'too-late' };
    }
    return result;
  };

  /**
   * Settles what the fields read: each readable part is written again the language's way, and the value and its
   * problem go to the page when they changed. A date and time missing one part is settled only as the reader leaves
   * the picker or presses Enter, so moving from the date to the time says nothing yet.
   */
  const settle = (dText: string, tText: string, leaving: boolean) => {
    const r = readFields(dText, tText);
    if (r.date && r.date !== 'invalid') setDateText(showDate(r.date));
    if (r.time && r.time !== 'invalid') setTimeText(showTime(r.time));
    if (r.end && r.end !== 'invalid') setEndText(showDate(r.end));
    if (r.problem === 'incomplete' && !leaving) return;
    if (r.value === current && r.problem === lastProblem.current) return;
    lastProblem.current = r.problem;
    keep(r.value);
    setShown(`${r.value}|${locale}|${hourCycle}`);
    onChange?.(r.value, r.problem);
  };

  // The form's reset puts the starting value back in the fields, and tells the page when that changes its value.
  useFormReset(first, () => {
    const start = defaultValue ?? null;
    setDateText(showDate(datePartOf(start)));
    setTimeText(showTime(timePartOf(start)));
    setEndText(showDate(endPartOf(start)));
    lastProblem.current = undefined;
    setMissing(false);
    keep(start);
    setShown(`${start}|${locale}|${hourCycle}`);
    if (start !== current) onChange?.(start, undefined);
  });

  // ---- the calendar: a floating panel under the date field, or a small modal in a narrow space ----

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(defaultOpen && hasDate);
  const [narrow, setNarrow] = useState(false);
  const [opened, setOpened] = useState(0);
  const floating = (open && !narrow) || preview;

  const openCalendar = () => {
    if (!hasDate || disabled || readOnly) return;
    setNarrow(root.current ? isNarrow(root.current) : false);
    setOpened((n) => n + 1);
    setPreview(false);
    setOpen(true);
  };

  // Focus goes back to the button once the calendar has closed: while the modal is open, the rest of the page is inert.
  const refocus = useRef(false);
  const closeCalendar = (focusTrigger: boolean) => {
    refocus.current = focusTrigger;
    setOpen(false);
    setPreview(false);
  };
  useEffect(() => {
    if (open || !refocus.current) return;
    refocus.current = false;
    trigger.current?.focus();
  }, [open]);

  // Opened, the keyboard focus goes to the chosen day, or today, in the calendar.
  useEffect(() => {
    if (!open) return;
    const where = narrow ? sheet.current : panel.current;
    where?.querySelector<HTMLElement>('.smbk-calendar__day[tabindex="0"]')?.focus();
  }, [open, narrow, opened]);

  // The floating calendar is a layer (dismiss.ts): a press anywhere outside the picker closes it without moving focus,
  // and Escape closes it and focuses the button (when it was opened, not shown open from the start), and stops there,
  // so a dialog around the picker stays open; both only while it is the top layer. The modal closes on its own.
  const dismiss = useDismiss({ open: floating, root, onClose: (back) => closeCalendar(back && open) });

  const { side } = useFloating({ target: dateWell, layer, panel, open: floating, align: 'start', listHeight: false });

  const pick = (iso: string) => {
    const d = readIsoDate(iso) ?? null;
    const text = showDate(d);
    setDateText(text);
    settle(text, timeText, false);
    closeCalendar(true);
  };

  // A range is picked as its second end is: both fields are written and settled at once.
  const pickRange = (picked: DateRange) => {
    const from = showDate(readIsoDate(picked.start) ?? null);
    const to = showDate(readIsoDate(picked.end) ?? null);
    setDateText(from);
    setEndText(to);
    settle(from, to, false);
    closeCalendar(true);
  };

  const calendarDate = (() => {
    const d = hasDate ? readTypedDate(dateText, locale) : null;
    return d && d !== 'invalid' ? d.toString() : null;
  })();

  // The range the fields hold, for the calendar to show, when both read as days in order.
  const calendarRange = ((): DateRange | null => {
    if (!range) return null;
    const a = readTypedDate(dateText, locale);
    const b = readTypedDate(endText, locale);
    return a && b && a !== 'invalid' && b !== 'invalid' && b.compare(a) >= 0 ? { start: a.toString(), end: b.toString() } : null;
  })();

  // ---- keys and focus ----

  // Tab and Shift+Tab go round the open calendar's buttons and its focused day, as in a dialog.
  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !open) return;
    const stops = [...(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]') ?? [])];
    if (stops.length === 0) return;
    const at = stops.indexOf(document.activeElement as HTMLElement);
    const next = e.shiftKey ? (at <= 0 ? stops.length - 1 : at - 1) : at === stops.length - 1 ? 0 : at + 1;
    e.preventDefault();
    stops[next]?.focus();
  };

  const onFieldKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Enter settles at once, so a form sent by the same key carries the value.
    if (e.key === 'Enter') {
      flushSync(() => settle(dateText, secondText, true));
    } else if (e.key === 'ArrowDown' && e.altKey && hasDate) {
      e.preventDefault();
      settle(dateText, secondText, false);
      openCalendar();
    }
  };

  const leaving = (e: FocusEvent) => !(e.relatedTarget instanceof Node && root.current?.contains(e.relatedTarget));

  const onFieldFocus = () => {
    if (preview) setPreview(false);
  };

  // ---- drawing ----

  const describedBy = ariaDescribedby;
  // In a date and time picker, or a range, each field is named by the picker's name and its own: "Meeting starts Date".
  const nameFor = (ownId: string, word: string) =>
    both ? { 'aria-label': word, 'aria-labelledby': ariaLabelledby ? `${ariaLabelledby} ${ownId}` : undefined } : { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby };
  const fieldProps = {
    className: input.part('control'),
    disabled,
    readOnly,
    'aria-required': required || undefined,
    'aria-invalid': flagged || undefined,
    'aria-describedby': describedBy,
    autoCorrect: 'off',
    spellCheck: false,
    onKeyDown: onFieldKeyDown,
    onFocus: onFieldFocus,
  } as const;
  const classes = cx(datePicker({ type, error: flagged }), className);
  const calendar = range ? (
    <Calendar
      key={opened}
      selection="range"
      value={calendarRange}
      onChange={pickRange}
      min={min}
      max={max}
      isDateUnavailable={isDateUnavailable}
      firstDayOfWeek={firstDayOfWeek}
      aria-label={ariaLabelledby ? undefined : (ariaLabel ?? chooseLabel)}
      aria-labelledby={ariaLabelledby}
    />
  ) : (
    <Calendar
      key={opened}
      value={calendarDate}
      onChange={pick}
      min={min}
      max={max}
      isDateUnavailable={isDateUnavailable}
      firstDayOfWeek={firstDayOfWeek}
      aria-label={ariaLabelledby ? undefined : (ariaLabel ?? chooseLabel)}
      aria-labelledby={ariaLabelledby}
    />
  );

  return (
    <div
      ref={root}
      className={classes}
      role={both ? 'group' : undefined}
      aria-label={both ? ariaLabel : undefined}
      aria-labelledby={both ? ariaLabelledby : undefined}
      {...mergeProps({ onKeyDown: dismiss.onKeyDown }, rest)}
    >
      <div className={datePicker.part('controls')}>
        {hasDate && (
          <InputWell
            ref={dateWell}
            className={`${datePicker.part('input')} ${datePicker.part('input')}--date`}
            error={flagged}
            nameCheck="DatePicker"
            trailingAction={
              !readOnly && (
                <Button
                  ref={trigger}
                  tone="ghost"
                  size="sm"
                  icon-only
                  icon="CalendarBlank"
                  aria-label={chooseLabel}
                  aria-haspopup="dialog"
                  aria-expanded={open || preview}
                  aria-controls={popupId}
                  disabled={disabled}
                  className={datePicker.part('trigger')}
                  onClick={() => (open || preview ? closeCalendar(false) : openCalendar())}
                />
              )
            }
          >
            <input
              {...fieldProps}
              {...nameFor(dateId, range ? startLabel : dateLabel)}
              ref={first}
              id={dateId}
              type="text"
              value={dateText}
              placeholder={placeholder}
              autoComplete={autoComplete ?? 'off'}
              onChange={(e) => setDateText(e.target.value)}
              onBlur={(e) => settle(e.target.value, secondText, leaving(e))}
            />
          </InputWell>
        )}
        {range && (
          <>
            {/* The dash between a range's two days, as a range is written; the fields' names say which is which. */}
            <Icon name="Minus" className={datePicker.part('to')} />
            <InputWell className={`${datePicker.part('input')} ${datePicker.part('input')}--date ${datePicker.part('input')}--end`} error={flagged}>
              <input
                {...fieldProps}
                {...nameFor(endId, endLabel)}
                ref={second}
                id={endId}
                type="text"
                value={endText}
                autoComplete="off"
                onChange={(e) => setEndText(e.target.value)}
                onBlur={(e) => settle(dateText, e.target.value, leaving(e))}
              />
            </InputWell>
          </>
        )}
        {hasTime && (
          // The name check looks at the first field only: the time field's when the picker has no date.
          <InputWell className={`${datePicker.part('input')} ${datePicker.part('input')}--time`} error={flagged} nameCheck={hasDate ? undefined : 'DatePicker'}>
            <input
              {...fieldProps}
              {...nameFor(timeId, timeLabel)}
              ref={both ? second : first}
              id={timeId}
              type="text"
              value={timeText}
              placeholder={both ? undefined : placeholder}
              autoComplete={both ? 'off' : (autoComplete ?? 'off')}
              onChange={(e) => setTimeText(e.target.value)}
              onBlur={(e) => settle(dateText, e.target.value, leaving(e))}
            />
          </InputWell>
        )}
      </div>
      {hasDate && (
        <div ref={layer} className={popover.part('layer')}>
          <div
            ref={panel}
            id={popupId}
            role="dialog"
            aria-modal={open ? true : undefined}
            aria-label={chooseLabel}
            className={`${popover()} ${datePicker.part('popup')}`}
            hidden={!floating}
            data-side={side ?? undefined}
            onKeyDown={onPanelKeyDown}
          >
            {!narrow && calendar}
          </div>
        </div>
      )}
      {hasDate && open && narrow && (
        <Modal size="sm" open title={chooseLabel} onOpenChange={() => closeCalendar(true)}>
          <div ref={sheet}>{calendar}</div>
        </Modal>
      )}
      {name &&
        (range ? (
          // A range sends its first day and then its last under the one name.
          (current?.split('/') ?? ['', '']).map((day, i) => <input key={i} type="hidden" name={name} form={form} value={day} disabled={disabled} />)
        ) : (
          <input type="hidden" name={name} form={form} value={current ?? ''} disabled={disabled} />
        ))}
      {/* What `required` checks: the value as a text input, hidden from view and from screen readers and sending
          nothing, since a hidden input is never checked. When the browser finds it empty on sending, the first empty
          field takes focus and every field the error look instead of the browser's own message. */}
      {required && !readOnly && (
        <input
          className="smbk-visually-hidden"
          aria-hidden="true"
          tabIndex={-1}
          form={form}
          value={current ?? ''}
          required
          disabled={disabled}
          autoComplete="off"
          onChange={() => undefined}
          onFocus={() => first.current?.focus()}
          onInvalid={(e) => {
            e.preventDefault();
            setMissing(true);
            if (!isFirstInvalid(e.currentTarget)) return;
            (both && first.current?.value && !second.current?.value ? second : first).current?.focus();
          }}
        />
      )}
    </div>
  );
}

/**
 * Date and time picker: a date, a time, or both, typed the reader's own way, with a button that opens a small
 * calendar for the date. Each field is the input's well; the calendar button is a small ghost icon button in the date
 * field, named "Choose date"; the calendar opens in the popover's panel under the date field, or in a small modal when
 * the space is narrow.
 *
 * Typing always works: the date is read in the order the reader's language writes it, whatever separates the day,
 * the month and the year, and the time with or without the language's words for before and after noon. When the
 * reader leaves a field or presses Enter, what they typed is settled and written again the language's way. The value
 * that leaves the picker is one form whatever the language (an ISO date, a 24-hour time, or both joined by T), in
 * onChange and in a hidden input for forms; what cannot be read is reported with its problem, never guessed.
 *
 * The calendar is a dialog: it opens with the button or Alt+Down in the date field, with the keyboard focus on the
 * chosen day or today; Tab goes round its buttons and the focused day; Escape closes it and puts the focus back on
 * the button, as picking a day does. A press outside closes it. Dates and times are written in the Gregorian calendar.
 */
export function DatePicker(given: DatePickerProps) {
  const { locale, ...props } = useFieldControl(given);
  const reader = useLocale().locale;
  return (
    <I18nProvider locale={gregorianLocale(locale ?? reader)}>
      <PickerFields {...props} />
    </I18nProvider>
  );
}
readsField(DatePicker);
